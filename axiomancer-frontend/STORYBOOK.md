# Storybook Setup Guide for Axiomancer Frontend

## Overview

Storybook has been successfully configured for the Axiomancer 2.0 frontend project. This document provides a comprehensive guide on the setup, configuration, and best practices for using Storybook.

## What's Installed

### Core Packages
- **storybook** (v10.0.2) - Core Storybook functionality
- **@storybook/react-vite** (v10.0.2) - React + Vite integration
- **vite** (v5.4.21) - Upgraded from v4 for Storybook compatibility

### Addons
1. **@chromatic-com/storybook** - Visual regression testing and deployment
2. **@storybook/addon-docs** - Automatic documentation generation from stories
3. **@storybook/addon-onboarding** - Interactive onboarding for new users
4. **@storybook/addon-a11y** - Accessibility testing and validation
5. **@storybook/addon-vitest** - Component testing with Vitest integration

### Development Tools
- **eslint-plugin-storybook** - ESLint rules for Storybook best practices
- **vitest** (v4.0.6) - Test runner for component tests
- **@vitest/browser-playwright** - Browser testing with Playwright
- **@vitest/coverage-v8** - Code coverage reporting

### Styling
- **tailwindcss** (v3.4.18) - Utility-first CSS framework
- **postcss** (v8.5.6) - CSS transformations
- **autoprefixer** (v10.4.21) - Automatic vendor prefixing

## Configuration Files

### Created Files
```
axiomancer-frontend/
├── .storybook/
│   ├── main.ts              # Main Storybook configuration
│   ├── preview.tsx          # Global decorators and parameters
│   ├── vitest.setup.ts      # Vitest integration setup
│   ├── README.md            # Detailed Storybook documentation
│   └── story-template.tsx   # Template for creating new stories
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── STORYBOOK.md            # This file
```

### Modified Files
- **package.json**
  - Added `"type": "module"` for ES modules support
  - Added Storybook scripts: `storybook` and `build-storybook`
  - Updated ESLint config to include `plugin:storybook/recommended`
  - Upgraded Vite to v5 and @vitejs/plugin-react to v4.7

- **vite.config.ts**
  - Added Vitest configuration for Storybook testing
  - Configured Playwright browser provider
  - Set up test projects for Storybook stories

- **src/figma/global.css**
  - Added Tailwind directives (`@tailwind base/components/utilities`)
  - Fixed `outline-ring/50` to use `color-mix` for proper opacity

## Running Storybook

### Development Mode
```bash
npm run storybook
```
- Starts Storybook on `http://localhost:6006`
- Hot reloading enabled
- Accessible on your network at `http://192.168.12.167:6006`

### Build Static Version
```bash
npm run build-storybook
```
- Builds a static version in `storybook-static/` directory
- Can be deployed to any static hosting service
- Already added to `.gitignore`

### Testing
```bash
# Run Storybook component tests
npx vitest --project=storybook

# Run with coverage
npx vitest --project=storybook --coverage

# Run in watch mode
npx vitest --project=storybook --watch
```

## Key Features

### 1. Global Styling
The preview is configured to include all your global styles:
- **Emotion GlobalStyles** - Your base app styles
- **Tailwind CSS** - Via `global.css` with custom design tokens
- **TooltipProvider** - Wraps all stories for tooltip functionality

### 2. Dark Mode Support
- Default background is dark (`#000000`) matching your game aesthetic
- Can switch between light/dark in the Storybook toolbar
- Custom CSS variables work in both modes

### 3. Accessibility Testing
- Automatic a11y checks on all stories
- Violations shown in the "Accessibility" tab
- Currently set to 'todo' mode (shows violations but doesn't fail)
- Can be set to 'error' mode for CI/CD

### 4. Component Testing
- Stories automatically become tests with Vitest
- Browser-based testing with Playwright
- Interaction testing with `play` functions
- Coverage reporting with V8

### 5. Auto-Documentation
- Use `tags: ['autodocs']` to generate docs automatically
- JSDoc comments are extracted and displayed
- Props table generated from TypeScript types
- Interactive controls for all props

## Creating Your First Story

### 1. Choose a Component
Start with a simple, isolated component from `src/components/shared/`:
- Button
- Card
- Input
- Text
- etc.

### 2. Create a Story File
Create a file next to your component:
```
src/components/shared/Button.stories.tsx
```

### 3. Use the Template
Copy from `.storybook/story-template.tsx` or use this basic structure:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};
```

### 4. View in Storybook
Run `npm run storybook` and navigate to your component in the sidebar.

## Story Organization

Organize stories by category using the `title` field:

```
shared/Button          → src/components/shared/Button.stories.tsx
shared/Card            → src/components/shared/Card.stories.tsx
game/CharacterScreen   → src/components/game/CharacterScreen.stories.tsx
combat/BuffDisplay     → src/components/combat/BuffDebuffDisplay.stories.tsx
figma/CombatModal      → src/figma/CombatModal.stories.tsx
```

## Best Practices

### 1. Start Simple
- Begin with presentational components (no state, no side effects)
- Add stories for shared components first
- Gradually move to more complex components

### 2. Multiple Variants
Create stories for all visual states:
- Default
- Loading
- Error
- Empty
- Disabled
- Hover/Active (use pseudo-states)
- Different sizes/variants

### 3. Mock Dependencies
For components with dependencies:

```typescript
// Mock Zustand store
import { useGameStore } from '../../stores/gameStore';

export const WithMockedStore: Story = {
  decorators: [
    (Story) => {
      useGameStore.setState({ character: mockCharacter });
      return <Story />;
    },
  ],
};

// Mock router
import { MemoryRouter } from 'react-router-dom';

export const WithRouter: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/game']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};
```

### 4. Interaction Testing
Add `play` functions for interaction tests:

```typescript
import { within, userEvent, expect } from '@storybook/test';

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await userEvent.click(button);
    await expect(canvas.getByText('Clicked!')).toBeInTheDocument();
  },
};
```

### 5. Documentation
Add JSDoc comments to your components:

```typescript
/**
 * Primary button component for user actions
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

## Recommended Story Creation Order

### Phase 1: Shared Components (Start Here)
These are the easiest to create stories for:
1. `src/components/shared/Button.tsx`
2. `src/components/shared/Text.tsx`
3. `src/components/shared/Card.tsx`
4. `src/components/shared/Input.tsx`
5. `src/components/shared/StatDisplay.tsx`
6. `src/components/shared/Slot.tsx`
7. `src/components/shared/ActionButton.tsx`

### Phase 2: Figma Components
These are already isolated:
1. `src/figma/Dialog.tsx`
2. `src/figma/ScrollArea.tsx`
3. `src/figma/NewFriendsModal.tsx`

### Phase 3: Combat Components
These may need some mocking:
1. `src/components/combat/BuffDebuffDisplay.tsx`
2. `src/components/combat/SkillSelectionModal.tsx`

### Phase 4: Game Components
These will need more complex mocking:
1. `src/components/game/DebugPanel.tsx`
2. `src/components/game/InventoryScreen.tsx`
3. `src/components/game/SkillScreen.tsx`
4. `src/components/game/CharacterScreen.tsx`

## Troubleshooting

### Storybook Won't Start
```bash
# Clear cache and restart
rm -rf node_modules/.cache
npm run storybook
```

### Stories Not Showing Up
- Check file naming: `*.stories.tsx` or `*.stories.ts`
- Ensure default export exists
- Check console for errors
- Verify story location matches pattern in `.storybook/main.ts`

### Styling Issues
- Verify `global.css` is imported in `.storybook/preview.tsx`
- Check Tailwind config includes your component paths
- Ensure CSS variables are defined in `:root`

### TypeScript Errors
```bash
# Regenerate types
npm run build
```

### Module Resolution Issues
- Ensure `"type": "module"` is in `package.json`
- Check that imports use `.js` extensions for local modules (if needed)
- Verify `tsconfig.json` includes Storybook files

## Integration with CI/CD

### Visual Regression Testing (Chromatic)
```bash
# Install Chromatic CLI
npm install -D chromatic

# Run visual tests
npx chromatic --project-token=<your-token>
```

### Component Testing in CI
```bash
# Run tests in CI
npm run build-storybook
npx vitest --project=storybook --run
```

### Accessibility Testing in CI
Update `.storybook/preview.tsx`:
```typescript
a11y: {
  test: process.env.CI ? 'error' : 'todo',
},
```

## Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [React Storybook Tutorial](https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/)
- [Vitest Addon Docs](https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon)
- [Accessibility Testing](https://storybook.js.org/docs/react/writing-tests/accessibility-testing)
- [Interaction Testing](https://storybook.js.org/docs/react/writing-tests/interaction-testing)

## Support

For questions or issues:
1. Check `.storybook/README.md` for detailed configuration info
2. Review the story template at `.storybook/story-template.tsx`
3. Consult the official Storybook documentation
4. Check the Storybook Discord community

## Next Steps

1. ✅ Storybook is installed and configured
2. ⏭️ Create your first story for a shared component
3. ⏭️ Add stories for all shared components
4. ⏭️ Move to more complex components with mocking
5. ⏭️ Set up visual regression testing with Chromatic (optional)
6. ⏭️ Integrate component testing into CI/CD pipeline

Happy story writing! 🎨📚

