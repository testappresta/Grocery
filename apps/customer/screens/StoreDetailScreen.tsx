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
          <Text style={styles.productPrice}>€{item.price}/{item.unit}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.centerContainer}>
        <Text>店铺不存在</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 店铺头部 */}
        <View style={styles.header}>
          <Image source={{ uri: store.coverImage || store.logo }} style={styles.coverImage} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {store.rating}</Text>
              <Text style={styles.reviewCount}>月售 {store.soldCount || 999}+</Text>
            </View>
            <Text style={styles.deliveryInfo}>
              {store.deliveryTime} · 配送€{store.deliveryFee} · 起送€{store.minOrderAmount}
            </Text>
            <Text style={styles.notice}>公告: {store.description || '欢迎光临本店，新鲜蔬菜水果每日配送'}</Text>
          </View>
        </View>

        {/* 商品列表 */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>全部商品</Text>
          
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  coverImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  storeInfo: {
    padding: 15,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
    marginRight: 10,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  deliveryInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  notice: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
  },
  productsSection: {
    backgroundColor: 'white',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productSales: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addButton: {
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
});