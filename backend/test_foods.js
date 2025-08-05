const axios = require('axios');

async function testFoods() {
  try {
    console.log('🧪 Testing foods API...');
    
    // Test lấy tất cả foods
    const response = await axios.get('http://localhost:5000/api/foods');
    console.log('✅ Foods API hoạt động!');
    console.log(`📊 Tìm thấy ${response.data.data.length} món ăn:`);
    
    response.data.data.forEach(food => {
      console.log(`🍽️ ${food.name} - ${food.price.toLocaleString()}đ - ⭐${food.rating}`);
    });
    
  } catch (error) {
    console.error('❌ Foods API thất bại!');
    if (error.response) {
      console.error('Message:', error.response.data.message);
    }
  }
}

testFoods(); 