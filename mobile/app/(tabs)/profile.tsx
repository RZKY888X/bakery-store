import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
       {user ? (
         <View style={styles.content}>
            <View style={styles.avatar}>
               <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
               <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
         </View>
       ) : (
         <View style={styles.content}>
            <Text style={styles.title}>Profil</Text>
            <Text style={styles.subtitle}>Silakan masuk untuk melihat profil Anda.</Text>
            <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
               <Text style={styles.loginText}>Masuk / Daftar</Text>
            </TouchableOpacity>
         </View>
       )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  name: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.light.secondary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.light.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666',
    marginBottom: 24,
  },
  logoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'red',
  },
  logoutText: {
    color: 'red',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  loginBtn: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  loginText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
  }
});
