import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const Grid = styled.div<{
  variant?: 'default' | 'equipment' | 'item' | 'skill' | 'resource' | 'category';
  columns?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  alignContent?: 'start' | 'center' | 'end' | 'stretch';
}>`
  display: grid;
  
  grid-template-columns: ${props => {
    if (props.variant === 'equipment') {
      return 'repeat(3, 1fr)';
    }
    if (props.variant === 'item') {
      return 'repeat(auto-fill, minmax(70px, 1fr))';
    }
    if (props.variant === 'skill') {
      return 'repeat(auto-fit, minmax(350px, 1fr))';
    }
    if (props.variant === 'resource') {
      return 'repeat(auto-fit, minmax(200px, 1fr))';
    }
    if (props.columns) {
      return `repeat(${props.columns}, 1fr)`;
    }
    return 'repeat(auto-fit, minmax(250px, 1fr))';
  }};
  
  gap: ${props => {
    switch (props.gap) {
      case 'xs': return theme.spacing.xs;
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      case 'xl': return theme.spacing.xl;
      default: return theme.spacing.md;
    }
  }};
  
  ${props => props.alignContent ? `align-content: ${props.alignContent};` : 'align-content: start;'}
  
  ${props => {
    if (props.variant === 'skill') {
      return `
        flex: 1;
        overflow-y: auto;
        padding: ${theme.spacing.sm};
        
        /* Scroll indicator shadow */
        &::after {
          content: '';
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to top, ${theme.colors.background.primary}, transparent);
          pointer-events: none;
        }
      `;
    }
    return '';
  }}
  
  ${props => props.responsive !== false ? `
    @media (max-width: 768px) {
      grid-template-columns: ${props.variant === 'skill' ? '1fr' : 
        props.variant === 'equipment' ? 'repeat(3, 1fr)' :
        props.variant === 'item' ? 'repeat(auto-fill, minmax(70px, 1fr))' :
        'repeat(auto-fit, minmax(200px, 1fr))'};
      gap: ${props.variant === 'skill' ? theme.spacing.lg : theme.spacing.sm};
    }
    
    @media (max-width: 480px) {
      grid-template-columns: ${props.variant === 'equipment' ? 'repeat(2, 1fr)' : 
        props.variant === 'skill' ? '1fr' :
        'repeat(auto-fill, minmax(70px, 1fr))'};
      gap: ${theme.spacing.sm};
    }
  ` : ''}
`;

export const FlexContainer = styled.div<{
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  fullWidth?: boolean;
  responsive?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'flex-start'};
  justify-content: ${props => props.justify || 'flex-start'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  
  gap: ${props => {
    switch (props.gap) {
      case 'xs': return theme.spacing.xs;
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      case 'xl': return theme.spacing.xl;
      default: return theme.spacing.md;
    }
  }};
  
  ${props => props.fullWidth ? 'width: 100%;' : ''}
  
  ${props => props.responsive !== false ? `
    @media (max-width: 768px) {
      flex-direction: column;
    }
  ` : ''}
`;

export const Container = styled.div<{
  variant?: 'default' | 'page' | 'game' | 'form';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: string;
  fullHeight?: boolean;
  centered?: boolean;
}>`
  ${props => {
    switch (props.variant) {
      case 'page':
        return `
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: ${theme.spacing.lg};
          background: ${theme.colors.background.primary};
          gap: ${theme.spacing.lg};
          position: relative;
        `;
      case 'game':
        return `
          width: 100%;
          height: 100%;
          display: flex;
          padding: ${theme.spacing.xl};
          background: ${theme.colors.background.primary};
          gap: ${theme.spacing.xl};
          position: relative;
        `;
      case 'form':
        return `
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: ${theme.borderRadius.xl};
          padding: ${theme.spacing.xxl};
          box-shadow: ${theme.shadows.xl};
          width: 90%;
          max-width: 500px;
        `;
      default:
        return `
          width: 100%;
          ${props.fullHeight ? 'height: 100%;' : ''}
          ${props.centered ? `
            display: flex;
            align-items: center;
            justify-content: center;
          ` : ''}
        `;
    }
  }}
  
  padding: ${props => {
    if (props.variant) return '';
    switch (props.padding) {
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      case 'xl': return theme.spacing.xl;
      default: return '0';
    }
  }};
  
  ${props => props.maxWidth ? `max-width: ${props.maxWidth};` : ''}
  
  @media (max-width: 768px) {
    ${props => {
      switch (props.variant) {
        case 'page':
        case 'game':
          return `
            flex-direction: column;
            padding: ${theme.spacing.md};
            gap: ${theme.spacing.md};
          `;
        case 'form':
          return `
            width: 85%;
            max-width: 450px;
            padding: ${theme.spacing.xl};
          `;
        default:
          return '';
      }
    }}
  }
  
  @media (max-width: 480px) {
    ${props => {
      switch (props.variant) {
        case 'page':
        case 'game':
          return `
            padding: ${theme.spacing.sm};
          `;
        case 'form':
          return `
            width: 90%;
            max-width: 380px;
            padding: ${theme.spacing.lg};
          `;
        default:
          return '';
      }
    }}
  }
`;

export const EmptyState = styled.div<{
  variant?: 'default' | 'inventory' | 'skills';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${theme.colors.text.secondary};
  font-style: italic;
  text-align: center;
  padding: ${theme.spacing.xl};
  
  ${props => {
    if (props.variant === 'skills') {
      return `
        flex-direction: column;
        
        .icon {
          font-size: 3rem;
          margin-bottom: ${theme.spacing.md};
        }
      `;
    }
    return '';
  }}
`;
