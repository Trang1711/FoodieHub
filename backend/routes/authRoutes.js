const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController_sqlite');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Đăng ký
router.post('/register', validateRegister, handleValidationErrors, register);

// Đăng nhập
router.post('/login', validateLogin, handleValidationErrors, login);

// Lấy thông tin profile (cần xác thực)
router.get('/profile', auth, getProfile);

// Cập nhật thông tin profile (cần xác thực)
router.put('/profile', auth, updateProfile);

// Quên mật khẩu
router.post('/forgot-password', forgotPassword);

// Reset mật khẩu
router.post('/reset-password', resetPassword);

module.exports = router; 