const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getConnection } = require('../database_sqlite');

// Đăng ký tài khoản
const register = async (req, res) => {
  try {
    const { email, password, full_name, phone, address } = req.body;
    console.log('📝 Bắt đầu đăng ký:', { email, full_name });
    
    const db = getConnection();
    if (!db) {
      console.error('❌ Không có kết nối database');
      return res.status(500).json({
        success: false,
        message: 'Lỗi kết nối database'
      });
    }

    // Kiểm tra email đã tồn tại chưa
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('❌ Lỗi kiểm tra email:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      if (existingUser) {
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
      db.run(
        'INSERT INTO users (email, password, full_name, phone, address) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, full_name, phone || null, address || null],
        function(err) {
          if (err) {
            console.error('❌ Lỗi thêm user:', err);
            return res.status(500).json({
              success: false,
              message: 'Lỗi server, vui lòng thử lại sau'
            });
          }

          const newUserId = this.lastID;
          console.log('✅ User đã được thêm với ID:', newUserId);

          // Tạo JWT token
          const token = jwt.sign(
            { userId: newUserId, email: email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!',
            data: {
              user: {
                id: newUserId,
                email: email,
                full_name: full_name,
                created_at: new Date().toISOString()
              },
              token
            }
          });
        }
      );
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
    const db = getConnection();

    // Tìm user theo email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('❌ Lỗi tìm user:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

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
    const db = getConnection();
    
    db.get(
      'SELECT id, email, full_name, phone, avatar, address, created_at FROM users WHERE id = ?',
      [req.user.userId],
      (err, user) => {
        if (err) {
          console.error('❌ Lỗi lấy profile:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy user'
          });
        }

        res.json({
          success: true,
          data: user
        });
      }
    );

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
    const db = getConnection();

    db.run(
      'UPDATE users SET full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, phone, address, req.user.userId],
      function(err) {
        if (err) {
          console.error('❌ Lỗi cập nhật profile:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy user'
          });
        }

        res.json({
          success: true,
          message: 'Cập nhật thông tin thành công!'
        });
      }
    );

  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Quên mật khẩu - Gửi email reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const db = getConnection();

    // Kiểm tra email có tồn tại không
    db.get('SELECT id, email, full_name FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('❌ Lỗi kiểm tra email:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Email không tồn tại trong hệ thống'
        });
      }

      // Tạo token reset password (có thời hạn 1 giờ)
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Cấu hình email transporter (sử dụng Gmail)
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Email Gmail của bạn
          pass: process.env.EMAIL_PASS  // App password của Gmail
        }
      });

      // Nội dung email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Đặt lại mật khẩu - Food Delivery App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff6600;">Đặt lại mật khẩu</h2>
            <p>Xin chào <strong>${user.full_name || 'Người dùng'}</strong>,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Food Delivery App.</p>
            <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="exp://192.168.1.101:8081/--/reset-password?token=${resetToken}" 
                 style="background-color: #ff6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            <p><strong>Lưu ý:</strong></p>
            <ul>
              <li>Link này có hiệu lực trong 1 giờ</li>
              <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
              <li>Để bảo mật, vui lòng không chia sẻ link này với ai khác</li>
            </ul>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Email này được gửi tự động từ hệ thống Food Delivery App.<br>
              Vui lòng không trả lời email này.
            </p>
          </div>
        `
      };

      // Gửi email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ Lỗi gửi email:', error);
          return res.status(500).json({
            success: false,
            message: 'Không thể gửi email. Vui lòng thử lại sau.'
          });
        }

        console.log('✅ Email đã được gửi:', info.messageId);
        res.json({
          success: true,
          message: 'Email đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn!'
        });
      });
    });

  } catch (error) {
    console.error('Lỗi quên mật khẩu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
};

// Reset mật khẩu với token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getConnection();

    // Kiểm tra user có tồn tại không
    db.get('SELECT id FROM users WHERE id = ?', [decoded.userId], async (err, user) => {
      if (err) {
        console.error('❌ Lỗi kiểm tra user:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server, vui lòng thử lại sau'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Token không hợp lệ'
        });
      }

      // Mã hóa mật khẩu mới
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Cập nhật mật khẩu
      db.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, decoded.userId],
        function(err) {
          if (err) {
            console.error('❌ Lỗi cập nhật mật khẩu:', err);
            return res.status(500).json({
              success: false,
              message: 'Lỗi server, vui lòng thử lại sau'
            });
          }

          res.json({
            success: true,
            message: 'Mật khẩu đã được đặt lại thành công!'
          });
        }
      );
    });

  } catch (error) {
    console.error('Lỗi reset mật khẩu:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.'
      });
    }
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
  updateProfile,
  forgotPassword,
  resetPassword
}; 