import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;

  // 模拟坐标
  const storeLocation = {
    latitude: 40.4168,
    longitude: -3.7038,
    title: '取货地点',
    description: '新鲜蔬果店',
  };

  const customerLocation = {
    latitude: 40.4188,
    longitude: -3.6918,
    title: '送货地点',
    description: '客户地址',
  };

  const initialRegion = {
    latitude: (storeLocation.latitude + customerLocation.latitude) / 2,
    longitude: (storeLocation.longitude + customerLocation.longitude) / 2,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Marker
          coordinate={storeLocation}
          title={storeLocation.title}
          description={storeLocation.description}
          pinColor="green"
        />
        
        <Marker
          coordinate={customerLocation}
          title={customerLocation.title}
          description={customerLocation.description}
          pinColor="red"
        />

        <Polyline
          coordinates={[storeLocation, customerLocation]}
          strokeColor="#4CAF50"
          strokeWidth={3}
        />
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>配送导航</Text>
        <View style={styles.routeInfo}>
          <View style={styles.routeItem}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <Text>取货: 新鲜蔬果店</Text>
          </View>
          <View style={styles.routeItem}>
            <View style={[styles.dot, { backgroundColor: '#ff4444' }]} />
            <Text>送货: Gran Vía 78</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>2.3 km</Text>
            <Text style={styles.statLabel}>距离</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>8 min</Text>
            <Text style={styles.statLabel}>预计时间</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.completeButtonText}>确认送达</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  routeInfo: {
    marginBottom: 15,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});