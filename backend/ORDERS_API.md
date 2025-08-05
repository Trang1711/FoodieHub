# API Đơn Hàng - FoodieHub

## Tổng quan

API đơn hàng cung cấp các chức năng quản lý đơn hàng cho ứng dụng FoodieHub, bao gồm tạo đơn hàng, xem lịch sử, cập nhật trạng thái và hủy đơn hàng.

## Cấu trúc Database

### Bảng `orders`
- `id`: ID đơn hàng (Primary Key)
- `user_id`: ID người dùng (Foreign Key)
- `order_number`: Mã đơn hàng (Unique)
- `total_amount`: Tổng tiền đơn hàng
- `status`: Trạng thái đơn hàng (pending, confirmed, preparing, delivering, completed, cancelled)
- `delivery_address`: Địa chỉ giao hàng
- `delivery_phone`: Số điện thoại giao hàng
- `delivery_name`: Tên người nhận
- `payment_method`: Phương thức thanh toán
- `notes`: Ghi chú đơn hàng
- `created_at`: Thời gian tạo
- `updated_at`: Thời gian cập nhật

### Bảng `order_items`
- `id`: ID item (Primary Key)
- `order_id`: ID đơn hàng (Foreign Key)
- `food_id`: ID món ăn (Foreign Key)
- `quantity`: Số lượng
- `price`: Giá đơn vị
- `subtotal`: Tổng tiền item
- `created_at`: Thời gian tạo

## API Endpoints

### 1. Tạo đơn hàng mới
**POST** `/api/orders/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    {
      "food_name": "Phở Bò",
      "quantity": 2,
      "price": 50000,
      "total_price": 100000
    }
  ],
  "delivery_address": "123 Đường ABC, Quận 1, TP.HCM",
  "delivery_phone": "0901234567",
  "delivery_name": "Nguyễn Văn A",
  "payment_method": "cash",
  "notes": "Giao hàng trước 12h",
  "total_amount": 100000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công!",
  "data": {
    "order_id": 1,
    "order_number": "ORD1701234567890ABC12"
  }
}
```

### 2. Lấy lịch sử đơn hàng
**GET** `/api/orders/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD1701234567890ABC12",
      "total_amount": 100000,
      "status": "pending",
      "delivery_address": "123 Đường ABC, Quận 1, TP.HCM",
      "delivery_phone": "0901234567",
      "delivery_name": "Nguyễn Văn A",
      "payment_method": "cash",
      "notes": "Giao hàng trước 12h",
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T10:00:00.000Z",
      "item_count": 2
    }
  ]
}
```

### 3. Lấy chi tiết đơn hàng
**GET** `/api/orders/:orderId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "order_number": "ORD1701234567890ABC12",
      "total_amount": 100000,
      "status": "pending",
      "delivery_address": "123 Đường ABC, Quận 1, TP.HCM",
      "delivery_phone": "0901234567",
      "delivery_name": "Nguyễn Văn A",
      "payment_method": "cash",
      "notes": "Giao hàng trước 12h",
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T10:00:00.000Z"
    },
            "items": [
          {
            "id": 1,
            "order_id": 1,
            "food_name": "Phở Bò",
            "quantity": 2,
            "price": 50000,
            "total_price": 100000
          }
        ]
  }
}
```

### 4. Cập nhật trạng thái đơn hàng
**PUT** `/api/orders/:orderId/status`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái đơn hàng thành công!"
}
```

### 5. Hủy đơn hàng
**PUT** `/api/orders/:orderId/cancel`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Hủy đơn hàng thành công!"
}
```

### 6. Lấy tất cả đơn hàng (Admin)
**GET** `/api/orders/admin/all?page=1&limit=10&status=pending`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số đơn hàng mỗi trang (mặc định: 10)
- `status`: Lọc theo trạng thái (tùy chọn)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "order_number": "ORD1701234567890ABC12",
        "total_amount": 100000,
        "status": "pending",
        "delivery_address": "123 Đường ABC, Quận 1, TP.HCM",
        "delivery_phone": "0901234567",
        "delivery_name": "Nguyễn Văn A",
        "payment_method": "cash",
        "notes": "Giao hàng trước 12h",
        "created_at": "2024-01-01T10:00:00.000Z",
        "updated_at": "2024-01-01T10:00:00.000Z",
        "customer_name": "Nguyễn Văn A",
        "customer_email": "nguyenvana@example.com",
        "item_count": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

## Trạng thái đơn hàng

- `pending`: Chờ xác nhận
- `confirmed`: Đã xác nhận
- `preparing`: Đang chuẩn bị
- `delivering`: Đang giao hàng
- `completed`: Hoàn thành
- `cancelled`: Đã hủy

## Phương thức thanh toán

- `cash`: Tiền mặt
- `card`: Thẻ tín dụng
- `bank_transfer`: Chuyển khoản
- `momo`: Ví MoMo
- `zalopay`: Ví ZaloPay

## Lỗi thường gặp

### 400 Bad Request
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token không hợp lệ"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy đơn hàng"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Lỗi server, vui lòng thử lại sau"
}
```

## Test API

Chạy file test để kiểm tra các API:

```bash
cd backend
node test_orders_api.js
```

## Khởi tạo Database

Bảng orders và order_items đã được tạo tự động trong `database_sqlite.js`. Không cần chạy script riêng.

## Lưu ý

1. Tất cả API đều yêu cầu xác thực JWT token
2. Đơn hàng chỉ có thể hủy khi ở trạng thái `pending` hoặc `confirmed`
3. Order number được tạo tự động với format: `ORD` + timestamp + random string
4. Sử dụng SQLite với transaction để đảm bảo tính toàn vẹn dữ liệu khi tạo đơn hàng 