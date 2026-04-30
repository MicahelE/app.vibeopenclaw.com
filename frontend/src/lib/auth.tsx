'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe } from './api';

interface User {
  id: string;
  email: string;
  name?: string;
  plan_tier: string;
  subscription_status?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUser(token: string): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('voc_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    setToken(storedToken);
    fetchUser(storedToken).then((u) => {
      if (u) {
        setUser(u);
        localStorage.setItem('voc_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('voc_token');
        localStorage.removeItem('voc_user');
        setToken(null);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem('voc_token', newToken);
    setToken(newToken);
    const fullUser = await fetchUser(newToken);
    if (fullUser) {
      localStorage.setItem('voc_user', JSON.stringify(fullUser));
      setUser(fullUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('voc_token');
    localStorage.removeItem('voc_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
