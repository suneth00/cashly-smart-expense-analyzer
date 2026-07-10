const express = require('express');
const router = express.Router();
const { getTestMessage } = require('../controllers/testController');

// GET /api/test
router.get('/', getTestMessage);

module.exports = router;
