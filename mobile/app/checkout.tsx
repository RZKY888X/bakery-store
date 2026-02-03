import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/constants/Config';
import { useState } from 'react';
import CustomHeader from '@/components/CustomHeader';
import { MapPin, CheckCircle, ArrowRight, User, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { items, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Login Diperlukan', 'Silakan login terlebih dahulu untuk checkout.', [
        { text: 'Login', onPress: () => router.push('/login') },
        { text: 'Batal', style: 'cancel' }
      ]);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Data Tidak Lengkap', 'Mohon isi nama depan dan nama belakang.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Data Tidak Lengkap', 'Mohon isi nomor telepon.');
      return;
    }

    if (!address.trim()) {
       Alert.alert('Alamat Kosong', 'Mohon isi alamat pengiriman.');
       return;
    }

    setLoading(true);
    try {
      // Create order directly without payment gateway
      const payload = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalAmount,
        shippingAddress: address.trim(),
        customerInfo: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim()
        }
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        Alert.alert(
          'Pesanan Berhasil! ✓', 
          'Pesanan Anda telah diterima. Silakan lakukan pembayaran melalui transfer bank atau COD.',
          [
            { 
              text: 'Lihat Pesanan', 
              onPress: () => router.replace('/(tabs)/orders') 
            },
            { 
              text: 'Ke Beranda', 
              onPress: () => router.replace('/(tabs)'),
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Gagal', data.message || 'Terjadi kesalahan saat membuat pesanan.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal menghubungkan ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Checkout" showBack />
      
      <ScrollView contentContainerStyle={styles.content}>
         {/* Customer Info Section */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informasi Pelanggan</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                 <User size={18} color="#666" style={styles.inputIcon} />
                 <TextInput 
                    style={styles.inputSmall}
                    placeholder="Nama Depan"
                    value={firstName}
                    onChangeText={setFirstName}
                 />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                 <TextInput 
                    style={styles.inputSmall}
                    placeholder="Nama Belakang"
                    value={lastName}
                    onChangeText={setLastName}
                 />
              </View>
            </View>

            <View style={[styles.inputContainer, { marginTop: 12 }]}>
               <Phone size={18} color="#666" style={styles.inputIcon} />
               <TextInput 
                  style={styles.inputSmall}
                  placeholder="Nomor Telepon (08xxx)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
               />
            </View>
         </View>

         {/* Shipping Address */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
            <View style={styles.inputContainer}>
               <MapPin size={20} color="#666" style={styles.inputIcon} />
               <TextInput 
                  style={styles.input}
                  placeholder="Masukkan alamat lengkap..."
                  multiline
                  value={address}
                  onChangeText={setAddress}
               />
            </View>
         </View>

         {/* Order Summary */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                 <Text style={styles.summaryName}>{item.quantity}x {item.name}</Text>
                 <Text style={styles.summaryPrice}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
               <Text style={styles.totalLabel}>Total Bayar</Text>
               <Text style={styles.totalValue}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
            </View>
         </View>

         {/* Payment Info */}
         <View style={styles.section}>
             <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
             <View style={styles.paymentMethod}>
                <CheckCircle size={24} color="#22C55E" />
                <View style={styles.paymentInfo}>
                   <Text style={styles.paymentText}>Transfer Bank / COD</Text>
                   <Text style={styles.paymentSubtext}>Pembayaran langsung atau saat barang diterima</Text>
                </View>
             </View>
         </View>
      </ScrollView>

      <View style={styles.footer}>
         <TouchableOpacity 
            style={[styles.payBtn, loading && styles.disabledBtn]} 
            onPress={handleCheckout}
            disabled={loading}
         >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.payBtnText}>Konfirmasi Pesanan</Text>
                <ArrowRight size={18} color="#fff" />
              </>
            )}
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
  },
  inputIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#333',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputSmall: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryName: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'PlusJakartaSans_400Regular',
    flex: 1,
  },
  summaryPrice: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.light.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#166534',
  },
  paymentSubtext: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#22C55E',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  payBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
