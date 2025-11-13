import React from 'react';
import styled from '@emotion/styled';
import { theme } from '@styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'skill' | 'item' | 'equipment' | 'resource' | 'choice';
  isSelected?: boolean;
  isEquipped?: boolean;
  isEmpty?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  className?: string;
  disabled?: boolean;
  gridArea?: string;
  title?: string;
}

const StyledCard = styled.div<{
  variant?: string;
  isSelected?: boolean;
  isEquipped?: boolean;
  isEmpty?: boolean;
  disabled?: boolean;
  gridArea?: string;
}>`
  background: ${props => {
    if (props.isEmpty && props.variant === 'equipment') {
      return theme.colors.background.secondary;
    }
    if (props.isEquipped || props.isSelected) {
      return 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3))';
    }
    if (props.variant === 'skill') {
      return 'linear-gradient(45deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))';
    }
    if (props.variant === 'choice') {
      return theme.colors.background.secondary;
    }
    return theme.colors.background.secondary;
  }};
  
  border: ${props => {
    if (props.variant === 'equipment' && props.isEmpty) {
      return `3px solid ${theme.colors.border.dark}`;
    }
    if (props.variant === 'equipment' && !props.isEmpty) {
      return `3px solid ${theme.colors.success}`;
    }
    if (props.isEquipped) {
      return '3px solid #3b82f6';
    }
    if (props.isSelected) {
      return `2px solid ${theme.colors.primary}`;
    }
    if (props.variant === 'skill') {
      return '3px solid #6b7280';
    }
    if (props.variant === 'choice') {
      return `2px solid ${theme.colors.border.primary}`;
    }
    return `2px solid ${theme.colors.border.primary}`;
  }};
  
  border-radius: ${props => {
    if (props.variant === 'skill' || props.variant === 'equipment') {
      return theme.rpg.panelBorderRadius;
    }
    return theme.borderRadius.lg;
  }};
  
  padding: ${props => {
    if (props.variant === 'item') {
      return theme.spacing.sm;
    }
    if (props.variant === 'skill' || props.variant === 'equipment') {
      return props.variant === 'skill' ? theme.spacing.xl : theme.spacing.md;
    }
    if (props.variant === 'choice') {
      return theme.spacing.md;
    }
    return theme.spacing.md;
  }};
  
  display: flex;
  flex-direction: column;
  align-items: ${props => props.variant === 'item' ? 'center' : 'flex-start'};
  justify-content: ${props => props.variant === 'equipment' ? 'center' : 'flex-start'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  
  ${props => {
    if (props.variant === 'skill') {
      return `
        box-shadow: ${theme.shadows.panel};
        min-height: 200px;
        
        &:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: ${theme.shadows.glow};
          border-color: ${props.isEquipped ? '#60a5fa' : theme.colors.primary};
        }
        
        @media (max-width: 768px) {
          padding: ${theme.spacing.lg};
        }
        
        @media (max-width: 480px) {
          padding: ${theme.spacing.md};
        }
      `;
    }
    
    if (props.variant === 'equipment') {
      return `
        min-height: 100px;
        ${props.gridArea ? `grid-area: ${props.gridArea};` : ''}
        
        &:hover {
          border-color: ${theme.colors.primary};
          transform: translateY(-3px) scale(1.05);
          box-shadow: ${theme.shadows.glow};
        }
        
        @media (max-width: 768px) {
          min-height: 70px;
        }
        
        @media (max-width: 480px) {
          min-height: 60px;
        }
      `;
    }
    
    if (props.variant === 'item') {
      return `
        gap: ${theme.spacing.xs};
        width: 70px;
        height: 70px;
        
        &:hover {
          border-color: ${theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `;
    }
    
    if (props.variant === 'choice') {
      return `
        margin-bottom: ${theme.spacing.md};
        width: 100%;
        text-align: left;
        align-items: flex-start;
        
        &:hover {
          background: ${theme.colors.background.panel};
          border-color: ${theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }
    
    if (props.variant === 'resource') {
      return `
        text-align: center;
        align-items: center;
        border: 1px solid ${theme.colors.border.secondary};
      `;
    }
    
    return `
      &:hover {
        border-color: ${theme.colors.primary};
        transform: translateY(-2px);
      }
    `;
  }}
  
  ${props => props.disabled ? `
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  ` : ''}
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  isSelected = false,
  isEquipped = false,
  isEmpty = false,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  className,
  disabled = false,
  gridArea,
  title,
}) => {
  return (
    <StyledCard
      variant={variant}
      isSelected={isSelected}
      isEquipped={isEquipped}
      isEmpty={isEmpty}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      disabled={disabled}
      gridArea={gridArea || ''}
      title={title}
    >
      {children}
    </StyledCard>
  );
};
