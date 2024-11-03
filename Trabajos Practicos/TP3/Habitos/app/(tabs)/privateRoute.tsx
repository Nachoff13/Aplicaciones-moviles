import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginScreen from './login';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const { isAuthenticated} = useAuth();

  return isAuthenticated ? <Component /> : <LoginScreen />;
};

export default PrivateRoute;