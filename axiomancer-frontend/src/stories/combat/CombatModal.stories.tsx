import type { Meta, StoryObj } from '@storybook/react';
import { CombatModal } from '../../components/figma/CombatModal';
import { NewCombatState, BattleLogEntry } from '../../types/newCombat';
import { Character, Enemy } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

// Mock the useGameStore hook to provide combat state
const mockGameStore = (combatState: NewCombatState | null) => {
  // Store original implementation
  const originalImplementation = useGameStore.getState;
  
  // Mock the store
  beforeEach(() => {
    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
      updateCombat: (updates) => {
        useGameStore.setState({
          gameState: {
            ...useGameStore.getState().gameState,
            combat: combatState ? { ...combatState, ...updates } : null,
          },
        });
      },
      endCombat: () => {
        useGameStore.setState({
          gameState: {
            ...useGameStore.getState().gameState,
            combat: null,
          },
        });
      },
    });
  });
};

// Mock player character
const mockPlayer: Character = {
  id: '1',
  name: 'Socrates',
  level: 5,
  experience: 2500,
  experienceToNextLevel: 3000,
  health: 85,
  maxHealth: 100,
  mana: 45,
  maxMana: 60,
  portrait: {
    bodyType: 'body1',
    hairStyle: 'hair1',
    eyeStyle: 'eyes1',
    mouthStyle: 'mouth1',
    outfit: 'outfit1',
    background: 'bg1',
  },
  baseStats: {
    heart: 8,
    body: 7,
    mind: 10,
  },
  derivedStats: {
    maxHP: 100,
    maxMP: 60,
    physicalAttack: 15,
    physicalDefense: 12,
    mentalAttack: 20,
    mentalDefense: 18,
    emotionalAttack: 16,
    emotionalDefense: 14,
    speed: 10,
    criticalChance: 0.1,
    evasion: 0.05,
  },
  availableStatPoints: 0,
  unassignedStatPoints: 3,
  availableSkills: [],
  equippedSkills: {
    heart: [],
    body: [],
    mind: [],
  },
  equipment: [],
  inventory: [],
};

// Mock enemy
const mockEnemy: Enemy = {
  id: 'abortive_fallacy',
  name: 'Abortive Fallacy',
  type: 'fallacy',
  level: 4,
  health: 60,
  maxHealth: 80,
  image: '👹',
  description: 'A twisted creature born from incomplete reasoning.',
  baseStats: {
    heart: 5,
    body: 8,
    mind: 6,
  },
  derivedStats: {
    maxHP: 80,
    maxMP: 40,
    physicalAttack: 14,
    physicalDefense: 10,
    mentalAttack: 12,
    mentalDefense: 11,
    emotionalAttack: 10,
    emotionalDefense: 9,
    speed: 8,
    criticalChance: 0.08,
    evasion: 0.03,
  },
  experienceReward: 150,
  goldReward: 25,
};

// Mock battle log entries
const mockBattleLog: BattleLogEntry[] = [
  {
    round: 1,
    playerDecision: { type: 'mind', action: 'attack' },
    enemyDecision: { type: 'body', action: 'attack' },
    advantage: 'player',
    playerRoll: 18,
    playerRollDetails: '2d20 (12, 18) - took higher',
    enemyRoll: 12,
    enemyRollDetails: '1d20 (12)',
    damageToPlayer: 0,
    damageToEnemy: 22,
    playerHPAfter: 85,
    enemyHPAfter: 58,
    result: 'You had advantage! Your mental attack struck true!',
    timestamp: Date.now() - 60000,
  },
  {
    round: 2,
    playerDecision: { type: 'body', action: 'defend' },
    enemyDecision: { type: 'heart', action: 'attack' },
    advantage: 'enemy',
    playerRoll: 10,
    playerRollDetails: '1d20 (10)',
    enemyRoll: 16,
    enemyRollDetails: '2d20 (8, 16) - took higher',
    damageToPlayer: 8,
    damageToEnemy: 0,
    playerHPAfter: 77,
    enemyHPAfter: 58,
    result: 'The enemy had advantage! You defended, reducing damage.',
    timestamp: Date.now() - 30000,
  },
];

// Create mock combat states
const createMockCombatState = (
  phase: NewCombatState['phase'] = 'choosing_type',
  round: number = 1,
  playerHealth: number = 85,
  enemyHealth: number = 60,
  friendshipCounter: number = 0,
  battleLog: BattleLogEntry[] = []
): NewCombatState => ({
  active: true,
  phase,
  round,
  friendshipCounter,
  player: { ...mockPlayer, health: playerHealth },
  enemy: { ...mockEnemy, health: enemyHealth },
  playerChoice: {},
  enemyChoice: {},
  battleLog,
});

const meta: Meta<typeof CombatModal> = {
  title: 'Axiomance/CombatModal',
  component: CombatModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main combat modal that handles turn-based philosophical combat. Features a rock-paper-scissors style type system (Heart > Body > Mind > Heart) and attack/defend mechanics.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Initial combat state - Round 1, choosing combat type
 */
export const Round1ChoosingType: Story = {
  render: () => {
    const combatState = createMockCombatState('choosing_type', 1, 100, 80);
    
    // Set the mock combat state
    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};

/**
 * Choosing action after selecting type
 */
export const ChoosingAction: Story = {
  render: () => {
    const combatState = createMockCombatState('choosing_action', 3, 85, 60);
    combatState.playerChoice = { type: 'mind' };

    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};

/**
 * Mid-combat with battle history
 */
export const MidCombat: Story = {
  render: () => {
    const combatState = createMockCombatState(
      'choosing_type',
      3,
      77,
      58,
      0,
      mockBattleLog
    );

    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};

/**
 * Near friendship ending (2 mutual defends)
 */
export const NearFriendship: Story = {
  render: () => {
    const battleLogWithDefends: BattleLogEntry[] = [
      ...mockBattleLog,
      {
        round: 3,
        playerDecision: { type: 'heart', action: 'defend' },
        enemyDecision: { type: 'mind', action: 'defend' },
        advantage: 'none',
        damageToPlayer: 0,
        damageToEnemy: 0,
        playerHPAfter: 77,
        enemyHPAfter: 58,
        result: 'Both combatants chose to defend. Friendship +1',
        timestamp: Date.now(),
      },
      {
        round: 4,
        playerDecision: { type: 'body', action: 'defend' },
        enemyDecision: { type: 'heart', action: 'defend' },
        advantage: 'none',
        damageToPlayer: 0,
        damageToEnemy: 0,
        playerHPAfter: 77,
        enemyHPAfter: 58,
        result: 'Both combatants chose to defend. Friendship +2',
        timestamp: Date.now(),
      },
    ];

    const combatState = createMockCombatState(
      'choosing_type',
      5,
      77,
      58,
      2,
      battleLogWithDefends
    );

    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};

/**
 * Player low health scenario
 */
export const PlayerLowHealth: Story = {
  render: () => {
    const combatState = createMockCombatState(
      'choosing_type',
      6,
      15,
      45,
      0,
      mockBattleLog
    );

    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};

/**
 * Enemy low health scenario
 */
export const EnemyLowHealth: Story = {
  render: () => {
    const combatState = createMockCombatState(
      'choosing_type',
      8,
      72,
      8,
      0,
      mockBattleLog
    );

    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};

/**
 * Boss enemy variant
 */
export const BossFight: Story = {
  render: () => {
    const bossEnemy: Enemy = {
      ...mockEnemy,
      id: 'confirmation_bias_beast',
      name: 'Confirmation Bias Beast',
      type: 'boss',
      level: 10,
      health: 180,
      maxHealth: 250,
      image: '👾',
      description: 'A powerful creature that only sees what it wants to see.',
      baseStats: {
        heart: 12,
        body: 15,
        mind: 14,
      },
      derivedStats: {
        maxHP: 250,
        maxMP: 80,
        physicalAttack: 28,
        physicalDefense: 22,
        mentalAttack: 25,
        mentalDefense: 24,
        emotionalAttack: 22,
        emotionalDefense: 20,
        speed: 15,
        criticalChance: 0.15,
        evasion: 0.08,
      },
      experienceReward: 500,
      goldReward: 100,
    };

    const combatState: NewCombatState = {
      active: true,
      phase: 'choosing_type',
      round: 1,
      friendshipCounter: 0,
      player: mockPlayer,
      enemy: bossEnemy,
      playerChoice: {},
      enemyChoice: {},
      battleLog: [],
    };

    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};

/**
 * Long battle with extensive history
 */
export const LongBattle: Story = {
  render: () => {
    const extensiveBattleLog: BattleLogEntry[] = [
      mockBattleLog[0],
      mockBattleLog[1],
      {
        round: 3,
        playerDecision: { type: 'heart', action: 'attack' },
        enemyDecision: { type: 'mind', action: 'attack' },
        advantage: 'player',
        playerRoll: 19,
        enemyRoll: 11,
        damageToPlayer: 0,
        damageToEnemy: 18,
        playerHPAfter: 77,
        enemyHPAfter: 40,
        result: 'Critical hit! Your emotional attack was devastating!',
        timestamp: Date.now() - 15000,
      },
      {
        round: 4,
        playerDecision: { type: 'body', action: 'attack' },
        enemyDecision: { type: 'body', action: 'defend' },
        advantage: 'none',
        playerRoll: 14,
        enemyRoll: 14,
        damageToPlayer: 0,
        damageToEnemy: 10,
        playerHPAfter: 77,
        enemyHPAfter: 30,
        result: 'Neutral exchange. Your attack landed but was partially defended.',
        timestamp: Date.now() - 5000,
      },
    ];

    const combatState = createMockCombatState(
      'choosing_type',
      5,
      77,
      30,
      0,
      extensiveBattleLog
    );

    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState,
        combat: combatState,
      },
    });

    return <CombatModal open={true} onOpenChange={() => {}} />;
  },
};
