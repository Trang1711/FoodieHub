import API_CONFIG from './config';

const API_BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  // Đăng ký tài khoản
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API register:', error);
      throw error;
    }
  }

  // Đăng nhập
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API login:', error);
      throw error;
    }
  }

  // Lấy thông tin profile
  static async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API getProfile:', error);
      throw error;
    }
  }

  // Cập nhật thông tin profile
  static async updateProfile(token, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API updateProfile:', error);
      throw error;
    }
  }

  // Quên mật khẩu
  static async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API forgotPassword:', error);
      throw error;
    }
  }

  // Reset mật khẩu
  static async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API resetPassword:', error);
      throw error;
    }
  }

  // Lấy tất cả foods
  static async getAllFoods() {
    try {
      const response = await fetch(`${API_BASE_URL}/foods`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API getAllFoods:', error);
      throw error;
    }
  }

  // Lấy foods theo category
  static async getFoodsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/foods/category/${category}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API getFoodsByCategory:', error);
      throw error;
    }
  }

  // Lấy chi tiết food
  static async getFoodDetail(foodId) {
    try {
      const response = await fetch(`${API_BASE_URL}/foods/${foodId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API getFoodDetail:', error);
      throw error;
    }
  }

  // Tìm kiếm foods
  static async searchFoods(keyword) {
    try {
      const response = await fetch(`${API_BASE_URL}/foods/search/${keyword}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API searchFoods:', error);
      throw error;
    }
  }

  // Lấy lịch sử đơn hàng
  static async getOrderHistory(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API getOrderHistory:', error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng
  static async getOrderDetail(token, orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API getOrderDetail:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(token, orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API updateOrderStatus:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi API healthCheck:', error);
      throw error;
    }
  }
}

export default ApiService; 