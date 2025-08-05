import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ApiService from '../services/api';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('Đang đến');
  const [foodItems, setFoodItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  // Lấy dữ liệu foods từ API
  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllFoods();
      
      if (response.success) {
        // Chuyển đổi dữ liệu từ database sang format hiển thị
        const formattedFoods = response.data.map(food => ({
          id: food.id,
          name: food.name,
          rating: food.rating.toString(),
          distance: '0.8km', // Mock data
          time: '30phút', // Mock data
          promos: ['Giảm món', 'Mã giảm 10%'], // Mock data
          image: { uri: food.image },
          price: food.price,
          description: food.description,
          category: food.category
        }));
        
        setFoodItems(formattedFoods);
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

  // Lấy dữ liệu lịch sử đơn hàng từ API
  const loadOrderHistory = async () => {
    try {
      setOrderLoading(true);
      // Giả lập dữ liệu từ API - sau này sẽ thay bằng API thực
      const mockOrders = [
        {
          id: 1,
          restaurantName: 'Bánh Mì Chảo 2 Chị Em',
          orderDate: '05/08/2025',
          orderTime: '10:30',
          totalAmount: '150.000đ',
          status: 'Đã giao',
          items: ['Bánh mì chảo', 'Cà phê sữa đá'],
          image: require('../../assets/icon.png')
        },
        {
          id: 2,
          restaurantName: 'Bún Bò Huế 76A',
          orderDate: '03/08/2025',
          orderTime: '18:45',
          totalAmount: '120.000đ',
          status: 'Đã giao',
          items: ['Bún bò Huế', 'Nước mía'],
          image: require('../../assets/icon.png')
        }
      ];
      
      setOrderHistory(mockOrders);
    } catch (error) {
      console.error('Lỗi loadOrderHistory:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử đơn hàng');
    } finally {
      setOrderLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadFoods();
    loadOrderHistory();
  }, []);

  // Render phần nội dung trống
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📋</Text>
      </View>
      <Text style={styles.emptyTitle}>Quên chưa đặt món rồi nè bạn ơi?</Text>
      <Text style={styles.emptyDescription}>
        Bạn sẽ nhìn thấy các món đang được chuẩn bị hoặc giao đi tại đây để kiểm tra đơn hàng nhanh hơn!
      </Text>
    </View>
  );

  // Render card món ăn
  const renderFoodCard = (item) => (
    <TouchableOpacity key={item.id} style={styles.foodCard}>
      <Image source={item.image} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <View style={styles.foodDetails}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.promoContainer}>
          {item.promos.map((promo, index) => (
            <View key={index} style={styles.promoTag}>
              <Text style={styles.promoText}>{promo}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render card lịch sử đơn hàng
  const renderOrderHistoryCard = (order) => (
    <TouchableOpacity key={order.id} style={styles.orderCard}>
      <Image source={order.image} style={styles.orderImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.restaurantName}>{order.restaurantName}</Text>
        <Text style={styles.orderDate}>{order.orderDate} - {order.orderTime}</Text>
        <Text style={styles.orderItems}>{order.items.join(', ')}</Text>
        <View style={styles.orderFooter}>
          <Text style={styles.orderAmount}>{order.totalAmount}</Text>
          <View style={styles.statusTag}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render nội dung chính
  const renderContent = () => {
    if (activeTab === 'Đang đến') {
      return (
        <View style={styles.content}>
          {renderEmptyState()}
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Có thể bạn cũng thích</Text>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF4757" />
              <Text style={styles.loadingText}>Đang tải món ăn...</Text>
            </View>
          ) : (
            <View style={styles.foodList}>
              {foodItems.map(item => renderFoodCard(item))}
            </View>
          )}
        </View>
      );
    }
    
    if (activeTab === 'Deal đã mua') {
      return (
        <View style={styles.content}>
          <Text style={styles.historyTitle}>Lịch sử đơn hàng</Text>
          {orderLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF4757" />
              <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
            </View>
          ) : (
            <View style={styles.orderList}>
              {orderHistory.map(order => renderOrderHistoryCard(order))}
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <Text style={styles.otherTabText}>Tab {activeTab}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['Đang đến', 'Deal đã mua', 'Đánh giá'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {renderContent()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 4,
  },
  searchIcon: {
    fontSize: 20,
  },

  // Tab styles
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4757',
  },
  activeTabText: {
    color: '#FF4757',
    fontWeight: 'bold',
  },

  // Content styles
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },

  // Loading styles
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  // Empty state styles
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },

  // Divider styles
  divider: {
    marginVertical: 24,
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  // Food list styles
  foodList: {
    gap: 16,
  },

  // Food card styles
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  foodDetails: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  promoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  promoTag: {
    borderWidth: 1,
    borderColor: '#FF4757',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  promoText: {
    fontSize: 12,
    color: '#FF4757',
    fontWeight: '500',
  },

  // Order history styles
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderList: {
    gap: 12,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  statusTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },

  // Other tab styles
  otherTabText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
  },
});

export default OrdersScreen;