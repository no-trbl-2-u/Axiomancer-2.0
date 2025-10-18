import styled from '@emotion/styled';
import { Link as RouterLink } from 'react-router-dom';
import { theme } from '../../styles/theme';

export const StyledLink = styled(RouterLink)<{
  variant?: 'default' | 'primary' | 'secondary' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}>`
  background: none;
  text-decoration: ${props => props.variant === 'underline' ? 'underline' : 'none'};
  text-align: center;
  display: ${props => props.variant === 'underline' ? 'block' : 'inline'};
  transition: all 0.2s ease;
  
  color: ${props => {
    switch (props.variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      default: return theme.colors.primary;
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.75rem';
      case 'md': return '0.875rem';
      case 'lg': return '1rem';
      default: return '0.875rem';
    }
  }};
  
  ${props => props.variant === 'underline' ? `
    margin-top: ${theme.spacing.md};
  ` : ''}
  
  &:hover {
    color: ${theme.colors.secondary};
  }
`;
