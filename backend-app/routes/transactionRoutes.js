const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionsByUserId,
  getTransactionsByBookIdAndBorrowed,
  handleToggleTransactionType
} = require('../controllers/transactionController');

// Route for creating a new transaction
router.post('/create', createTransaction);

// Route for getting all transactions
router.get('/', getTransactions); //unwanted

// Route for getting a transaction by ID
router.get('/:id', getTransactionById); //unwanted

// Route for getting transactions by user ID
router.get('/user/:userId', getTransactionsByUserId);

// Route for getting transactions by book ID and borrowed status
router.get('/bookId/:bookId/transactionType/:transactionType', getTransactionsByBookIdAndBorrowed);

// Route for toggling the transaction type
router.put('/toggle/:transactionId', handleToggleTransactionType);

module.exports = router;
