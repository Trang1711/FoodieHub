const fetch = require('node-fetch');

async function testSideDishesAPI() {
  try {
    console.log('🧪 Testing side dishes API...');
    
    const response = await fetch('http://localhost:5000/api/foods/11/side-dishes');
    const data = await response.json();
    
    console.log('✅ Side dishes API response:', data);
    
    if (data.success && data.data) {
      console.log(`📊 Tìm thấy ${data.data.length} món ăn kèm:`);
      data.data.forEach(dish => {
        console.log(`🍽️ ${dish.name} - ${dish.price.toLocaleString()}đ`);
      });
    } else {
      console.log('❌ Không có dữ liệu side dishes');
    }
    
  } catch (error) {
    console.error('❌ Lỗi test side dishes API:', error);
  }
}

testSideDishesAPI(); 