const { getConnection } = require('./database_sqlite');

async function initSideDishes() {
  try {
    const db = getConnection();
    
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM side_dishes', async (err, result) => {
        if (err) {
          console.error('❌ Lỗi kiểm tra side_dishes:', err);
          reject(err);
          return;
        }
        
        if (result.count > 0) {
          console.log('✅ Database đã có side_dishes!');
          resolve();
          return;
        }
        
        console.log('🔄 Tạo side_dishes mặc định...');
        
        const sideDishes = [
          // Gà Nướng Lá Chanh
          {
            main_dish_id: 11, // ID của Gà Nướng Lá Chanh
            name: 'Cơm trắng',
            price: 10000,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200'
          },
          {
            main_dish_id: 11,
            name: 'Rau sống',
            price: 5000,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200'
          },
          {
            main_dish_id: 11,
            name: 'Nước mắm pha',
            price: 3000,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200'
          },
          
          // Burger Bò Phô Mai
          {
            main_dish_id: 12, // ID của Burger Bò Phô Mai
            name: 'Khoai tây chiên',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200'
          },
          {
            main_dish_id: 12,
            name: 'Nước ngọt',
            price: 12000,
            image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=200'
          },
          {
            main_dish_id: 12,
            name: 'Salad rau',
            price: 8000,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200'
          },
          
          // Phở Bò
          {
            main_dish_id: 1,
            name: 'Bánh phở thêm',
            price: 8000,
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200'
          },
          {
            main_dish_id: 1,
            name: 'Rau thơm',
            price: 3000,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200'
          },
          
          // Bún Chả
          {
            main_dish_id: 2,
            name: 'Bún thêm',
            price: 5000,
            image: 'https://images.unsplash.com/photo-1604908176781-c1e6f8c5f9a2?w=200'
          },
          {
            main_dish_id: 2,
            name: 'Nước mắm pha',
            price: 2000,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200'
          },
          
          // Cơm Tấm
          {
            main_dish_id: 3,
            name: 'Canh rau',
            price: 8000,
            image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=200'
          },
          {
            main_dish_id: 3,
            name: 'Nước mắm',
            price: 2000,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200'
          }
        ];

        let createdCount = 0;
        for (const sideDish of sideDishes) {
          db.run(
            'INSERT INTO side_dishes (main_dish_id, name, price, image) VALUES (?, ?, ?, ?)',
            [sideDish.main_dish_id, sideDish.name, sideDish.price, sideDish.image],
            function(err) {
              if (err) {
                console.error(`❌ Lỗi tạo side dish ${sideDish.name}:`, err);
              } else {
                console.log(`✅ Side dish ${sideDish.name} đã được tạo!`);
              }
              
              createdCount++;
              if (createdCount === sideDishes.length) {
                console.log('✅ Tất cả side dishes mặc định đã được tạo!');
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

module.exports = { initSideDishes }; 