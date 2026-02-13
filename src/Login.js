import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredentials.user);
      navigation.navigate('ganzhuzhudafeibi');
    } catch (error) {
      console.error('Error logging in user:', error);
      Alert.alert('登录失败', error.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>欢迎登录</Text>

            <TextInput
              style={styles.input}
              placeholder="邮箱"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#9aa0b4"
            />

            <TextInput
              style={styles.input}
              placeholder="密码"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9aa0b4"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>登录</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
                没有账号？注册
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#1e2430' },
  input: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6e9ef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    backgroundColor: '#3478f6',
    width: '100%',
    maxWidth: 420,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3478f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.85 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { marginTop: 16 },
  link: { color: '#3478f6', fontSize: 14 },
});