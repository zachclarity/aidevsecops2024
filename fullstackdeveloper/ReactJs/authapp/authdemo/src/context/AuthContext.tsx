
import { User } from '@/types/auth';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export const AuthContext = createContext<User | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export  const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user'); }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined> (undefined);

  const login = (username: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    const myuser: User =  {
      username,
      logout: () => {
        setUser(undefined);
        return {};
      },
      isAuthenticated: false,
      login: function (username: string): {} {
        throw new Error('Function not implemented.');
      }
    }
    setUser(myuser)
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={ user }>
      {children}
    </AuthContext.Provider>
  );
};

function setIsAuthenticated(arg0: boolean) {
  throw new Error('Function not implemented.');
}
