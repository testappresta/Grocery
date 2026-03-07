import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendVerificationCode = async () => {
    if (!phone || phone.length < 10) { Alert.alert('错误', '请输入有效的手机号'); return; }
    setSendingCode(true);
    try { await authAPI.sendCode(phone); setCountdown(60); const timer = setInterval(() => { setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }); }, 1000); } catch (error) { Alert.alert('错误', '发送验证码失败'); } finally { setSendingCode(false); }
  };

  const handleLogin = async () => {
    if (!phone || !code) { Alert.alert('错误', '请填写手机号和验证码'); return; }
    setLoading(true);
    try {
      const response = await authAPI.loginWithPhone(phone, code);
      const { accessToken, refreshToken, user } = response.data.data;
      if (user.role !== 'driver') { Alert.alert('错误', '您没有配送员权限'); return; }
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      Alert.alert('成功', '登录成功！');
      navigation.replace('Main');
    } catch (error) { Alert.alert('错误', '登录失败，请检查验证码'); } finally { setLoading(false); }
  };

  return (
    <View style={styles.screen}><View style={styles.container}>
      <View style={styles.brandHeader}>
        <View style={styles.brandIconWrap}><Text style={styles.brandIcon}>🛵</Text></View>
        <Text style={styles.brandTitle}>骑手中心</Text>
        <Text style={styles.brandSubtitle}>开始配送，轻松赚钱</Text>
      </View>
      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📱 手机号</Text>
          <TextInput style={styles.input} placeholder="请输入手机号" placeholderTextColor="#BDBDBD" keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={15} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🔑 验证码</Text>
          <View style={styles.codeRow}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="请输入验证码" placeholderTextColor="#BDBDBD" keyboardType="number-pad" value={code} onChangeText={setCode} maxLength={6} />
            <TouchableOpacity style={[styles.codeButton, (countdown > 0 || sendingCode) && { backgroundColor: '#CCC' }]} onPress={sendVerificationCode} disabled={countdown > 0 || sendingCode}>
              <Text style={styles.codeButtonText}>{sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[styles.loginButton, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>登 录</Text>}
        </TouchableOpacity>
      </View>
    </View></View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center', paddingHorizontal: 24, justifyContent: 'center' },
  brandHeader: { alignItems: 'center', marginBottom: 36 },
  brandIconWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#E8F9F0', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandIcon: { fontSize: 40 },
  brandTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  brandSubtitle: { fontSize: 15, color: '#999' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#1A1A1A', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1.5, borderColor: '#EEEEEE', borderRadius: 14, padding: 14, fontSize: 16, backgroundColor: '#FAFAFA', color: '#1A1A1A' },
  codeRow: { flexDirection: 'row', gap: 10 },
  codeButton: { backgroundColor: '#00B578', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, minWidth: 100, alignItems: 'center', justifyContent: 'center' },
  codeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  loginButton: { backgroundColor: '#00B578', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
});
