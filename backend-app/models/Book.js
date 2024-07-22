const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  count: {  // Added field for count
    type: Number,
    default: 0  // Default value is 0 if no count is assigned
  }
});

module.exports = mongoose.model('Book', bookSchema);
