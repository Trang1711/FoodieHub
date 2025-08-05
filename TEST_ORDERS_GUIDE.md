# 🧪 Hướng dẫn Test Chức năng Đơn hàng - FoodieHub

## 📱 **Test qua ứng dụng Expo**

### 🚀 **Bước 1: Khởi động ứng dụng**

1. **Mở terminal và chạy:**
   ```bash
   cd FoodieHub-main
   npm start
   ```

2. **Quét mã QR bằng Expo Go app** trên điện thoại

### 🔧 **Bước 2: Kiểm tra cấu hình**

1. **Đảm bảo backend đang chạy:**
   ```bash
   cd backend
   npm start
   ```

2. **Kiểm tra IP trong config:**
   - Mở file `app/services/config.js`
   - Đảm bảo IP đúng với máy của bạn
   - Hiện tại: `http://172.16.0.2:5000/api`

### 👤 **Bước 3: Đăng nhập**

1. **Mở app và đăng nhập với:**
   - Email: `test@example.com`
   - Password: `123456`

2. **Hoặc đăng ký tài khoản mới**

### 🛒 **Bước 4: Test chức năng đơn hàng**

#### **4.1. Thêm món vào giỏ hàng**
1. Vào màn hình **Trang chủ**
2. Chọn món ăn bất kỳ
3. Nhấn **"Thêm vào giỏ"**
4. Lặp lại với vài món khác

#### **4.2. Xem giỏ hàng**
1. Nhấn icon **giỏ hàng** ở header
2. Kiểm tra:
   - ✅ Danh sách món đã thêm
   - ✅ Số lượng có thể thay đổi
   - ✅ Tổng tiền được tính đúng
   - ✅ Có thể xóa món

#### **4.3. Tạo đơn hàng**
1. Trong giỏ hàng, nhấn **"Đặt hàng"**
2. Xác nhận đặt hàng
3. **Kết quả mong đợi:**
   - ✅ Hiển thị loading khi đang tạo
   - ✅ Thông báo thành công với mã đơn hàng
   - ✅ Giỏ hàng được làm trống
   - ✅ Có thể chuyển đến lịch sử đơn hàng

#### **4.4. Xem lịch sử đơn hàng**
1. Vào **Profile** → **Lịch sử đơn hàng**
2. **Kiểm tra:**
   - ✅ Danh sách đơn hàng đã tạo
   - ✅ Thông tin: mã đơn, trạng thái, tổng tiền
   - ✅ Pull-to-refresh hoạt động
   - ✅ Loading indicator

#### **4.5. Xem chi tiết đơn hàng**
1. Nhấn vào một đơn hàng trong danh sách
2. **Kiểm tra:**
   - ✅ Thông tin đơn hàng đầy đủ
   - ✅ Danh sách món đã đặt
   - ✅ Địa chỉ giao hàng
   - ✅ Thời gian tạo đơn

### 🔄 **Bước 5: Test các trường hợp lỗi**

#### **5.1. Test khi chưa đăng nhập**
1. Đăng xuất khỏi app
2. Thử thêm món vào giỏ hàng
3. Thử đặt hàng
4. **Kết quả mong đợi:** Chuyển đến màn hình đăng nhập

#### **5.2. Test giỏ hàng trống**
1. Đảm bảo giỏ hàng trống
2. Thử đặt hàng
3. **Kết quả mong đợi:** Thông báo "Giỏ hàng trống"

#### **5.3. Test mất kết nối**
1. Tắt backend server
2. Thử đặt hàng
3. **Kết quả mong đợi:** Thông báo lỗi kết nối

### 📊 **Bước 6: Kiểm tra Database**

#### **6.1. Xem đơn hàng trong database:**
```bash
cd backend
node check_users.js
```

#### **6.2. Test API trực tiếp:**
```bash
cd backend
node test_orders_api.js
```

### 🎯 **Các tính năng cần test:**

#### ✅ **Chức năng cơ bản:**
- [ ] Thêm món vào giỏ hàng
- [ ] Xem giỏ hàng
- [ ] Thay đổi số lượng
- [ ] Xóa món khỏi giỏ
- [ ] Tính tổng tiền
- [ ] Tạo đơn hàng
- [ ] Xem lịch sử đơn hàng
- [ ] Xem chi tiết đơn hàng

#### ✅ **Chức năng nâng cao:**
- [ ] Loading states
- [ ] Error handling
- [ ] Authentication
- [ ] Network connectivity
- [ ] Data persistence

#### ✅ **UI/UX:**
- [ ] Responsive design
- [ ] Smooth animations
- [ ] Intuitive navigation
- [ ] Clear feedback messages

### 🐛 **Troubleshooting**

#### **Lỗi thường gặp:**

1. **"Không thể kết nối đến server"**
   - ✅ Kiểm tra backend có đang chạy không
   - ✅ Kiểm tra IP trong config.js
   - ✅ Kiểm tra firewall

2. **"Token không hợp lệ"**
   - ✅ Đăng nhập lại
   - ✅ Kiểm tra token trong AuthContext

3. **"Giỏ hàng trống"**
   - ✅ Thêm món vào giỏ hàng trước
   - ✅ Kiểm tra CartContext

4. **"Lỗi tạo đơn hàng"**
   - ✅ Kiểm tra thông tin user (địa chỉ, số điện thoại)
   - ✅ Kiểm tra database connection

### 📝 **Ghi chú:**

- **Backend URL:** `http://172.16.0.2:5000/api`
- **Database:** SQLite (`food_delivery.db`)
- **Test User:** `test@example.com` / `123456`
- **Server Port:** 5000

### 🎉 **Kết quả mong đợi:**

Sau khi test xong, bạn sẽ có:
- ✅ Đơn hàng được tạo thành công trong database
- ✅ Lịch sử đơn hàng hiển thị đúng
- ✅ App hoạt động mượt mà
- ✅ Không có lỗi console

**Chúc bạn test thành công! 🚀** 