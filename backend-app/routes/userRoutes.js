// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Middleware to verify JWT token for get_users route
router.get('/get_users', verifyToken, isAdmin, userController.getUsers);

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
