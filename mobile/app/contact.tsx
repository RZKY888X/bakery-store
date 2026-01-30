import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react-native';

export default function ContactScreen() {
  
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Kontak Kami" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>Hubungi Kami</Text>
          <Text style={styles.subtitle}>
            Kami siap mendengar masukan, pertanyaan, atau pesanan khusus Anda.
          </Text>
        </View>

        <View style={styles.card}>
           <View style={styles.row}>
              <View style={styles.iconBox}>
                 <Phone size={24} color="#8B5E3C" />
              </View>
              <View style={styles.infoBox}>
                 <Text style={styles.label}>Telepon / WhatsApp</Text>
                 <TouchableOpacity onPress={() => openLink('tel:+6281234567890')}>
                   <Text style={styles.value}>+62 812-3456-7890</Text>
                 </TouchableOpacity>
              </View>
           </View>
           <View style={styles.divider} />
           <View style={styles.row}>
              <View style={styles.iconBox}>
                 <Mail size={24} color="#8B5E3C" />
              </View>
              <View style={styles.infoBox}>
                 <Text style={styles.label}>Email</Text>
                 <TouchableOpacity onPress={() => openLink('mailto:hello@swadista.com')}>
                   <Text style={styles.value}>hello@swadista.com</Text>
                 </TouchableOpacity>
              </View>
           </View>
           <View style={styles.divider} />
           <View style={styles.row}>
              <View style={styles.iconBox}>
                 <MapPin size={24} color="#8B5E3C" />
              </View>
              <View style={styles.infoBox}>
                 <Text style={styles.label}>Lokasi</Text>
                 <Text style={styles.value}>Jl. Dawam No. 4/7, Kebayoran Baru, Jakarta Selatan, 12150</Text>
              </View>
           </View>
        </View>

        <View style={styles.socialSection}>
           <Text style={styles.socialTitle}>Ikuti Kami</Text>
           <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={() => openLink('https://instagram.com')}>
                 <Instagram size={24} color="#fff" />
                 <Text style={styles.socialText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#1877F2' }]} onPress={() => openLink('https://facebook.com')}>
                 <Facebook size={24} color="#fff" />
                 <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
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
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDFBF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoBox: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  socialSection: {
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#333',
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1306C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
  },
  socialText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
  },
});
