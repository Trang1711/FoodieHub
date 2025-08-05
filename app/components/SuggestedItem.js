import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SuggestedItem = () => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://i.imgur.com/JgY2GAx.jpeg' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>Xuân Food - Mì Trộn Indomie - Văn Phú</Text>
        <Text style={styles.details}>⭐ 4.7 · 0.4km · 30phút</Text>
        <Text style={styles.deal}>Giảm món · Tặng 1 quà tặng · Mã giảm 16k</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 12,
    padding: 12,
    backgroundColor: '#fdfdfd',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  info: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'space-around',
  },
  name: {
    fontWeight: 'bold',
  },
  details: {
    color: '#555',
  },
  deal: {
    color: '#ff3d00',
    fontSize: 13,
  },
});

export default SuggestedItem;
