const { connectDB, getConnection } = require('./database_sqlite');

async function checkUsers() {
  try {
    await connectDB();
    const db = getConnection();
    
    console.log('🔍 Kiểm tra users trong database...');
    
    db.all('SELECT id, email, full_name, created_at FROM users', (err, users) => {
      if (err) {
        console.error('❌ Lỗi:', err);
      } else {
        console.log(`✅ Tìm thấy ${users.length} users:`);
        users.forEach(user => {
          console.log(`👤 ID: ${user.id}, Email: ${user.email}, Tên: ${user.full_name}`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

checkUsers(); 