import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: '水果', icon: '🍎', color: '#FF6B6B' },
  { id: '2', name: '蔬菜', icon: '🥬', color: '#4ECDC4' },
  { id: '3', name: '肉类', icon: '🥩', color: '#FF8B94' },
  { id: '4', name: '海鲜', icon: '🦐', color: '#45B7D1' },
  { id: '5', name: '蛋奶', icon: '🥚', color: '#F7DC6F' },
  { id: '6', name: '粮油', icon: '🍚', color: '#BB8FCE' },
];

const PROMO_BANNERS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', title: '新鲜水果 5折起' },
  { id: '2', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400', title: '有机蔬菜 满减优惠' },
  { id: '3', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bd6565?w=400', title: '进口肉类 限时特惠' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 模拟数据
    setFeaturedProducts([
      { id: '1', name: '新鲜苹果', price: 2.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200', store: '新鲜果园' },
      { id: '2', name: '有机香蕉', price: 1.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200', store: '绿色农场' },
      { id: '3', name: '红提葡萄', price: 4.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1537640538965-1756cd58090e?w=200', store: '水果大王' },
      { id: '4', name: '新鲜橙子', price: 3.49, unit: 'kg', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5a?w=200', store: ' Citrus Plus' },
    ]);
    
    setNearbyStores([
      { id: '1', name: '新鲜果园', rating: 4.8, deliveryTime: '30分钟', deliveryFee: 2.5, minOrder: 15, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' },
      { id: '2', name: '绿色农场', rating: 4.9, deliveryTime: '25分钟', deliveryFee: 1.5, minOrder: 10, image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=200' },
      { id: '3', name: '有机生活', rating: 4.7, deliveryTime: '35分钟', deliveryFee: 3, minOrder: 20, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bd6565?w=200' },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.categoryEmoji}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPromoBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerItem}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.bannerOverlay}
      >
        <Text style={styles.bannerTitle}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productStore}>{item.store}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>€{item.price}</Text>
          <Text style={styles.productUnit}>/{item.unit}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderStoreItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.storeCard}
      onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.storeImage} />
      <View style={styles.storeInfo}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeName}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>
        <View style={styles.storeMeta}>
          <Text style={styles.storeMetaText}>{item.deliveryTime}</Text>
          <Text style={styles.storeMetaDot}>•</Text>
          <Text style={styles.storeMetaText}>€{item.deliveryFee} 配送</Text>
          <Text style={styles.storeMetaDot}>•</Text>
          <Text style={styles.storeMetaText}>起送 €{item.minOrder}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerGreeting}>早上好! 👋</Text>
            <Text style={styles.headerSubtitle}>今天想吃点什么？</Text>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => {}}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>搜索商品或店铺...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Promo Banners */}
        <View style={styles.section}>
          <FlatList
            data={PROMO_BANNERS}
            renderItem={renderPromoBanner}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerList}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>分类浏览</Text>
          </View>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>限时特惠</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>查看全部 ›</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        </View>

        {/* Nearby Stores */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>附近商家</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Stores')}>
              <Text style={styles.seeAll}>查看全部 ›</Text>
            </TouchableOpacity>
          </View>
          {nearbyStores.map((store) => (
            <View key={store.id}>{renderStoreItem({ item: store })}</View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerGreeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  cartButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
  },
  bannerList: {
    paddingHorizontal: 20,
  },
  bannerItem: {
    width: width - 60,
    height: 150,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  productList: {
    paddingHorizontal: 15,
  },
  productCard: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    marginTop: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  productStore: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  productUnit: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 28,
    height: 28,
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  storeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeMetaText: {
    fontSize: 12,
    color: '#666',
  },
  storeMetaDot: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 6,
  },
});