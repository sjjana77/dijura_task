const Expenses = require('../models/expense_model');
const Users = require('../models/user_model');

async function insert_update_expense(req, res) {
  try {
    const newTransaction = new Expenses(req.body);
    // console.log(req.body);
    if (req.body.hasOwnProperty('_id') && req.body['_id'] && req.body['_id'] != "") {
      //update
      const id = req.body['_id'];
      delete req.body['_id'];
      const newTransaction = await Expenses.findByIdAndUpdate(id, req.body, { new: true });
    }
    else {
      //insert
      await newTransaction.save();

    }
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// async function getExpense(req, res) {
//   try {
//     const transactions = await Expenses.find();
//     res.status(200).json(transactions);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

async function getExpense(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const from_date = req.query.fdate;
    const to_date = req.query.tdate;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let matchStage = {};
    if (from_date && from_date != "" && from_date != 'undefined' && to_date != 'undefined' && to_date && to_date != "") {
      matchStage.date = { $gte: new Date(from_date), $lte: new Date(to_date) };
    } else if (from_date != 'undefined') {
      matchStage.date = { $gte: new Date(from_date) };
    } else if (to_date != 'undefined') {
      matchStage.date = { $lte: new Date(to_date) };
    }

    const countPipeline = [
      { $match: matchStage },
      { $count: "totalDocuments" }
    ];

    const totalDocumentsResult = await Expenses.aggregate(countPipeline);
    const totalDocuments = totalDocumentsResult.length > 0 ? totalDocumentsResult[0].totalDocuments : 0;
    const totalPages = Math.ceil(totalDocuments / limit);

    const transactionsPipeline = [
      {
        $lookup: {
          from: 'Users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $addFields: {
          username: { $arrayElemAt: ['$userDetails.username', 0] }
        }
      },
      {
        $project: {
          userDetails: 0
        }
      },
      { $match: matchStage },
      { $skip: skip },
      { $limit: limit }
    ];

    const transactions = await Expenses.aggregate(transactionsPipeline);

    res.status(200).json({
      transactions,
      totalPages,
      currentPage: page,
      totalDocuments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}





async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    await Expenses.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  insert_update_expense,
  getExpense,
  deleteExpense
};
