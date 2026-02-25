import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const STATUS_MAP = {
  delivering: { label: '配送中', color: '#00BCD4', action: '已送达' },
  completed: { label: '已完成', color: '#4CAF50', action: null },
  cancelled: { label: '已取消', color: '#999', action: null },
};

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('current');
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNumber: 'ORD001',
      store: {
        name: '新鲜蔬果店',
        address: 'Calle Mayor 123, Madrid',
        phone: '+34 612 345 678',
      },
      customer: {
        name: '张三',
        address: 'Gran Vía 78, Madrid',
        phone: '+34 612 345 679',
      },
      items: ['苹果 x2', '香蕉 x3'],
      total: 25.5,
      deliveryFee: 5.0,
      status: 'delivering',
      time: '10:30',
    },
    {
      id: '2',
      orderNumber: 'ORD002',
      store: {
        name: '绿色农场',
        address: 'Plaza España 45, Madrid',
        phone: '+34 623 456 789',
      },
      customer: {
        name: '李四',
        address: 'Calle Alcalá 100, Madrid',
        phone: '+34 623 456 790',
      },
      items: ['土豆 x5', '洋葱 x2'],
      total: 18.3,
      deliveryFee: 4.5,
      status: 'completed',
      time: '09:15',
    },
  ]);

  const updateStatus = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
  };

  const renderOrderItem = ({ item }) => {
    const status = STATUS_MAP[item.status];
    const isCurrent = item.status === 'delivering';
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Text style={[styles.statusText, { color: status.color }]>{status.label}</Text>
          </View>
        </View>

        {isCurrent && (
          <>
            <View style={styles.contactSection}>
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>取货店铺</Text>
                <Text style={styles.contactName}>{item.store.name}</Text>
                <Text style={styles.contactAddress}>{item.store.address}</Text>
                <TouchableOpacity style={styles.callButton}>
                  <Text style={styles.callButtonText}>📞 联系店铺</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>送货客户</Text>
                <Text style={styles.contactName}>{item.customer.name}</Text>
                <Text style={styles.contactAddress}>{item.customer.address}</Text>
                <TouchableOpacity style={styles.callButton}>
                  <Text style={styles.callButtonText}>📞 联系客户</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemsContainer}>
              <Text style={styles.itemsLabel}>订单内容:</Text>
              <Text style={styles.itemsText}>{item.items.join(', ')}</Text>
            </View>

            <View style={styles.orderFooter}>
              <View>
                <Text style={styles.earningsLabel}>配送费</Text>
                <Text style={styles.earningsValue}>€{item.deliveryFee}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: status.color }]}
                onPress={() => updateStatus(item.id)}
              >
                <Text style={styles.actionButtonText}>{status.action}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isCurrent && (
          <View style={styles.completedInfo}>
            <Text style={styles.completedText}>{item.customer.address}</Text>
            <Text style={styles.completedTime}>完成时间: {item.time}</Text>
            <Text style={styles.earningsValue}>+€{item.deliveryFee}</Text>
          </View>
        )}
      </View>
    );
  };

  const filteredOrders = activeTab === 'current' 
    ? orders.filter(o => o.status === 'delivering')
    : orders.filter(o => o.status !== 'delivering');

  const tabs = [
    { key: 'current', label: '进行中' },
    { key: 'history', label: '已完成' },
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
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无订单</Text>
          </View>
        }
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
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
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
  contactSection: {
    marginBottom: 12,
  },
  contactItem: {
    marginVertical: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  callButton: {
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  callButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  itemsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  itemsText: {
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
  },
  earningsLabel: {
    fontSize: 12,
    color: '#999',
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedInfo: {
    paddingTop: 10,
  },
  completedText: {
    fontSize: 14,
    color: '#666',
  },
  completedTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});