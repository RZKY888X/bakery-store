import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Colors from '../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth()!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Mohon isi email dan password');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Swadista</Text>
        <Text style={styles.subtitle}>Artisan Bakery</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Belum punya akun? Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    color: Colors.light.tint,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.light.icon,
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.light.secondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  button: {
    backgroundColor: Colors.light.secondary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.light.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: Colors.light.secondary,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
