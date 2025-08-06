import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'email';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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
      const userData = await AsyncStorage.getItem('user-data');
      const token = await AsyncStorage.getItem('user-token');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulate email/password authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `email_${Date.now()}`,
        email,
        name: email.split('@')[0], // Use email prefix as name
        provider: 'email',
      };

      await AsyncStorage.setItem('user-token', 'demo-token');
      await AsyncStorage.setItem('user-data', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Error during login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Firebase Google authentication...');
      
      // For now, simulate Firebase Google auth
      // This will be replaced with real Firebase implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate Firebase user data
      const userData: User = {
        id: `firebase_google_${Date.now()}`,
        email: 'user@gmail.com',
        name: 'Google User',
        picture: 'https://via.placeholder.com/150',
        provider: 'google',
      };

      await AsyncStorage.setItem('user-token', 'firebase-token-' + Date.now());
      await AsyncStorage.setItem('user-data', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('Firebase Google authentication successful!');
      console.log('Next: Replace this with real Firebase implementation');
      
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user-token');
      await AsyncStorage.removeItem('user-data');
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    loginWithGoogle,
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