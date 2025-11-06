import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionButton, SaveButton, CloseButton } from '../components/shared/ActionButton';

const meta = {
  title: 'Shared/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'category'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Button size',
    },
    category: {
      control: 'select',
      options: ['body', 'mind', 'heart'],
      description: 'Category color (only used with category variant)',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether button should take full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    selected: {
      control: 'boolean',
      description: 'Selected state (for category variant)',
    },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: 'success',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
    size: 'md',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Button',
    variant: 'warning',
    size: 'md',
  },
};

export const CategoryBody: Story = {
  args: {
    children: '💪 Body',
    variant: 'category',
    category: 'body',
    size: 'md',
  },
};

export const CategoryMind: Story = {
  args: {
    children: '🧠 Mind',
    variant: 'category',
    category: 'mind',
    size: 'md',
  },
};

export const CategoryHeart: Story = {
  args: {
    children: '❤️ Heart',
    variant: 'category',
    category: 'heart',
    size: 'md',
  },
};

export const CategorySelected: Story = {
  args: {
    children: '💪 Body',
    variant: 'category',
    category: 'body',
    selected: true,
    size: 'md',
  },
};

export const ExtraSmall: Story = {
  args: {
    children: 'XS Button',
    variant: 'primary',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'lg',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <ActionButton variant="primary" size="xs">Extra Small</ActionButton>
      <ActionButton variant="primary" size="sm">Small</ActionButton>
      <ActionButton variant="primary" size="md">Medium</ActionButton>
      <ActionButton variant="primary" size="lg">Large</ActionButton>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <ActionButton variant="primary">Primary</ActionButton>
      <ActionButton variant="secondary">Secondary</ActionButton>
      <ActionButton variant="success">Success</ActionButton>
      <ActionButton variant="danger">Danger</ActionButton>
      <ActionButton variant="warning">Warning</ActionButton>
    </div>
  ),
};

export const CategoryButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <ActionButton variant="category" category="body">💪 Body</ActionButton>
      <ActionButton variant="category" category="mind">🧠 Mind</ActionButton>
      <ActionButton variant="category" category="heart">❤️ Heart</ActionButton>
    </div>
  ),
};

// SaveButton Stories
const SaveButtonMeta = {
  title: 'Shared/SaveButton',
  component: SaveButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SaveButton>;

export const SaveButtonDefault: StoryObj<typeof SaveButton> = {
  render: () => <SaveButton>Save Changes</SaveButton>,
};

// CloseButton Stories
const CloseButtonMeta = {
  title: 'Shared/CloseButton',
  component: CloseButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['danger', 'secondary', 'primary'],
      description: 'Visual style variant',
    },
  },
} satisfies Meta<typeof CloseButton>;

export const CloseButtonDanger: StoryObj<typeof CloseButton> = {
  render: () => <CloseButton variant="danger">×</CloseButton>,
};

export const CloseButtonSecondary: StoryObj<typeof CloseButton> = {
  render: () => <CloseButton variant="secondary">×</CloseButton>,
};

export const CloseButtonPrimary: StoryObj<typeof CloseButton> = {
  render: () => <CloseButton variant="primary">×</CloseButton>,
};
