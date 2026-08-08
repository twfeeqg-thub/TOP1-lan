'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { db } from '@/lib/db';
import { getRandomMessage, farewellMessages } from '@/lib/psych-support';
import { LogoutFarewell } from '@/components/auth/LogoutFarewell';

export interface AuthUser {
  id: string;
  phone: string;
  name?: string | null;
  role: 'user' | 'master' | 'super_admin';
  tenant_id?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  subscriptions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  logoutFarewell: string | null;
  login: (accessToken: string, user: AuthUser, subscriptions?: string[]) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  refreshSubscriptions: () => Promise<string[]>;
  applyProfile: (user: AuthUser, accessToken?: string) => void;
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

function initFromCookie(): { token: string | null; user: AuthUser | null } {
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
      role: payload.role as AuthUser['role'],
    },
  }
}

function setAccessCookie(token: string) {
  const secure = window.location.protocol === 'https:' ? 'secure;' : ''
  document.cookie = `aisahl_access_token=${token}; path=/; max-age=900; samesite=strict; ${secure}`
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initState] = useState(initFromCookie)
  const [user, setUser] = useState<AuthUser | null>(initState.user);
  const [accessToken, setAccessToken] = useState<string | null>(initState.token);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutFarewell, setLogoutFarewell] = useState<string | null>(null);

  const syncSession = useCallback(async (): Promise<string[]> => {
    const res = await fetch('/api/auth/session');
    if (!res.ok) {
      throw new Error('Session invalid');
    }
    const data = await res.json();
    if (data.access_token) setAccessCookie(data.access_token);
    setAccessToken(data.access_token ?? null);
    setUser(data.user ?? null);
    const subs: string[] = data.subscriptions ?? [];
    setSubscriptions(subs);
    return subs;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await syncSession();
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
          setSubscriptions([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [syncSession]);

  const login = useCallback((token: string, userData: AuthUser, subs?: string[]) => {
    setAccessCookie(token);
    setAccessToken(token);
    setUser(userData);
    setSubscriptions(subs ?? []);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    document.cookie = 'aisahl_access_token=; path=/; max-age=0'

    // LOCAL CACHE ISOLATION — never leak another user's tenant configs or
    // pending overrides on a shared mobile device. Wipes every cached table
    // in the Dexie/IndexedDB instance (config caches + offline mutations).
    try {
      await Promise.all([db.projects.clear(), db.outbox.clear()]);
    } catch {}

    // PWA CACHE PURGE — drop every Service-Worker cache so the next login on
    // this device can never render another tenant's stale layout (aisahl-static-v1).
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch {}
    }

    setAccessToken(null);
    setUser(null);
    setSubscriptions([]);

    // Warm farewell before the hard redirect — the LogoutFarewell overlay
    // (mounted below) auto-navigates after ~1.2s with a strict 1.5s fallback,
    // so the timer can never strand the user on a locked screen.
    setLogoutFarewell(getRandomMessage(farewellMessages));
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' });
      if (!res.ok) {
        setAccessToken(null);
        setUser(null);
        setSubscriptions([]);
        return false;
      }
      const data = await res.json();
      setAccessCookie(data.access_token);
      setAccessToken(data.access_token);
      try {
        await syncSession();
      } catch {}
      return true;
    } catch {
      setAccessToken(null);
      setUser(null);
      setSubscriptions([]);
      return false;
    }
  }, [syncSession]);

  const refreshSubscriptions = useCallback(async (): Promise<string[]> => {
    try {
      return await syncSession();
    } catch {
      return subscriptions;
    }
  }, [syncSession, subscriptions]);

  const applyProfile = useCallback((profileUser: AuthUser, newToken?: string) => {
    setUser(profileUser);
    if (newToken) {
      setAccessCookie(newToken);
      setAccessToken(newToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        subscriptions,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        logoutFarewell,
        login,
        logout,
        refreshToken,
        refreshSubscriptions,
        applyProfile,
      }}
    >
      {children}
      <LogoutFarewell message={logoutFarewell} />
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
