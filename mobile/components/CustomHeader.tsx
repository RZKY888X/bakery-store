import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Dimensions } from 'react-native';
import { ShoppingBag, Menu, X, ArrowLeft, LayoutDashboard, Info, Phone, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

const { width, height } = Dimensions.get('window');

interface CustomHeaderProps {
  showBack?: boolean;
  title?: string;
}

export default function CustomHeader({ showBack, title }: CustomHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { totalItems } = useCart();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  const navigateTo = (path: string) => {
    setMenuOpen(false);
    // @ts-ignore
    router.push(path);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Left: Back Btn or Logo */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
               <ArrowLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandContainer}>
               <View style={styles.logoIcon}>
                  <Text style={styles.logoIconText}>S</Text>
               </View>
               <Text style={styles.brandName}>Swadista</Text>
            </View>
          )}
        </View>



// ... inside render ...

        {/* Right: Cart & Menu */}
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/cart')}>
             <ShoppingBag size={22} color={Colors.light.text} />
             {/* Badge Dot */}
             {totalItems > 0 && <View style={styles.badgeDot} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuOpen(true)}>
             <Menu size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuOpen(false)}>
           <View style={styles.menuContainer}>
              <View style={styles.menuHeader}>
                 <Text style={styles.menuTitle}>Menu</Text>
                 <TouchableOpacity onPress={() => setMenuOpen(false)}>
                    <X size={24} color={Colors.light.text} />
                 </TouchableOpacity>
              </View>
              
              <View style={styles.menuItems}>
                 <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(tabs)')}>
                    <Text style={styles.menuText}>Beranda</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(tabs)/explore')}>
                    <ShoppingBag size={18} color={Colors.light.text} style={{marginRight: 10}} />
                    <Text style={styles.menuText}>Produk</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/about')}>
                    <Info size={18} color={Colors.light.text} style={{marginRight: 10}} />
                    <Text style={styles.menuText}>Tentang Kami</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/programs')}>
                    <Calendar size={18} color={Colors.light.text} style={{marginRight: 10}} />
                    <Text style={styles.menuText}>Program</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/contact')}>
                    <Phone size={18} color={Colors.light.text} style={{marginRight: 10}} />
                    <Text style={styles.menuText}>Kontak</Text>
                 </TouchableOpacity>
                 
                 <View style={styles.divider} />
                 
                 <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/login')}>
                    <LayoutDashboard size={18} color={Colors.light.secondary} style={{marginRight: 10}} />
                    <Text style={[styles.menuText, {color: Colors.light.secondary}]}>Login</Text>
                 </TouchableOpacity>
              </View>
           </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    zIndex: 100,
    paddingTop: 0, // Handled by parent styling or SafeArea
  },
  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#8B5E3C',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    color: '#fff',
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
  },
  brandName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: '#5D4037',
  },
  iconBtn: {
    padding: 4,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    paddingTop: 50, // Space for status bar if needed
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#5D4037',
  },
  menuItems: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  } 
});
