import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { GlobalStyles } from './styles/GlobalStyles';
import { TooltipProvider } from './components/shared/Tooltip';
import { Layout } from './components/game/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CharacterCreationScreen } from './components/game/CharacterCreationScreen';
import { CharacterSelectionPage } from './pages/CharacterSelectionPage';
import { GamePage } from './pages/GamePage';
import { hasExistingCharacter } from './utils/characterSave';
import './components/figma/global.css';

// Protected route component that requires authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      {children}
    </Layout>
  );
};

// Route that redirects to character selection or creation based on saved data
const CharacterRoute: React.FC = (): JSX.Element => {
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCharacter = async () => {
      const result = await hasExistingCharacter();
      setHasCharacter(result);
    };
    checkCharacter();
  }, []);

  if (hasCharacter === null) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (hasCharacter) {
    return <Navigate to="/character-selection" replace />;
  } else {
    return <Navigate to="/character-creation" replace />;
  }
};

const AppContent = React.memo((): JSX.Element => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Note: Auth is automatically initialized by Zustand persist middleware
  // No need for manual initAuth() call

  if (showLanding) {
    return <LandingPage onClickToStart={() => setShowLanding(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <CharacterRoute /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Layout><LoginPage /></Layout>} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Layout><RegisterPage /></Layout>} />
      <Route 
        path="/character-selection" 
        element={
          <ProtectedRoute>
            <CharacterSelectionPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/character-creation" 
        element={
          <ProtectedRoute>
            <CharacterCreationScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/game" 
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
});

function App(): JSX.Element {
  return (
    <Router>
      <GlobalStyles />
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </Router>
  );
}

export default App;