import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userAPI } from '../services/api';

export default function AddressesScreen() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    detail: '',
    tag: 'home',
  });

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert('错误', '请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      await userAPI.addAddress(formData);
      setShowForm(false);
      setFormData({ name: '', phone: '', address: '', detail: '', tag: 'home' });
      // 重新加载地址列表
    } catch (error) {
      Alert.alert('错误', '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const tagOptions = [
    { key: 'home', label: '🏠 家', color: '#3B82F6' },
    { key: 'work', label: '🏢 公司', color: '#8B5CF6' },
    { key: 'other', label: '📍 其他', color: '#F59E0B' },
  ];

  const renderAddressForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>添加新地址</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>收货人姓名</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入收货人姓名"
            placeholderTextColor="#CCCCCC"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>手机号</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>📱</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入手机号"
            placeholderTextColor="#CCCCCC"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>详细地址</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入详细地址"
            placeholderTextColor="#CCCCCC"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>门牌号/楼层（选填）</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🏠</Text>
          <TextInput
            style={styles.input}
            placeholder="如：3楼301室"
            placeholderTextColor="#CCCCCC"
            value={formData.detail}
            onChangeText={(text) => setFormData({ ...formData, detail: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>标签</Text>
        <View style={styles.tagContainer}>
          {tagOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.tagButton,
                formData.tag === option.key && { backgroundColor: option.color, borderColor: option.color },
              ]}
              onPress={() => setFormData({ ...formData, tag: option.key })}
            >
              <Text
                style={[
                  styles.tagText,
                  formData.tag === option.key && styles.tagTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formButtons}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setShowForm(false)}
        >
          <Text style={styles.cancelBtnText}>取消</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>保存地址</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {addresses.length === 0 && !showForm ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={styles.emptyTitle}>暂无地址</Text>
              <Text style={styles.emptySubtitle}>添加一个配送地址吧</Text>
            </View>
          ) : (
            addresses.map((addr, index) => (
              <View key={index} style={styles.addressCard}>
                <View style={styles.addressTop}>
                  <View style={styles.addressTagWrap}>
                    <Text style={styles.addressTagText}>
                      {addr.tag === 'home' ? '🏠 家' : addr.tag === 'work' ? '🏢 公司' : '📍 其他'}
                    </Text>
                  </View>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>默认</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressInfo}>
                  <View style={styles.addressNameRow}>
                    <Text style={styles.addressName}>{addr.name}</Text>
                    <Text style={styles.addressPhone}>{addr.phone}</Text>
                  </View>
                  <Text style={styles.addressText}>{addr.address}</Text>
                  {addr.detail && <Text style={styles.detailText}>{addr.detail}</Text>}
                </View>
              </View>
            ))
          )}

          {showForm && renderAddressForm()}

          {!showForm && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <View style={styles.addIconCircle}>
                <Text style={styles.addIcon}>+</Text>
              </View>
              <Text style={styles.addButtonText}>添加新地址</Text>
            </TouchableOpacity>
          )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressTagWrap: {
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  addressTagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  defaultBadge: {
    backgroundColor: '#00B57815',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  defaultText: {
    color: '#00B578',
    fontSize: 12,
    fontWeight: '600',
  },
  addressInfo: {},
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 12,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  detailText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    height: 48,
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tagButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  tagText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '500',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#00B578',
    alignItems: 'center',
    shadowColor: '#00B578',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  addIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00B57815',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addIcon: {
    fontSize: 18,
    color: '#00B578',
    fontWeight: '600',
  },
  addButtonText: {
    color: '#00B578',
    fontSize: 15,
    fontWeight: '600',
  },
});
