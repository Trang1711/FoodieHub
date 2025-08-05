const { getConnection } = require('./database_sqlite');

async function createTestOrders() {
  try {
    const db = getConnection();
    
    const orders = [
      {
        user_id: 1,
        order_number: 'ORD001',
        total_amount: 150000,
        status: 'completed',
        delivery_address: '123 Đường ABC, Quận 1, TP.HCM',
        delivery_phone: '0123456789',
        delivery_name: 'Nguyễn Văn Test',
        payment_method: 'cash',
        notes: 'Giao hàng trước 12h trưa',
        items: [
          { food_name: 'Phở Bò', quantity: 2, price: 50000, total_price: 100000 },
          { food_name: 'Cà phê sữa', quantity: 1, price: 25000, total_price: 25000 },
          { food_name: 'Bánh mì thịt', quantity: 1, price: 25000, total_price: 25000 }
        ]
      },
      {
        user_id: 1,
        order_number: 'ORD002',
        total_amount: 200000,
        status: 'delivering',
        delivery_address: '456 Đường XYZ, Quận 2, TP.HCM',
        delivery_phone: '0123456789',
        delivery_name: 'Nguyễn Văn Test',
        payment_method: 'momo',
        notes: 'Giao hàng sau 6h tối',
        items: [
          { food_name: 'Cơm tấm sườn', quantity: 2, price: 45000, total_price: 90000 },
          { food_name: 'Canh chua', quantity: 1, price: 30000, total_price: 30000 },
          { food_name: 'Nước mía', quantity: 2, price: 15000, total_price: 30000 },
          { food_name: 'Chè ba màu', quantity: 1, price: 25000, total_price: 25000 },
          { food_name: 'Bánh flan', quantity: 1, price: 25000, total_price: 25000 }
        ]
      },
      {
        user_id: 1,
        order_number: 'ORD003',
        total_amount: 75000,
        status: 'pending',
        delivery_address: '789 Đường DEF, Quận 3, TP.HCM',
        delivery_phone: '0123456789',
        delivery_name: 'Nguyễn Văn Test',
        payment_method: 'cash',
        notes: 'Không cay',
        items: [
          { food_name: 'Bún bò Huế', quantity: 1, price: 45000, total_price: 45000 },
          { food_name: 'Bánh bèo', quantity: 1, price: 30000, total_price: 30000 }
        ]
      },
      {
        user_id: 2,
        order_number: 'ORD004',
        total_amount: 120000,
        status: 'cancelled',
        delivery_address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        delivery_phone: '0901234567',
        delivery_name: 'Trần Thị Anh',
        payment_method: 'cash',
        notes: 'Đã hủy do không có thời gian',
        items: [
          { food_name: 'Bánh xèo', quantity: 2, price: 35000, total_price: 70000 },
          { food_name: 'Gỏi cuốn', quantity: 1, price: 25000, total_price: 25000 },
          { food_name: 'Nước dừa', quantity: 1, price: 25000, total_price: 25000 }
        ]
      }
    ];

    for (const order of orders) {
      // Thêm đơn hàng
      db.run(
        `INSERT INTO orders (
          user_id, order_number, total_amount, status, 
          delivery_address, delivery_phone, delivery_name, 
          payment_method, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.user_id,
          order.order_number,
          order.total_amount,
          order.status,
          order.delivery_address,
          order.delivery_phone,
          order.delivery_name,
          order.payment_method,
          order.notes
        ],
        function(err) {
          if (err) {
            console.error(`❌ Lỗi tạo đơn hàng ${order.order_number}:`, err);
          } else {
            const orderId = this.lastID;
            console.log(`✅ Đơn hàng ${order.order_number} đã được tạo với ID: ${orderId}`);
            
            // Thêm items cho đơn hàng
            for (const item of order.items) {
              db.run(
                `INSERT INTO order_items (
                  order_id, food_name, quantity, price, total_price
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                  orderId,
                  item.food_name,
                  item.quantity,
                  item.price,
                  item.total_price
                ],
                function(err) {
                  if (err) {
                    console.error(`❌ Lỗi thêm item ${item.food_name}:`, err);
                  } else {
                    console.log(`  ✅ Item: ${item.food_name} x${item.quantity}`);
                  }
                }
              );
            }
            console.log('---');
          }
        }
      );
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

createTestOrders(); 