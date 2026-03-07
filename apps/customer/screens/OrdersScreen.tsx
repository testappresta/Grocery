import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { orderAPI } from '../services/api';

const STATUS_MAP = {
  pending: { label: '待支付', color: '#FF9800', icon: '💰' },
  confirmed: { label: '已确认', color: '#2196F3', icon: '✅' },
  preparing: { label: '准备中', color: '#9C27B0', icon: '👨‍🍳' },
  ready: { label: '待配送', color: '#FF5722', icon: '📦' },
  delivering: { label: '配送中', color: '#00BCD4', icon: '🚚' },
  delivered: { label: '已送达', color: '#00B578', icon: '🎉' },
  cancelled: { label: '已取消', color: '#999', icon: '❌' },
  refunded: { label: '已退款', color: '#999', icon: '💸' },
};

export default function OrdersScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      const params = activeTab !== 'all' ? { status: activeTab } : {};
      const response = await orderAPI.getOrders(params);
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const renderOrderItem = ({ item }) => {
    const status = STATUS_MAP[item.status];

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
      >
        <View style={styles.orderHeader}>
          <View style={styles.storeInfo}>
            <Text style={styles.storeIcon}>🏪</Text>
            <Text style={styles.storeName} numberOfLines={1}>{item.store?.name || '未知店铺'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
            <Text style={styles.statusIcon}>{status.icon}</Text>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          <View style={styles.itemsPreview}>
            <Text style={styles.itemsText} numberOfLines={2}>
              {item.items.map(i => i.name).join('、')}
            </Text>
          </View>
          <Text style={styles.itemCount}>共{item.items.length}件</Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTime}>
            {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={styles.orderTotalRow}>
            <Text style={styles.orderTotalLabel}>实付 </Text>
            <Text style={styles.orderTotalCurrency}>€</Text>
            <Text style={styles.orderTotal}>{item.total}</Text>
          </View>
        </View>

        {item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item._id)}
            >
              <Text style={styles.cancelButtonText}>取消订单</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => navigation.navigate('Payment', { orderId: item._id })}
            >
              <Text style={styles.payButtonText}>立即支付</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleCancel = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId);
      loadOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待支付' },
    { key: 'delivering', label: '配送中' },
    { key: 'delivered', label: '已完成' },
  ];

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00B578" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
              {activeTab === tab.key && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00B578']} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>暂无订单</Text>
              <Text style={styles.emptySubtitle}>快去下一单吧</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {},
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#00B578',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00B578',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6FA',
  },
  itemsPreview: {
    flex: 1,
  },
  itemsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  itemCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
  },
  orderTotalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  orderTotalLabel: {
    fontSize: 12,
    color: '#666',
  },
  orderTotalCurrency: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B35',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F6FA',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#00B578',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#00B578',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
});
