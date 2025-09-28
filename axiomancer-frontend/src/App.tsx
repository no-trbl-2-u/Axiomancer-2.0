import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider, useGame } from './contexts/GameContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CharacterCreationScreen } from './components/character/CharacterCreationScreen';
import { CharacterSelectionPage } from './pages/CharacterSelectionPage';
import { GamePage } from './pages/GamePage';
import { hasExistingCharacter } from './utils/characterSave';

// Protected route component that requires authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

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
    <GameProvider>
      <Layout>
        {children}
      </Layout>
    </GameProvider>
  );
};

// Route that redirects to character selection or creation based on saved data
const CharacterRoute: React.FC = () => {
  const hasCharacter = hasExistingCharacter();
  
  if (hasCharacter) {
    return <Navigate to="/character-selection" replace />;
  } else {
    return <Navigate to="/character-creation" replace />;
  }
};

const AppContent = React.memo(() => {
  const { isAuthenticated } = useAuth();
  const [showLanding, setShowLanding] = useState<boolean>(true);

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
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;