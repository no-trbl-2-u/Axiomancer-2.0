// Enemy type moved to components/game/Events/CombatModal/enemyHelper.ts
// Re-exported here for backwards compatibility
import type { Enemy as EnemyType } from '../components/game/Events/CombatModal/enemyHelper';
export type Enemy = EnemyType;

export interface CharacterPortrait {
  imageUrl: string;
  description: string;
}

export interface BaseStats {
  heart: number;
  body: number;
  mind: number;
}

export interface DerivedStats {
  // Body-derived stats
  physicalAttack: number;
  physicalDefense: number;
  constitutionSave: number;

  // Mind-derived stats
  mindAttack: number;
  mindDefense: number;
  reflexSave: number;
  perception: number;

  // Heart-derived stats
  ailmentAttack: number;
  ailmentDefense: number;
  willSave: number;

  // Shared stats
  evasion: number;
  accuracy: number;
  luck: number;
}

export type EquipmentSlot = 'helmet' | 'bodyArmor' | 'gloves' | 'boots' | 'leftHand' | 'rightHand' | 'leftRing' | 'rightRing' | 'bracelet' | 'amulet' | 'cloak';

export interface EquippedItems {
  helmet?: Equipment;
  bodyArmor?: Equipment;
  gloves?: Equipment;
  boots?: Equipment;
  leftHand?: Equipment;
  rightHand?: Equipment;
  leftRing?: Equipment;
  rightRing?: Equipment;
  bracelet?: Equipment;
  amulet?: Equipment;
  cloak?: Equipment;
}

/**
 * @planned Future feature for categorized inventory
 * Currently unused - inventory uses flat Item[] array
 */
export interface InventoryCategories {
  equipment: Item[];
  consumables: Item[];
  materials: Item[];
  keyItems: Item[];
  questItems: Item[];
}

export interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  portrait?: CharacterPortrait;
  baseStats: BaseStats;
  derivedStats: DerivedStats;
  availableStatPoints: number;
  unassignedStatPoints: number;
  availableSkills: Skill[];
  equippedSkills: {
    heart: Skill[];
    body: Skill[];
    mind: Skill[];
  };
  inventory: Item[];
  equippedItems?: EquippedItems;
}

// TODO: Refactor after I revisit skills and status effects
export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  manaCost: number;
  damage?: number;
  effect?: string;
  icon: string;
  type: 'fallacy' | 'virtue' | 'logic' | 'rhetoric' | 'meditation';
  philosophicalAspect?: PhilosophicalAspect;
  fallacyType?: 'formal' | 'informal' | 'cognitive_bias';
  learningRequirement?: {
    level: number;
    stats?: Partial<Character['baseStats']>;
  };

  // Combat.md required fields
  combatEffects?: {
    baseEffect?: string;
    advantageEffect?: string;
    baseDefendedEffect?: string;
    defendedAgainstAdvantage?: string;
    defendedWithAdvantage?: string;
    specialScenario?: string;
  };
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  subtype?: 'ring' | 'amulet' | 'bracelet';
  stats: Partial<Character['baseStats']>;
  special?: string;
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  value: number;
  stackable: boolean;
  quantity: number;
  icon: string;
}

export interface GameLocation {
  id: string;
  name: string;
  description: string;
  type: 'town' | 'forest' | 'cave' | 'river' | 'city' | 'island';
  connections: string[];
  npcs: NPC[];
  resources: string[];
  events: GameEvent[];
  mapImage?: string;
  coordinates?: { x: number; y: number };
  nodes?: GameNode[];
  isNodeMap?: boolean;
}

export interface GameNode {
  id: string;
  name: string;
  description: string;
  type: 'start' | 'resource' | 'encounter' | 'person' | 'event' | 'boss' | 'exit' | 'explore' | 'building';
  position: { x: number; y: number };
  connections: string[];
  unlocked: boolean;
  visited: boolean;
  event?: NodeEvent;
  cost?: NodeCost;
  icon?: string;
  isGlobalNode?: boolean; // true for global map nodes, false for exploration nodes
  energyCost?: number; // energy required to travel to this node
}

/**
 * @planned Future feature for global map exploration system
 * Currently unused - map system uses GameNode instead
 */
export interface GlobalMapNode {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  unlocked: boolean;
  completed: boolean;
  connections: string[];
  requiredCompletions?: string[]; // other nodes that must be completed to unlock this
  explorationNodes?: ExplorationNode[];
  theme: 'peaceful' | 'mysterious' | 'dangerous' | 'magical';
}

/**
 * @planned Future feature for detailed exploration within locations
 * Currently unused
 */
export interface ExplorationNode {
  id: string;
  type: 'dialogue' | 'combat' | 'discovery';
  title: string;
  description: string;
  energyCost: number;
  completed: boolean;
  // For dialogue nodes
  npcName?: string;
  dialogueOptions?: DialogueOption[];
  // For combat nodes
  enemyId?: string;
  // For discovery nodes
  discoveryType?: 'quest_item' | 'equipment' | 'consumable';
  item?: Item;
}

/**
 * @planned Future feature for dialogue choice system
 * Currently unused
 */
export interface DialogueOption {
  id: string;
  text: string;
  isCorrect: boolean; // true for the "real" answer that gives rewards
  response: string;
  energyReward?: number;
  itemReward?: Item;
  storyProgress?: Record<string, boolean>;
}

/**
 * @planned Future feature for node-based events
 * Currently unused - basic event system in use instead
 */
export interface NodeEvent {
  id: string;
  type: 'gather' | 'combat' | 'dialogue' | 'choice' | 'fishing' | 'building';
  description: string;
  resource?: string;
  enemyId?: string;
  npcId?: string;
  choices?: NodeChoice[];
  requirements?: ChoiceRequirement[];
  outcome?: ChoiceOutcome;
}

/**
 * @planned Future feature for node choices
 * Currently unused
 */
export interface NodeChoice {
  id: string;
  text: string;
  cost?: NodeCost;
  outcome?: ChoiceOutcome;
}

/**
 * @planned Future feature for node costs
 * Currently unused
 */
export interface NodeCost {
  health?: number;
  mana?: number;
  gold?: number;
  items?: Array<{ id: string; quantity: number }>;
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogue: DialogueNode[];
  tradeable?: boolean;
  items?: Item[];
}

export interface DialogueNode {
  id: string;
  text: string;
  choices: DialogueChoice[];
  philosophicalTopic?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId?: string;
  requirements?: ChoiceRequirement[];
  outcome?: ChoiceOutcome;
}

export interface ChoiceRequirement {
  type: 'stat' | 'item' | 'stance' | 'level';
  key: string;
  value: number | string;
}

export interface ChoiceOutcome {
  type: 'stat_change' | 'item_gain' | 'item_loss' | 'health_change' | 'stance_change' | 'unlock_progression';
  key?: string;
  value?: number | string;
  description?: string;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'philosophical_dilemma' | 'combat' | 'discovery' | 'trade';
  triggered: boolean;
  requirements?: ChoiceRequirement[];
}

export type PhilosophicalAspect = 'body' | 'mind' | 'heart';
export type CombatAction = 'attack' | 'defend' | 'special' | 'skill';

/**
 * @deprecated Legacy combat system - Consider using CombatDecision from newCombat.ts
 * This type is still used in older combat mechanics code
 */
export interface CombatChoice {
  aspect: PhilosophicalAspect;
  action: CombatAction;
  type: PhilosophicalAspect;
}

/**
 * @deprecated Legacy combat system
 */
export interface CombatRoundResult {
  playerChoice: CombatChoice;
  enemyChoice: CombatChoice;
  winner: 'player' | 'enemy' | 'tie';
  advantage: 'player' | 'enemy' | 'none';
  damage: {
    toPlayer: number;
    toEnemy: number;
  };
  effects: string[];
}

/**
 * @deprecated Legacy combat state - Used in older combat system
 * Note: A separate, more detailed CombatState exists in combatState.ts for buff/debuff system
 * Consider consolidating or clearly separating these systems
 */
export interface CombatState {
  active: boolean;
  turn: 'player' | 'enemy';
  phase: 'choosing_aspect' | 'choosing_action' | 'resolving' | 'ended';
  round: number;
  player: Character;
  enemy: Enemy;
  playerChoice: Partial<CombatChoice>;
  enemyChoice: Partial<CombatChoice>;
  roundResult: CombatRoundResult | null;
  advantages: {
    player: number;
    enemy: number;
  };
  friendshipCounter: number;
  battleLog: BattleLogEntry[];
}

/**
 * @deprecated Legacy battle log format with string-based data
 * Note: newCombat.ts has a more modern BattleLogEntry with proper number types
 */
export interface BattleLogEntry {
  round: string;
  playerDecision: CombatChoice;
  enemyDecision: CombatChoice;
  advantage: 'player' | 'enemy' | 'none';
  damage: {
    toPlayer: number;
    toEnemy: number;
  };
  effects: string[];
  playerRoll: string;
  enemyRoll: string;
  playerRollDetails: string;
  enemyRollDetails: string;
  damageToEnemy: number;
  damageToPlayer: number;
  playerHPAfter: string;
  enemyHPAfter: string;
  result: string;
}

export interface GameState {
  character: Character;
  currentLocation: string;
  currentNode?: string;
  currentGlobalNode?: string;
  currentExplorationNode?: string;
  mapEnergy: number;
  maxMapEnergy: number;
  locations: Record<string, GameLocation>;
  globalMap: Record<string, GlobalMapNode>;
  questLog: Quest[];
  gamePhase: 'childhood' | 'labyrinth' | 'adulthood';
  story: {
    /* Childhood series of events in order */
    startedFishing: boolean;
    hasCart: boolean;
    hasHorse: boolean;
    hasFish: number;
    gatheredWood: boolean;
    gatheredIronOre: boolean;
    visitedMajorCity: boolean;
    heardAdvisorRumor: boolean;
    builtBoat: boolean;
    visitedIslands: string[];
    visitedFriend: boolean;
    returnedHome: boolean;
    decidedToBeAdvisor: boolean;
    talkedToGuardian: boolean;
  };
  combat: CombatState | null;
  inventory: {
    gold: number;
    wood: number;
    ironOre: number;
    fish: number;
    items: Item[];
  };
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
  completed: boolean;
  philosophicalTheme?: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  requirement: ChoiceRequirement;
}

export type EquipmentType = 'weapon' | 'armor' | 'accessory' | 'consumable';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'crafting' | 'quest' | 'misc';
export type GameScreen = 'exploration' | 'combat' | 'character' | 'inventory' | 'dialogue' | 'map' | 'skills' | 'node_travel' | 'fishing' | 'building';