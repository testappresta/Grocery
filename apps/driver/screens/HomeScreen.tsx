import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([
    { id: '1', orderNumber: 'ORD001', store: { name: '新鲜蔬果店', address: 'Calle Mayor 123, Madrid', distance: '0.5 km' }, customer: { address: 'Gran Vía 78, Madrid', distance: '2.3 km' }, items: ['苹果 x2', '香蕉 x3'], total: 25.5, deliveryFee: 5.0, time: '10:30' },
    { id: '2', orderNumber: 'ORD002', store: { name: '绿色农场', address: 'Plaza España 45, Madrid', distance: '1.2 km' }, customer: { address: 'Calle Alcalá 100, Madrid', distance: '3.1 km' }, items: ['土豆 x5', '洋葱 x2', '西红柿 x3'], total: 32.8, deliveryFee: 6.5, time: '10:25' },
  ]);

  useEffect(() => {}, []);

  const onRefresh = async () => { setRefreshing(true); setRefreshing(false); };
  const acceptOrder = (orderId) => { navigation.navigate('Map', { orderId }); };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View><Text style={styles.orderNumber}>{item.orderNumber}</Text><Text style={styles.orderTime}>⏰ {item.time}</Text></View>
        <View style={styles.feeTag}><Text style={styles.feeLabel}>配送费</Text><Text style={styles.feeValue}>€{item.deliveryFee.toFixed(1)}</Text></View>
      </View>
      <View style={styles.routeContainer}>
        <View style={styles.routeTimeline}><View style={styles.routeDotGreen} /><View style={styles.routeLine} /><View style={styles.routeDotRed} /></View>
        <View style={styles.routeDetails}>
          <View style={styles.routeStop}><View style={styles.routeStopHeader}><Text style={styles.routeLabel}>📦 取货点</Text><Text style={styles.routeDistance}>{item.store.distance}</Text></View><Text style={styles.routeStoreName}>{item.store.name}</Text><Text style={styles.routeAddress} numberOfLines={1}>{item.store.address}</Text></View>
          <View style={styles.routeStop}><View style={styles.routeStopHeader}><Text style={styles.routeLabel}>📍 送货点</Text><Text style={styles.routeDistance}>{item.customer.distance}</Text></View><Text style={styles.routeAddress} numberOfLines={1}>{item.customer.address}</Text></View>
        </View>
      </View>
      <View style={styles.itemsRow}><Text style={styles.itemsEmoji}>🛒</Text><Text style={styles.itemsText} numberOfLines={1}>{item.items.join('、')}</Text></View>
      <TouchableOpacity style={styles.acceptButton} onPress={() => acceptOrder(item.id)} activeOpacity={0.85}>
        <Text style={styles.acceptButtonText}>立即接单</Text><Text style={styles.acceptFee}>€{item.deliveryFee.toFixed(1)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}><View style={styles.container}>
      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <View style={[styles.statusIndicator, online ? styles.indicatorOnline : styles.indicatorOffline]}><View style={[styles.statusDot, online ? styles.dotOnline : styles.dotOffline]} /></View>
          <View><Text style={styles.statusTitle}>{online ? '在线接单中' : '当前离线'}</Text><Text style={styles.statusSubtitle}>{online ? '正在为您寻找附近订单' : '点击上线开始接单'}</Text></View>
        </View>
        <TouchableOpacity style={[styles.toggleButton, online ? styles.toggleOff : styles.toggleOn]} onPress={() => setOnline(!online)} activeOpacity={0.85}><Text style={styles.toggleText}>{online ? '下线' : '上线'}</Text></TouchableOpacity>
      </View>
      {online && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#00B578' }]}>{availableOrders.length}</Text><Text style={styles.statLabel}>可接订单</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#2196F3' }]}>3</Text><Text style={styles.statLabel}>今日完成</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#FF6B35' }]}>€25.5</Text><Text style={styles.statLabel}>今日收入</Text></View>
        </View>
      )}
      {online ? (
        <FlatList data={availableOrders} renderItem={renderOrderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00B578']} />} ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyIcon}>🔍</Text><Text style={styles.emptyText}>暂无可用订单</Text></View>} />
      ) : (
        <View style={styles.offlineContainer}><Text style={styles.offlineIcon}>🛵</Text><Text style={styles.offlineTitle}>准备好开始配送了吗？</Text><Text style={styles.offlineText}>点击上方按钮上线开始接单</Text></View>
      )}
    </View></View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center' },
  statusCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statusLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  statusIndicator: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  indicatorOnline: { backgroundColor: '#E8F9F0' },
  indicatorOffline: { backgroundColor: '#F5F5F5' },
  statusDot: { width: 16, height: 16, borderRadius: 8 },
  dotOnline: { backgroundColor: '#00B578' },
  dotOffline: { backgroundColor: '#BDBDBD' },
  statusTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  statusSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  toggleButton: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24, marginLeft: 12 },
  toggleOn: { backgroundColor: '#00B578' },
  toggleOff: { backgroundColor: '#FF4444' },
  toggleText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#999', marginTop: 4, fontWeight: '500' },
  listContainer: { padding: 16, paddingBottom: 32 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  orderNumber: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  orderTime: { fontSize: 12, color: '#999', marginTop: 3 },
  feeTag: { backgroundColor: '#E8F9F0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  feeLabel: { fontSize: 10, color: '#00B578', fontWeight: '500' },
  feeValue: { fontSize: 18, fontWeight: '800', color: '#00B578' },
  routeContainer: { flexDirection: 'row', marginBottom: 12 },
  routeTimeline: { width: 24, alignItems: 'center', paddingTop: 6 },
  routeDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00B578' },
  routeLine: { width: 2, flex: 1, backgroundColor: '#E0E0E0', marginVertical: 4 },
  routeDotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5722' },
  routeDetails: { flex: 1, gap: 14 },
  routeStop: { gap: 2 },
  routeStopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeLabel: { fontSize: 12, color: '#999', fontWeight: '600' },
  routeDistance: { fontSize: 12, color: '#00B578', fontWeight: '700' },
  routeStoreName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  routeAddress: { fontSize: 13, color: '#666' },
  itemsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 10, padding: 10, marginBottom: 14, gap: 8 },
  itemsEmoji: { fontSize: 16 },
  itemsText: { fontSize: 13, color: '#666', flex: 1 },
  acceptButton: { backgroundColor: '#00B578', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 14, gap: 8 },
  acceptButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  acceptFee: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  offlineContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  offlineIcon: { fontSize: 64, marginBottom: 20 },
  offlineTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  offlineText: { fontSize: 15, color: '#999', textAlign: 'center' },
});
