const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });
  
const { connectDB } = require('./database_sqlite');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const foodRoutes = require('./routes/foodRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');

// Import function khởi tạo users và foods
const { initDefaultUsers } = require('./init_default_users');
const { initFoods } = require('./init_foods');
  
const app = express();
  
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
  
// Kết nối database và khởi tạo users, foods
connectDB()
  .then(() => {
    console.log('✅ Kết nối database thành công!');
    // Khởi tạo users mặc định
    return initDefaultUsers();
  })
  .then(() => {
    console.log('✅ Khởi tạo users hoàn tất!');
    // Khởi tạo foods mặc định
    return initFoods();
  })
  .then(() => {
    console.log('✅ Khởi tạo foods hoàn tất!');
  })
  .catch((err) => {
    console.error('❌ Lỗi khởi tạo:', err);
  });
  
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', foodRoutes);
app.use('/api/admin', adminOrderRoutes);
  
// Health check endpoint
app.get('/api/health', (req, res) => {r
  res.json({ 
    status: 'OK', 
    message: 'Server đang hoạt động',
    timestamp: new Date().toISOString()
  });
});
  
const PORT = process.env.PORT || 5000;
  
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`🍽️ Foods API: http://localhost:${PORT}/api/foods`);
}); 