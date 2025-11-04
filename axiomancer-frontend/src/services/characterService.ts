import { GameState } from '../types/game';
import { SavedCharacterData } from '../utils/characterSave';

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthToken = (): string | null => {
  // Get token from Zustand persist storage
  const storeData = localStorage.getItem('axiomancer-auth-store');
  if (storeData) {
    try {
      const parsed = JSON.parse(storeData);
      return parsed.state?.token || null;
    } catch (e) {
      return null;
    }
  }
  return null;
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
    const saveData: SavedCharacterData = {
      character: gameState.character,
      currentLocation: gameState.currentLocation,
      currentNode: gameState.currentNode || '',
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
      const errorText = await response.text();
      throw new Error(`Failed to save character: ${response.statusText} - ${errorText}`);
    }

    console.log('✅ Character saved to backend successfully');
  },

  async loadCharacter(): Promise<SavedCharacterData | null> {
    const response = await fetch(`${API_BASE_URL}/character/load`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      // No character found in backend
      console.log('No character found in backend');
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load character: ${response.statusText} - ${errorText}`);
    }

    const characterData = await response.json();
    console.log('✅ Character loaded from backend successfully');
    return characterData;
  },

  async hasExistingCharacter(): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/character/exists`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to check character existence: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Character exists check: ${data.exists}`);
    return data.exists;
  },

  async deleteCharacter(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/character/delete`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete character: ${response.statusText} - ${errorText}`);
    }

    console.log('✅ Character deleted from backend successfully');
  },
};