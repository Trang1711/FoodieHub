const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../database');

// Đăng ký tài khoản
const register = async (req, res) => {
  try {
    const { email, password, full_name, phone, address } = req.body;
    console.log('📝 Bắt đầu đăng ký:', { email, full_name });
    
    const pool = getConnection();
    if (!pool) {
      console.error('❌ Không có kết nối database');
      return res.status(500).json({
        success: false,
        message: 'Lỗi kết nối database'
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await pool.request()
      .input('email', email)
      .query('SELECT * FROM users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Thêm user mới
    console.log('💾 Đang thêm user vào database...');
    const result = await pool.request()
      .input('email', email)
      .input('password', hashedPassword)
      .input('full_name', full_name)
      .input('phone', phone || null)
      .input('address', address || null)
      .query(`
        INSERT INTO users (email, password, full_name, phone, address)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.created_at
        VALUES (@email, @password, @full_name, @phone, @address)
      `);

    const newUser = result.recordset[0];
    console.log('✅ User đã được thêm:', newUser);

    // Tạo JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          created_at: newUser.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = getConnection();

    // Tìm user theo email
    const result = await pool.request()
      .input('email', email)
      .query('SELECT * FROM users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const user = result.recordset[0];

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          avatar: user.avatar,
          address: user.address,
          created_at: user.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Lấy thông tin user hiện tại
const getProfile = async (req, res) => {
  try {
    const pool = getConnection();
    const result = await pool.request()
      .input('userId', req.user.userId)
      .query('SELECT id, email, full_name, phone, avatar, address, created_at FROM users WHERE id = @userId');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Lỗi lấy profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Cập nhật thông tin user
const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address } = req.body;
    const pool = getConnection();

    const result = await pool.request()
      .input('userId', req.user.userId)
      .input('full_name', full_name)
      .input('phone', phone)
      .input('address', address)
      .query(`
        UPDATE users 
        SET full_name = @full_name, phone = @phone, address = @address, updated_at = GETDATE()
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.phone, INSERTED.address
        WHERE id = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
}; 