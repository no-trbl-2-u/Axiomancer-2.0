import type { Meta, StoryObj } from '@storybook/react';
import { StyledLink } from '@components/shared/Link';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Shared/Link',
  component: StyledLink,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'underline'],
      description: 'Link style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Link size',
    },
  },
} satisfies Meta<typeof StyledLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    to: '#',
    children: 'Default Link',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    to: '#',
    children: 'Primary Link',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    to: '#',
    children: 'Secondary Link',
    variant: 'secondary',
  },
};

export const Underline: Story = {
  args: {
    to: '#',
    children: 'Underlined Link',
    variant: 'underline',
  },
};

export const Small: Story = {
  args: {
    to: '#',
    children: 'Small Link',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    to: '#',
    children: 'Medium Link',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    to: '#',
    children: 'Large Link',
    size: 'lg',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <StyledLink to="#" variant="default">Default Link</StyledLink>
      <StyledLink to="#" variant="primary">Primary Link</StyledLink>
      <StyledLink to="#" variant="secondary">Secondary Link</StyledLink>
      <StyledLink to="#" variant="underline">Underlined Link</StyledLink>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <StyledLink to="#" size="sm">Small Link</StyledLink>
      <StyledLink to="#" size="md">Medium Link</StyledLink>
      <StyledLink to="#" size="lg">Large Link</StyledLink>
    </div>
  ),
};
