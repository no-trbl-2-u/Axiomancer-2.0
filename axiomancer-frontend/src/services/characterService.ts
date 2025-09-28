import { GameState } from '../types/game';
import { SavedCharacterData } from '../utils/characterSave';

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('axiomancer_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const characterService = {
  async saveCharacter(gameState: GameState): Promise<void> {
    try {
      const saveData: SavedCharacterData = {
        character: gameState.character,
        currentLocation: gameState.currentLocation,
        currentNode: gameState.currentNode,
        story: gameState.story,
        inventory: gameState.inventory,
        locations: gameState.locations,
        questLog: gameState.questLog,
        mapEnergy: gameState.mapEnergy,
        maxMapEnergy: gameState.maxMapEnergy,
        gamePhase: gameState.gamePhase,
        savedAt: Date.now()
      };

      const response = await fetch(`${API_BASE_URL}/character/save`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save character: ${response.statusText}`);
      }

      console.log('Character saved to backend successfully');
    } catch (error) {
      console.error('Failed to save character to backend:', error);
      // Fallback to localStorage if backend fails
      const saveData: SavedCharacterData = {
        character: gameState.character,
        currentLocation: gameState.currentLocation,
        currentNode: gameState.currentNode,
        story: gameState.story,
        inventory: gameState.inventory,
        locations: gameState.locations,
        questLog: gameState.questLog,
        mapEnergy: gameState.mapEnergy,
        maxMapEnergy: gameState.maxMapEnergy,
        gamePhase: gameState.gamePhase,
        savedAt: Date.now()
      };
      localStorage.setItem('axiomancer_character', JSON.stringify(saveData));
      console.log('Character saved to localStorage as fallback');
    }
  },

  async loadCharacter(): Promise<SavedCharacterData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/character/load`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 404) {
        // No character found in backend, check localStorage
        const localData = localStorage.getItem('axiomancer_character');
        if (localData) {
          const parsedData = JSON.parse(localData) as SavedCharacterData;
          console.log('Character loaded from localStorage fallback');
          return parsedData;
        }
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to load character: ${response.statusText}`);
      }

      const characterData = await response.json();
      console.log('Character loaded from backend successfully');
      return characterData;
    } catch (error) {
      console.error('Failed to load character from backend:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('axiomancer_character');
      if (localData) {
        const parsedData = JSON.parse(localData) as SavedCharacterData;
        console.log('Character loaded from localStorage fallback');
        return parsedData;
      }
      return null;
    }
  },

  async hasExistingCharacter(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/character/exists`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to check character existence: ${response.statusText}`);
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Failed to check character existence:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('axiomancer_character');
      return !!localData;
    }
  },

  async deleteCharacter(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/character/delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete character: ${response.statusText}`);
      }

      console.log('Character deleted from backend successfully');
    } catch (error) {
      console.error('Failed to delete character from backend:', error);
    } finally {
      // Always clean up localStorage
      localStorage.removeItem('axiomancer_character');
      localStorage.removeItem('axiomancer_game_state');
      console.log('Character deleted from localStorage');
    }
  },
};