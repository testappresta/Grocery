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

  const renderAddressForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>添加新地址</Text>
      
      <TextInput
        style={styles.input}
        placeholder="收货人姓名"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="手机号"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="详细地址"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="门牌号/楼层（选填）"
        value={formData.detail}
        onChangeText={(text) => setFormData({ ...formData, detail: text })}
      />

      <View style={styles.tagContainer}>
        {['home', 'work', 'other'].map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagButton,
              formData.tag === tag && styles.tagButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, tag })}
          >
            <Text
              style={[
                styles.tagText,
                formData.tag === tag && styles.tagTextActive,
              ]}
            >
              {tag === 'home' ? '家' : tag === 'work' ? '公司' : '其他'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => setShowForm(false)}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {addresses.length === 0 && !showForm ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无地址</Text>
        </View>
      ) : (
        addresses.map((addr, index) => (
          <View key={index} style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressName}>{addr.name}</Text>
              <Text style={styles.addressPhone}>{addr.phone}</Text>
              {addr.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>默认</Text>
                </View>
              )}
            </View>
            <Text style={styles.addressText}>{addr.address}</Text>
            {addr.detail && <Text style={styles.detailText}>{addr.detail}</Text>}
          </View>
        ))
      )}

      {showForm && renderAddressForm()}

      {!showForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>+ 添加新地址</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  addressCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  detailText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tagButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  tagButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tagText: {
    color: '#666',
  },
  tagTextActive: {
    color: 'white',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});