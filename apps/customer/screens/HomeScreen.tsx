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
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORY_COLORS = [
  '#FF6B35', '#00B578', '#3B82F6', '#F59E0B',
  '#EC4899', '#8B5CF6', '#10B981', '#EF4444',
  '#06B6D4', '#F97316',
];

const CATEGORY_EMOJIS = [
  '🥬', '🍎', '🥩', '🐟', '🥛', '🍞', '🥤', '🧊', '🍳', '🥜',
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, prodRes, storeRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products/featured'),
        api.get('/stores'),
      ]);

      setCategories(catRes.data.data.categories);
      setFeaturedProducts(prodRes.data.data.products);
      setStores(storeRes.data.data.stores.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIconWrap, { backgroundColor: (CATEGORY_COLORS[index % CATEGORY_COLORS.length]) + '20' }]}>
        {item.icon ? (
          <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
        ) : (
          <Text style={styles.categoryEmoji}>{CATEGORY_EMOJIS[index % CATEGORY_EMOJIS.length]}</Text>
        )}
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPriceCurrency}>¥</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.productUnit}>/{item.unit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStore = ({ item }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => navigation.navigate('StoreDetail', { storeId: item._id })}
    >
      <Image source={{ uri: item.logo }} style={styles.storeLogo} />
      <View style={styles.storeInfo}>
        <Text style={styles.storeName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.storeRatingRow}>
          <Text style={styles.storeRatingStar}>⭐</Text>
          <Text style={styles.storeRatingText}>{item.rating}</Text>
          <Text style={styles.storeReviewCount}>({item.reviewCount})</Text>
        </View>
        <View style={styles.storeMetaRow}>
          <View style={styles.storeMetaBadge}>
            <Text style={styles.storeMetaBadgeText}>🕐 {item.deliveryTime}</Text>
          </View>
          <View style={[styles.storeMetaBadge, { backgroundColor: '#FF6B3510' }]}>
            <Text style={[styles.storeMetaBadgeText, { color: '#FF6B35' }]}>🚚 €{item.deliveryFee}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00B578']} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header with location and search */}
          <View style={styles.headerArea}>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>当前位置</Text>
              <Text style={styles.locationArrow}>▼</Text>
            </View>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="搜索商品、商家"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Promotional banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>新人专享</Text>
                <Text style={styles.bannerSubtitle}>首单立减€5</Text>
                <View style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>立即领取</Text>
                </View>
              </View>
              <Text style={styles.bannerEmoji}>🎁</Text>
            </View>
          </View>

          {/* 分类 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>分类</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>查看全部 ›</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>

          {/* 推荐商品 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 热门推荐</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>更多 ›</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productList}
            />
          </View>

          {/* 附近商家 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📍 附近商家</Text>
            </View>
            {stores.map((store) => (
              <View key={store._id}>{renderStore({ item: store })}</View>
            ))}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
  },
  scrollView: {
    flex: 1,
  },
  headerArea: {
    backgroundColor: '#00B578',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  locationArrow: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 42,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    height: 42,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  banner: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#FF6B35',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerEmoji: {
    fontSize: 48,
    marginLeft: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 13,
    color: '#999',
  },
  categoryList: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
  },
  categoryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  productList: {
    paddingRight: 16,
  },
  productCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 18,
    marginBottom: 6,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  productPriceCurrency: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  productUnit: {
    fontSize: 11,
    color: '#999',
    marginLeft: 2,
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storeLogo: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  storeInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  storeRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  storeRatingStar: {
    fontSize: 12,
  },
  storeRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 2,
  },
  storeReviewCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  storeMetaRow: {
    flexDirection: 'row',
  },
  storeMetaBadge: {
    backgroundColor: '#00B57810',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  storeMetaBadgeText: {
    fontSize: 11,
    color: '#00B578',
    fontWeight: '500',
  },
});
