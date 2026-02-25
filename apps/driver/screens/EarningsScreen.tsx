import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function EarningsScreen() {
  const earnings = {
    today: 45.5,
    week: 285.0,
    month: 1256.8,
    total: 5680.5,
  };

  const weeklyData = [
    { day: '周一', amount: 35.0, orders: 7 },
    { day: '周二', amount: 42.5, orders: 8 },
    { day: '周三', amount: 28.0, orders: 5 },
    { day: '周四', amount: 55.0, orders: 10 },
    { day: '周五', amount: 48.5, orders: 9 },
    { day: '周六', amount: 65.0, orders: 12 },
    { day: '周日', amount: 45.5, orders: 8 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>收入统计</Text>

      {/* 总收入卡片 */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>累计收入</Text>
        <Text style={styles.totalAmount}>€{earnings.total}</Text>
      </View>

      {/* 统计卡片 */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>今日</Text>
          <Text style={styles.statAmount}>€{earnings.today}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>本周</Text>
          <Text style={styles.statAmount}>€{earnings.week}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>本月</Text>
          <Text style={styles.statAmount}>€{earnings.month}</Text>
        </View>
      </View>

      {/* 本周明细 */}
      <View style={styles.weeklySection}>
        <Text style={styles.sectionTitle}>本周明细</Text>
        
        {weeklyData.map((item, index) => (
          <View key={index} style={styles.weeklyItem}>
            <Text style={styles.dayText}>{item.day}</Text>
            <View style={styles.orderInfo}>
              <Text style={styles.orderCount}>{item.orders}单</Text>
            </View>
            <Text style={styles.dayAmount}>€{item.amount}</Text>
          </View>
        ))}
      </View>

      {/* 提现按钮 */}
      <TouchableOpacity style={styles.withdrawButton}>
        <Text style={styles.withdrawButtonText}>提现</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalCard: {
    backgroundColor: '#4CAF50',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  weeklySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  weeklyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 16,
    width: 50,
  },
  orderInfo: {
    flex: 1,
  },
  orderCount: {
    fontSize: 14,
    color: '#666',
  },
  dayAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});