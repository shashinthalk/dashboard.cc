import React from 'react';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LoginForm } from './features/auth/components/LoginForm';
import { DashboardLayout } from './layouts/DashboardLayout';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <DashboardLayout />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
