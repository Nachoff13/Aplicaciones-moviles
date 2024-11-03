import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  userName: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const isAuthenticated = email !== null;

  const login = (email: string) => {
    setEmail(email);
  };

  const logout = () => {
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ userName, email, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};