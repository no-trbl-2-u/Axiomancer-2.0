import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Character, GameLocation, Quest, CombatState, GameScreen } from '../types/game';

interface GameContextType {
  gameState: GameState;
  currentScreen: GameScreen;
  startNewGame: (characterName: string) => void;
  moveToLocation: (locationId: string) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  startCombat: (enemyId: string) => void;
  endCombat: () => void;
  changeScreen: (screen: GameScreen) => void;
  completeQuest: (questId: string) => void;
  addQuest: (quest: Quest) => void;
  makePhilosophicalChoice: (choiceId: string, outcome: any) => void;
}

type GameAction =
  | { type: 'START_NEW_GAME'; payload: { characterName: string } }
  | { type: 'MOVE_TO_LOCATION'; payload: { locationId: string } }
  | { type: 'UPDATE_CHARACTER'; payload: Partial<Character> }
  | { type: 'START_COMBAT'; payload: { enemyId: string } }
  | { type: 'END_COMBAT' }
  | { type: 'CHANGE_SCREEN'; payload: { screen: GameScreen } }
  | { type: 'COMPLETE_QUEST'; payload: { questId: string } }
  | { type: 'ADD_QUEST'; payload: { quest: Quest } }
  | { type: 'MAKE_PHILOSOPHICAL_CHOICE'; payload: { choiceId: string; outcome: any } };

const initialGameState: GameState = {
  character: {
    id: '',
    name: '',
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    stats: {
      strength: 10,
      constitution: 10,
      wisdom: 10,
      intelligence: 10,
      dexterity: 10,
      charisma: 10,
    },
    skills: [],
    equipment: [],
    inventory: [],
    philosophicalStance: {
      ethics: 'virtue',
      metaphysics: 'materialist',
      epistemology: 'empiricist',
    },
  },
  currentLocation: 'fishing_town',
  locations: getInitialLocations(),
  questLog: [],
  gamePhase: 'childhood',
  story: {
    visitedFriend: false,
    builtBoat: false,
    gatheredWood: false,
    gatheredIronOre: false,
    visitedMajorCity: false,
    heardAdvisorRumor: false,
    visitedIslands: [],
    returnedHome: false,
    decidedToBeAdvisor: false,
  },
  combat: null,
};

function getInitialLocations(): Record<string, GameLocation> {
  return {
    fishing_town: {
      id: 'fishing_town',
      name: 'Small Fishing Town',
      description: 'A peaceful town by the water where you grew up with your guardian.',
      type: 'town',
      connections: ['forest'],
      npcs: [
        {
          id: 'guardian',
          name: 'Your Guardian',
          description: 'The kind adult who raised you after your parents passed.',
          dialogue: [
            {
              id: 'guardian_intro',
              text: 'Be careful out there, young one. The world is full of difficult choices.',
              choices: [
                {
                  id: 'respect',
                  text: 'I will be careful and honor your teachings.',
                  philosophicalAlignment: { ethics: 'virtue' },
                  outcome: { type: 'stat_change', key: 'wisdom', value: 1 },
                },
                {
                  id: 'independent',
                  text: 'I need to make my own way and learn from experience.',
                  philosophicalAlignment: { epistemology: 'empiricist' },
                  outcome: { type: 'stat_change', key: 'dexterity', value: 1 },
                },
              ],
            },
          ],
        },
      ],
      resources: ['fish'],
      events: [],
    },
    forest: {
      id: 'forest',
      name: 'Whispering Forest',
      description: 'A dense forest full of ancient trees and the sounds of nature.',
      type: 'forest',
      connections: ['fishing_town', 'cave'],
      npcs: [],
      resources: ['wood'],
      events: [
        {
          id: 'philosophical_tree',
          name: 'The Philosophical Tree',
          description: 'An ancient oak that seems to whisper questions about existence.',
          type: 'philosophical_dilemma',
          triggered: false,
        },
      ],
    },
    cave: {
      id: 'cave',
      name: 'Iron Ore Cave',
      description: 'A deep cave rich with iron ore deposits.',
      type: 'cave',
      connections: ['forest'],
      npcs: [],
      resources: ['iron_ore'],
      events: [],
    },
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_NEW_GAME':
      return {
        ...initialGameState,
        character: {
          ...initialGameState.character,
          id: Date.now().toString(),
          name: action.payload.characterName,
        },
      };

    case 'MOVE_TO_LOCATION':
      return {
        ...state,
        currentLocation: action.payload.locationId,
      };

    case 'UPDATE_CHARACTER':
      return {
        ...state,
        character: {
          ...state.character,
          ...action.payload,
        },
      };

    case 'START_COMBAT':
      const { createPhilosophicalGoblin } = require('../utils/combatMechanics');
      const enemy = createPhilosophicalGoblin();
      return {
        ...state,
        combat: {
          active: true,
          turn: 'player',
          phase: 'choosing_aspect',
          round: 1,
          player: state.character,
          enemy,
          playerChoice: {},
          enemyChoice: {},
          roundResult: null,
          advantages: { player: 0, enemy: 0 },
          log: [
            { id: '1', timestamp: Date.now(), actor: 'System', action: 'start', target: 'combat' },
            { id: '2', timestamp: Date.now(), actor: enemy.name, action: 'appears', target: 'battlefield' }
          ]
        }
      };

    case 'END_COMBAT':
      return {
        ...state,
        combat: null,
      };

    case 'COMPLETE_QUEST':
      return {
        ...state,
        questLog: state.questLog.map(quest =>
          quest.id === action.payload.questId
            ? { ...quest, completed: true }
            : quest
        ),
      };

    case 'ADD_QUEST':
      return {
        ...state,
        questLog: [...state.questLog, action.payload.quest],
      };

    case 'MAKE_PHILOSOPHICAL_CHOICE':
      // TODO: Implement philosophical choice handling
      return state;

    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [currentScreen, setCurrentScreen] = React.useState<GameScreen>('exploration');

  const startNewGame = (characterName: string) => {
    dispatch({ type: 'START_NEW_GAME', payload: { characterName } });
    setCurrentScreen('exploration');
  };

  const moveToLocation = (locationId: string) => {
    dispatch({ type: 'MOVE_TO_LOCATION', payload: { locationId } });
  };

  const updateCharacter = (updates: Partial<Character>) => {
    dispatch({ type: 'UPDATE_CHARACTER', payload: updates });
  };

  const startCombat = (enemyId: string) => {
    dispatch({ type: 'START_COMBAT', payload: { enemyId } });
    setCurrentScreen('combat');
  };

  const endCombat = () => {
    dispatch({ type: 'END_COMBAT' });
    setCurrentScreen('exploration');
  };

  const changeScreen = (screen: GameScreen) => {
    setCurrentScreen(screen);
  };

  const completeQuest = (questId: string) => {
    dispatch({ type: 'COMPLETE_QUEST', payload: { questId } });
  };

  const addQuest = (quest: Quest) => {
    dispatch({ type: 'ADD_QUEST', payload: { quest } });
  };

  const makePhilosophicalChoice = (choiceId: string, outcome: any) => {
    dispatch({ type: 'MAKE_PHILOSOPHICAL_CHOICE', payload: { choiceId, outcome } });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentScreen,
        startNewGame,
        moveToLocation,
        updateCharacter,
        startCombat,
        endCombat,
        changeScreen,
        completeQuest,
        addQuest,
        makePhilosophicalChoice,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}