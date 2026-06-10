/** Routing untuk endpoint kategori transaksi (/api/categories) */
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'analyst', 'user']), categoryController.getCategories);
router.post('/', roleMiddleware(['admin']), categoryController.createCategory);
router.put('/:id', roleMiddleware(['admin']), categoryController.updateCategory);
router.delete('/:id', roleMiddleware(['admin']), categoryController.deleteCategory);

module.exports = router;
