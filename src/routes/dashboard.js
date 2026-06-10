/** Routing untuk endpoint dashboard (/api/dashboard) */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'analyst']), dashboardController.getDashboardStats);

module.exports = router;
