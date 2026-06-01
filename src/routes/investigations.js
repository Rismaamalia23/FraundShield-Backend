const express = require('express');
const router = express.Router();
const investigationController = require('../controllers/investigationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'analyst']), investigationController.getInvestigations);
router.post('/', roleMiddleware(['admin', 'analyst']), investigationController.createInvestigation);
router.put('/:id', roleMiddleware(['admin', 'analyst']), investigationController.updateInvestigation);
router.delete('/:id', roleMiddleware(['admin', 'analyst']), investigationController.deleteInvestigation);

module.exports = router;
