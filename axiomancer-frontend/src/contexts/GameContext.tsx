import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { GameState, Character, GameLocation, Quest, CombatState, GameScreen, CharacterPortrait, Equipment, EquipmentSlot, Skill } from '../types/game';
import { useGameStore } from '../stores/gameStore';

/**
 * DEPRECATED: This context is now a wrapper around the Zustand store
 * Use useGameStore() directly in new code
 */

interface CreateCharacterData {
  name: string;
  gender: 'male' | 'female';
  portrait: CharacterPortrait;
  baseStats?: import('../types/game').BaseStats;
}

interface GameContextType {
  gameState: GameState;
  currentScreen: GameScreen;
  startNewGame: (characterName: string) => void;
  createCharacter: (characterData: CreateCharacterData) => void;
  loadSavedCharacter: () => Promise<boolean>;
  moveToLocation: (locationId: string) => void;
  moveToNode: (nodeId: string) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  updateInventory: (updates: Partial<GameState['inventory']>) => void;
  updateStory: (updates: Partial<GameState['story']>) => void;
  startCombat: (enemyId: string) => void;
  endCombat: () => void;
  changeScreen: (screen: GameScreen) => void;
  completeQuest: (questId: string) => void;
  addQuest: (quest: Quest) => void;
  makePhilosophicalChoice: (choiceId: string, outcome: any) => void;
  unlockNode: (locationId: string, nodeId: string) => void;
  unlockGuardianProgression: () => void;
  equipItem: (slot: import('../types/game').EquipmentSlot, item: import('../types/game').Equipment) => void;
  unequipItem: (slot: import('../types/game').EquipmentSlot) => void;
  learnSkill: (skill: import('../types/game').Skill) => void;
  canLearnSkill: (skill: import('../types/game').Skill) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * GameProvider now uses Zustand store internally
 * This maintains backward compatibility while migrating to Zustand
 */
export function GameProvider({ children }: { children: ReactNode }) {
  // Get all state and actions from Zustand store
  const store = useGameStore();

  // Auto-save when character changes (using Zustand store's auto-save)
  useEffect(() => {
    if (store.gameState.character && store.gameState.character.name && store.gameState.character.id !== 'placeholder') {
      const saveTimer = setTimeout(async () => {
        try {
          await store.saveGame();
        } catch (error) {
          console.error('Failed to auto-save character:', error);
        }
      }, 500);

      return () => clearTimeout(saveTimer);
    }
    return undefined;
  }, [store.gameState.character, store.gameState.currentLocation]);

  // Context value that wraps the Zustand store
  const value: GameContextType = {
    gameState: store.gameState,
    currentScreen: store.currentScreen,
    startNewGame: store.startNewGame,
    createCharacter: store.createCharacter,
    loadSavedCharacter: store.loadSavedCharacter,
    moveToLocation: store.moveToLocation,
    moveToNode: store.moveToNode,
    updateCharacter: store.updateCharacter,
    updateInventory: store.updateInventory,
    updateStory: store.updateStory,
    startCombat: store.startCombat,
    endCombat: store.endCombat,
    changeScreen: store.changeScreen,
    completeQuest: store.completeQuest,
    addQuest: store.addQuest,
    makePhilosophicalChoice: store.makePhilosophicalChoice,
    unlockNode: store.unlockNode,
    unlockGuardianProgression: store.unlockGuardianProgression,
    equipItem: store.equipItem,
    unequipItem: store.unequipItem,
    learnSkill: store.learnSkill,
    canLearnSkill: store.canLearnSkill,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook to use the game context
 * @deprecated Use useGameStore() directly for better performance
 */
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
