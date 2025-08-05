import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState(null);
  const { token, user, logout } = useAuth();

  useEffect(() => {
    loadUserProfile();
    loadAvatar();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserProfile();
      loadAvatar();
    });
    return unsubscribe;
  }, [navigation, token]);

  const loadAvatar = async () => {
    try {
      const savedAvatar = await AsyncStorage.getItem('userAvatar');
      if (savedAvatar) {
        setAvatarUri(savedAvatar);
      }
    } catch (error) {
      console.error('Lỗi load avatar:', error);
    }
  };

  const saveAvatar = async (uri) => {
    try {
      await AsyncStorage.setItem('userAvatar', uri);
    } catch (error) {
      console.error('Lỗi save avatar:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      if (!token) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
        navigation.replace('Đăng nhập');
        return;
      }
      
      const response = await ApiService.getProfile(token);
      
      if (response.success) {
        setUserProfile(response.data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
      }
    } catch (error) {
      console.error('Lỗi tải profile:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn avatar');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newAvatarUri = result.assets[0].uri;
        setAvatarUri(newAvatarUri);
        await saveAvatar(newAvatarUri);
        Alert.alert('Thành công', 'Đã thay đổi avatar!');
      }
    } catch (error) {
      console.error('Lỗi chọn ảnh:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newAvatarUri = result.assets[0].uri;
        setAvatarUri(newAvatarUri);
        await saveAvatar(newAvatarUri);
        Alert.alert('Thành công', 'Đã chụp và thay đổi avatar!');
      }
    } catch (error) {
      console.error('Lỗi chụp ảnh:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Thay đổi avatar',
      'Chọn cách thay đổi avatar',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Chụp ảnh', onPress: takePhoto },
        { text: 'Chọn từ thư viện', onPress: pickImage },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Đăng nhập' }],
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tôi</Text>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </View>

        {/* User info */}
        <TouchableOpacity 
          style={styles.profileInfo}
          onPress={() => navigation.navigate('Chỉnh sửa thông tin')}
        >
          <TouchableOpacity onPress={showImagePickerOptions}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={30} color="#ccc" />
              </View>
            )}
            <View style={styles.avatarEditIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {userProfile?.full_name || 'Chưa cập nhật tên'}
            </Text>
            <Text style={styles.phone}>
              {userProfile?.phone || 'Chưa cập nhật số điện thoại'}
            </Text>
            <Text style={styles.email}>{userProfile?.email}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="gray" />
        </TouchableOpacity>

        {/* Địa chỉ */}
        {userProfile?.address && (
          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>Địa chỉ:</Text>
            <Text style={styles.addressText}>{userProfile.address}</Text>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Chỉnh sửa thông tin')}>
            <Ionicons name="person-outline" size={22} color="#ff5b00" />
            <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Đánh giá của tôi')}>
            <Ionicons name="star-outline" size={22} color="#ff5b00" />
            <Text style={styles.menuText}>Đánh giá của tôi</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Địa chỉ giao hàng')}>
            <Ionicons name="location-outline" size={22} color="#ff5b00" />
            <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Lịch sử đơn hàng')}>
            <Ionicons name="document-text-outline" size={22} color="#ff5b00" />
            <Text style={styles.menuText}>Lịch sử đơn hàng</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Thông báo')}>
            <Ionicons name="notifications-outline" size={22} color="#ff5b00" />
            <Text style={styles.menuText}>Thông báo</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Đổi mật khẩu')}>
            <Ionicons name="lock-closed-outline" size={22} color="#ff5b00" />
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#ff5b00" />
            <Text style={styles.menuText}>Đăng xuất</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 6,
    borderBottomColor: '#f5f5f5',
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarPlaceholder: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 8,
    backgroundColor: '#ff6600',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: { flex: 1 },
  username: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  phone: { color: '#888', marginBottom: 2 },
  email: { color: '#666', fontSize: 12 },
  addressSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 6,
    borderBottomColor: '#f5f5f5',
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  menuText: { 
    flex: 1, 
    fontSize: 16, 
    marginLeft: 10 
  },
});
