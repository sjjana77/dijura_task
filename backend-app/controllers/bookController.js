// Assuming you have a Book model  
const Book = require('../models/Book');
const Transaction = require('../models/Transaction'); // Import Transaction model
const User = require('../models/user_model'); // Import User model

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate({
      path: 'transactionId',
      select: 'userId dueDate transactionType',
      populate: {
        path: 'userId',
        select: 'username'
      }
    })
      .exec();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  const { title, author, available, user_id, due_date } = req.body;
  const book = new Book({
    title,
    author,
    available: available ?? true // Default to true if not provided
  });

  try {
    const newBook = await book.save();
    // If userId is provided, create a transaction
    if (user_id) {
      // Check if user exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create new transaction
      const transaction = new Transaction({
        user_id,
        bookId: newBook._id,
        due_date,
        transactionType: 'borrowed'
      });

      const newTransaction = await transaction.save();
      console.log(newTransaction);
      // Update the book with the transaction ID
      newBook.transactionId = newTransaction._id;
      await newBook.save();
    }
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = req.body.title;
    book.author = req.body.author;
    book.available = req.body.available;
    // Update other properties as needed  
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};