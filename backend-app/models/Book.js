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
  transactionId: {  // Added field for transaction ID
    type: mongoose.Schema.Types.ObjectId,  // Assuming transactionId is an ObjectId
    ref: 'Transaction',  // Reference to the Transaction model (change as per your actual model name)
    default: null  // Default value is null if no transaction ID is assigned
  }
});  

module.exports = mongoose.model('Book', bookSchema);
