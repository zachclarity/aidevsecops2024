import { AuthContext } from '../context/AuthContext';
import React, { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  const context = useContext(AuthContext);
  if (context === undefined) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};