import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email để khôi phục mật khẩu');
      return;
    }
    Alert.alert(
      'Thành công',
      'Liên kết đặt lại mật khẩu đã được gửi tới email của bạn!'
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.subText}>
        Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  subText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#ff6600', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007bff', fontSize: 14 },
});
