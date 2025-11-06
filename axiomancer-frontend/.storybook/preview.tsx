import type { Preview } from '@storybook/react-vite';
import React from 'react';
import { GlobalStyles } from '../src/styles/GlobalStyles';
import { TooltipProvider } from '../src/components/shared/Tooltip';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <>
        <GlobalStyles />
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </>
    ),
  ],
};

export default preview;
