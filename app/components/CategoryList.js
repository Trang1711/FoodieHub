import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const categories = [
  {
    id: '1',
    name: 'Cơm',
    image: 'https://cdn.tgdd.vn/2021/07/CookProduct/2-1200x676-2-1200x676-3.jpg',
  },
  {
    id: '2',
    name: 'Bún/Phở',
    image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/9/27/1400438/Pho-4.jpg',
  },
  {
    id: '3',
    name: 'Gà rán',
    image: 'https://cdn.tgdd.vn/2021/08/CookRecipe/GalleryStep/thanh-pham-1617.jpg',
  },
  {
    id: '4',
    name: 'Trà sữa',
    image: 'https://xingfuvietnam.vn/wp-content/uploads/2023/02/xingfu-tra-sua-tran-chau-duong-den-2-FILEminimizer.jpg',
  },
  {
    id: '5',
    name: 'Bánh mì',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2mgRa4TKjPIGI1ev5aojGAYDDsU4rTTfxCg&s',
  },
];

export default function CategoryList() {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.label}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
