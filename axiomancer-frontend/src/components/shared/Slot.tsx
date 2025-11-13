import React from 'react';
import styled from '@emotion/styled';
import { theme } from '@styles/theme';

interface SlotProps {
  isEmpty: boolean;
  icon?: string;
  label?: string;
  itemName?: string;
  itemIcon?: string;
  variant?: 'equipment' | 'skill' | 'inventory';
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  gridArea?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  cost?: number | string;
  children?: React.ReactNode;
}

interface SlotsContainerProps {
  children: React.ReactNode;
  variant?: 'equipment' | 'skill';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StyledSlot = styled.div<{
  isEmpty: boolean;
  variant?: string;
  gridArea?: string;
  size?: string;
}>`
  background: ${props => {
    if (props.isEmpty) {
      if (props.variant === 'skill') {
        return 'linear-gradient(45deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))';
      }
      return theme.colors.background.secondary;
    }
    if (props.variant === 'skill') {
      return 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3))';
    }
    return 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))';
  }};
  
  border: ${props => {
    if (props.isEmpty) {
      return `3px solid ${props.variant === 'skill' ? '#6b7280' : theme.colors.border.dark}`;
    }
    return `3px solid ${props.variant === 'skill' ? '#3b82f6' : theme.colors.success}`;
  }};
  
  border-radius: ${theme.borderRadius.lg};
  
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.isEmpty ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  
  width: ${props => {
    if (props.size === 'sm') return '80px';
    if (props.size === 'lg') return '140px';
    return '120px';
  }};
  
  height: ${props => {
    if (props.size === 'sm') return '80px';
    if (props.size === 'lg') return '140px';
    return '120px';
  }};
  
  ${props => props.gridArea ? `grid-area: ${props.gridArea};` : ''}
  
  &:hover {
    ${props => props.isEmpty ? '' : `
      border-color: ${theme.colors.primary};
      transform: ${props.variant === 'equipment' ? 'translateY(-3px) scale(1.05)' : 'translateY(-2px)'};
      box-shadow: ${theme.shadows.glow};
    `}
  }
  
  .slot-label {
    color: ${theme.colors.text.secondary};
    font-size: 0.7rem;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: ${theme.spacing.xs};
    
    @media (max-width: 480px) {
      font-size: 0.6rem;
    }
  }
  
  .slot-icon {
    font-size: ${props => props.size === 'sm' ? '1.2rem' : '1.5rem'};
    
    @media (max-width: 480px) {
      font-size: ${props => props.size === 'sm' ? '1rem' : '1.2rem'};
    }
  }
  
  .item-name {
    color: ${theme.colors.text.accent};
    font-size: 0.75rem;
    text-align: center;
    margin-top: ${theme.spacing.xs};
    
    @media (max-width: 480px) {
      font-size: 0.65rem;
    }
  }
  
  @media (max-width: 768px) {
    width: ${props => {
      if (props.size === 'sm') return '70px';
      if (props.size === 'lg') return '110px';
      return '100px';
    }};
    
    height: ${props => {
      if (props.size === 'sm') return '70px';
      if (props.size === 'lg') return '110px';
      return '100px';
    }};
  }
  
  @media (max-width: 480px) {
    width: ${props => {
      if (props.size === 'sm') return '60px';
      if (props.size === 'lg') return '90px';
      return '80px';
    }};
    
    height: ${props => {
      if (props.size === 'sm') return '60px';
      if (props.size === 'lg') return '90px';
      return '80px';
    }};
  }
`;

const EmptySlotText = styled.div`
  color: ${theme.colors.text.muted};
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
`;

const SlotCost = styled.div`
  color: ${theme.colors.info};
  font-size: 0.7rem;
  font-weight: bold;
  background: rgba(59, 130, 246, 0.2);
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  margin-top: ${theme.spacing.xs};
`;

const StyledSlotsContainer = styled.div<{
  variant?: string;
  gap?: string;
}>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  
  gap: ${props => {
    switch (props.gap) {
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.lg;
    }
  }};
  
  ${props => {
    if (props.variant === 'equipment' || props.variant === 'skill') {
      return `
        margin-bottom: ${theme.spacing.xl};
        padding: ${theme.spacing.md};
        background: rgba(0, 0, 0, 0.2);
        border-radius: ${theme.borderRadius.lg};
        border: 2px solid ${theme.colors.border.dark};
        
        @media (max-width: 768px) {
          gap: ${theme.spacing.md};
          margin-bottom: ${theme.spacing.lg};
        }
      `;
    }
    return '';
  }}
`;

export const Slot: React.FC<SlotProps> = ({
  isEmpty,
  icon,
  label,
  itemName,
  itemIcon,
  variant = 'equipment',
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  gridArea,
  title,
  size = 'md',
  cost,
  children,
}) => {
  return (
    <StyledSlot
      isEmpty={isEmpty}
      variant={variant}
      gridArea={gridArea}
      size={size}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      title={title}
    >
      {children || (
        <>
          {label && <div className="slot-label">{label}</div>}
          <div className="slot-icon">{itemIcon || icon}</div>
          {itemName && <div className="item-name">{itemName}</div>}
          {isEmpty && !itemIcon && !children && <EmptySlotText>Empty</EmptySlotText>}
          {cost && <SlotCost>{cost} MP</SlotCost>}
        </>
      )}
    </StyledSlot>
  );
};

export const SlotsContainer: React.FC<SlotsContainerProps> = ({
  children,
  variant = 'equipment',
  gap = 'lg',
  className,
}) => {
  return (
    <StyledSlotsContainer variant={variant} gap={gap} className={className}>
      {children}
    </StyledSlotsContainer>
  );
};
