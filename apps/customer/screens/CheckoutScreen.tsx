import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { orderAPI, cartAPI } from '../services/api';

export default function CheckoutScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cart } = route.params;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    // 加载用户地址
    try {
      // const response = await userAPI.getAddresses();
      // setAddresses(response.data.data.addresses);
      // 模拟数据
      setAddresses([
        {
          id: '1',
          name: '张三',
          phone: '+34 612 345 678',
          address: 'Gran Vía 78, Madrid',
          detail: '3楼 301室',
          isDefault: true,
        },
      ]);
      setSelectedAddress({
        id: '1',
        name: '张三',
        phone: '+34 612 345 678',
        address: 'Gran Vía 78, Madrid',
        detail: '3楼 301室',
      });
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('错误', '请选择配送地址');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        addressId: selectedAddress.id,
        note,
        paymentMethod: 'card',
      };

      const response = await orderAPI.createOrder(orderData);
      
      // 清空购物车
      await cartAPI.clearCart();
      
      Alert.alert(
        '成功',
        '订单已创建',
        [
          {
            text: '查看订单',
            onPress: () => navigation.navigate('Orders'),
          },
          {
            text: '返回首页',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '创建订单失败');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 2.5;
  const total = cart.total + deliveryFee;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 地址选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>配送地址</Text>
          {selectedAddress ? (
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>{selectedAddress.name}</Text>
                <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
              </View>
              <Text style={styles.addressText}>{selectedAddress.address}</Text>
              {selectedAddress.detail && (
                <Text style={styles.addressDetail}>{selectedAddress.detail}</Text>
              )}
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => navigation.navigate('Addresses')}
              >
                <Text style={styles.changeButtonText}>更换地址</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={() => navigation.navigate('Addresses')}
            >
              <Text style={styles.addAddressText}>+ 添加配送地址</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 订单商品 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>订单商品</Text>
          {cart.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>€{item.total}</Text>
            </View>
          ))}
        </View>

        {/* 备注 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>订单备注</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="请输入备注（选填）"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* 费用明细 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>费用明细</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>商品小计</Text>
            <Text style={styles.feeValue}>€{cart.total}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>配送费</Text>
            <Text style={styles.feeValue}>€{deliveryFee}</Text>
          </View>
          <View style={[styles.feeRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>合计</Text>
            <Text style={styles.totalValue}>€{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部结算栏 */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>合计:</Text>
          <Text style={styles.footerTotalValue}>€{total}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.placeOrderText}>提交订单</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  addressHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  addressDetail: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  changeButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  addAddressButton: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addAddressText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    height: 80,
    textAlignVertical: 'top',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
  feeValue: {
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerTotalLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  footerTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  placeOrderButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  placeOrderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});