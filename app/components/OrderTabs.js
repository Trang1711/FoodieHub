import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const tabs = ['Đang đến', 'Deal đã mua', 'Lịch sử', 'Đánh giá', 'Đơn nháp'];

const OrderTabs = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {tabs.map((tab, index) => (
        <Text key={index} style={[styles.tab, index === 0 && styles.activeTab]}>
          {tab}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  tab: {
    marginRight: 20,
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    color: '#ff3d00',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#ff3d00',
  },
});

export default OrderTabs;
