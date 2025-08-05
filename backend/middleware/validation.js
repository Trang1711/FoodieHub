const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('full_name')
    .notEmpty()
    .withMessage('Họ tên không được để trống'),
  body('phone')
    .optional()
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
}; 