const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to Book model
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['borrowed', 'returned'],
    required: true
  },
  returnedDate: {
    type: Date, // Date when the book is returned
    default: null // Default value is null, as it will be set when the book is returned
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
