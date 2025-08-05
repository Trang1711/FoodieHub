import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const LocationPicker = ({ onLocationSelect }) => {
  const [address, setAddress] = useState('Đang tải vị trí...');
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Yêu cầu quyền truy cập vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Cần quyền truy cập vị trí');
        Alert.alert('Quyền truy cập', 'Cần quyền truy cập vị trí để hiển thị địa chỉ giao hàng');
        return;
      }

      // Lấy vị trí hiện tại
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      // Lấy địa chỉ từ tọa độ
      let addressResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResult.length > 0) {
        const addressInfo = addressResult[0];
        const fullAddress = [
          addressInfo.street,
          addressInfo.district,
          addressInfo.city,
        ].filter(Boolean).join(', ');
        
        setAddress(fullAddress || 'Vị trí hiện tại');

        // Gọi callback với thông tin vị trí
        if (onLocationSelect) {
          onLocationSelect({
            latitude,
            longitude,
            address: fullAddress || 'Vị trí hiện tại',
          });
        }
      }

    } catch (error) {
      console.error('Lỗi lấy vị trí:', error);
      setAddress('Không thể lấy vị trí');
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại');
    }
  };

  const handleLocationPress = () => {
    if (location) {
      setShowMap(true);
    } else {
      Alert.alert(
        'Vị trí hiện tại',
        `Địa chỉ: ${address}\nTọa độ: Không có`,
        [
          { text: 'OK', style: 'default' },
          { text: 'Làm mới', onPress: getCurrentLocation }
        ]
      );
    }
  };

  const closeMap = () => {
    setShowMap(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addressButton} onPress={handleLocationPress}>
        <Text style={styles.locationLabel}>Giao đến:</Text>
        <Text style={styles.addressText} numberOfLines={1}>
          {address}
        </Text>
        <Text style={styles.locationArrow}>›</Text>
      </TouchableOpacity>

      {/* Map Modal */}
      <Modal
        visible={showMap}
        animationType="slide"
        transparent={false}
        onRequestClose={closeMap}
      >
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={closeMap}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Vị trí hiện tại</Text>
            <View style={styles.placeholder} />
          </View>
          
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Vị trí của bạn"
                description={address}
              />
            </MapView>
          )}
          
          <View style={styles.mapFooter}>
            <Text style={styles.addressInfo}>{address}</Text>
            <Text style={styles.coordinatesInfo}>
              {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : ''}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  locationLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  addressButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginTop: 4,
  },
  locationArrow: {
    fontSize: 18,
    color: '#fff',
    position: 'absolute',
    right: 0,
    top: 20,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  map: {
    flex: 1,
  },
  mapFooter: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addressInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  coordinatesInfo: {
    fontSize: 12,
    color: '#666',
  },
});

export default LocationPicker; 