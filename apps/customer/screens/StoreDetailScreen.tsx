import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { storeAPI } from '../services/api';

export default function StoreDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { storeId } = route.params;
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      const [storeRes, productsRes] = await Promise.all([
        storeAPI.getStore(storeId),
        storeAPI.getStoreProducts(storeId),
      ]);

      setStore(storeRes.data.data.store);
      setProducts(productsRes.data.data.products);
    } catch (error) {
      console.error('Error loading store:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productSales}>月售 {item.soldCount}</Text>
        <View style={styles.productFooter}>
          <View style={styles.productPriceRow}>
            <Text style={styles.productPriceCurrency}>€</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.productUnit}>/{item.unit}</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00B578" />
        </View>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>🏪</Text>
          <Text style={styles.errorText}>店铺不存在</Text>
        </View>
      </View>
    );
  }

  const categoryTabs = ['全部', ...(store.categories || [])];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Store banner with overlay */}
          <View style={styles.bannerWrap}>
            <Image
              source={{ uri: store.coverImage || store.logo }}
              style={styles.coverImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay}>
              <View style={styles.bannerContent}>
                <Text style={styles.storeName}>{store.name}</Text>
                <View style={styles.ratingRow}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {store.rating}</Text>
                  </View>
                  <Text style={styles.reviewCount}>月售 {store.soldCount || 999}+</Text>
                </View>
                <View style={styles.infoTags}>
                  <View style={styles.infoTag}>
                    <Text style={styles.infoTagText}>🕐 {store.deliveryTime}</Text>
                  </View>
                  <View style={styles.infoTag}>
                    <Text style={styles.infoTagText}>🚚 €{store.deliveryFee}</Text>
                  </View>
                  <View style={styles.infoTag}>
                    <Text style={styles.infoTagText}>💰 起送€{store.minOrderAmount}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Notice */}
          <View style={styles.noticeCard}>
            <Text style={styles.noticeIcon}>📢</Text>
            <Text style={styles.noticeText} numberOfLines={2}>
              {store.description || '欢迎光临本店，新鲜蔬菜水果每日配送'}
            </Text>
          </View>

          {/* Category tabs */}
          <View style={styles.categoryTabsWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categoryTabs.map((cat, index) => {
                const isActive = (index === 0 && activeCategory === 'all') || cat === activeCategory;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                    onPress={() => setActiveCategory(index === 0 ? 'all' : cat)}
                  >
                    <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Products grid */}
          <View style={styles.productsSection}>
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productsGrid}
            />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  bannerWrap: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E0E0E0',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 16,
  },
  bannerContent: {},
  storeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
  },
  infoTags: {
    flexDirection: 'row',
  },
  infoTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  infoTagText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    padding: 12,
  },
  noticeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  categoryTabsWrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F5F6FA',
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#00B578',
  },
  categoryTabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  productsSection: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  productsGrid: {},
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
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
    marginBottom: 4,
  },
  productSales: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  productPriceCurrency: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B35',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  productUnit: {
    fontSize: 11,
    color: '#999',
  },
  addButton: {
    width: 26,
    height: 26,
    backgroundColor: '#00B578',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
});
