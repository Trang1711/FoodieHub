import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './app/context/AuthContext';
import { CartProvider } from './app/context/CartContext';

// Screens
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import HomeScreen from './app/screens/HomeScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import FoodDetailScreen from './app/screens/FoodDetailScreen';
import CartScreen from './app/screens/CartScreen';
import SearchScreen from './app/screens/SearchScreen';
import AddressScreen from './app/screens/AddressScreen';
import ChangePasswordScreen from './app/screens/ChangePasswordScreen';
import ForgotPasswordScreen from './app/screens/ForgotPasswordScreen';
import OrderHistoryScreen from './app/screens/OrderHistoryScreen';
import OrdersScreen from './app/screens/OrdersScreen';
import NotificationScreen from './app/screens/NotificationScreen';
import SupportScreen from './app/screens/SupportScreen';
import VoucherScreen from './app/screens/VoucherScreen';
import MyReviewsScreen from './app/screens/MyReviewsScreen';

// Navigation
import TabNavigator from './navigation/TabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Đăng nhập"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Đăng nhập" component={LoginScreen} />
            <Stack.Screen name="Đăng ký" component={RegisterScreen} />
            <Stack.Screen name="Quên mật khẩu" component={ForgotPasswordScreen} />
            <Stack.Screen name="Trang chủ" component={TabNavigator} />
            <Stack.Screen name="Chi tiết món ăn" component={FoodDetailScreen} />
            <Stack.Screen name="Giỏ hàng" component={CartScreen} />
            <Stack.Screen name="Tìm kiếm" component={SearchScreen} />
            <Stack.Screen name="Địa chỉ giao hàng" component={AddressScreen} />
            <Stack.Screen name="Chỉnh sửa thông tin" component={EditProfileScreen} />
            <Stack.Screen name="Đổi mật khẩu" component={ChangePasswordScreen} />
            <Stack.Screen name="Lịch sử đơn hàng" component={OrderHistoryScreen} />
            <Stack.Screen name="Đơn hàng" component={OrdersScreen} />
            <Stack.Screen name="Thông báo" component={NotificationScreen} />
            <Stack.Screen name="Hỗ trợ" component={SupportScreen} />
            <Stack.Screen name="Voucher" component={VoucherScreen} />
            <Stack.Screen name="Đánh giá của tôi" component={MyReviewsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
