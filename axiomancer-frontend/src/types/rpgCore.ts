// Core RPG System Types - Blending D&D, Mork Borg, and Philosophy

export interface PhilosophicalAttributes {
  // Core D&D-style abilities but philosophical
  body: number;      // Physical prowess (STR + CON)
  mind: number;      // Intellectual power (INT + WIS)
  heart: number;     // Emotional intelligence (CHA + intuition)

  // Mork Borg-style doom tracking
  corruption: number; // How much you've compromised your ideals (0-100)
  wisdom: number;     // Philosophical understanding (opposes corruption)

  // Philosophy-specific
  conviction: number; // How strongly you hold beliefs (affects spell power)
}

export interface PhilosophicalStances {
  ethics: 'virtue' | 'deontological' | 'consequentialist' | 'existentialist' | 'nihilistic';
  metaphysics: 'materialist' | 'idealist' | 'dualist' | 'pragmatist' | 'absurdist';
  epistemology: 'empiricist' | 'rationalist' | 'skeptical' | 'mystical' | 'relativist';

  // How strongly you hold each stance (0-10)
  ethicsConviction: number;
  metaphysicsConviction: number;
  epistemologyConviction: number;
}

export interface FallacySpell {
  id: string;
  name: string;
  description: string;
  fallacyType: 'formal' | 'informal' | 'cognitive_bias';

  // Requirements to learn/use
  requiredAttribute: 'body' | 'mind' | 'heart';
  requiredLevel: number;
  requiredStance?: keyof PhilosophicalStances;

  // Effects
  damage: number;
  effect: 'confusion' | 'doubt' | 'rage' | 'fear' | 'enlightenment';
  corruptionCost: number; // Using fallacies corrupts you

  // D&D style mechanics
  range: number;
  duration: number;
  savingThrow?: 'body' | 'mind' | 'heart';
}

export interface Virtue {
  id: string;
  name: string;
  description: string;

  // What philosophical stance it supports
  alignedEthics?: PhilosophicalStances['ethics'];

  // Benefits
  attributeBonus: Partial<PhilosophicalAttributes>;
  specialAbility?: string;

  // Requirements
  requiredLevel: number;
  requiredWisdom: number;

  // Mork Borg style: virtues can be lost through corruption
  canBeLost: boolean;
}

export interface DilemmaChoice {
  id: string;
  text: string;
  philosophicalBasis: string; // Which philosophy this represents

  // Consequences
  attributeChanges: Partial<PhilosophicalAttributes>;
  stanceShift?: {
    stance: keyof PhilosophicalStances;
    direction: 'strengthen' | 'weaken' | 'change';
    amount: number;
  };

  // Narrative consequences
  storyFlags: string[];
  relationships?: { npc: string; change: number }[];

  // Long-term effects
  unlocksQuests?: string[];
  blocksQuests?: string[];
}

export interface PhilosophicalDilemma {
  id: string;
  title: string;
  description: string;
  context: string; // The situation

  // The core philosophical question
  question: string;
  philosophicalArea: 'ethics' | 'metaphysics' | 'epistemology' | 'political' | 'existential';

  // Multiple choice responses
  choices: DilemmaChoice[];

  // Requirements to encounter this dilemma
  requiredLevel?: number;
  requiredLocation?: string;
  requiredStoryFlags?: string[];

  // How urgent this dilemma is (Mork Borg influence)
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timeLimit?: number; // Rounds/days to decide
}

export interface RPGCharacter {
  // Basic info
  name: string;
  level: number;
  experience: number;

  // Health system (simplified but meaningful)
  currentHealth: number;
  maxHealth: number;
  mentalStability: number; // Like Mork Borg's mental health

  // Core attributes
  attributes: PhilosophicalAttributes;
  stances: PhilosophicalStances;

  // Abilities
  knownFallacies: FallacySpell[];
  knownVirtues: Virtue[];

  // Progression
  skillPoints: number;
  availableAttributePoints: number;

  // Story tracking
  currentLocation: string;
  completedDilemmas: string[];
  activeQuests: string[];
  storyFlags: string[];
  npcRelationships: Record<string, number>;

  // Mork Borg style doom tracking
  doomClock: number; // Personal doom (0-7, game ends at 7)
  lastCorruptionIncrease?: Date;

  // Equipment (simplified)
  equippedItems: GameItem[];
  inventory: GameItem[];
}

export interface GameItem {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'philosophical_text' | 'artifact' | 'consumable';

  // Stat bonuses
  attributeBonuses?: Partial<PhilosophicalAttributes>;

  // Special properties
  specialEffect?: string;
  philosophicalAlignment?: PhilosophicalStances['ethics'];

  // Value and rarity
  value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'artifact';

  // Can it be lost through corruption? (Mork Borg influence)
  canBeCorrupted: boolean;
}

export interface RPGLocation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;

  // What's available here
  availableDilemmas: string[];
  availableQuests: string[];
  npcs: string[];
  shops?: string[];

  // Travel info
  connectedLocations: string[];
  travelCost: number; // Days to travel
  travelRisks: string[]; // Random encounters

  // Philosophical themes of this location
  primaryTheme: 'ethics' | 'metaphysics' | 'epistemology' | 'political' | 'existential';
  atmosphere: 'peaceful' | 'contemplative' | 'challenging' | 'dangerous' | 'corrupting';

  // Requirements to access
  requiredLevel?: number;
  requiredQuests?: string[];
  requiredStoryFlags?: string[];
}

export interface RPGQuest {
  id: string;
  title: string;
  description: string;

  // Quest details
  objectives: QuestObjective[];
  rewards: QuestReward[];

  // Story integration
  giver: string; // NPC ID
  location: string;
  philosophicalTheme: string;

  // Progress tracking
  isCompleted: boolean;
  isActive: boolean;
  currentObjectiveIndex: number;

  // Requirements and consequences
  requiredLevel?: number;
  requiredStances?: Partial<PhilosophicalStances>;
  unlocks?: string[]; // Other quests, locations, etc.

  // Mork Borg influence: some quests have time limits
  timeLimit?: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'location' | 'dilemma' | 'combat' | 'item' | 'conversation';

  // What needs to be done
  target?: string; // Location ID, item ID, NPC ID, etc.
  requiredChoice?: string; // For dilemma objectives
  quantity?: number; // For collection objectives

  // Progress
  isCompleted: boolean;
  currentProgress?: number;
}

export interface QuestReward {
  type: 'experience' | 'attribute' | 'fallacy' | 'virtue' | 'item' | 'relationship';
  amount?: number;
  itemId?: string;
  attributeType?: keyof PhilosophicalAttributes;
  npcId?: string;
  fallacyId?: string;
  virtueId?: string;
}

export interface RandomEncounter {
  id: string;
  title: string;
  description: string;

  // Where it can happen
  possibleLocations: string[];
  travelOnly: boolean; // Only during travel between locations

  // Probability and requirements
  chance: number; // 0-100
  requiredLevel?: number;
  requiredStoryFlags?: string[];

  // What happens
  choices: EncounterChoice[];

  // Can this encounter happen multiple times?
  repeatable: boolean;
}

export interface EncounterChoice {
  id: string;
  text: string;
  approach: 'body' | 'mind' | 'heart'; // Which attribute to use

  // Difficulty check (D&D style)
  difficultyClass: number;

  // Outcomes
  successOutcome: EncounterOutcome;
  failureOutcome: EncounterOutcome;
}

export interface EncounterOutcome {
  description: string;

  // Mechanical effects
  attributeChanges?: Partial<PhilosophicalAttributes>;
  healthChange?: number;
  experienceGain?: number;
  itemsGained?: string[];
  itemsLost?: string[];

  // Story effects
  storyFlags?: string[];
  relationshipChanges?: { npc: string; change: number }[];

  // Special effects
  learnFallacy?: string;
  learnVirtue?: string;
  corruptionChange?: number;
  doomClockAdvance?: boolean;
}

// Game state management
export interface GameState {
  character: RPGCharacter;
  currentLocation: string;
  gamePhase: 'character_creation' | 'childhood' | 'adolescence' | 'adulthood' | 'sage' | 'ended';

  // World state
  worldCorruption: number; // Global corruption level (Mork Borg style)
  daysPassed: number;
  worldEvents: string[]; // Major events that have happened

  // Available content
  unlockedLocations: string[];
  unlockedFallacies: string[];
  unlockedVirtues: string[];

  // Meta game tracking
  difficulty: 'philosophical' | 'balanced' | 'brutal'; // How harsh the consequences
  permadeathEnabled: boolean; // True Mork Borg style
  autoSaveEnabled: boolean;
}

// Combat system (enhanced philosophical combat)
export interface CombatState {
  isActive: boolean;
  phase: 'aspect_selection' | 'action_selection' | 'resolution' | 'consequences';

  // Participants
  player: CombatParticipant;
  enemy: CombatParticipant;

  // Round tracking
  currentRound: number;
  playerAdvantages: number;
  enemyAdvantages: number;

  // Enhanced with philosophical elements
  philosophicalContext?: string; // Why this combat is happening
  moralChoices?: DilemmaChoice[]; // Choices available during combat
  corruptionRisk: number; // How much corruption this fight might cause

  // Spectators and stakes
  witnesses?: string[]; // NPCs watching
  publicOpinion?: number; // How this affects your reputation
}

export interface CombatParticipant {
  name: string;
  currentHealth: number;
  maxHealth: number;
  mentalStability: number;

  attributes: PhilosophicalAttributes;
  stances?: PhilosophicalStances;

  // Available actions
  availableFallacies: FallacySpell[];
  availableVirtues: Virtue[];

  // Combat state
  selectedAspect?: 'body' | 'mind' | 'heart';
  selectedAction?: CombatAction;
  statusEffects: StatusEffect[];

  // AI behavior (for enemies)
  aiStrategy?: 'aggressive' | 'defensive' | 'philosophical' | 'corrupt';
}

export interface CombatAction {
  type: 'attack' | 'defend' | 'fallacy' | 'virtue' | 'dilemma';
  fallacyId?: string;
  virtueId?: string;
  dilemmaChoiceId?: string;
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;

  // What it affects
  attributeModifiers?: Partial<PhilosophicalAttributes>;
  preventActions?: CombatAction['type'][];

  // Visual
  icon?: string;
  color?: string;
}

// NPC system
export interface RPGNpc {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;

  // Personality
  philosophicalStances: PhilosophicalStances;
  personality: string[];

  // What they offer
  quests: string[];
  dialogue: DialogueTree;
  shop?: ShopInventory;

  // Relationship with player
  initialRelationship: number;
  relationshipDescription: string;

  // Story role
  importance: 'minor' | 'major' | 'critical';
  firstMeetingLocation: string;

  // Can they be corrupted or change?
  canBeCorrupted: boolean;
  corruptionThreshold?: number;
}

export interface DialogueTree {
  rootNode: string;
  nodes: Record<string, DialogueNode>;
}

export interface DialogueNode {
  id: string;
  text: string;
  speaker: 'npc' | 'player';

  // Options for player responses
  choices?: DialogueChoice[];

  // Automatic progression
  nextNode?: string;

  // Conditions
  requiresStoryFlags?: string[];
  requiresRelationship?: { min?: number; max?: number };
  requiresAttributes?: Partial<PhilosophicalAttributes>;

  // Effects of viewing this node
  effects?: DialogueEffects;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNode: string;

  // What this choice represents philosophically
  philosophicalApproach: string;
  stance?: keyof PhilosophicalStances;

  // Requirements to see this choice
  requiredAttribute?: { attribute: keyof PhilosophicalAttributes; minimum: number };
  requiredStance?: { stance: keyof PhilosophicalStances; value: string };
  requiredStoryFlags?: string[];

  // Effects of choosing this
  effects?: DialogueEffects;
}

export interface DialogueEffects {
  relationshipChange?: number;
  attributeChanges?: Partial<PhilosophicalAttributes>;
  storyFlags?: string[];
  corruptionChange?: number;
  experienceGain?: number;
  startsQuest?: string;
  endsQuest?: string;
  learnFallacy?: string;
  learnVirtue?: string;
  itemGained?: string;
}

export interface ShopInventory {
  items: ShopItem[];
  currency: 'gold' | 'wisdom' | 'reputation';
  restockDays?: number;
  restockItems?: string[];
}

export interface ShopItem {
  itemId: string;
  price: number;
  currency: 'gold' | 'wisdom' | 'reputation';
  stock: number;

  // Requirements to buy
  requiredRelationship?: number;
  requiredStoryFlags?: string[];
  requiredLevel?: number;
}

// Utility types for game mechanics
export interface SkillCheck {
  attribute: keyof PhilosophicalAttributes;
  difficultyClass: number;
  modifiers?: { reason: string; bonus: number }[];
  advantage?: boolean; // D&D style advantage
  disadvantage?: boolean;
}

export interface SkillCheckResult {
  success: boolean;
  roll: number;
  total: number;
  difficultyClass: number;
  margin: number; // How much over/under the DC
  criticalSuccess?: boolean;
  criticalFailure?: boolean;
}