import { Character, Enemy, PhilosophicalAspect, CombatAction } from './game';

/**
 * Enhanced Combat State System
 * Designed for turn-based philosophical combat with persistent effects
 * 
 * Note: This is an alternate, more complex combat system with buff/debuff mechanics.
 * The simpler "newCombat.ts" system is currently used in the UI (CombatModal.tsx).
 * This system is used by combatStateManager.ts but not the main game flow.
 * 
 * Consider consolidating these systems in the future.
 * 
 * NOTE: This file should NOT import buff types. If buff functionality is needed,
 * it should be handled in the buff-specific utility files that can import from types/buffs.ts
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
  modifiedStats?: any; // Calculated stats including any effects
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
  type: 'damage' | 'status_effect' | 'turn_end';
  target: 'player' | 'enemy';
  description: string;
  value?: number;
  delay: number; // Milliseconds to wait before this step
}

export interface TurnResolution {
  steps: CombatResolutionStep[];
  battleLogEntry: BattleLogEntry;
  combatEnded: boolean;
  winner?: 'player' | 'enemy' | 'agree_to_disagree';
}
