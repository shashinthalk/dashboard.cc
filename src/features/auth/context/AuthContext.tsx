import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 