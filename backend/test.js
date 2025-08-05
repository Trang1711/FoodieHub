const axios = require('axios');

async function test() {
  try {
    console.log('🧪 Testing login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'tranglam17115@gmail.com',
      password: '123456'
    });
    
    console.log('✅ Login thành công!');
    console.log(`👤 Tên: ${response.data.data.user.full_name}`);
    
  } catch (error) {
    console.error('❌ Login thất bại!');
    if (error.response) {
      console.error('Message:', error.response.data.message);
    }
  }
}

test(); 