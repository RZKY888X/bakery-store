import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Tentang Kami" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Image 
          source={require('@/assets/images/swadistalestari.png')}
          style={styles.heroImage}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Swadista Artisan Bakery</Text>
          <Text style={styles.paragraph}>
            Selamat datang di Swadista, tempat di mana setiap potong roti menceritakan kisah dedikasi, kehangatan, dan cita rasa autentik.
          </Text>
          <Text style={styles.paragraph}>
            Didirikan pada tahun 2012, kami memulai perjalanan ini dengan satu misi sederhana: menghadirkan roti artisan berkualitas tinggi yang dibuat dengan hati. Setiap adonan kami uleni dengan tangan, difermentasi dengan sabar, dan dipanggang hingga kesempurnaan keemasan.
          </Text>
          <Text style={styles.subTitle}>Filosofi Kami</Text>
          <Text style={styles.paragraph}>
            Kami percaya bahwa bahan terbaik menghasilkan rasa terbaik. Oleh karena itu, kami hanya menggunakan tepung premium, mentega murni, dan ragi alami tanpa pengawet buatan. Kebersihan dan kesehatan pelanggan adalah prioritas utama kami.
          </Text>
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
  content: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  textContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#5D4037',
    marginTop: 16,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#555',
    lineHeight: 26,
    marginBottom: 16,
  },
});
