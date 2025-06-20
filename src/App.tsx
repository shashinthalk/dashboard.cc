import React, { useState } from 'react';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LoginForm } from './features/auth/components/LoginForm';
import { DashboardLayout } from './layouts/DashboardLayout';
import './App.css';
import { ThemeProvider } from 'styled-components';
import { terminalThemes } from './styles/themes/terminalThemes';
import Terminal from './core/windows/Terminal';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <DashboardLayout />;
};

function App() {
  // Change the theme here: 'classic' or 'ocean'
  const [terminalTheme] = useState<'classic' | 'ocean'>('ocean');

  return (
    <ThemeProvider theme={terminalThemes[terminalTheme]}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <Terminal />
    </ThemeProvider>
  );
}

export default App;
