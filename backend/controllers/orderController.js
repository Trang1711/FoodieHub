const { getConnection } = require('../database_sqlite');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const db = getConnection();
    const userId = req.user.userId;
    const {
      items,
      delivery_address,
      delivery_phone,
      delivery_name,
      payment_method,
      notes,
      total_amount
    } = req.body;

    // Tạo order number
    const orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Bắt đầu transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Tạo đơn hàng
      db.run(`
        INSERT INTO orders (user_id, order_number, total_amount, status, delivery_address, delivery_phone, delivery_name, payment_method, notes, created_at, updated_at)
        VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `, [userId, orderNumber, total_amount, delivery_address, delivery_phone, delivery_name, payment_method, notes], function(err) {
        if (err) {
          console.error('❌ Lỗi tạo đơn hàng:', err);
          db.run('ROLLBACK');
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        const orderId = this.lastID;

        // Thêm các items vào đơn hàng
        let itemsProcessed = 0;
        for (const item of items) {
          db.run(`
            INSERT INTO order_items (order_id, food_name, quantity, price, total_price)
            VALUES (?, ?, ?, ?, ?)
          `, [orderId, item.food_name, item.quantity, item.price, item.total_price], function(err) {
            if (err) {
              console.error('❌ Lỗi thêm item:', err);
              db.run('ROLLBACK');
              return res.status(500).json({
                success: false,
                message: 'Lỗi server, vui lòng thử lại sau'
              });
            }

            itemsProcessed++;
            if (itemsProcessed === items.length) {
              // Tất cả items đã được thêm thành công
              db.run('COMMIT');
              res.status(201).json({
                success: true,
                message: 'Tạo đơn hàng thành công!',
                data: {
                  order_id: orderId,
                  order_number: orderNumber
                }
              });
            }
          });
        }

        // Nếu không có items
        if (items.length === 0) {
          db.run('COMMIT');
          res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công!',
            data: {
              order_id: orderId,
              order_number: orderNumber
            }
          });
        }
      });
    });

  } catch (error) {
    console.error('❌ Lỗi tạo đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Lấy lịch sử đơn hàng của user
const getOrderHistory = async (req, res) => {
  try {
    const db = getConnection();
    const userId = req.user.userId;

    db.all(
      `SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.delivery_address,
        o.delivery_phone,
        o.delivery_name,
        o.payment_method,
        o.notes,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [userId],
      (err, orders) => {
        if (err) {
          console.error('❌ Lỗi lấy lịch sử đơn hàng:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        res.json({
          success: true,
          data: orders || []
        });
      }
    );

  } catch (error) {
    console.error('❌ Lỗi lấy lịch sử đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Lấy chi tiết đơn hàng
const getOrderDetail = async (req, res) => {
  try {
    const db = getConnection();
    const { orderId } = req.params;
    const userId = req.user.userId;

    // Lấy thông tin đơn hàng
    db.get(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, userId],
      (err, order) => {
        if (err) {
          console.error('❌ Lỗi lấy chi tiết đơn hàng:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy đơn hàng'
          });
        }

        // Lấy danh sách items của đơn hàng
        db.all(
          `SELECT * FROM order_items WHERE order_id = ?`,
          [orderId],
          (err, items) => {
            if (err) {
              console.error('❌ Lỗi lấy items đơn hàng:', err);
              return res.status(500).json({
                success: false,
                message: 'Lỗi server, vui lòng thử lại sau'
              });
            }

            res.json({
              success: true,
              data: {
                order: order,
                items: items || []
              }
            });
          }
        );
      }
    );

  } catch (error) {
    console.error('❌ Lỗi lấy chi tiết đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const db = getConnection();
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    // Kiểm tra đơn hàng có tồn tại và thuộc về user không
    db.get(
      `SELECT id FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, userId],
      (err, order) => {
        if (err) {
          console.error('❌ Lỗi kiểm tra đơn hàng:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy đơn hàng'
          });
        }

        // Cập nhật trạng thái
        db.run(
          `UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?`,
          [status, orderId],
          function(err) {
            if (err) {
              console.error('❌ Lỗi cập nhật trạng thái:', err);
              return res.status(500).json({
                success: false,
                message: 'Lỗi server, vui lòng thử lại sau'
              });
            }

            res.json({
              success: true,
              message: 'Cập nhật trạng thái đơn hàng thành công!'
            });
          }
        );
      }
    );

  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
  try {
    const db = getConnection();
    const { orderId } = req.params;
    const userId = req.user.userId;

    // Kiểm tra đơn hàng có thể hủy không
    db.get(
      `SELECT id, status FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, userId],
      (err, order) => {
        if (err) {
          console.error('❌ Lỗi kiểm tra đơn hàng:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy đơn hàng'
          });
        }

        // Chỉ cho phép hủy đơn hàng có trạng thái pending hoặc confirmed
        if (!['pending', 'confirmed'].includes(order.status)) {
          return res.status(400).json({
            success: false,
            message: 'Không thể hủy đơn hàng ở trạng thái này'
          });
        }

        // Cập nhật trạng thái thành cancelled
        db.run(
          `UPDATE orders SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?`,
          [orderId],
          function(err) {
            if (err) {
              console.error('❌ Lỗi hủy đơn hàng:', err);
              return res.status(500).json({
                success: false,
                message: 'Lỗi server, vui lòng thử lại sau'
              });
            }

            res.json({
              success: true,
              message: 'Hủy đơn hàng thành công!'
            });
          }
        );
      }
    );

  } catch (error) {
    console.error('❌ Lỗi hủy đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Lấy tất cả đơn hàng (cho admin)
const getAllOrders = async (req, res) => {
  try {
    const db = getConnection();
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE o.status = ?';
      params.push(status);
    }

    // Lấy danh sách đơn hàng
    const query = `
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, parseInt(limit), offset];

    db.all(query, queryParams, (err, orders) => {
      if (err) {
        console.error('❌ Lỗi lấy tất cả đơn hàng:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      // Đếm tổng số đơn hàng
      const countQuery = `
        SELECT COUNT(*) as total
        FROM orders o
        ${whereClause}
      `;

      db.get(countQuery, params, (err, countResult) => {
        if (err) {
          console.error('❌ Lỗi đếm đơn hàng:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        const total = countResult.total;

        res.json({
          success: true,
          data: {
            orders: orders || [],
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total,
              totalPages: Math.ceil(total / limit)
            }
          }
        });
      });
    });

  } catch (error) {
    console.error('❌ Lỗi lấy tất cả đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

module.exports = {
  createOrder,
  getOrderHistory,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
}; 