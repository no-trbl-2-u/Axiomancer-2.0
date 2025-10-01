import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Character, GameLocation, Quest, CombatState, GameScreen, CharacterPortrait } from '../types/game';
import { initialQuests } from '../utils/questSystem';
import { createEnemyByType } from '../utils/combatMechanics';
import { loadCharacter, saveCharacter } from '../utils/characterSave';
import { createInitialBaseStats, calculateDerivedStats, calculateMaxHP, calculateMaxMP, calculateTotalBaseStats } from '../utils/statCalculations';
import { clearAllBuffsDebuffs } from '../utils/buffDebuffEngine';

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

type GameAction =
  | { type: 'START_NEW_GAME'; payload: { characterName: string } }
  | { type: 'CREATE_CHARACTER'; payload: CreateCharacterData }
  | { type: 'LOAD_SAVED_CHARACTER'; payload: { savedData: any } }
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
  | { type: 'UNLOCK_NODE'; payload: { locationId: string; nodeId: string } }
  | { type: 'EQUIP_ITEM'; payload: { slot: import('../types/game').EquipmentSlot; item: import('../types/game').Equipment } }
  | { type: 'UNEQUIP_ITEM'; payload: { slot: import('../types/game').EquipmentSlot } }
  | { type: 'LEARN_SKILL'; payload: { skill: import('../types/game').Skill } };

const initialBaseStats = createInitialBaseStats();
const initialDerivedStats = calculateDerivedStats(initialBaseStats);
const initialMaxHP = calculateMaxHP(initialBaseStats);
const initialMaxMP = calculateMaxMP(initialBaseStats);

const initialGameState: GameState = {
  character: {
    id: '',
    name: '', // Empty name triggers character creation
    level: 1,
    health: initialMaxHP,
    maxHealth: initialMaxHP,
    mana: initialMaxMP,
    maxMana: initialMaxMP,
    baseStats: initialBaseStats,
    derivedStats: initialDerivedStats,
    availableStatPoints: 0,
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
  currentNode: 'home',
  currentGlobalNode: 'fishing_village',
  mapEnergy: 10,
  maxMapEnergy: 10,
  locations: getInitialLocations(),
  globalMap: {},
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
          connections: ['guardian', 'town_square'],
          unlocked: true,
          visited: true,
          icon: '🏠'
        },
        {
          id: 'guardian',
          name: 'Talk to Guardian',
          description: 'Your guardian has wisdom to share before you begin your journey.',
          type: 'person',
          position: { x: 30, y: 70 },
          connections: ['town_square', 'meditation_garden'],
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
          id: 'town_square',
          name: 'Town Square',
          description: 'The bustling center of your small fishing village.',
          type: 'event',
          position: { x: 50, y: 60 },
          connections: ['home', 'guardian', 'marketplace', 'docks', 'library'],
          unlocked: false,
          visited: false,
          icon: '🏛️'
        },
        {
          id: 'marketplace',
          name: 'Village Marketplace',
          description: 'Local vendors sell goods and share wisdom.',
          type: 'event',
          position: { x: 70, y: 60 },
          connections: ['town_square', 'bakery', 'smithy'],
          unlocked: false,
          visited: false,
          icon: '🏪'
        },
        {
          id: 'bakery',
          name: 'Village Bakery',
          description: 'Sweet aromas and philosophical conversations.',
          type: 'event',
          position: { x: 80, y: 70 },
          connections: ['marketplace', 'old_well'],
          unlocked: false,
          visited: false,
          icon: '🥖'
        },
        {
          id: 'smithy',
          name: 'Village Smithy',
          description: 'The blacksmith forges tools and wisdom alike.',
          type: 'event',
          position: { x: 80, y: 50 },
          connections: ['marketplace', 'training_ground'],
          unlocked: false,
          visited: false,
          icon: '⚒️'
        },
        {
          id: 'library',
          name: 'Village Library',
          description: 'Ancient books hold philosophical secrets.',
          type: 'event',
          position: { x: 30, y: 50 },
          connections: ['town_square', 'meditation_garden', 'secret_chamber'],
          unlocked: false,
          visited: false,
          icon: '📚'
        },
        {
          id: 'meditation_garden',
          name: 'Meditation Garden',
          description: 'A peaceful place for reflection and growth.',
          type: 'event',
          position: { x: 20, y: 60 },
          connections: ['guardian', 'library', 'shrine'],
          unlocked: false,
          visited: false,
          icon: '🌸'
        },
        {
          id: 'docks',
          name: 'Town Docks',
          description: 'The wooden docks where fishing boats come and go.',
          type: 'resource',
          position: { x: 70, y: 40 },
          connections: ['town_square', 'fishing_spot', 'lighthouse'],
          unlocked: false,
          visited: false,
          event: {
            id: 'prepare_fishing',
            type: 'fishing',
            description: 'Prepare your fishing gear and learn the basics.',
            requirements: [{ type: 'stat', key: 'talkedToGuardian', value: 1 }]
          },
          icon: '⚓'
        },
        {
          id: 'fishing_spot',
          name: 'Fishing Waters',
          description: 'Rich fishing waters where you can catch fish for your journey.',
          type: 'resource',
          position: { x: 85, y: 30 },
          connections: ['docks', 'boat_builder', 'secret_cove'],
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
          id: 'lighthouse',
          name: 'Old Lighthouse',
          description: 'A weathered lighthouse with mysterious engravings.',
          type: 'event',
          position: { x: 90, y: 40 },
          connections: ['docks', 'clifftop_view'],
          unlocked: false,
          visited: false,
          icon: '🗼'
        },
        {
          id: 'boat_builder',
          name: 'Boat Workshop',
          description: 'Where you can build a boat to explore beyond the town.',
          type: 'event',
          position: { x: 60, y: 20 },
          connections: ['fishing_spot', 'shipyard', 'workshop'],
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
          id: 'training_ground',
          name: 'Training Ground',
          description: 'Practice your philosophical combat skills.',
          type: 'event',
          position: { x: 90, y: 60 },
          connections: ['smithy', 'arena'],
          unlocked: false,
          visited: false,
          icon: '⚔️'
        },
        {
          id: 'old_well',
          name: 'Ancient Well',
          description: 'An old well with strange echoes from below.',
          type: 'event',
          position: { x: 80, y: 80 },
          connections: ['bakery', 'underground_tunnel'],
          unlocked: false,
          visited: false,
          icon: '🕳️'
        },
        {
          id: 'shrine',
          name: 'Village Shrine',
          description: 'A small shrine dedicated to wisdom and learning.',
          type: 'event',
          position: { x: 10, y: 70 },
          connections: ['meditation_garden', 'hidden_grove'],
          unlocked: false,
          visited: false,
          icon: '⛩️'
        },
        {
          id: 'secret_chamber',
          name: 'Secret Chamber',
          description: 'A hidden room beneath the library.',
          type: 'event',
          position: { x: 20, y: 40 },
          connections: ['library'],
          unlocked: false,
          visited: false,
          icon: '🔒'
        },
        {
          id: 'clifftop_view',
          name: 'Clifftop Viewpoint',
          description: 'A scenic overlook of the entire village.',
          type: 'event',
          position: { x: 95, y: 30 },
          connections: ['lighthouse', 'eagle_nest'],
          unlocked: false,
          visited: false,
          icon: '🏔️'
        },
        {
          id: 'secret_cove',
          name: 'Hidden Cove',
          description: 'A secluded cove with unusual philosophical properties.',
          type: 'event',
          position: { x: 95, y: 20 },
          connections: ['fishing_spot'],
          unlocked: false,
          visited: false,
          icon: '🏝️'
        },
        {
          id: 'arena',
          name: 'Philosophy Arena',
          description: 'Where young philosophers test their skills.',
          type: 'event',
          position: { x: 95, y: 70 },
          connections: ['training_ground'],
          unlocked: false,
          visited: false,
          icon: '🏟️'
        },
        {
          id: 'shipyard',
          name: 'Village Shipyard',
          description: 'Where larger vessels are constructed.',
          type: 'event',
          position: { x: 50, y: 10 },
          connections: ['boat_builder', 'workshop', 'harbor_master'],
          unlocked: false,
          visited: false,
          icon: '🛠️'
        },
        {
          id: 'workshop',
          name: 'Artisan Workshop',
          description: 'Craftspeople create tools and philosophical instruments.',
          type: 'event',
          position: { x: 40, y: 15 },
          connections: ['boat_builder', 'shipyard'],
          unlocked: false,
          visited: false,
          icon: '🔧'
        },
        {
          id: 'underground_tunnel',
          name: 'Underground Tunnel',
          description: 'A mysterious tunnel system beneath the village.',
          type: 'event',
          position: { x: 70, y: 85 },
          connections: ['old_well', 'ancient_chamber'],
          unlocked: false,
          visited: false,
          icon: '🕳️'
        },
        {
          id: 'hidden_grove',
          name: 'Hidden Grove',
          description: 'A magical grove where nature spirits dwell.',
          type: 'event',
          position: { x: 5, y: 80 },
          connections: ['shrine', 'forest_path'],
          unlocked: false,
          visited: false,
          icon: '🌳'
        },
        {
          id: 'eagle_nest',
          name: 'Eagle\'s Nest',
          description: 'High perch where wise eagles make their home.',
          type: 'event',
          position: { x: 98, y: 15 },
          connections: ['clifftop_view'],
          unlocked: false,
          visited: false,
          icon: '🦅'
        },
        {
          id: 'harbor_master',
          name: 'Harbor Master\'s Office',
          description: 'The harbor master keeps records of all journeys.',
          type: 'event',
          position: { x: 40, y: 5 },
          connections: ['shipyard'],
          unlocked: false,
          visited: false,
          icon: '📋'
        },
        {
          id: 'ancient_chamber',
          name: 'Ancient Chamber',
          description: 'A chamber with ancient philosophical artifacts.',
          type: 'event',
          position: { x: 60, y: 90 },
          connections: ['underground_tunnel'],
          unlocked: false,
          visited: false,
          icon: '🏺'
        },
        {
          id: 'forest_path',
          name: 'Path to Forest',
          description: 'The beginning of your journey into the wider world.',
          type: 'exit',
          position: { x: 5, y: 90 },
          connections: ['hidden_grove'],
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
              text: 'Young one, I see the curiosity in your eyes. You wish to explore beyond our small town, don\'t you? Before you begin your journey, let me teach you the fundamental skill of reasoning. This will serve you well in the philosophical challenges ahead.',
              choices: [
                {
                  id: 'learn_reasoning',
                  text: 'Please teach me, Guardian. I am ready to learn.',
                  philosophicalAlignment: { ethics: 'virtue' },
                  outcome: {
                    type: 'unlock_progression',
                    description: 'Your guardian teaches you Basic Reasoning and encourages you to explore the village.'
                  },
                },
                {
                  id: 'learn_reasoning_eager',
                  text: 'I\'m eager to begin! What should I know?',
                  philosophicalAlignment: { epistemology: 'empiricist' },
                  outcome: {
                    type: 'unlock_progression',
                    description: 'Your guardian smiles and teaches you Basic Reasoning, opening new paths for exploration.'
                  },
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
          connections: ['woodland_path', 'creature_den'],
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
          description: 'A dark corner of the forest where twisted logic takes physical form. Perfect for testing your philosophical combat skills!',
          type: 'encounter',
          position: { x: 70, y: 30 },
          connections: ['deep_forest'],
          unlocked: true,
          visited: false,
          event: {
            id: 'fallacy_encounter',
            type: 'combat',
            description: 'BATTLE TEST: Fight an Abortive Fallacy to test combat mechanics!',
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

    case 'CREATE_CHARACTER':
      const finalBaseStats = action.payload.baseStats || createInitialBaseStats();
      const finalDerivedStats = calculateDerivedStats(finalBaseStats);
      const finalMaxHP = calculateMaxHP(finalBaseStats);
      const finalMaxMP = calculateMaxMP(finalBaseStats);

      // Add default equipment for new characters
      const defaultEquipment = {
        helmet: {
          id: 'starter_helmet',
          name: 'Leather Cap',
          type: 'armor' as const,
          stats: { body: 1 },
          special: 'Basic protection for beginners',
          icon: '🧢'
        },
        bodyArmor: {
          id: 'starter_tunic',
          name: 'Simple Tunic',
          type: 'armor' as const,
          stats: { heart: 1 },
          special: 'Comfortable clothing for philosophical discourse',
          icon: '👕'
        },
        gloves: {
          id: 'starter_gloves',
          name: 'Work Gloves',
          type: 'armor' as const,
          stats: { body: 1 },
          special: 'Basic hand protection',
          icon: '🧤'
        },
        boots: {
          id: 'starter_boots',
          name: 'Simple Boots',
          type: 'armor' as const,
          stats: { body: 1 },
          special: 'Footwear for long journeys',
          icon: '👢'
        },
        leftHand: {
          id: 'starter_weapon',
          name: 'Walking Stick',
          type: 'weapon' as const,
          stats: { body: 2 },
          special: 'A sturdy stick for support and defense',
          icon: '🪄'
        },
        rightHand: {
          id: 'starter_book',
          name: 'Philosophy Primer',
          type: 'weapon' as const,
          stats: { mind: 2 },
          special: 'Basic text on logical reasoning',
          icon: '📚'
        },
        leftRing: {
          id: 'starter_ring',
          name: 'Simple Ring',
          type: 'accessory' as const,
          subtype: 'ring' as const,
          stats: { mind: 1 },
          special: 'A basic ring for focus',
          icon: '💍'
        },
        bracelet: {
          id: 'starter_bracelet',
          name: 'Leather Bracelet',
          type: 'accessory' as const,
          subtype: 'bracelet' as const,
          stats: { body: 1 },
          special: 'Basic wrist protection',
          icon: '🧿'
        },
        amulet: {
          id: 'starter_amulet',
          name: 'Heart Pendant',
          type: 'accessory' as const,
          subtype: 'amulet' as const,
          stats: { heart: 1 },
          special: 'A simple pendant for emotional balance',
          icon: '📿'
        }
      };

      return {
        ...initialGameState,
        character: {
          ...initialGameState.character,
          id: Date.now().toString(),
          name: action.payload.name,
          portrait: action.payload.portrait,
          baseStats: finalBaseStats,
          derivedStats: finalDerivedStats,
          health: finalMaxHP,
          maxHealth: finalMaxHP,
          mana: finalMaxMP,
          maxMana: finalMaxMP,
          availableStatPoints: 0,
          equippedItems: defaultEquipment,
        },
      };

    case 'LOAD_SAVED_CHARACTER':
      const savedData = action.payload.savedData;
      return {
        character: savedData.character,
        currentLocation: savedData.currentLocation,
        currentNode: savedData.currentNode,
        story: savedData.story,
        inventory: savedData.inventory,
        locations: savedData.locations,
        globalMap: savedData.globalMap || {},
        questLog: savedData.questLog,
        mapEnergy: savedData.mapEnergy,
        maxMapEnergy: savedData.maxMapEnergy,
        gamePhase: savedData.gamePhase,
        combat: initialGameState.combat, // Reset combat state
      };

    case 'MOVE_TO_LOCATION':
      const targetLocation = state.locations[action.payload.locationId];
      const startNodeId = targetLocation?.isNodeMap ? 
        targetLocation.nodes?.find(n => n.type === 'start')?.id : undefined;
      const nextCurrentNode = startNodeId || state.currentNode;
      return {
        ...state,
        currentLocation: action.payload.locationId,
        ...(nextCurrentNode ? { currentNode: nextCurrentNode } : {}),
      };

    case 'MOVE_TO_NODE':
      const currentLoc = state.locations[state.currentLocation];
      if (!currentLoc) return state;
      
      return {
        ...state,
        currentNode: action.payload.nodeId,
        locations: {
          ...state.locations,
          [state.currentLocation]: {
            ...currentLoc,
            nodes: currentLoc.nodes?.map(node => 
              node.id === action.payload.nodeId 
                ? { ...node, visited: true }
                : node
            ) || []
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
      console.log(`🔓 UNLOCK_NODE reducer: unlocking ${action.payload.nodeId} in ${action.payload.locationId}`);
      const unlockLocation = state.locations[action.payload.locationId];
      if (!unlockLocation) {
        console.warn(`Location ${action.payload.locationId} not found`);
        return state;
      }
      
      const updatedState = {
        ...state,
        locations: {
          ...state.locations,
          [action.payload.locationId]: {
            ...unlockLocation,
            nodes: unlockLocation.nodes?.map(node =>
              node.id === action.payload.nodeId
                ? { ...node, unlocked: true }
                : node
            ) || []
          }
        }
      };
      console.log('🔓 Node unlocked, updated state:', updatedState.locations[action.payload.locationId]?.nodes?.find(n => n.id === action.payload.nodeId));
      return updatedState;

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
          playerBuffs: clearAllBuffsDebuffs(),
          enemyBuffs: clearAllBuffsDebuffs(),
          agreeToDisagreeCounter: 0,
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

    case 'EQUIP_ITEM': {
      const { slot, item } = action.payload;

      // Update equipped items
      const newEquippedItems = {
        ...state.character.equippedItems,
        [slot]: item,
      };

      // Recalculate stats with new equipment
      const totalBaseStats = calculateTotalBaseStats(state.character.baseStats, newEquippedItems);
      const newDerivedStats = calculateDerivedStats(totalBaseStats);
      const newMaxHP = calculateMaxHP(totalBaseStats);
      const newMaxMP = calculateMaxMP(totalBaseStats);

      console.log(`⚔️ Equipped ${item.name} to ${slot}`);
      console.log(`📊 New total base stats:`, totalBaseStats);

      return {
        ...state,
        character: {
          ...state.character,
          equippedItems: newEquippedItems,
          derivedStats: newDerivedStats,
          maxHealth: newMaxHP,
          maxMana: newMaxMP,
          // Heal player proportionally when max HP/MP increases
          health: Math.min(state.character.health, newMaxHP),
          mana: Math.min(state.character.mana, newMaxMP),
        },
      };
    }

    case 'UNEQUIP_ITEM': {
      const { slot } = action.payload;

      if (!state.character.equippedItems?.[slot]) {
        return state; // Nothing equipped in that slot
      }

      // Update equipped items
      const newEquippedItems = { ...state.character.equippedItems };
      delete newEquippedItems[slot];

      // Recalculate stats without the unequipped item
      const totalBaseStats = calculateTotalBaseStats(state.character.baseStats, newEquippedItems);
      const newDerivedStats = calculateDerivedStats(totalBaseStats);
      const newMaxHP = calculateMaxHP(totalBaseStats);
      const newMaxMP = calculateMaxMP(totalBaseStats);

      console.log(`🗑️ Unequipped item from ${slot}`);
      console.log(`📊 New total base stats:`, totalBaseStats);

      return {
        ...state,
        character: {
          ...state.character,
          equippedItems: newEquippedItems,
          derivedStats: newDerivedStats,
          maxHealth: newMaxHP,
          maxMana: newMaxMP,
          // Ensure current HP/MP don't exceed new maximums
          health: Math.min(state.character.health, newMaxHP),
          mana: Math.min(state.character.mana, newMaxMP),
        },
      };
    }

    case 'LEARN_SKILL': {
      const { skill } = action.payload;

      // Check if skill is already learned
      if (state.character.skills.some(s => s.id === skill.id)) {
        console.log(`⚠️ Skill ${skill.name} is already learned`);
        return state;
      }

      console.log(`✨ Learned new skill: ${skill.name}`);

      return {
        ...state,
        character: {
          ...state.character,
          skills: [...state.character.skills, skill],
        },
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [currentScreen, setCurrentScreen] = React.useState<GameScreen>('exploration');

  // Auto-save when character is created or updated (but not on initial load)
  React.useEffect(() => {
    if (gameState.character && gameState.character.name && gameState.character.id !== 'placeholder') {
      const saveTimer = setTimeout(async () => {
        try {
          await saveCharacter(gameState);
          console.log('📝 Character auto-saved after game state change');
        } catch (error) {
          console.error('Failed to auto-save character:', error);
        }
      }, 500); // Wait a bit for state to stabilize

      return () => clearTimeout(saveTimer);
    }
    return undefined;
  }, [gameState.character, gameState.currentLocation]);

  const startNewGame = (characterName: string) => {
    dispatch({ type: 'START_NEW_GAME', payload: { characterName } });
    setCurrentScreen('exploration');
  };

  const createCharacter = (characterData: CreateCharacterData) => {
    dispatch({ type: 'CREATE_CHARACTER', payload: characterData });
    setCurrentScreen('exploration');
  };

  const loadSavedCharacter = async (): Promise<boolean> => {
    try {
      const savedData = await loadCharacter();
      if (!savedData) {
        console.log('No saved character found');
        return false;
      }

      console.log('Loading saved character:', savedData.character.name);
      dispatch({ type: 'LOAD_SAVED_CHARACTER', payload: { savedData } });
      setCurrentScreen('exploration');
      return true;
    } catch (error) {
      console.error('Failed to load saved character:', error);
      return false;
    }
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

  const unlockGuardianProgression = () => {
    console.log('🌟 unlockGuardianProgression() called!');
    console.log('📍 Current Location:', gameState.currentLocation);

    // Unlock Basic Reasoning skill
    const basicReasoningSkill = {
      id: 'basic_reasoning',
      name: 'Basic Reasoning',
      description: 'Fundamental logical thinking skills unlocked by your guardian.',
      level: 1,
      manaCost: 5,
      damage: 10,
      icon: '🤔',
      type: 'logic' as const,
      philosophicalAspect: 'mind' as const,
    };

    console.log('✅ Adding Basic Reasoning skill:', basicReasoningSkill);

    // Update story to mark guardian as talked to
    dispatch({ type: 'UPDATE_STORY', payload: { talkedToGuardian: true } });
    console.log('✅ Set talkedToGuardian to true');

    // Add the Basic Reasoning skill
    dispatch({ type: 'UPDATE_CHARACTER', payload: {
      skills: [basicReasoningSkill]
    }});

    // Unlock all nodes connected to the guardian
    const guardianNode = gameState.locations[gameState.currentLocation]?.nodes?.find(n => n.id === 'guardian');
    console.log('🏰 Guardian Node:', guardianNode);
    console.log('🔗 Guardian Connections:', guardianNode?.connections);

    if (guardianNode?.connections) {
      guardianNode.connections.forEach(connectedNodeId => {
        console.log(`🔓 Unlocking node: ${connectedNodeId}`);
        dispatch({ type: 'UNLOCK_NODE', payload: {
          locationId: gameState.currentLocation,
          nodeId: connectedNodeId
        }});
      });
    }
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

  const equipItem = (slot: import('../types/game').EquipmentSlot, item: import('../types/game').Equipment) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { slot, item } });
  };

  const unequipItem = (slot: import('../types/game').EquipmentSlot) => {
    dispatch({ type: 'UNEQUIP_ITEM', payload: { slot } });
  };

  const canLearnSkill = (skill: import('../types/game').Skill): boolean => {
    // Check if already learned
    if (gameState.character.skills.some(s => s.id === skill.id)) {
      return false;
    }

    // Check learning requirements
    if (skill.learningRequirement) {
      const req = skill.learningRequirement;

      // Check level requirement
      if (req.level && gameState.character.level < req.level) {
        return false;
      }

      // Check stat requirements
      if (req.stats) {
        if (req.stats.heart && gameState.character.baseStats.heart < req.stats.heart) {
          return false;
        }
        if (req.stats.body && gameState.character.baseStats.body < req.stats.body) {
          return false;
        }
        if (req.stats.mind && gameState.character.baseStats.mind < req.stats.mind) {
          return false;
        }
      }
    }

    return true;
  };

  const learnSkill = (skill: import('../types/game').Skill) => {
    if (!canLearnSkill(skill)) {
      console.warn(`Cannot learn skill ${skill.name}: requirements not met`);
      return;
    }

    dispatch({ type: 'LEARN_SKILL', payload: { skill } });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentScreen,
        startNewGame,
        createCharacter,
        loadSavedCharacter,
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
        unlockGuardianProgression,
        equipItem,
        unequipItem,
        learnSkill,
        canLearnSkill,
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