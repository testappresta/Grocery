import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';

export default function StoreScreen() {
  const [isOpen, setIsOpen] = useState(true);
  const storeInfo = { name: '新鲜蔬果店', description: '专注新鲜蔬菜水果配送，品质保证', phone: '+34 612 345 678', address: 'Calle Mayor 123, Madrid', rating: 4.8, reviewCount: 256, businessHours: { monday: '09:00 - 22:00', tuesday: '09:00 - 22:00', wednesday: '09:00 - 22:00', thursday: '09:00 - 22:00', friday: '09:00 - 22:00', saturday: '10:00 - 23:00', sunday: '10:00 - 21:00' } };
  const menuItems = [
    { icon: '📋', title: '店铺信息', subtitle: '编辑店铺资料' },
    { icon: '📷', title: '店铺图片', subtitle: '管理店铺展示图片' },
    { icon: '⏰', title: '营业时间', subtitle: '设置营业时间' },
    { icon: '💰', title: '配送设置', subtitle: '配送费和起送价' },
    { icon: '📊', title: '营业数据', subtitle: '查看详细数据' },
    { icon: '⚙️', title: '账户设置', subtitle: '密码和安全' },
  ];

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.storeLogo} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{storeInfo.name}</Text>
              <Text style={styles.storeDescription}>{storeInfo.description}</Text>
              <Text style={styles.ratingText}>⭐ {storeInfo.rating}  ({storeInfo.reviewCount} 评价)</Text>
            </View>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.headerStatItem}><Text style={styles.headerStatValue}>{storeInfo.rating}</Text><Text style={styles.headerStatLabel}>评分</Text></View>
            <View style={styles.headerStatItem}><Text style={styles.headerStatValue}>{storeInfo.reviewCount}</Text><Text style={styles.headerStatLabel}>评价</Text></View>
            <View style={styles.headerStatItem}><Text style={styles.headerStatValue}>98%</Text><Text style={styles.headerStatLabel}>好评率</Text></View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <Text style={styles.statusIcon}>{isOpen ? '🟢' : '🔴'}</Text>
              <View><Text style={styles.statusTitle}>营业状态</Text><Text style={styles.statusSubtitle}>{isOpen ? '营业中 · 接受新订单' : '休息中'}</Text></View>
            </View>
            <Switch value={isOpen} onValueChange={setIsOpen} trackColor={{ false: '#E0E0E0', true: '#FFD4C0' }} thumbColor={isOpen ? '#FF6B35' : '#BDBDBD'} />
          </View>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.menuItem, index === menuItems.length - 1 && { borderBottomWidth: 0 }]} activeOpacity={0.6}>
                <View style={styles.menuIconWrap}><Text style={styles.menuIcon}>{item.icon}</Text></View>
                <View style={styles.menuText}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSubtitle}>{item.subtitle}</Text></View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>联系信息</Text>
            <Text style={styles.contactText}>📞 {storeInfo.phone}</Text>
            <Text style={styles.contactText}>📍 {storeInfo.address}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { maxWidth: 480, width: '100%', alignSelf: 'center' },
  headerGradient: { backgroundColor: '#FF6B35', paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  storeLogo: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.3)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  storeInfo: { flex: 1, marginLeft: 16 },
  storeName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  storeDescription: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  ratingText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 8, fontWeight: '600' },
  headerStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingVertical: 14 },
  headerStatItem: { flex: 1, alignItems: 'center' },
  headerStatValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  headerStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { padding: 16, paddingBottom: 32 },
  statusCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusIcon: { fontSize: 20 },
  statusTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  statusSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF3ED', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuIcon: { fontSize: 20 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  menuSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  menuArrow: { fontSize: 22, color: '#CCC', fontWeight: '300' },
  contactCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  contactTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },
  contactText: { fontSize: 14, color: '#666', marginBottom: 8 },
});
