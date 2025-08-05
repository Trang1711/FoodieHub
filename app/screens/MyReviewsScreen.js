import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const reviews = [
  {
    id: '1',
    product: 'Pizza phô mai',
    rating: 5,
    comment: 'Pizza ngon, nóng hổi, giao hàng nhanh!',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
  },
  {
    id: '2',
    product: 'Trà sữa trân châu',
    rating: 4,
    comment: 'Ngon, không quá ngọt, đóng gói cẩn thận.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
  },
];

export default function ReviewScreen() {
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>  </Text>
      <Text style={styles.title}>  </Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.reviewCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.product}>{item.product}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
              <Text style={styles.rating}>Đánh giá: {item.rating} ★</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  product: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  comment: {
    color: '#555',
  },
  rating: {
    color: '#ff9900',
    marginTop: 4,
    fontWeight: '500',
  },
});
