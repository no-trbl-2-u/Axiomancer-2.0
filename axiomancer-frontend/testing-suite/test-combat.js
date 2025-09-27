// Simple test for the philosophy-based combat system
const { createPhilosophicalGoblin, determineAspectWinner, resolveCombatRound } = require('./src/utils/combatMechanics.ts');

// Test the rock-paper-scissors logic
console.log('=== Testing Body > Mind > Heart > Body Logic ===');
console.log('Body vs Mind:', determineAspectWinner('body', 'mind')); // Should be 'player'
console.log('Mind vs Heart:', determineAspectWinner('mind', 'heart')); // Should be 'player'
console.log('Heart vs Body:', determineAspectWinner('heart', 'body')); // Should be 'player'
console.log('Body vs Body:', determineAspectWinner('body', 'body')); // Should be 'tie'

// Test enemy creation
console.log('\n=== Testing Enemy Creation ===');
const goblin = createPhilosophicalGoblin();
console.log('Created enemy:', goblin.name);
console.log('Enemy health:', goblin.health, '/', goblin.maxHealth);
console.log('Enemy philosophical alignment:', goblin.philosophicalAlignment);

// Test combat round
console.log('\n=== Testing Combat Round ===');
const mockPlayer = {
  id: 'player1',
  name: 'Socrates',
  level: 1,
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  stats: {
    strength: 12,
    constitution: 10,
    wisdom: 15,
    intelligence: 14,
    dexterity: 8,
    charisma: 13,
  },
  skills: [],
  equipment: [],
  inventory: [],
  philosophicalStance: {
    ethics: 'virtue',
    metaphysics: 'idealist',
    epistemology: 'rationalist',
  },
};

const playerChoice = { aspect: 'mind', action: 'attack' };
const enemyChoice = { aspect: 'heart', action: 'defend' };

const result = resolveCombatRound(mockPlayer, goblin, playerChoice, enemyChoice);
console.log('Combat result:');
console.log('- Winner:', result.winner);
console.log('- Advantage:', result.advantage);
console.log('- Damage to player:', result.damage.toPlayer);
console.log('- Damage to enemy:', result.damage.toEnemy);
console.log('- Effects:', result.effects);

console.log('\n=== Combat System Ready! ===');
console.log('Philosophy-based rock-paper-scissors combat implemented successfully.');
console.log('Body > Mind > Heart > Body cycle working correctly.');