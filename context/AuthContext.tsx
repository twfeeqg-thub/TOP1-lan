'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  name?: string | null;
  role: 'user' | 'master' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function initFromCookie(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') return { token: null, user: null }
  const token = getCookie('aisahl_access_token')
  if (!token) return { token: null, user: null }
  const payload = decodeJwtPayload(token)
  if (!payload) return { token: null, user: null }
  return {
    token,
    user: {
      id: payload.userId as string,
      phone: payload.phone as string,
      role: payload.role as User['role'],
    },
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initState] = useState(initFromCookie)
  const [user, setUser] = useState<User | null>(initState.user);
  const [accessToken, setAccessToken] = useState<string | null>(initState.token);
  const [isLoading] = useState(false);

  const login = useCallback((token: string, userData: User) => {
    document.cookie = `aisahl_access_token=${token}; path=/; max-age=900; samesite=strict; ${window.location.protocol === 'https:' ? 'secure;' : ''}`
    setAccessToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    document.cookie = 'aisahl_access_token=; path=/; max-age=0'
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' });
      if (!res.ok) {
        setAccessToken(null);
        setUser(null);
        return false;
      }
      const data = await res.json();
      document.cookie = `aisahl_access_token=${data.access_token}; path=/; max-age=900; samesite=strict; ${window.location.protocol === 'https:' ? 'secure;' : ''}`
      setAccessToken(data.access_token);
      return true;
    } catch {
      setAccessToken(null);
      setUser(null);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
