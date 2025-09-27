import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider, useGame } from './contexts/GameContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CharacterCreationPage } from './pages/CharacterCreationPage';
import { GamePage } from './pages/GamePage';

const GameContent = React.memo(() => {
  const { gameState } = useGame();

  // If character doesn't have a name, show character creation
  if (!gameState.character.name) {
    return <CharacterCreationPage />;
  }

  // Show the main game
  return <GamePage />;
});

const AppContent = React.memo(() => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (showLanding) {
    return <LandingPage onClickToStart={() => setShowLanding(false)} />;
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
    <GameProvider>
      <Layout>
        <GameContent />
      </Layout>
    </GameProvider>
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