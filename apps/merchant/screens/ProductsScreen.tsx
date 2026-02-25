import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';

export default function ProductsScreen() {
  const [products, setProducts] = useState([
    {
      id: '1',
      name: '新鲜苹果',
      price: 2.5,
      unit: 'kg',
      stock: 50,
      sold: 120,
      isAvailable: true,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '2',
      name: '香蕉',
      price: 1.8,
      unit: 'kg',
      stock: 30,
      sold: 85,
      isAvailable: true,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '3',
      name: '西红柿',
      price: 3.2,
      unit: 'kg',
      stock: 0,
      sold: 200,
      isAvailable: false,
      image: 'https://via.placeholder.com/100',
    },
  ]);

  const toggleAvailability = (productId) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
    ));
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>€{item.price}/{item.unit}</Text>
        
        <View style={styles.stockInfo}>
          <Text style={styles.stockText}>库存: {item.stock}</Text>
          <Text style={styles.soldText}>已售: {item.sold}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Switch
          value={item.isAvailable}
          onValueChange={() => toggleAvailability(item.id)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={item.isAvailable ? '#4CAF50' : '#f4f3f4'}
        />
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>商品管理</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 添加商品</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stockInfo: {
    flexDirection: 'row',
  },
  stockText: {
    fontSize: 12,
    color: '#666',
    marginRight: 15,
  },
  soldText: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  editButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 15,
  },
  editButtonText: {
    color: '#4CAF50',
    fontSize: 12,
  },
});