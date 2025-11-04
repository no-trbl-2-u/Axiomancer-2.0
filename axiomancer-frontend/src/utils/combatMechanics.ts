import { PhilosophicalAspect, CombatChoice, CombatRoundResult, Character, Enemy, BaseStats, DerivedStats, Skill } from '../types/game';
import { CombatantBuffs } from '../types/buffs';
import { calculateDerivedStats, calculateMaxHP, calculateMaxMP } from './statCalculations';
import { fallacySpellbook } from './fallacySpellbook';
import { createMindAttackBuff, createHeartAttackDebuff, createReflectionBuff, createCounterArgumentBuff, createForesightBuff, applyBuffDebuff, calculateModifiedStats } from './buffDebuffEngine';
import { processFallacyCombatEffects, applyStatusEffectsToCombatant, filterStatusEffectsByChance } from './combatEffectBridge';
import { applyEquipmentBonuses } from './equipmentItems';
import { getCombatVisualState } from './combatVisuals';

/**
 * Combat result structure for UI-agnostic combat resolution
 */
export interface CombatActionResult {
  hit: boolean;
  damage: number;
  effects: string[];
  buffsApplied: any[];
  debuffsApplied: any[];
  critical: boolean;
  targetBuffsUpdated?: import('../types/game').CombatantBuffs;
  attackerBuffsUpdated?: import('../types/game').CombatantBuffs;
}

/**
 * D20 attack system utilities
 */

/**
 * Roll a D20 die
 */
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

/**
 * Calculate if an attack hits using D20 system
 * Formula: D20 + (Accuracy / 10) - (Evasion / 10) >= 10
 */
export function calculateHitChance(
  attackerStats: DerivedStats,
  defenderStats: DerivedStats
): boolean {
  const d20Roll = rollD20();
  const accuracyBonus = Math.floor(attackerStats.accuracy / 10);
  const evasionPenalty = Math.floor(defenderStats.evasion / 10);

  const hitRoll = d20Roll + accuracyBonus - evasionPenalty;

  return hitRoll >= 10;
}

/**
 * Check for critical hit (natural 20 or modified roll >= 25)
 */
export function checkCriticalHit(
  attackerStats: DerivedStats,
  defenderStats: DerivedStats,
  d20Roll?: number
): boolean {
  const roll = d20Roll || rollD20();
  if (roll === 20) return true; // Natural 20 is always critical

  const accuracyBonus = Math.floor(attackerStats.accuracy / 10);
  const evasionPenalty = Math.floor(defenderStats.evasion / 10);
  const finalRoll = roll + accuracyBonus - evasionPenalty;

  return finalRoll >= 25; // Very high rolls can also crit
}

/**
 * Philosophy-based rock-paper-scissors combat system
 * Body > Mind > Heart > Body
 */
export function determineAspectWinner(playerAspect: PhilosophicalAspect, enemyAspect: PhilosophicalAspect): 'player' | 'enemy' | 'tie' {
  if (playerAspect === enemyAspect) {
    return 'tie';
  }

  const winConditions: Record<PhilosophicalAspect, PhilosophicalAspect> = {
    body: 'mind',    // Body overcomes Mind
    mind: 'heart',   // Mind overcomes Heart
    heart: 'body',   // Heart overcomes Body
  };

  return winConditions[playerAspect] === enemyAspect ? 'player' : 'enemy';
}

/**
 * Calculate combat action result with D20 system integration
 * UI-agnostic function that returns structured combat result
 */
export function executeCombatAction(
  attacker: Character | Enemy,
  defender: Character | Enemy,
  argumentType: PhilosophicalAspect,
  action: string,
  hasAdvantage: boolean,
  attackerBuffs?: CombatantBuffs,
  defenderBuffs?: CombatantBuffs
): CombatActionResult {
  // Apply equipment bonuses first
  let attackerStats = (attacker as any).equippedItems && Object.keys((attacker as any).equippedItems).length > 0
    ? applyEquipmentBonuses(attacker.derivedStats, Object.values((attacker as any).equippedItems), argumentType)
    : attacker.derivedStats;

  let defenderStats = (defender as any).equippedItems && Object.keys((defender as any).equippedItems).length > 0
    ? applyEquipmentBonuses(defender.derivedStats, Object.values((defender as any).equippedItems), argumentType)
    : defender.derivedStats;

  // Apply buff/debuff modifications to stats
  if (attackerBuffs) {
    attackerStats = calculateModifiedStats(attackerStats, attackerBuffs);
  }
  if (defenderBuffs) {
    defenderStats = calculateModifiedStats(defenderStats, defenderBuffs);
  }
  const result: CombatActionResult = {
    hit: false,
    damage: 0,
    effects: [],
    buffsApplied: [],
    debuffsApplied: [],
    critical: false,
  };

  // Handle non-attack actions (always hit)
  if (action === 'defend' || action === 'flee') {
    result.hit = true;
    if (action === 'defend') {
      result.damage = 0; // Defend doesn't deal damage directly
      result.effects.push(`${attacker.name} takes a ${argumentType.toUpperCase()} defensive stance`);

      // Apply defend buffs based on argument type per Combat.md
      if (argumentType === 'body') {
        result.effects.push('Physical defense doubled, ailment defense halved');
        const reflectBuff = createReflectionBuff(Math.floor(attackerStats.physicalAttack * (hasAdvantage ? 0.5 : 0.25)));
        result.buffsApplied.push(reflectBuff);
      } else if (argumentType === 'mind') {
        result.effects.push('Mind defense doubled, physical defense halved');
        const counterBuff = createCounterArgumentBuff(Math.floor(attackerStats.mindAttack * (hasAdvantage ? 0.5 : 0.25)), 3);
        result.buffsApplied.push(counterBuff);
      } else if (argumentType === 'heart') {
        result.effects.push('Ailment defense doubled, mind defense halved');
        const foresightBuff = createForesightBuff(hasAdvantage ? 'both' : 'attack', 3);
        result.buffsApplied.push(foresightBuff);
      }
    }
    return result;
  }

  // Check hit/miss for attacks using D20 system
  const hit = calculateHitChance(attackerStats, defenderStats);
  result.hit = hit;

  if (!hit) {
    result.effects.push(`${attacker.name}'s attack misses!`);
    return result;
  }

  // Check for critical hit
  result.critical = checkCriticalHit(attackerStats, defenderStats);

  // Calculate base damage
  let baseDamage = 0;
  let defense = 0;

  switch (action) {
    case 'attack':
      if (argumentType === 'body') {
        baseDamage = attackerStats.physicalAttack;
        defense = defenderStats.physicalDefense;
        if (hasAdvantage) {
          baseDamage = Math.floor(baseDamage * 1.5);
          result.effects.push('Body argument advantage: +50% damage!');
        }
      } else if (argumentType === 'mind') {
        baseDamage = Math.floor(attackerStats.mindAttack * 0.75);
        defense = defenderStats.mindDefense;
        let followUpDamage = Math.floor(attackerStats.mindAttack * 0.25);
        if (hasAdvantage) {
          baseDamage = attackerStats.mindAttack;
          followUpDamage = Math.floor(attackerStats.mindAttack * 0.5);
          result.effects.push('Mind argument advantage: Full damage + stronger follow-up!');
        }
        const mindBuff = createMindAttackBuff(followUpDamage);
        result.buffsApplied.push(mindBuff);
        result.effects.push(`Mind attack creates follow-up damage next turn (${followUpDamage} fixed damage)`);
      } else if (argumentType === 'heart') {
        baseDamage = Math.floor(attackerStats.ailmentAttack * 0.5);
        defense = defenderStats.ailmentDefense;
        let guiltDamage = Math.floor((baseDamage - defense) * 0.5);
        let chanceToFade: number | undefined = undefined;
        if (hasAdvantage) {
          baseDamage = Math.floor(attackerStats.ailmentAttack * 0.75);
          guiltDamage = Math.floor((baseDamage - defense) * 1); // 100% of damage done
          chanceToFade = 15; // 15% chance to fade per turn
          result.effects.push('Heart argument advantage: Increased damage + stronger guilt!');
        } else {
          guiltDamage = Math.floor((baseDamage - defense) * 0.5); // 50% of damage done
        }

        // Only apply debuff if damage > 0
        if (guiltDamage > 0) {
          const heartDebuff = createHeartAttackDebuff(guiltDamage, 3, chanceToFade);
          result.debuffsApplied.push(heartDebuff);
          result.effects.push(`Heart attack inflicts emotional guilt (${guiltDamage} damage when attacking)`);
        }
      }
      break;
    case 'special':
      // Special attacks (fallacies) will be handled separately
      baseDamage = Math.floor(attackerStats.mindAttack * 0.6);
      defense = defenderStats.mindDefense;
      break;
  }

  // Apply critical hit multiplier
  if (result.critical) {
    baseDamage = Math.floor(baseDamage * 2);
    result.effects.push('CRITICAL HIT! Double damage!');
  }

  // Calculate final damage
  result.damage = Math.max(1, baseDamage - defense);

  return result;
}

/**
 * Get fallacy by ID from fallacySpellbook
 */
function getFallacyById(id: string): Skill | undefined {
  return fallacySpellbook[id];
}

/**
 * Execute a fallacy skill with its specific effects
 */
export function executeFallacy(
  attacker: Character | Enemy,
  defender: Character | Enemy,
  fallacyId: string,
  targetBuffs: import('../types/game').CombatantBuffs,
  attackerBuffs: import('../types/game').CombatantBuffs,
  hasAdvantage: boolean = false,
  defenderChoice?: { aspect: PhilosophicalAspect; action: string }
): CombatActionResult {
  const fallacy = getFallacyById(fallacyId);
  if (!fallacy) {
    return {
      hit: false,
      damage: 0,
      effects: ['Fallacy not found!'],
      buffsApplied: [],
      debuffsApplied: [],
      critical: false,
    };
  }

  // Apply equipment bonuses first
  let attackerStats = (attacker as any).equippedItems && Object.keys((attacker as any).equippedItems).length > 0
    ? applyEquipmentBonuses(attacker.derivedStats, Object.values((attacker as any).equippedItems))
    : attacker.derivedStats;

  let defenderStats = (defender as any).equippedItems && Object.keys((defender as any).equippedItems).length > 0
    ? applyEquipmentBonuses(defender.derivedStats, Object.values((defender as any).equippedItems))
    : defender.derivedStats;

  // Apply buff/debuff modifications to stats
  attackerStats = calculateModifiedStats(attackerStats, attackerBuffs);
  defenderStats = calculateModifiedStats(defenderStats, targetBuffs);

  const result: CombatActionResult = {
    hit: false,
    damage: 0,
    effects: [],
    buffsApplied: [],
    debuffsApplied: [],
    critical: false,
    targetBuffsUpdated: { ...targetBuffs },
    attackerBuffsUpdated: { ...attackerBuffs },
  };

  // Check mana cost
  if (attacker.mana < fallacy.manaCost) {
    result.effects.push(`${attacker.name} doesn't have enough mana to use ${fallacy.name}!`);
    return result;
  }

  // Deduct mana (this would be handled by the UI)
  result.effects.push(`${attacker.name} uses ${fallacy.name}! (-${fallacy.manaCost} MP)`);

  // Check hit using D20 system with modified stats
  result.hit = calculateHitChance(attackerStats, defenderStats);

  if (!result.hit) {
    result.effects.push(`${fallacy.name} misses ${defender.name}!`);
    return result;
  }

  // Check for critical hit
  result.critical = checkCriticalHit(attackerStats, defenderStats);

  // Calculate base damage from fallacy
  let baseDamage = fallacy.damage || 0;

  // Add stat-based damage based on fallacy type using modified stats
  if (fallacy.philosophicalAspect === 'body') {
    baseDamage += Math.floor(attackerStats.physicalAttack * 0.5);
  } else if (fallacy.philosophicalAspect === 'mind') {
    baseDamage += Math.floor(attackerStats.mindAttack * 0.5);
  } else if (fallacy.philosophicalAspect === 'heart') {
    baseDamage += Math.floor(attackerStats.ailmentAttack * 0.5);
  }

  // Apply critical hit multiplier
  if (result.critical) {
    baseDamage = Math.floor(baseDamage * 2);
    result.effects.push('CRITICAL FALLACY! Double damage!');
  }

  // Calculate defense using modified stats
  let defense = 0;
  if (fallacy.philosophicalAspect === 'body') {
    defense = defenderStats.physicalDefense;
  } else if (fallacy.philosophicalAspect === 'mind') {
    defense = defenderStats.mindDefense;
  } else if (fallacy.philosophicalAspect === 'heart') {
    defense = defenderStats.ailmentDefense;
  }

  // Final damage calculation
  result.damage = Math.max(1, baseDamage - defense);

  // Apply fallacy-specific effects using combatEffects and status effect bridge
  result.effects.push(`${fallacy.name} hits for ${result.damage} damage!`);

  // Process comprehensive combatEffects if available
  if (fallacy.combatEffects) {
    const statusEffectResult = processFallacyCombatEffects(
      fallacy.combatEffects,
      hasAdvantage,
      false, // not defended in this context
      false  // not a counter attack
    );

    // Check if defender has Heart defense bonus (Heart aspect + Defense action)
    const isHeartDefense = defenderChoice?.aspect === 'heart' && defenderChoice?.action === 'defend';

    // Apply chance-based filtering for status effects based on ailment stats
    const filteredEffects = filterStatusEffectsByChance(
      statusEffectResult,
      attackerStats.ailmentAttack,
      defenderStats.ailmentDefense,
      isHeartDefense
    );

    // Add status effects to result
    result.buffsApplied.push(...filteredEffects.buffs);
    result.debuffsApplied.push(...filteredEffects.debuffs);
    result.effects.push(...filteredEffects.effects);

    // Update target and attacker buffs
    if (filteredEffects.debuffs.length > 0) {
      result.targetBuffsUpdated = applyStatusEffectsToCombatant(
        result.targetBuffsUpdated || { buffs: [], debuffs: [] },
        { buffs: [], debuffs: filteredEffects.debuffs, effects: [] }
      );
    }

    if (filteredEffects.buffs.length > 0) {
      result.attackerBuffsUpdated = applyStatusEffectsToCombatant(
        result.attackerBuffsUpdated || { buffs: [], debuffs: [] },
        { buffs: filteredEffects.buffs, debuffs: [], effects: [] }
      );
    }
  } else if (fallacy.effect) {
    // Fallback to basic effect description
    result.effects.push(fallacy.effect);
  }

  return result;
}

/**
 * Generate AI choice for enemy based on their philosophical alignment and strategy
 */
export function generateEnemyChoice(_enemy: Enemy, _playerPreviousChoices: CombatChoice[]): CombatChoice {
  // Random aspect selection: 33% chance for each (Body, Mind, Heart)
  const aspects: PhilosophicalAspect[] = ['body', 'mind', 'heart'];
  const randomAspectIndex = Math.floor(Math.random() * aspects.length);
  const chosenAspect = aspects[randomAspectIndex] || 'body';

  // Random action selection: 50% attack, 50% defend
  const chosenAction: 'attack' | 'defend' = Math.random() < 0.5 ? 'attack' : 'defend';

  return {
    aspect: chosenAspect,
    action: chosenAction,
  };
}

/**
 * Resolve a complete combat round using UI-agnostic combat action execution
 */
export function resolveCombatRound(
  player: Character,
  enemy: Enemy,
  playerChoice: CombatChoice,
  enemyChoice: CombatChoice
): CombatRoundResult {
  const aspectWinner = determineAspectWinner(playerChoice.aspect, enemyChoice.aspect);

  let advantage: 'player' | 'enemy' | 'none' = 'none';
  if (aspectWinner !== 'tie') {
    advantage = aspectWinner;
  }

  // Execute combat actions using the new system
  const playerResult = executeCombatAction(
    player,
    enemy,
    playerChoice.aspect,
    playerChoice.action,
    advantage === 'player',
    { buffs: [], debuffs: [] }, // Player buffs - would be passed from combat state
    { buffs: [], debuffs: [] }  // Enemy buffs - would be passed from combat state
  );

  const enemyResult = executeCombatAction(
    enemy,
    player,
    enemyChoice.aspect,
    enemyChoice.action,
    advantage === 'enemy',
    { buffs: [], debuffs: [] }, // Enemy buffs - would be passed from combat state
    { buffs: [], debuffs: [] }  // Player buffs - would be passed from combat state
  );

  // Determine overall winner based on damage dealt
  let winner: 'player' | 'enemy' | 'tie' = 'tie';
  if (playerResult.damage > enemyResult.damage) {
    winner = 'player';
  } else if (enemyResult.damage > playerResult.damage) {
    winner = 'enemy';
  }

  // Generate combat effects text
  const effects: string[] = [];
  // Show full player selection
  const playerActionText = playerChoice.action.charAt(0).toUpperCase() + playerChoice.action.slice(1);
  const playerAspectText = playerChoice.aspect.charAt(0).toUpperCase() + playerChoice.aspect.slice(1);
  effects.push(`${player.name} chose ${playerAspectText} ${playerActionText}`);
  
  // Show full enemy selection
  const enemyActionText = enemyChoice.action.charAt(0).toUpperCase() + enemyChoice.action.slice(1);
  const enemyAspectText = enemyChoice.aspect.charAt(0).toUpperCase() + enemyChoice.aspect.slice(1);
  effects.push(`${enemy.name} chose ${enemyAspectText} ${enemyActionText}`);

  if (aspectWinner === 'player') {
    effects.push(`${playerChoice.aspect.toUpperCase()} overcomes ${enemyChoice.aspect.toUpperCase()}! ${player.name} gains advantage!`);
  } else if (aspectWinner === 'enemy') {
    effects.push(`${enemyChoice.aspect.toUpperCase()} overcomes ${playerChoice.aspect.toUpperCase()}! ${enemy.name} gains advantage!`);
  } else {
    effects.push('Both combatants chose the same philosophical aspect - no advantage gained.');
  }

  // Add hit/miss/critical information
  if (!playerResult.hit) {
    effects.push(`${player.name}'s attack misses!`);
  } else if (playerResult.critical) {
    effects.push(`${player.name} scores a critical hit!`);
  }

  if (!enemyResult.hit) {
    effects.push(`${enemy.name}'s attack misses!`);
  } else if (enemyResult.critical) {
    effects.push(`${enemy.name} scores a critical hit!`);
  }

  // Add any special effects
  effects.push(...playerResult.effects);
  effects.push(...enemyResult.effects);

  return {
    playerChoice,
    enemyChoice,
    winner,
    advantage,
    damage: {
      toPlayer: enemyResult.damage,
      toEnemy: playerResult.damage,
    },
    effects,
  };
}

/**
 * Helper function to create enemy with new stat system
 */
function createEnemyWithStats(baseStats: BaseStats, enemyData: Partial<Enemy>): Enemy {
  const derivedStats = calculateDerivedStats(baseStats);
  const maxHP = calculateMaxHP(baseStats);
  const maxMP = calculateMaxMP(baseStats);

  return {
    baseStats,
    derivedStats,
    availableStatPoints: 0,
    health: maxHP,
    maxHealth: maxHP,
    mana: maxMP,
    maxMana: maxMP,
    ...enemyData,
  } as Enemy;
}

/**
 * Create philosophical enemies based on fallacies and philosophical concepts
 */
export function createAbortiveFallacy(): Enemy {
  return createEnemyWithStats(
    { heart: 2, body: 3, mind: 4 },
    {
      id: 'abortive_fallacy',
      name: 'Abortive Fallacy',
      level: 2,
      skills: [],
      loot: [
        {
          id: 'fallacy_essence',
          name: 'Essence of Flawed Logic',
          description: 'A crystallized fragment of a defeated logical fallacy.',
          type: 'crafting',
          value: 25,
          stackable: true,
          quantity: 1,
          icon: '🔮',
        },
      ],
      type: 'fallacy',
      image: '/monsters/Abortive.jpg',
      description: 'A manifestation of incomplete reasoning - an argument that fails to reach its logical conclusion.',
      weaknesses: ['mind'],
      strengths: ['heart'],
    }
  );
}

export function createSophist(): Enemy {
  return createEnemyWithStats(
    { heart: 4, body: 2, mind: 6 },
    {
      id: 'sophist',
      name: 'Deceiving Sophist',
      level: 3,
      skills: [],
      loot: [
        {
          id: 'sophist_rhetoric',
          name: 'Persuasive Rhetoric',
          description: 'A scroll containing powerful but misleading arguments.',
          type: 'quest',
          value: 40,
          stackable: true,
          quantity: 1,
          icon: '📃',
        },
      ],
      type: 'sophist',
      description: 'A master of persuasion who values winning arguments over finding truth.',
      weaknesses: ['body'],
      strengths: ['mind'],
    }
  );
}

export function createNihilisticVoid(): Enemy {
  return createEnemyWithStats(
    { heart: 1, body: 4, mind: 7 },
    {
      id: 'nihilistic_void',
      name: 'Nihilistic Void',
      level: 4,
      skills: [],
      loot: [
        {
          id: 'void_fragment',
          name: 'Fragment of Meaninglessness',
          description: 'A piece of the void that questions all meaning and purpose.',
          type: 'quest',
          value: 60,
          stackable: true,
          quantity: 1,
          icon: '🕳️',
        },
      ],
      type: 'nihilist',
      description: 'An embodiment of existential emptiness that seeks to drain meaning from all things.',
      weaknesses: ['heart'],
      strengths: ['mind'],
    }
  );
}

export function createPhilosophicalGoblin(): Enemy {
  return createEnemyWithStats(
    { heart: 2, body: 2, mind: 3 },
    {
      id: 'philosophical_goblin',
      name: 'Philosophical Goblin',
      level: 1,
      skills: [],
      loot: [
        {
          id: 'goblin_wisdom',
          name: 'Goblin Wisdom',
          description: 'A small scroll containing a philosophical question.',
          type: 'quest',
          value: 10,
          stackable: true,
          quantity: 1,
          icon: '📜',
        },
      ],
      type: 'beast',
      description: 'A small creature that has gained intelligence through exposure to philosophical debates.',
      weaknesses: ['body'],
      strengths: ['heart'],
    }
  );
}

export function createStrawmanArgument(): Enemy {
  return createEnemyWithStats(
    { heart: 3, body: 2, mind: 4 },
    {
      id: 'strawman_argument',
      name: 'Strawman Argument',
      level: 2,
      skills: [],
      loot: [
        {
          id: 'distorted_reasoning',
          name: 'Distorted Reasoning',
          description: 'A twisted logic pattern that misrepresents arguments.',
          type: 'crafting',
          value: 20,
          stackable: true,
          quantity: 1,
          icon: '🎭',
        },
      ],
      type: 'fallacy',
      description: 'A misrepresentation of opposing arguments that makes them easier to attack.',
      weaknesses: ['mind'],
      strengths: ['body'],
    }
  );
}

export function createCircularReasoningDemon(): Enemy {
  return createEnemyWithStats(
    { heart: 2, body: 3, mind: 5 },
    {
      id: 'circular_reasoning',
      name: 'Circular Reasoning Demon',
      level: 3,
      skills: [],
      loot: [
        {
          id: 'endless_loop',
          name: 'Endless Logic Loop',
          description: 'A paradoxical reasoning pattern that goes nowhere.',
          type: 'quest',
          value: 35,
          stackable: true,
          quantity: 1,
          icon: '🔄',
        },
      ],
      type: 'fallacy',
      description: 'An entity trapped in endless loops of self-justifying logic.',
      weaknesses: ['body'],
      strengths: ['mind'],
    }
  );
}

export function createConfirmationBiasBeast(): Enemy {
  return createEnemyWithStats(
    { heart: 2, body: 3, mind: 4 },
    {
      id: 'confirmation_bias',
      name: 'Confirmation Bias Beast',
      level: 2,
      skills: [],
      loot: [
        {
          id: 'selective_evidence',
          name: 'Selective Evidence',
          description: 'Information that only supports pre-existing beliefs.',
          type: 'crafting',
          value: 22,
          stackable: true,
          quantity: 1,
          icon: '👁️',
        },
      ],
      type: 'fallacy',
      description: 'A creature that only sees evidence that confirms what it already believes.',
      weaknesses: ['mind', 'heart'],
      strengths: ['body'],
    }
  );
}

export function createWisdomGuardian(): Enemy {
  return createEnemyWithStats(
    { heart: 6, body: 5, mind: 8 },
    {
      id: 'wisdom_guardian',
      name: 'Guardian of Ancient Wisdom',
      level: 5,
      skills: [],
      loot: [
        {
          id: 'wisdom_crystal',
          name: 'Crystal of Ancient Wisdom',
          description: 'A crystallized piece of pure philosophical understanding.',
          type: 'quest',
          value: 100,
          stackable: false,
          quantity: 1,
          icon: '💎',
        },
      ],
      type: 'guardian',
      description: 'An ancient protector of philosophical knowledge, testing worthy seekers.',
      weaknesses: [],
      strengths: ['mind', 'heart'],
    }
  );
}

/**
 * Forest Monster Creators
 */
function createElderTree(): Enemy {
  return createEnemyWithStats(
    { heart: 6, body: 5, mind: 7 },
    {
      id: 'elder_tree',
      name: 'Ancient Elder Tree',
      description: 'A wise but corrupted tree that has seen too much suffering in the world.',
      level: 4,
      skills: [],
      loot: [],
      type: 'guardian',
      enemyTier: 'normal'
    }
  );
}

function createForestGuardian(): Enemy {
  return createEnemyWithStats(
    { heart: 5, body: 4, mind: 6 },
    {
      id: 'tree_guardian_1',
      name: 'Forest Guardian',
      description: 'A protective spirit of the forest, testing your philosophical resolve.',
      level: 3,
      skills: [],
      loot: [],
      type: 'guardian',
      enemyTier: 'normal'
    }
  );
}

function createTwistedTreeSpirit(): Enemy {
  return createEnemyWithStats(
    { heart: 6, body: 5, mind: 7 },
    {
      id: 'tree_guardian_2',
      name: 'Twisted Tree Spirit',
      description: 'A once-peaceful tree spirit, now filled with existential doubt.',
      level: 4,
      skills: [],
      loot: [],
      type: 'guardian',
      enemyTier: 'normal'
    }
  );
}

/**
 * Factory function to create enemies by type
 */
export function createEnemyByType(enemyType: string): Enemy {
  switch (enemyType) {
    case 'elder_tree':
      return createElderTree();
    case 'tree_guardian_1':
      return createForestGuardian();
    case 'tree_guardian_2':
      return createTwistedTreeSpirit();
    case 'abortive_fallacy':
      return createAbortiveFallacy();
    case 'sophist':
      return createSophist();
    case 'nihilistic_void':
      return createNihilisticVoid();
    case 'strawman_argument':
      return createStrawmanArgument();
    case 'circular_reasoning':
      return createCircularReasoningDemon();
    case 'confirmation_bias':
      return createConfirmationBiasBeast();
    case 'wisdom_guardian':
      return createWisdomGuardian();
    case 'philosophical_goblin':
    default:
      return createPhilosophicalGoblin();
  }
}

/**
 * UI-agnostic Combat State Manager
 * Handles turn-based combat flow independently of React components
 */
export class CombatStateManager {
  private player: Character;
  private enemy: Enemy;
  private playerBuffs: import('../types/game').CombatantBuffs;
  private enemyBuffs: import('../types/game').CombatantBuffs;
  private round: number = 1;
  private agreeToDisagreeCounter: number = 0;
  private turnEffects: string[] = [];
  private combatLog: string[] = [];
  private playerChoiceHistory: CombatChoice[] = [];

  constructor(player: Character, enemy: Enemy) {
    // Apply equipment bonuses to player's derived stats
    const playerWithEquipment = { ...player };
    if (player.equippedItems && Object.keys(player.equippedItems).length > 0) {
      playerWithEquipment.derivedStats = applyEquipmentBonuses(
        player.derivedStats,
        Object.values(player.equippedItems)
      );
    }

    // Apply equipment bonuses to enemy's derived stats (if enemy has equipment)
    const enemyWithEquipment = { ...enemy };
    if (enemy.equipment && enemy.equipment.length > 0) {
      enemyWithEquipment.derivedStats = applyEquipmentBonuses(
        enemy.derivedStats,
        enemy.equipment
      );
    }

    this.player = playerWithEquipment;
    this.enemy = enemyWithEquipment;
    this.playerBuffs = { buffs: [], debuffs: [] };
    this.enemyBuffs = { buffs: [], debuffs: [] };
  }

  /**
   * Process start of turn effects (buffs/debuffs)
   */
  private async processStartOfTurn(): Promise<void> {
    const { processBuffsDebuffs } = await import('./buffDebuffEngine');

    // Process player buffs/debuffs
    const playerResult = processBuffsDebuffs(this.playerBuffs, true);
    this.playerBuffs = playerResult.updatedBuffs;
    this.turnEffects.push(...playerResult.turnEffects.map(effect => `Player: ${effect}`));

    // Apply damage from player buff effects (like Mind Attack follow-up)
    if (playerResult.damageDealt) {
      this.enemy.health = Math.max(0, this.enemy.health - playerResult.damageDealt);
      this.turnEffects.push(`Enemy takes ${playerResult.damageDealt} damage from ongoing effects!`);
    }

    // Process enemy buffs/debuffs
    const enemyResult = processBuffsDebuffs(this.enemyBuffs, true);
    this.enemyBuffs = enemyResult.updatedBuffs;
    this.turnEffects.push(...enemyResult.turnEffects.map(effect => `Enemy: ${effect}`));

    // Apply damage from enemy buff effects
    if (enemyResult.damageDealt) {
      this.player.health = Math.max(0, this.player.health - enemyResult.damageDealt);
      this.turnEffects.push(`Player takes ${enemyResult.damageDealt} damage from ongoing effects!`);
    }
  }

  /**
   * Process damage-on-attack effects (like Heart Attack guilt)
   */
  private async processAttackEffects(attacker: Character | Enemy, defender: Character | Enemy, isPlayer: boolean): Promise<number> {
    const { processBuffsDebuffs } = await import('./buffDebuffEngine');

    const attackerBuffs = isPlayer ? this.playerBuffs : this.enemyBuffs;
    const result = processBuffsDebuffs(attackerBuffs, false, {
      isAttacking: true,
      defender
    });

    // Update the attacker's buffs
    if (isPlayer) {
      this.playerBuffs = result.updatedBuffs;
    } else {
      this.enemyBuffs = result.updatedBuffs;
    }

    // Add effects to turn log
    if (result.turnEffects.length > 0) {
      this.turnEffects.push(...result.turnEffects.map(effect => `${isPlayer ? 'Player' : 'Enemy'}: ${effect}`));
    }

    return result.damageDealt || 0;
  }

  /**
   * Execute a combat turn with player and enemy choices
   */
  public async executeTurn(playerChoice: CombatChoice): Promise<{
    roundResult: CombatRoundResult;
    combatEnded: boolean;
    winner?: 'player' | 'enemy' | 'agree_to_disagree' | undefined;
    turnEffects: string[];
    agreeToDisagreeRewards?: any;
    playerBuffs: import('../types/game').CombatantBuffs;
    enemyBuffs: import('../types/game').CombatantBuffs;
    updatedPlayer: Character;
    updatedEnemy: Enemy;
  }> {
    this.turnEffects = [];
    await this.processStartOfTurn();

    // Store player choice for AI analysis
    this.playerChoiceHistory.push(playerChoice);

    // Generate enemy choice
    const enemyChoice = generateEnemyChoice(this.enemy, this.playerChoiceHistory);

    // Log enemy choice in turn effects
    const enemyActionText = enemyChoice.action.charAt(0).toUpperCase() + enemyChoice.action.slice(1);
    const enemyAspectText = enemyChoice.aspect.charAt(0).toUpperCase() + enemyChoice.aspect.slice(1);
    this.turnEffects.push(`${this.enemy.name} chose ${enemyAspectText} ${enemyActionText}`);

    // Check for Agree to Disagree (Defend vs Defend)
    if (playerChoice.action === 'defend' && enemyChoice.action === 'defend') {
      this.agreeToDisagreeCounter++;
      const agreeToDisagreeThreshold = this.getAgreeToDisagreeThreshold();

      if (this.agreeToDisagreeCounter >= agreeToDisagreeThreshold) {
        // Trigger Agree to Disagree resolution
        return this.resolveAgreeToDisagree();
      } else {
        this.turnEffects.push(
          `Both sides defend their positions. Agree to Disagree counter: ${this.agreeToDisagreeCounter}/${agreeToDisagreeThreshold}`
        );
      }
    }

    // Handle special actions (fallacies)
    let playerResult: CombatActionResult;
    let enemyResult: CombatActionResult;

    if (playerChoice.action === 'special' && playerChoice.selectedSkill) {
      const aspectWinner = determineAspectWinner(playerChoice.aspect, enemyChoice.aspect);
      playerResult = executeFallacy(
        this.player,
        this.enemy,
        playerChoice.selectedSkill,
        this.enemyBuffs,
        this.playerBuffs,
        aspectWinner === 'player',
        enemyChoice
      );
      // Deduct mana
      this.player.mana = Math.max(0, this.player.mana - (getFallacyById(playerChoice.selectedSkill)?.manaCost || 0));
    } else {
      const aspectWinner = determineAspectWinner(playerChoice.aspect, enemyChoice.aspect);
      playerResult = executeCombatAction(
        this.player,
        this.enemy,
        playerChoice.aspect,
        playerChoice.action,
        aspectWinner === 'player',
        this.playerBuffs,
        this.enemyBuffs
      );
    }

    if (enemyChoice.action === 'special' && enemyChoice.selectedSkill) {
      const aspectWinner = determineAspectWinner(playerChoice.aspect, enemyChoice.aspect);
      enemyResult = executeFallacy(
        this.enemy,
        this.player,
        enemyChoice.selectedSkill,
        this.playerBuffs,
        this.enemyBuffs,
        aspectWinner === 'enemy',
        playerChoice
      );
      // Deduct mana
      this.enemy.mana = Math.max(0, this.enemy.mana - (getFallacyById(enemyChoice.selectedSkill)?.manaCost || 0));
    } else {
      const aspectWinner = determineAspectWinner(playerChoice.aspect, enemyChoice.aspect);
      enemyResult = executeCombatAction(
        this.enemy,
        this.player,
        enemyChoice.aspect,
        enemyChoice.action,
        aspectWinner === 'enemy',
        this.enemyBuffs,
        this.playerBuffs
      );
    }

    // Apply damage and process attack effects (like Heart Attack guilt)
    let playerAttackEffectDamage = 0;
    let enemyAttackEffectDamage = 0;

    if (playerChoice.action === 'attack') {
      playerAttackEffectDamage = await this.processAttackEffects(this.player, this.enemy, true);
    }
    if (enemyChoice.action === 'attack') {
      enemyAttackEffectDamage = await this.processAttackEffects(this.enemy, this.player, false);
    }

    // Apply all damage
    this.enemy.health = Math.max(0, this.enemy.health - playerResult.damage);
    this.player.health = Math.max(0, this.player.health - (enemyResult.damage + playerAttackEffectDamage));
    this.enemy.health = Math.max(0, this.enemy.health - enemyAttackEffectDamage);

    // Apply buffs and debuffs from player actions
    if (playerResult.buffsApplied?.length > 0) {
      playerResult.buffsApplied.forEach(buff => {
        this.playerBuffs = applyBuffDebuff(this.playerBuffs, buff);
      });
    }
    if (playerResult.debuffsApplied?.length > 0) {
      playerResult.debuffsApplied.forEach(debuff => {
        this.enemyBuffs = applyBuffDebuff(this.enemyBuffs, debuff);
      });
    }

    // Apply buffs and debuffs from enemy actions
    if (enemyResult.buffsApplied?.length > 0) {
      enemyResult.buffsApplied.forEach(buff => {
        this.enemyBuffs = applyBuffDebuff(this.enemyBuffs, buff);
      });
    }
    if (enemyResult.debuffsApplied?.length > 0) {
      enemyResult.debuffsApplied.forEach(debuff => {
        this.playerBuffs = applyBuffDebuff(this.playerBuffs, debuff);
      });
    }

    // Update buffs/debuffs if provided (legacy system)
    if (playerResult.targetBuffsUpdated) {
      this.enemyBuffs = playerResult.targetBuffsUpdated;
    }
    if (playerResult.attackerBuffsUpdated) {
      this.playerBuffs = playerResult.attackerBuffsUpdated;
    }
    if (enemyResult.targetBuffsUpdated) {
      this.playerBuffs = enemyResult.targetBuffsUpdated;
    }
    if (enemyResult.attackerBuffsUpdated) {
      this.enemyBuffs = enemyResult.attackerBuffsUpdated;
    }

    // Create round result
    const roundResult = resolveCombatRound(this.player, this.enemy, playerChoice, enemyChoice);

    // Update combat log
    this.combatLog.push(...roundResult.effects);

    // Check for combat end
    const combatEnded = this.player.health <= 0 || this.enemy.health <= 0;
    let winner: 'player' | 'enemy' | undefined;

    if (combatEnded) {
      if (this.player.health <= 0 && this.enemy.health <= 0) {
        winner = Math.random() > 0.5 ? 'player' : 'enemy'; // Tie-breaker
      } else if (this.player.health <= 0) {
        winner = 'enemy';
      } else {
        winner = 'player';
      }
    }

    this.round++;

    return {
      roundResult,
      combatEnded,
      winner,
      turnEffects: this.turnEffects,
      playerBuffs: this.playerBuffs,
      enemyBuffs: this.enemyBuffs,
      updatedPlayer: this.player,
      updatedEnemy: this.enemy,
    };
  }

  /**
   * Get Agree to Disagree threshold based on enemy tier
   */
  private getAgreeToDisagreeThreshold(): number {
    const enemyTier = this.enemy.enemyTier || 'normal';
    switch (enemyTier) {
      case 'elite':
        return 5;
      case 'boss':
        return 10;
      case 'normal':
      default:
        return 3;
    }
  }

  /**
   * Resolve Agree to Disagree scenario
   */
  private resolveAgreeToDisagree(): {
    roundResult: CombatRoundResult;
    combatEnded: boolean;
    winner?: 'player' | 'enemy' | 'agree_to_disagree';
    turnEffects: string[];
    agreeToDisagreeRewards?: {
      lore?: string;
      items?: any[];
      questItems?: any[];
    };
    playerBuffs: import('../types/game').CombatantBuffs;
    enemyBuffs: import('../types/game').CombatantBuffs;
    updatedPlayer: Character;
    updatedEnemy: Enemy;
  } {
    const enemyTier = this.enemy.enemyTier || 'normal';
    const rewards: any = {};

    // Determine rewards based on enemy tier
    switch (enemyTier) {
      case 'normal':
        rewards.lore = `You and ${this.enemy.name} reach a mutual understanding. You learn something about the nature of philosophical discourse.`;
        break;
      case 'elite':
        rewards.lore = `Your reasoned debate with ${this.enemy.name} yields rare insights.`;
        rewards.items = []; // TODO: Add rare items system
        break;
      case 'boss':
        rewards.lore = `Through patient discourse, you and ${this.enemy.name} achieve philosophical harmony.`;
        rewards.items = []; // TODO: Add unique boss items
        rewards.questItems = []; // TODO: Add quest items for final area trade
        break;
    }

    const roundResult: CombatRoundResult = {
      playerChoice: { action: 'defend', aspect: 'mind' },
      enemyChoice: { action: 'defend', aspect: 'mind' },
      winner: 'agree_to_disagree' as any,
      advantage: 'none',
      damage: {
        toPlayer: 0,
        toEnemy: 0
      },
      effects: [
        `After ${this.agreeToDisagreeCounter} rounds of mutual defense, you both agree to disagree.`,
        rewards.lore || ''
      ]
    };

    return {
      roundResult,
      combatEnded: true,
      winner: 'agree_to_disagree',
      turnEffects: this.turnEffects,
      agreeToDisagreeRewards: rewards,
      playerBuffs: this.playerBuffs,
      enemyBuffs: this.enemyBuffs,
      updatedPlayer: this.player,
      updatedEnemy: this.enemy,
    };
  }

  /**
   * Get agree to disagree counter for UI display
   */
  public getAgreeToDisagreeProgress(): {
    current: number;
    threshold: number;
    enemyTier: string;
  } {
    return {
      current: this.agreeToDisagreeCounter,
      threshold: this.getAgreeToDisagreeThreshold(),
      enemyTier: this.enemy.enemyTier || 'normal'
    };
  }

  /**
   * Get visual state for UI display
   */
  public getVisualState(): any {
    return getCombatVisualState(this.playerBuffs, this.enemyBuffs, this.player.name, this.enemy.name);
  }

  /**
   * Get current combat state for UI display
   */
  public getCurrentState(): {
    player: Character;
    enemy: Enemy;
    playerBuffs: import('../types/game').CombatantBuffs;
    enemyBuffs: import('../types/game').CombatantBuffs;
    round: number;
    combatLog: string[];
    agreeToDisagreeCounter: number;
  } {
    return {
      player: { ...this.player },
      enemy: { ...this.enemy },
      playerBuffs: { ...this.playerBuffs },
      enemyBuffs: { ...this.enemyBuffs },
      round: this.round,
      combatLog: [...this.combatLog],
      agreeToDisagreeCounter: this.agreeToDisagreeCounter,
    };
  }

  /**
   * Apply healing to a combatant
   */
  public applyHealing(target: 'player' | 'enemy', amount: number): void {
    if (target === 'player') {
      this.player.health = Math.min(this.player.maxHealth, this.player.health + amount);
    } else {
      this.enemy.health = Math.min(this.enemy.maxHealth, this.enemy.health + amount);
    }
  }

  /**
   * Check if player has enough mana for a skill
   */
  public canUseSkill(skillId: string): boolean {
    const skill = getFallacyById(skillId);
    return skill ? this.player.mana >= skill.manaCost : false;
  }

  /**
   * Get available skills for the player
   */
  public getAvailableSkills(): Skill[] {
    return this.player.availableSkills.filter(skill => this.canUseSkill(skill.id));
  }
}