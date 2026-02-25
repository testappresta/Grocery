import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: '1',
      orderNumber: 'ORD001',
      store: {
        name: '新鲜蔬果店',
        address: 'Calle Mayor 123, Madrid',
        distance: '0.5 km',
      },
      customer: {
        address: 'Gran Vía 78, Madrid',
        distance: '2.3 km',
      },
      items: ['苹果 x2', '香蕉 x3'],
      total: 25.5,
      deliveryFee: 5.0,
      time: '10:30',
    },
    {
      id: '2',
      orderNumber: 'ORD002',
      store: {
        name: '绿色农场',
        address: 'Plaza España 45, Madrid',
        distance: '1.2 km',
      },
      customer: {
        address: 'Calle Alcalá 100, Madrid',
        distance: '3.1 km',
      },
      items: ['土豆 x5', '洋葱 x2', '西红柿 x3'],
      total: 32.8,
      deliveryFee: 6.5,
      time: '10:25',
    },
  ]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // 刷新订单列表
    setRefreshing(false);
  };

  const acceptOrder = (orderId) => {
    // 接单逻辑
    navigation.navigate('Map', { orderId });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <Text style={styles.deliveryFee}>+€{item.deliveryFee}</Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>取货</Text>
          <Text style={styles.locationText}>{item.store.name}</Text>
          <Text style={styles.distanceText}>{item.store.distance}</Text>
        </View>

        <View style={styles.arrow}>
          <Text>↓</Text>
        </View>

        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>送货</Text>
          <Text style={styles.locationText} numberOfLines={1}>{item.customer.address}</Text>
          <Text style={styles.distanceText}>{item.customer.distance}</Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.itemsText}>{item.items.join(', ')}</Text>
      </View>

      <TouchableOpacity 
        style={styles.acceptButton}
        onPress={() => acceptOrder(item.id)}
      >
        <Text style={styles.acceptButtonText}>立即接单</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 在线状态切换 */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>{online ? '在线接单中' : '离线'}</Text>
        <TouchableOpacity 
          style={[styles.statusButton, online ? styles.onlineButton : styles.offlineButton]}
          onPress={() => setOnline(!online)}
        >
          <Text style={styles.statusButtonText}>
            {online ? '下线' : '上线'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 统计信息 */}
      {online && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{availableOrders.length}</Text>
            <Text style={styles.statLabel}>可接订单</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>今日完成</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>€25.5</Text>
            <Text style={styles.statLabel}>今日收入</Text>
          </View>
        </View>
      )}

      {/* 订单列表 */}
      {online ? (
        <FlatList
          data={availableOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无可用订单</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>点击上线开始接单</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  onlineButton: {
    backgroundColor: '#ff4444',
  },
  offlineButton: {
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  orderCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryFee: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationItem: {
    marginVertical: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: '#999',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  arrow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  itemsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemsText: {
    fontSize: 14,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 18,
    color: '#999',
  },
});