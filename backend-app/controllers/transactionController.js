// Assuming you have a Transaction model  
const Transaction = require('../models/Transaction');  

exports.getAllTransactions = async (req, res) => {  
  try {  
    const transactions = await Transaction.find();  
    res.json(transactions);  
  } catch (error) {  
    res.status(500).json({ message: error.message });  
  }  
};  

exports.getTransactionById = async (req, res) => {  
  try {  
    const transaction = await Transaction.findById(req.params.id);  
    if (!transaction) {  
      return res.status(404).json({ message: 'Transaction not found' });  
    }  
    res.json(transaction);  
  } catch (error) {  
    res.status(500).json({ message: error.message });  
  }  
};  

exports.createTransaction = async (req, res) => {  
  const transaction = new Transaction({  
    type: req.body.type,  
    amount: req.body.amount,  
    date: req.body.date,  
    // Add more properties as needed  
  });  

  try {  
    const newTransaction = await transaction.save();  
    res.status(201).json(newTransaction);  
  } catch (error) {  
    res.status(400).json({ message: error.message });  
  }  
};  

exports.updateTransaction = async (req, res) => {  
  try {  
    const transaction = await Transaction.findById(req.params.id);  
    if (!transaction) {  
      return res.status(404).json({ message: 'Transaction not found' });  
    }  

    transaction.type = req.body.type;  
    transaction.amount = req.body.amount;  
    transaction.date = req.body.date;  
    // Update other properties as needed  
    const updatedTransaction = await transaction.save();  
    res.json(updatedTransaction);  
  } catch (error) {  
    res.status(400).json({ message: error.message });  
  }  
};  

exports.deleteTransaction = async (req, res) => {  
  try {  
    const transaction = await Transaction.findById(req.params.id);  
    if (!transaction) {  
      return res.status(404).json({ message: 'Transaction not found' });  
    }  
    await transaction.remove();  
    res.json({ message: 'Transaction deleted' });  
  } catch (error) {  
    res.status(500).json({ message: error.message });  
  }  
};