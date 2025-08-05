const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'food_delivery.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Đang tạo bảng side_dishes...');

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
    console.error('❌ Lỗi tạo bảng:', err);
  } else {
    console.log('✅ Bảng side_dishes đã được tạo!');
    
    // Thêm dữ liệu mẫu
    const sideDishes = [
      // Gà Nướng Lá Chanh (ID: 11)
      { main_dish_id: 11, name: 'Cơm trắng', price: 10000, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200' },
      { main_dish_id: 11, name: 'Rau sống', price: 5000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200' },
      { main_dish_id: 11, name: 'Nước mắm pha', price: 3000, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200' },
      
      // Burger Bò Phô Mai (ID: 12)
      { main_dish_id: 12, name: 'Khoai tây chiên', price: 15000, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200' },
      { main_dish_id: 12, name: 'Nước ngọt', price: 12000, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=200' },
      { main_dish_id: 12, name: 'Salad rau', price: 8000, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200' },
      
      // Phở Bò (ID: 1)
      { main_dish_id: 1, name: 'Bánh phở thêm', price: 8000, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200' },
      { main_dish_id: 1, name: 'Rau thơm', price: 3000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200' },
      
      // Bún Chả (ID: 2)
      { main_dish_id: 2, name: 'Bún thêm', price: 5000, image: 'https://images.unsplash.com/photo-1604908176781-c1e6f8c5f9a2?w=200' },
      { main_dish_id: 2, name: 'Nước mắm pha', price: 2000, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200' },
      
      // Cơm Tấm (ID: 3)
      { main_dish_id: 3, name: 'Canh rau', price: 8000, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=200' },
      { main_dish_id: 3, name: 'Nước mắm', price: 2000, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200' }
    ];

    let inserted = 0;
    sideDishes.forEach((dish) => {
      db.run(
        'INSERT INTO side_dishes (main_dish_id, name, price, image) VALUES (?, ?, ?, ?)',
        [dish.main_dish_id, dish.name, dish.price, dish.image],
        function(err) {
          if (err) {
            console.error(`❌ Lỗi thêm ${dish.name}:`, err);
          } else {
            console.log(`✅ Đã thêm: ${dish.name}`);
          }
          inserted++;
          if (inserted === sideDishes.length) {
            console.log('✅ Hoàn thành tạo side dishes!');
            db.close();
          }
        }
      );
    });
  }
}); 