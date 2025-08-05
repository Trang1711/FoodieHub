const express = require('express');
const router = express.Router();
const { 
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  deleteOrder,
  getOrderDetail
} = require('../controllers/adminOrderController');
const auth = require('../middleware/auth');

// Middleware kiểm tra admin (có thể mở rộng sau)
const isAdmin = (req, res, next) => {
  // Tạm thời cho phép tất cả user truy cập
  // Sau này có thể kiểm tra role trong database
  next();
};

// Lấy tất cả đơn hàng với filter và pagination
router.get('/orders', auth, isAdmin, getAllOrders);

// Lấy thống kê đơn hàng
router.get('/orders/stats', auth, isAdmin, getOrderStats);

// Lấy chi tiết đơn hàng
router.get('/orders/:orderId', auth, isAdmin, getOrderDetail);

// Cập nhật trạng thái đơn hàng
router.put('/orders/:orderId/status', auth, isAdmin, updateOrderStatus);

// Xóa đơn hàng
router.delete('/orders/:orderId', auth, isAdmin, deleteOrder);

module.exports = router; 