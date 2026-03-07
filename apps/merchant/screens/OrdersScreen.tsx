import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const STATUS_MAP = {
  pending: { label: '待确认', color: '#FF9800', action: '确认订单' },
  confirmed: { label: '已确认', color: '#2196F3', action: '开始备餐' },
  preparing: { label: '备餐中', color: '#9C27B0', action: '备餐完成' },
  ready: { label: '待配送', color: '#FF5722', action: '通知骑手' },
  delivering: { label: '配送中', color: '#00BCD4', action: '查看位置' },
  delivered: { label: '已完成', color: '#4CAF50', action: null },
  cancelled: { label: '已取消', color: '#999', action: null },
};

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('new');
  const [orders, setOrders] = useState([
    { id: '1', orderNumber: 'ORD001', customer: '张三', phone: '+34 612 345 678', items: ['苹果 x2', '香蕉 x3', '西红柿 x1'], total: 25.5, status: 'pending', time: '10:30', address: 'Calle Mayor 123' },
    { id: '2', orderNumber: 'ORD002', customer: '李四', phone: '+34 623 456 789', items: ['土豆 x5', '洋葱 x2'], total: 18.3, status: 'preparing', time: '10:15', address: 'Plaza España 45' },
    { id: '3', orderNumber: 'ORD003', customer: '王五', phone: '+34 634 567 890', items: ['生菜 x2', '黄瓜 x3', '胡萝卜 x2'], total: 32.8, status: 'delivering', time: '09:45', address: 'Gran Vía 78' },
  ]);

  const handleAction = (orderId, currentStatus) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[currentIndex + 1];
    if (nextStatus) {
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: nextStatus } : order));
    }
  };

  const getTabCounts = () => {
    const newCount = orders.filter(o => o.status === 'pending').length;
    const processingCount = orders.filter(o => ['confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)).length;
    const historyCount = orders.filter(o => ['delivered', 'cancelled'].includes(o.status)).length;
    return { new: newCount, processing: processingCount, history: historyCount };
  };
  const counts = getTabCounts();

  const renderOrderItem = ({ item }) => {
    const status = STATUS_MAP[item.status];
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderTime}>⏰ {item.time}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '18' }]}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <View style={styles.customerSection}>
          <Text style={styles.customerEmoji}>👤</Text>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.customerPhone}>{item.phone}</Text>
          </View>
        </View>
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsLabel}>📦 订单内容</Text>
          <Text style={styles.itemsText}>{item.items.join('、')}</Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>📍 配送地址</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.totalLabel}>订单金额</Text>
            <Text style={styles.totalValue}>€{item.total.toFixed(2)}</Text>
          </View>
          {status.action && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: status.color }]} onPress={() => handleAction(item.id, item.status)} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>{status.action}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const tabs = [
    { key: 'new', label: '新订单', count: counts.new },
    { key: 'processing', label: '处理中', count: counts.processing },
    { key: 'history', label: '历史', count: counts.history },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.activeTab]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.7}>
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
              {tab.count > 0 && (
                <View style={[styles.tabBadge, activeTab === tab.key && styles.activeTabBadge]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab.key && styles.activeTabBadgeText]}>{tab.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <FlatList data={orders} renderItem={renderOrderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent', gap: 6 },
  activeTab: { borderBottomColor: '#FF6B35' },
  tabText: { fontSize: 14, color: '#999', fontWeight: '500' },
  activeTabText: { color: '#FF6B35', fontWeight: '700' },
  tabBadge: { backgroundColor: '#F0F0F0', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  activeTabBadge: { backgroundColor: '#FF6B35' },
  tabBadgeText: { fontSize: 11, fontWeight: '700', color: '#999' },
  activeTabBadgeText: { color: '#FFFFFF' },
  listContainer: { padding: 16, paddingBottom: 32 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  orderNumber: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  orderTime: { fontSize: 12, color: '#999', marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '700' },
  customerSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12 },
  customerEmoji: { fontSize: 20, marginRight: 10 },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  customerPhone: { fontSize: 13, color: '#666', marginTop: 2 },
  itemsContainer: { marginBottom: 10 },
  itemsLabel: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 4 },
  itemsText: { fontSize: 14, color: '#1A1A1A', lineHeight: 20 },
  addressContainer: { marginBottom: 14 },
  addressLabel: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 4 },
  addressText: { fontSize: 14, color: '#1A1A1A' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  totalLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  totalValue: { fontSize: 22, fontWeight: '800', color: '#FF6B35' },
  actionButton: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 24 },
  actionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
