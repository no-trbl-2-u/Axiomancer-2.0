import { GameState, Character } from '../types/game';
import { characterService } from '../services/characterService';
import { createInitialBaseStats, calculateDerivedStats, calculateMaxHP, calculateMaxMP } from './statCalculations';

const CHARACTER_SAVE_KEY = 'axiomancer_character';
const GAME_STATE_SAVE_KEY = 'axiomancer_game_state';

export interface SavedCharacterData {
  character: GameState['character'];
  currentLocation: string;
  currentNode: string;
  story: GameState['story'];
  inventory: GameState['inventory'];
  locations: GameState['locations'];
  questLog: GameState['questLog'];
  mapEnergy: number;
  maxMapEnergy: number;
  gamePhase: string;
  savedAt: number;
}

/**
 * Migrate old character data to new Heart/Body/Mind system
 */
function migrateCharacterData(character: any): Character {
  // If character already has new stat structure, return as is
  if (character.baseStats && character.derivedStats) {
    return character as Character;
  }

  // If character has old stats, migrate them
  const oldStats = character.stats || {};

  // Create new baseStats from old stats, using reasonable defaults
  const baseStats = {
    heart: oldStats.charisma || oldStats.heart || 1,
    body: Math.max(
      oldStats.strength || 0,
      oldStats.constitution || 0,
      oldStats.dexterity || 0,
      oldStats.body || 1
    ),
    mind: Math.max(
      oldStats.intelligence || 0,
      oldStats.wisdom || 0,
      oldStats.mind || 1
    )
  };

  // Calculate derived stats
  const derivedStats = calculateDerivedStats(baseStats);

  // Update health and mana if needed
  const maxHP = calculateMaxHP(baseStats);
  const maxMP = calculateMaxMP(baseStats);

  return {
    ...character,
    baseStats,
    derivedStats,
    maxHealth: character.maxHealth || maxHP,
    maxMana: character.maxMana || maxMP,
    health: Math.min(character.health || maxHP, maxHP),
    mana: Math.min(character.mana || maxMP, maxMP),
    availableStatPoints: character.availableStatPoints || 0
  };
}

export const saveCharacter = async (gameState: GameState): Promise<void> => {
  try {
    await characterService.saveCharacter(gameState);
    console.log('Character saved successfully');
  } catch (error) {
    console.error('Failed to save character:', error);
  }
};

export const loadCharacter = async (): Promise<SavedCharacterData | null> => {
  try {
    const data = await characterService.loadCharacter();

    // Validate that we have essential character data
    if (!data || !data.character || !data.character.name) {
      return null;
    }

    // Migrate character data to new stat system if needed
    const migratedCharacter = migrateCharacterData(data.character);

    return {
      ...data,
      character: migratedCharacter
    };
  } catch (error) {
    console.error('Failed to load character:', error);
    return null;
  }
};

export const deleteCharacter = async (): Promise<void> => {
  try {
    await characterService.deleteCharacter();
    console.log('Character deleted successfully');
  } catch (error) {
    console.error('Failed to delete character:', error);
  }
};

export const hasExistingCharacter = async (): Promise<boolean> => {
  try {
    return await characterService.hasExistingCharacter();
  } catch (error) {
    console.error('Failed to check character existence:', error);
    return false;
  }
};