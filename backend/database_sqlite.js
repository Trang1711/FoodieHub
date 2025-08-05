const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const connectDB = () => {
  return new Promise((resolve, reject) => {
    // Sử dụng food_delivery.db (có data) thay vì fooddelivery.db (trống)
    const dbPath = path.join(__dirname, 'food_delivery.db');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Lỗi kết nối SQLite:', err);
        reject(err);
      } else {
        console.log('✅ Kết nối SQLite thành công!');
      }
    });

    // Tạo bảng users nếu chưa tồn tại
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        address TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('❌ Lỗi tạo bảng users:', err);
        reject(err);
      } else {
        console.log('✅ Bảng users đã sẵn sàng!');
      }
    });

    // Tạo bảng foods nếu chưa tồn tại
    db.run(`
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image TEXT,
        category TEXT,
        rating DECIMAL(3,2) DEFAULT 0.0,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('❌ Lỗi tạo bảng foods:', err);
        reject(err);
      } else {
        console.log('✅ Bảng foods đã sẵn sàng!');
      }
    });

    // Tạo bảng orders nếu chưa tồn tại
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        order_number TEXT UNIQUE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        delivery_address TEXT,
        delivery_phone TEXT,
        delivery_name TEXT,
        payment_method TEXT DEFAULT 'cash',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `, (err) => {
      if (err) {
        console.error('❌ Lỗi tạo bảng orders:', err);
        reject(err);
      } else {
        console.log('✅ Bảng orders đã sẵn sàng!');
      }
    });

    // Tạo bảng order_items nếu chưa tồn tại
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        food_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id)
      )
    `, (err) => {
      if (err) {
        console.error('❌ Lỗi tạo bảng order_items:', err);
        reject(err);
      } else {
        console.log('✅ Bảng order_items đã sẵn sàng!');
      }
    });

    // Tạo bảng side_dishes nếu chưa tồn tại
    db.run(`
      CREATE TABLE IF NOT EXISTS side_dishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        main_dish_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        image TEXT,
        FOREIGN KEY (main_dish_id) REFERENCES foods (id)
      )
    `, (err) => {
      if (err) {
        console.error('❌ Lỗi tạo bảng side_dishes:', err);
        reject(err);
      } else {
        console.log('✅ Bảng side_dishes đã sẵn sàng!');
        console.log('✅ Database đã sẵn sàng!');
        resolve();
      }
    });
  });
};

const getConnection = () => {
  return db;
};

module.exports = { connectDB, getConnection }; 