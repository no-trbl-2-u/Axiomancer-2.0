import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useGameStore } from '../stores/gameStore';
import { CharacterCreationScreen } from '../components/character/CharacterCreationScreen';
import { MainGameInterface } from '../components/game/MainGameInterface';

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
  // Zustand store - selective subscriptions
  const currentScreen = useGameStore(state => state.currentScreen);
  const character = useGameStore(state => state.gameState.character);

  // If no character name, show character creation
  if (!character.name) {
    return <CharacterCreationScreen />;
  }

  // Show the main game interface
  return <MainGameInterface />;
});