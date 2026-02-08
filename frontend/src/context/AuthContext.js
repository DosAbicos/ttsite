import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
    // Mock login - in production would call API
    const mockUser = {
      id: 1,
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = (email, password, name) => {
    // Mock register - in production would call API
    const mockUser = {
      id: Date.now(),
      email,
      name,
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode,
      openAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};
