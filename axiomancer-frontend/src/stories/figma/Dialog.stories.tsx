import type { Meta, StoryObj } from '@storybook/react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/figma/Dialog';
import { Button } from '../../components/shared/Button';
import { useState } from 'react';

const meta = {
  title: 'Axiomance/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a dialog description. It provides additional context about the dialog.
            </DialogDescription>
          </DialogHeader>
          <div style={{ padding: '1rem 0' }}>
            <p style={{ color: '#FFFFFF' }}>Dialog content goes here.</p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#CCCCCC' }}>
                Name
              </label>
              <input 
                type="text" 
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #666',
                  background: '#1a1a1a',
                  color: '#FFFFFF'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#CCCCCC' }}>
                Email
              </label>
              <input 
                type="email" 
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #666',
                  background: '#1a1a1a',
                  color: '#FFFFFF'
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const AlertDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="danger">Delete Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your item
              and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>View Terms</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read and accept our terms and conditions.
            </DialogDescription>
          </DialogHeader>
          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '1rem 0' }}>
            {Array.from({ length: 10 }, (_, i) => (
              <p key={i} style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </div>
          <DialogFooter>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
