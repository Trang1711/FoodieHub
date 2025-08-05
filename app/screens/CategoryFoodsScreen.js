import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

const CategoryFoodsScreen = ({ route, navigation }) => {
  const { category, foods } = route.params;
  const { addToCart } = useCart();

  const handleFoodPress = (food) => {
    navigation.navigate('Chi tiết món ăn', { food });
  };

  const handleAddToCart = (food) => {
    addToCart(food);
    Alert.alert('Thành công', `${food.name} đã được thêm vào giỏ hàng!`);
  };

  const renderFoodItem = (food) => (
    <TouchableOpacity key={food.id} style={styles.foodCard} onPress={() => handleFoodPress(food)}>
      <Image source={{ uri: food.image }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={2}>{food.name}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>{food.description}</Text>
        <Text style={styles.foodPrice}>{food.price.toLocaleString()}₫</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(food)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Category Info */}
      <View style={styles.categoryInfo}>
        <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
          <Text style={styles.categoryIconText}>{category.icon}</Text>
        </View>
        <View style={styles.categoryText}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryTitle}>{category.title}</Text>
        </View>
      </View>

      {/* Foods List */}
      <ScrollView style={styles.foodsList} showsVerticalScrollIndicator={false}>
        <View style={styles.foodsGrid}>
          {foods.map(food => renderFoodItem(food))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },

  // Category info styles
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#666',
  },

  // Foods list styles
  foodsList: {
    flex: 1,
  },
  foodsGrid: {
    padding: 16,
    gap: 16,
  },
  foodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  foodInfo: {
    padding: 16,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FF4757',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CategoryFoodsScreen; 