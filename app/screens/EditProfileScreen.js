import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { token, updateUser } = useAuth();

  // Lấy thông tin hiện tại khi component mount
  useEffect(() => {
    loadCurrentProfile();
  }, []);

  const loadCurrentProfile = async () => {
    try {
      if (!token) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
        navigation.goBack();
        return;
      }

      const response = await ApiService.getProfile(token);
      if (response.success) {
        setFormData({
          full_name: response.data.full_name || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
        });
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
      }
    } catch (error) {
      console.error('Lỗi tải profile:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.full_name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.updateProfile(token, formData);
      if (response.success) {
        Alert.alert(
          'Thành công',
          'Thông tin đã được cập nhật!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Cập nhật thông tin trong context
                updateUser({
                  ...response.data,
                  full_name: formData.full_name,
                  phone: formData.phone,
                  address: formData.address,
                });
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
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
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
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
          <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Họ tên */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              value={formData.full_name}
              onChangeText={(text) => setFormData({ ...formData, full_name: text })}
              placeholder="Nhập họ và tên"
              maxLength={50}
            />
          </View>

          {/* Số điện thoại */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* Địa chỉ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Nhập địa chỉ"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          {/* Lưu button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Lưu thông tin</Text>
            )}
          </TouchableOpacity>
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
  form: {
    padding: 16,
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
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#ff6600',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 