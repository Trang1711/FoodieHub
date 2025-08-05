const { getConnection } = require('./database_sqlite');

async function createSideDishesTable() {
  try {
    const db = getConnection();
    
    return new Promise((resolve, reject) => {
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
          console.log('✅ Bảng side_dishes đã được tạo!');
          resolve();
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    throw error;
  }
}

createSideDishesTable()
  .then(() => {
    console.log('✅ Hoàn thành tạo bảng side_dishes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }); 