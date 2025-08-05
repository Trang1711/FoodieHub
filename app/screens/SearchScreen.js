import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

const searchHistory = [
  'cơm thố anh nguyên',
  'cơm thố bách khoa',
  'bánh đúc nóng khắc hiệp',
];

const popularSearches = [
  { id: '1', name: 'Gà rán', image: 'https://cdn.tgdd.vn/Files/2019/07/05/1177875/cach-lam-ga-ran-kfc-thom-ngon-gion-rum-ngoai-da-tai-nha-201907051416542816.jpg' },
  { id: '2', name: 'Bún', image: 'https://cdn.tgdd.vn/Files/2021/12/22/1408513/cach-nau-bun-rieu-cua-thom-ngon-dung-vi-don-gian-tai-nha-202112221135240657.jpg' },
  { id: '3', name: 'Bánh mì', image: 'https://cdn.tgdd.vn/Files/2019/06/13/1173122/cach-lam-banh-mi-thit-nuong-sieu-ngon-don-gian-tai-nha-201906131108107962.jpg' },
  { id: '4', name: 'Phở', image: 'https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg' },
  { id: '5', name: 'Trà sữa', image: 'https://cdn.tgdd.vn/Files/2020/05/07/1256761/cach-lam-tra-sua-tran-chau-duong-den-ngon-nhu-ngoai-hang-202005071643212292.jpg' },
  { id: '6', name: 'Pizza', image: 'https://cdn.tgdd.vn/Files/2018/06/05/1189185/cach-lam-pizza-pho-mai-don-gian-thom-ngon-tai-nha-202108201107560107.jpg' },
  { id: '7', name: 'Bánh kem', image: 'https://cdn.tgdd.vn/Files/2019/03/06/1151872/2-cach-lam-banh-flan-caramel-don-gian-thom-ngon-an-khong-bi-ngan-201903061329172668.jpg' },
  { id: '8', name: 'Cơm', image: 'https://cdn.tgdd.vn/Files/2020/03/12/1241357/3-cach-lam-com-tam-suon-bi-cha-don-gian-thom-ngon-hap-dan-202003121051108022.jpg' },
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Tìm món ăn, nhà hàng..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
      </View>

      {/* Lịch sử tìm kiếm */}
      {searchHistory.map((item, index) => (
        <Text key={index} style={styles.historyItem}>{item}</Text>
      ))}

      <Text style={styles.viewMore}>Xem thêm</Text>

      {/* Phổ biến */}
      <Text style={styles.sectionTitle}>Phổ biến</Text>
      <FlatList
        data={popularSearches}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.popularItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  searchBar: {
    flexDirection: 'row',alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  input: { flex: 1, padding: 10, fontSize: 16 },
  cancelText: { color: 'red', marginLeft: 10, fontSize: 16 },
  historyItem: { paddingVertical: 8, fontSize: 15, color: '#333' },
  viewMore: { paddingVertical: 8, fontSize: 14, color: '#007bff' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginVertical: 10 },
  popularItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  image: { width: 40, height: 40, borderRadius: 6, marginRight: 10 },
  name: { fontSize: 15 },
});
