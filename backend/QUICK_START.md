# 🚀 Hướng dẫn nhanh - Food Delivery Backend

## Bước 1: Cấu hình Database

### 1.1 Cài đặt SQL Server
- Tải và cài đặt SQL Server (Express hoặc Developer Edition)
- Đảm bảo SQL Server đang chạy

### 1.2 Tạo Database
Chạy file `setup_database.sql` trong SQL Server Management Studio hoặc:
```sql
-- Tạo database
CREATE DATABASE food_delivery;
USE food_delivery;

-- Tạo bảng users
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar VARCHAR(500),
    address TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

### 1.3 Cập nhật config.env
Sửa file `config.env` với thông tin database của bạn:
```env
DB_HOST=localhost
DB_USER=sa
DB_PASSWORD=your_password_here
DB_NAME=food_delivery
DB_PORT=1433
JWT_SECRET=your_super_secret_jwt_key_here
```

## Bước 2: Chạy Backend

### 2.1 Cài đặt dependencies (đã làm)
```bash
npm install
```

### 2.2 Chạy server
```bash
# Development mode (với nodemon)
npm run dev

# Hoặc Production mode
npm start
```

### 2.3 Kiểm tra server
- Server sẽ chạy tại: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Bước 3: Test API

### 3.1 Sử dụng file test_api.http
- Mở file `test_api.http` trong VS Code với extension REST Client
- Hoặc sử dụng Postman

### 3.2 Test đăng ký
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "full_name": "Nguyễn Văn Test",
    "phone": "0123456789",
    "address": "123 Đường Test, Quận 1, TP.HCM"
  }'
```

### 3.3 Test đăng nhập
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

## Cấu trúc thư mục
```
backend/
├── config.env              # Cấu hình môi trường
├── package.json            # Dependencies
├── server.js              # File chính
├── database.js            # Kết nối database
├── middleware/
│   ├── auth.js           # Middleware xác thực
│   └── validation.js     # Validation
├── controllers/
│   └── authController.js # Logic xử lý auth
├── routes/
│   └── authRoutes.js     # Routes cho auth
├── setup_database.sql    # Script tạo database
├── test_api.http         # Test API
└── README.md             # Hướng dẫn chi tiết
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/profile` | Lấy profile (cần token) |
| PUT | `/api/auth/profile` | Cập nhật profile (cần token) |

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra SQL Server đang chạy
- Kiểm tra thông tin kết nối trong `config.env`
- Đảm bảo database `food_delivery` đã được tạo

### Lỗi port đã được sử dụng
- Thay đổi PORT trong `config.env`
- Hoặc kill process đang sử dụng port 5000

### Lỗi JWT
- Kiểm tra JWT_SECRET trong `config.env`
- Đảm bảo token được gửi đúng format: `Bearer <token>` 