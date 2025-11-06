import type { Meta, StoryObj } from '@storybook/react-vite';
import { LockedNodeModal } from '../../components/game/LockedNodeModal';
import { Button } from '../../components/shared/Button';
import { useState } from 'react';

const meta = {
  title: 'Axiomance/LockedNodeModal',
  component: LockedNodeModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LockedNodeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setIsOpen(true)}>
          Try to Access Locked Node
        </Button>
        <LockedNodeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
};

export const AlwaysOpen: Story = {
  render: () => {
    return <LockedNodeModal isOpen={true} onClose={() => {}} />;
  },
};
