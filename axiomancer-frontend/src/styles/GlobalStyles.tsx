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
        font-family: 'Georgia', 'Times New Roman', serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: #000000;
        min-height: 100vh;
        color: #FFFFFF;
        overflow-x: hidden;
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