import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Config';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        const storedUser = await SecureStore.getItemAsync('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to restore session', e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      setToken(data.token);
      setUser(data.user);

      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));

    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, token }}>
      {children}
    </AuthContext.Provider>
  );
}
