const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/user_model');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  const { userId, bookId, dueDate, transactionType } = req.body;

  // Validate transactionType
  if (!['borrowed', 'returned'].includes(transactionType)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }

  try {
    // Check if user and book exist
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      return res.status(404).json({ error: 'User or Book not found' });
    }

    // Create new transaction
    const transaction = new Transaction({
      userId,
      bookId,
      dueDate,
      transactionType
    });

    await transaction.save();

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name') // Populate user details
      .populate('bookId', 'title author'); // Populate book details

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get a transaction by ID
exports.getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id)
      .populate('userId', 'name') // Populate user details
      .populate('bookId', 'title author'); // Populate book details

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get transactions by user ID
exports.getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId })
      .populate('bookId', 'title author'); // Populate book details

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'No transactions found for this user' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
