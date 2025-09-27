import { PhilosophicalAspect, CombatChoice, CombatRoundResult, Character, Enemy } from '../types/game';

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
 * Calculate damage based on action type and advantage
 */
export function calculateDamage(
  attacker: Character | Enemy,
  defender: Character | Enemy,
  action: string,
  hasAdvantage: boolean
): number {
  let baseDamage = 0;

  switch (action) {
    case 'attack':
      baseDamage = Math.floor(attacker.stats.strength * 0.8 + Math.random() * 10);
      break;
    case 'defend':
      baseDamage = Math.floor(attacker.stats.constitution * 0.4 + Math.random() * 5);
      break;
    case 'special':
      baseDamage = Math.floor(attacker.stats.intelligence * 0.6 + Math.random() * 8);
      break;
  }

  // Apply advantage bonus
  if (hasAdvantage) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }

  // Apply defender's constitution as damage reduction
  const damageReduction = Math.floor(defender.stats.constitution * 0.2);
  const finalDamage = Math.max(1, baseDamage - damageReduction);

  return finalDamage;
}

/**
 * Generate AI choice for enemy based on their philosophical alignment and strategy
 */
export function generateEnemyChoice(enemy: Enemy, playerPreviousChoices: CombatChoice[]): CombatChoice {
  // Simple AI that tries to counter the player's most used aspect
  const aspectFrequency: Record<PhilosophicalAspect, number> = {
    body: 0,
    mind: 0,
    heart: 0,
  };

  // Count player's aspect usage
  playerPreviousChoices.forEach(choice => {
    aspectFrequency[choice.aspect]++;
  });

  let chosenAspect: PhilosophicalAspect;

  if (playerPreviousChoices.length > 0) {
    // Find player's most used aspect
    const mostUsedAspect = Object.entries(aspectFrequency).reduce((a, b) =>
      aspectFrequency[a[0] as PhilosophicalAspect] > aspectFrequency[b[0] as PhilosophicalAspect] ? a : b
    )[0] as PhilosophicalAspect;

    // Counter the most used aspect
    const counterAspect: Record<PhilosophicalAspect, PhilosophicalAspect> = {
      body: 'heart',   // Heart beats Body
      mind: 'body',    // Body beats Mind
      heart: 'mind',   // Mind beats Heart
    };

    chosenAspect = counterAspect[mostUsedAspect] || 'body';
  } else {
    chosenAspect = (['body', 'mind', 'heart'] as PhilosophicalAspect[])[Math.floor(Math.random() * 3)];
  }

  // Choose action based on enemy stats
  let chosenAction: 'attack' | 'defend' | 'special';
  if (enemy.stats.strength > enemy.stats.intelligence) {
    chosenAction = Math.random() > 0.3 ? 'attack' : 'defend';
  } else {
    chosenAction = Math.random() > 0.4 ? 'special' : 'attack';
  }

  return {
    aspect: chosenAspect,
    action: chosenAction,
  };
}

/**
 * Resolve a complete combat round
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

  // Calculate damage based on actions and advantage
  const playerDamage = calculateDamage(
    player,
    enemy,
    playerChoice.action,
    advantage === 'player'
  );

  const enemyDamage = calculateDamage(
    enemy,
    player,
    enemyChoice.action,
    advantage === 'enemy'
  );

  // Determine overall winner based on damage dealt
  let winner: 'player' | 'enemy' | 'tie' = 'tie';
  if (playerDamage > enemyDamage) {
    winner = 'player';
  } else if (enemyDamage > playerDamage) {
    winner = 'enemy';
  }

  // Generate combat effects text
  const effects: string[] = [];
  effects.push(`${player.name} chose ${playerChoice.aspect.toUpperCase()} and used ${playerChoice.action.toUpperCase()}`);
  effects.push(`${enemy.name} chose ${enemyChoice.aspect.toUpperCase()} and used ${enemyChoice.action.toUpperCase()}`);

  if (aspectWinner === 'player') {
    effects.push(`${playerChoice.aspect.toUpperCase()} overcomes ${enemyChoice.aspect.toUpperCase()}! ${player.name} gains advantage!`);
  } else if (aspectWinner === 'enemy') {
    effects.push(`${enemyChoice.aspect.toUpperCase()} overcomes ${playerChoice.aspect.toUpperCase()}! ${enemy.name} gains advantage!`);
  } else {
    effects.push('Both combatants chose the same philosophical aspect - no advantage gained.');
  }

  return {
    playerChoice,
    enemyChoice,
    winner,
    advantage,
    damage: {
      toPlayer: enemyDamage,
      toEnemy: playerDamage,
    },
    effects,
  };
}

/**
 * Create sample enemies for testing
 */
export function createPhilosophicalGoblin(): Enemy {
  return {
    id: 'philosophical_goblin',
    name: 'Philosophical Goblin',
    level: 1,
    health: 35,
    maxHealth: 35,
    mana: 20,
    maxMana: 20,
    stats: {
      strength: 8,
      constitution: 6,
      wisdom: 12,
      intelligence: 10,
      dexterity: 9,
      charisma: 5,
    },
    skills: [],
    loot: [
      {
        id: 'goblin_wisdom',
        name: 'Goblin Wisdom',
        description: 'A small scroll containing a philosophical question.',
        type: 'quest',
        value: 0,
        stackable: true,
        quantity: 1,
        icon: '📜',
      },
    ],
    philosophicalAlignment: {
      ethics: 'nihilistic',
      metaphysics: 'idealist',
      epistemology: 'skeptical',
    },
  };
}