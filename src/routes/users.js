const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

// a) Endpoint hanya untuk ADMIN
router.get('/admin', authMiddleware, checkRole(['admin']), userController.getAllUsers);

// b) Endpoint untuk ADMIN dan ANALIS
router.get('/analis', authMiddleware, checkRole(['admin', 'analis']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Akses untuk admin dan analis'
  });
});

// c) Endpoint untuk semua user login
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Akses untuk semua user login'
  });
});

// d) Endpoint untuk mengubah role (Khusus Admin)
router.put(
  '/:id/role',
  authMiddleware,
  checkRole(['admin']),
  userController.updateUserRole
);

// e) Endpoint untuk delete user (Khusus Admin)
router.delete(
  '/:id',
  authMiddleware,
  checkRole(['admin']),
  userController.deleteUser
);

module.exports = router;
