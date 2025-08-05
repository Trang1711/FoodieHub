import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../app/screens/HomeScreen';
import OrdersScreen from '../app/screens/OrdersScreen';
import ProfileScreen from '../app/screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Đơn hàng') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Hồ sơ') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Đơn hàng" component={OrdersScreen} />
      <Tab.Screen name="Hồ sơ" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
