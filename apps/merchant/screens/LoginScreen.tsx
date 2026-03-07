import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('错误', '请填写邮箱和密码'); return; }
    setLoading(true);
    try {
      const response = await authAPI.loginWithEmail(email, password);
      const { accessToken, refreshToken, user } = response.data.data;
      if (user.role !== 'merchant' && user.role !== 'admin') { Alert.alert('错误', '您没有商家权限'); return; }
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      Alert.alert('成功', '登录成功！');
      navigation.replace('Main');
    } catch (error) { Alert.alert('错误', '登录失败，请检查邮箱和密码'); } finally { setLoading(false); }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.brandHeader}>
          <View style={styles.brandIconWrap}><Text style={styles.brandIcon}>🏪</Text></View>
          <Text style={styles.brandTitle}>商家中心</Text>
          <Text style={styles.brandSubtitle}>管理您的店铺，轻松经营</Text>
        </View>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📧 邮箱</Text>
            <TextInput style={styles.input} placeholder="请输入邮箱地址" placeholderTextColor="#BDBDBD" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 密码</Text>
            <TextInput style={styles.input} placeholder="请输入密码" placeholderTextColor="#BDBDBD" secureTextEntry value={password} onChangeText={setPassword} />
          </View>
          <TouchableOpacity style={[styles.loginButton, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>登 录</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotButton}><Text style={styles.forgotText}>忘记密码？</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center', paddingHorizontal: 24, justifyContent: 'center' },
  brandHeader: { alignItems: 'center', marginBottom: 36 },
  brandIconWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFF3ED', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandIcon: { fontSize: 40 },
  brandTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  brandSubtitle: { fontSize: 15, color: '#999' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#1A1A1A', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1.5, borderColor: '#EEEEEE', borderRadius: 14, padding: 14, fontSize: 16, backgroundColor: '#FAFAFA', color: '#1A1A1A' },
  loginButton: { backgroundColor: '#FF6B35', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8, shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  forgotButton: { marginTop: 18, alignItems: 'center' },
  forgotText: { color: '#FF6B35', fontSize: 14, fontWeight: '500' },
});
