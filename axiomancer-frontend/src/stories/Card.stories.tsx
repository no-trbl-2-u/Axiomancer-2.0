import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/shared/Card';

const meta = {
  title: 'Shared/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'skill', 'item', 'equipment', 'resource', 'choice'],
      description: 'Card variant style',
    },
    isSelected: {
      control: 'boolean',
      description: 'Selected state',
    },
    isEquipped: {
      control: 'boolean',
      description: 'Equipped state',
    },
    isEmpty: {
      control: 'boolean',
      description: 'Empty state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Card Content',
    variant: 'default',
  },
};

export const Skill: Story = {
  args: {
    variant: 'skill',
    children: (
      <div>
        <h3 style={{ margin: 0, color: '#DAA520' }}>Fireball</h3>
        <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
          Launch a powerful fireball at your enemy
        </p>
        <div style={{ fontSize: '0.8rem', color: '#4169E1' }}>Cost: 10 MP</div>
      </div>
    ),
  },
};

export const SkillEquipped: Story = {
  args: {
    variant: 'skill',
    isEquipped: true,
    children: (
      <div>
        <h3 style={{ margin: 0, color: '#DAA520' }}>Healing Light</h3>
        <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
          Restore health to yourself or an ally
        </p>
        <div style={{ fontSize: '0.8rem', color: '#4169E1' }}>Cost: 15 MP</div>
      </div>
    ),
  },
};

export const Item: Story = {
  args: {
    variant: 'item',
    children: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>🗡️</div>
        <div style={{ fontSize: '0.7rem', color: '#DAA520' }}>Sword</div>
      </div>
    ),
  },
};

export const Equipment: Story = {
  args: {
    variant: 'equipment',
    children: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>⚔️</div>
        <div style={{ fontSize: '0.75rem', color: '#DAA520', marginTop: '4px' }}>
          Steel Sword
        </div>
      </div>
    ),
  },
};

export const EquipmentEmpty: Story = {
  args: {
    variant: 'equipment',
    isEmpty: true,
    children: (
      <div style={{ textAlign: 'center', color: '#888888' }}>
        <div style={{ fontSize: '1.5rem' }}>📦</div>
        <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Empty Slot</div>
      </div>
    ),
  },
};

export const Resource: Story = {
  args: {
    variant: 'resource',
    children: (
      <div>
        <div style={{ fontSize: '0.8rem', color: '#CCCCCC' }}>Gold</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#DAA520' }}>
          1,250
        </div>
      </div>
    ),
  },
};

export const Choice: Story = {
  args: {
    variant: 'choice',
    children: (
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: '#DAA520' }}>Option 1</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#FFFFFF' }}>
          Choose the path of wisdom and gain knowledge
        </p>
      </div>
    ),
  },
};

export const ChoiceSelected: Story = {
  args: {
    variant: 'choice',
    isSelected: true,
    children: (
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: '#DAA520' }}>Option 2</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#FFFFFF' }}>
          Choose the path of strength and gain power
        </p>
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    disabled: true,
    children: 'Disabled Card',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '600px' }}>
      <Card variant="default">
        <div>Default Card</div>
      </Card>
      <Card variant="skill">
        <div>
          <h4 style={{ margin: 0, color: '#DAA520' }}>Skill Card</h4>
          <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>Skill description</p>
        </div>
      </Card>
      <Card variant="item">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>🗡️</div>
          <div style={{ fontSize: '0.7rem', color: '#DAA520' }}>Item</div>
        </div>
      </Card>
      <Card variant="equipment">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem' }}>⚔️</div>
          <div style={{ fontSize: '0.75rem', color: '#DAA520' }}>Equipment</div>
        </div>
      </Card>
      <Card variant="resource">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#CCCCCC' }}>Resource</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#DAA520' }}>100</div>
        </div>
      </Card>
      <Card variant="choice">
        <div>
          <h5 style={{ margin: 0, color: '#DAA520' }}>Choice</h5>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Choice description</p>
        </div>
      </Card>
    </div>
  ),
};
