import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const supportTopics = [
  {
    id: '1',
    title: 'Vấn đề với đơn hàng',
    description: 'Bạn gặp sự cố với đơn hàng đã đặt?',
    image: 'https://cdn-icons-png.flaticon.com/512/3523/3523063.png',
  },
  {
    id: '2',
    title: 'Thanh toán & hoàn tiền',
    description: 'Thông tin về thanh toán, hoàn tiền,...',
    image: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
  },
  {
    id: '3',
    title: 'Tài khoản & đăng nhập',
    description: 'Cập nhật thông tin cá nhân, đổi mật khẩu,...',
    image: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
  },
];

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Trung tâm hỗ trợ</Text>
      <FlatList
        data={supportTopics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
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
    padding: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#e85c04',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
});
