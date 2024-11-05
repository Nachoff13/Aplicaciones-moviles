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
}

const base64UrlDecode = (str: string): string => {
  // Reemplaza caracteres de base64url a base64 estándar
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Añade relleno si es necesario
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
};

const decodeToken = (token: string): DecodedToken => {
  try {
    const payload = token.split('.')[1];
    if (!payload) throw new Error("Token no válido");
    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return {};
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      //console.log('Token recuperado:', token);
      if (token) {
        const decodedToken = decodeToken(token);
        //console.log('Token decodificado:', decodedToken);
        if (decodedToken?.email) {
          setEmail(decodedToken.email);
          //console.log('Email establecido:', decodedToken.email);
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