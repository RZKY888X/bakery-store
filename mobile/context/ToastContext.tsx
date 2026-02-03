import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (title: string, msg: string, type: ToastType = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setTitle(title);
    setMessage(msg);
    setType(type);
    setVisible(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 5,
      }),
    ]).start();

    timerRef.current = setTimeout(() => {
      hideToast();
    }, 3000);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <Animated.View 
          style={[
            styles.toastContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              top: insets.top + 10
            }
          ]}
        >
          <View style={[styles.toastCard, type === 'error' && styles.errorCard]}>
            <View style={[styles.iconContainer, type === 'error' && styles.errorIcon]}>
              {type === 'success' && <CheckCircle size={24} color="#fff" />}
              {type === 'error' && <AlertCircle size={24} color="#fff" />}
              {type === 'info' && <Info size={24} color="#fff" />}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
            <TouchableOpacity onPress={hideToast} style={styles.closeBtn}>
              <X size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  toastCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981', // Success Green
  },
  errorCard: {
    borderLeftColor: '#EF4444',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  errorIcon: {
    backgroundColor: '#EF4444',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666',
  },
  closeBtn: {
    padding: 4,
  },
});
