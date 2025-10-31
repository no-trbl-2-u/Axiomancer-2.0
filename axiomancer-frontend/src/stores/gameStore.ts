import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GameState, Character, GameLocation, Quest, CombatState, GameScreen, CharacterPortrait, BaseStats, Equipment, EquipmentSlot, Skill, PhilosophicalAspect } from '../types/game';
import { NewCombatState } from '../types/newCombat';
import { initialQuests } from '../utils/questSystem';
import { createEnemyByType } from '../utils/combatMechanics';
import { fallacySpellbook } from '../utils/fallacySpellbook';
import { loadCharacter, saveCharacter } from '../utils/characterSave';
import { createInitialBaseStats, calculateDerivedStats, calculateMaxHP, calculateMaxMP, calculateTotalBaseStats, getTotalInvestedPoints, getCharacterCreationPoints } from '../utils/statCalculations';
import { clearAllBuffsDebuffs } from '../utils/buffDebuffEngine';

/**
 * Character creation data
 */
interface CreateCharacterData {
  name: string;
  gender: 'male' | 'female';
  portrait: CharacterPortrait;
  baseStats?: BaseStats;
}

/**
 * Game Store State Interface
 * All game mechanics are UI-agnostic and live here
 */
interface GameStore {
  // State
  gameState: GameState;
  currentScreen: GameScreen;
  
  // Character Actions
  createCharacter: (characterData: CreateCharacterData) => void;
  loadSavedCharacter: () => Promise<boolean>;
  updateCharacter: (updates: Partial<Character>) => void;
  assignStatPoint: (statName: keyof BaseStats) => void;
  unassignStatPoint: (statName: keyof BaseStats) => void;
  gainExperience: (amount: number) => void;
  
  // Location & Navigation
  moveToLocation: (locationId: string) => void;
  moveToNode: (nodeId: string) => void;
  unlockNode: (locationId: string, nodeId: string) => void;
  
  // Inventory Management
  updateInventory: (updates: Partial<GameState['inventory']>) => void;
  
  // Story Progression
  updateStory: (updates: Partial<GameState['story']>) => void;
  unlockGuardianProgression: () => void;
  
  // Combat System
  startCombat: (enemyId: string) => void;
  endCombat: () => void;
  updateCombat: (updates: Partial<CombatState>) => void;
  
  // Quest System
  completeQuest: (questId: string) => void;
  addQuest: (quest: Quest) => void;
  
  // Equipment System
  equipItem: (slot: EquipmentSlot, item: Equipment) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  
  // Skill System
  learnSkill: (skill: Skill) => void;
  canLearnSkill: (skill: Skill) => boolean;
  equipSkill: (skill: Skill, aspect: PhilosophicalAspect) => void;
  unequipSkill: (skillId: string, aspect: PhilosophicalAspect) => void;
  
  // Screen Navigation
  changeScreen: (screen: GameScreen) => void;
  
  // Philosophical Choices
  makePhilosophicalChoice: (choiceId: string, outcome: any) => void;
  
  // Save System
  saveGame: () => Promise<void>;
  
  // Reset/New Game
  startNewGame: (characterName: string) => void;
  resetGame: () => void;
}

/**
 * Helper function to get initial locations
 */
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
                  outcome: {
                    type: 'unlock_progression',
                    description: 'Your guardian teaches you Basic Reasoning and encourages you to explore the village.'
                  },
                },
                {
                  id: 'learn_reasoning_eager',
                  text: 'I\'m eager to begin! What should I know?',
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
              },
              {
                id: 'logical',
                text: 'Analyze the paths logically and choose the safest route.',
                outcome: { type: 'stat_change', key: 'intelligence', value: 1 },
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
              },
              {
                id: 'spiritual',
                text: 'Growth is spiritual development and understanding.',
                outcome: { type: 'stat_change', key: 'wisdom', value: 2 },
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
                  outcome: { type: 'stat_change', key: 'wisdom', value: 2 },
                },
                {
                  id: 'seek_certainty',
                  text: 'There must be certain truths we can discover.',
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
                  outcome: { type: 'stat_change', key: 'wisdom', value: 3 },
                },
                {
                  id: 'rational_path',
                  text: 'Through careful reasoning and logic.',
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

/**
 * Create initial game state
 */
function createInitialGameState(): GameState {
  const initialBaseStats = createInitialBaseStats();
  const initialDerivedStats = calculateDerivedStats(initialBaseStats);
  const initialMaxHP = calculateMaxHP(initialBaseStats);
  const initialMaxMP = calculateMaxMP(initialBaseStats);

  return {
    character: {
      id: '',
      name: '', // Empty name triggers character creation
      level: 1,
      experience: 0,
      experienceToNextLevel: 1000,
      health: initialMaxHP,
      maxHealth: initialMaxHP,
      mana: initialMaxMP,
      maxMana: initialMaxMP,
      baseStats: initialBaseStats,
      derivedStats: initialDerivedStats,
      availableStatPoints: 0,
      unassignedStatPoints: 0,
      availableSkills: [],
      equippedSkills: {
        heart: [],
        body: [],
        mind: []
      },
      equipment: [],
      inventory: [],

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
}

/**
 * Game Store Implementation using Zustand
 * All game mechanics are UI-agnostic and contained in this store
 */
export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      gameState: createInitialGameState(),
      currentScreen: 'exploration',

      // Character Actions
      createCharacter: (characterData: CreateCharacterData) => {
        const finalBaseStats = characterData.baseStats || createInitialBaseStats();
        const finalDerivedStats = calculateDerivedStats(finalBaseStats);
        const finalMaxHP = calculateMaxHP(finalBaseStats);
        const finalMaxMP = calculateMaxMP(finalBaseStats);

        // Calculate unassigned stat points - any points not used during character creation
        const totalInvestedPoints = getTotalInvestedPoints(finalBaseStats);
        const maxAvailablePoints = getCharacterCreationPoints();
        const unassignedStatPoints = Math.max(0, maxAvailablePoints - totalInvestedPoints);

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

        set((state) => ({
          gameState: {
            ...createInitialGameState(),
            character: {
              ...createInitialGameState().character,
              id: Date.now().toString(),
              name: characterData.name,
              portrait: characterData.portrait,
              baseStats: finalBaseStats,
              derivedStats: finalDerivedStats,
              health: finalMaxHP,
              maxHealth: finalMaxHP,
              mana: finalMaxMP,
              maxMana: finalMaxMP,
              availableStatPoints: 0,
              unassignedStatPoints: unassignedStatPoints,
              equippedItems: defaultEquipment,
            },
          },
          currentScreen: 'exploration',
        }));

        // Auto-save after character creation
        setTimeout(() => {
          get().saveGame();
        }, 500);
      },

      loadSavedCharacter: async (): Promise<boolean> => {
        try {
          const savedData = await loadCharacter();
          if (!savedData) {
            console.log('No saved character found');
            return false;
          }

          console.log('Loading saved character:', savedData.character.name);
          set({
            gameState: {
              character: savedData.character,
              currentLocation: savedData.currentLocation,
              currentNode: savedData.currentNode,
              story: savedData.story,
              inventory: savedData.inventory,
              locations: savedData.locations,
              globalMap: {},
              questLog: savedData.questLog,
              mapEnergy: savedData.mapEnergy,
              maxMapEnergy: savedData.maxMapEnergy,
              gamePhase: (savedData.gamePhase as 'childhood' | 'labyrinth' | 'adulthood') || 'childhood',
              combat: null, // Reset combat state
              currentGlobalNode: 'fishing_village',
            },
            currentScreen: 'exploration',
          });
          return true;
        } catch (error) {
          console.error('Failed to load saved character:', error);
          return false;
        }
      },

      updateCharacter: (updates: Partial<Character>) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            character: {
              ...state.gameState.character,
              ...updates,
            },
          },
        }));

        // Auto-save after character update
        setTimeout(() => {
          get().saveGame();
        }, 500);
      },

      assignStatPoint: (statName: keyof BaseStats) => {
        set((state) => {
          const currentCharacter = state.gameState.character;

          // Check if there are unassigned stat points available
          if (currentCharacter.unassignedStatPoints <= 0) {
            return state; // No points to assign
          }

          // Update base stats and unassigned points
          const newBaseStats = {
            ...currentCharacter.baseStats,
            [statName]: currentCharacter.baseStats[statName] + 1
          };

          // Recalculate derived stats
          const newDerivedStats = calculateDerivedStats(newBaseStats);
          const newMaxHP = calculateMaxHP(newBaseStats);
          const newMaxMP = calculateMaxMP(newBaseStats);

          console.log(`📈 Assigned stat point to ${statName}. New value: ${newBaseStats[statName]}`);

          return {
            gameState: {
              ...state.gameState,
              character: {
                ...currentCharacter,
                baseStats: newBaseStats,
                derivedStats: newDerivedStats,
                maxHealth: newMaxHP,
                maxMana: newMaxMP,
                unassignedStatPoints: currentCharacter.unassignedStatPoints - 1,
                // Ensure current HP/MP don't exceed new maximums
                health: Math.min(currentCharacter.health, newMaxHP),
                mana: Math.min(currentCharacter.mana, newMaxMP),
              },
            },
          };
        });

        // Auto-save after stat assignment
        setTimeout(() => {
          get().saveGame();
        }, 500);
      },

      unassignStatPoint: (statName: keyof BaseStats) => {
        set((state) => {
          const currentCharacter = state.gameState.character;

          // Check if stat can be decreased (can't go below 1)
          if (currentCharacter.baseStats[statName] <= 1) {
            return state; // Can't unassign below 1
          }

          // Update base stats and unassigned points
          const newBaseStats = {
            ...currentCharacter.baseStats,
            [statName]: currentCharacter.baseStats[statName] - 1
          };

          // Recalculate derived stats
          const newDerivedStats = calculateDerivedStats(newBaseStats);
          const newMaxHP = calculateMaxHP(newBaseStats);
          const newMaxMP = calculateMaxMP(newBaseStats);

          console.log(`📉 Unassigned stat point from ${statName}. New value: ${newBaseStats[statName]}`);

          return {
            gameState: {
              ...state.gameState,
              character: {
                ...currentCharacter,
                baseStats: newBaseStats,
                derivedStats: newDerivedStats,
                maxHealth: newMaxHP,
                maxMana: newMaxMP,
                unassignedStatPoints: currentCharacter.unassignedStatPoints + 1,
                // Ensure current HP/MP don't exceed new maximums
                health: Math.min(currentCharacter.health, newMaxHP),
                mana: Math.min(currentCharacter.mana, newMaxMP),
              },
            },
          };
        });

        // Auto-save after stat unassignment
        setTimeout(() => {
          get().saveGame();
        }, 500);
      },

      gainExperience: (amount: number) => {
        set((state) => {
          const currentCharacter = state.gameState.character;
          const newExperience = currentCharacter.experience + amount;
          const newExperienceToNextLevel = currentCharacter.experienceToNextLevel;
          let leveledUp = false;
          let newLevel = currentCharacter.level;
          let newUnassignedStatPoints = currentCharacter.unassignedStatPoints;

          // Check if character leveled up
          if (newExperience >= newExperienceToNextLevel) {
            newLevel = currentCharacter.level + 1;
            newUnassignedStatPoints = currentCharacter.unassignedStatPoints + 5;
            leveledUp = true;

            console.log(`🎉 Level up! ${currentCharacter.name} reached level ${newLevel}`);

            // Set new experience requirement for next level
            const newExpRequirement = 1000; // Always 1000 XP per level
          }

          return {
            gameState: {
              ...state.gameState,
              character: {
                ...currentCharacter,
                level: newLevel,
                experience: leveledUp ? newExperience - newExperienceToNextLevel : newExperience,
                experienceToNextLevel: leveledUp ? 1000 : newExperienceToNextLevel,
                unassignedStatPoints: newUnassignedStatPoints,
              },
            },
          };
        });

        // Auto-save after gaining experience
        setTimeout(() => {
          get().saveGame();
        }, 500);
      },

      // Location & Navigation
      moveToLocation: (locationId: string) => {
        set((state) => {
          const targetLocation = state.gameState.locations[locationId];
          const startNodeId = targetLocation?.isNodeMap ? 
            targetLocation.nodes?.find(n => n.type === 'start')?.id : undefined;
          const nextCurrentNode = startNodeId || state.gameState.currentNode;

          return {
            gameState: {
              ...state.gameState,
              currentLocation: locationId,
              ...(nextCurrentNode ? { currentNode: nextCurrentNode } : {}),
            },
          };
        });
      },

      moveToNode: (nodeId: string) => {
        set((state) => {
          const currentLoc = state.gameState.locations[state.gameState.currentLocation];
          if (!currentLoc) return state;

          return {
            gameState: {
              ...state.gameState,
              currentNode: nodeId,
              locations: {
                ...state.gameState.locations,
                [state.gameState.currentLocation]: {
                  ...currentLoc,
                  nodes: currentLoc.nodes?.map(node => 
                    node.id === nodeId 
                      ? { ...node, visited: true }
                      : node
                  ) || []
                }
              }
            }
          };
        });
      },

      unlockNode: (locationId: string, nodeId: string) => {
        console.log(`🔓 UNLOCK_NODE: unlocking ${nodeId} in ${locationId}`);
        set((state) => {
          const unlockLocation = state.gameState.locations[locationId];
          if (!unlockLocation) {
            console.warn(`Location ${locationId} not found`);
            return state;
          }

          return {
            gameState: {
              ...state.gameState,
              locations: {
                ...state.gameState.locations,
                [locationId]: {
                  ...unlockLocation,
                  nodes: unlockLocation.nodes?.map(node =>
                    node.id === nodeId
                      ? { ...node, unlocked: true }
                      : node
                  ) || []
                }
              }
            }
          };
        });
      },

      // Inventory Management
      updateInventory: (updates: Partial<GameState['inventory']>) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            inventory: {
              ...state.gameState.inventory,
              ...updates,
            },
          },
        }));
      },

      // Story Progression
      updateStory: (updates: Partial<GameState['story']>) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            story: {
              ...state.gameState.story,
              ...updates,
            },
          },
        }));
      },

      unlockGuardianProgression: () => {
        const state = get();
        console.log('🌟 unlockGuardianProgression() called!');
        console.log('📍 Current Location:', state.gameState.currentLocation);

        // Update story to mark guardian as talked to
        get().updateStory({ talkedToGuardian: true });
        console.log('✅ Set talkedToGuardian to true');

        // Unlock Basic Reasoning skill for the player
        const basicReasoningSkill: Skill = {
          id: 'basic_reasoning',
          name: 'Basic Reasoning',
          description: 'Fundamental logical thinking skills unlocked by your guardian.',
          level: 1,
          manaCost: 5,
          damage: 10,
          icon: '🤔',
          type: 'logic',
          philosophicalAspect: 'mind',
        };

        console.log('✅ Adding Basic Reasoning skill:', basicReasoningSkill);

        // Add the Basic Reasoning skill to availableSkills
        get().updateCharacter({
          availableSkills: [basicReasoningSkill],
        });

        // Unlock all nodes connected to the guardian
        const guardianNode = state.gameState.locations[state.gameState.currentLocation]?.nodes?.find(n => n.id === 'guardian');
        console.log('🏰 Guardian Node:', guardianNode);
        console.log('🔗 Guardian Connections:', guardianNode?.connections);

        if (guardianNode?.connections) {
          guardianNode.connections.forEach(connectedNodeId => {
            console.log(`🔓 Unlocking node: ${connectedNodeId}`);
            get().unlockNode(state.gameState.currentLocation, connectedNodeId);
          });
        }
      },

      // Combat System
      startCombat: (enemyId: string) => {
        const state = get();
        const enemy = createEnemyByType(enemyId);

        // Initialize new combat state
        const newCombatState: any = {
          active: true,
          phase: 'choosing_type',
          round: 1,
          friendshipCounter: 0,
          player: state.gameState.character,
          enemy,
          playerChoice: {},
          enemyChoice: {},
          battleLog: [],
        };

        set({
          gameState: {
            ...state.gameState,
            combat: newCombatState,
          },
          currentScreen: 'combat',
        });
      },

      endCombat: () => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            combat: null,
          },
          currentScreen: 'exploration',
        }));
      },

      updateCombat: (updates: Partial<any>) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            combat: state.gameState.combat ? {
              ...state.gameState.combat,
              ...updates,
            } : null,
          },
        }));
      },

      // Quest System
      completeQuest: (questId: string) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            questLog: state.gameState.questLog.map(quest =>
              quest.id === questId
                ? { ...quest, completed: true }
                : quest
            ),
          },
        }));
      },

      addQuest: (quest: Quest) => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            questLog: [...state.gameState.questLog, quest],
          },
        }));
      },

      // Equipment System
      equipItem: (slot: EquipmentSlot, item: Equipment) => {
        set((state) => {
          // Update equipped items
          const newEquippedItems = {
            ...state.gameState.character.equippedItems,
            [slot]: item,
          };

          // Recalculate stats with new equipment
          const totalBaseStats = calculateTotalBaseStats(state.gameState.character.baseStats, newEquippedItems);
          const newDerivedStats = calculateDerivedStats(totalBaseStats);
          const newMaxHP = calculateMaxHP(totalBaseStats);
          const newMaxMP = calculateMaxMP(totalBaseStats);

          console.log(`⚔️ Equipped ${item.name} to ${slot}`);
          console.log(`📊 New total base stats:`, totalBaseStats);

          return {
            gameState: {
              ...state.gameState,
              character: {
                ...state.gameState.character,
                equippedItems: newEquippedItems,
                derivedStats: newDerivedStats,
                maxHealth: newMaxHP,
                maxMana: newMaxMP,
                // Heal player proportionally when max HP/MP increases
                health: Math.min(state.gameState.character.health, newMaxHP),
                mana: Math.min(state.gameState.character.mana, newMaxMP),
              },
            },
          };
        });
      },

      unequipItem: (slot: EquipmentSlot) => {
        set((state) => {
          if (!state.gameState.character.equippedItems?.[slot]) {
            return state; // Nothing equipped in that slot
          }

          // Update equipped items
          const newEquippedItems = { ...state.gameState.character.equippedItems };
          delete newEquippedItems[slot];

          // Recalculate stats without the unequipped item
          const totalBaseStats = calculateTotalBaseStats(state.gameState.character.baseStats, newEquippedItems);
          const newDerivedStats = calculateDerivedStats(totalBaseStats);
          const newMaxHP = calculateMaxHP(totalBaseStats);
          const newMaxMP = calculateMaxMP(totalBaseStats);

          console.log(`🗑️ Unequipped item from ${slot}`);
          console.log(`📊 New total base stats:`, totalBaseStats);

          return {
            gameState: {
              ...state.gameState,
              character: {
                ...state.gameState.character,
                equippedItems: newEquippedItems,
                derivedStats: newDerivedStats,
                maxHealth: newMaxHP,
                maxMana: newMaxMP,
                // Ensure current HP/MP don't exceed new maximums
                health: Math.min(state.gameState.character.health, newMaxHP),
                mana: Math.min(state.gameState.character.mana, newMaxMP),
              },
            },
          };
        });
      },

      // Skill System
      canLearnSkill: (skill: Skill): boolean => {
        const state = get();
        // Check if already learned
        if (state.gameState.character.availableSkills.some(s => s.id === skill.id)) {
          return false;
        }

        // Check learning requirements
        if (skill.learningRequirement) {
          const req = skill.learningRequirement;

          // Check level requirement
          if (req.level && state.gameState.character.level < req.level) {
            return false;
          }

          // Check stat requirements
          if (req.stats) {
            if (req.stats.heart && state.gameState.character.baseStats.heart < req.stats.heart) {
              return false;
            }
            if (req.stats.body && state.gameState.character.baseStats.body < req.stats.body) {
              return false;
            }
            if (req.stats.mind && state.gameState.character.baseStats.mind < req.stats.mind) {
              return false;
            }
          }
        }

        return true;
      },

      learnSkill: (skill: Skill) => {
        const state = get();
        if (!state.canLearnSkill(skill)) {
          console.warn(`Cannot learn skill ${skill.name}: requirements not met`);
          return;
        }

        // Check if skill is already learned
        if (state.gameState.character.availableSkills.some(s => s.id === skill.id)) {
          console.log(`⚠️ Skill ${skill.name} is already learned`);
          return;
        }

        console.log(`✨ Learned new skill: ${skill.name}`);

        set((innerState) => ({
          gameState: {
            ...innerState.gameState,
            character: {
              ...innerState.gameState.character,
              availableSkills: [...innerState.gameState.character.availableSkills, skill],
            },
          },
        }));
      },

      equipSkill: (skill: Skill, aspect: PhilosophicalAspect) => {
        set((state) => {
          const currentEquipped = state.gameState.character.equippedSkills[aspect];
          if (currentEquipped.length >= 5) {
            console.warn(`Cannot equip more than 5 skills for ${aspect}`);
            return state;
          }

          // Check if skill is already equipped
          if (currentEquipped.some(s => s.id === skill.id)) {
            console.log(`Skill ${skill.name} is already equipped for ${aspect}`);
            return state;
          }

          // Auto-learn the skill if not already available
          const availableSkills = state.gameState.character.availableSkills;
          const skillAlreadyAvailable = availableSkills.some(s => s.id === skill.id);
          const updatedAvailableSkills = skillAlreadyAvailable 
            ? availableSkills 
            : [...availableSkills, skill];

          console.log(`✅ Equipped ${skill.name} to ${aspect}`);

          return {
            gameState: {
              ...state.gameState,
              character: {
                ...state.gameState.character,
                availableSkills: updatedAvailableSkills,
                equippedSkills: {
                  ...state.gameState.character.equippedSkills,
                  [aspect]: [...currentEquipped, skill]
                }
              }
            }
          };
        });

        // Auto-save after equipping skill
        setTimeout(() => {
          get().saveGame();
        }, 500);
      },

      unequipSkill: (skillId: string, aspect: PhilosophicalAspect) => {
        set((state) => {
          const currentEquipped = state.gameState.character.equippedSkills[aspect];
          const skillIndex = currentEquipped.findIndex(s => s.id === skillId);

          if (skillIndex === -1) {
            console.warn(`Skill ${skillId} is not equipped for ${aspect}`);
            return state;
          }

          return {
            gameState: {
              ...state.gameState,
              character: {
                ...state.gameState.character,
                equippedSkills: {
                  ...state.gameState.character.equippedSkills,
                  [aspect]: currentEquipped.filter((_, index) => index !== skillIndex)
                }
              }
            }
          };
        });

        // Auto-save after unequipping skill
        setTimeout(() => {
          get().saveGame();
        }, 500);
      },

      // Screen Navigation
      changeScreen: (screen: GameScreen) => {
        set({ currentScreen: screen });
      },

      // Philosophical Choices
      makePhilosophicalChoice: (choiceId: string, outcome: any) => {
        // TODO: Implement philosophical choice handling
        console.log('Philosophical choice made:', choiceId, outcome);
      },

      // Save System
      saveGame: async () => {
        const state = get();
        if (state.gameState.character && state.gameState.character.name && state.gameState.character.id !== 'placeholder') {
          try {
            await saveCharacter(state.gameState);
            console.log('📝 Game saved successfully');
          } catch (error) {
            console.error('Failed to save game:', error);
          }
        }
      },

      // Reset/New Game
      startNewGame: (characterName: string) => {
        set({
          gameState: {
            ...createInitialGameState(),
            character: {
              ...createInitialGameState().character,
              id: Date.now().toString(),
              name: characterName,
            },
          },
          currentScreen: 'exploration',
        });
      },

      resetGame: () => {
        set({
          gameState: createInitialGameState(),
          currentScreen: 'exploration',
        });
      },
    }),
    {
      name: 'axiomancer-game-store',
    }
  )
);
