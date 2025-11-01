# Storybook Configuration for Axiomancer Frontend

This directory contains the Storybook configuration for the Axiomancer 2.0 frontend application.

## Overview

Storybook is set up with the following configuration:
- **Version**: 10.0.2
- **Builder**: Vite 5
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS + Emotion

## Files

### `main.ts`
The main configuration file that defines:
- **Stories location**: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- **Addons**:
  - `@chromatic-com/storybook` - Visual testing integration
  - `@storybook/addon-docs` - Automatic documentation generation
  - `@storybook/addon-onboarding` - Interactive onboarding experience
  - `@storybook/addon-a11y` - Accessibility testing
  - `@storybook/addon-vitest` - Component testing with Vitest
- **Framework**: React with Vite builder

### `preview.tsx`
Configures the preview environment for all stories:
- Imports global styles (`GlobalStyles` from Emotion and `global.css` from Figma)
- Wraps all stories with `TooltipProvider` for tooltip functionality
- Sets up dark/light background options (default: dark)
- Configures accessibility testing (set to 'todo' mode)

### `vitest.setup.ts`
Configuration for Vitest integration with Storybook for component testing.

## Running Storybook

### Development Mode
```bash
npm run storybook
```
This starts Storybook on `http://localhost:6006`

### Build Static Version
```bash
npm run build-storybook
```
This builds a static version of Storybook in the `storybook-static` directory.

## Writing Stories

### File Naming Convention
Stories should be placed alongside your components with the naming pattern:
- `ComponentName.stories.tsx` (TypeScript)
- `ComponentName.stories.jsx` (JavaScript)

### Basic Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for your props here
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variant: Story = {
  args: {
    // Variant props
  },
};
```

### Story Categories

Organize your stories by category in the `title` field:
- `shared/ComponentName` - Shared/reusable components
- `game/ComponentName` - Game-specific components
- `combat/ComponentName` - Combat-related components
- `figma/ComponentName` - Figma-imported components

## Best Practices

### 1. Component Isolation
- Each story should render the component in isolation
- Mock any external dependencies (stores, APIs, etc.)
- Use decorators to provide necessary context

### 2. Multiple Variants
Create stories for different states:
- Default state
- Loading state
- Error state
- Empty state
- With data
- Interactive states

### 3. Accessibility Testing
The a11y addon is configured to show violations in the UI. Make sure to:
- Check the Accessibility tab in Storybook
- Fix any violations before merging
- Test with keyboard navigation

### 4. Documentation
Use the `autodocs` tag to automatically generate documentation:
```typescript
tags: ['autodocs'],
```

Add JSDoc comments to your components for better documentation:
```typescript
/**
 * Button component for user interactions
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = ({ variant, onClick, children }) => {
  // ...
};
```

### 5. Controls
Define argTypes to make your stories interactive:
```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'destructive'],
  },
  disabled: {
    control: 'boolean',
  },
  onClick: { action: 'clicked' },
},
```

### 6. Decorators
Use decorators to wrap stories with necessary providers:
```typescript
decorators: [
  (Story) => (
    <div style={{ padding: '3rem' }}>
      <Story />
    </div>
  ),
],
```

## Testing with Vitest

The Storybook Vitest addon allows you to run tests based on your stories:

```bash
# Run Storybook tests
npx vitest --project=storybook

# Run with coverage
npx vitest --project=storybook --coverage
```

### Writing Tests
Your stories automatically become tests. Add test-specific logic:

```typescript
export const WithInteraction: Story = {
  args: {
    // ...
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await userEvent.click(button);
    await expect(canvas.getByText('Clicked!')).toBeInTheDocument();
  },
};
```

## Styling Notes

### Global Styles
The preview is configured to include:
1. **Emotion GlobalStyles** - Base styles for the app
2. **Tailwind CSS** - Utility classes via `global.css`
3. **CSS Variables** - Custom design tokens

### Dark Mode
The default background is set to dark (`#000000`) to match the game aesthetic. You can switch between light and dark in the toolbar.

### Custom CSS Variables
All custom CSS variables from `global.css` are available:
- `--color-primary`, `--color-secondary`, etc.
- `--radius-sm`, `--radius-md`, `--radius-lg`
- And more...

## Troubleshooting

### Stories Not Showing Up
- Check that your story files match the pattern in `main.ts`
- Ensure the file exports a default meta object
- Check the console for errors

### Styling Issues
- Verify that `global.css` is imported in `preview.tsx`
- Check that Tailwind classes are being processed
- Ensure CSS variables are defined

### TypeScript Errors
- Make sure your component types are properly exported
- Use `satisfies Meta<typeof Component>` for type safety
- Check that `@storybook/react` types are installed

## Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook React Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Vitest Addon Documentation](https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon)
- [Accessibility Addon Documentation](https://storybook.js.org/docs/react/writing-tests/accessibility-testing)

