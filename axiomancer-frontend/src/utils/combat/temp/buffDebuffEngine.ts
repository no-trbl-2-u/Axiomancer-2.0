import { BuffDebuff, BuffDebuffEffect, CombatantBuffs, StatusEffectName } from '../../../types/buffs';
import { DerivedStats } from '../../../types/game';

// TODO: Update this, but bridge will be similar to combatEffectBridge.ts
/**
 * Buff/Debuff Engine - Handles all combat status effects
 * Following Combat.md specifications for visual tracking and effects
 */

/**
 * Create a new buff or debuff
 */
export function createBuffDebuff(
  id: string,
  name: StatusEffectName,
  description: string,
  type: 'buff' | 'debuff',
  effect: BuffDebuffEffect,
  duration: number,
  icon: string,
  stackable: boolean = false,
  maxStacks?: number
): BuffDebuff {
  const buff: BuffDebuff = {
    id,
    name,
    description,
    type,
    effect,
    duration,
    remainingTurns: duration,
    stackable,
    currentStacks: 1,
    icon,
  };

  if (maxStacks !== undefined) {
    buff.maxStacks = maxStacks;
  }

  return buff;
}

/**
 * Common buffs and debuffs from Combat.md
 */

// Mind Attack buff - deals fixed damage next turn
export const createMindAttackBuff = (damage: number): BuffDebuff =>
  createBuffDebuff(
    'mind_attack_followup',
    'Mental Advantage',
    `Deals ${damage} fixed damage next turn`,
    'buff',
    { specialEffects: { fixedDamageNextTurn: damage } },
    1,
    '🧠'
  );

// Heart Attack debuff - damage when attacking
export const createHeartAttackDebuff = (damage: number, duration: number = 3, chanceToFade?: number): BuffDebuff => {
  const effect: BuffDebuffEffect = {
    specialEffects: {
      damageOnAttack: damage,
    }
  };

  if (chanceToFade !== undefined) {
    effect.specialEffects!.chanceToFadePerTurn = chanceToFade;
  }

  return createBuffDebuff(
    'heart_attack_guilt',
    'Emotional Guilt',
    `Takes ${damage} damage when attacking`,
    'debuff',
    effect,
    duration,
    '💔'
  );
};

// Body Defend reflection buff
export const createReflectionBuff = (damage: number): BuffDebuff =>
  createBuffDebuff(
    'body_reflection',
    'Physical Reflection',
    `Reflects ${damage} damage to attackers`,
    'buff',
    { specialEffects: { reflection: damage } },
    3,
    '🛡️'
  );

// Mind Defend counter-argument buff
export const createCounterArgumentBuff = (mindAttackBonus: number, duration: number): BuffDebuff =>
  createBuffDebuff(
    'mind_counter_argument',
    'Counter-Argument',
    `+${mindAttackBonus} Mind Attack for ${duration} turns`,
    'buff',
    { statModifiers: { mindAttack: mindAttackBonus } },
    duration,
    '🎯'
  );

// Heart Defend foresight buff
export const createForesightBuff = (visionType: string = 'enemy attacks', duration: number = 3): BuffDebuff =>
  createBuffDebuff(
    'heart_foresight',
    'Emotional Foresight',
    `Can see ${visionType}`,
    'buff',
    { specialEffects: { foresight: true } },
    duration,
    '👁️'
  );

// Defense buffs (2x relevant defense, 1/2 weak defense)
export const createBodyDefenseBuff = (): BuffDebuff =>
  createBuffDebuff(
    'body_defense_stance',
    'Enhanced Physical Defense',
    '2x Physical Defense, 0.5x Ailment Defense',
    'buff',
    {
      percentageModifiers: {
        physicalDefense: 100, // 2x = +100%
        ailmentDefense: -50,  // 0.5x = -50%
      },
    },
    1,
    '💪'
  );

export const createMindDefenseBuff = (): BuffDebuff =>
  createBuffDebuff(
    'mind_defense_stance',
    'Mental Fortitude',
    '2x Mind Defense, 0.5x Physical Defense',
    'buff',
    {
      percentageModifiers: {
        mindDefense: 100,     // 2x = +100%
        physicalDefense: -50, // 0.5x = -50%
      },
    },
    1,
    '🧠'
  );

export const createHeartDefenseBuff = (): BuffDebuff =>
  createBuffDebuff(
    'heart_defense_stance',
    'Perfect Emotional Mastery',
    '2x Ailment Defense, 0.5x Mind Defense',
    'buff',
    {
      percentageModifiers: {
        ailmentDefense: 100,  // 2x = +100%
        mindDefense: -50,     // 0.5x = -50%
      },
    },
    1,
    '❤️'
  );

/**
 * Apply a buff or debuff to a combatant
 */
export function applyBuffDebuff(
  targetBuffs: CombatantBuffs,
  buffDebuff: BuffDebuff
): CombatantBuffs {
  const list = buffDebuff.type === 'buff' ? targetBuffs.buffs : targetBuffs.debuffs;

  // Check if effect already exists and is stackable
  const existingIndex = list.findIndex(effect => effect.id === buffDebuff.id);

  if (existingIndex >= 0) {
    const existing = list[existingIndex];
    if (existing && existing.stackable && existing.maxStacks && existing.currentStacks < existing.maxStacks) {
      // Stack the effect
      const updated: BuffDebuff = {
        ...existing,
        currentStacks: existing.currentStacks + 1,
        remainingTurns: buffDebuff.duration, // Refresh duration
      };
      list[existingIndex] = updated;
    } else {
      // Refresh existing effect
      list[existingIndex] = { ...buffDebuff };
    }
  } else {
    // Add new effect
    list.push({ ...buffDebuff });
  }

  return {
    buffs: buffDebuff.type === 'buff' ? [...list] : targetBuffs.buffs,
    debuffs: buffDebuff.type === 'debuff' ? [...list] : targetBuffs.debuffs,
  };
}

/**
 * Process all buffs/debuffs at turn start
 */
export function processBuffsDebuffs(
  combatantBuffs: CombatantBuffs,
  isStartOfTurn: boolean = true,
  actionContext?: {
    isAttacking?: boolean;
    defender?: { derivedStats: { ailmentDefense: number } };
  }
): {
  updatedBuffs: CombatantBuffs;
  turnEffects: string[];
  damageDealt?: number;
} {
  const turnEffects: string[] = [];
  let damageDealt = 0;

  // Process buffs
  const activeBuffs = combatantBuffs.buffs
    .map(buff => {
      // Apply start-of-turn ticking effects
      if (isStartOfTurn) {
        if (buff.effect.specialEffects?.fixedDamageNextTurn) {
          const damage = buff.effect.specialEffects.fixedDamageNextTurn;
          damageDealt += damage;
          turnEffects.push(`${buff.name} deals ${damage} fixed damage!`);
        }
        const updated = { ...buff, remainingTurns: buff.remainingTurns - 1 };
        return updated.remainingTurns > 0 ? updated : null;
      }
      return buff;
    })
    .filter(buff => buff !== null) as BuffDebuff[];

  // Process debuffs
  const activeDebuffs = combatantBuffs.debuffs
    .map(debuff => {
      // Check for chance to fade at start of turn
      if (isStartOfTurn) {
        if (debuff.effect.specialEffects?.chanceToFadePerTurn) {
          const fadeChance = debuff.effect.specialEffects.chanceToFadePerTurn;
          if (Math.random() * 100 < fadeChance) {
            turnEffects.push(`${debuff.name} fades away due to emotional resilience.`);
            return null;
          }
        }
      }

      // Process action-triggered effects (e.g., damage on attack) regardless of start-of-turn
      if (actionContext?.isAttacking && debuff.effect.specialEffects?.damageOnAttack) {
        const damage = debuff.effect.specialEffects.damageOnAttack;
        const defense = actionContext.defender?.derivedStats.ailmentDefense || 0;
        const finalDamage = Math.max(1, damage - defense);
        damageDealt += finalDamage;
        turnEffects.push(`${debuff.name} causes ${finalDamage} guilt damage for attacking!`);
      }

      // Decrease duration only at start of turn
      if (isStartOfTurn) {
        const updated = { ...debuff, remainingTurns: debuff.remainingTurns - 1 };
        return updated.remainingTurns > 0 ? updated : null;
      }
      return debuff;
    })
    .filter(debuff => debuff !== null) as BuffDebuff[];

  const result: {
    updatedBuffs: CombatantBuffs;
    turnEffects: string[];
    damageDealt?: number;
  } = {
    updatedBuffs: {
      buffs: activeBuffs,
      debuffs: activeDebuffs,
    },
    turnEffects,
  };

  if (damageDealt > 0) {
    result.damageDealt = damageDealt;
  }

  return result;
}

/**
 * Calculate modified stats based on active buffs/debuffs
 */
export function calculateModifiedStats(
  baseStats: DerivedStats,
  combatantBuffs: CombatantBuffs
): DerivedStats {
  const modifiedStats = { ...baseStats };

  // Apply all buff/debuff effects
  [...combatantBuffs.buffs, ...combatantBuffs.debuffs].forEach(effect => {
    // Apply flat stat modifiers
    if (effect.effect.statModifiers) {
      Object.entries(effect.effect.statModifiers).forEach(([stat, modifier]) => {
        if (modifier && stat in modifiedStats) {
          (modifiedStats as any)[stat] += modifier * effect.currentStacks;
        }
      });
    }

    // Apply percentage modifiers
    if (effect.effect.percentageModifiers) {
      Object.entries(effect.effect.percentageModifiers).forEach(([stat, modifier]) => {
        if (modifier && stat in modifiedStats) {
          const currentValue = (modifiedStats as any)[stat];
          (modifiedStats as any)[stat] = Math.floor(currentValue * (1 + modifier / 100));
        }
      });
    }
  });

  return modifiedStats;
}

/**
 * Check if combatant has specific special effects
 */
export function hasSpecialEffect(
  combatantBuffs: CombatantBuffs,
  effectType: keyof NonNullable<BuffDebuffEffect['specialEffects']>
): boolean {
  return [...combatantBuffs.buffs, ...combatantBuffs.debuffs].some(
    effect => effect.effect.specialEffects?.[effectType]
  );
}

/**
 * Get special effect value
 */
export function getSpecialEffectValue(
  combatantBuffs: CombatantBuffs,
  effectType: keyof NonNullable<BuffDebuffEffect['specialEffects']>
): number {
  const effects = [...combatantBuffs.buffs, ...combatantBuffs.debuffs]
    .filter(effect => effect.effect.specialEffects?.[effectType])
    .map(effect => effect.effect.specialEffects?.[effectType] as number || 0);

  return effects.reduce((total, value) => total + value, 0);
}

/**
 * Remove specific buff/debuff by ID
 */
export function removeBuffDebuff(
  combatantBuffs: CombatantBuffs,
  id: string
): CombatantBuffs {
  return {
    buffs: combatantBuffs.buffs.filter(buff => buff.id !== id),
    debuffs: combatantBuffs.debuffs.filter(debuff => debuff.id !== id),
  };
}

/**
 * Clear all buffs and debuffs
 */
export function clearAllBuffsDebuffs(): CombatantBuffs {
  return {
    buffs: [],
    debuffs: [],
  };
}