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
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>经营数据</Text>

      {/* 今日数据 */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.statLabel}>今日订单</Text>
          <Text style={styles.statValue}>{stats.todayOrders}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.statLabel}>今日营收</Text>
          <Text style={styles.statValue}>€{stats.todayRevenue}</Text>
        </View>
      </View>

      {/* 本周数据 */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statLabel, { color: '#666' }]}>本周订单</Text>
          <Text style={[styles.statValue, { color: '#333' }]}>{stats.weekOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statLabel, { color: '#666' }]}>本周营收</Text>
          <Text style={[styles.statValue, { color: '#333' }]}>€{stats.weekRevenue}</Text>
        </View>
      </View>

      {/* 本月数据 */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statLabel, { color: '#666' }]}>本月订单</Text>
          <Text style={[styles.statValue, { color: '#333' }]}>{stats.monthOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statLabel, { color: '#666' }]}>本月营收</Text>
          <Text style={[styles.statValue, { color: '#333' }]}>€{stats.monthRevenue}</Text>
        </View>
      </View>

      {/* 营收趋势图 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>本周营收趋势</Text>
        <LineChart
          data={revenueData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* 订单趋势图 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>本周订单趋势</Text>
        <BarChart
          data={orderData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
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
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
});