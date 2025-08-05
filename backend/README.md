# Food Delivery Backend API

Backend API cho ứng dụng Food Delivery sử dụng Node.js, Express và SQL Server.

## Cài đặt

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình Database
1. Cài đặt SQL Server
2. Tạo database `food_delivery`
3. Cập nhật thông tin kết nối trong file `config.env`:
   ```
   DB_HOST=localhost
   DB_USER=sa
   DB_PASSWORD=your_password_here
   DB_NAME=food_delivery
   DB_PORT=1433
   ```

### 3. Cấu hình JWT Secret
Cập nhật `JWT_SECRET` trong file `config.env`:
```
JWT_SECRET=your_super_secret_jwt_key_here
```

## Chạy ứng dụng

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## API Endpoints

### Authentication

#### 1. Đăng ký tài khoản
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Đăng nhập
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "phone": "0123456789",
      "avatar": null,
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Lấy thông tin profile
```
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "phone": "0123456789",
    "avatar": null,
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Cập nhật thông tin profile
```
PUT /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "Nguyễn Văn B",
  "phone": "0987654321",
  "address": "456 Đường XYZ, Quận 2, TP.HCM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công!",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Nguyễn Văn B",
    "phone": "0987654321",
    "address": "456 Đường XYZ, Quận 2, TP.HCM"
  }
}
```

### Health Check
```
GET /api/health
```

## Cấu trúc Database

### Bảng users
```sql
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

## Tính năng

- ✅ Đăng ký tài khoản
- ✅ Đăng nhập với JWT
- ✅ Mã hóa mật khẩu với bcrypt
- ✅ Validation dữ liệu đầu vào
- ✅ Middleware xác thực
- ✅ Lấy và cập nhật thông tin profile
- ✅ Error handling
- ✅ Security với helmet
- ✅ CORS support
- ✅ Logging với morgan

## Bảo mật

- Mật khẩu được mã hóa với bcrypt
- JWT token cho xác thực
- Validation dữ liệu đầu vào
- Helmet để bảo vệ headers
- CORS được cấu hình
- Error handling không tiết lộ thông tin nhạy cảm 