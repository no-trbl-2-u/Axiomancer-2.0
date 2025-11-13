import { BaseStats, DerivedStats } from '@type/game';
import { EquippedItems } from '@type/equipment';

/**
 * Calculate all derived stats from base Heart/Body/Mind stats
 */
export function calculateDerivedStats(baseStats: BaseStats): DerivedStats {
  const { heart, body, mind } = baseStats;

  return {
    // Body-derived stats
    physicalAttack: body * 3,
    physicalDefense: body * 2,
    constitutionSave: body * 2,

    // Mind-derived stats
    mindAttack: mind * 3,
    mindDefense: mind * 2,
    reflexSave: mind * 2,
    perception: mind * 2,

    // Heart-derived stats
    ailmentAttack: heart * 3,
    ailmentDefense: heart * 2,
    willSave: heart * 2,

    // Shared stats (evasion combines Mind and Heart)
    evasion: (mind * 1) + (heart * 3),
    accuracy: (heart + body + mind) * 5, // +1 per total stat point
    luck: (heart * 5) + (heart + body + mind), // Heart gives major luck, all stats give minor luck
  };
}

/**
 * Calculate max HP from base stats
 * Body gives 20 HP per point, Heart gives 8 HP per point
 */
export function calculateMaxHP(baseStats: BaseStats, baseHP: number = 50): number {
  return baseHP + (baseStats.body * 20) + (baseStats.heart * 8);
}

/**
 * Calculate max MP from base stats
 * Mind gives 15 MP per point, Heart gives 8 MP per point
 */
export function calculateMaxMP(baseStats: BaseStats, baseMP: number = 30): number {
  return baseMP + (baseStats.mind * 15) + (baseStats.heart * 8);
}

/**
 * Create initial base stats for a new character
 */
export function createInitialBaseStats(): BaseStats {
  return {
    heart: 1,
    body: 1,
    mind: 1,
  };
}

/**
 * Calculate total stat points invested beyond the base 3 (1 in each stat)
 */
export function getTotalInvestedPoints(baseStats: BaseStats): number {
  return (baseStats.heart + baseStats.body + baseStats.mind) - 3;
}

/**
 * Validate stat allocation - ensure no stat goes below 1
 */
export function validateStatAllocation(baseStats: BaseStats): boolean {
  return baseStats.heart >= 1 && baseStats.body >= 1 && baseStats.mind >= 1;
}

/**
 * Get available stat points for character creation
 */
export function getCharacterCreationPoints(): number {
  return 5; // Players get 5 additional points beyond the base 1 in each stat
}

/**
 * Calculate stat points gained per level
 */
export function getStatPointsPerLevel(level: number): number {
  // Players get 1 stat point every 2 levels (at levels 2, 4, 6, 8, etc.)
  return Math.floor(level / 2);
}

/**
 * Create a complete character stats object with derived stats
 */
export function createCharacterStats(baseStats: BaseStats) {
  return {
    baseStats,
    derivedStats: calculateDerivedStats(baseStats),
    maxHealth: calculateMaxHP(baseStats),
    maxMana: calculateMaxMP(baseStats),
  };
}

/**
 * Calculate equipment bonuses from all equipped items
 */
export function calculateEquipmentBonuses(equippedItems?: Record<string, any>): BaseStats {
  if (!equippedItems) {
    return { heart: 0, body: 0, mind: 0 };
  }

  const bonuses: BaseStats = { heart: 0, body: 0, mind: 0 };

  Object.values(equippedItems).forEach((item) => {
    if (item && item.stats) {
      bonuses.heart += item.stats.heart || 0;
      bonuses.body += item.stats.body || 0;
      bonuses.mind += item.stats.mind || 0;
    }
  });

  return bonuses;
}

/**
 * Calculate total base stats including equipment bonuses
 */
export function calculateTotalBaseStats(baseStats: BaseStats, equippedItems?: Record<string, any>): BaseStats {
  const equipmentBonuses = calculateEquipmentBonuses(equippedItems);

  return {
    heart: baseStats.heart + equipmentBonuses.heart,
    body: baseStats.body + equipmentBonuses.body,
    mind: baseStats.mind + equipmentBonuses.mind,
  };
}