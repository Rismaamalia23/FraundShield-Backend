const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Endpoint untuk mendapatkan riwayat aktivitas user (hanya admin & analyst)
router.get('/', roleMiddleware(['admin', 'analyst']), activityLogController.getActivityLogs);

module.exports = router;
