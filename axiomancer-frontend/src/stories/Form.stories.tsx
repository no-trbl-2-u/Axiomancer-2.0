import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form, FormContainer, FormGroup, FormActions, FormError, FormSuccess, FormHelperText, FormLabel } from '../components/shared/Form';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';

const meta = {
  title: 'Shared/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inline', 'grid'],
      description: 'Form layout variant',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between form elements',
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form>
      <FormGroup>
        <FormLabel>Username</FormLabel>
        <Input placeholder="Enter username" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <Input type="password" placeholder="Enter password" />
      </FormGroup>
      <FormActions align="right">
        <Button variant="primary">Submit</Button>
      </FormActions>
    </Form>
  ),
};

export const WithError: Story = {
  render: () => (
    <Form>
      <FormError>Invalid username or password</FormError>
      <FormGroup>
        <FormLabel>Username</FormLabel>
        <Input placeholder="Enter username" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <Input type="password" placeholder="Enter password" />
      </FormGroup>
      <FormActions align="right">
        <Button variant="primary">Submit</Button>
      </FormActions>
    </Form>
  ),
};

export const WithSuccess: Story = {
  render: () => (
    <Form>
      <FormSuccess>Successfully saved your changes!</FormSuccess>
      <FormGroup>
        <FormLabel>Username</FormLabel>
        <Input placeholder="Enter username" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Enter email" />
      </FormGroup>
      <FormActions align="right">
        <Button variant="primary">Update</Button>
      </FormActions>
    </Form>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <Form>
      <FormGroup>
        <FormLabel>Username</FormLabel>
        <Input placeholder="Enter username" />
        <FormHelperText>Username must be at least 3 characters</FormHelperText>
      </FormGroup>
      <FormGroup>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Enter email" />
        <FormHelperText>We&apos;ll never share your email</FormHelperText>
      </FormGroup>
      <FormActions align="right">
        <Button variant="primary">Submit</Button>
      </FormActions>
    </Form>
  ),
};

export const RequiredFields: Story = {
  render: () => (
    <Form>
      <FormGroup>
        <FormLabel required>Username</FormLabel>
        <Input placeholder="Enter username" />
      </FormGroup>
      <FormGroup>
        <FormLabel required>Password</FormLabel>
        <Input type="password" placeholder="Enter password" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Bio (optional)</FormLabel>
        <Input placeholder="Tell us about yourself" />
      </FormGroup>
      <FormActions align="right">
        <Button variant="primary">Submit</Button>
      </FormActions>
    </Form>
  ),
};

export const InlineVariant: Story = {
  render: () => (
    <Form variant="inline" gap="md">
      <Input placeholder="Search..." />
      <Button variant="primary">Search</Button>
    </Form>
  ),
};

export const GridVariant: Story = {
  render: () => (
    <Form variant="grid" gap="md">
      <FormGroup>
        <FormLabel>First Name</FormLabel>
        <Input placeholder="First name" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Last Name</FormLabel>
        <Input placeholder="Last name" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Email" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Phone</FormLabel>
        <Input type="tel" placeholder="Phone" />
      </FormGroup>
    </Form>
  ),
};

// FormContainer Stories
export const AuthContainer: StoryObj = {
  render: () => (
    <FormContainer variant="auth">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Sign In</h2>
      <Form>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormGroup>
        <FormGroup>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" />
        </FormGroup>
        <FormActions align="right">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Sign In</Button>
        </FormActions>
      </Form>
    </FormContainer>
  ),
};

export const ModalContainer: StoryObj = {
  render: () => (
    <FormContainer variant="modal">
      <Form>
        <FormGroup>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Enter name" />
        </FormGroup>
        <FormGroup>
          <FormLabel>Description</FormLabel>
          <Input placeholder="Enter description" />
        </FormGroup>
        <FormActions align="space-between">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </FormActions>
      </Form>
    </FormContainer>
  ),
};

export const FormActionsAlignments: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Left Aligned</h4>
        <FormActions align="left">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </FormActions>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Center Aligned</h4>
        <FormActions align="center">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </FormActions>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Right Aligned</h4>
        <FormActions align="right">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </FormActions>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Space Between</h4>
        <FormActions align="space-between">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </FormActions>
      </div>
    </div>
  ),
};
