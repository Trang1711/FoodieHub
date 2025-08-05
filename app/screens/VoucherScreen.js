import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const vouchers = [
  {
    id: '1',
    title: 'Giảm 50K đơn từ 200K',
    image: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
    expiry: 'HSD: 30/08/2025'
  },
  {
    id: '2',
    title: 'Freeship đơn từ 50K',
    image: 'https://cdn-icons-png.flaticon.com/512/2620/2620960.png',
    expiry: 'HSD: 15/09/2025'
  },
  {
    id: '3',
    title: 'Giảm 20% tối đa 30K',
    image: 'https://cdn-icons-png.flaticon.com/512/1082/1082459.png',
    expiry: 'HSD: 01/09/2025'
  },
];

export default function VoucherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kho voucher</Text>
      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.expiry}>{item.expiry}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fefefe',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  expiry: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});
