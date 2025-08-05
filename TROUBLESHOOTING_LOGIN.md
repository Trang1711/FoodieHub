# Hướng dẫn khắc phục lỗi đăng nhập

## Lỗi "Network request failed"

### Nguyên nhân:
1. **Server backend chưa được khởi động**
2. **Sử dụng localhost trên thiết bị di động** (không hoạt động)

### Cách khắc phục:

#### 1. Khởi động Backend Server
```bash
cd backend
npm install  # Nếu chưa cài dependencies
npm start
```

#### 2. Kiểm tra IP máy tính
```bash
ipconfig
```
Tìm dòng "IPv4 Address" và copy IP đó.

#### 3. Cập nhật IP trong file config
Mở file `app/services/config.js` và thay đổi:
```javascript
BASE_URL: 'http://[IP_CỦA_BẠN]:5000/api'
```

Ví dụ: `http://192.168.1.101:5000/api`

#### 4. Các tùy chọn IP khác:
- **Máy ảo Android**: `http://10.0.2.2:5000/api`
- **Thiết bị thật**: `http://[IP_MÁY_TÍNH]:5000/api`
- **Web browser**: `http://localhost:5000/api`

#### 5. Kiểm tra kết nối
- Đảm bảo thiết bị di động và máy tính cùng mạng WiFi
- Thử truy cập `http://[IP]:5000/api/health` trên browser

### Lỗi thường gặp:
1. **"Network request failed"** → Kiểm tra IP và server
2. **"Connection refused"** → Server chưa chạy
3. **"Timeout"** → Kiểm tra firewall/antivirus

### Debug:
Thêm log vào `LoginScreen.js`:
```javascript
console.log('API URL:', API_CONFIG.BASE_URL);
console.log('Login data:', { email, password });
``` 