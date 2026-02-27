import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);
  const [earnings, setEarnings] = useState({ today: 45.5, orders: 3 });
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: '1',
      orderNumber: '#20240227001',
      store: { name: '新鲜蔬果店', address: 'Calle Mayor 123', distance: 0.5 },
      customer: { address: 'Gran Vía 78', distance: 2.3 },
      items: ['苹果 x2', '香蕉 x3', '西红柿 x1'],
      total: 25.5,
      deliveryFee: 5.5,
      time: '10:30',
      urgent: true,
    },
    {
      id: '2',
      orderNumber: '#20240227002',
      store: { name: '绿色农场', address: 'Plaza España 45', distance: 1.2 },
      customer: { address: 'Calle Alcalá 100', distance: 3.1 },
      items: ['土豆 x5', '洋葱 x2'],
      total: 18.3,
      deliveryFee: 6.5,
      time: '10:25',
      urgent: false,
    },
    {
      id: '3',
      orderNumber: '#20240227003',
      store: { name: '有机生活', address: 'Calle Fuencarral 89', distance: 0.8 },
      customer: { address: 'Paseo de la Castellana 200', distance: 1.5 },
      items: ['生菜 x2', '黄瓜 x3'],
      total: 15.8,
      deliveryFee: 4.5,
      time: '10:20',
      urgent: false,
    },
  ]);

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOnline]);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const acceptOrder = (orderId) => {
    console.log('Accept order:', orderId);
  };

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderCard, item.urgent && styles.urgentCard]}>
      {item.urgent && (
        <View style={styles.urgentBadge}>
          <Text style={styles.urgentText}>加急</Text>
        </View>
      )}
      
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderTime}>{item.time}</Text>
        </View>
        <View style={styles.feeBadge}>
          <Text style={styles.feeText}>+€{item.deliveryFee}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <View style={[styles.dot, styles.pickupDot]} />
          <View style={styles.routeLine} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>取货</Text>
            <Text style={styles.routeName}>{item.store.name}</Text>
            <Text style={styles.routeAddress}>{item.store.address}</Text>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{item.store.distance} km</Text>
            </View>
          </View>
        </View>

        <View style={styles.routePoint}>
          <View style={[styles.dot, styles.deliveryDot]} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>送货</Text>
            <Text style={styles.routeAddress}>{item.customer.address}</Text>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{item.customer.distance} km</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.itemsLabel}>订单内容</Text>
        <View style={styles.itemsList}>
          {item.items.map((itemText, index) => (
            <View key={index} style={styles.itemTag}>
              <Text style={styles.itemText}>{itemText}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.acceptButton}
        onPress={() => acceptOrder(item.id)}
      >
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          style={styles.acceptGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.acceptButtonText}>立即接单</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>你好, 骑手小王 👋</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.onlineButton, isOnline && styles.onlineButtonActive]}
            onPress={toggleOnline}
          >
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: isOnline ? pulseAnim : 1 }] }]} />
            <Text style={styles.onlineButtonText}>
              {isOnline ? '在线' : '离线'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>€{earnings.today}</Text>
            <Text style={styles.statLabel}>今日收入</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{earnings.orders}</Text>
            <Text style={styles.statLabel}>已完成</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{isOnline ? availableOrders.length : 0}</Text>
            <Text style={styles.statLabel}>可接单</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Orders List */}
      {isOnline ? (
        <FlatList
          data={availableOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>☕️</Text>
              <Text style={styles.emptyText}>暂无新订单</Text>
              <Text style={styles.emptySubtext}>休息一下，等待新订单...</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.offlineContainer}>
          <View style={styles.offlineIcon}>
            <Text style={styles.offlineEmoji}>🛵</Text>
          </View>
          <Text style={styles.offlineTitle}>开始接单赚钱</Text>
          <Text style={styles.offlineText}>点击右上角按钮上线，开始接收配送订单</Text>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 小贴士</Text>
            <Text style={styles.tipsText}>• 保持手机电量充足</Text>
            <Text style={styles.tipsText}>• 确保网络连接稳定</Text>
            <Text style={styles.tipsText}>• 注意交通安全</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  onlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  onlineButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pulseCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  onlineButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  ordersList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  urgentCard: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  urgentBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  feeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  feeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  routeContainer: {
    marginBottom: 15,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
    marginTop: 2,
  },
  pickupDot: {
    backgroundColor: '#4CAF50',
  },
  deliveryDot: {
    backgroundColor: '#FF6B6B',
  },
  routeLine: {
    position: 'absolute',
    left: 6,
    top: 18,
    width: 2,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  distanceBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  distanceText: {
    fontSize: 11,
    color: '#666',
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemsLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
  },
  acceptButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  acceptGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  offlineIcon: {
    width: 120,
    height: 120,
    backgroundColor: '#E8F5E9',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  offlineEmoji: {
    fontSize: 50,
  },
  offlineTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  offlineText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});