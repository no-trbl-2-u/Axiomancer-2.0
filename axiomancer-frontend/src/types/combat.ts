/**
 * New Combat System Types
 * Based on new-combat-mechanics.md
 * 
 * This is the ACTIVE combat system used in CombatModal.tsx
 * Simpler rock-paper-scissors style: Heart > Body > Mind > Heart
 * 
 * Note: An older, more complex combat system exists in game.ts and combatState.ts
 * with buff/debuff mechanics. Both systems currently coexist.
 */

import { Character, Enemy } from './game';

// Combat Type System (Heart > Body > Mind > Heart)
export type CombatType = 'heart' | 'body' | 'mind';

// Combat Action System
export type CombatActionType = 'attack' | 'defend';

// Combat advantage result
export type AdvantageType = 'player' | 'enemy' | 'none';

// Combat phase
export type CombatPhase = 'choosing_type' | 'choosing_aspect' | 'choosing_action' | 'resolving' | 'ended';

/**
 * Player's combat decision for a round
 */
export interface CombatDecision {
  type: CombatType;
  action: CombatActionType;
}

/**
 * Detailed battle log entry for a single round
 */
export interface BattleLogEntry {
  round: number;
  playerDecision: CombatDecision;
  enemyDecision: CombatDecision;
  advantage: AdvantageType;
  playerRoll?: number;
  playerRollDetails?: string; // e.g., "2d20 (12, 18) - took higher"
  enemyRoll?: number;
  enemyRollDetails?: string;
  damageToPlayer: number;
  damageToEnemy: number;
  playerHPAfter: number;
  enemyHPAfter: number;
  result: string; // Human-readable result description
  timestamp: number;
}

/**
 * New Combat State
 * Simplified based on new mechanics
 */
export interface qNewCombatState {
  active: boolean;
  phase: CombatPhase;
  round: number;
  friendshipCounter: number; // 0-3, triggers "New Friends" modal at 3

  // Combatants
  player: Character;
  enemy: Enemy;

  // Current round choices
  playerChoice: Partial<CombatDecision>;
  enemyChoice: Partial<CombatDecision>;

  // Battle history
  battleLog: BattleLogEntry[];
}

/**
 * Combat resolution result for a single round
 */
export interface CombatResolutionResult {
  advantage: AdvantageType;
  playerRoll?: number;
  playerRollDetails?: string;
  enemyRoll?: number;
  enemyRollDetails?: string;
  damageToPlayer: number;
  damageToEnemy: number;
  result: string;
  friendshipIncrement: boolean; // True if both defended
}
