import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const notifications = [
  {
    id: '1',
    title: 'Khuyến mãi siêu hot!',
    description: 'Giảm 50% cho đơn hàng đầu tiên trong hôm nay.',
    image: 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
  },
  {
    id: '2',
    title: 'Cập nhật hệ thống',
    description: 'Chúng tôi sẽ bảo trì hệ thống từ 23h đêm nay.',
    image: 'https://cdn-icons-png.flaticon.com/512/1008/1008986.png'
  },
  {
    id: '3',
    title: 'Đơn hàng đã giao',
    description: 'Đơn hàng #3456 của bạn đã được giao thành công.',
    image: 'https://cdn-icons-png.flaticon.com/512/633/633652.png'
  },
];

export default function NotificationScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>  </Text>
      <Text style={styles.title}>  </Text>
      <Text style={styles.header}>Thông báo</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
  },
});
