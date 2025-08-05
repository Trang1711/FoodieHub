import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useCart } from '../context/CartContext';

const extras = [
  { id: 'e1', name: 'Trứng gà', price: 7000 },
  { id: 'e2', name: 'Giò lụa', price: 10000 },
  { id: 'e3', name: 'Chả cốm', price: 12000 },
];

export default function FoodDetailScreen({ route, navigation }) {
  const { food } = route.params;
  const [selectedExtras, setSelectedExtras] = useState([]);
  const { addToCart } = useCart();

  const toggleExtra = (extraId) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const getSelectedExtras = () => {
    return extras.filter(extra => selectedExtras.includes(extra.id));
  };

  const getTotalPrice = () => {
    const extrasPrice = getSelectedExtras().reduce((sum, extra) => sum + extra.price, 0);
    return food.price + extrasPrice;
  };

  const handleAddToCart = () => {
    const foodWithExtras = {
      ...food,
      extras: getSelectedExtras(),
      totalPrice: getTotalPrice(),
    };
    
    addToCart(foodWithExtras);
    Alert.alert(
      'Thành công', 
      `${food.name} đã được thêm vào giỏ hàng!`,
      [
        { text: 'Tiếp tục mua sắm', style: 'cancel' },
        { 
          text: 'Xem giỏ hàng', 
          onPress: () => navigation.navigate('Giỏ hàng')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header với nút back */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Ảnh món ăn */}
        <Image source={{ uri: food.image }} style={styles.image} />

        {/* Thông tin món ăn */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.name}>{food.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {food.rating}</Text>
              <Text style={styles.category}>{food.category}</Text>
            </View>
          </View>

          <Text style={styles.description}>{food.description}</Text>

          {/* Giá */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>{food.price.toLocaleString()}đ</Text>
            {selectedExtras.length > 0 && (
              <Text style={styles.totalPrice}>
                Tổng: {getTotalPrice().toLocaleString()}đ
              </Text>
            )}
          </View>

          {/* Món ăn kèm */}
          <View style={styles.extrasSection}>
            <Text style={styles.sectionTitle}>Món ăn kèm</Text>
            <View style={styles.extrasContainer}>
              {extras.map((extra) => (
                <TouchableOpacity
                  key={extra.id}
                  style={[
                    styles.extraItem,
                    selectedExtras.includes(extra.id) && styles.extraItemSelected,
                  ]}
                  onPress={() => toggleExtra(extra.id)}
                >
                  <Text style={styles.extraName}>{extra.name}</Text>
                  <Text style={styles.extraPrice}>+{extra.price.toLocaleString()}đ</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nút thêm vào giỏ hàng */}
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>
              Thêm vào giỏ hàng - {getTotalPrice().toLocaleString()}đ
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  rating: {
    fontSize: 16,
    color: '#ff9500',
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  priceSection: {
    marginBottom: 25,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  totalPrice: {
    fontSize: 18,
    color: '#ff6600',
    fontWeight: '600',
    marginTop: 5,
  },
  extrasSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  extrasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  extraItem: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  extraItemSelected: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff6600',
  },
  extraName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  extraPrice: {
    fontSize: 12,
    color: '#ff6600',
    fontWeight: '600',
    marginTop: 2,
  },
  addToCartButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff6600',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
