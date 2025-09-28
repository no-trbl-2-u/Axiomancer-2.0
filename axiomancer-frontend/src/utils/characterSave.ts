import { GameState } from '../types/game';
import { characterService } from '../services/characterService';

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

    return data;
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