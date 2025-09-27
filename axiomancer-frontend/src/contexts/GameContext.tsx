import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Character, GameLocation, Quest, CombatState, GameScreen } from '../types/game';
import { initialQuests } from '../utils/questSystem';
import { createEnemyByType } from '../utils/combatMechanics';

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
    skills: [
      {
        id: 'basic_reasoning',
        name: 'Basic Reasoning',
        description: 'Fundamental logical thinking skills.',
        level: 1,
        manaCost: 5,
        damage: 10,
        icon: '🤔',
        type: 'logic',
        philosophicalAspect: 'mind',
      }
    ],
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
  questLog: initialQuests,
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
      connections: ['forest', 'coastal_cliffs'],
      mapImage: '/maps/map01.jpeg',
      coordinates: { x: 1, y: 2 },
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
      events: [
        {
          id: 'trolley_dilemma',
          name: 'The Trolley Problem',
          description: 'A philosophical dilemma about moral responsibility presents itself.',
          type: 'philosophical_dilemma',
          triggered: false,
        },
      ],
    },
    forest: {
      id: 'forest',
      name: 'Whispering Forest',
      description: 'A dense forest full of ancient trees and the sounds of nature.',
      type: 'forest',
      connections: ['fishing_town', 'cave', 'ancient_ruins'],
      mapImage: '/maps/map02.jpg',
      coordinates: { x: 1, y: 1 },
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
        {
          id: 'fallacy_encounter',
          name: 'Encounter with Abortive Fallacy',
          description: 'A dangerous logical fallacy manifests as a creature in the woods.',
          type: 'combat',
          triggered: false,
        },
        {
          id: 'strawman_ambush',
          name: 'Strawman Ambush',
          description: 'Twisted arguments take physical form and attack unsuspecting travelers.',
          type: 'combat',
          triggered: false,
        },
      ],
    },
    cave: {
      id: 'cave',
      name: 'Crystal Caverns',
      description: 'Deep caverns filled with glowing crystals that reflect philosophical truths.',
      type: 'cave',
      connections: ['forest', 'underground_lake'],
      mapImage: '/maps/map03.jpg',
      coordinates: { x: 2, y: 0 },
      npcs: [],
      resources: ['crystal_wisdom', 'iron_ore'],
      events: [
        {
          id: 'crystal_meditation',
          name: 'Crystal Meditation Chamber',
          description: 'Ancient crystals that enhance philosophical understanding.',
          type: 'philosophical_dilemma',
          triggered: false,
        },
        {
          id: 'circular_reasoning_demon',
          name: 'Demon of Circular Logic',
          description: 'A demon trapped in the crystal caves, endlessly reasoning in circles.',
          type: 'combat',
          triggered: false,
        },
      ],
    },
    ancient_ruins: {
      id: 'ancient_ruins',
      name: 'Ancient Philosophical Ruins',
      description: 'Ruins of an ancient academy where philosophers once debated the nature of reality.',
      type: 'city',
      connections: ['forest', 'mountaintop_temple'],
      mapImage: '/maps/map04.jpg',
      coordinates: { x: 0, y: 1 },
      npcs: [
        {
          id: 'ancient_sage',
          name: 'Spirit of an Ancient Sage',
          description: 'The ghostly presence of a long-dead philosopher.',
          dialogue: [
            {
              id: 'sage_wisdom',
              text: 'Truth is not found in certainty, but in the courage to question.',
              choices: [
                {
                  id: 'accept_uncertainty',
                  text: 'I embrace the uncertainty of knowledge.',
                  philosophicalAlignment: { epistemology: 'skeptical' },
                  outcome: { type: 'stat_change', key: 'wisdom', value: 2 },
                },
                {
                  id: 'seek_certainty',
                  text: 'There must be certain truths we can discover.',
                  philosophicalAlignment: { epistemology: 'rationalist' },
                  outcome: { type: 'stat_change', key: 'intelligence', value: 2 },
                },
              ],
            },
          ],
        },
      ],
      resources: ['ancient_scrolls'],
      events: [
        {
          id: 'philosophical_trial',
          name: 'Trial of the Sophists',
          description: 'Ancient mechanisms test your philosophical prowess.',
          type: 'combat',
          triggered: false,
        },
        {
          id: 'confirmation_bias_beast',
          name: 'Confirmation Bias Beast',
          description: 'A creature that only sees what it wants to see lurks in the ruins.',
          type: 'combat',
          triggered: false,
        },
      ],
    },
    mountaintop_temple: {
      id: 'mountaintop_temple',
      name: 'Temple of Contemplation',
      description: 'A serene temple atop a mountain, dedicated to deep philosophical thought.',
      type: 'city',
      connections: ['ancient_ruins'],
      mapImage: '/maps/map05.png',
      coordinates: { x: 0, y: 0 },
      npcs: [
        {
          id: 'meditation_master',
          name: 'Master of Contemplation',
          description: 'A wise teacher who has spent decades in philosophical meditation.',
          dialogue: [
            {
              id: 'meditation_teaching',
              text: 'The mind that grasps for truth often pushes it away. What is your approach to understanding?',
              choices: [
                {
                  id: 'mystical_path',
                  text: 'Through intuition and spiritual insight.',
                  philosophicalAlignment: { epistemology: 'mystical' },
                  outcome: { type: 'stat_change', key: 'wisdom', value: 3 },
                },
                {
                  id: 'rational_path',
                  text: 'Through careful reasoning and logic.',
                  philosophicalAlignment: { epistemology: 'rationalist' },
                  outcome: { type: 'stat_change', key: 'intelligence', value: 3 },
                },
              ],
            },
          ],
        },
      ],
      resources: ['meditation_herbs'],
      events: [
        {
          id: 'wisdom_guardian_trial',
          name: 'Trial of the Wisdom Guardian',
          description: 'The temple\'s ancient guardian tests those who seek ultimate wisdom.',
          type: 'combat',
          triggered: false,
        },
      ],
    },
    coastal_cliffs: {
      id: 'coastal_cliffs',
      name: 'Windswept Coastal Cliffs',
      description: 'Dramatic cliffs overlooking the endless ocean, where the wind carries philosophical whispers.',
      type: 'island',
      connections: ['fishing_town', 'underground_lake'],
      mapImage: '/maps/map02.jpg',
      coordinates: { x: 2, y: 2 },
      npcs: [],
      resources: ['sea_salt', 'philosophical_pearls'],
      events: [
        {
          id: 'wind_wisdom',
          name: 'Whispers in the Wind',
          description: 'The coastal winds seem to carry ancient philosophical insights.',
          type: 'philosophical_dilemma',
          triggered: false,
        },
      ],
    },
    underground_lake: {
      id: 'underground_lake',
      name: 'Underground Lake of Reflection',
      description: 'A mystical underground lake where the water reflects not just images, but truths.',
      type: 'river',
      connections: ['cave', 'coastal_cliffs'],
      mapImage: '/maps/map03.jpg',
      coordinates: { x: 2, y: 1 },
      npcs: [],
      resources: ['reflection_water'],
      events: [
        {
          id: 'lake_reflection',
          name: 'Gaze into the Reflecting Waters',
          description: 'The lake shows you truths about yourself and the nature of reality.',
          type: 'philosophical_dilemma',
          triggered: false,
        },
      ],
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

      const enemy = createEnemyByType(action.payload.enemyId);
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