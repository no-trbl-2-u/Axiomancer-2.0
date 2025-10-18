import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const Title = styled.h1<{ 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  variant?: 'default' | 'panel' | 'skill' | 'page';
  color?: string;
}>`
  color: ${props => props.color || theme.colors.text.accent};
  text-align: ${props => props.align || 'center'};
  font-weight: bold;
  margin: 0;
  
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '1.2rem';
      case 'md': return '1.5rem';
      case 'lg': return '2rem';
      case 'xl': return '2.5rem';
      default: return '2rem';
    }
  }};
  
  ${props => {
    switch (props.variant) {
      case 'panel':
        return `
          text-transform: uppercase;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          border-bottom: 2px solid ${theme.colors.border.primary};
          padding-bottom: ${theme.spacing.sm};
          margin-bottom: ${theme.spacing.md};
        `;
      case 'skill':
        return `
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          margin-bottom: ${theme.spacing.lg};
        `;
      case 'page':
        return `
          color: ${theme.colors.gray[800]};
          margin-bottom: ${theme.spacing.xl};
        `;
      default:
        return '';
    }
  }}
  
  @media (max-width: 768px) {
    font-size: ${props => {
      switch (props.size) {
        case 'sm': return '1rem';
        case 'md': return '1.3rem';
        case 'lg': return '1.5rem';
        case 'xl': return '2rem';
        default: return '1.5rem';
      }
    }};
  }
  
  @media (max-width: 480px) {
    font-size: ${props => {
      switch (props.size) {
        case 'sm': return '0.9rem';
        case 'md': return '1.1rem';
        case 'lg': return '1.3rem';
        case 'xl': return '1.8rem';
        default: return '1.3rem';
      }
    }};
  }
`;

export const Subtitle = styled.h3<{
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  variant?: 'default' | 'category' | 'section';
}>`
  color: ${theme.colors.text.accent};
  text-align: ${props => props.align || 'left'};
  margin: 0;
  font-weight: bold;
  
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '1rem';
      case 'md': return '1.2rem';
      case 'lg': return '1.5rem';
      default: return '1.2rem';
    }
  }};
  
  ${props => {
    switch (props.variant) {
      case 'category':
        return `
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: ${theme.spacing.md};
        `;
      case 'section':
        return `
          text-transform: uppercase;
          margin-bottom: ${theme.spacing.sm};
        `;
      default:
        return '';
    }
  }}
`;

export const Label = styled.label<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'form' | 'stat';
}>`
  font-weight: ${props => props.variant === 'stat' ? 'bold' : '500'};
  color: ${props => props.variant === 'stat' ? theme.colors.text.secondary : theme.colors.gray[700]};
  
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.75rem';
      case 'md': return '0.875rem';
      case 'lg': return '1rem';
      default: return '0.875rem';
    }
  }};
  
  ${props => props.variant === 'stat' ? `
    text-transform: uppercase;
    font-family: monospace;
  ` : ''}
`;

export const Text = styled.p<{
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'bold';
}>`
  margin: 0;
  line-height: 1.5;
  
  font-size: ${props => {
    switch (props.size) {
      case 'xs': return '0.75rem';
      case 'sm': return '0.875rem';
      case 'md': return '1rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary': return theme.colors.text.primary;
      case 'secondary': return theme.colors.text.secondary;
      case 'muted': return theme.colors.text.muted;
      case 'accent': return theme.colors.text.accent;
      case 'error': return theme.colors.danger;
      case 'success': return theme.colors.success;
      default: return theme.colors.text.primary;
    }
  }};
  
  text-align: ${props => props.align || 'left'};
  
  font-weight: ${props => {
    switch (props.weight) {
      case 'medium': return '500';
      case 'bold': return '600';
      default: return '400';
    }
  }};
`;

export const Description = styled.div<{
  variant?: 'default' | 'event' | 'skill' | 'tooltip';
}>`
  color: ${props => props.variant === 'tooltip' ? theme.colors.text.secondary : theme.colors.text.primary};
  line-height: 1.6;
  
  ${props => {
    switch (props.variant) {
      case 'event':
        return `
          background: ${theme.colors.background.secondary};
          padding: ${theme.spacing.lg};
          border-radius: ${theme.borderRadius.md};
          margin-bottom: ${theme.spacing.lg};
          
          .event-title {
            color: ${theme.colors.text.accent};
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: ${theme.spacing.md};
          }
          
          .event-text {
            color: ${theme.colors.text.primary};
            line-height: 1.6;
          }
        `;
      case 'skill':
        return `
          margin: 0 0 ${theme.spacing.md} 0;
          font-size: 0.95rem;
          
          @media (max-width: 768px) {
            margin-bottom: ${theme.spacing.sm};
            font-size: 0.9rem;
          }
          
          @media (max-width: 480px) {
            font-size: 0.85rem;
          }
        `;
      case 'tooltip':
        return `
          font-size: 0.85rem;
          line-height: 1.4;
          font-style: italic;
        `;
      default:
        return '';
    }
  }}
`;

export const ErrorMessage = styled.div`
  background-color: ${theme.colors.danger};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-size: 0.875rem;
`;

export const Badge = styled.div<{
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'skill' | 'learned';
  position?: 'static' | 'absolute';
}>`
  display: inline-block;
  
  background: ${props => {
    switch (props.variant) {
      case 'success':
      case 'learned':
        return theme.colors.success;
      case 'danger':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      case 'skill':
        return '#6b7280';
      default:
        return theme.colors.background.secondary;
    }
  }};
  
  color: ${props => 
    props.variant === 'default' ? theme.colors.text.accent : 'white'
  };
  
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  
  ${props => props.variant === 'learned' || props.variant === 'skill' ? `
    box-shadow: ${theme.shadows.button};
  ` : ''}
  
  ${props => props.position === 'absolute' ? `
    position: absolute;
    top: ${theme.spacing.sm};
    right: ${theme.spacing.sm};
  ` : ''}
  
  ${props => props.variant === 'default' ? `
    border: 1px solid ${theme.colors.border.primary};
  ` : ''}
`;
