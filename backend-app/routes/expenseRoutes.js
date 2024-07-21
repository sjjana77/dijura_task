const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/:id', expenseController.getExpense);

router.get('/', expenseController.getExpense);

router.post('/', expenseController.insert_update_expense);

router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
