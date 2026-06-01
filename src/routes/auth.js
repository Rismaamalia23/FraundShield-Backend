const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint Register: POST /api/auth/register
router.post('/register', authController.register);

// Endpoint Login: POST /api/auth/login
router.post('/login', authController.login);

// Endpoint Profile: GET /api/auth/profile
router.get('/profile', authMiddleware, authController.profile);

// Lupa password - minta token
router.post('/forgot-password', authController.forgotPassword);

// Reset password pakai token
router.post('/reset-password', authController.resetPassword);

module.exports = router;
