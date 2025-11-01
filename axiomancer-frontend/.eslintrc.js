module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:storybook/recommended'],
  rules: {
    // React specific
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/display-name': 'warn', // Warning instead of error for display names

    // TypeScript specific - relaxed for development speed
    '@typescript-eslint/explicit-function-return-type': 'off', // Too strict for development
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // Warning instead of error
    '@typescript-eslint/no-explicit-any': 'warn', // Warning instead of error for any types
    '@typescript-eslint/no-unused-vars': 'warn', // Warning instead of error for unused vars
    
    // Code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'no-case-declarations': 'off', // Allow declarations in case blocks
    
    // React hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};