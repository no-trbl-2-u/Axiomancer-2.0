import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slot, SlotsContainer } from '../components/shared/Slot';

const meta = {
  title: 'Shared/Slot',
  component: Slot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isEmpty: {
      control: 'boolean',
      description: 'Whether slot is empty',
    },
    variant: {
      control: 'select',
      options: ['equipment', 'skill', 'inventory'],
      description: 'Slot variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Slot size',
    },
    label: {
      control: 'text',
      description: 'Slot label',
    },
    itemName: {
      control: 'text',
      description: 'Item name',
    },
    cost: {
      control: 'number',
      description: 'Mana cost (for skills)',
    },
  },
} satisfies Meta<typeof Slot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyEquipment: Story = {
  args: {
    isEmpty: true,
    variant: 'equipment',
    label: 'Weapon',
    icon: '⚔️',
  },
};

export const EquippedWeapon: Story = {
  args: {
    isEmpty: false,
    variant: 'equipment',
    label: 'Weapon',
    itemIcon: '🗡️',
    itemName: 'Steel Sword',
  },
};

export const EquippedArmor: Story = {
  args: {
    isEmpty: false,
    variant: 'equipment',
    label: 'Armor',
    itemIcon: '🛡️',
    itemName: 'Iron Shield',
  },
};

export const EmptySkill: Story = {
  args: {
    isEmpty: true,
    variant: 'skill',
    label: 'Skill Slot',
    icon: '📚',
  },
};

export const EquippedSkill: Story = {
  args: {
    isEmpty: false,
    variant: 'skill',
    itemIcon: '🔥',
    itemName: 'Fireball',
    cost: 10,
  },
};

export const SmallSlot: Story = {
  args: {
    isEmpty: false,
    variant: 'equipment',
    size: 'sm',
    itemIcon: '💍',
    itemName: 'Ring',
  },
};

export const MediumSlot: Story = {
  args: {
    isEmpty: false,
    variant: 'equipment',
    size: 'md',
    itemIcon: '⚔️',
    itemName: 'Sword',
  },
};

export const LargeSlot: Story = {
  args: {
    isEmpty: false,
    variant: 'equipment',
    size: 'lg',
    itemIcon: '🛡️',
    itemName: 'Shield',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Slot isEmpty={false} variant="equipment" size="sm" itemIcon="💍" itemName="Ring" />
      <Slot isEmpty={false} variant="equipment" size="md" itemIcon="⚔️" itemName="Sword" />
      <Slot isEmpty={false} variant="equipment" size="lg" itemIcon="🛡️" itemName="Shield" />
    </div>
  ),
};

export const EquipmentSlots: Story = {
  render: () => (
    <SlotsContainer variant="equipment">
      <Slot isEmpty={false} label="Weapon" itemIcon="🗡️" itemName="Steel Sword" />
      <Slot isEmpty={false} label="Shield" itemIcon="🛡️" itemName="Iron Shield" />
      <Slot isEmpty={true} label="Helmet" icon="🎩" />
      <Slot isEmpty={false} label="Armor" itemIcon="👕" itemName="Chain Mail" />
      <Slot isEmpty={true} label="Boots" icon="👢" />
      <Slot isEmpty={false} label="Ring" itemIcon="💍" itemName="Gold Ring" />
    </SlotsContainer>
  ),
};

export const SkillSlots: Story = {
  render: () => (
    <SlotsContainer variant="skill">
      <Slot isEmpty={false} variant="skill" itemIcon="🔥" itemName="Fireball" cost={10} />
      <Slot isEmpty={false} variant="skill" itemIcon="❄️" itemName="Ice Shard" cost={8} />
      <Slot isEmpty={false} variant="skill" itemIcon="⚡" itemName="Lightning" cost={12} />
      <Slot isEmpty={true} variant="skill" icon="📚" />
      <Slot isEmpty={true} variant="skill" icon="📚" />
      <Slot isEmpty={true} variant="skill" icon="📚" />
    </SlotsContainer>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Slot isEmpty={false} variant="equipment">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>⚔️</div>
        <div style={{ fontSize: '0.75rem', color: '#DAA520', fontWeight: 'bold' }}>
          Legendary Sword
        </div>
        <div style={{ fontSize: '0.65rem', color: '#4169E1', marginTop: '0.25rem' }}>
          +50 ATK
        </div>
      </div>
    </Slot>
  ),
};
