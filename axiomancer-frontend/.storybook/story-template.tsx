/**
 * Story Template for Axiomancer Components
 * 
 * Copy this template to create new stories for your components.
 * Place the story file next to your component with the naming pattern:
 * ComponentName.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react';
// import { YourComponent } from './YourComponent';

// Uncomment and replace with your component
// const meta = {
//   title: 'Category/YourComponent',
//   component: YourComponent,
//   parameters: {
//     // Optional: center the component in the canvas
//     layout: 'centered',
//     // Optional: add custom backgrounds
//     backgrounds: {
//       default: 'dark',
//       values: [
//         { name: 'dark', value: '#000000' },
//         { name: 'light', value: '#ffffff' },
//       ],
//     },
//   },
//   // Auto-generate documentation
//   tags: ['autodocs'],
//   // Define interactive controls
//   argTypes: {
//     // Example: string prop
//     // title: {
//     //   control: 'text',
//     //   description: 'The title text',
//     // },
//     // Example: boolean prop
//     // disabled: {
//     //   control: 'boolean',
//     //   description: 'Whether the component is disabled',
//     // },
//     // Example: select prop
//     // variant: {
//     //   control: 'select',
//     //   options: ['primary', 'secondary', 'destructive'],
//     //   description: 'The visual variant',
//     // },
//     // Example: action
//     // onClick: {
//     //   action: 'clicked',
//     //   description: 'Click handler',
//     // },
//   },
//   // Optional: wrap all stories with a decorator
//   // decorators: [
//   //   (Story) => (
//   //     <div style={{ padding: '2rem' }}>
//   //       <Story />
//   //     </div>
//   //   ),
//   // ],
// } satisfies Meta<typeof YourComponent>;

// export default meta;
// type Story = StoryObj<typeof meta>;

/**
 * Default state of the component
 */
// export const Default: Story = {
//   args: {
//     // Add your default props here
//   },
// };

/**
 * Example variant story
 */
// export const Variant: Story = {
//   args: {
//     // Add variant props here
//   },
// };

/**
 * Example with interaction testing
 */
// export const WithInteraction: Story = {
//   args: {
//     // Add props
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     
//     // Example interaction
//     // const button = canvas.getByRole('button');
//     // await userEvent.click(button);
//     // await expect(canvas.getByText('Success!')).toBeInTheDocument();
//   },
// };

/**
 * Example with custom render
 */
// export const CustomRender: Story = {
//   render: (args) => (
//     <div>
//       <h2>Custom Wrapper</h2>
//       <YourComponent {...args} />
//     </div>
//   ),
//   args: {
//     // Add props
//   },
// };

// ============================================
// COMMON STORY PATTERNS
// ============================================

/**
 * Loading State
 */
// export const Loading: Story = {
//   args: {
//     isLoading: true,
//   },
// };

/**
 * Error State
 */
// export const Error: Story = {
//   args: {
//     error: 'Something went wrong',
//   },
// };

/**
 * Empty State
 */
// export const Empty: Story = {
//   args: {
//     data: [],
//   },
// };

/**
 * With Data
 */
// export const WithData: Story = {
//   args: {
//     data: [
//       { id: 1, name: 'Item 1' },
//       { id: 2, name: 'Item 2' },
//     ],
//   },
// };

/**
 * Disabled State
 */
// export const Disabled: Story = {
//   args: {
//     disabled: true,
//   },
// };

// ============================================
// MOCKING EXAMPLES
// ============================================

/**
 * Example: Mocking Zustand Store
 */
// import { useGameStore } from '../stores/gameStore';
// 
// export const WithMockedStore: Story = {
//   decorators: [
//     (Story) => {
//       // Mock store state
//       useGameStore.setState({
//         character: mockCharacter,
//         isLoading: false,
//       });
//       return <Story />;
//     },
//   ],
//   args: {},
// };

/**
 * Example: Mocking API Calls
 */
// import { rest } from 'msw';
// 
// export const WithMockedAPI: Story = {
//   parameters: {
//     msw: {
//       handlers: [
//         rest.get('/api/data', (req, res, ctx) => {
//           return res(ctx.json({ data: 'mocked' }));
//         }),
//       ],
//     },
//   },
//   args: {},
// };

/**
 * Example: Mocking Router
 */
// import { MemoryRouter } from 'react-router-dom';
// 
// export const WithRouter: Story = {
//   decorators: [
//     (Story) => (
//       <MemoryRouter initialEntries={['/game']}>
//         <Story />
//       </MemoryRouter>
//     ),
//   ],
//   args: {},
// };

