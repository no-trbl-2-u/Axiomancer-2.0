import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useGame } from '../contexts/GameContext';
import { ExplorationScreen } from '../components/game/ExplorationScreen';
import { CombatScreen } from '../components/game/CombatScreen';
import { CharacterScreen } from '../components/game/CharacterScreen';
import { InventoryScreen } from '../components/game/InventoryScreen';
import { MapScreen } from '../components/game/MapScreen';
import { DialogueScreen } from '../components/game/DialogueScreen';
import { SkillScreen } from '../components/game/SkillScreen';
import { GameUI } from '../components/game/GameUI';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  position: relative;
  overflow: hidden;
`;

const ScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const GamePage = React.memo(() => {
  const { currentScreen, gameState } = useGame();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'exploration':
        return <ExplorationScreen />;
      case 'combat':
        return <CombatScreen />;
      case 'character':
        return <CharacterScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'skills':
        return <SkillScreen />;
      case 'map':
        return <MapScreen />;
      case 'dialogue':
        return <DialogueScreen />;
      default:
        return <ExplorationScreen />;
    }
  };

  return (
    <GameContainer>
      <ScreenContainer>
        {renderCurrentScreen()}
      </ScreenContainer>
      <GameUI />
    </GameContainer>
  );
});