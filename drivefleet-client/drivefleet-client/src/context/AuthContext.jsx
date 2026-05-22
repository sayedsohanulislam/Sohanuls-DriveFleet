import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '../lib/authClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data: session, isPending: loading } = authClient.useSession();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (loading) {
      setSessionReady(false);
      return;
    }

    setSessionReady(true);
  }, [loading]);

  const user = session?.user
    ? {
        email: session.user.email,
        displayName: session.user.name,
        photoURL: session.user.image,
        uid: session.user.id,
      }
    : null;

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, name, photoURL) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: photoURL || undefined,
    });
    if (error) throw error;
    return data;
  };

  const googleLogin = (callbackURL = '/') => {
    const redirectTo = new URL(callbackURL, window.location.origin).toString();

    return authClient.signIn.social({
      provider: 'google',
      callbackURL: redirectTo,
    });
  };

  const logout = async () => {
    const { error } = await authClient.signOut();
    if (error) throw error;
  };

  const updateUserProfile = () => Promise.resolve();

  return (
    <AuthContext.Provider value={{ user, loading: loading || !sessionReady, login, register, googleLogin, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
