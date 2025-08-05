const { getConnection } = require('../database_sqlite');

// Báo cáo doanh thu theo thời gian
const getRevenueReport = async (req, res) => {
  try {
    const db = getConnection();
    const { period = 'month', startDate, endDate } = req.query;

    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE DATE(o.created_at) BETWEEN ? AND ?";
      params = [startDate, endDate];
    } else {
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
        case 'quarter':
          dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-90 days')";
          break;
        case 'year':
          dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-365 days')";
          break;
        default:
          dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-30 days')";
      }
    }

    // Thống kê doanh thu theo ngày
    const dailyRevenueQuery = `
      SELECT 
        DATE(o.created_at) as date,
        COUNT(*) as orders_count,
        SUM(o.total_amount) as daily_revenue,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      ${dateFilter}
      GROUP BY DATE(o.created_at)
      ORDER BY date DESC
    `;

    // Thống kê theo trạng thái
    const statusRevenueQuery = `
      SELECT 
        o.status,
        COUNT(*) as orders_count,
        SUM(o.total_amount) as total_revenue,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      ${dateFilter}
      GROUP BY o.status
    `;

    // Top khách hàng
    const topCustomersQuery = `
      SELECT 
        u.full_name,
        u.email,
        COUNT(o.id) as orders_count,
        SUM(o.total_amount) as total_spent,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${dateFilter}
      GROUP BY o.user_id, u.full_name, u.email
      ORDER BY total_spent DESC
      LIMIT 10
    `;

    // Thống kê tổng quan
    const overviewQuery = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        COUNT(DISTINCT user_id) as unique_customers,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders o
      ${dateFilter}
    `;

    db.all(dailyRevenueQuery, params, (err, dailyRevenue) => {
      if (err) {
        console.error('❌ Lỗi thống kê doanh thu theo ngày:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      db.all(statusRevenueQuery, params, (err, statusRevenue) => {
        if (err) {
          console.error('❌ Lỗi thống kê doanh thu theo trạng thái:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        db.all(topCustomersQuery, params, (err, topCustomers) => {
          if (err) {
            console.error('❌ Lỗi thống kê top khách hàng:', err);
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

            res.json({
              success: true,
              data: {
                period,
                startDate,
                endDate,
                overview: overview || {},
                dailyRevenue: dailyRevenue || [],
                statusRevenue: statusRevenue || [],
                topCustomers: topCustomers || []
              }
            });
          });
        });
      });
    });

  } catch (error) {
    console.error('❌ Lỗi báo cáo doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Báo cáo sản phẩm bán chạy
const getProductReport = async (req, res) => {
  try {
    const db = getConnection();
    const { period = 'month', limit = 10 } = req.query;

    let dateFilter = '';
    let params = [];

    switch (period) {
      case 'today':
        dateFilter = "AND DATE(o.created_at) = DATE('now')";
        break;
      case 'week':
        dateFilter = "AND DATE(o.created_at) >= DATE('now', '-7 days')";
        break;
      case 'month':
        dateFilter = "AND DATE(o.created_at) >= DATE('now', '-30 days')";
        break;
      case 'quarter':
        dateFilter = "AND DATE(o.created_at) >= DATE('now', '-90 days')";
        break;
      case 'year':
        dateFilter = "AND DATE(o.created_at) >= DATE('now', '-365 days')";
        break;
      default:
        dateFilter = "AND DATE(o.created_at) >= DATE('now', '-30 days')";
    }

    // Top sản phẩm bán chạy
    const topProductsQuery = `
      SELECT 
        oi.food_name,
        COUNT(*) as times_ordered,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue,
        AVG(oi.price) as avg_price
      FROM order_items oi
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled' ${dateFilter}
      GROUP BY oi.food_name
      ORDER BY total_quantity DESC
      LIMIT ?
    `;

    // Thống kê theo danh mục
    const categoryStatsQuery = `
      SELECT 
        oi.food_name,
        COUNT(DISTINCT o.id) as unique_orders,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled' ${dateFilter}
      GROUP BY oi.food_name
      ORDER BY total_revenue DESC
    `;

    db.all(topProductsQuery, [parseInt(limit)], (err, topProducts) => {
      if (err) {
        console.error('❌ Lỗi thống kê top sản phẩm:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      db.all(categoryStatsQuery, [], (err, categoryStats) => {
        if (err) {
          console.error('❌ Lỗi thống kê danh mục:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        res.json({
          success: true,
          data: {
            period,
            limit,
            topProducts: topProducts || [],
            categoryStats: categoryStats || []
          }
        });
      });
    });

  } catch (error) {
    console.error('❌ Lỗi báo cáo sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Báo cáo khách hàng
const getCustomerReport = async (req, res) => {
  try {
    const db = getConnection();
    const { period = 'month', limit = 20 } = req.query;

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
      case 'quarter':
        dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-90 days')";
        break;
      case 'year':
        dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-365 days')";
        break;
      default:
        dateFilter = "WHERE DATE(o.created_at) >= DATE('now', '-30 days')";
    }

    // Top khách hàng chi tiêu cao nhất
    const topSpendersQuery = `
      SELECT 
        u.full_name,
        u.email,
        u.phone,
        COUNT(o.id) as orders_count,
        SUM(o.total_amount) as total_spent,
        AVG(o.total_amount) as avg_order_value,
        MIN(o.created_at) as first_order,
        MAX(o.created_at) as last_order
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${dateFilter}
      GROUP BY o.user_id, u.full_name, u.email, u.phone
      ORDER BY total_spent DESC
      LIMIT ?
    `;

    // Khách hàng mới
    const newCustomersQuery = `
      SELECT 
        u.full_name,
        u.email,
        u.phone,
        COUNT(o.id) as orders_count,
        SUM(o.total_amount) as total_spent,
        MIN(o.created_at) as first_order
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${dateFilter}
      GROUP BY o.user_id, u.full_name, u.email, u.phone
      HAVING COUNT(o.id) = 1
      ORDER BY first_order DESC
      LIMIT ?
    `;

    // Thống kê khách hàng
    const customerStatsQuery = `
      SELECT 
        COUNT(DISTINCT o.user_id) as total_customers,
        COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.user_id END) as active_customers,
        AVG(customer_stats.avg_order_value) as overall_avg_order_value,
        SUM(customer_stats.total_spent) as total_revenue
      FROM orders o
      LEFT JOIN (
        SELECT 
          user_id,
          AVG(total_amount) as avg_order_value,
          SUM(total_amount) as total_spent
        FROM orders
        GROUP BY user_id
      ) customer_stats ON o.user_id = customer_stats.user_id
      ${dateFilter}
    `;

    db.all(topSpendersQuery, [parseInt(limit)], (err, topSpenders) => {
      if (err) {
        console.error('❌ Lỗi thống kê top khách hàng:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      db.all(newCustomersQuery, [parseInt(limit)], (err, newCustomers) => {
        if (err) {
          console.error('❌ Lỗi thống kê khách hàng mới:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        db.get(customerStatsQuery, [], (err, customerStats) => {
          if (err) {
            console.error('❌ Lỗi thống kê khách hàng:', err);
            return res.status(500).json({
              success: false,
              message: 'Lỗi server, vui lòng thử lại sau'
            });
          }

          res.json({
            success: true,
            data: {
              period,
              limit,
              customerStats: customerStats || {},
              topSpenders: topSpenders || [],
              newCustomers: newCustomers || []
            }
          });
        });
      });
    });

  } catch (error) {
    console.error('❌ Lỗi báo cáo khách hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

module.exports = {
  getRevenueReport,
  getProductReport,
  getCustomerReport
}; 