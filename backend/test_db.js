const sql = require('mssql');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  server: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function testConnection() {
  try {
    console.log('🔍 Đang test kết nối database...');
    console.log('Config:', {
      server: dbConfig.server,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });

    const pool = await sql.connect(dbConfig);
    console.log('✅ Kết nối thành công!');

    // Test query
    const result = await pool.request().query('SELECT COUNT(*) as total FROM users');
    console.log('📊 Số lượng users trong database:', result.recordset[0].total);

    // Test thêm user
    const testUser = {
      email: 'test@example.com',
      password: 'hashed_password',
      full_name: 'Test User',
      phone: '0123456789',
      address: 'Test Address'
    };

    console.log('🧪 Đang test thêm user...');
    const insertResult = await pool.request()
      .input('email', testUser.email)
      .input('password', testUser.password)
      .input('full_name', testUser.full_name)
      .input('phone', testUser.phone)
      .input('address', testUser.address)
      .query(`
        INSERT INTO users (email, password, full_name, phone, address)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name
        VALUES (@email, @password, @full_name, @phone, @address)
      `);

    console.log('✅ Test thêm user thành công:', insertResult.recordset[0]);

    await pool.close();
    console.log('🔒 Đã đóng kết nối');

  } catch (error) {
    console.error('❌ Lỗi test database:', error);
  }
}

testConnection(); 