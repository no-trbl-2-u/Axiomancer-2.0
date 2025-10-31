/**
 * New Combat Mechanics System
 * Based on new-combat-mechanics.md
 *
 * Rock-Paper-Scissors: Heart > Body > Mind > Heart
 */

import { Character, Enemy } from '../types/game';
import {
  CombatType,
  CombatActionType,
  CombatDecision,
  AdvantageType,
  CombatResolutionResult,
  BattleLogEntry,
  NewCombatState,
} from '../types/newCombat';

/**
 * Determine type advantage
 * Heart > Body > Mind > Heart
 */
export function getTypeAdvantage(
  playerType: CombatType,
  enemyType: CombatType
): AdvantageType {
  if (playerType === enemyType) {
    return 'none';
  }

  // Heart beats Body
  if (playerType === 'heart' && enemyType === 'body') {
    return 'player';
  }
  if (playerType === 'body' && enemyType === 'heart') {
    return 'enemy';
  }

  // Body beats Mind
  if (playerType === 'body' && enemyType === 'mind') {
    return 'player';
  }
  if (playerType === 'mind' && enemyType === 'body') {
    return 'enemy';
  }

  // Mind beats Heart
  if (playerType === 'mind' && enemyType === 'heart') {
    return 'player';
  }
  if (playerType === 'heart' && enemyType === 'mind') {
    return 'enemy';
  }

  return 'none';
}

/**
 * Roll a single d20
 */
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

/**
 * Roll 2d20 and take the higher value (advantage)
 */
export function rollWithAdvantage(): { result: number; rolls: [number, number] } {
  const roll1 = rollD20();
  const roll2 = rollD20();
  return {
    result: Math.max(roll1, roll2),
    rolls: [roll1, roll2],
  };
}

/**
 * Roll 2d20 and take the lower value (disadvantage)
 */
export function rollWithDisadvantage(): { result: number; rolls: [number, number] } {
  const roll1 = rollD20();
  const roll2 = rollD20();
  return {
    result: Math.min(roll1, roll2),
    rolls: [roll1, roll2],
  };
}

/**
 * Get stat value for a combat type
 */
function getStatForType(combatant: Character | Enemy, type: CombatType): number {
  switch (type) {
    case 'body':
      return combatant.baseStats.body;
    case 'mind':
      return combatant.baseStats.mind;
    case 'heart':
      return combatant.baseStats.heart;
  }
}

/**
 * Get defense value for a combat type
 */
function getDefenseForType(combatant: Character | Enemy, type: CombatType): number {
  switch (type) {
    case 'body':
      return combatant.derivedStats.physicalDefense;
    case 'mind':
      return combatant.derivedStats.mindDefense;
    case 'heart':
      return combatant.derivedStats.ailmentDefense; // Will be renamed to heartDefense
  }
}

/**
 * Calculate damage
 * Damage = Attacker's Stat + Roll - Defender's Defense
 * Minimum damage is 1
 */
function calculateDamage(
  attackerStat: number,
  attackRoll: number,
  defenderDefense: number
): number {
  const damage = attackerStat + attackRoll - defenderDefense;
  return Math.max(1, damage);
}

/**
 * Resolve Attack vs Attack scenario
 */
function resolveAttackVsAttack(
  playerDecision: CombatDecision,
  enemyDecision: CombatDecision,
  player: Character,
  enemy: Enemy,
  advantage: AdvantageType
): CombatResolutionResult {
  let playerRoll: number;
  let playerRollDetails: string;
  let enemyRoll: number;
  let enemyRollDetails: string;

  const playerStat = getStatForType(player, playerDecision.type);
  const enemyStat = getStatForType(enemy, enemyDecision.type);
  const playerDefense = getDefenseForType(player, enemyDecision.type);
  const enemyDefense = getDefenseForType(enemy, playerDecision.type);

  // Player rolls based on advantage
  if (advantage === 'player') {
    const rollResult = rollWithAdvantage();
    playerRoll = rollResult.result;
    playerRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) - took higher`;
    enemyRoll = rollD20();
    enemyRollDetails = `1d20`;
  } else if (advantage === 'enemy') {
    playerRoll = rollD20();
    playerRollDetails = `1d20`;
    const rollResult = rollWithAdvantage();
    enemyRoll = rollResult.result;
    enemyRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) - took higher`;
  } else {
    // No advantage - both roll 1d20
    playerRoll = rollD20();
    playerRollDetails = `1d20`;
    enemyRoll = rollD20();
    enemyRollDetails = `1d20`;
  }

  // Calculate damage
  const damageToEnemy = calculateDamage(playerStat, playerRoll, enemyDefense);
  const damageToPlayer = calculateDamage(enemyStat, enemyRoll, playerDefense);

  const result = `Both attacked! Player dealt ${damageToEnemy} damage, Enemy dealt ${damageToPlayer} damage.`;

  return {
    advantage,
    playerRoll,
    playerRollDetails,
    enemyRoll,
    enemyRollDetails,
    damageToPlayer,
    damageToEnemy,
    result,
    friendshipIncrement: false,
  };
}

/**
 * Resolve Attack vs Defense scenario
 */
function resolveAttackVsDefense(
  attackerDecision: CombatDecision,
  defenderDecision: CombatDecision,
  attacker: Character | Enemy,
  defender: Character | Enemy,
  advantage: AdvantageType,
  attackerIsPlayer: boolean
): { attackerRoll: number; attackerRollDetails: string; damage: number; result: string } {
  let attackerRoll: number;
  let attackerRollDetails: string;

  const attackerStat = getStatForType(attacker, attackerDecision.type);
  const defenderDefense = getDefenseForType(defender, attackerDecision.type);

  // Determine roll type based on advantage
  if (advantage === (attackerIsPlayer ? 'player' : 'enemy')) {
    // Attacker has advantage
    const rollResult = rollWithAdvantage();
    attackerRoll = rollResult.result;
    attackerRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) - took higher`;
  } else if (advantage === (attackerIsPlayer ? 'enemy' : 'player')) {
    // Attacker has disadvantage (defender has advantage)
    const rollResult = rollWithDisadvantage();
    attackerRoll = rollResult.result;
    attackerRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) - took lower`;
  } else {
    // Neutral
    attackerRoll = rollD20();
    attackerRollDetails = `1d20`;
  }

  const damage = calculateDamage(attackerStat, attackerRoll, defenderDefense);
  const attackerName = attackerIsPlayer ? 'Player' : 'Enemy';
  const defenderName = attackerIsPlayer ? 'Enemy' : 'Player';
  const result = `${attackerName} attacked while ${defenderName} defended. ${attackerName} dealt ${damage} damage.`;

  return {
    attackerRoll,
    attackerRollDetails,
    damage,
    result,
  };
}

/**
 * Main combat resolution function
 * Handles all scenarios: Attack vs Attack, Attack vs Defense, Defense vs Defense
 */
export function resolveCombatRound(
  playerDecision: CombatDecision,
  enemyDecision: CombatDecision,
  player: Character,
  enemy: Enemy
): CombatResolutionResult {
  const advantage = getTypeAdvantage(playerDecision.type, enemyDecision.type);

  // Scenario 1: Both Attack
  if (playerDecision.action === 'attack' && enemyDecision.action === 'attack') {
    return resolveAttackVsAttack(playerDecision, enemyDecision, player, enemy, advantage);
  }

  // Scenario 2: Both Defend (Friendship Counter)
  if (playerDecision.action === 'defend' && enemyDecision.action === 'defend') {
    return {
      advantage,
      damageToPlayer: 0,
      damageToEnemy: 0,
      result: 'Both defended! No damage dealt. Friendship grows.',
      friendshipIncrement: true,
    };
  }

  // Scenario 3: Player Attacks, Enemy Defends
  if (playerDecision.action === 'attack' && enemyDecision.action === 'defend') {
    const { attackerRoll, attackerRollDetails, damage, result } = resolveAttackVsDefense(
      playerDecision,
      enemyDecision,
      player,
      enemy,
      advantage,
      true
    );
    return {
      advantage,
      playerRoll: attackerRoll,
      playerRollDetails: attackerRollDetails,
      damageToPlayer: 0,
      damageToEnemy: damage,
      result,
      friendshipIncrement: false,
    };
  }

  // Scenario 4: Enemy Attacks, Player Defends
  if (playerDecision.action === 'defend' && enemyDecision.action === 'attack') {
    const { attackerRoll, attackerRollDetails, damage, result } = resolveAttackVsDefense(
      enemyDecision,
      playerDecision,
      enemy,
      player,
      advantage,
      false
    );
    return {
      advantage,
      enemyRoll: attackerRoll,
      enemyRollDetails: attackerRollDetails,
      damageToPlayer: damage,
      damageToEnemy: 0,
      result,
      friendshipIncrement: false,
    };
  }

  // Fallback (should never reach here)
  return {
    advantage: 'none',
    damageToPlayer: 0,
    damageToEnemy: 0,
    result: 'Error: Invalid combat state',
    friendshipIncrement: false,
  };
}

/**
 * Generate random enemy decision
 */
export function generateEnemyDecision(): CombatDecision {
  const types: CombatType[] = ['heart', 'body', 'mind'];
  const actions: CombatActionType[] = ['attack', 'defend'];

  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];

  return {
    type: randomType,
    action: randomAction,
  };
}

/**
 * Create a battle log entry from combat resolution
 */
export function createBattleLogEntry(
  round: number,
  playerDecision: CombatDecision,
  enemyDecision: CombatDecision,
  resolution: CombatResolutionResult,
  playerHPAfter: number,
  enemyHPAfter: number
): BattleLogEntry {
  return {
    round,
    playerDecision,
    enemyDecision,
    advantage: resolution.advantage,
    playerRoll: resolution.playerRoll,
    playerRollDetails: resolution.playerRollDetails,
    enemyRoll: resolution.enemyRoll,
    enemyRollDetails: resolution.enemyRollDetails,
    damageToPlayer: resolution.damageToPlayer,
    damageToEnemy: resolution.damageToEnemy,
    playerHPAfter,
    enemyHPAfter,
    result: resolution.result,
    timestamp: Date.now(),
  };
}

/**
 * Check if combat should end
 * Returns: 'player_win' | 'enemy_win' | 'friendship' | 'continue'
 */
export function checkCombatEnd(
  playerHP: number,
  enemyHP: number,
  friendshipCounter: number
): 'player_win' | 'enemy_win' | 'friendship' | 'continue' {
  if (friendshipCounter >= 3) {
    return 'friendship';
  }
  if (enemyHP <= 0) {
    return 'player_win';
  }
  if (playerHP <= 0) {
    return 'enemy_win';
  }
  return 'continue';
}
