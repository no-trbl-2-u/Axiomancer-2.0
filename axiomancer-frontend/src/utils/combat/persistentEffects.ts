import { Character } from '../../types/game';
import { BuffDebuff, CombatantBuffs } from '../../types/buffs';
import { calculateModifiedStats } from './buffDebuffEngine';

/**
 * Persistent Effects Manager
 * Handles buff/debuff effects that persist outside of combat
 * 
 * Effects decrease duration on:
 * - Any non-combat game event (gathering, dialogue, exploration)
 * - Rest events clear ALL effects (positive and negative)
 */

/**
 * Reduce persistent effect durations by 1 for non-combat events
 */
export function processEventEffectReduction(character: Character): Character {
  if (!character.persistentEffects) {
    return character;
  }

  const updatedBuffs = character.persistentEffects.buffs
    .map(buff => ({ ...buff, remainingTurns: buff.remainingTurns - 1 }))
    .filter(buff => buff.remainingTurns > 0);

  const updatedDebuffs = character.persistentEffects.debuffs
    .map(debuff => ({ ...debuff, remainingTurns: debuff.remainingTurns - 1 }))
    .filter(debuff => debuff.remainingTurns > 0);

  return {
    ...character,
    persistentEffects: {
      buffs: updatedBuffs,
      debuffs: updatedDebuffs,
    },
  };
}

/**
 * Clear all persistent effects (for Rest events)
 */
export function clearAllPersistentEffects(character: Character): Character {
  return {
    ...character,
    persistentEffects: {
      buffs: [],
      debuffs: [],
    },
  };
}

/**
 * Add persistent effects from combat
 */
export function addPersistentEffects(
  character: Character,
  newEffects: CombatantBuffs
): Character {
  const existingEffects = character.persistentEffects || { buffs: [], debuffs: [] };

  return {
    ...character,
    persistentEffects: {
      buffs: [...existingEffects.buffs, ...newEffects.buffs],
      debuffs: [...existingEffects.debuffs, ...newEffects.debuffs],
    },
  };
}

/**
 * Get current persistent effects for display
 */
export function getPersistentEffects(character: Character): CombatantBuffs {
  return character.persistentEffects || { buffs: [], debuffs: [] };
}

/**
 * Check if character has any active persistent effects
 */
export function hasActivePersistentEffects(character: Character): boolean {
  const effects = character.persistentEffects;
  return !!(effects && (effects.buffs.length > 0 || effects.debuffs.length > 0));
}

/**
 * Get summary of persistent effects for UI display
 */
export function getPersistentEffectsSummary(character: Character): {
  totalBuffs: number;
  totalDebuffs: number;
  criticalDebuffs: BuffDebuff[];
  beneficialBuffs: BuffDebuff[];
} {
  const effects = character.persistentEffects || { buffs: [], debuffs: [] };

  // Identify critical debuffs (low health, major stat penalties)
  const criticalDebuffs = effects.debuffs.filter(debuff =>
    debuff.effect.percentageModifiers &&
    Object.values(debuff.effect.percentageModifiers).some(mod => mod && mod < -25)
  );

  // Identify beneficial buffs (major stat bonuses)
  const beneficialBuffs = effects.buffs.filter(buff =>
    buff.effect.percentageModifiers &&
    Object.values(buff.effect.percentageModifiers).some(mod => mod && mod > 25)
  );

  return {
    totalBuffs: effects.buffs.length,
    totalDebuffs: effects.debuffs.length,
    criticalDebuffs,
    beneficialBuffs,
  };
}

/**
 * Calculate modified character stats including persistent effects
 */
export function calculateCharacterStatsWithPersistentEffects(character: Character): Character {
  if (!character.persistentEffects ||
    (character.persistentEffects.buffs.length === 0 && character.persistentEffects.debuffs.length === 0)) {
    return character;
  }

  const modifiedDerivedStats = calculateModifiedStats(character.derivedStats, character.persistentEffects);

  return {
    ...character,
    derivedStats: modifiedDerivedStats,
  };
}
