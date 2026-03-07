import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    todayOrders: 12,
    todayRevenue: 258.5,
    weekOrders: 89,
    weekRevenue: 1856.3,
    monthOrders: 356,
    monthRevenue: 7856.8,
  });

  const revenueData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [{
      data: [120, 150, 180, 220, 280, 350, 280],
    }],
  };

  const orderData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [{
      data: [8, 10, 12, 15, 20, 25, 18],
    }],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '5', strokeWidth: '2', stroke: '#FF6B35' },
  };

  const chartWidth = Math.min(screenWidth - 64, 480 - 64);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>📈</Text>
          <Text style={styles.sectionTitle}>今日概览</Text>
        </View>
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { backgroundColor: '#FFF3ED' }]}>
            <View style={styles.kpiIconWrap}>
              <Text style={styles.kpiIcon}>📦</Text>
            </View>
            <Text style={styles.kpiValue}>{stats.todayOrders}</Text>
            <Text style={styles.kpiLabel}>今日订单</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#EDF7FF' }]}>
            <View style={styles.kpiIconWrap}>
              <Text style={styles.kpiIcon}>💰</Text>
            </View>
            <Text style={[styles.kpiValue, { color: '#2196F3' }]}>€{stats.todayRevenue}</Text>
            <Text style={styles.kpiLabel}>今日营收</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>📅</Text>
          <Text style={styles.sectionTitle}>周期数据</Text>
        </View>
        <View style={styles.periodCard}>
          <View style={styles.periodRow}>
            <View style={styles.periodItem}>
              <Text style={styles.periodLabel}>本周订单</Text>
              <Text style={styles.periodValue}>{stats.weekOrders}</Text>
            </View>
            <View style={styles.periodDivider} />
            <View style={styles.periodItem}>
              <Text style={styles.periodLabel}>本周营收</Text>
              <Text style={[styles.periodValue, { color: '#FF6B35' }]}>€{stats.weekRevenue}</Text>
            </View>
          </View>
          <View style={styles.periodSeparator} />
          <View style={styles.periodRow}>
            <View style={styles.periodItem}>
              <Text style={styles.periodLabel}>本月订单</Text>
              <Text style={styles.periodValue}>{stats.monthOrders}</Text>
            </View>
            <View style={styles.periodDivider} />
            <View style={styles.periodItem}>
              <Text style={styles.periodLabel}>本月营收</Text>
              <Text style={[styles.periodValue, { color: '#FF6B35' }]}>€{stats.monthRevenue}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartEmoji}>📊</Text>
            <Text style={styles.chartTitle}>本周营收趋势</Text>
          </View>
          <LineChart data={revenueData} width={chartWidth} height={200} chartConfig={chartConfig} bezier style={styles.chart} />
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartEmoji}>📈</Text>
            <Text style={styles.chartTitle}>本周订单趋势</Text>
          </View>
          <BarChart data={orderData} width={chartWidth} height={200} chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})` }} style={styles.chart} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { maxWidth: 480, width: '100%', alignSelf: 'center', padding: 16, paddingBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionEmoji: { fontSize: 18, marginRight: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  kpiRow: { flexDirection: 'row', marginBottom: 20, gap: 12 },
  kpiCard: { flex: 1, borderRadius: 16, padding: 18, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  kpiIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  kpiIcon: { fontSize: 22 },
  kpiValue: { fontSize: 26, fontWeight: '800', color: '#FF6B35', marginBottom: 4 },
  kpiLabel: { fontSize: 13, color: '#666', fontWeight: '500' },
  periodCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  periodRow: { flexDirection: 'row', alignItems: 'center' },
  periodItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  periodDivider: { width: 1, height: 36, backgroundColor: '#F0F0F0' },
  periodSeparator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  periodLabel: { fontSize: 13, color: '#999', marginBottom: 6 },
  periodValue: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  chartEmoji: { fontSize: 16, marginRight: 8 },
  chartTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  chart: { borderRadius: 12, marginLeft: -8 },
});
