import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { CheckCircle, XCircle, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function PaymentResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isSuccess = params.status === 'success';
  const orderId = params.orderId;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: isSuccess ? '#10B98120' : '#EF444420' }]}>
          {isSuccess ? (
            <CheckCircle size={64} color="#10B981" />
          ) : (
            <XCircle size={64} color="#EF4444" />
          )}
        </View>

        <Text style={styles.title}>
          {isSuccess ? 'Pembayaran Berhasil!' : 'Pembayaran Gagal'}
        </Text>
        
        <Text style={styles.subtitle}>
          {isSuccess 
            ? `Order #${orderId} berhasil diproses. Kami akan segera menyiapkan pesanan Anda.`
            : 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'}
        </Text>

        <TouchableOpacity 
          style={styles.primaryBtn} 
          onPress={() => router.replace('/(tabs)/orders')}
        >
          <ShoppingBag size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>Lihat Pesanan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.secondaryBtnText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  primaryBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  secondaryBtn: {
    paddingVertical: 12,
  },
  secondaryBtnText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
