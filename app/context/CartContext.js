import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Thêm món ăn vào giỏ hàng
  const addToCart = (food) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === food.id);
      
      if (existingItem) {
        // Nếu món đã có trong giỏ hàng, tăng số lượng
        return prevItems.map(item =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu món chưa có, thêm mới với số lượng = 1
        return [...prevItems, { ...food, quantity: 1 }];
      }
    });
  };

  // Xóa món ăn khỏi giỏ hàng
  const removeFromCart = (foodId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== foodId));
  };

  // Cập nhật số lượng món ăn
  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  // Tính tổng số lượng món trong giỏ hàng
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Tính tổng tiền
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseInt(item.price.replace(/[^\d]/g, '')) 
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 