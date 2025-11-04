/**
 * Buff/Debuff System Types
 * 
 * ISOLATED MODULE - Only import this in buff-specific utility files
 * Do NOT import or reference these types in core game types (Character, Enemy, etc.)
 */

/**
 * Status effect names used in combat
 */
export type StatusEffectName = string;

/**
 * Effect modifiers for buffs and debuffs
 */
export interface BuffDebuffEffect {
  /** Flat stat modifiers */
  statModifiers?: {
    physicalAttack?: number;
    physicalDefense?: number;
    mindAttack?: number;
    mindDefense?: number;
    ailmentAttack?: number;
    ailmentDefense?: number;
  };
  /** Percentage-based stat modifiers */
  percentageModifiers?: {
    physicalAttack?: number;
    physicalDefense?: number;
    mindAttack?: number;
    mindDefense?: number;
    ailmentAttack?: number;
    ailmentDefense?: number;
  };
  /** Special effect flags and values */
  specialEffects?: {
    fixedDamageNextTurn?: number;
    damageOnAttack?: number;
    reflection?: number;
    foresight?: boolean;
    immuneToNextAttack?: boolean;
    chanceToFadePerTurn?: number;
  };
}

/**
 * A single buff or debuff effect applied to a combatant
 */
export interface BuffDebuff {
  id: string;
  name: StatusEffectName;
  description: string;
  type: 'buff' | 'debuff';
  effect: BuffDebuffEffect;
  duration: number;
  remainingTurns: number;
  stackable: boolean;
  currentStacks: number;
  maxStacks?: number;
  icon: string;
}

/**
 * Collection of buffs and debuffs for a combatant
 */
export interface CombatantBuffs {
  buffs: BuffDebuff[];
  debuffs: BuffDebuff[];
}
