'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, extractToken } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { clearToken, getToken, setToken } from '@/utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [avatarVersion, setAvatarVersion] = useState(0);

  const clearSession = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await userService.getProfile();
    setUser(profile);
    return profile;
  }, []);

  // Restore session after a page refresh
  useEffect(() => {
    let active = true;
    (async () => {
      if (getToken()) {
        try {
          await refreshProfile();
        } catch (e) {
          if (e.status === 401 || e.status === 403) clearSession();
        }
      }
      if (active) setInitializing(false);
    })();
    return () => { active = false; };
  }, [refreshProfile, clearSession]);

  // Any 401 on a protected call ends the session
  useEffect(() => {
    const onUnauthorized = () => clearSession();
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    const token = extractToken(data);
    if (!token) throw new Error('Login failed. Please try again.');
    setToken(token);
    try {
      return await refreshProfile();
    } catch (e) {
      clearSession();
      throw e;
    }
  }, [refreshProfile, clearSession]);

  const logout = useCallback(() => {
    clearSession();
    router.replace('/login');
  }, [clearSession, router]);

  const bumpAvatar = useCallback(() => setAvatarVersion(Date.now()), []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin: String(user?.role || '').toLowerCase() === 'admin',
    initializing,
    avatarVersion,
    login,
    logout,
    refreshProfile,
    bumpAvatar,
  }), [user, initializing, avatarVersion, login, logout, refreshProfile, bumpAvatar]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
