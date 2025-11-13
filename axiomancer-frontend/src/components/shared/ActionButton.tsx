import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const ActionButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'category';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  category?: 'body' | 'mind' | 'heart';
  selected?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.rpg.buttonBorderRadius};
  font-weight: bold;
  text-transform: uppercase;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  text-align: center;
  border: 2px solid;
  
  font-size: ${props => {
    switch (props.size) {
      case 'xs': return '0.75rem';
      case 'sm': return '0.85rem';
      case 'md': return '0.9rem';
      case 'lg': return '1rem';
      default: return '0.9rem';
    }
  }};
  
  padding: ${props => {
    switch (props.size) {
      case 'xs': return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'sm': return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'md': return `${theme.spacing.md}`;
      case 'lg': return `${theme.spacing.md} ${theme.spacing.lg}`;
      default: return `${theme.spacing.md}`;
    }
  }};
  
  ${props => props.fullWidth ? 'width: 100%;' : ''}
  
  ${props => {
    if (props.variant === 'category' && props.category) {
      const colors = {
        body: { bg: '#DC143C', border: '#DC143C' },
        mind: { bg: '#4169E1', border: '#4169E1' },
        heart: { bg: '#FF6B35', border: '#FF6B35' },
      };
      
      const color = colors[props.category];
      
      return `
        background: ${props.selected ? color.bg : theme.colors.background.primary};
        color: ${props.selected ? 'white' : theme.colors.text.primary};
        border-color: ${color.border};
        gap: ${theme.spacing.sm};
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    }
    
    switch (props.variant) {
      case 'success':
        return `
          background: ${theme.colors.success};
          color: white;
          border-color: ${theme.colors.success};
          box-shadow: ${theme.shadows.button};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.glow};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      
      case 'secondary':
        return `
          background: ${theme.colors.background.primary};
          color: ${theme.colors.text.muted};
          border-color: ${theme.colors.border.secondary};
          
          &:hover:not(:disabled) {
            transform: ${props.disabled ? 'none' : 'translateY(-2px)'};
            box-shadow: ${props.disabled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
            background: ${props.disabled ? theme.colors.background.primary : theme.colors.accent};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      
      case 'danger':
        return `
          background: ${theme.colors.danger};
          color: white;
          border-color: ${theme.colors.danger};
          
          &:hover:not(:disabled) {
            background: #c82333;
          }
        `;
      
      case 'warning':
        return `
          background: ${theme.colors.warning};
          color: ${theme.colors.dark};
          border-color: ${theme.colors.warning};
          
          &:hover:not(:disabled) {
            filter: brightness(1.1);
          }
        `;
      
      default: // primary
        return `
          background: ${props.disabled ? theme.colors.background.primary : theme.colors.primary};
          color: ${props.disabled ? theme.colors.text.muted : 'white'};
          border-color: ${props.disabled ? theme.colors.border.secondary : theme.colors.primary};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            background: ${theme.colors.accent};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
    }
  }}
  
  ${props => props.disabled ? `
    opacity: ${props.variant === 'category' ? 1 : 0.5};
    
    &:hover {
      transform: none;
    }
  ` : ''}
`;

export const SaveButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.rpg.buttonBorderRadius};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: ${theme.shadows.button};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CloseButton = styled.button<{ variant?: 'danger' | 'secondary' | 'primary' }>`
  background: ${props => {
    switch (props.variant) {
      case 'secondary': return theme.colors.gray[500];
      case 'primary': return theme.colors.primary;
      default: return theme.colors.danger;
    }
  }};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.secondary};
  }
`;
