const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('./database_sqlite');

async function testUpdateProfile() {
  try {
    const db = getConnection();
    
    // Tạo token test
    const token = jwt.sign(
      { userId: 1, email: 'test@example.com' },
      'food_delivery_secret_key_2024_very_secure',
      { expiresIn: '24h' }
    );

    console.log('🔑 Token test:', token);
    console.log('---');

    // Test cập nhật profile
    const updateData = {
      full_name: 'Nguyễn Văn Test Updated',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 2, TP.HCM'
    };

    console.log('📝 Dữ liệu cập nhật:', updateData);
    console.log('---');

    // Thực hiện cập nhật
    db.run(
      'UPDATE users SET full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [updateData.full_name, updateData.phone, updateData.address, 1],
      function(err) {
        if (err) {
          console.error('❌ Lỗi cập nhật:', err);
        } else {
          console.log('✅ Cập nhật thành công!');
          console.log('📊 Số dòng bị ảnh hưởng:', this.changes);
          
          // Kiểm tra kết quả
          db.get('SELECT * FROM users WHERE id = ?', [1], (err, user) => {
            if (err) {
              console.error('❌ Lỗi kiểm tra:', err);
            } else {
              console.log('📋 Thông tin sau cập nhật:');
              console.log('👤 Tên:', user.full_name);
              console.log('📱 SĐT:', user.phone);
              console.log('📍 Địa chỉ:', user.address);
              console.log('🕒 Cập nhật lúc:', user.updated_at);
            }
          });
        }
      }
    );
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

testUpdateProfile(); 