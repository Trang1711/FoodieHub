import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const CartIcon = ({ onPress }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity style={styles.cartIcon} onPress={onPress}>
      <Ionicons name="cart-outline" size={28} color="#ff6600" />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartIcon: {
    position: 'absolute',
    top: 120,
    right: 20,
    zIndex: 1000,
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff0000',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartIcon; 