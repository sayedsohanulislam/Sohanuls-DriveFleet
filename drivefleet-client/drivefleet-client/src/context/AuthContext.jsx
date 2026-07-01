"use client";
import { createContext, useContext, useMemo } from 'react';
import { authClient } from '../lib/authClient';

const AuthContext = createContext(null);

const toLegacyUser = (sessionUser) => {
  if (!sessionUser) return null;

  return {
    ...sessionUser,
    displayName: sessionUser.name || sessionUser.displayName || '',
    photoURL: sessionUser.image || sessionUser.photoURL || '',
  };
};

const throwBetterAuthError = (error, fallback) => {
  if (!error) return;
  const err = new Error(error.message || fallback);
  err.status = error.status;
  err.code = error.code;
  throw err;
};

export const AuthProvider = ({ children }) => {
  const session = authClient.useSession();
  const user = useMemo(() => toLegacyUser(session.data?.user), [session.data?.user]);

  const login = async (email, password) => {
    const result = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
      rememberMe: true,
      callbackURL: '/',
    });
    throwBetterAuthError(result.error, 'Login failed');
    await session.refetch?.();
    return result.data;
  };

  const register = async (email, password, name, photoURL) => {
    const result = await authClient.signUp.email({
      email: email.trim().toLowerCase(),
      password,
      name,
      image: photoURL || undefined,
      callbackURL: '/',
    });
    throwBetterAuthError(result.error, 'Registration failed');
    await session.refetch?.();
    return result.data;
  };

  const googleLogin = () => {
    return authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
      errorCallbackURL: '/login',
      newUserCallbackURL: '/',
    });
  };

  const logout = async () => {
    const result = await authClient.signOut();
    throwBetterAuthError(result.error, 'Logout failed');
    await session.refetch?.();
    return result.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: session.isPending,
        login,
        register,
        googleLogin,
        logout,
        refreshSession: session.refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
