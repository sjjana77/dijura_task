const express = require('express');  
const router = express.Router();  
const bookController = require('../controllers/bookController');  
const { verifyToken, isAdmin } = require('../middleware/auth');

// Middleware to verify JWT token
router.use(verifyToken);

// Admin-only routes
router.post('/', isAdmin, bookController.createBook);
router.put('/:id', isAdmin, bookController.updateBook);
router.delete('/:id', isAdmin, bookController.deleteBook);

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

module.exports = router;