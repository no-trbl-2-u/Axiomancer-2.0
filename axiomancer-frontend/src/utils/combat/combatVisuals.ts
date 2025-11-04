import { BuffDebuff, CombatantBuffs } from '../../types/buffs';

/**
 * Combat Visual System - UI-agnostic helpers for displaying combat status effects
 * Following Combat.md specifications for visual tracking and effects
 */

export interface VisualBuffDebuff {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'buff' | 'debuff';
  remainingTurns: number;
  currentStacks: number;
  borderColor: 'green' | 'red';
}

/**
 * Convert buff/debuff data to visual representation
 */
export function formatBuffDebuffForDisplay(effect: BuffDebuff): VisualBuffDebuff {
  return {
    id: effect.id,
    name: effect.name,
    description: effect.description,
    icon: effect.icon,
    type: effect.type,
    remainingTurns: effect.remainingTurns,
    currentStacks: effect.currentStacks,
    borderColor: effect.type === 'buff' ? 'green' : 'red'
  };
}

/**
 * Get all visual effects for a combatant
 */
export function getCombatantVisualEffects(combatantBuffs: CombatantBuffs): VisualBuffDebuff[] {
  const visualEffects: VisualBuffDebuff[] = [];

  // Add buffs (green border)
  combatantBuffs.buffs.forEach(buff => {
    visualEffects.push(formatBuffDebuffForDisplay(buff));
  });

  // Add debuffs (red border)
  combatantBuffs.debuffs.forEach(debuff => {
    visualEffects.push(formatBuffDebuffForDisplay(debuff));
  });

  // Sort by type (buffs first, then debuffs) and remaining turns
  return visualEffects.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'buff' ? -1 : 1;
    }
    return b.remainingTurns - a.remainingTurns;
  });
}

/**
 * Get combat state visual summary for UI display
 */
export function getCombatVisualState(
  playerBuffs: CombatantBuffs,
  enemyBuffs: CombatantBuffs,
  playerName: string = 'Player',
  enemyName: string = 'Enemy'
): {
  player: {
    name: string;
    effects: VisualBuffDebuff[];
    totalBuffs: number;
    totalDebuffs: number;
  };
  enemy: {
    name: string;
    effects: VisualBuffDebuff[];
    totalBuffs: number;
    totalDebuffs: number;
  };
} {
  const playerEffects = getCombatantVisualEffects(playerBuffs);
  const enemyEffects = getCombatantVisualEffects(enemyBuffs);

  return {
    player: {
      name: playerName,
      effects: playerEffects,
      totalBuffs: playerBuffs.buffs.length,
      totalDebuffs: playerBuffs.debuffs.length
    },
    enemy: {
      name: enemyName,
      effects: enemyEffects,
      totalBuffs: enemyBuffs.buffs.length,
      totalDebuffs: enemyBuffs.debuffs.length
    }
  };
}

/**
 * Generate tooltip text for a buff/debuff effect
 */
export function getEffectTooltip(effect: VisualBuffDebuff): string {
  const baseText = `${effect.name}: ${effect.description}`;
  const turnsText = effect.remainingTurns > 1 ?
    `\nDuration: ${effect.remainingTurns} turns remaining` :
    '\nDuration: Last turn';

  const stacksText = effect.currentStacks > 1 ?
    `\nStacks: ${effect.currentStacks}` : '';

  return baseText + turnsText + stacksText;
}

/**
 * Get simplified status for quick combat readout
 */
export function getCombatStatusSummary(
  playerBuffs: CombatantBuffs,
  enemyBuffs: CombatantBuffs
): {
  playerStatus: string[];
  enemyStatus: string[];
} {
  const playerStatus: string[] = [];
  const enemyStatus: string[] = [];

  // Player status
  if (playerBuffs.buffs.length > 0) {
    playerStatus.push(`+${playerBuffs.buffs.length} buff${playerBuffs.buffs.length > 1 ? 's' : ''}`);
  }
  if (playerBuffs.debuffs.length > 0) {
    playerStatus.push(`-${playerBuffs.debuffs.length} debuff${playerBuffs.debuffs.length > 1 ? 's' : ''}`);
  }

  // Enemy status
  if (enemyBuffs.buffs.length > 0) {
    enemyStatus.push(`+${enemyBuffs.buffs.length} buff${enemyBuffs.buffs.length > 1 ? 's' : ''}`);
  }
  if (enemyBuffs.debuffs.length > 0) {
    enemyStatus.push(`-${enemyBuffs.debuffs.length} debuff${enemyBuffs.debuffs.length > 1 ? 's' : ''}`);
  }

  return { playerStatus, enemyStatus };
}

/**
 * Check if a combatant has any special visual indicators
 */
export function hasSpecialVisualEffects(combatantBuffs: CombatantBuffs): {
  hasReflection: boolean;
  hasForesight: boolean;
  hasCounterArgument: boolean;
  hasGuilt: boolean;
  hasMindAdvantage: boolean;
} {
  const allEffects = [...combatantBuffs.buffs, ...combatantBuffs.debuffs];

  return {
    hasReflection: allEffects.some(effect => effect.id === 'body_reflection'),
    hasForesight: allEffects.some(effect => effect.id === 'heart_foresight'),
    hasCounterArgument: allEffects.some(effect => effect.id === 'mind_counter_argument'),
    hasGuilt: allEffects.some(effect => effect.id === 'heart_attack_guilt'),
    hasMindAdvantage: allEffects.some(effect => effect.id === 'mind_attack_followup')
  };
}