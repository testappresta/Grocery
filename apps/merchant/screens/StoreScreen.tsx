import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function StoreScreen() {
  const storeInfo = {
    name: '新鲜蔬果店',
    description: '专注新鲜蔬菜水果配送，品质保证',
    phone: '+34 612 345 678',
    address: 'Calle Mayor 123, Madrid',
    rating: 4.8,
    reviewCount: 256,
    businessHours: {
      monday: '09:00 - 22:00',
      tuesday: '09:00 - 22:00',
      wednesday: '09:00 - 22:00',
      thursday: '09:00 - 22:00',
      friday: '09:00 - 22:00',
      saturday: '10:00 - 23:00',
      sunday: '10:00 - 21:00',
    },
  };

  const menuItems = [
    { icon: '📋', title: '店铺信息', subtitle: '编辑店铺资料' },
    { icon: '📷', title: '店铺图片', subtitle: '管理店铺展示图片' },
    { icon: '⏰', title: '营业时间', subtitle: '设置营业时间' },
    { icon: '💰', title: '配送设置', subtitle: '配送费和起送价' },
    { icon: '📊', title: '营业数据', subtitle: '查看详细数据' },
    { icon: '⚙️', title: '账户设置', subtitle: '密码和安全' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 店铺信息卡片 */}
      <View style={styles.storeCard}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/100' }} 
          style={styles.storeLogo} 
        />
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{storeInfo.name}</Text>
          <Text style={styles.storeDescription}>{storeInfo.description}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {storeInfo.rating}</Text>
            <Text style={styles.reviewCount}>({storeInfo.reviewCount} 评价)</Text>
          </View>
        </View>
      </View>

      {/* 营业状态 */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>营业状态</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>营业中</Text>
        </View>
      </View>

      {/* 菜单列表 */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 联系信息 */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>联系信息</Text>
        <Text style={styles.contactText}>📞 {storeInfo.phone}</Text>
        <Text style={styles.contactText}>📍 {storeInfo.address}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
  },
  storeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  storeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rating: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  reviewCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  contactCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});