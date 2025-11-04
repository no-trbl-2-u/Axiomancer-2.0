/**
 * New Combat Mechanics System
 * Based on new-combat-mechanics.md
 *
 * Rock-Paper-Scissors: Heart > Body > Mind > Heart
 */

import { Character, Enemy } from '../../types/game';
import {
  CombatType,
  CombatActionType,
  CombatDecision,
  AdvantageType,
  CombatResolutionResult,
  BattleLogEntry,
  NewCombatState
} from '../../types/combat';

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
      return combatant.derivedStats.ailmentDefense;
  }
}

/**
 * Calculate damage with defense modifier
 * Damage = Roll - (Defense * modifier)
 * Minimum damage is 0
 */
function calculateDamage(
  damageRoll: number,
  defenderDefense: number,
  defenseModifier: number = 1.0
): number {
  const modifiedDefense = Math.floor(defenderDefense * defenseModifier);
  const damage = damageRoll - modifiedDefense;
  return Math.max(0, damage);
}

/**
 * Resolve Attack vs Attack scenario
 * NEW MECHANICS: Both roll (with advantage), winner then rolls for damage
 */
function resolveAttackVsAttack(
  playerDecision: CombatDecision,
  enemyDecision: CombatDecision,
  player: Character,
  enemy: Enemy,
  advantage: AdvantageType
): CombatResolutionResult {
  let playerAttackRoll: number;
  let playerAttackRollDetails: string;
  let enemyAttackRoll: number;
  let enemyAttackRollDetails: string;

  const playerStat = getStatForType(player, playerDecision.type);
  const enemyStat = getStatForType(enemy, enemyDecision.type);

  // STEP 1: Both roll attack rolls (with advantage modifiers)
  if (advantage === 'player') {
    const rollResult = rollWithAdvantage();
    playerAttackRoll = rollResult.result + playerStat;
    playerAttackRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took higher (${rollResult.result}) + ${playerStat} stat = ${playerAttackRoll}`;

    const enemyD20 = rollD20();
    enemyAttackRoll = enemyD20 + enemyStat;
    enemyAttackRollDetails = `1d20 (${enemyD20}) + ${enemyStat} stat = ${enemyAttackRoll}`;
  } else if (advantage === 'enemy') {
    const playerD20 = rollD20();
    playerAttackRoll = playerD20 + playerStat;
    playerAttackRollDetails = `1d20 (${playerD20}) + ${playerStat} stat = ${playerAttackRoll}`;

    const rollResult = rollWithAdvantage();
    enemyAttackRoll = rollResult.result + enemyStat;
    enemyAttackRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took higher (${rollResult.result}) + ${enemyStat} stat = ${enemyAttackRoll}`;
  } else {
    // No advantage - both roll 1d20
    const playerD20 = rollD20();
    playerAttackRoll = playerD20 + playerStat;
    playerAttackRollDetails = `1d20 (${playerD20}) + ${playerStat} stat = ${playerAttackRoll}`;

    const enemyD20 = rollD20();
    enemyAttackRoll = enemyD20 + enemyStat;
    enemyAttackRollDetails = `1d20 (${enemyD20}) + ${enemyStat} stat = ${enemyAttackRoll}`;
  }

  // STEP 2: Determine winner, then winner rolls for damage
  let damageToPlayer = 0;
  let damageToEnemy = 0;
  let result = '';

  if (playerAttackRoll > enemyAttackRoll) {
    // Player wins - player rolls for damage
    const enemyDefense = getDefenseForType(enemy, playerDecision.type);
    let damageRoll: number;
    let damageRollDetails: string;

    if (advantage === 'player') {
      const rollResult = rollWithAdvantage();
      damageRoll = rollResult.result + playerStat;
      damageRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took higher (${rollResult.result}) + ${playerStat} stat = ${damageRoll}`;
    } else if (advantage === 'enemy') {
      const rollResult = rollWithDisadvantage();
      damageRoll = rollResult.result + playerStat;
      damageRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took lower (${rollResult.result}) + ${playerStat} stat = ${damageRoll}`;
    } else {
      const d20 = rollD20();
      damageRoll = d20 + playerStat;
      damageRollDetails = `1d20 (${d20}) + ${playerStat} stat = ${damageRoll}`;
    }

    damageToEnemy = calculateDamage(damageRoll, enemyDefense);
    result = `Player won attack roll (${playerAttackRoll} vs ${enemyAttackRoll})! Damage: ${damageRollDetails} vs ${enemyDefense} defense = ${damageToEnemy} damage`;
  } else if (enemyAttackRoll > playerAttackRoll) {
    // Enemy wins - enemy rolls for damage
    const playerDefense = getDefenseForType(player, enemyDecision.type);
    let damageRoll: number;
    let damageRollDetails: string;

    if (advantage === 'enemy') {
      const rollResult = rollWithAdvantage();
      damageRoll = rollResult.result + enemyStat;
      damageRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took higher (${rollResult.result}) + ${enemyStat} stat = ${damageRoll}`;
    } else if (advantage === 'player') {
      const rollResult = rollWithDisadvantage();
      damageRoll = rollResult.result + enemyStat;
      damageRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took lower (${rollResult.result}) + ${enemyStat} stat = ${damageRoll}`;
    } else {
      const d20 = rollD20();
      damageRoll = d20 + enemyStat;
      damageRollDetails = `1d20 (${d20}) + ${enemyStat} stat = ${damageRoll}`;
    }

    damageToPlayer = calculateDamage(damageRoll, playerDefense);
    result = `Enemy won attack roll (${enemyAttackRoll} vs ${playerAttackRoll})! Damage: ${damageRollDetails} vs ${playerDefense} defense = ${damageToPlayer} damage`;
  } else {
    // Tie - no damage
    result = `Both rolled ${playerAttackRoll}! It's a tie - no damage dealt.`;
  }

  return {
    advantage,
    playerRoll: playerAttackRoll,
    playerRollDetails: playerAttackRollDetails,
    enemyRoll: enemyAttackRoll,
    enemyRollDetails: enemyAttackRollDetails,
    damageToPlayer,
    damageToEnemy,
    result,
    friendshipIncrement: false,
  };
}

/**
 * Resolve Attack vs Defense scenario
 * NEW MECHANICS:
 * - Advantage: Attacker rolls 2d20 take higher, defender's defense is HALVED
 * - Neutral (same type): Attacker auto-hits with 1d20, defender's defense is DOUBLED
 * - Disadvantage: Attacker rolls 2d20 take lower, defender's defense is NORMAL
 */
function resolveAttackVsDefense(
  attackerDecision: CombatDecision,
  defenderDecision: CombatDecision,
  attacker: Character | Enemy,
  defender: Character | Enemy,
  advantage: AdvantageType,
  attackerIsPlayer: boolean
): { attackerRoll: number; attackerRollDetails: string; damage: number; result: string } {
  let damageRoll: number;
  let damageRollDetails: string;
  let defenseModifier: number;
  let advantageText: string;

  const attackerStat = getStatForType(attacker, attackerDecision.type);
  const defenderDefense = getDefenseForType(defender, attackerDecision.type);

  // Determine advantage from attacker's perspective
  const attackerAdvantage = attackerIsPlayer ? advantage :
    (advantage === 'player' ? 'enemy' : advantage === 'enemy' ? 'player' : 'none');

  // Roll based on advantage and set defense modifier
  if (attackerAdvantage === (attackerIsPlayer ? 'player' : 'enemy')) {
    // Attacker has advantage: 2d20 take higher, defense halved
    const rollResult = rollWithAdvantage();
    damageRoll = rollResult.result + attackerStat;
    damageRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took higher (${rollResult.result}) + ${attackerStat} stat = ${damageRoll}`;
    defenseModifier = 0.5;
    advantageText = 'with advantage (defense halved)';
  } else if (attackerAdvantage === (attackerIsPlayer ? 'enemy' : 'player')) {
    // Attacker has disadvantage: 2d20 take lower, normal defense
    const rollResult = rollWithDisadvantage();
    damageRoll = rollResult.result + attackerStat;
    damageRollDetails = `2d20 (${rollResult.rolls[0]}, ${rollResult.rolls[1]}) took lower (${rollResult.result}) + ${attackerStat} stat = ${damageRoll}`;
    defenseModifier = 1.0;
    advantageText = 'with disadvantage';
  } else {
    // Neutral (same type): Auto-hit with 1d20, defense doubled
    const d20 = rollD20();
    damageRoll = d20 + attackerStat;
    damageRollDetails = `1d20 (${d20}) + ${attackerStat} stat = ${damageRoll}`;
    defenseModifier = 2.0;
    advantageText = 'neutral (defense doubled)';
  }

  const damage = calculateDamage(damageRoll, defenderDefense, defenseModifier);
  const modifiedDefense = Math.floor(defenderDefense * defenseModifier);

  const attackerName = attackerIsPlayer ? 'Player' : 'Enemy';
  const defenderName = attackerIsPlayer ? 'Enemy' : 'Player';
  const result = `${attackerName} attacked ${advantageText} while ${defenderName} defended. Damage: ${damageRollDetails} vs ${modifiedDefense} defense (${defenderDefense} × ${defenseModifier}) = ${damage} damage`;

  return {
    attackerRoll: damageRoll,
    attackerRollDetails: damageRollDetails,
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

  // TODO: Check these types
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
