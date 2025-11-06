import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { useState } from 'react';

const meta = {
  title: 'Shared/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'combat', 'locked', 'event', 'skill'],
      description: 'Modal variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Modal size',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button',
    },
    closeButtonVariant: {
      control: 'select',
      options: ['danger', 'secondary', 'primary'],
      description: 'Close button variant',
    },
    headerVariant: {
      control: 'select',
      options: ['default', 'centered', 'minimal'],
      description: 'Header variant',
    },
    overlayBlur: {
      control: 'boolean',
      description: 'Blur overlay background',
    },
    animation: {
      control: 'select',
      options: ['fade', 'scale', 'slide'],
      description: 'Animation type',
    },
    overlayClick: {
      control: 'boolean',
      description: 'Close on overlay click',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalTemplate = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const Default: Story = {
  render: () => (
    <ModalTemplate>
      <div style={{ padding: '1rem' }}>
        <h2 style={{ color: '#DAA520' }}>Default Modal</h2>
        <p style={{ color: '#FFFFFF' }}>This is a default modal with some content.</p>
      </div>
    </ModalTemplate>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <ModalTemplate title="Modal Title">
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF' }}>This modal has a title in the header.</p>
      </div>
    </ModalTemplate>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <ModalTemplate title="Small Modal" size="sm">
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF' }}>This is a small modal.</p>
      </div>
    </ModalTemplate>
  ),
};

export const MediumSize: Story = {
  render: () => (
    <ModalTemplate title="Medium Modal" size="md">
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF' }}>This is a medium modal.</p>
      </div>
    </ModalTemplate>
  ),
};

export const LargeSize: Story = {
  render: () => (
    <ModalTemplate title="Large Modal" size="lg">
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF' }}>This is a large modal with more content space.</p>
        <p style={{ color: '#FFFFFF' }}>It can contain more information and UI elements.</p>
      </div>
    </ModalTemplate>
  ),
};

export const EventModal: Story = {
  render: () => (
    <ModalTemplate variant="event" title="Event Occurred">
      <div style={{ padding: '1rem' }}>
        <div className="event-text" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
          You have encountered a mysterious traveler on the road. They offer you a choice...
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button variant="primary" fullWidth>Accept</Button>
          <Button variant="secondary" fullWidth>Decline</Button>
        </div>
      </div>
    </ModalTemplate>
  ),
};

export const LockedModal: Story = {
  render: () => (
    <ModalTemplate variant="locked" showCloseButton={false} overlayClick={false}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ color: '#DC143C', margin: '0 0 1rem 0' }}>Access Denied</h2>
      <p style={{ color: '#FFFFFF', textAlign: 'center', margin: '0 0 1.5rem 0' }}>
        You must complete the previous quest to access this area.
      </p>
      <Button variant="danger">Go Back</Button>
    </ModalTemplate>
  ),
};

export const SkillModal: Story = {
  render: () => (
    <ModalTemplate variant="skill" title="Skill Details" size="md">
      <div style={{ padding: '1rem' }}>
        <h3 style={{ color: '#DAA520', marginTop: 0 }}>Fireball</h3>
        <p style={{ color: '#FFFFFF', lineHeight: 1.6 }}>
          Launch a powerful fireball at your target, dealing massive fire damage.
          This spell can ignite flammable objects and leave enemies burning.
        </p>
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <div style={{ color: '#4169E1', marginBottom: '0.5rem' }}>Cost: 10 MP</div>
          <div style={{ color: '#DC143C', marginBottom: '0.5rem' }}>Damage: 50-75</div>
          <div style={{ color: '#FFD700' }}>Cooldown: 3 turns</div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Button variant="primary" fullWidth>Learn Skill</Button>
        </div>
      </div>
    </ModalTemplate>
  ),
};

export const WithBlurredOverlay: Story = {
  render: () => (
    <ModalTemplate title="Blurred Background" overlayBlur={true}>
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF' }}>This modal has a blurred overlay background.</p>
      </div>
    </ModalTemplate>
  ),
};

export const NoCloseButton: Story = {
  render: () => (
    <ModalTemplate title="No Close Button" showCloseButton={false}>
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
          This modal doesn&apos;t have a close button.
        </p>
        <Button variant="primary">Confirm</Button>
      </div>
    </ModalTemplate>
  ),
};

export const CenteredHeader: Story = {
  render: () => (
    <ModalTemplate title="Centered Title" headerVariant="centered">
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF', textAlign: 'center' }}>
          This modal has a centered header title.
        </p>
      </div>
    </ModalTemplate>
  ),
};

export const MinimalHeader: Story = {
  render: () => (
    <ModalTemplate title="Minimal Header" headerVariant="minimal">
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF' }}>This modal has a minimal header style.</p>
      </div>
    </ModalTemplate>
  ),
};

export const ScaleAnimation: Story = {
  render: () => (
    <ModalTemplate title="Scale Animation" animation="scale">
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#FFFFFF' }}>This modal uses scale animation when opening.</p>
      </div>
    </ModalTemplate>
  ),
};
