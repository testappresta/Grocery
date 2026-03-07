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
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* 地址选择 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <Text style={styles.sectionIcon}>📍</Text>
              </View>
              <Text style={styles.sectionTitle}>配送地址</Text>
            </View>
            {selectedAddress ? (
              <TouchableOpacity
                style={styles.addressCard}
                onPress={() => navigation.navigate('Addresses')}
              >
                <View style={styles.addressLeft}>
                  <View style={styles.addressNameRow}>
                    <Text style={styles.addressName}>{selectedAddress.name}</Text>
                    <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
                  </View>
                  <Text style={styles.addressText}>{selectedAddress.address}</Text>
                  {selectedAddress.detail && (
                    <Text style={styles.addressDetail}>{selectedAddress.detail}</Text>
                  )}
                </View>
                <Text style={styles.addressArrow}>›</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() => navigation.navigate('Addresses')}
              >
                <Text style={styles.addAddressIcon}>＋</Text>
                <Text style={styles.addAddressText}>添加配送地址</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 订单商品 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#FF6B3510' }]}>
                <Text style={styles.sectionIcon}>🛒</Text>
              </View>
              <Text style={styles.sectionTitle}>订单商品</Text>
              <Text style={styles.itemCountBadge}>{cart.items.length}件</Text>
            </View>
            {cart.items.map((item, index) => (
              <View key={index} style={[styles.itemRow, index === cart.items.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.itemDot} />
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                <Text style={styles.itemPrice}>€{item.total}</Text>
              </View>
            ))}
          </View>

          {/* 备注 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#F59E0B10' }]}>
                <Text style={styles.sectionIcon}>📝</Text>
              </View>
              <Text style={styles.sectionTitle}>订单备注</Text>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="有什么想对商家说的？（选填）"
              placeholderTextColor="#CCCCCC"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* 费用明细 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#8B5CF610' }]}>
                <Text style={styles.sectionIcon}>💰</Text>
              </View>
              <Text style={styles.sectionTitle}>费用明细</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>商品小计</Text>
              <Text style={styles.feeValue}>€{cart.total}</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>配送费</Text>
              <Text style={styles.feeValue}>€{deliveryFee}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>合计</Text>
              <View style={styles.totalValueRow}>
                <Text style={styles.totalCurrency}>€</Text>
                <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>合计</Text>
            <View style={styles.footerPriceRow}>
              <Text style={styles.footerCurrency}>€</Text>
              <Text style={styles.footerTotal}>{total.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.placeOrderText}>提交订单</Text>
            )}
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
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#00B57810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionIcon: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  itemCountBadge: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 14,
  },
  addressLeft: {
    flex: 1,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 12,
  },
  addressPhone: {
    fontSize: 13,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  addressDetail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  addressArrow: {
    fontSize: 22,
    color: '#CCCCCC',
    marginLeft: 8,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#00B578',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
  },
  addAddressIcon: {
    fontSize: 18,
    color: '#00B578',
    marginRight: 6,
    fontWeight: '500',
  },
  addAddressText: {
    color: '#00B578',
    fontSize: 14,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6FA',
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B578',
    marginRight: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#999',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  noteInput: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1A1A1A',
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
    color: '#999',
  },
  feeValue: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderTopWidth: 1,
    borderTopColor: '#F5F6FA',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6B35',
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
  footerLeft: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: '#999',
  },
  footerPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  footerCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  footerTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  placeOrderButton: {
    backgroundColor: '#00B578',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#00B578',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
