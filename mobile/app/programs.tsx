import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';

export default function ProgramsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Program Kami" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.programCard}>
           <Image 
             source={require('@/assets/images/programs/program1.png')}
             style={styles.cardImage}
           />
           <View style={styles.cardContent}>
             <Text style={styles.cardTitle}>Membership Loyalty</Text>
             <Text style={styles.cardDesc}>
               Dapatkan poin setiap pembelian dan tukarkan dengan produk gratis atau diskon eksklusif. Bergabunglah menjadi member Swadista Family hari ini!
             </Text>
           </View>
        </View>

        <View style={styles.programCard}>
           <Image 
             source={require('@/assets/images/programs/program2.png')}
             style={styles.cardImage}
           />
           <View style={styles.cardContent}>
             <Text style={styles.cardTitle}>Friday Discount</Text>
             <Text style={styles.cardDesc}>
               Nikmati diskon 20% untuk semua varian Cake setiap hari Jumat. Cara manis untuk menyambut akhir pekan Anda.
             </Text>
           </View>
        </View>

        <View style={styles.programCard}>
           <Image 
             source={require('@/assets/images/programs/program3.png')}
             style={styles.cardImage}
           />
           <View style={styles.cardContent}>
             <Text style={styles.cardTitle}>Workshop Baking</Text>
             <Text style={styles.cardDesc}>
               Ingin belajar membuat roti artisan sendiri? Ikuti kelas baking bulanan kami bersama chef berpengalaman.
             </Text>
           </View>
        </View>

        <View style={styles.programCard}>
           <Image 
             source={require('@/assets/images/programs/program4.png')}
             style={styles.cardImage}
           />
           <View style={styles.cardContent}>
             <Text style={styles.cardTitle}>Special Order</Text>
             <Text style={styles.cardDesc}>
               Pesan roti khusus untuk acara spesial Anda. Kami siap membantu mewujudkan pesanan custom sesuai keinginan.
             </Text>
           </View>
        </View>

      </ScrollView>
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
  programCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666',
    lineHeight: 22,
  },
});
