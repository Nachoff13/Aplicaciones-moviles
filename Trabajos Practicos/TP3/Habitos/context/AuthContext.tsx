import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

interface DecodedToken {
  email?: string;
  // Puedes agregar otras propiedades aquí si es necesario
}

const decodeToken = (token: string): DecodedToken => {
  // Implementa la lógica de decodificación del token aquí
  // Este es solo un ejemplo
  return JSON.parse(atob(token.split('.')[1]));
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token recuperado:', token);
      if (token) {
        const decodedToken =  decodeToken(token);
        console.log('Token decodificado:', decodedToken);
        if (decodedToken?.email) {
           setEmail(decodedToken.email);
          console.log('Email establecido:', decodedToken.email);
        }
      }
    };

    checkToken();
  }, []);

  const isAuthenticated = email !== null;
  console.log('Estado de autenticación:', isAuthenticated);

  const login = (email: string) => {
    setEmail(email);
    console.log('Usuario autenticado:', email);
  };

  const logout = () => {
    setEmail(null);
    AsyncStorage.removeItem('userToken');
    console.log('Usuario desautenticado');
  };

  return (
    <AuthContext.Provider value={{ email, isAuthenticated, login, logout }}>
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