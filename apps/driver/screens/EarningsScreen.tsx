import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function EarningsScreen() {
  const earnings = { today: 45.5, week: 285.0, month: 1256.8, total: 5680.5 };
  const weeklyData = [
    { day: '周一', amount: 35.0, orders: 7 }, { day: '周二', amount: 42.5, orders: 8 }, { day: '周三', amount: 28.0, orders: 5 },
    { day: '周四', amount: 55.0, orders: 10 }, { day: '周五', amount: 48.5, orders: 9 }, { day: '周六', amount: 65.0, orders: 12 }, { day: '周日', amount: 45.5, orders: 8 },
  ];
  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.totalCard}>
          <Text style={styles.totalIcon}>💰</Text>
          <Text style={styles.totalLabel}>累计收入</Text>
          <View style={styles.totalAmountRow}><Text style={styles.totalCurrency}>€</Text><Text style={styles.totalAmount}>{earnings.total.toFixed(1)}</Text></View>
          <View style={styles.totalDivider} />
          <View style={styles.totalStats}>
            <View style={styles.totalStatItem}><Text style={styles.totalStatValue}>{weeklyData.reduce((s, d) => s + d.orders, 0)}</Text><Text style={styles.totalStatLabel}>本周单数</Text></View>
            <View style={styles.totalStatItem}><Text style={styles.totalStatValue}>€{(earnings.week / weeklyData.reduce((s, d) => s + d.orders, 0)).toFixed(1)}</Text><Text style={styles.totalStatLabel}>平均单价</Text></View>
          </View>
        </View>
        <View style={styles.periodRow}>
          <View style={styles.periodCard}><Text style={{ fontSize: 20 }}>☀️</Text><Text style={styles.periodLabel}>今日</Text><Text style={styles.periodAmount}>€{earnings.today.toFixed(1)}</Text></View>
          <View style={styles.periodCard}><Text style={{ fontSize: 20 }}>📅</Text><Text style={styles.periodLabel}>本周</Text><Text style={[styles.periodAmount, { color: '#2196F3' }]}>€{earnings.week.toFixed(1)}</Text></View>
          <View style={styles.periodCard}><Text style={{ fontSize: 20 }}>📊</Text><Text style={styles.periodLabel}>本月</Text><Text style={[styles.periodAmount, { color: '#FF6B35' }]}>€{earnings.month.toFixed(1)}</Text></View>
        </View>
        <View style={styles.weeklyCard}>
          <Text style={styles.weeklyTitle}>📋 本周明细</Text>
          {weeklyData.map((item, index) => (
            <View key={index} style={[styles.weeklyItem, index === weeklyData.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.dayText}>{item.day}</Text>
              <View style={styles.barContainer}><View style={[styles.bar, { width: `${(item.amount / maxAmount) * 100}%` }]} /></View>
              <View style={styles.dayRight}><Text style={styles.orderCount}>{item.orders}单</Text><Text style={styles.dayAmount}>€{item.amount.toFixed(1)}</Text></View>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.withdrawButton} activeOpacity={0.85}>
          <Text style={{ fontSize: 18 }}>💳</Text><Text style={styles.withdrawButtonText}>申请提现</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { maxWidth: 480, width: '100%', alignSelf: 'center', padding: 16, paddingBottom: 32 },
  totalCard: { backgroundColor: '#00B578', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#00B578', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  totalIcon: { fontSize: 28, marginBottom: 4 },
  totalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  totalAmountRow: { flexDirection: 'row', alignItems: 'flex-start' },
  totalCurrency: { fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginTop: 6, marginRight: 2 },
  totalAmount: { fontSize: 44, fontWeight: '900', color: '#FFFFFF' },
  totalDivider: { width: '80%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16 },
  totalStats: { flexDirection: 'row', width: '100%' },
  totalStatItem: { flex: 1, alignItems: 'center' },
  totalStatValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  totalStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  periodRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  periodCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  periodLabel: { fontSize: 12, color: '#999', marginTop: 6, marginBottom: 4 },
  periodAmount: { fontSize: 18, fontWeight: '800', color: '#00B578' },
  weeklyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  weeklyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
  weeklyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dayText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', width: 40 },
  barContainer: { flex: 1, height: 8, backgroundColor: '#F5F5F5', borderRadius: 4, marginHorizontal: 12, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: '#00B578', borderRadius: 4 },
  dayRight: { alignItems: 'flex-end', minWidth: 70 },
  orderCount: { fontSize: 11, color: '#999' },
  dayAmount: { fontSize: 15, fontWeight: '700', color: '#00B578' },
  withdrawButton: { backgroundColor: '#00B578', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 16, gap: 8 },
  withdrawButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});
