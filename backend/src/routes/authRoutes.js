const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  logoutAll,
  refreshAccessToken,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getCurrentUser
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.post('/logout-all', protect, logoutAll);
router.get('/me', protect, getCurrentUser);

module.exports = router;
