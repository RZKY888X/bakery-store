import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { fixImageUrl } from '@/constants/Config';
import CustomHeader from '@/components/CustomHeader';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Keranjang" showBack />
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
          <Text style={styles.emptySub}>Belum ada roti yang dipilih nih.</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/explore')}>
             <Text style={styles.browseBtnText}>Lihat Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Keranjang" showBack />
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
             <Image source={{ uri: fixImageUrl(item.image) }} style={styles.itemImage} />
             
             <View style={styles.itemContent}>
                <View style={styles.itemTop}>
                   <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                   <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Trash2 size={18} color="#EF4444" />
                   </TouchableOpacity>
                </View>
                
                <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                
                <View style={styles.qtyContainer}>
                   <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                   >
                      <Minus size={14} color="#333" />
                   </TouchableOpacity>
                   <Text style={styles.qtyText}>{item.quantity}</Text>
                   <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                   >
                      <Plus size={14} color="#333" />
                   </TouchableOpacity>
                </View>
             </View>
          </View>
        )}
      />

      <View style={styles.footer}>
         <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
         </View>
         
         <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
            <Text style={styles.checkoutBtnText}>Checkout</Text>
            <ArrowRight size={16} color="#fff" />
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
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginTop: 16,
  },
  emptySub: {
    color: '#888',
    marginTop: 8,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  browseBtn: {
    marginTop: 24,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  browseBtnText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#333',
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.light.primary,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#333',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
  },
  checkoutBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
