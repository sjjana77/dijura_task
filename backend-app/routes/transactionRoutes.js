const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions, getTransactionById, getTransactionsByUserId } = require('../controllers/transactionController');

// Route for creating a new transaction
router.post('/transactions', createTransaction);

// Route for getting all transactions
router.get('/transactions', getTransactions);

// Route for getting a transaction by ID
router.get('/transactions/:id', getTransactionById);

// Route for getting transactions by user ID
router.get('/transactions/user/:userId', getTransactionsByUserId);

module.exports = router;
