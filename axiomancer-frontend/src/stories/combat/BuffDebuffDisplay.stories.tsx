import type { Meta, StoryObj } from '@storybook/react';
import { BuffDebuffDisplay } from '../../components/game/Events/CombatModal/combat/BuffDebuffDisplay';
import { BuffDebuff } from '../../types/buffs';

const meta: Meta<typeof BuffDebuffDisplay> = {
    title: 'Combat/BuffDebuffDisplay',
    component: BuffDebuffDisplay,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        target: {
            control: 'radio',
            options: ['player', 'enemy'],
            description: 'Whether this is the player or enemy',
        },
    },
};

export default meta;
type Story = StoryObj<typeof BuffDebuffDisplay>;

// Mock buffs
const mockBuffs: BuffDebuff[] = [
    {
        id: 'mind_attack_followup',
        name: 'Mind Advantage',
        description: 'Your next Mind attack deals bonus damage',
        type: 'buff',
        effect: {
            statModifiers: {
                mindAttack: 5,
            },
            specialEffects: {
                fixedDamageNextTurn: 3,
            },
        },
        duration: 2,
        remainingTurns: 2,
        stackable: false,
        currentStacks: 1,
        icon: '🧠',
    },
    {
        id: 'body_reflection',
        name: 'Reflection',
        description: 'Reflects damage back to attacker',
        type: 'buff',
        effect: {
            statModifiers: {
                physicalDefense: 3,
            },
            specialEffects: {
                reflection: 2,
            },
        },
        duration: 3,
        remainingTurns: 3,
        stackable: false,
        currentStacks: 1,
        icon: '🛡️',
    },
    {
        id: 'heart_foresight',
        name: 'Foresight',
        description: 'You can see the enemy\'s next action',
        type: 'buff',
        effect: {
            percentageModifiers: {
                ailmentDefense: 20,
            },
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
    {
        id: 'body_defense_stance',
        name: 'Defensive Stance',
        description: 'Increased physical defense',
        type: 'buff',
        effect: {
            statModifiers: {
                physicalDefense: 8,
            },
            percentageModifiers: {
                physicalDefense: 15,
            },
        },
        duration: 4,
        remainingTurns: 4,
        stackable: true,
        currentStacks: 2,
        maxStacks: 3,
        icon: '💪',
    },
];

// Mock debuffs
const mockDebuffs: BuffDebuff[] = [
    {
        id: 'heart_attack_guilt',
        name: 'Guilt',
        description: 'Your heart is heavy with guilt, reducing ailment defense',
        type: 'debuff',
        effect: {
            statModifiers: {
                ailmentDefense: -5,
            },
            specialEffects: {
                damageOnAttack: 2,
            },
        },
        duration: 2,
        remainingTurns: 2,
        stackable: false,
        currentStacks: 1,
        icon: '💔',
    },
    {
        id: 'mind_confusion',
        name: 'Confusion',
        description: 'Your mind is clouded, reducing mind attack and defense',
        type: 'debuff',
        effect: {
            statModifiers: {
                mindAttack: -4,
                mindDefense: -3,
            },
            percentageModifiers: {
                mindAttack: -10,
            },
        },
        duration: 3,
        remainingTurns: 1,
        stackable: true,
        currentStacks: 1,
        maxStacks: 5,
        icon: '🤯',
    },
];

export const PlayerWithBuffsAndDebuffs: Story = {
    args: {
        buffs: mockBuffs,
        debuffs: mockDebuffs,
        target: 'player',
    },
};

export const EnemyWithBuffsAndDebuffs: Story = {
    args: {
        buffs: mockBuffs,
        debuffs: mockDebuffs,
        target: 'enemy',
    },
};

export const PlayerBuffsOnly: Story = {
    args: {
        buffs: mockBuffs,
        debuffs: [],
        target: 'player',
    },
};

export const PlayerDebuffsOnly: Story = {
    args: {
        buffs: [],
        debuffs: mockDebuffs,
        target: 'player',
    },
};

export const NoActiveEffects: Story = {
    args: {
        buffs: [],
        debuffs: [],
        target: 'player',
    },
};

export const SingleBuff: Story = {
    args: {
        buffs: [mockBuffs[0]],
        debuffs: [],
        target: 'player',
    },
};

export const SingleDebuff: Story = {
    args: {
        buffs: [],
        debuffs: [mockDebuffs[0]],
        target: 'enemy',
    },
};

export const ManyEffects: Story = {
    args: {
        buffs: [
            ...mockBuffs,
            {
                id: 'mind_clarity',
                name: 'Mental Clarity',
                description: 'Your mind is clear and focused',
                type: 'buff',
                effect: {
                    statModifiers: {
                        mindAttack: 6,
                        mindDefense: 4,
                    },
                },
                duration: 3,
                remainingTurns: 2,
                stackable: false,
                currentStacks: 1,
                icon: '✨',
            },
        ],
        debuffs: [
            ...mockDebuffs,
            {
                id: 'body_weakness',
                name: 'Physical Weakness',
                description: 'Your body feels weak and vulnerable',
                type: 'debuff',
                effect: {
                    statModifiers: {
                        physicalAttack: -6,
                        physicalDefense: -4,
                    },
                },
                duration: 5,
                remainingTurns: 3,
                stackable: false,
                currentStacks: 1,
                icon: '🤕',
            },
        ],
        target: 'player',
    },
};

