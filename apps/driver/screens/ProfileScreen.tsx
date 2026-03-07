import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function ProfileScreen() {
  const driverInfo = { name: '骑手小王', phone: '+34 612 345 678', rating: 4.9, totalDeliveries: 568, joinDate: '2024-01-15' };
  const menuItems = [
    { icon: '📋', title: '个人资料', subtitle: '查看和编辑资料' }, { icon: '📱', title: '账号安全', subtitle: '修改密码' },
    { icon: '📍', title: '配送设置', subtitle: '配送范围和通知' }, { icon: '📊', title: '配送统计', subtitle: '详细配送数据' },
    { icon: '💳', title: '银行卡', subtitle: '管理提现账户' }, { icon: '📞', title: '联系客服', subtitle: '遇到问题联系我们' },
  ];
  const stats = [
    { label: '配送订单', value: driverInfo.totalDeliveries, icon: '📦', color: '#00B578' },
    { label: '评分', value: driverInfo.rating, icon: '⭐', color: '#FF9800' },
    { label: '准时率', value: '98%', icon: '⏰', color: '#2196F3' },
  ];

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.avatar} />
            <View style={styles.userInfo}><Text style={styles.userName}>{driverInfo.name}</Text><Text style={styles.userPhone}>{driverInfo.phone}</Text><Text style={styles.joinDate}>📅 加入: {driverInfo.joinDate}</Text></View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.statsRow}>
            {stats.map((stat, i) => (<View key={i} style={styles.statCard}><Text style={{ fontSize: 20 }}>{stat.icon}</Text><Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></View>))}
          </View>
          <View style={styles.menuCard}>
            {menuItems.map((item, i) => (
              <TouchableOpacity key={i} style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]} activeOpacity={0.6}>
                <View style={styles.menuIconWrap}><Text style={{ fontSize: 20 }}>{item.icon}</Text></View>
                <View style={styles.menuText}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSubtitle}>{item.subtitle}</Text></View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.logoutButton}><Text style={{ fontSize: 16 }}>🚪</Text><Text style={styles.logoutText}>退出登录</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { maxWidth: 480, width: '100%', alignSelf: 'center' },
  headerGradient: { backgroundColor: '#00B578', paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.3)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  userPhone: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  joinDate: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  content: { padding: 16, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', marginTop: -16, marginBottom: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  statValue: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#999', marginTop: 4 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E8F9F0', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  menuSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  menuArrow: { fontSize: 22, color: '#CCC' },
  logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, gap: 8 },
  logoutText: { color: '#FF4444', fontSize: 15, fontWeight: '600' },
});
