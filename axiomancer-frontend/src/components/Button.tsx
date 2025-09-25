import styled from '@emotion/styled';
import { theme } from '../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  text-align: center;
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.875rem;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.lg} ${theme.spacing.xl};
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: 1rem;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.gray[500]};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[600]};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: #c82333;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary};
          }
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;