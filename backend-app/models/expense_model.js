const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    message: {
        type: String
    },
    transaction_type: {
        type: String,
        enum: ['', 'income', 'expense']
    },
    mode: {
        type: String,
        enum: ['', 'upi', 'cash', 'bank', 'cheque']
    },
    source: {
        type: String,
        enum: ['', 'home', 'office']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const Expenses = mongoose.model('Expenses', expenseSchema, 'Expenses');

module.exports = Expenses;
