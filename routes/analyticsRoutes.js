const express = require('express');
const router = express.Router();
const { getAnalyticsSummary, getMoneyHealthScore } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getAnalyticsSummary);
router.get('/money-health-score', protect, getMoneyHealthScore);

module.exports = router;
