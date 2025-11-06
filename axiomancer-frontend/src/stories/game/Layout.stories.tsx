import type { Meta, StoryObj } from '@storybook/react-vite';
import { Layout } from '../../components/game/Layout';
import { Panel } from '../../components/shared/Panel';
import { Title } from '../../components/shared/Text';

const meta = {
  title: 'Axiomance/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Layout>
      <div style={{ textAlign: 'center', color: '#DAA520' }}>
        <h1>Content goes here</h1>
        <p style={{ color: '#FFFFFF' }}>This layout centers content vertically and horizontally</p>
      </div>
    </Layout>
  ),
};

export const WithPanel: Story = {
  render: () => (
    <Layout>
      <Panel title="Game Screen" width="600px">
        <p style={{ color: '#FFFFFF' }}>
          The Layout component provides a consistent structure for game screens.
        </p>
        <p style={{ color: '#FFFFFF', marginTop: '1rem' }}>
          Content is centered both vertically and horizontally.
        </p>
      </Panel>
    </Layout>
  ),
};

export const WithMultiplePanels: Story = {
  render: () => (
    <Layout>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Panel title="Character" width="300px">
          <p style={{ color: '#FFFFFF' }}>Level: 42</p>
          <p style={{ color: '#FFFFFF' }}>HP: 100/100</p>
          <p style={{ color: '#FFFFFF' }}>MP: 50/50</p>
        </Panel>
        <Panel title="Inventory" width="300px">
          <p style={{ color: '#FFFFFF' }}>Gold: 1,250</p>
          <p style={{ color: '#FFFFFF' }}>Items: 15</p>
          <p style={{ color: '#FFFFFF' }}>Equipment: 8</p>
        </Panel>
      </div>
    </Layout>
  ),
};

export const LoginScreen: Story = {
  render: () => (
    <Layout>
      <Panel title="Welcome to Axiomancer" width="400px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Username"
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #666',
              background: '#1a1a1a',
              color: '#FFFFFF'
            }}
          />
          <input 
            type="password" 
            placeholder="Password"
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #666',
              background: '#1a1a1a',
              color: '#FFFFFF'
            }}
          />
          <button
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: '2px solid #DAA520',
              background: '#DAA520',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </Panel>
    </Layout>
  ),
};
