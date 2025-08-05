import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.replace('/login');
      } else {
        // Redirect to home if authenticated
        router.replace('/');
      }
    }
  }, [isAuthenticated, loading]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('user-token');
      const email = await AsyncStorage.getItem('user-email');
      
      if (token && email) {
        setIsAuthenticated(true);
        setUserEmail(email);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string) => {
    try {
      await AsyncStorage.setItem('user-token', 'demo-token');
      await AsyncStorage.setItem('user-email', email);
      setIsAuthenticated(true);
      setUserEmail(email);
    } catch (error) {
      console.log('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user-token');
      await AsyncStorage.removeItem('user-email');
      setIsAuthenticated(false);
      setUserEmail(null);
      router.replace('/login');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const value = {
    isAuthenticated,
    userEmail,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 