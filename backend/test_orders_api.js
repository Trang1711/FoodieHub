const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test data
const testUser = {
  email: 'test@example.com',
  password: '123456'
};

const testOrder = {
  items: [
    {
      food_name: 'Phở Bò',
      quantity: 2,
      price: 50000,
      total_price: 100000
    },
    {
      food_name: 'Cơm Tấm',
      quantity: 1,
      price: 75000,
      total_price: 75000
    }
  ],
  delivery_address: '123 Đường ABC, Quận 1, TP.HCM',
  delivery_phone: '0901234567',
  delivery_name: 'Nguyễn Văn Test',
  payment_method: 'cash',
  notes: 'Giao hàng trước 12h',
  total_amount: 175000
};

// Hàm đăng nhập để lấy token
const login = async () => {
  try {
    console.log('🔐 Đang đăng nhập...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, testUser);
    
    if (response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Đăng nhập thành công!');
      return true;
    } else {
      console.log('❌ Đăng nhập thất bại:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error.response?.data || error.message);
    return false;
  }
};

// Test tạo đơn hàng mới
const testCreateOrder = async () => {
  try {
    console.log('\n📦 Test tạo đơn hàng mới...');
    const response = await axios.post(`${API_BASE_URL}/orders/create`, testOrder, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Tạo đơn hàng thành công!');
      console.log('📋 Order ID:', response.data.data.order_id);
      console.log('📋 Order Number:', response.data.data.order_number);
      return response.data.data.order_id;
    } else {
      console.log('❌ Tạo đơn hàng thất bại:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Lỗi tạo đơn hàng:', error.response?.data || error.message);
    return null;
  }
};

// Test lấy lịch sử đơn hàng
const testGetOrderHistory = async () => {
  try {
    console.log('\n📋 Test lấy lịch sử đơn hàng...');
    const response = await axios.get(`${API_BASE_URL}/orders/history`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Lấy lịch sử đơn hàng thành công!');
      console.log('📊 Số đơn hàng:', response.data.data.length);
      response.data.data.forEach((order, index) => {
        console.log(`  ${index + 1}. ${order.order_number} - ${order.status} - ${order.total_amount}đ`);
      });
      return response.data.data;
    } else {
      console.log('❌ Lấy lịch sử đơn hàng thất bại:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('❌ Lỗi lấy lịch sử đơn hàng:', error.response?.data || error.message);
    return [];
  }
};

// Test lấy chi tiết đơn hàng
const testGetOrderDetail = async (orderId) => {
  try {
    console.log(`\n📄 Test lấy chi tiết đơn hàng ID: ${orderId}...`);
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Lấy chi tiết đơn hàng thành công!');
      const order = response.data.data.order;
      const items = response.data.data.items;
      
      console.log('📋 Thông tin đơn hàng:');
      console.log(`  - Order Number: ${order.order_number}`);
      console.log(`  - Status: ${order.status}`);
      console.log(`  - Total Amount: ${order.total_amount}đ`);
      console.log(`  - Delivery Address: ${order.delivery_address}`);
      console.log(`  - Items: ${items.length} món`);
      
      items.forEach((item, index) => {
        console.log(`    ${index + 1}. ${item.food_name} x${item.quantity} = ${item.total_price}đ`);
      });
      
      return response.data.data;
    } else {
      console.log('❌ Lấy chi tiết đơn hàng thất bại:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Lỗi lấy chi tiết đơn hàng:', error.response?.data || error.message);
    return null;
  }
};

// Test cập nhật trạng thái đơn hàng
const testUpdateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log(`\n🔄 Test cập nhật trạng thái đơn hàng thành: ${newStatus}...`);
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, {
      status: newStatus
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Cập nhật trạng thái đơn hàng thành công!');
      return true;
    } else {
      console.log('❌ Cập nhật trạng thái đơn hàng thất bại:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái đơn hàng:', error.response?.data || error.message);
    return false;
  }
};

// Test hủy đơn hàng
const testCancelOrder = async (orderId) => {
  try {
    console.log(`\n❌ Test hủy đơn hàng ID: ${orderId}...`);
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Hủy đơn hàng thành công!');
      return true;
    } else {
      console.log('❌ Hủy đơn hàng thất bại:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Lỗi hủy đơn hàng:', error.response?.data || error.message);
    return false;
  }
};

// Test lấy tất cả đơn hàng (admin)
const testGetAllOrders = async () => {
  try {
    console.log('\n👨‍💼 Test lấy tất cả đơn hàng (admin)...');
    const response = await axios.get(`${API_BASE_URL}/orders/admin/all`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Lấy tất cả đơn hàng thành công!');
      console.log('📊 Số đơn hàng:', response.data.data.orders.length);
      console.log('📊 Thông tin phân trang:', response.data.data.pagination);
      
      response.data.data.orders.forEach((order, index) => {
        console.log(`  ${index + 1}. ${order.order_number} - ${order.customer_name} - ${order.status} - ${order.total_amount}đ`);
      });
      
      return response.data.data;
    } else {
      console.log('❌ Lấy tất cả đơn hàng thất bại:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Lỗi lấy tất cả đơn hàng:', error.response?.data || error.message);
    return null;
  }
};

// Chạy tất cả tests
const runAllTests = async () => {
  console.log('🚀 Bắt đầu test API đơn hàng...\n');
  
  // Đăng nhập
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Không thể đăng nhập, dừng test');
    return;
  }
  
  // Test tạo đơn hàng
  const orderId = await testCreateOrder();
  
  // Test lấy lịch sử đơn hàng
  await testGetOrderHistory();
  
  // Test lấy chi tiết đơn hàng
  if (orderId) {
    await testGetOrderDetail(orderId);
    
    // Test cập nhật trạng thái
    await testUpdateOrderStatus(orderId, 'confirmed');
    
    // Test lấy chi tiết sau khi cập nhật
    await testGetOrderDetail(orderId);
    
    // Test hủy đơn hàng
    await testCancelOrder(orderId);
    
    // Test lấy chi tiết sau khi hủy
    await testGetOrderDetail(orderId);
  }
  
  // Test lấy tất cả đơn hàng
  await testGetAllOrders();
  
  console.log('\n🎉 Hoàn tất test API đơn hàng!');
};

// Chạy test nếu được gọi trực tiếp
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  login,
  testCreateOrder,
  testGetOrderHistory,
  testGetOrderDetail,
  testUpdateOrderStatus,
  testCancelOrder,
  testGetAllOrders,
  runAllTests
}; 