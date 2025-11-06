import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { CharacterCreationScreen } from '../components/game/CharacterCreationScreen';
import { MainGameInterface } from '../components/game/MainGameInterface';

export const GamePage = React.memo(() => {
  // Zustand store - selective subscriptions
  const character = useGameStore(state => state.gameState.character);

  // If no character name, show character creation
  if (!character.name) {
    return <CharacterCreationScreen />;
  }

  // Show the main game interface
  return <MainGameInterface />;
});

GamePage.displayName = 'GamePage';