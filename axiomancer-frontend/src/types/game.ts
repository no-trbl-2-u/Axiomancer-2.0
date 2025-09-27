export interface Character {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: {
    strength: number;
    constitution: number;
    wisdom: number;
    intelligence: number;
    dexterity: number;
    charisma: number;
  };
  skills: Skill[];
  equipment: Equipment[];
  inventory: Item[];
  philosophicalStance: PhilosophicalStance;
}

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
    stats?: Partial<Character['stats']>;
    philosophicalAlignment?: Partial<PhilosophicalStance>;
  };
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  stats: Partial<Character['stats']>;
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

export interface PhilosophicalStance {
  ethics: 'virtue' | 'deontological' | 'consequentialist' | 'nihilistic';
  metaphysics: 'materialist' | 'idealist' | 'dualist' | 'pragmatist';
  epistemology: 'empiricist' | 'rationalist' | 'skeptical' | 'mystical';
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
  philosophicalAlignment?: Partial<PhilosophicalStance>;
  requirements?: ChoiceRequirement[];
  outcome?: ChoiceOutcome;
}

export interface ChoiceRequirement {
  type: 'stat' | 'item' | 'stance' | 'level';
  key: string;
  value: number | string;
}

export interface ChoiceOutcome {
  type: 'stat_change' | 'item_gain' | 'item_loss' | 'health_change' | 'stance_change';
  key: string;
  value: number | string;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'philosophical_dilemma' | 'combat' | 'discovery' | 'trade';
  triggered: boolean;
  requirements?: ChoiceRequirement[];
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: Character['stats'];
  skills: Skill[];
  loot: Item[];
  philosophicalAlignment?: PhilosophicalStance;
  type: 'fallacy' | 'sophist' | 'skeptic' | 'nihilist' | 'beast' | 'guardian';
  image?: string;
  description: string;
  weaknesses?: PhilosophicalAspect[];
  strengths?: PhilosophicalAspect[];
}

export type PhilosophicalAspect = 'body' | 'mind' | 'heart';
export type CombatAction = 'attack' | 'defend' | 'special' | 'skill';

export interface CombatChoice {
  aspect: PhilosophicalAspect;
  action: CombatAction;
  selectedSkill?: string;
}

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
  log: CombatLogEntry[];
}

export interface CombatLogEntry {
  id: string;
  timestamp: number;
  actor: string;
  action: string;
  target: string;
  damage?: number;
  effect?: string;
}

export interface GameState {
  character: Character;
  currentLocation: string;
  locations: Record<string, GameLocation>;
  questLog: Quest[];
  gamePhase: 'childhood' | 'labyrinth' | 'adulthood';
  story: {
    visitedFriend: boolean;
    builtBoat: boolean;
    gatheredWood: boolean;
    gatheredIronOre: boolean;
    visitedMajorCity: boolean;
    heardAdvisorRumor: boolean;
    visitedIslands: string[];
    returnedHome: boolean;
    decidedToBeAdvisor: boolean;
  };
  combat: CombatState | null;
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
export type GameScreen = 'exploration' | 'combat' | 'character' | 'inventory' | 'dialogue' | 'map' | 'skills';