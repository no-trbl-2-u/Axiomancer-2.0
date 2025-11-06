import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewFriendsModal } from '../../components/figma/NewFriendsModal';
import { Button } from '../../components/shared/Button';
import { useState } from 'react';

const meta = {
  title: 'Combat/NewFriendsModal',
  component: NewFriendsModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    enemyName: {
      control: 'text',
      description: 'Name of the enemy who became a friend',
    },
  },
} satisfies Meta<typeof NewFriendsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Show New Friends Modal</Button>
        <NewFriendsModal
          open={open}
          onOpenChange={setOpen}
          enemyName={args.enemyName || 'Socrates'}
        />
      </>
    );
  },
  args: {
    enemyName: 'Socrates',
  },
};

export const WithDifferentEnemies: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [enemyName, setEnemyName] = useState('Plato');

    const enemies = ['Plato', 'Aristotle', 'Descartes', 'Nietzsche', 'Confucius'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        {enemies.map((name) => (
          <Button
            key={name}
            onClick={() => {
              setEnemyName(name);
              setOpen(true);
            }}
          >
            Befriend {name}
          </Button>
        ))}
        <NewFriendsModal
          open={open}
          onOpenChange={setOpen}
          enemyName={enemyName}
        />
      </div>
    );
  },
};

export const AlwaysOpen: Story = {
  render: (args) => {
    return (
      <NewFriendsModal
        open={true}
        onOpenChange={() => { }}
        enemyName={args.enemyName || 'Aristotle'}
      />
    );
  },
  args: {
    enemyName: 'Aristotle',
  },
};
