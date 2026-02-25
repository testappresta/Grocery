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
      
      // 检查是否是配送员账户
      if (user.role !== 'driver') {
        Alert.alert('错误', '您没有配送员权限');
        return;
      }
      
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>骑手登录</Text>
        <Text style={styles.subtitle}>开始配送赚钱</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>手机号</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入手机号"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={15}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>验证码</Text>
          <View style={styles.codeContainer}>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="请输入验证码"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />
            <TouchableOpacity
              style={[
                styles.codeButton,
                (countdown > 0 || sendingCode) && styles.codeButtonDisabled,
              ]}
              onPress={sendVerificationCode}
              disabled={countdown > 0 || sendingCode}
            >
              <Text style={styles.codeButtonText}>
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
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>登录</Text>
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
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    marginRight: 10,
  },
  codeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  codeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  codeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});