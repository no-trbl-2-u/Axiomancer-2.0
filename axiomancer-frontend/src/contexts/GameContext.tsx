import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Character, GameLocation, Quest, CombatState, GameScreen } from '../types/game';
import { initialQuests } from '../utils/questSystem';
import { createEnemyByType } from '../utils/combatMechanics';

interface GameContextType {
  gameState: GameState;
  currentScreen: GameScreen;
  startNewGame: (characterName: string) => void;
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
}

type GameAction =
  | { type: 'START_NEW_GAME'; payload: { characterName: string } }
  | { type: 'MOVE_TO_LOCATION'; payload: { locationId: string } }
  | { type: 'MOVE_TO_NODE'; payload: { nodeId: string } }
  | { type: 'UPDATE_CHARACTER'; payload: Partial<Character> }
  | { type: 'UPDATE_INVENTORY'; payload: Partial<GameState['inventory']> }
  | { type: 'UPDATE_STORY'; payload: Partial<GameState['story']> }
  | { type: 'START_COMBAT'; payload: { enemyId: string } }
  | { type: 'END_COMBAT' }
  | { type: 'CHANGE_SCREEN'; payload: { screen: GameScreen } }
  | { type: 'COMPLETE_QUEST'; payload: { questId: string } }
  | { type: 'ADD_QUEST'; payload: { quest: Quest } }
  | { type: 'MAKE_PHILOSOPHICAL_CHOICE'; payload: { choiceId: string; outcome: any } }
  | { type: 'UNLOCK_NODE'; payload: { locationId: string; nodeId: string } };

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
  currentNode: 'home',
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
    talkedToGuardian: false,
    startedFishing: false,
    hasCart: true,
    hasHorse: true,
    hasFish: 0,
  },
  combat: null,
  inventory: {
    gold: 50,
    wood: 0,
    ironOre: 0,
    fish: 0,
    items: [],
  },
};

function getInitialLocations(): Record<string, GameLocation> {
  return {
    fishing_town: {
      id: 'fishing_town',
      name: 'Small Fishing Town',
      description: 'A peaceful town by the water where you grew up with your guardian. This is where your philosophical journey begins.',
      type: 'town',
      connections: [],
      mapImage: '/maps/map01.jpeg',
      coordinates: { x: 1, y: 2 },
      isNodeMap: true,
      nodes: [
        {
          id: 'home',
          name: 'Your Home',
          description: 'The cozy house where you live with your guardian.',
          type: 'start',
          position: { x: 50, y: 80 },
          connections: ['guardian', 'docks'],
          unlocked: true,
          visited: true,
          icon: '🏠'
        },
        {
          id: 'guardian',
          name: 'Talk to Guardian',
          description: 'Your guardian has wisdom to share before you begin your journey.',
          type: 'person',
          position: { x: 30, y: 60 },
          connections: ['docks'],
          unlocked: true,
          visited: false,
          event: {
            id: 'guardian_talk',
            type: 'dialogue',
            description: 'Your guardian speaks about your upcoming adventure.',
            npcId: 'guardian'
          },
          icon: '👨‍🏫'
        },
        {
          id: 'docks',
          name: 'Town Docks',
          description: 'The wooden docks where fishing boats come and go.',
          type: 'resource',
          position: { x: 70, y: 40 },
          connections: ['fishing_spot'],
          unlocked: false,
          visited: false,
          event: {
            id: 'prepare_fishing',
            type: 'fishing',
            description: 'Prepare your fishing gear and learn the basics.',
            requirements: [{ type: 'stat', key: 'talkedToGuardian', value: true }]
          },
          icon: '⚓'
        },
        {
          id: 'fishing_spot',
          name: 'Fishing Waters',
          description: 'Rich fishing waters where you can catch fish for your journey.',
          type: 'resource',
          position: { x: 90, y: 20 },
          connections: ['boat_builder'],
          unlocked: false,
          visited: false,
          event: {
            id: 'fish_gathering',
            type: 'gather',
            description: 'Cast your line and gather fish for the journey ahead.',
            resource: 'fish',
            requirements: [{ type: 'stat', key: 'startedFishing', value: 1 }]
          },
          icon: '🎣'
        },
        {
          id: 'boat_builder',
          name: 'Boat Workshop',
          description: 'Where you can build a boat to explore beyond the town.',
          type: 'building',
          position: { x: 50, y: 20 },
          connections: ['forest_path'],
          unlocked: false,
          visited: false,
          event: {
            id: 'boat_building',
            type: 'building',
            description: 'Build a boat to access new areas.',
            requirements: [{ type: 'item', key: 'fish', value: 5 }, { type: 'item', key: 'wood', value: 10 }]
          },
          icon: '🚤'
        },
        {
          id: 'forest_path',
          name: 'Path to Forest',
          description: 'The beginning of your journey into the wider world.',
          type: 'exit',
          position: { x: 20, y: 20 },
          connections: [],
          unlocked: false,
          visited: false,
          event: {
            id: 'leave_town',
            type: 'choice',
            description: 'Leave the safety of your hometown and venture into the forest.',
            requirements: [{ type: 'stat', key: 'builtBoat', value: 1 }]
          },
          icon: '🌲'
        }
      ],
      npcs: [
        {
          id: 'guardian',
          name: 'Your Guardian',
          description: 'The kind adult who raised you after your parents passed.',
          dialogue: [
            {
              id: 'guardian_intro',
              text: 'Young one, I see the curiosity in your eyes. You wish to explore beyond our small town, don\'t you? Remember, every choice you make shapes who you become.',
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
      description: 'A dense forest full of ancient trees and philosophical creatures. Each step forward reveals new challenges and wisdom.',
      type: 'forest',
      connections: ['fishing_town'],
      mapImage: '/maps/map02.jpg',
      coordinates: { x: 1, y: 1 },
      isNodeMap: true,
      nodes: [
        {
          id: 'forest_entrance',
          name: 'Forest Entrance',
          description: 'The threshold between your hometown and the wider world.',
          type: 'start',
          position: { x: 10, y: 90 },
          connections: ['woodland_path'],
          unlocked: true,
          visited: false,
          icon: '🌳'
        },
        {
          id: 'woodland_path',
          name: 'Woodland Path',
          description: 'A winding path through dense trees.',
          type: 'event',
          position: { x: 30, y: 70 },
          connections: ['clearing'],
          unlocked: false,
          visited: false,
          event: {
            id: 'path_choice',
            type: 'choice',
            description: 'You encounter a fork in the path. How do you choose which way to go?',
            choices: [
              {
                id: 'intuition',
                text: 'Trust your intuition and follow your heart.',
                outcome: { type: 'stat_change', key: 'wisdom', value: 1 },
                philosophicalAlignment: { epistemology: 'mystical' }
              },
              {
                id: 'logical',
                text: 'Analyze the paths logically and choose the safest route.',
                outcome: { type: 'stat_change', key: 'intelligence', value: 1 },
                philosophicalAlignment: { epistemology: 'rationalist' }
              }
            ]
          },
          icon: '🛤️'
        },
        {
          id: 'clearing',
          name: 'Forest Clearing',
          description: 'A peaceful clearing where sunlight filters through the canopy.',
          type: 'resource',
          position: { x: 50, y: 50 },
          connections: ['ancient_tree', 'creature_den'],
          unlocked: false,
          visited: false,
          event: {
            id: 'wood_gathering',
            type: 'gather',
            description: 'Gather fallen branches and wood for building.',
            resource: 'wood'
          },
          icon: '🪵'
        },
        {
          id: 'ancient_tree',
          name: 'The Philosophical Tree',
          description: 'An ancient oak that seems to whisper questions about existence.',
          type: 'encounter',
          position: { x: 30, y: 30 },
          connections: ['deep_forest'],
          unlocked: false,
          visited: false,
          event: {
            id: 'tree_meditation',
            type: 'choice',
            description: 'The ancient tree poses a question: What is the nature of growth?',
            choices: [
              {
                id: 'physical',
                text: 'Growth is physical expansion and accumulation.',
                outcome: { type: 'stat_change', key: 'strength', value: 1 },
                philosophicalAlignment: { metaphysics: 'materialist' }
              },
              {
                id: 'spiritual',
                text: 'Growth is spiritual development and understanding.',
                outcome: { type: 'stat_change', key: 'wisdom', value: 2 },
                philosophicalAlignment: { metaphysics: 'idealist' }
              }
            ]
          },
          icon: '🌳'
        },
        {
          id: 'creature_den',
          name: 'Logical Fallacy Den',
          description: 'A dark corner of the forest where twisted logic takes physical form.',
          type: 'encounter',
          position: { x: 70, y: 30 },
          connections: ['deep_forest'],
          unlocked: false,
          visited: false,
          event: {
            id: 'fallacy_encounter',
            type: 'combat',
            description: 'A dangerous logical fallacy manifests as a creature.',
            enemyId: 'abortive_fallacy'
          },
          icon: '👹'
        },
        {
          id: 'deep_forest',
          name: 'Deep Forest',
          description: 'The heart of the forest where greater challenges await.',
          type: 'boss',
          position: { x: 50, y: 10 },
          connections: ['cave_entrance'],
          unlocked: false,
          visited: false,
          event: {
            id: 'forest_guardian',
            type: 'combat',
            description: 'The guardian of the forest tests your philosophical resolve.',
            enemyId: 'philosophical_goblin'
          },
          icon: '🦉'
        },
        {
          id: 'cave_entrance',
          name: 'Cave Entrance',
          description: 'The entrance to mysterious crystal caverns.',
          type: 'exit',
          position: { x: 90, y: 10 },
          connections: [],
          unlocked: false,
          visited: false,
          event: {
            id: 'enter_cave',
            type: 'choice',
            description: 'Enter the mysterious cave system.',
            requirements: [{ type: 'item', key: 'wood', value: 5 }]
          },
          icon: '🕳️'
        }
      ],
      npcs: [],
      resources: ['wood'],
      events: [],
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
        currentNode: state.locations[action.payload.locationId]?.isNodeMap ? 
          state.locations[action.payload.locationId].nodes?.find(n => n.type === 'start')?.id : undefined,
      };

    case 'MOVE_TO_NODE':
      return {
        ...state,
        currentNode: action.payload.nodeId,
        locations: {
          ...state.locations,
          [state.currentLocation]: {
            ...state.locations[state.currentLocation],
            nodes: state.locations[state.currentLocation].nodes?.map(node => 
              node.id === action.payload.nodeId 
                ? { ...node, visited: true }
                : node
            )
          }
        }
      };

    case 'UPDATE_CHARACTER':
      return {
        ...state,
        character: {
          ...state.character,
          ...action.payload,
        },
      };

    case 'UPDATE_INVENTORY':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          ...action.payload,
        },
      };

    case 'UPDATE_STORY':
      return {
        ...state,
        story: {
          ...state.story,
          ...action.payload,
        },
      };

    case 'UNLOCK_NODE':
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.payload.locationId]: {
            ...state.locations[action.payload.locationId],
            nodes: state.locations[action.payload.locationId].nodes?.map(node => 
              node.id === action.payload.nodeId 
                ? { ...node, unlocked: true }
                : node
            )
          }
        }
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

  const moveToNode = (nodeId: string) => {
    dispatch({ type: 'MOVE_TO_NODE', payload: { nodeId } });
  };

  const updateCharacter = (updates: Partial<Character>) => {
    dispatch({ type: 'UPDATE_CHARACTER', payload: updates });
  };

  const updateInventory = (updates: Partial<GameState['inventory']>) => {
    dispatch({ type: 'UPDATE_INVENTORY', payload: updates });
  };

  const updateStory = (updates: Partial<GameState['story']>) => {
    dispatch({ type: 'UPDATE_STORY', payload: updates });
  };

  const unlockNode = (locationId: string, nodeId: string) => {
    dispatch({ type: 'UNLOCK_NODE', payload: { locationId, nodeId } });
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
        moveToNode,
        updateCharacter,
        updateInventory,
        updateStory,
        startCombat,
        endCombat,
        changeScreen,
        completeQuest,
        addQuest,
        makePhilosophicalChoice,
        unlockNode,
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