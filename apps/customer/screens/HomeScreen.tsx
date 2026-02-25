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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';

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

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.productPrice}>€{item.price}/{item.unit}</Text>
    </TouchableOpacity>
  );

  const renderStore = ({ item }) => (
    <TouchableOpacity 
      style={styles.storeCard}
      onPress={() => navigation.navigate('StoreDetail', { storeId: item._id })}
    >
      <Image source={{ uri: item.logo }} style={styles.storeLogo} />
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeRating}>⭐ {item.rating} ({item.reviewCount})</Text>
        <Text style={styles.storeDelivery}>{item.deliveryTime} · €{item.deliveryFee}配送</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 分类 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分类</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* 推荐商品 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>推荐</Text>
        <FlatList
          data={featuredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* 附近商家 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>附近商家</Text>
        {stores.map((store) => (
          <View key={store._id}>{renderStore({ item: store })}</View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  categoryName: {
    marginTop: 5,
    fontSize: 12,
  },
  productCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  storeInfo: {
    marginLeft: 15,
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeRating: {
    marginTop: 5,
    color: '#666',
  },
  storeDelivery: {
    marginTop: 5,
    color: '#999',
  },
});