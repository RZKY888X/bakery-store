import { StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, RefreshControl, Dimensions, Text, View } from 'react-native';
// import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { API_URL, UPLOAD_URL, fixImageUrl } from '@/constants/Config';
import { useEffect, useState } from 'react';
import CustomHeader from '@/components/CustomHeader';
import { ShieldCheck, ArrowRight, BadgeCheck, Clock, Heart, ShoppingBag, MapPin, ArrowUpRight, Mail, Instagram, Facebook, Twitter } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

export default function TabOneScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/favorites`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
           <Image 
              source={require('@/assets/images/mainbanner.png')} 
              style={styles.heroImage} 
           />
           <View style={styles.heroOverlay}>
              <View style={styles.pillBadge}>
                 <Text style={styles.pillBadgeText}>TRADITIONAL CRAFTSMANSHIP</Text>
              </View>
              <Text style={styles.heroTitle}>Swadista{'\n'}<Text style={styles.italicSerif}>Artisan</Text> Bakery</Text>
              <Text style={styles.heroSubtitle}>
                Menghadirkan kehangatan roti artisan terbaik dengan bahan pilihan.
              </Text>
              
              <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={styles.primaryBtnText}>Lihat Produk</Text>
                  <ArrowRight size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>Cerita Kami</Text>
                </TouchableOpacity>
              </View>
           </View>
        </View>

        {/* Cerita Kami Section */}
        <View style={styles.storySection}>
            <View style={styles.storyImageContainer}>
              <Image 
                source={require('@/assets/images/swadistalestari.png')} 
                style={styles.storyImage} 
              />
              <View style={styles.floatingBadge}>
                 <Text style={styles.floatingBadgeNumber}>12+</Text>
                 <Text style={styles.floatingBadgeText}>TAHUN PENGALAMAN</Text>
                 <Text style={styles.floatingBadgeSub}>KUALITAS EXCELLENCE</Text>
              </View>
            </View>

            <Text style={styles.sectionTitleLeft}>Cerita <Text style={styles.italicText}>Kami</Text></Text>
            
            <Text style={styles.storyText}>
              Swadista lahir sebagai bagian dari perjalanan kewirausahaan yang terinspirasi dari kehangatan rumah dan kesederhanaan roti. 
            </Text>

            <View style={styles.quoteBlock}>
               <View style={styles.quoteLine} />
               <Text style={styles.quoteText}>
                 "Pemanggangan adalah tentang menghadirkan aroma masa kecil dan kebahagiaan dalam setiap sajian."
               </Text>
            </View>
        </View>

        {/* Keunggulan Kami Section - Web Style (3 Items) */}
        <View style={styles.featuresSection}>
            <Text style={styles.sectionTitleCenter}>KEUNGGULAN KAMI</Text>
            <View style={styles.dividerCenter} />

            <View style={styles.featureGrid}>
              <View style={styles.featureCard}>
                 <View style={styles.featureIconCircle}>
                    <BadgeCheck size={24} color="#8B5E3C" strokeWidth={2} />
                 </View>
                 <Text style={styles.featureTitle}>Kualitas Terjaga</Text>
                 <Text style={styles.featureDesc}>
                   Produk kami selalu disajikan hangat sehingga kualitas terjaga.
                 </Text>
              </View>

              <View style={styles.featureCard}>
                 <View style={styles.featureIconCircle}>
                    <Clock size={24} color="#8B5E3C" strokeWidth={2} />
                 </View>
                 <Text style={styles.featureTitle}>Mudah Disajikan</Text>
                 <Text style={styles.featureDesc}>
                   Siap disantap kapanpun dan dimanapun sebagai teman setia.
                 </Text>
              </View>

              <View style={styles.featureCard}>
                 <View style={styles.featureIconCircle}>
                    <ShieldCheck size={24} color="#8B5E3C" strokeWidth={2} />
                 </View>
                 <Text style={styles.featureTitle}>Bersih & Aman</Text>
                 <Text style={styles.featureDesc}>
                   Roti kami dijamin bersih dan aman dari zat berbahaya.
                 </Text>
              </View>
            </View>
        </View>

        {/* Favorites Section */}
        <View style={styles.favoritesSection}>
          <View style={styles.sectionHeader}>
             <View>
              <Text style={styles.sectionTitle}>Produk <Text style={styles.italicText}>Favorit</Text></Text>
              <Text style={styles.sectionSubtitle}>Pilihan makanan ringan hangat untuk hari Anda</Text>
             </View>
             <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                <Text style={styles.seeAll}>LIHAT {'>'}</Text>
             </TouchableOpacity>
          </View>

          <FlatList
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.75 + 16}
            decelerationRate="fast"
            contentContainerStyle={{ 
              paddingHorizontal: width * 0.125 - 8,
              paddingBottom: 20 
            }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={[
                  styles.productCard,
                  { 
                    width: width * 0.75,
                    marginHorizontal: 8,
                  }
                ]}
                activeOpacity={0.9}
              >
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: fixImageUrl(item.image) }} 
                    style={styles.productImage} 
                  />
                  <View style={styles.bestSellerBadge}>
                    <Text style={styles.bestSellerText}>BEST SELLER</Text>
                  </View>
                  <TouchableOpacity style={styles.heartBtn}>
                    <Heart size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.productContent}>
                   <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
                   <Text style={styles.productDesc} numberOfLines={2}>
                     Nikmati kelezatan {item.name} yang dibuat dengan bahan premium pilihan.
                   </Text>
                   <View style={styles.priceRow}>
                     <Text style={styles.productPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                     <TouchableOpacity style={styles.addToCartBtn} onPress={() => addToCart(item)}>
                        <ShoppingBag size={18} color="#fff" />
                     </TouchableOpacity>
                   </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>


        {/* Location Section */}
        <View style={styles.locationContainer}>
           <View style={styles.locationCard}>
              <View style={styles.locationInfo}>
                 <Text style={styles.locationHeaderTitle}>Kunjungi <Text style={styles.boldSerif}>Toko Offline</Text>{'\n'}Kami</Text>
                 <Text style={styles.locationDesc}>
                   Pilihan makanan berkualitas dengan rasa yang istimewa terjaga, siap menemani kebutuhan harian rumah.
                 </Text>

                 <View style={styles.locationItem}>
                    <View style={styles.locationIconBox}>
                       <MapPin size={20} color="#8B5E3C" />
                    </View>
                    <View>
                       <Text style={styles.locationLabel}>Alamat Utama</Text>
                       <Text style={styles.locationValue}>Jl. Dawam No. 4/7, Kebayoran Baru,{'\n'}Jakarta Selatan</Text>
                    </View>
                 </View>

                 <View style={styles.locationItem}>
                    <View style={styles.locationIconBox}>
                       <Clock size={20} color="#8B5E3C" />
                    </View>
                    <View>
                       <Text style={styles.locationLabel}>Jam Operasional</Text>
                       <Text style={styles.locationValue}>Senin - Minggu: 07.00 - 21.00</Text>
                    </View>
                 </View>

                 <TouchableOpacity style={styles.directionBtn}>
                   <Text style={styles.directionBtnText}>Petunjuk Arah</Text>
                   <ArrowUpRight size={16} color="#fff" />
                 </TouchableOpacity>
              </View>
              
              <Image 
                 source={require('@/assets/images/backgrounds/location-bg.png')} 
                 style={styles.locationFooterImage}
              />
           </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
           <View style={styles.footerContent}>
               <View style={styles.newsletterRow}>
                  <Mail size={20} color="#D4AF37" />
                  <Text style={styles.newsletterTitle}>BERLANGGANAN</Text>
               </View>
               <Text style={styles.newsletterDesc}>Dapatkan promo menarik dan informasi produk terbaru langsung di email Anda.</Text>
               
               <View style={styles.emailInputContainer}>
                  <Text style={styles.emailPlaceholder}>Email Anda</Text>
                  <TouchableOpacity style={styles.subscribeBtn}>
                     <ArrowRight size={20} color="#fff" />
                  </TouchableOpacity>
               </View>

               <View style={styles.footerLinksRow}>
                  <View>
                     <Text style={styles.footerLinkHeader}>MENU KAMI</Text>
                     <Text style={styles.footerLink}>Tentang Kami</Text>
                     <Text style={styles.footerLink}>Katalog Produk</Text>
                     <Text style={styles.footerLink}>Lokasi Toko</Text>
                  </View>
                  <View>
                     <Text style={styles.footerLinkHeader}>IKUTI KAMI</Text>
                     <View style={styles.socialIcons}>
                        <View style={styles.socialCircle}><Instagram size={16} color="#fff" /></View>
                        <View style={styles.socialCircle}><Facebook size={16} color="#fff" /></View>
                        <View style={styles.socialCircle}><Twitter size={16} color="#fff" /></View>
                     </View>
                  </View>
               </View>
           </View>
           <Text style={styles.copyright}>© 2024 Swadista Artisan Bakery. Hak Cipta Dilindungi.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 0,
    // Note: No padding top needed as CustomHeader is outside ScrollView
  },
  // header: { ... removed ... }, 
  // brandContainer: { ... removed ... },
  // ... (keep hero styles)
  hero: {
    height: 500,
    position: 'relative',
    marginBottom: 20,
    marginTop: 0, 
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  pillBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 40,
    lineHeight: 48,
    fontFamily: 'PlayfairDisplay_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  italicSerif: {
    fontStyle: 'italic',
    color: '#D4AF37',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '80%',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  storySection: {
    padding: 24,
  },
  storyImageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  storyImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  floatingBadge: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    backgroundColor: '#D4AF37', // Gold
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingBadgeNumber: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#fff',
  },
  floatingBadgeText: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    marginTop: 2,
  },
  floatingBadgeSub: {
    fontSize: 6,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sectionTitleLeft: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  italicText: {
    fontStyle: 'italic',
    color: '#8B5E3C',
  },
  storyText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginBottom: 20,
  },
  quoteBlock: {
    flexDirection: 'row',
    gap: 12,
  },
  quoteLine: {
    width: 3,
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  quoteText: {
    flex: 1,
    fontStyle: 'italic',
    color: '#8B5E3C',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  featuresSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  sectionTitleCenter: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#5D4037',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  dividerCenter: {
    width: 40,
    height: 2,
    backgroundColor: '#D4AF37',
    marginBottom: 24,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5EFE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  favoritesSection: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  seeAll: {
    fontSize: 10,
    color: '#8B5E3C',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 1,
    marginTop: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  bestSellerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#8B5E3C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bestSellerText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#888',
    marginBottom: 12,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#8B5E3C',
  },
  addToCartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  locationContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  locationCard: {
    backgroundColor: '#FDFBF7', // Beige
    borderRadius: 24,
    overflow: 'hidden',
  },
  locationInfo: {
    padding: 24,
  },
  locationHeaderTitle: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_400Regular', // Regular serif
    color: '#333',
    marginBottom: 12,
    lineHeight: 32,
  },
  boldSerif: {
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  locationDesc: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 20,
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  locationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666',
    lineHeight: 18,
  },
  directionBtn: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  directionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  locationFooterImage: {
    width: '100%',
    height: 200,
  },
  footer: {
    backgroundColor: '#1A1A1A',
    paddingTop: 40,
    paddingBottom: 20,
  },
  footerContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  newsletterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  newsletterTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 1,
  },
  newsletterDesc: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginBottom: 20,
    lineHeight: 20,
  },
  emailInputContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  emailPlaceholder: {
    flex: 1,
    paddingHorizontal: 12,
    color: '#666',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  subscribeBtn: {
    backgroundColor: '#D4AF37',
    padding: 8,
    borderRadius: 6,
  },
  footerLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLinkHeader: {
    color: '#D4AF37',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 16,
    letterSpacing: 1,
  },
  footerLink: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyright: {
    textAlign: 'center',
    color: '#444',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
  }
});
