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
    instanceName: 'SQLEXPRESS', // Thêm instance name nếu cần
  },
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ Kết nối SQL Server thành công!');
    
    // Tạo bảng users nếu chưa tồn tại
    await createTables();
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    // Tạo bảng users
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        avatar VARCHAR(500),
        address TEXT,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);
    
    console.log('✅ Bảng users đã được tạo!');
  } catch (error) {
    console.error('❌ Lỗi tạo bảng:', error);
  }
};

const getConnection = () => pool;

module.exports = { connectDB, getConnection }; 