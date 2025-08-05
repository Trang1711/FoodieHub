const express = require('express');
const router = express.Router();
const { 
  createOrder,
  getOrderHistory, 
  getOrderDetail, 
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Tạo đơn hàng mới (cần xác thực)
router.post('/create', auth, createOrder);

// Lấy lịch sử đơn hàng (cần xác thực)
router.get('/history', auth, getOrderHistory);

// Lấy chi tiết đơn hàng (cần xác thực)
router.get('/:orderId', auth, getOrderDetail);

// Cập nhật trạng thái đơn hàng (cần xác thực)
router.put('/:orderId/status', auth, updateOrderStatus);

// Hủy đơn hàng (cần xác thực)
router.put('/:orderId/cancel', auth, cancelOrder);

// Lấy tất cả đơn hàng (cho admin - cần xác thực)
router.get('/admin/all', auth, getAllOrders);

module.exports = router; 