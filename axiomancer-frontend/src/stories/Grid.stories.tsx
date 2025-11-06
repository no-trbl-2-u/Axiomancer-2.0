import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, FlexContainer, Container, EmptyState } from '../components/shared/Grid';
import { Card } from '../components/shared/Card';

const meta = {
  title: 'Shared/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'equipment', 'item', 'skill', 'resource', 'category'],
      description: 'Grid layout variant',
    },
    columns: {
      control: 'number',
      description: 'Number of columns',
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid items',
    },
    responsive: {
      control: 'boolean',
      description: 'Enable responsive behavior',
    },
    alignContent: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Align content vertically',
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    gap: 'md',
    children: (
      <>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} variant="default">
            <div style={{ padding: '1rem' }}>Item {i}</div>
          </Card>
        ))}
      </>
    ),
  },
};

export const Equipment: Story = {
  args: {
    variant: 'equipment',
    gap: 'md',
    children: (
      <>
        <Card variant="equipment">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>🗡️</div>
            <div style={{ fontSize: '0.75rem', color: '#DAA520' }}>Sword</div>
          </div>
        </Card>
        <Card variant="equipment">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>🛡️</div>
            <div style={{ fontSize: '0.75rem', color: '#DAA520' }}>Shield</div>
          </div>
        </Card>
        <Card variant="equipment" isEmpty>
          <div style={{ textAlign: 'center', color: '#888' }}>Empty</div>
        </Card>
      </>
    ),
  },
};

export const Items: Story = {
  args: {
    variant: 'item',
    gap: 'sm',
    children: (
      <>
        {['⚔️', '🗡️', '🛡️', '🏹', '🪓', '🔨', '💎', '💰', '🔑', '📜'].map((icon, i) => (
          <Card key={i} variant="item">
            <div style={{ fontSize: '2rem' }}>{icon}</div>
          </Card>
        ))}
      </>
    ),
  },
};

export const Skills: Story = {
  args: {
    variant: 'skill',
    gap: 'lg',
    children: (
      <>
        <Card variant="skill">
          <h3 style={{ margin: 0, color: '#DAA520' }}>Fireball</h3>
          <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>Launch a powerful fireball</p>
          <div style={{ fontSize: '0.8rem', color: '#4169E1' }}>Cost: 10 MP</div>
        </Card>
        <Card variant="skill">
          <h3 style={{ margin: 0, color: '#DAA520' }}>Ice Shard</h3>
          <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>Freeze your enemies</p>
          <div style={{ fontSize: '0.8rem', color: '#4169E1' }}>Cost: 8 MP</div>
        </Card>
        <Card variant="skill">
          <h3 style={{ margin: 0, color: '#DAA520' }}>Healing Light</h3>
          <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>Restore health</p>
          <div style={{ fontSize: '0.8rem', color: '#4169E1' }}>Cost: 15 MP</div>
        </Card>
      </>
    ),
  },
};

export const Resources: Story = {
  args: {
    variant: 'resource',
    gap: 'md',
    children: (
      <>
        <Card variant="resource">
          <div style={{ fontSize: '0.8rem', color: '#CCCCCC' }}>Gold</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#DAA520' }}>1,250</div>
        </Card>
        <Card variant="resource">
          <div style={{ fontSize: '0.8rem', color: '#CCCCCC' }}>Silver</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#C0C0C0' }}>5,430</div>
        </Card>
        <Card variant="resource">
          <div style={{ fontSize: '0.8rem', color: '#CCCCCC' }}>Gems</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4169E1' }}>42</div>
        </Card>
      </>
    ),
  },
};

export const CustomColumns: Story = {
  args: {
    columns: 4,
    gap: 'md',
    children: (
      <>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} variant="default">
            <div style={{ padding: '1rem', textAlign: 'center' }}>Item {i}</div>
          </Card>
        ))}
      </>
    ),
  },
};

// FlexContainer Stories
export const FlexRow: StoryObj = {
  render: () => (
    <FlexContainer direction="row" gap="md" align="center">
      <Card variant="default"><div style={{ padding: '1rem' }}>Item 1</div></Card>
      <Card variant="default"><div style={{ padding: '1rem' }}>Item 2</div></Card>
      <Card variant="default"><div style={{ padding: '1rem' }}>Item 3</div></Card>
    </FlexContainer>
  ),
};

export const FlexColumn: StoryObj = {
  render: () => (
    <FlexContainer direction="column" gap="md" align="center">
      <Card variant="default"><div style={{ padding: '1rem' }}>Item 1</div></Card>
      <Card variant="default"><div style={{ padding: '1rem' }}>Item 2</div></Card>
      <Card variant="default"><div style={{ padding: '1rem' }}>Item 3</div></Card>
    </FlexContainer>
  ),
};

export const FlexSpaceBetween: StoryObj = {
  render: () => (
    <FlexContainer direction="row" gap="md" justify="space-between" fullWidth>
      <Card variant="default"><div style={{ padding: '1rem' }}>Left</div></Card>
      <Card variant="default"><div style={{ padding: '1rem' }}>Center</div></Card>
      <Card variant="default"><div style={{ padding: '1rem' }}>Right</div></Card>
    </FlexContainer>
  ),
};

// Container Stories
export const ContainerDefault: StoryObj = {
  render: () => (
    <Container variant="default" padding="lg">
      <h2>Default Container</h2>
      <p>This is a default container with padding.</p>
    </Container>
  ),
};

export const ContainerPage: StoryObj = {
  render: () => (
    <Container variant="page">
      <h1 style={{ color: '#DAA520' }}>Page Container</h1>
      <p style={{ color: '#FFFFFF' }}>This container is designed for full page layouts.</p>
    </Container>
  ),
};

export const ContainerCentered: StoryObj = {
  render: () => (
    <Container centered fullHeight>
      <Card variant="default">
        <div style={{ padding: '2rem' }}>
          <h2>Centered Content</h2>
          <p>This content is centered both horizontally and vertically.</p>
        </div>
      </Card>
    </Container>
  ),
};

// EmptyState Stories
export const EmptyStateDefault: StoryObj = {
  render: () => (
    <EmptyState variant="default">
      No items found
    </EmptyState>
  ),
};

export const EmptyStateInventory: StoryObj = {
  render: () => (
    <EmptyState variant="inventory">
      Your inventory is empty
    </EmptyState>
  ),
};

export const EmptyStateSkills: StoryObj = {
  render: () => (
    <EmptyState variant="skills">
      <div className="icon">📚</div>
      <div>No skills learned yet</div>
    </EmptyState>
  ),
};
