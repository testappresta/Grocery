import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
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
    if (!phone || phone.length < 10) {
      Alert.alert('错误', '请输入有效的手机号');
      return;
    }

    setSendingCode(true);
    try {
      await authAPI.sendCode(phone);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      Alert.alert('错误', '发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  };

  const handleLogin = async () => {
    if (!phone || !code) {
      Alert.alert('错误', '请填写手机号和验证码');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.loginWithPhone(phone, code);
      const { accessToken, refreshToken, user } = response.data.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      Alert.alert('成功', '登录成功！');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('错误', '登录失败，请检查验证码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Brand area */}
        <View style={styles.brandArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🥬</Text>
          </View>
          <Text style={styles.brandName}>鲜果蔬配送</Text>
          <Text style={styles.brandSlogan}>新鲜直达 · 品质保证</Text>
        </View>

        {/* Form card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>欢迎回来</Text>
          <Text style={styles.formSubtitle}>请登录您的账户</Text>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>手机号</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入手机号"
                placeholderTextColor="#CCCCCC"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={15}
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>验证码</Text>
            <View style={styles.codeRow}>
              <View style={[styles.inputRow, styles.codeInputRow]}>
                <Text style={styles.inputIcon}>🔑</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入验证码"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  maxLength={6}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.codeButton,
                  (countdown > 0 || sendingCode) && styles.codeButtonDisabled,
                ]}
                onPress={sendVerificationCode}
                disabled={countdown > 0 || sendingCode}
              >
                <Text style={[
                  styles.codeButtonText,
                  (countdown > 0 || sendingCode) && styles.codeButtonTextDisabled,
                ]}>
                  {sendingCode
                    ? '发送中...'
                    : countdown > 0
                    ? `${countdown}s`
                    : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>登 录</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>还没有账户？</Text>
            <Text style={styles.registerLink}>立即注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#00B578',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
  },
  brandArea: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 40,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  brandSlogan: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 28,
  },
  inputWrap: {
    marginBottom: 20,
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
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    height: 50,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInputRow: {
    flex: 1,
    marginRight: 10,
  },
  codeButton: {
    backgroundColor: '#00B578',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 110,
  },
  codeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  codeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  codeButtonTextDisabled: {
    color: '#999',
  },
  loginButton: {
    backgroundColor: '#00B578',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#00B578',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 4,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#999',
    fontSize: 14,
  },
  registerLink: {
    color: '#00B578',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
