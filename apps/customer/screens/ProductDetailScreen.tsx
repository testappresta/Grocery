import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { productAPI } from '../services/api';

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const response = await productAPI.getProduct(productId);
      setProduct(response.data.data.product);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    // TODO: 实现加入购物车
    navigation.navigate('Cart');
  };

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00B578" />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>商品不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Product image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.images[0] }}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>

          {/* Product info card */}
          <View style={styles.infoCard}>
            <View style={styles.priceRow}>
              <View style={styles.priceGroup}>
                <Text style={styles.priceCurrency}>€</Text>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.unit}>/{product.unit}</Text>
              </View>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>€{product.originalPrice}</Text>
              )}
            </View>

            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>

            {/* Sales info badges */}
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🔥 热销</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#00B57810' }]}>
                <Text style={[styles.badgeText, { color: '#00B578' }]}>🚚 可配送</Text>
              </View>
            </View>
          </View>

          {/* Store info card */}
          <View style={styles.storeCard}>
            <Text style={styles.sectionLabel}>商家信息</Text>
            <TouchableOpacity
              style={styles.storeRow}
              onPress={() => navigation.navigate('StoreDetail', { storeId: product.store._id })}
            >
              <View style={styles.storeIconWrap}>
                <Text style={styles.storeIcon}>🏪</Text>
              </View>
              <Text style={styles.storeName}>{product.store.name}</Text>
              <Text style={styles.storeArrow}>进店 ›</Text>
            </TouchableOpacity>
          </View>

          {/* Attributes */}
          {product.attributes?.length > 0 && (
            <View style={styles.attributesCard}>
              <Text style={styles.sectionLabel}>商品属性</Text>
              {product.attributes.map((attr, index) => (
                <View key={index} style={[styles.attributeItem, index === product.attributes.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.attributeName}>{attr.name}</Text>
                  <Text style={styles.attributeValue}>{attr.value}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Sticky footer */}
        <View style={styles.footer}>
          <View style={styles.quantitySection}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityBtn, styles.quantityBtnAdd]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={[styles.quantityBtnText, styles.quantityBtnAddText]}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartIcon}>🛒</Text>
            <Text style={styles.addToCartText}>加入购物车</Text>
            <Text style={styles.addToCartPrice}>€{(product.price * quantity).toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
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
  imageContainer: {
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  price: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FF6B35',
  },
  unit: {
    fontSize: 14,
    color: '#999',
    marginLeft: 2,
  },
  originalPrice: {
    fontSize: 15,
    color: '#CCCCCC',
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 26,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#00B57810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeIcon: {
    fontSize: 18,
  },
  storeName: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    marginLeft: 10,
    fontWeight: '500',
  },
  storeArrow: {
    fontSize: 13,
    color: '#00B578',
    fontWeight: '500',
  },
  attributesCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 10,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6FA',
  },
  attributeName: {
    fontSize: 14,
    color: '#999',
  },
  attributeValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnAdd: {
    backgroundColor: '#00B578',
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  quantityBtnAddText: {
    color: '#FFFFFF',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 14,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00B578',
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#00B578',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  addToCartPrice: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
});
