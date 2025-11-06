import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatRow, StatCategory, StatGrid, StatGridItem } from '../components/shared/StatDisplay';

const meta = {
  title: 'Shared/StatDisplay',
  component: StatRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultStatRow: Story = {
  args: {
    label: 'Strength',
    value: 18,
  },
};

export const StatRowWithIcon: Story = {
  args: {
    label: 'Health',
    value: '100/100',
    icon: '❤️',
  },
};

export const StatRowClickable: Story = {
  args: {
    label: 'Experience',
    value: '1,250 XP',
    icon: '⭐',
    onClick: () => alert('Clicked!'),
  },
};

export const AssignmentVariant: Story = {
  args: {
    label: 'Intelligence',
    value: 14,
    variant: 'assignment',
  },
};

export const MultipleStatRows: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <StatRow label="Strength" value={18} icon="💪" />
      <StatRow label="Dexterity" value={14} icon="🏃" />
      <StatRow label="Constitution" value={16} icon="❤️" />
      <StatRow label="Intelligence" value={10} icon="🧠" />
      <StatRow label="Wisdom" value={12} icon="🦉" />
      <StatRow label="Charisma" value={8} icon="✨" />
    </div>
  ),
};

export const StatCategoryDefault: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <StatCategory title="Primary Stats" icon="⚔️">
        <StatRow label="Attack" value={45} />
        <StatRow label="Defense" value={32} />
        <StatRow label="Speed" value={28} />
      </StatCategory>
    </div>
  ),
};

export const StatCategoryCompact: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <StatCategory title="Combat Stats" variant="compact">
        <StatRow label="Critical Hit" value="15%" />
        <StatRow label="Dodge" value="22%" />
        <StatRow label="Block" value="18%" />
      </StatCategory>
    </div>
  ),
};

export const MultipleCategories: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <StatCategory title="Attributes" icon="💪">
        <StatRow label="Strength" value={18} />
        <StatRow label="Dexterity" value={14} />
        <StatRow label="Constitution" value={16} />
      </StatCategory>
      
      <StatCategory title="Combat" icon="⚔️">
        <StatRow label="Attack Power" value={45} />
        <StatRow label="Defense" value={32} />
        <StatRow label="Critical Rate" value="15%" />
      </StatCategory>
      
      <StatCategory title="Resources" icon="💎">
        <StatRow label="Gold" value="1,250" icon="💰" />
        <StatRow label="Gems" value={42} icon="💎" />
        <StatRow label="Keys" value={3} icon="🔑" />
      </StatCategory>
    </div>
  ),
};

export const StatGridDefault: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <StatGrid columns={3}>
        <StatGridItem label="HP" value="100/100" />
        <StatGridItem label="MP" value="50/50" />
        <StatGridItem label="SP" value="25/25" />
        <StatGridItem label="ATK" value={45} />
        <StatGridItem label="DEF" value={32} />
        <StatGridItem label="SPD" value={28} />
      </StatGrid>
    </div>
  ),
};

export const StatGrid2Columns: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <StatGrid columns={2}>
        <StatGridItem label="Level" value={42} />
        <StatGridItem label="EXP" value="1,250" />
        <StatGridItem label="Gold" value="5,430" />
        <StatGridItem label="Gems" value={42} />
      </StatGrid>
    </div>
  ),
};

export const StatGrid4Columns: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <StatGrid columns={4}>
        <StatGridItem label="STR" value={18} />
        <StatGridItem label="DEX" value={14} />
        <StatGridItem label="CON" value={16} />
        <StatGridItem label="INT" value={10} />
        <StatGridItem label="WIS" value={12} />
        <StatGridItem label="CHA" value={8} />
        <StatGridItem label="LUK" value={15} />
        <StatGridItem label="VIT" value={20} />
      </StatGrid>
    </div>
  ),
};

export const CompleteCharacterSheet: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ color: '#DAA520', margin: 0 }}>Character Statistics</h2>
      
      <StatGrid columns={3}>
        <StatGridItem label="Level" value={42} />
        <StatGridItem label="EXP" value="1,250" />
        <StatGridItem label="Gold" value="5,430" />
      </StatGrid>
      
      <StatCategory title="Core Stats" icon="⚔️">
        <StatRow label="Health Points" value="100/100" icon="❤️" />
        <StatRow label="Mana Points" value="50/50" icon="💙" />
        <StatRow label="Stamina" value="75/75" icon="⚡" />
      </StatCategory>
      
      <StatCategory title="Attributes">
        <StatRow label="Strength" value={18} />
        <StatRow label="Dexterity" value={14} />
        <StatRow label="Constitution" value={16} />
        <StatRow label="Intelligence" value={10} />
        <StatRow label="Wisdom" value={12} />
        <StatRow label="Charisma" value={8} />
      </StatCategory>
      
      <StatCategory title="Combat Stats" variant="compact">
        <StatRow label="Attack Power" value={45} />
        <StatRow label="Defense" value={32} />
        <StatRow label="Critical Hit" value="15%" />
        <StatRow label="Dodge" value="22%" />
      </StatCategory>
    </div>
  ),
};
