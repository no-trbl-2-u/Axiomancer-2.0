import { Global, css } from '@emotion/react';

export const GlobalStyles = (): JSX.Element => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        color: #333;
      }

      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
          monospace;
      }

      button {
        border: none;
        outline: none;
        cursor: pointer;
        font-family: inherit;
      }

      input {
        border: none;
        outline: none;
        font-family: inherit;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    `}
  />
);