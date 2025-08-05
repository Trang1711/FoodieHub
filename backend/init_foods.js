const { getConnection } = require('./database_sqlite');

async function initFoods() {
  try {
    const db = getConnection();
    
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM foods', async (err, result) => {
        if (err) {
          console.error('❌ Lỗi kiểm tra foods:', err);
          reject(err);
          return;
        }
        
        if (result.count > 0) {
          console.log('✅ Database đã có foods!');
          resolve();
          return;
        }
        
        console.log('🔄 Tạo foods mặc định...');
        
        const foods = [
          {
            name: 'Phở Bò',
            description: 'Phở bò truyền thống với nước dùng đậm đà, bánh phở mềm dai',
            price: 45000,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            category: 'Món chính',
            rating: 4.5
          },
          {
            name: 'Bún Chả',
            description: 'Bún chả Hà Nội với thịt nướng thơm ngon, nước mắm pha chuẩn',
            price: 35000,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
            category: 'Món chính',
            rating: 4.3
          },
          {
            name: 'Cơm Tấm',
            description: 'Cơm tấm sườn nướng với sườn bì chả, trứng ốp la',
            price: 40000,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
            category: 'Món chính',
            rating: 4.2
          },
          {
            name: 'Bánh Mì Thịt',
            description: 'Bánh mì thịt nướng với pate, rau sống, sốt mayonnaise',
            price: 25000,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            category: 'Đồ ăn nhanh',
            rating: 4.0
          },
          {
            name: 'Gỏi Cuốn',
            description: 'Gỏi cuốn tôm thịt với bánh tráng, rau sống, nước mắm pha',
            price: 30000,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
            category: 'Khai vị',
            rating: 4.4
          },
          {
            name: 'Chè Ba Màu',
            description: 'Chè ba màu truyền thống với đậu xanh, bột báng, nước cốt dừa',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            category: 'Tráng miệng',
            rating: 4.1
          },
          {
            name: 'Cà Phê Sữa Đá',
            description: 'Cà phê sữa đá đậm đà, thơm ngon đặc trưng Việt Nam',
            price: 20000,
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
            category: 'Đồ uống',
            rating: 4.6
          },
          {
            name: 'Trà Sữa Trân Châu',
            description: 'Trà sữa trân châu đường đen với trân châu dai ngon',
            price: 35000,
            image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
            category: 'Đồ uống',
            rating: 4.3
          },
          {
            name: 'Bánh Xèo',
            description: 'Bánh xèo giòn với tôm thịt, rau sống, nước mắm pha',
            price: 40000,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            category: 'Món chính',
            rating: 4.2
          },
          {
            name: 'Lẩu Hải Sản',
            description: 'Lẩu hải sản tươi ngon với nước dùng đậm đà, rau tươi',
            price: 120000,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
            category: 'Món chính',
            rating: 4.7
          },
          {
            name: 'Gà Nướng Lá Chanh',
            description: 'Gà nướng lá chanh thơm ngon với da giòn, thịt mềm',
            price: 180000,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
            category: 'Món chính',
            rating: 4.5
          },
          {
            name: 'Burger Bò Phô Mai',
            description: 'Burger bò phô mai với thịt bò tươi, phô mai béo ngậy',
            price: 85000,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
            category: 'Đồ ăn nhanh',
            rating: 4.4
          },
          {
            name: 'Canh Chua Cá Lóc',
            description: 'Canh chua cá lóc với dứa, cà chua, đậu bắp, me chua',
            price: 80000,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
            category: 'Món canh',
            rating: 4.4
          }
        ];

        let createdCount = 0;
        for (const food of foods) {
          db.run(
            'INSERT INTO foods (name, description, price, image, category, rating) VALUES (?, ?, ?, ?, ?, ?)',
            [food.name, food.description, food.price, food.image, food.category, food.rating],
            function(err) {
              if (err) {
                console.error(`❌ Lỗi tạo food ${food.name}:`, err);
              } else {
                console.log(`✅ Food ${food.name} đã được tạo!`);
              }
              
              createdCount++;
              if (createdCount === foods.length) {
                console.log('✅ Tất cả foods mặc định đã được tạo!');
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

module.exports = { initFoods }; 