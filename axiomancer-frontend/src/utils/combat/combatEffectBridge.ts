import { BuffDebuff } from '../types/buffs';
import {
  createDogmaticCertaintyDebuff,
  createLogicImmunityBuff,
  createMindAttackBuff,
  createailmentAttackDebuff,
  createSelfLoathingDebuff,
  createConfirmationBlindnessDebuff,
  createEmotionalOverrideDebuff,
  createBlindDevotionDebuff,
  createEgoDamageDebuff,
  createAnalysisParalysisDebuff,
  createIntellectualHumiliationDebuff,
  createMoralSuppressionDebuff,
  createRealityDoubtDebuff,
  createLogicalClarityBuff,
  createBadFaithDebuff,
  createMotiveCorruptionDebuff
} from './statusEffects';

/**
 * Bridge between fallacy combatEffects and statusEffects.ts creators
 * Converts string effect descriptions into actual BuffDebuff objects
 */

export interface CombatEffectResult {
  buffs: BuffDebuff[];
  debuffs: BuffDebuff[];
  effects: string[];
}

/**
 * Parse combat effect string and create appropriate status effects
 */
export function createStatusEffectsFromCombatEffect(
  effectDescription: string,
  target: 'self' | 'opponent',
  hasAdvantage: boolean = false,
  _isDefended: boolean = false
): CombatEffectResult {
  const result: CombatEffectResult = {
    buffs: [],
    debuffs: [],
    effects: [effectDescription]
  };

  const lowercaseEffect = effectDescription.toLowerCase();

  // Dogmatic Certainty effects
  if (lowercaseEffect.includes('dogmatic certainty')) {
    const duration = hasAdvantage ? 4 : 3;
    const effect = createDogmaticCertaintyDebuff(duration);
    if (target === 'opponent') {
      result.debuffs.push(effect);
    } else {
      result.buffs.push(effect);
    }
  }

  // Logic Immunity effects
  if (lowercaseEffect.includes('logic immunity')) {
    const duration = hasAdvantage ? 5 : 3;
    const effect = createLogicImmunityBuff(duration);
    if (target === 'self') {
      result.buffs.push(effect);
    }
  }

  // Mind Attack follow-up damage
  if (lowercaseEffect.includes('follow-up damage') || lowercaseEffect.includes('mind attack')) {
    const damage = hasAdvantage ? 25 : 15;
    const effect = createMindAttackBuff(damage);
    if (target === 'self') {
      result.buffs.push(effect);
    }
  }

  // Heart Attack guilt effects
  if (lowercaseEffect.includes('guilt') || lowercaseEffect.includes('emotional guilt')) {
    const damage = hasAdvantage ? 12 : 8;
    const duration = 3;
    const effect = createailmentAttackDebuff(damage, duration);
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Self-loathing effects
  if (lowercaseEffect.includes('self-loathing') || lowercaseEffect.includes('self-doubt')) {
    const intensity = hasAdvantage ? 20 : 15;
    const effect = createSelfLoathingDebuff(intensity);
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Existential dread effects
  if (lowercaseEffect.includes('existential') || lowercaseEffect.includes('meaninglessness')) {
    const effect = createEgoDamageDebuff();
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Cognitive bias effects
  if (lowercaseEffect.includes('cognitive bias') || lowercaseEffect.includes('confirmation bias')) {
    const effect = createConfirmationBlindnessDebuff();
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Emotional manipulation effects
  if (lowercaseEffect.includes('emotional manipulation') || lowercaseEffect.includes('appeal to emotion')) {
    const effect = createEmotionalOverrideDebuff();
    if (target === 'self') {
      result.buffs.push(effect);
    }
  }

  // Nihilistic void effects
  if (lowercaseEffect.includes('nihilistic') || lowercaseEffect.includes('meaningless')) {
    const effect = createBlindDevotionDebuff();
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Analysis paralysis effects
  if (lowercaseEffect.includes('paralysis') || lowercaseEffect.includes('overthinking')) {
    const effect = createAnalysisParalysisDebuff();
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Intellectual superiority effects
  if (lowercaseEffect.includes('intellectual superiority') || lowercaseEffect.includes('logical dominance')) {
    const effect = createIntellectualHumiliationDebuff();
    if (target === 'self') {
      result.buffs.push(effect);
    }
  }

  // Moral relativism effects
  if (lowercaseEffect.includes('moral relativism') || lowercaseEffect.includes('ethical confusion')) {
    const effect = createMoralSuppressionDebuff();
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Gaslighting effects
  if (lowercaseEffect.includes('gaslighting') || lowercaseEffect.includes('reality distortion')) {
    const effect = createRealityDoubtDebuff();
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  // Logical fallacy empowerment
  if (lowercaseEffect.includes('fallacy') && lowercaseEffect.includes('buff')) {
    const effect = createLogicalClarityBuff();
    if (target === 'self') {
      result.buffs.push(effect);
    }
  }

  // Sophistry effects
  if (lowercaseEffect.includes('sophistry') || lowercaseEffect.includes('rhetorical manipulation')) {
    const effect = createBadFaithDebuff();
    if (target === 'self') {
      result.buffs.push(effect);
    }
  }

  // Knowledge corruption effects
  if (lowercaseEffect.includes('knowledge corruption') || lowercaseEffect.includes('corrupted understanding')) {
    const effect = createMotiveCorruptionDebuff();
    if (target === 'opponent') {
      result.debuffs.push(effect);
    }
  }

  return result;
}

/**
 * Process fallacy combatEffects and determine appropriate status effects
 */
export function processFallacyCombatEffects(
  fallacyCombatEffects: any,
  hasAdvantage: boolean,
  isDefended: boolean,
  isCounterAttack: boolean = false
): CombatEffectResult {
  let effectToUse: string;

  // Determine which effect to apply based on combat conditions
  if (isDefended && hasAdvantage && fallacyCombatEffects.defendedWithAdvantage) {
    effectToUse = fallacyCombatEffects.defendedWithAdvantage;
  } else if (isDefended && !hasAdvantage && fallacyCombatEffects.defendedAgainstAdvantage) {
    effectToUse = fallacyCombatEffects.defendedAgainstAdvantage;
  } else if (isDefended && fallacyCombatEffects.baseDefendedEffect) {
    effectToUse = fallacyCombatEffects.baseDefendedEffect;
  } else if (hasAdvantage && fallacyCombatEffects.advantageEffect) {
    effectToUse = fallacyCombatEffects.advantageEffect;
  } else {
    effectToUse = fallacyCombatEffects.baseEffect || "No effect";
  }

  // Determine target based on effect context
  const target = isCounterAttack ? 'self' : 'opponent';

  return createStatusEffectsFromCombatEffect(effectToUse, target, hasAdvantage, isDefended);
}

/**
 * Calculate the chance for a status effect to be applied
 * Formula: ailmentAttack > ailmentDefense for application
 */
export function calculateStatusEffectChance(
  attackerAilmentAttack: number,
  defenderAilmentDefense: number,
  isHeartDefense: boolean = false
): number {
  // Apply Heart defense bonus (2x ailmentDefense)
  const effectiveDefense = isHeartDefense ? defenderAilmentDefense * 2 : defenderAilmentDefense;

  // Calculate success chance based on attack vs defense ratio
  if (attackerAilmentAttack <= effectiveDefense) {
    return 0; // No chance if attack doesn't exceed defense
  }

  const difference = attackerAilmentAttack - effectiveDefense;
  const baseChance = Math.min(0.8, difference / effectiveDefense); // Cap at 80% chance

  return Math.max(0.1, baseChance); // Minimum 10% chance if attack > defense
}

/**
 * Filter status effects based on application chance
 */
export function filterStatusEffectsByChance(
  effects: CombatEffectResult,
  attackerAilmentAttack: number,
  defenderAilmentDefense: number,
  isHeartDefense: boolean = false
): CombatEffectResult {
  const chance = calculateStatusEffectChance(attackerAilmentAttack, defenderAilmentDefense, isHeartDefense);

  // Always apply buffs to self
  const successfulBuffs = effects.buffs;

  // Apply chance to debuffs on opponent
  const successfulDebuffs = effects.debuffs.filter(() => {
    return Math.random() < chance;
  });

  const resultEffects = [...effects.effects];

  // Add status effect application messages
  if (successfulDebuffs.length > 0) {
    resultEffects.push(`Status effects applied! (${Math.round(chance * 100)}% chance)`);
  } else if (effects.debuffs.length > 0) {
    resultEffects.push(`Status effects resisted! (${Math.round(chance * 100)}% chance failed)`);
  }

  return {
    buffs: successfulBuffs,
    debuffs: successfulDebuffs,
    effects: resultEffects
  };
}

/**
 * Apply status effects to combatant buffs/debuffs
 */
export function applyStatusEffectsToCombatant(
  existingBuffs: { buffs: BuffDebuff[], debuffs: BuffDebuff[] },
  newEffects: CombatEffectResult
): { buffs: BuffDebuff[], debuffs: BuffDebuff[] } {
  return {
    buffs: [...existingBuffs.buffs, ...newEffects.buffs],
    debuffs: [...existingBuffs.debuffs, ...newEffects.debuffs]
  };
}