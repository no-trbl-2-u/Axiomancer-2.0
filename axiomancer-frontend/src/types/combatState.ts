import { Character, Enemy, BuffDebuff, PhilosophicalAspect, CombatAction } from './game';

/**
 * Enhanced Combat State System
 * Designed for turn-based philosophical combat with persistent effects
 */

export interface BattleLogEntry {
  decisions: string;
  turn: number;
  log: string;
  result?: string; // Only present when combat ends (XP, items, etc.)
}

export interface CombatantState {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  buffs: BuffDebuff[];
  debuffs: BuffDebuff[];
  modifiedStats?: any; // Calculated stats including buff/debuff effects
}

export interface CombatPhaseData {
  playerChoice?: {
    aspect: PhilosophicalAspect;
    action: CombatAction;
    selectedSkill?: string;
  };
  enemyChoice?: {
    aspect: PhilosophicalAspect;
    action: CombatAction;
    selectedSkill?: string;
  };
  advantage?: 'player' | 'enemy' | 'none';
  playerDamage?: number;
  enemyDamage?: number;
  playerEffects?: string[];
  enemyEffects?: string[];
}

export type CombatPhase = 
  | 'selection'     // Players choosing actions
  | 'resolution'    // Actions being resolved
  | 'turn_end'      // Processing end-of-turn effects
  | 'ended';        // Combat finished

export interface CombatState {
  // Core combatant data
  player: CombatantState;
  enemy: CombatantState;
  
  // Turn management
  turnNumber: number;
  phase: CombatPhase;
  
  // Battle tracking
  battleLog: BattleLogEntry[];
  currentPhaseData: CombatPhaseData;
  
  // Special mechanics
  agreeToDisagreeCounter: number;
  
  // Original character/enemy references for restoration
  originalPlayer: Character;
  originalEnemy: Enemy;
}

export interface CombatResolutionStep {
  type: 'damage' | 'status_effect' | 'buff_application' | 'turn_end';
  target: 'player' | 'enemy';
  description: string;
  value?: number;
  effect?: BuffDebuff;
  delay: number; // Milliseconds to wait before this step
}

export interface TurnResolution {
  steps: CombatResolutionStep[];
  battleLogEntry: BattleLogEntry;
  combatEnded: boolean;
  winner?: 'player' | 'enemy' | 'agree_to_disagree';
}
