import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Switch } from 'react-native';

export default function ProductsScreen() {
  const [products, setProducts] = useState([
    { id: '1', name: '新鲜苹果', price: 2.5, unit: 'kg', stock: 50, sold: 120, isAvailable: true, image: 'https://via.placeholder.com/100' },
    { id: '2', name: '香蕉', price: 1.8, unit: 'kg', stock: 30, sold: 85, isAvailable: true, image: 'https://via.placeholder.com/100' },
    { id: '3', name: '西红柿', price: 3.2, unit: 'kg', stock: 0, sold: 200, isAvailable: false, image: 'https://via.placeholder.com/100' },
  ]);

  const toggleAvailability = (productId) => {
    setProducts(products.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  const renderProductItem = ({ item }) => (
    <View style={[styles.productCard, !item.isAvailable && styles.productCardDisabled]}>
      <View style={styles.productImageWrap}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {!item.isAvailable && (<View style={styles.soldOutOverlay}><Text style={styles.soldOutText}>已下架</Text></View>)}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>€{item.price}/{item.unit}</Text>
        <View style={styles.stockRow}>
          <Text style={styles.stockLabel}>库存 <Text style={[styles.stockValue, item.stock === 0 && { color: '#FF5722' }]}>{item.stock}</Text></Text>
          <Text style={styles.stockLabel}>  已售 <Text style={styles.stockValue}>{item.sold}</Text></Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Switch value={item.isAvailable} onValueChange={() => toggleAvailability(item.id)} trackColor={{ false: '#E0E0E0', true: '#FFD4C0' }} thumbColor={item.isAvailable ? '#FF6B35' : '#BDBDBD'} />
        <TouchableOpacity style={styles.editButton} activeOpacity={0.7}><Text style={styles.editButtonText}>✏️ 编辑</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.statsBar}>
          <View style={styles.statsItem}><Text style={styles.statsNumber}>{products.length}</Text><Text style={styles.statsLabel}>全部</Text></View>
          <View style={styles.statsItem}><Text style={[styles.statsNumber, { color: '#4CAF50' }]}>{products.filter(p => p.isAvailable).length}</Text><Text style={styles.statsLabel}>上架</Text></View>
          <View style={styles.statsItem}><Text style={[styles.statsNumber, { color: '#FF5722' }]}>{products.filter(p => p.stock === 0).length}</Text><Text style={styles.statsLabel}>缺货</Text></View>
        </View>
        <FlatList data={products} renderItem={renderProductItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} />
        <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
          <Text style={styles.fabIcon}>+</Text><Text style={styles.fabText}>添加商品</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center' },
  statsBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 16, marginBottom: 4 },
  statsItem: { flex: 1, alignItems: 'center' },
  statsNumber: { fontSize: 20, fontWeight: '800', color: '#FF6B35', marginBottom: 2 },
  statsLabel: { fontSize: 12, color: '#999', fontWeight: '500' },
  listContainer: { padding: 16, paddingBottom: 100 },
  productCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  productCardDisabled: { opacity: 0.7 },
  productImageWrap: { position: 'relative', width: 80, height: 80, borderRadius: 12, overflow: 'hidden' },
  productImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F0F0F0' },
  soldOutOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  soldOutText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  productInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  productName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  productPrice: { fontSize: 17, color: '#FF6B35', fontWeight: '800', marginBottom: 8 },
  stockRow: { flexDirection: 'row', alignItems: 'center' },
  stockLabel: { fontSize: 12, color: '#999' },
  stockValue: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  actions: { justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: 8 },
  editButton: { paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: '#FF6B35', borderRadius: 20 },
  editButtonText: { color: '#FF6B35', fontSize: 12, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 24, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B35', paddingVertical: 14, paddingHorizontal: 22, borderRadius: 28, shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6, gap: 6 },
  fabIcon: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  fabText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
