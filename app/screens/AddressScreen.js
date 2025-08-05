import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

export default function AddressScreen({ navigation }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { token, updateUser } = useAuth();

  // Lấy địa chỉ hiện tại khi component mount
  useEffect(() => {
    loadCurrentAddress();
  }, []);

  const loadCurrentAddress = async () => {
    try {
      if (!token) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
        navigation.goBack();
        return;
      }

      const response = await ApiService.getProfile(token);
      
      if (response.success) {
        setAddress(response.data.address || '');
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin địa chỉ');
      }
    } catch (error) {
      console.error('Lỗi tải địa chỉ:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.updateProfile(token, { address: address.trim() });

      if (response.success) {
        Alert.alert(
          'Thành công',
          'Địa chỉ giao hàng đã được cập nhật!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Cập nhật thông tin trong context
                updateUser({
                  ...response.data,
                  address: address.trim(),
                });
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể cập nhật địa chỉ');
      }
    } catch (error) {
      console.error('Lỗi cập nhật địa chỉ:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6600" />
          <Text style={styles.loadingText}>Đang tải địa chỉ...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Current Address Display */}
          <View style={styles.currentAddressSection}>
            <Text style={styles.sectionTitle}>Địa chỉ hiện tại</Text>
            {address ? (
              <View style={styles.addressCard}>
                <Ionicons name="location" size={20} color="#ff6600" />
                <Text style={styles.addressText}>{address}</Text>
              </View>
            ) : (
              <View style={styles.noAddressCard}>
                <Ionicons name="location-outline" size={20} color="#999" />
                <Text style={styles.noAddressText}>Chưa có địa chỉ giao hàng</Text>
              </View>
            )}
          </View>

          {/* Edit Address Form */}
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>Cập nhật địa chỉ</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Địa chỉ giao hàng *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                placeholder="Nhập địa chỉ giao hàng chi tiết"
                multiline
                numberOfLines={4}
                maxLength={200}
              />
              <Text style={styles.helperText}>
                Ví dụ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSaveAddress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Lưu ý:</Text>
            <Text style={styles.tipsText}>
              • Địa chỉ sẽ được sử dụng làm địa chỉ giao hàng mặc định{'\n'}
              • Hãy nhập địa chỉ chi tiết để dễ dàng giao hàng{'\n'}
              • Có thể cập nhật địa chỉ bất cứ lúc nào
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  currentAddressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    lineHeight: 20,
  },
  noAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noAddressText: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  editSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#ff6600',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
