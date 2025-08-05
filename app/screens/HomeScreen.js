import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import CartIcon from '../components/CartIcon';
import ApiService from '../services/api';
import LocationPicker from '../components/LocationPicker';

const HomeScreen = ({ navigation }) => {
  const { addToCart, getTotalItems } = useCart();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Dữ liệu categories
  const categories = [
    { 
      id: 1, 
      name: 'Trà sữa', 
      title: 'Trà sữa & Đồ uống', 
      image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
      color: '#FF6B9D' 
    },
    { 
      id: 2, 
      name: 'Đồ Nhật', 
      title: 'Sushi & Món Nhật', 
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      color: '#FF6B35' 
    },
    { 
      id: 3, 
      name: 'Đồ Trung', 
      title: 'Dimsum & Món Trung', 
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
      color: '#FF4757' 
    },
    { 
      id: 4, 
      name: 'Đồ Hàn', 
      title: 'Kimbap & Món Hàn', 
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      color: '#4CAF50' 
    },
    { 
      id: 5, 
      name: 'Đồ Việt', 
      title: 'Phở & Món Việt', 
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      color: '#FFD700' 
    },
    { 
      id: 6, 
      name: 'Đồ Tây', 
      title: 'Pizza & Món Tây', 
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      color: '#9C27B0' 
    },
  ];

  // Dữ liệu deals
  const deals = [
    {
      id: 1,
      name: 'BURGER BÒ PHÔ MAI',
      category: 'Burger Hub - 8...',
      originalPrice: '45.000₫',
      discountPrice: '32.000₫',
      discount: '-29%',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      isNew: false
    },
    {
      id: 2,
      name: 'BUBBLE TEA TRÂN CHÂU',
      category: 'Bubble Tea Hub - 8...',
      originalPrice: '35.000₫',
      discountPrice: '25.000₫',
      discount: '-29%',
      image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
      isNew: true
    },
    {
      id: 3,
      name: 'PIZZA HẢI SẢN',
      category: 'Pizza Hub',
      originalPrice: '120.000₫',
      discountPrice: '85.000₫',
      discount: '-29%',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      isNew: false
    }
  ];

  // Lấy dữ liệu foods từ API
  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllFoods();
      
      if (response.success) {
        setFoodItems(response.data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu món ăn');
      }
    } catch (error) {
      console.error('Lỗi loadFoods:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const handleFoodPress = (food) => {
    navigation.navigate('Chi tiết món ăn', { food });
  };

  const handleAddToCart = (food) => {
    addToCart(food);
    Alert.alert('Thành công', `${food.name} đã được thêm vào giỏ hàng!`);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log('Vị trí được chọn:', location);
  };

  const handleCategoryPress = (category) => {
    // Hiển thị danh sách món ăn theo category
    const categoryFoods = foodItems.filter(food => {
      const foodName = food.name.toLowerCase();
      const categoryName = category.name.toLowerCase();
      
      if (categoryName.includes('trà sữa') || categoryName.includes('đồ uống')) {
        return foodName.includes('trà') || foodName.includes('sữa') || foodName.includes('cà phê');
      } else if (categoryName.includes('nhật')) {
        return foodName.includes('sushi') || foodName.includes('mì') || foodName.includes('ramen');
      } else if (categoryName.includes('trung')) {
        return foodName.includes('dimsum') || foodName.includes('bánh bao');
      } else if (categoryName.includes('hàn')) {
        return foodName.includes('kimbap') || foodName.includes('kimchi');
      } else if (categoryName.includes('việt')) {
        return foodName.includes('phở') || foodName.includes('bún') || foodName.includes('cơm');
      } else if (categoryName.includes('tây')) {
        return foodName.includes('pizza') || foodName.includes('pasta');
      }
      return false;
    });

    if (categoryFoods.length > 0) {
      navigation.navigate('CategoryFoods', { 
        category: category, 
        foods: categoryFoods 
      });
    } else {
      Alert.alert('Thông báo', `Chưa có món ăn nào trong danh mục ${category.name}`);
    }
  };

  // Render category item
  const renderCategoryItem = (category) => (
    <TouchableOpacity 
      key={category.id} 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(category)}
    >
      <View style={styles.categoryIcon}>
        <Image source={{ uri: category.image }} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryTitle}>{category.title}</Text>
    </TouchableOpacity>
  );

  // Render deal item
  const renderDealItem = (deal) => (
    <TouchableOpacity key={deal.id} style={styles.dealCard}>
      <Image source={{ uri: deal.image }} style={styles.dealImage} />
      {deal.isNew && (
        <View style={styles.newTag}>
          <Text style={styles.newTagText}>Sản phẩm mới</Text>
        </View>
      )}
      <View style={styles.discountTag}>
        <Text style={styles.discountText}>{deal.discount}</Text>
      </View>
      <View style={styles.dealInfo}>
        <Text style={styles.dealCategory}>{deal.category}</Text>
        <Text style={styles.dealName}>{deal.name}</Text>
        <View style={styles.dealPrice}>
          <Text style={styles.discountPrice}>{deal.discountPrice}</Text>
          <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render food item
  const renderFoodItem = (food) => (
    <TouchableOpacity key={food.id} style={styles.foodCard} onPress={() => handleFoodPress(food)}>
      <Image source={{ uri: food.image }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={2}>{food.name}</Text>
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
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <LocationPicker onLocationSelect={handleLocationSelect} />
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchText}>Tìm món ăn, nhà hàng...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Giỏ hàng')}>
            <View style={styles.cartLogo}>
              <View style={styles.cartHandle} />
              <View style={styles.cartBody} />
              <View style={[styles.cartWheel, styles.cartWheelLeft]} />
              <View style={[styles.cartWheel, styles.cartWheelRight]} />
            </View>
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner khuyến mãi */}
        <View style={styles.bannerSection}>
          <View style={styles.bannerCard}>
            <Image source={{ uri: 'https://i.pinimg.com/1200x/96/bf/61/96bf610a6d83daadfe74dc9365c9dc0f.jpg' }} style={styles.bannerBackgroundImage} />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerLogo}>FOODIEHUB</Text>
              <Text style={styles.bannerMainTitle}>Delicious</Text>
              <Text style={styles.bannerSubTitle}>food menu</Text>
              <View style={styles.bannerDiscount}>
                <Text style={styles.discountText}>SAVE</Text>
                <Text style={styles.discountPercent}>50%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesGrid}>
            {categories.map(category => renderCategoryItem(category))}
          </View>
        </View>

        {/* Deals Section */}
        <View style={styles.dealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DEAL NGON FOODIEHUB</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>Xem thêm ></Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealsList}>
            {deals.map(deal => renderDealItem(deal))}
          </ScrollView>
        </View>

        {/* Foods from Database */}
        <View style={styles.foodsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Món ăn nổi bật</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>Xem thêm ></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.foodsGrid}>
            {foodItems.slice(0, 6).map(food => renderFoodItem(food))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
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
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  addressArrow: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchText: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  cartButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartLogo: {
    width: 24,
    height: 18,
    position: 'relative',
  },
  cartHandle: {
    position: 'absolute',
    top: 2,
    left: 0,
    width: 8,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
    transform: [{ rotate: '-15deg' }],
  },
  cartBody: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  cartWheel: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  cartWheelLeft: {
    left: 2,
  },
  cartWheelRight: {
    right: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Banner styles
  bannerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bannerCard: {
    borderRadius: 16,
    height: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerBackgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  bannerLogo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerMainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  bannerDiscount: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginRight: 4,
  },
  discountPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },



  // Categories styles
  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryTitle: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },

  // Deals styles
  dealsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#666',
  },
  dealsList: {
    gap: 12,
  },
  dealCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newTagText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  discountTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4757',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  dealInfo: {
    padding: 12,
  },
  dealCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dealPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  // Foods styles
  foodsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  foodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  foodCard: {
    width: '47%',
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
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  foodInfo: {
    padding: 12,
  },
  foodName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  foodPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FF4757',
    width: 30,
    height: 30,
    borderRadius: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;
