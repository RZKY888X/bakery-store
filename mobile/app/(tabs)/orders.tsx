import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { API_URL, fixImageUrl } from '@/constants/Config';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import CustomHeader from '@/components/CustomHeader';
import { Package, Clock, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react-native';

export default function OrdersScreen() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B'; // Orange
      case 'PAID': return '#10B981'; // Green
      case 'SHIPPED': return '#3B82F6'; // Blue
      case 'COMPLETED': return '#8B5E3C'; // Brown
      case 'CANCELLED': return '#EF4444'; // Red
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Pembayaran';
      case 'PAID': return 'Sudah Dibayar';
      case 'SHIPPED': return 'Dikirim';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  if (!user) {
    return (
       <SafeAreaView style={styles.container}>
         <CustomHeader title="Pesanan Saya" />
         <View style={styles.centerContent}>
            <ShoppingBag size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum Login</Text>
            <Text style={styles.emptySub}>Silakan login untuk melihat pesanan Anda.</Text>
         </View>
       </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Pesanan Saya" />
      
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContent}>
          <Package size={64} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
          <Text style={styles.emptySub}>Yuk mulai belanja roti favoritmu!</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.orderCard}>
              <View style={styles.orderHeader}>
                 <View style={styles.orderIdRow}>
                    <Package size={16} color={Colors.light.primary} />
                    <Text style={styles.orderId}>Order #{item.id}</Text>
                 </View>
                 <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {getStatusLabel(item.status)}
                    </Text>
                 </View>
              </View>

              <View style={styles.divider} />

              {/* Show first product as preview */}
              {item.items && item.items.length > 0 && (
                <View style={styles.productRow}>
                   <Image 
                      source={{ uri: fixImageUrl(item.items[0].product?.image) }} 
                      style={styles.productImage} 
                   />
                   <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.items[0].product?.name}</Text>
                      <Text style={styles.productVariant}>
                        {item.items[0].quantity} barang {item.items.length > 1 ? `(+${item.items.length - 1} lainnya)` : ''}
                      </Text>
                   </View>
                </View>
              )}

              <View style={styles.footerRow}>
                 <View>
                    <Text style={styles.totalLabel}>Total Belanja</Text>
                    <Text style={styles.totalAmount}>Rp {item.totalAmount.toLocaleString('id-ID')}</Text>
                 </View>
                 <TouchableOpacity 
                    style={styles.detailBtn} 
                    onPress={() => {
                       Alert.alert(
                         `Detail Pesanan #${item.id}`,
                         `Alamat Pengiriman:\n${item.shippingAddress || '-'}\n\nMetode Pembayaran:\n${item.paymentMethod || '-'}\n\nTotal: Rp ${item.totalAmount.toLocaleString('id-ID')}`,
                         [{ text: 'Tutup' }]
                       );
                    }}
                 >
                    <Text style={styles.detailBtnText}>Detail Info</Text>
                 </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.light.primary,
  },
  detailBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  detailBtnText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
