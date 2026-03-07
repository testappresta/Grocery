import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const STATUS_MAP = { delivering: { label: '配送中', color: '#00BCD4', action: '已送达' }, completed: { label: '已完成', color: '#4CAF50', action: null }, cancelled: { label: '已取消', color: '#999', action: null } };

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('current');
  const [orders, setOrders] = useState([
    { id: '1', orderNumber: 'ORD001', store: { name: '新鲜蔬果店', address: 'Calle Mayor 123, Madrid', phone: '+34 612 345 678' }, customer: { name: '张三', address: 'Gran Vía 78, Madrid', phone: '+34 612 345 679' }, items: ['苹果 x2', '香蕉 x3'], total: 25.5, deliveryFee: 5.0, status: 'delivering', time: '10:30' },
    { id: '2', orderNumber: 'ORD002', store: { name: '绿色农场', address: 'Plaza España 45, Madrid', phone: '+34 623 456 789' }, customer: { name: '李四', address: 'Calle Alcalá 100, Madrid', phone: '+34 623 456 790' }, items: ['土豆 x5', '洋葱 x2'], total: 18.3, deliveryFee: 4.5, status: 'completed', time: '09:15' },
  ]);

  const updateStatus = (orderId) => { setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'completed' } : order)); };

  const renderOrderItem = ({ item }) => {
    const status = STATUS_MAP[item.status];
    const isCurrent = item.status === 'delivering';
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View><Text style={styles.orderNumber}>{item.orderNumber}</Text><Text style={styles.orderTime}>⏰ {item.time}</Text></View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '18' }]}><View style={[styles.statusDot, { backgroundColor: status.color }]} /><Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text></View>
        </View>
        {isCurrent && (<>
          <View style={styles.contactSection}>
            <View style={styles.contactItem}><Text style={styles.contactLabel}>🏪 取货店铺</Text><Text style={styles.contactName}>{item.store.name}</Text><Text style={styles.contactAddress}>{item.store.address}</Text><TouchableOpacity style={styles.callButton}><Text style={styles.callButtonText}>📞 联系店铺</Text></TouchableOpacity></View>
            <View style={styles.contactDivider} />
            <View style={styles.contactItem}><Text style={styles.contactLabel}>👤 送货客户</Text><Text style={styles.contactName}>{item.customer.name}</Text><Text style={styles.contactAddress}>{item.customer.address}</Text><TouchableOpacity style={styles.callButton}><Text style={styles.callButtonText}>📞 联系客户</Text></TouchableOpacity></View>
          </View>
          <View style={styles.itemsContainer}><Text style={styles.itemsLabel}>🛒 订单内容</Text><Text style={styles.itemsText}>{item.items.join('、')}</Text></View>
          <View style={styles.orderFooter}>
            <View><Text style={styles.earningsLabel}>配送费</Text><Text style={styles.earningsValue}>€{item.deliveryFee.toFixed(1)}</Text></View>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: status.color }]} onPress={() => updateStatus(item.id)}><Text style={styles.actionButtonText}>✅ {status.action}</Text></TouchableOpacity>
          </View>
        </>)}
        {!isCurrent && (<View style={styles.completedInfo}><Text style={styles.completedAddress}>📍 {item.customer.address}</Text><View style={styles.completedBottom}><Text style={styles.completedTime}>完成: {item.time}</Text><Text style={styles.completedFee}>+€{item.deliveryFee.toFixed(1)}</Text></View></View>)}
      </View>
    );
  };

  const filteredOrders = activeTab === 'current' ? orders.filter(o => o.status === 'delivering') : orders.filter(o => o.status !== 'delivering');
  const tabs = [{ key: 'current', label: '进行中', count: orders.filter(o => o.status === 'delivering').length }, { key: 'history', label: '已完成', count: orders.filter(o => o.status !== 'delivering').length }];

  return (
    <View style={styles.screen}><View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.activeTab]} onPress={() => setActiveTab(tab.key)}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
            {tab.count > 0 && <View style={[styles.tabBadge, activeTab === tab.key && styles.activeTabBadge]}><Text style={[styles.tabBadgeText, activeTab === tab.key && styles.activeTabBadgeText]}>{tab.count}</Text></View>}
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filteredOrders} renderItem={renderOrderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.emptyContainer}><Text style={{ fontSize: 48 }}>📭</Text><Text style={styles.emptyText}>暂无订单</Text></View>} />
    </View></View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent', gap: 6 },
  activeTab: { borderBottomColor: '#00B578' },
  tabText: { fontSize: 15, color: '#999', fontWeight: '500' },
  activeTabText: { color: '#00B578', fontWeight: '700' },
  tabBadge: { backgroundColor: '#F0F0F0', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  activeTabBadge: { backgroundColor: '#00B578' },
  tabBadgeText: { fontSize: 11, fontWeight: '700', color: '#999' },
  activeTabBadgeText: { color: '#FFFFFF' },
  listContainer: { padding: 16, paddingBottom: 32 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  orderNumber: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  orderTime: { fontSize: 12, color: '#999', marginTop: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '700' },
  contactSection: { backgroundColor: '#FAFAFA', borderRadius: 14, padding: 14, marginBottom: 14 },
  contactItem: { marginVertical: 4 },
  contactLabel: { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 6 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  contactAddress: { fontSize: 13, color: '#666', marginTop: 2 },
  callButton: { backgroundColor: '#E8F9F0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', marginTop: 8 },
  callButtonText: { color: '#00B578', fontSize: 13, fontWeight: '600' },
  contactDivider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 12 },
  itemsContainer: { backgroundColor: '#FAFAFA', padding: 12, borderRadius: 12, marginBottom: 14 },
  itemsLabel: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 4 },
  itemsText: { fontSize: 14, color: '#1A1A1A' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  earningsLabel: { fontSize: 12, color: '#999' },
  earningsValue: { fontSize: 22, fontWeight: '800', color: '#00B578' },
  actionButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  actionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  completedInfo: { paddingTop: 8 },
  completedAddress: { fontSize: 14, color: '#666' },
  completedBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  completedTime: { fontSize: 12, color: '#999' },
  completedFee: { fontSize: 18, fontWeight: '800', color: '#00B578' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#999', fontWeight: '500', marginTop: 12 },
});
