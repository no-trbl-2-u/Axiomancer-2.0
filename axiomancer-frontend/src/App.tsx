import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

const AppContent = React.memo(() => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState<boolean>(false);

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        {showRegister ? (
          <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginPage onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardPage />
    </Layout>
  );
});

function App(): JSX.Element {
  return (
    <AuthProvider>
      <GlobalStyles />
      <AppContent />
    </AuthProvider>
  );
}

export default App;