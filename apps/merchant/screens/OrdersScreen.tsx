import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

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
    {
      id: '1',
      orderNumber: 'ORD001',
      customer: '张三',
      phone: '+34 612 345 678',
      items: ['苹果 x2', '香蕉 x3', '西红柿 x1'],
      total: 25.5,
      status: 'pending',
      time: '10:30',
      address: 'Calle Mayor 123',
    },
    {
      id: '2',
      orderNumber: 'ORD002',
      customer: '李四',
      phone: '+34 623 456 789',
      items: ['土豆 x5', '洋葱 x2'],
      total: 18.3,
      status: 'preparing',
      time: '10:15',
      address: 'Plaza España 45',
    },
    {
      id: '3',
      orderNumber: 'ORD003',
      customer: '王五',
      phone: '+34 634 567 890',
      items: ['生菜 x2', '黄瓜 x3', '胡萝卜 x2'],
      total: 32.8,
      status: 'delivering',
      time: '09:45',
      address: 'Gran Vía 78',
    },
  ]);

  const handleAction = (orderId, currentStatus) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[currentIndex + 1];
    
    if (nextStatus) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: nextStatus } : order
      ));
    }
  };

  const renderOrderItem = ({ item }) => {
    const status = STATUS_MAP[item.status];
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderTime}>{item.time}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Text style={[styles.statusText, { color: status.color }]>{status.label}</Text>
          </View>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.customer}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.itemsLabel}>订单内容:</Text>
          <Text style={styles.itemsText}>{item.items.join(', ')}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>配送地址:</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>合计:</Text>
          <Text style={styles.totalValue}>€{item.total}</Text>
        </View>

        {status.action && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: status.color }]}
            onPress={() => handleAction(item.id, item.status)}
          >
            <Text style={styles.actionButtonText}>{status.action}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const tabs = [
    { key: 'new', label: '新订单' },
    { key: 'processing', label: '处理中' },
    { key: 'history', label: '历史' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemsText: {
    fontSize: 14,
    color: '#333',
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});