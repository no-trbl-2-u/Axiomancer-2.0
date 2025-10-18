import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'category' | 'skill' | 'aspect';
  disabled?: boolean;
}

interface TabsContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'category' | 'skill';
  align?: 'left' | 'center' | 'right';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
}

const StyledTabsContainer = styled.div<{
  variant?: string;
  align?: string;
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  
  gap: ${props => {
    switch (props.gap) {
      case 'xs': return theme.spacing.xs;
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.sm;
    }
  }};
  
  ${props => {
    switch (props.variant) {
      case 'category':
        return `
          margin-bottom: ${theme.spacing.md};
          
          @media (max-width: 768px) {
            justify-content: center;
          }
        `;
      case 'skill':
        return `
          margin-bottom: ${theme.spacing.xl};
          justify-content: center;
          
          @media (max-width: 768px) {
            margin-bottom: ${theme.spacing.lg};
          }
        `;
      default:
        return '';
    }
  }}
  
  ${props => {
    switch (props.align) {
      case 'center': return 'justify-content: center;';
      case 'right': return 'justify-content: flex-end;';
      default: return '';
    }
  }}
`;

const StyledTab = styled.button<{
  active: boolean;
  variant?: string;
  disabled?: boolean;
}>`
  background: ${props => 
    props.active ? theme.colors.primary : theme.colors.background.secondary
  };
  
  border: 2px solid ${props => 
    props.active ? theme.colors.primary : theme.colors.border.dark
  };
  
  color: ${props => 
    props.active ? 'white' : theme.colors.text.secondary
  };
  
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-weight: bold;
  text-transform: uppercase;
  
  ${props => {
    switch (props.variant) {
      case 'category':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.85rem;
        `;
      case 'skill':
      case 'aspect':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          min-width: 120px;
          
          @media (max-width: 768px) {
            padding: ${theme.spacing.sm} ${theme.spacing.md};
            min-width: 100px;
            font-size: 0.9rem;
          }
          
          @media (max-width: 480px) {
            padding: ${theme.spacing.xs} ${theme.spacing.sm};
            min-width: 80px;
            font-size: 0.8rem;
          }
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.875rem;
        `;
    }
  }}
  
  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${props => props.active ? 'white' : theme.colors.text.accent};
  }
  
  ${props => props.disabled ? `
    opacity: 0.5;
  ` : ''}
`;

export const Tab: React.FC<TabProps> = ({
  active,
  onClick,
  children,
  variant = 'default',
  disabled = false,
}) => {
  return (
    <StyledTab
      active={active}
      onClick={onClick}
      variant={variant}
      disabled={disabled}
    >
      {children}
    </StyledTab>
  );
};

export const TabsContainer: React.FC<TabsContainerProps> = ({
  children,
  variant = 'default',
  align = 'left',
  gap = 'sm',
  wrap = true,
  className,
}) => {
  return (
    <StyledTabsContainer
      variant={variant}
      align={align}
      gap={gap}
      wrap={wrap}
      className={className}
    >
      {children}
    </StyledTabsContainer>
  );
};
