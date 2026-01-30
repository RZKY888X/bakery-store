import { StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { API_URL, UPLOAD_URL, fixImageUrl } from '@/constants/Config';
import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ShoppingCart, Heart } from 'lucide-react-native';
import CustomHeader from '@/components/CustomHeader';
import { Stack, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

export default function TabTwoScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`)
      ]);
      
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData);
      setCategories(['Semua', ...catData.map((c: any) => c.name)]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category?.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || p.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const popularProducts = products.slice(0, 3); // Just take first 3 as popular for now

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader showBack={true} title="Katalog Produk" />
      
      <FlatList
        data={filteredProducts}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>Katalog <Text style={styles.italicTitle}>Produk</Text></Text>
            </View>

            <View style={styles.searchContainer}>
               <Search size={20} color="#999" />
               <TextInput 
                  style={styles.searchInput}
                  placeholder="Cari pastry favoritmu..."
                  value={search}
                  onChangeText={setSearch}
               />
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
               {categories.map((cat) => (
                 <TouchableOpacity 
                    key={cat} 
                    style={[styles.categoryPill, activeCategory === cat && styles.activeCategoryPill]}
                    onPress={() => setActiveCategory(cat)}
                 >
                    <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>{cat}</Text>
                 </TouchableOpacity>
               ))}
            </ScrollView>

            {/* Popular Section */}
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Populer Hari Ini</Text>
               <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterText}>Filter</Text>
                  <SlidersHorizontal size={14} color="#D4AF37" />
               </TouchableOpacity>
            </View>

            <FlatList
               horizontal
               data={popularProducts}
               keyExtractor={(item) => `pop-${item.id}`}
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
               renderItem={({ item }) => (
                 <TouchableOpacity style={styles.popularCard}>
                    <View style={styles.popularImageContainer}>
                       <Image source={{ uri: fixImageUrl(item.image) }} style={styles.popularImage} />
                       <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>TERLARIS</Text>
                       </View>
                       <TouchableOpacity style={styles.heartBtnSmall}>
                          <Heart size={14} color="#fff" />
                       </TouchableOpacity>
                    </View>
                    <Text style={styles.popularTitle} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.popularPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                    <TouchableOpacity style={styles.addToCartSmall}>
                       <ShoppingCart size={14} color="#fff" style={{ marginRight: 4 }} />
                       <Text style={styles.addToCartTextSmall}>Beli</Text>
                    </TouchableOpacity>
                 </TouchableOpacity>
               )}
            />
            
            {/* Grid Header */}
             <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Semua Produk</Text>
            </View>
          </>
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardImageContainer}>
              <Image 
                source={{ uri: fixImageUrl(item.image) }} 
                style={styles.cardImage} 
              />
              <TouchableOpacity style={styles.heartBtn}>
                 <Heart size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
               <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
               <Text style={styles.cardPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
              <TouchableOpacity style={styles.addToCartBtn} onPress={() => addToCart(item)}>
                 <ShoppingCart size={16} color="#fff" style={{ marginRight: 6 }} />
                 <Text style={styles.addToCartText}>Beli</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7', // Beige background from screenshot
  },
  headerTitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
  },
  italicTitle: {
    fontStyle: 'italic',
    color: '#D4AF37',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25, // Rounder
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#333',
  },
  categoryList: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeCategoryPill: {
    backgroundColor: '#8B5E3C', // Brown
    borderColor: '#8B5E3C',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#D4AF37',
  },
  popularCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  popularImageContainer: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  heartBtnSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularTitle: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 4,
  },
  popularPrice: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#8B5E3C',
    marginBottom: 10,
  },
  addToCartSmall: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartTextSmall: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    padding: 12,
  },
  cardImageContainer: {
    height: 140,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
     position: 'absolute',
     top: 10,
     right: 10,
     width: 28,
     height: 28,
     borderRadius: 14,
     backgroundColor: 'rgba(255,255,255,0.3)',
     alignItems: 'center',
     justifyContent: 'center',
  },
  cardContent: {
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 4,
    height: 44, // 2 lines
  },
  cardPrice: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#8B5E3C',
    marginBottom: 12,
  },
  addToCartBtn: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
