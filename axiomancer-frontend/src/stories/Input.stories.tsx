import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/shared/Input';

const meta = {
  title: 'Shared/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Email: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Number: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    value: 'Disabled value',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '400px' }}>
      <Input label="Normal" placeholder="Normal input" />
      <Input label="With value" value="Sample value" />
      <Input label="With error" error="This field is required" placeholder="Error state" />
      <Input label="Disabled" disabled placeholder="Disabled input" />
      <Input label="Password" type="password" placeholder="Password input" />
      <Input label="Email" type="email" placeholder="email@example.com" />
    </div>
  ),
};
