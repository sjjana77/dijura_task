// Assuming you have a Book model  
const Book = require('../models/Book');  

exports.getAllBooks = async (req, res) => {  
  try {  
    const books = await Book.find();  
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
  const book = new Book({  
    title: req.body.title,  
    author: req.body.author,  
    // Add more properties as needed  
  });  

  try {  
    const newBook = await book.save();  
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