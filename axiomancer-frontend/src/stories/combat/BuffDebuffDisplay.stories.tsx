import type { Meta, StoryObj } from '@storybook/react';
import { BuffDebuffDisplay } from '../../components/combat/BuffDebuffDisplay';
import type { BuffDebuff } from '../../types/game';

const meta = {
  title: 'Axiomance/BuffDebuffDisplay',
  component: BuffDebuffDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    target: {
      control: 'select',
      options: ['player', 'enemy'],
      description: 'Whether this is for player or enemy',
    },
  },
} satisfies Meta<typeof BuffDebuffDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock buff data
const mockBuffs: BuffDebuff[] = [
  {
    id: 'body_defense_stance',
    name: 'Defense Stance',
    description: 'Increased physical defense through disciplined posture',
    type: 'buff',
    effect: {
      statModifiers: {
        physicalDefense: 10,
      },
    },
    duration: 3,
    remainingTurns: 2,
    stackable: false,
    currentStacks: 1,
    icon: '🛡️',
  },
  {
    id: 'mind_counter_argument',
    name: 'Counter Argument',
    description: 'Prepared to counter opponent\'s logic',
    type: 'buff',
    effect: {
      statModifiers: {
        mindDefense: 8,
      },
    },
    duration: 2,
    remainingTurns: 1,
    stackable: false,
    currentStacks: 1,
    icon: '🎯',
  },
  {
    id: 'heart_foresight',
    name: 'Foresight',
    description: 'Can see the enemy\'s next move',
    type: 'buff',
    effect: {
      specialEffects: {
        foresight: true,
      },
    },
    duration: 1,
    remainingTurns: 1,
    stackable: false,
    currentStacks: 1,
    icon: '👁️',
  },
];

// Mock debuff data
const mockDebuffs: BuffDebuff[] = [
  {
    id: 'mind_attack_followup',
    name: 'Cognitive Dissonance',
    description: 'Confused thoughts will deal damage next turn',
    type: 'debuff',
    effect: {
      specialEffects: {
        fixedDamageNextTurn: 15,
      },
    },
    duration: 1,
    remainingTurns: 1,
    stackable: false,
    currentStacks: 1,
    icon: '🤯',
  },
  {
    id: 'heart_attack_guilt',
    name: 'Guilt',
    description: 'Emotional burden reduces effectiveness',
    type: 'debuff',
    effect: {
      statModifiers: {
        ailmentAttack: -5,
        ailmentDefense: -5,
      },
    },
    duration: 3,
    remainingTurns: 2,
    stackable: true,
    maxStacks: 3,
    currentStacks: 2,
    icon: '💔',
  },
];

export const PlayerNoEffects: Story = {
  args: {
    buffs: [],
    debuffs: [],
    target: 'player',
  },
};

export const PlayerWithBuffs: Story = {
  args: {
    buffs: mockBuffs,
    debuffs: [],
    target: 'player',
  },
};

export const PlayerWithDebuffs: Story = {
  args: {
    buffs: [],
    debuffs: mockDebuffs,
    target: 'player',
  },
};

export const PlayerWithBoth: Story = {
  args: {
    buffs: mockBuffs,
    debuffs: mockDebuffs,
    target: 'player',
  },
};

export const EnemyWithEffects: Story = {
  args: {
    buffs: [
      {
        id: 'body_reflection',
        name: 'Reflection',
        description: 'Reflects damage back to attacker',
        type: 'buff',
        effect: {
          specialEffects: {
            reflection: 10,
          },
        },
        duration: 2,
        remainingTurns: 2,
        stackable: false,
        currentStacks: 1,
        icon: '🪞',
      },
    ],
    debuffs: [
      {
        id: 'weakened',
        name: 'Weakened',
        description: 'Reduced attack power',
        type: 'debuff',
        effect: {
          percentageModifiers: {
            physicalAttack: -20,
          },
        },
        duration: 3,
        remainingTurns: 3,
        stackable: false,
        currentStacks: 1,
        icon: '😓',
      },
    ],
    target: 'enemy',
  },
};

export const ManyEffects: Story = {
  args: {
    buffs: [
      ...mockBuffs,
      {
        id: 'strength_boost',
        name: 'Strength Boost',
        description: 'Increased physical power',
        type: 'buff',
        effect: {
          statModifiers: {
            physicalAttack: 15,
          },
        },
        duration: 5,
        remainingTurns: 4,
        stackable: true,
        maxStacks: 5,
        currentStacks: 3,
        icon: '💪',
      },
      {
        id: 'clarity',
        name: 'Mental Clarity',
        description: 'Enhanced mental acuity',
        type: 'buff',
        effect: {
          percentageModifiers: {
            mindAttack: 25,
          },
        },
        duration: 2,
        remainingTurns: 2,
        stackable: false,
        currentStacks: 1,
        icon: '🧠',
      },
    ],
    debuffs: [
      ...mockDebuffs,
      {
        id: 'poisoned',
        name: 'Poisoned',
        description: 'Taking damage over time',
        type: 'debuff',
        effect: {
          specialEffects: {
            damageOnAttack: 5,
          },
        },
        duration: 4,
        remainingTurns: 3,
        stackable: true,
        maxStacks: 10,
        currentStacks: 2,
        icon: '☠️',
      },
    ],
    target: 'player',
  },
};

export const StackingDebuff: Story = {
  args: {
    buffs: [],
    debuffs: [
      {
        id: 'stacking_debuff',
        name: 'Accumulating Doubt',
        description: 'Each stack reduces mental clarity',
        type: 'debuff',
        effect: {
          statModifiers: {
            mindDefense: -3,
          },
        },
        duration: 5,
        remainingTurns: 4,
        stackable: true,
        maxStacks: 5,
        currentStacks: 4,
        icon: '🌀',
      },
    ],
    target: 'player',
  },
};
