/** Routing untuk endpoint aturan deteksi fraud (/api/rules) */
const express = require('express');
const router = express.Router();
const fraudRuleController = require('../controllers/fraudRuleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin']), fraudRuleController.getFraudRules);
router.post('/', roleMiddleware(['admin']), fraudRuleController.createFraudRule);
router.put('/:id', roleMiddleware(['admin']), fraudRuleController.updateFraudRule);
router.delete('/:id', roleMiddleware(['admin']), fraudRuleController.deleteFraudRule);

module.exports = router;
