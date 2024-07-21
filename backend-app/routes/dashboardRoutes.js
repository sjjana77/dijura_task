const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');


router.post('/income_mode', dashboardController.income_mode);
router.post('/expense_mode', dashboardController.expense_mode);
router.post('/get_months', dashboardController.get_months);
router.post('/expense_category', dashboardController.expense_category);
router.post('/income_category', dashboardController.income_category);


module.exports = router;
