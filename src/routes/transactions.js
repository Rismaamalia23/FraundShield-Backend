/** Routing untuk endpoint transaksi (/api/transactions) */
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'analyst', 'user']), transactionController.getTransactions);
router.post('/', roleMiddleware(['admin', 'user']), transactionController.createTransaction);
router.put('/:id', roleMiddleware(['admin', 'analyst']), transactionController.updateTransaction);
router.delete('/:id', roleMiddleware(['admin']), transactionController.deleteTransaction);

module.exports = router;
