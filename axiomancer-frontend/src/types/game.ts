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

export interface Character {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  portrait?: CharacterPortrait;
  baseStats: BaseStats;
  derivedStats: DerivedStats;
  availableStatPoints: number;
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
    stats?: Partial<Character['baseStats']>;
    philosophicalAlignment?: Partial<PhilosophicalStance>;
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
  nodes?: GameNode[];
  isNodeMap?: boolean;
}

export interface GameNode {
  id: string;
  name: string;
  description: string;
  type: 'start' | 'resource' | 'encounter' | 'person' | 'event' | 'boss' | 'exit' | 'explore';
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

export interface DialogueOption {
  id: string;
  text: string;
  isCorrect: boolean; // true for the "real" answer that gives rewards
  response: string;
  energyReward?: number;
  itemReward?: Item;
  storyProgress?: Record<string, boolean>;
}

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

export interface NodeChoice {
  id: string;
  text: string;
  cost?: NodeCost;
  outcome?: ChoiceOutcome;
  philosophicalAlignment?: Partial<PhilosophicalStance>;
}

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

export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  baseStats: BaseStats;
  derivedStats: DerivedStats;
  skills: Skill[];
  loot: Item[];
  philosophicalAlignment?: PhilosophicalStance;
  type: 'fallacy' | 'sophist' | 'skeptic' | 'nihilist' | 'beast' | 'guardian';
  enemyTier?: 'normal' | 'elite' | 'boss';
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
  playerBuffs: CombatantBuffs;
  enemyBuffs: CombatantBuffs;
  agreeToDisagreeCounter: number;
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

// Comprehensive list of all possible status effects
export type StatusEffectName =
  | 'Acknowledgment' | 'Active Agency' | 'Analysis Paralysis' | 'Appeasement' | 'Articulate Expression'
  | 'Attribution Bias' | 'Authentic Discourse' | 'Authentic Expression' | 'Bad Faith' | 'Balanced Perspective'
  | 'Balanced Valuation' | 'Blind Devotion' | 'Blood Obligation' | 'Boundary Violation' | 'Broader Understanding'
  | 'Card Playing' | 'Change Resistance' | 'Circular Thinking' | 'Civility' | 'Clarity' | 'Closure-Seeking'
  | 'Collective Guilt' | 'Complete Awareness' | 'Completion Obsession' | 'Complexity Mastery' | 'Conclusion Manipulation'
  | 'Confirmation Blindness' | 'Connection Confusion' | 'Consequence Fear' | 'Consequence Paralysis' | 'Contextual Understanding'
  | 'Corruption Temptation' | 'Cost Obsession' | 'Counter-Argument' | 'Courage' | 'Creative Thinking'
  | 'Criteria Shifting' | 'Decisive Action' | 'Definition Confusion' | 'Democratic Discourse' | 'Deniability Shield'
  | 'Deserved Suffering' | 'Disciplinary Blindness' | 'Discussion Suppression' | 'Divine Judgment' | 'Dogmatic Certainty'
  | 'Ego Damage' | 'Emotional Foresight' | 'Emotional Guilt' | 'Emotional Intelligence' | 'Emotional Override'
  | 'End-Times Despair' | 'Enforced Muteness' | 'Enhanced Counter-Argument' | 'Enhanced Emotional Foresight' | 'Enhanced Physical Defense'
  | 'Enlightenment' | 'Esotericism' | 'Exception Justification' | 'False Choice' | 'False Equivalence'
  | 'False Expertise' | 'False Heroism' | 'False Relatability' | 'Fear' | 'Fixed Identity' | 'Foresight'
  | 'Free Speech Absolutism' | 'Genuine Achievement' | 'Genuine Expertise' | 'Group Determinism' | 'Growth Mindset'
  | 'Guilt Amplification' | 'Healthy Spirituality' | 'Helplessness' | 'Hero Destruction' | 'Holistic Understanding'
  | 'Humility' | 'Identity Destruction' | 'Identity Erosion' | 'Ignorance Empowerment' | 'Ignorance Shield'
  | 'Imagination' | 'Implication' | 'Incomplete Understanding' | 'Incredulity' | 'Independence' | 'Inertia'
  | 'Inescapable Fate' | 'Innovation' | 'Insight into Weaknesses' | 'Integrity' | 'Intellectual Exclusion'
  | 'Intellectual Humiliation' | 'Intellectual Sovereignty' | 'Investigative Mastery' | 'Isolation' | 'Language Policing'
  | 'Lie Acceptance' | 'Linear Thinking' | 'Linguistic Purism' | 'Logical Clarity' | 'Logic Immunity'
  | 'Magical Belief' | 'Magical Realism' | 'Maturity Denial' | 'Measurement Obsession' | 'Memory Manipulation'
  | 'Mental Advantage' | 'Mental Autonomy' | 'Mental Fortitude' | 'Mental Privacy' | 'Middle Exclusion'
  | 'Mind Control' | 'Momentum' | 'Moral Consistency' | 'Moral Exception' | 'Moral High Ground'
  | 'Moral Perfection' | 'Moral Suppression' | 'Mortification' | 'Motive Corruption' | 'Mystical Confusion'
  | 'Natural Order' | 'Novelty Denial' | 'Numerical Confusion' | 'Olfactory Rejection' | 'Othering'
  | 'Perfect Accountability' | 'Perfect Autonomy' | 'Perfect Balance' | 'Perfect Clarity' | 'Perfect Communication'
  | 'Perfect Decision Making' | 'Perfect Discourse' | 'Perfect Distinction' | 'Perfect Emotional Mastery' | 'Perfect Empathy'
  | 'Perfect Memory' | 'Perfect Nuance' | 'Perfect Objectivity' | 'Perfect Realism' | 'Perfect Self-Trust'
  | 'Perfect Understanding' | 'Personal Doubt' | 'Personalization' | 'Physical Reflection' | 'Practical Wisdom'
  | 'Probabilistic Mastery' | 'Probability Denial' | 'Profanity Passion' | 'Real Excellence' | 'Reality Doubt'
  | 'Recognition Denial' | 'Resistance to Manipulation' | 'Responsibility Avoidance' | 'Selective Blindness' | 'Self-Condemnation'
  | 'Selfish Preservation' | 'Self-Loathing' | 'Sentiment Manipulation' | 'Simplicity Demand' | 'Spiritual Wholeness'
  | 'Stability' | 'Statistical Understanding' | 'Story Preference' | 'Strategic Advantage' | 'Strategic Retreat'
  | 'Strength from Pain' | 'Superiority Damage' | 'Thought Assumption' | 'Thought Sovereignty' | 'Total Recall'
  | 'Toxic Positivity' | 'Tradition Binding' | 'True Confidence' | 'True Enlightenment' | 'True Independence'
  | 'True Moral Understanding' | 'Trust' | 'Truth Dilution' | 'Universal Condemnation' | 'Universal Recognition'
  | 'Universal Understanding' | 'Unrecognized Achievement';

export interface BuffDebuff {
  id: string;
  name: StatusEffectName;
  description: string;
  type: 'buff' | 'debuff';
  effect: BuffDebuffEffect;
  duration: number;
  remainingTurns: number;
  stackable: boolean;
  maxStacks?: number;
  currentStacks: number;
  icon: string;
}

export interface BuffDebuffEffect {
  statModifiers?: {
    physicalAttack?: number;
    physicalDefense?: number;
    mindAttack?: number;
    mindDefense?: number;
    ailmentAttack?: number;
    ailmentDefense?: number;
    accuracy?: number;
    evasion?: number;
    body?: number;
    mind?: number;
    heart?: number;
  };
  percentageModifiers?: {
    physicalAttack?: number;
    physicalDefense?: number;
    mindAttack?: number;
    mindDefense?: number;
    ailmentAttack?: number;
    ailmentDefense?: number;
    accuracy?: number;
    evasion?: number;
    body?: number;
    mind?: number;
    heart?: number;
  };
  specialEffects?: {
    reflection?: number; // Reflects damage back to attacker
    fixedDamageNextTurn?: number; // Mind attack follow-up damage
    damageOnAttack?: number; // Heart attack debuff damage
    skipTurn?: boolean; // Fear, confusion effects
    healPrevention?: boolean;
    immuneToNextAttack?: boolean;
  };
}

export interface CombatantBuffs {
  buffs: BuffDebuff[];
  debuffs: BuffDebuff[];
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
    visitedFriend: boolean;
    builtBoat: boolean;
    gatheredWood: boolean;
    gatheredIronOre: boolean;
    visitedMajorCity: boolean;
    heardAdvisorRumor: boolean;
    visitedIslands: string[];
    returnedHome: boolean;
    decidedToBeAdvisor: boolean;
    talkedToGuardian: boolean;
    startedFishing: boolean;
    hasCart: boolean;
    hasHorse: boolean;
    hasFish: number;
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