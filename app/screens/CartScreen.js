import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../services/config';
import axios from 'axios';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm món ăn vào giỏ hàng');
      return;
    }

    if (!token) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đặt hàng');
      navigation.navigate('Login');
      return;
    }
    
    Alert.alert(
      'Đặt hàng',
      'Bạn có muốn đặt hàng không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đặt hàng', 
          onPress: createOrder
        }
      ]
    );
  };

  const createOrder = async () => {
    setIsLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          food_name: item.name,
          quantity: item.quantity,
          price: typeof item.price === 'string' 
            ? parseInt(item.price.replace(/[^\d]/g, '')) 
            : item.price,
          total_price: (typeof item.price === 'string' 
            ? parseInt(item.price.replace(/[^\d]/g, '')) 
            : item.price) * item.quantity
        })),
        delivery_address: user?.address || 'Chưa có địa chỉ',
        delivery_phone: user?.phone || 'Chưa có số điện thoại',
        delivery_name: user?.full_name || 'Chưa có tên',
        payment_method: 'cash',
        notes: '',
        total_amount: getTotalPrice()
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/orders/create`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Alert.alert(
          'Thành công!', 
          `Đơn hàng đã được tạo với mã: ${response.data.data.order_number}`,
          [
            {
              text: 'Xem đơn hàng',
              onPress: () => {
                clearCart();
                navigation.navigate('OrderHistory');
              }
            },
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Lỗi', response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      Alert.alert(
        'Lỗi', 
        error.response?.data?.message || 'Không thể kết nối đến server'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderCartItem = ({ item }) => {
    const price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[^\d]/g, '')) 
      : item.price;

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{price.toLocaleString()}đ</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff0000" />
        </TouchableOpacity>
      </View>
    );
  };

  const totalPrice = getTotalPrice();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Giỏ hàng</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearButton}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>🛒</Text>
          <Text style={styles.emptyCartTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptyCartSubtitle}>
            Hãy thêm món ăn vào giỏ hàng của bạn
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('Trang chủ')}
          >
            <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            style={styles.cartList}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}đ</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]} 
              onPress={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.checkoutButtonText}>Đặt hàng</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#ff6600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 16,
    color: '#ff0000',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#ff6600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  checkoutButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default CartScreen; 