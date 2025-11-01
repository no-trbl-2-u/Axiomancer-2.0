import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipProvider } from '../components/shared/Tooltip';
import { Button } from '../components/shared/Button';

const meta = {
  title: 'Shared/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Side where tooltip appears',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment of tooltip',
    },
    delayDuration: {
      control: 'number',
      description: 'Delay before showing tooltip (ms)',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button>Hover me</Button>,
  },
};

export const TopSide: Story = {
  args: {
    content: 'Tooltip on top',
    side: 'top',
    children: <Button>Hover for tooltip on top</Button>,
  },
};

export const RightSide: Story = {
  args: {
    content: 'Tooltip on right',
    side: 'right',
    children: <Button>Hover for tooltip on right</Button>,
  },
};

export const BottomSide: Story = {
  args: {
    content: 'Tooltip on bottom',
    side: 'bottom',
    children: <Button>Hover for tooltip on bottom</Button>,
  },
};

export const LeftSide: Story = {
  args: {
    content: 'Tooltip on left',
    side: 'left',
    children: <Button>Hover for tooltip on left</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content: 'This is a much longer tooltip with multiple sentences. It demonstrates how the tooltip handles longer content and wraps text appropriately within the max-width constraint.',
    children: <Button>Hover for long tooltip</Button>,
  },
};

export const RichContent: Story = {
  args: {
    content: (
      <div>
        <strong style={{ color: '#DAA520' }}>Fireball</strong>
        <div style={{ marginTop: '0.5rem' }}>
          Damage: 50-75
        </div>
        <div style={{ color: '#4169E1' }}>
          Cost: 10 MP
        </div>
      </div>
    ),
    children: <Button>Hover for rich tooltip</Button>,
  },
};

export const NoDelay: Story = {
  args: {
    content: 'This tooltip appears immediately',
    delayDuration: 0,
    children: <Button>Instant tooltip</Button>,
  },
};

export const LongDelay: Story = {
  args: {
    content: 'This tooltip has a longer delay',
    delayDuration: 1000,
    children: <Button>Delayed tooltip (1s)</Button>,
  },
};

export const AlignStart: Story = {
  args: {
    content: 'Aligned to start',
    side: 'bottom',
    align: 'start',
    children: <Button>Start aligned tooltip</Button>,
  },
};

export const AlignCenter: Story = {
  args: {
    content: 'Aligned to center',
    side: 'bottom',
    align: 'center',
    children: <Button>Center aligned tooltip</Button>,
  },
};

export const AlignEnd: Story = {
  args: {
    content: 'Aligned to end',
    side: 'bottom',
    align: 'end',
    children: <Button>End aligned tooltip</Button>,
  },
};

export const OnIcon: Story = {
  render: () => (
    <Tooltip content="Click for more information">
      <button style={{ 
        background: 'none', 
        border: 'none', 
        fontSize: '1.5rem', 
        cursor: 'pointer',
        color: '#4169E1'
      }}>
        ℹ️
      </button>
    </Tooltip>
  ),
};

export const OnText: Story = {
  render: () => (
    <div style={{ color: '#FFFFFF' }}>
      This is some text with a{' '}
      <Tooltip content="This is a tooltip on inline text">
        <span style={{ 
          color: '#DAA520', 
          textDecoration: 'underline', 
          cursor: 'help',
          fontWeight: 'bold'
        }}>
          tooltip
        </span>
      </Tooltip>
      {' '}embedded in it.
    </div>
  ),
};

export const MultipleTooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Tooltip content="Tooltip 1" side="top">
        <Button variant="primary">Button 1</Button>
      </Tooltip>
      <Tooltip content="Tooltip 2" side="top">
        <Button variant="secondary">Button 2</Button>
      </Tooltip>
      <Tooltip content="Tooltip 3" side="top">
        <Button variant="danger">Button 3</Button>
      </Tooltip>
    </div>
  ),
};

export const ItemTooltip: Story = {
  render: () => (
    <Tooltip
      content={
        <div>
          <div style={{ fontWeight: 'bold', color: '#DAA520', marginBottom: '0.5rem' }}>
            Steel Sword
          </div>
          <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            Damage: 25-40
          </div>
          <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            Type: One-handed
          </div>
          <div style={{ fontSize: '0.75rem', color: '#228B22', marginTop: '0.5rem' }}>
            +10 Attack Power
          </div>
        </div>
      }
      side="right"
    >
      <div style={{ 
        padding: '1rem',
        background: 'rgba(0,0,0,0.3)',
        border: '2px solid #DAA520',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem' }}>⚔️</div>
        <div style={{ fontSize: '0.8rem', color: '#DAA520', marginTop: '0.25rem' }}>
          Steel Sword
        </div>
      </div>
    </Tooltip>
  ),
};

export const SkillTooltip: Story = {
  render: () => (
    <Tooltip
      content={
        <div>
          <div style={{ fontWeight: 'bold', color: '#DAA520', marginBottom: '0.5rem' }}>
            Fireball
          </div>
          <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
            Launch a powerful fireball at your target, dealing fire damage.
          </div>
          <div style={{ fontSize: '0.8rem', color: '#4169E1' }}>
            Cost: 10 MP
          </div>
          <div style={{ fontSize: '0.8rem', color: '#DC143C' }}>
            Damage: 50-75
          </div>
        </div>
      }
      side="top"
    >
      <div style={{ 
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(45deg, rgba(220, 20, 60, 0.3), rgba(139, 0, 0, 0.3))',
        border: '2px solid #DC143C',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#FFFFFF',
        fontWeight: 'bold'
      }}>
        🔥 Fireball
      </div>
    </Tooltip>
  ),
};
