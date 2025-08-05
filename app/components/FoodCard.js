import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function FoodCard({ food, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <Text style={styles.name}>{food.name}</Text>
      <Text style={styles.price}>{food.price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 6,
  },
  price: {
    color: '#888',
  },
});
