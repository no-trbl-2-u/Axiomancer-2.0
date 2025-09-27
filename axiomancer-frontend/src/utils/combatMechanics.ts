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

    chosenAspect = counterAspect[mostUsedAspect];
  } else {
    const aspects: PhilosophicalAspect[] = ['body', 'mind', 'heart'];
    const randomIndex = Math.floor(Math.random() * aspects.length);
    chosenAspect = aspects[randomIndex] || 'body';
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
 * Create philosophical enemies based on fallacies and philosophical concepts
 */
export function createAbortiveFallacy(): Enemy {
  return {
    id: 'abortive_fallacy',
    name: 'Abortive Fallacy',
    level: 2,
    health: 45,
    maxHealth: 45,
    mana: 30,
    maxMana: 30,
    stats: {
      strength: 6,
      constitution: 8,
      wisdom: 4,
      intelligence: 16,
      dexterity: 12,
      charisma: 8,
    },
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
    philosophicalAlignment: {
      ethics: 'nihilistic',
      metaphysics: 'idealist',
      epistemology: 'skeptical',
    },
    type: 'fallacy',
    image: '/monsters/Abortive.jpg',
    description: 'A manifestation of incomplete reasoning - an argument that fails to reach its logical conclusion.',
    weaknesses: ['mind'],
    strengths: ['heart'],
  };
}

export function createSophist(): Enemy {
  return {
    id: 'sophist',
    name: 'Deceiving Sophist',
    level: 3,
    health: 55,
    maxHealth: 55,
    mana: 40,
    maxMana: 40,
    stats: {
      strength: 7,
      constitution: 9,
      wisdom: 8,
      intelligence: 14,
      dexterity: 13,
      charisma: 18,
    },
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
    philosophicalAlignment: {
      ethics: 'consequentialist',
      metaphysics: 'pragmatist',
      epistemology: 'skeptical',
    },
    type: 'sophist',
    description: 'A master of persuasion who values winning arguments over finding truth.',
    weaknesses: ['body'],
    strengths: ['mind'],
  };
}

export function createNihilisticVoid(): Enemy {
  return {
    id: 'nihilistic_void',
    name: 'Nihilistic Void',
    level: 4,
    health: 65,
    maxHealth: 65,
    mana: 50,
    maxMana: 50,
    stats: {
      strength: 12,
      constitution: 15,
      wisdom: 20,
      intelligence: 18,
      dexterity: 8,
      charisma: 3,
    },
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
    philosophicalAlignment: {
      ethics: 'nihilistic',
      metaphysics: 'materialist',
      epistemology: 'skeptical',
    },
    type: 'nihilist',
    description: 'An embodiment of existential emptiness that seeks to drain meaning from all things.',
    weaknesses: ['heart'],
    strengths: ['mind'],
  };
}

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
        value: 10,
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
    type: 'beast',
    description: 'A small creature that has gained intelligence through exposure to philosophical debates.',
    weaknesses: ['body'],
    strengths: ['heart'],
  };
}

export function createStrawmanArgument(): Enemy {
  return {
    id: 'strawman_argument',
    name: 'Strawman Argument',
    level: 2,
    health: 40,
    maxHealth: 40,
    mana: 25,
    maxMana: 25,
    stats: {
      strength: 5,
      constitution: 7,
      wisdom: 6,
      intelligence: 12,
      dexterity: 15,
      charisma: 14,
    },
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
    philosophicalAlignment: {
      ethics: 'consequentialist',
      metaphysics: 'pragmatist',
      epistemology: 'skeptical',
    },
    type: 'fallacy',
    description: 'A misrepresentation of opposing arguments that makes them easier to attack.',
    weaknesses: ['mind'],
    strengths: ['body'],
  };
}

export function createCircularReasoningDemon(): Enemy {
  return {
    id: 'circular_reasoning',
    name: 'Circular Reasoning Demon',
    level: 3,
    health: 50,
    maxHealth: 50,
    mana: 35,
    maxMana: 35,
    stats: {
      strength: 8,
      constitution: 12,
      wisdom: 8,
      intelligence: 16,
      dexterity: 10,
      charisma: 11,
    },
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
    philosophicalAlignment: {
      ethics: 'deontological',
      metaphysics: 'idealist',
      epistemology: 'rationalist',
    },
    type: 'fallacy',
    description: 'An entity trapped in endless loops of self-justifying logic.',
    weaknesses: ['body'],
    strengths: ['mind'],
  };
}

export function createConfirmationBiasBeast(): Enemy {
  return {
    id: 'confirmation_bias',
    name: 'Confirmation Bias Beast',
    level: 2,
    health: 42,
    maxHealth: 42,
    mana: 28,
    maxMana: 28,
    stats: {
      strength: 9,
      constitution: 11,
      wisdom: 5,
      intelligence: 13,
      dexterity: 12,
      charisma: 10,
    },
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
    philosophicalAlignment: {
      ethics: 'consequentialist',
      metaphysics: 'materialist',
      epistemology: 'empiricist',
    },
    type: 'fallacy',
    description: 'A creature that only sees evidence that confirms what it already believes.',
    weaknesses: ['mind', 'heart'],
    strengths: ['body'],
  };
}

export function createWisdomGuardian(): Enemy {
  return {
    id: 'wisdom_guardian',
    name: 'Guardian of Ancient Wisdom',
    level: 5,
    health: 80,
    maxHealth: 80,
    mana: 60,
    maxMana: 60,
    stats: {
      strength: 15,
      constitution: 18,
      wisdom: 22,
      intelligence: 20,
      dexterity: 12,
      charisma: 16,
    },
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
    philosophicalAlignment: {
      ethics: 'virtue',
      metaphysics: 'dualist',
      epistemology: 'mystical',
    },
    type: 'guardian',
    description: 'An ancient protector of philosophical knowledge, testing worthy seekers.',
    weaknesses: [],
    strengths: ['mind', 'heart'],
  };
}

/**
 * Factory function to create enemies by type
 */
export function createEnemyByType(enemyType: string): Enemy {
  switch (enemyType) {
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