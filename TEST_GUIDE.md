# Hướng dẫn Test Ứng dụng Food Delivery

## 🚀 Cách Test

### 1. Khởi động Backend
```bash
cd backend
node server.js
```

### 2. Khởi động Frontend
```bash
npm start
```

### 3. Đăng nhập với các tài khoản test

#### Tài khoản 1:
- **Email:** test@example.com
- **Password:** 123456
- **Tên:** Nguyễn Văn Test
- **SĐT:** 0123456789
- **Địa chỉ:** 123 Đường ABC, Quận 1, TP.HCM

#### Tài khoản 2:
- **Email:** user1@example.com
- **Password:** 123456
- **Tên:** Trần Thị Anh
- **SĐT:** 0901234567
- **Địa chỉ:** 456 Đường Nguyễn Huệ, Quận 1, TP.HCM

#### Tài khoản 3:
- **Email:** user2@example.com
- **Password:** 123456
- **Tên:** Lê Văn Bình
- **SĐT:** 0912345678
- **Địa chỉ:** 789 Đường Lê Lợi, Quận 3, TP.HCM

#### Tài khoản 4:
- **Email:** user3@example.com
- **Password:** 123456
- **Tên:** Phạm Thị Cẩm
- **SĐT:** 0923456789
- **Địa chỉ:** 321 Đường Võ Văn Tần, Quận 3, TP.HCM

### 4. Test Trang Cá Nhân

1. **Đăng nhập** với một trong các tài khoản trên
2. **Chuyển đến tab "Tôi"** (góc dưới bên phải)
3. **Kiểm tra thông tin hiển thị:**
   - ✅ Tên người dùng
   - ✅ Số điện thoại
   - ✅ Email
   - ✅ Địa chỉ (nếu có)

### 5. Test Chỉnh sửa thông tin

1. **Nhấn vào phần thông tin cá nhân** (avatar + tên)
2. **Chỉnh sửa thông tin:**
   - Họ và tên (bắt buộc)
   - Số điện thoại (bắt buộc)
   - Địa chỉ (tùy chọn)
3. **Nhấn "Lưu thông tin"**
4. **Kiểm tra:**
   - ✅ Thông báo thành công
   - ✅ Dữ liệu được cập nhật trong database
   - ✅ Thông tin mới hiển thị trên trang cá nhân

### 6. Test Địa chỉ giao hàng

1. **Vào tab "Tôi"** → **"Địa chỉ giao hàng"**
2. **Kiểm tra hiển thị địa chỉ hiện tại** (nếu có)
3. **Cập nhật địa chỉ:**
   - Nhập địa chỉ giao hàng chi tiết
   - Nhấn "Lưu địa chỉ"
4. **Kiểm tra:**
   - ✅ Thông báo thành công
   - ✅ Địa chỉ được cập nhật trong database
   - ✅ Địa chỉ mới hiển thị trên trang cá nhân
   - ✅ Địa chỉ mới hiển thị trong màn hình địa chỉ giao hàng

### 7. Test Lịch sử đơn hàng

1. **Vào tab "Tôi"** → **"Lịch sử đơn hàng"**
2. **Kiểm tra hiển thị danh sách đơn hàng:**
   - ✅ Mã đơn hàng (ORD001, ORD002, v.v.)
   - ✅ Ngày đặt hàng
   - ✅ Trạng thái đơn hàng (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy)
   - ✅ Địa chỉ giao hàng
   - ✅ Số lượng món ăn
   - ✅ Phương thức thanh toán
   - ✅ Tổng tiền
3. **Test pull-to-refresh:**
   - Kéo xuống để refresh danh sách
4. **Test trạng thái đơn hàng:**
   - Các đơn hàng có màu sắc khác nhau theo trạng thái
   - Orange: Chờ xử lý
   - Blue: Đang giao
   - Green: Hoàn thành
   - Red: Đã hủy

### 8. Test Đổi mật khẩu

1. **Vào tab "Tôi"** → **"Đổi mật khẩu"**
2. **Nhập thông tin:**
   - Mật khẩu hiện tại: `123456`
   - Mật khẩu mới: `123456789`
   - Xác nhận mật khẩu mới: `123456789`
3. **Nhấn "Xác nhận đổi mật khẩu"**
4. **Kiểm tra:**
   - ✅ Thông báo thành công
   - ✅ Mật khẩu được cập nhật trong database
   - ✅ Form được reset
   - ✅ Quay lại màn hình trước
5. **Test validation:**
   - Nhập mật khẩu hiện tại sai → Hiển thị lỗi
   - Nhập mật khẩu mới < 6 ký tự → Hiển thị lỗi
   - Nhập xác nhận mật khẩu không khớp → Hiển thị lỗi
   - Nhập mật khẩu mới trùng với mật khẩu hiện tại → Hiển thị lỗi

### 9. Test Đăng xuất

1. **Vào tab "Tôi"** → **"Đăng xuất"**
2. **Xác nhận đăng xuất**
3. **Kiểm tra:**
   - ✅ Quay về màn hình đăng nhập
   - ✅ Token bị xóa khỏi context

### 10. Tính năng đã hoàn thành

#### Backend:
- ✅ **Database SQLite** với bảng users, orders, order_items
- ✅ **Authentication API** (đăng ký, đăng nhập, đổi mật khẩu)
- ✅ **Profile API** (lấy thông tin, cập nhật thông tin)
- ✅ **Orders API** (lịch sử đơn hàng, chi tiết đơn hàng)
- ✅ **JWT Token** authentication
- ✅ **Password hashing** với bcrypt
- ✅ **Data validation** và error handling

#### Frontend:
- ✅ **Authentication Context** quản lý token và user data
- ✅ **Login/Register** screens
- ✅ **Profile Screen** hiển thị thông tin từ database
- ✅ **Edit Profile Screen** cập nhật thông tin
- ✅ **Address Screen** quản lý địa chỉ giao hàng
- ✅ **Order History Screen** hiển thị lịch sử đơn hàng
- ✅ **Change Password Screen** đổi mật khẩu
- ✅ **Loading states** và error handling
- ✅ **Pull-to-refresh** cho danh sách
- ✅ **Form validation** client-side
- ✅ **Navigation** giữa các màn hình

### 11. Cấu trúc Database

#### Bảng `users`:
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `password` (TEXT)
- `full_name` (TEXT)
- `phone` (TEXT)
- `address` (TEXT)
- `avatar` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### Bảng `orders`:
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `order_number` (TEXT UNIQUE)
- `total_amount` (DECIMAL)
- `status` (TEXT)
- `delivery_address` (TEXT)
- `delivery_phone` (TEXT)
- `delivery_name` (TEXT)
- `payment_method` (TEXT)
- `notes` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### Bảng `order_items`:
- `id` (INTEGER PRIMARY KEY)
- `order_id` (INTEGER FOREIGN KEY)
- `food_name` (TEXT)
- `quantity` (INTEGER)
- `price` (DECIMAL)
- `total_price` (DECIMAL)

### 12. API Endpoints

#### Authentication:
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `PUT /api/auth/change-password` - Đổi mật khẩu

#### Profile:
- `GET /api/auth/profile` - Lấy thông tin cá nhân
- `PUT /api/auth/profile` - Cập nhật thông tin cá nhân

#### Orders:
- `GET /api/orders/history` - Lấy lịch sử đơn hàng
- `GET /api/orders/:orderId` - Lấy chi tiết đơn hàng
- `PUT /api/orders/:orderId/status` - Cập nhật trạng thái đơn hàng

### 13. Troubleshooting

**Nếu gặp lỗi:**
1. Kiểm tra backend có chạy không: `http://192.168.1.101:5000/api/health`
2. Kiểm tra IP trong `app/services/config.js`
3. Kiểm tra console log để debug
4. Đảm bảo database file được tạo: `backend/food_delivery.db`
5. Restart server nếu cần: `node server.js`

### 14. Dữ liệu Test

#### Users:
- 4 tài khoản test với thông tin đầy đủ
- Mật khẩu mặc định: `123456`

#### Orders:
- 4 đơn hàng test với các trạng thái khác nhau
- Đơn hàng có items chi tiết
- Địa chỉ giao hàng và thông tin thanh toán

### 15. Tính năng nổi bật

- 🔐 **Bảo mật**: JWT token, password hashing
- 📱 **Responsive**: Hoạt động tốt trên mobile
- 🔄 **Real-time**: Cập nhật dữ liệu ngay lập tức
- 🎨 **UI/UX**: Giao diện đẹp, dễ sử dụng
- 📊 **Data Management**: Quản lý state hiệu quả
- 🛡️ **Error Handling**: Xử lý lỗi toàn diện
- ⚡ **Performance**: Tối ưu hiệu suất 