import type { Meta, StoryObj } from '@storybook/react-vite';
import { Panel } from '../components/shared/Panel';

const meta = {
  title: 'Shared/Panel',
  component: Panel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'portrait', 'stats', 'equipment', 'inventory', 'info'],
      description: 'Panel variant style',
    },
    width: {
      control: 'text',
      description: 'Panel width (CSS value)',
    },
    maxWidth: {
      control: 'text',
      description: 'Panel max width',
    },
    title: {
      control: 'text',
      description: 'Panel title',
    },
    titleAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Title alignment',
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Panel padding',
    },
    fullHeight: {
      control: 'boolean',
      description: 'Full height panel',
    },
    scrollable: {
      control: 'boolean',
      description: 'Enable scrolling',
    },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Panel',
    children: (
      <div>
        <p style={{ color: '#FFFFFF' }}>This is a default panel with some content.</p>
      </div>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Character Information',
    children: (
      <div>
        <p style={{ color: '#FFFFFF' }}>Name: Aragorn</p>
        <p style={{ color: '#FFFFFF' }}>Class: Ranger</p>
        <p style={{ color: '#FFFFFF' }}>Level: 42</p>
      </div>
    ),
  },
};

export const Portrait: Story = {
  args: {
    variant: 'portrait',
    title: 'Character Portrait',
    children: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '150px', 
          height: '150px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          🧙
        </div>
        <h3 style={{ color: '#DAA520', margin: '0.5rem 0' }}>Gandalf</h3>
        <p style={{ color: '#CCCCCC', margin: 0 }}>Level 99 Wizard</p>
      </div>
    ),
  },
};

export const Stats: Story = {
  args: {
    variant: 'stats',
    title: 'Character Stats',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {['Strength: 18', 'Dexterity: 14', 'Constitution: 16', 'Intelligence: 10', 'Wisdom: 12', 'Charisma: 8'].map((stat, i) => (
          <div key={i} style={{ 
            padding: '0.5rem', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '4px',
            color: '#FFFFFF'
          }}>
            {stat}
          </div>
        ))}
      </div>
    ),
  },
};

export const Equipment: Story = {
  args: {
    variant: 'equipment',
    title: 'Equipment',
    children: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
        {['⚔️ Sword', '🛡️ Shield', '🎩 Helmet', '👕 Armor', '👢 Boots', '💍 Ring'].map((item, i) => (
          <div key={i} style={{ 
            padding: '1rem', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '8px', 
            textAlign: 'center',
            color: '#DAA520'
          }}>
            {item}
          </div>
        ))}
      </div>
    ),
  },
};

export const Inventory: Story = {
  args: {
    variant: 'inventory',
    title: 'Inventory',
    scrollable: true,
    children: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {['🗡️', '🏹', '🛡️', '💎', '🔑', '📜', '⚗️', '🪙', '🍖', '🧪', '📿', '🔮'].map((icon, i) => (
          <div key={i} style={{ 
            width: '60px',
            height: '60px',
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '8px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            border: '2px solid #666'
          }}>
            {icon}
          </div>
        ))}
      </div>
    ),
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Important Notice',
    titleAlign: 'center',
    children: (
      <p style={{ color: '#FFFFFF', textAlign: 'center', margin: 0 }}>
        Your quest has been updated. Check your journal for more details.
      </p>
    ),
  },
};

export const CenteredTitle: Story = {
  args: {
    title: 'Centered Title',
    titleAlign: 'center',
    children: (
      <p style={{ color: '#FFFFFF', textAlign: 'center' }}>
        This panel has a centered title.
      </p>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    title: 'Small Padding',
    padding: 'sm',
    children: (
      <p style={{ color: '#FFFFFF' }}>This panel has small padding.</p>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    title: 'Large Padding',
    padding: 'xl',
    children: (
      <p style={{ color: '#FFFFFF' }}>This panel has extra large padding.</p>
    ),
  },
};

export const CustomWidth: Story = {
  args: {
    title: 'Custom Width Panel',
    width: '500px',
    children: (
      <p style={{ color: '#FFFFFF' }}>This panel has a custom width of 500px.</p>
    ),
  },
};

export const ScrollableContent: Story = {
  args: {
    title: 'Scrollable Panel',
    scrollable: true,
    maxWidth: '400px',
    children: (
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ color: '#FFFFFF' }}>
            This is line {i + 1} of scrollable content.
          </p>
        ))}
      </div>
    ),
  },
};
