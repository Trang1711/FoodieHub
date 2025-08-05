const bcrypt = require('bcryptjs');
const { getConnection } = require('./database_sqlite');

async function initDefaultUsers() {
  try {
    const db = getConnection();
    
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', async (err, result) => {
        if (err) {
          console.error('❌ Lỗi kiểm tra users:', err);
          reject(err);
          return;
        }
        
        if (result.count > 0) {
          console.log('✅ Database đã có users!');
          resolve();
          return;
        }
        
        console.log('🔄 Tạo users mặc định...');
        
        const users = [
          { email: 'tranglam17115@gmail.com', password: '123456', full_name: 'Đỗ Lâm Trang', phone: '0987540604', address: 'Vạn Phúc- Hà Đông' },
          { email: 'tranglam1711@gmail.com', password: '123456', full_name: 'Đỗ Lý Hoàng Nam', phone: '0987540605', address: 'Nam khùng' },
          { email: 'user1@example.com', password: '123456', full_name: 'Trần Thị Anh', phone: '0901234567', address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM' },
          { email: 'user2@example.com', password: '123456', full_name: 'Lê Văn Bình', phone: '0912345678', address: '789 Đường Lê Lợi, Quận 3, TP.HCM' },
          { email: 'user3@example.com', password: '123456', full_name: 'Phạm Thị Cẩm', phone: '0923456789', address: '321 Đường Võ Văn Tần, Quận 3, TP.HCM' },
          { email: 'test@example.com', password: '123456', full_name: 'Nguyễn Văn Test', phone: '0123456789', address: '123 Đường ABC, Quận 1, TP.HCM' }
        ];

        let createdCount = 0;
        for (const user of users) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          
          db.run(
            'INSERT INTO users (email, password, full_name, phone, address) VALUES (?, ?, ?, ?, ?)',
            [user.email, hashedPassword, user.full_name, user.phone, user.address],
            function(err) {
              if (err) {
                console.error(`❌ Lỗi tạo user ${user.email}:`, err);
              } else {
                console.log(`✅ User ${user.email} đã được tạo!`);
              }
              
              createdCount++;
              if (createdCount === users.length) {
                console.log('✅ Tất cả users mặc định đã được tạo!');
                resolve();
              }
            }
          );
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    throw error;
  }
}

module.exports = { initDefaultUsers }; 