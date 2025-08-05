const { getConnection } = require('../database_sqlite');

// Lấy tất cả đơn hàng với filter và pagination
const getAllOrders = async (req, res) => {
  try {
    const db = getConnection();
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      startDate, 
      endDate,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];

    // Filter theo status
    if (status && status !== 'all') {
      whereConditions.push('o.status = ?');
      params.push(status);
    }

    // Filter theo search (tìm theo order_number, customer_name, phone)
    if (search) {
      whereConditions.push(`(o.order_number LIKE ? OR u.full_name LIKE ? OR o.delivery_phone LIKE ?)`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter theo date range
    if (startDate) {
      whereConditions.push('DATE(o.created_at) >= ?');
      params.push(startDate);
    }
    if (endDate) {
      whereConditions.push('DATE(o.created_at) <= ?');
      params.push(endDate);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query chính
    const query = `
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        COUNT(oi.id) as item_count,
        SUM(oi.total_price) as total_items_price
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, parseInt(limit), offset];

    db.all(query, queryParams, (err, orders) => {
      if (err) {
        console.error('❌ Lỗi lấy đơn hàng:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      // Đếm tổng số đơn hàng
      const countQuery = `
        SELECT COUNT(DISTINCT o.id) as total
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
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
            },
            filters: {
              status,
              search,
              startDate,
              endDate,
              sortBy,
              sortOrder
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

// Lấy thống kê đơn hàng
const getOrderStats = async (req, res) => {
  try {
    const db = getConnection();
    const { period = 'today' } = req.query;

    let dateFilter = '';
    let params = [];

    switch (period) {
      case 'today':
        dateFilter = "WHERE DATE(o.created_at) = DATE('now')";
        break;
      case 'week':
        dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-7 days')";
        break;
      case 'month':
        dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-30 days')";
        break;
      case 'year':
        dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-365 days')";
        break;
      default:
        dateFilter = "WHERE DATE(o.created_at) = DATE('now')";
    }

    // Thống kê theo trạng thái
    const statusStatsQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as total_revenue
      FROM orders o
      ${dateFilter}
      GROUP BY status
    `;

    // Thống kê tổng quan
    const overviewQuery = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        COUNT(DISTINCT user_id) as unique_customers
      FROM orders o
      ${dateFilter}
    `;

    // Thống kê theo ngày (7 ngày gần nhất)
    const dailyStatsQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders_count,
        SUM(total_amount) as daily_revenue
      FROM orders o
      WHERE DATE(created_at) >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    db.all(statusStatsQuery, params, (err, statusStats) => {
      if (err) {
        console.error('❌ Lỗi thống kê trạng thái:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      db.get(overviewQuery, params, (err, overview) => {
        if (err) {
          console.error('❌ Lỗi thống kê tổng quan:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        db.all(dailyStatsQuery, [], (err, dailyStats) => {
          if (err) {
            console.error('❌ Lỗi thống kê theo ngày:', err);
            return res.status(500).json({
              success: false,
              message: 'Lỗi server, vui lòng thử lại sau'
            });
          }

          res.json({
            success: true,
            data: {
              period,
              overview: overview || {},
              statusStats: statusStats || [],
              dailyStats: dailyStats || []
            }
          });
        });
      });
    });

  } catch (error) {
    console.error('❌ Lỗi lấy thống kê đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const db = getConnection();
    const { orderId } = req.params;
    const { status, notes } = req.body;

    // Kiểm tra đơn hàng có tồn tại không
    db.get(
      `SELECT id, status FROM orders WHERE id = ?`,
      [orderId],
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
        const updateQuery = notes 
          ? `UPDATE orders SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?`
          : `UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?`;
        
        const updateParams = notes ? [status, notes, orderId] : [status, orderId];

        db.run(updateQuery, updateParams, function(err) {
          if (err) {
            console.error('❌ Lỗi cập nhật trạng thái:', err);
            return res.status(500).json({
              success: false,
              message: 'Lỗi server, vui lòng thử lại sau'
            });
          }

          res.json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công!',
            data: {
              order_id: orderId,
              new_status: status,
              previous_status: order.status
            }
          });
        });
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

// Xóa đơn hàng (Admin)
const deleteOrder = async (req, res) => {
  try {
    const db = getConnection();
    const { orderId } = req.params;

    // Kiểm tra đơn hàng có tồn tại không
    db.get(
      `SELECT id, status FROM orders WHERE id = ?`,
      [orderId],
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

        // Chỉ cho phép xóa đơn hàng đã hủy
        if (order.status !== 'cancelled') {
          return res.status(400).json({
            success: false,
            message: 'Chỉ có thể xóa đơn hàng đã hủy'
          });
        }

        // Bắt đầu transaction
        db.serialize(() => {
          db.run('BEGIN TRANSACTION');

          // Xóa order_items trước
          db.run(
            `DELETE FROM order_items WHERE order_id = ?`,
            [orderId],
            function(err) {
              if (err) {
                console.error('❌ Lỗi xóa order_items:', err);
                db.run('ROLLBACK');
                return res.status(500).json({
                  success: false,
                  message: 'Lỗi server, vui lòng thử lại sau'
                });
              }

              // Xóa order
              db.run(
                `DELETE FROM orders WHERE id = ?`,
                [orderId],
                function(err) {
                  if (err) {
                    console.error('❌ Lỗi xóa order:', err);
                    db.run('ROLLBACK');
                    return res.status(500).json({
                      success: false,
                      message: 'Lỗi server, vui lòng thử lại sau'
                    });
                  }

                  db.run('COMMIT');
                  res.json({
                    success: true,
                    message: 'Xóa đơn hàng thành công!'
                  });
                }
              );
            }
          );
        });
      }
    );

  } catch (error) {
    console.error('❌ Lỗi xóa đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Lấy chi tiết đơn hàng (Admin)
const getOrderDetail = async (req, res) => {
  try {
    const db = getConnection();
    const { orderId } = req.params;

    // Lấy thông tin đơn hàng
    db.get(
      `SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?`,
      [orderId],
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

module.exports = {
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  deleteOrder,
  getOrderDetail
}; 