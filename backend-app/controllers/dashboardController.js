const Expenses = require('../models/expense_model');

async function income_mode(req, res) {
  // console.log(req.body);
  try {
    const [year, month] = req.body.month.split("-").map(Number);

    // console.log(month, year);
    let matchCondition = [
      { $eq: [{ $year: "$date" }, year] },
      { $eq: [{ $month: "$date" }, month + 1] }
    ];
    if (req.body.source !== "All") {
      matchCondition.push({ $eq: ["$source", req.body.source] });
    }
    matchCondition.push({ $eq: ["$transaction_type", "income"] });

    const transactions = await Expenses.aggregate([
      {
        $match: {
          $expr: {
            $and: matchCondition
          }
        }
      },
      {
        $group: {
          _id: "$mode",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          mode: "$_id",
          totalAmount: 1
        }
      }
    ]);

    // console.log(transactions);
    const result = {};
    transactions.forEach((transaction) => {
      result[transaction.mode] = transaction.totalAmount;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error occurred in income_mode:", error);
    res.status(500).json({ error: error.message });
  }
}

async function expense_mode(req, res) {
  // console.log(req.body);
  try {
    const [year, month] = req.body.month.split("-").map(Number);

    // console.log(month, year);
    let matchCondition = [
      { $eq: [{ $year: "$date" }, year] },
      { $eq: [{ $month: "$date" }, month + 1] }
    ];
    if (req.body.source !== "All") {
      matchCondition.push({ $eq: ["$source", req.body.source] });
    }
    matchCondition.push({ $eq: ["$transaction_type", "expense"] });

    const transactions = await Expenses.aggregate([
      {
        $match: {
          $expr: {
            $and: matchCondition
          }
        }
      },
      {
        $group: {
          _id: "$mode",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          mode: "$_id",
          totalAmount: 1
        }
      }
    ]);

    // console.log(transactions);
    const result = {};
    transactions.forEach((transaction) => {
      result[transaction.mode] = transaction.totalAmount;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error occurred in income_mode:", error);
    res.status(500).json({ error: error.message });
  }
}

async function expense_category(req, res) {
  try {
    const [year, month] = req.body.month.split("-").map(Number);

    let matchCondition = [
      { $expr: { $eq: [{ $year: "$date" }, year] } },
      { $expr: { $eq: [{ $month: "$date" }, month + 1] } }
    ];
    if (req.body.source !== "All") {
      matchCondition.push({ $expr: { $eq: ["$source", req.body.source] } });
    }
    matchCondition.push({ $expr: { $eq: ["$transaction_type", "expense"] } });

    const transactions = await Expenses.aggregate([
      {
        $match: {
          $and: matchCondition
        }
      },
      {
        $project: {
          _id: 0,
          message: 1,
          amount: 1
        }
      }
    ]);

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error occurred in expense_category:", error);
    res.status(500).json({ error: error.message });
  }
}

async function income_category(req, res) {
  try {
    const [year, month] = req.body.month.split("-").map(Number);

    let matchCondition = [
      { $expr: { $eq: [{ $year: "$date" }, year] } },
      { $expr: { $eq: [{ $month: "$date" }, month + 1] } }
    ];
    if (req.body.source !== "All") {
      matchCondition.push({ $expr: { $eq: ["$source", req.body.source] } });
    }
    matchCondition.push({ $expr: { $eq: ["$transaction_type", "income"] } });

    const transactions = await Expenses.aggregate([
      {
        $match: {
          $and: matchCondition
        }
      },
      {
        $project: {
          _id: 0,
          message: 1,
          amount: 1
        }
      }
    ]);

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error occurred in expense_category:", error);
    res.status(500).json({ error: error.message });
  }
}


async function get_months(req, res) {
  try {
    const distinctMonths = await Expenses.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                    { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                    { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                    { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                    { case: { $eq: ["$_id.month", 5] }, then: "May" },
                    { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                    { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                    { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                    { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                    { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                    { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                    { case: { $eq: ["$_id.month", 12] }, then: "Dec" }
                  ],
                  default: ""
                }
              },
              " ",
              { $toString: "$_id.year" }
            ]
          },
          value: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: { $subtract: ["$_id.month", 1] } } // Subtract 1 to match 0-based index for months
            ]
          }
        }
      },
      {
        $sort: { "month": 1 }
      }
    ]);

    res.status(200).json(distinctMonths);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  income_mode,
  get_months,
  expense_mode,
  expense_category,
  income_category
};
