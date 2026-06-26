/** Routing untuk endpoint transaksi (/api/transactions) */
const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', authMiddleware, getTransactions);
router.post('/', roleMiddleware(['admin', 'user']), createTransaction);
router.put('/:id', roleMiddleware(['admin', 'analyst']), updateTransaction);
router.delete('/:id', roleMiddleware(['admin']), deleteTransaction);

module.exports = router;
