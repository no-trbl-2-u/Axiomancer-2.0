import React from 'react';
import styled from '@emotion/styled';
import { theme } from '@styles/theme';

interface StatRowProps {
  label: string;
  value: string | number;
  icon?: string;
  variant?: 'default' | 'assignment' | 'skill';
  onClick?: () => void;
}

interface StatCategoryProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  variant?: 'default' | 'compact';
}

interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

const StyledStatRow = styled.div<{ variant?: string; clickable?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 2px solid ${theme.colors.border.dark};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.rpg.buttonBorderRadius};
  margin-bottom: ${theme.spacing.sm};
  min-height: 48px;
  transition: all 0.2s ease;
  
  ${props => props.clickable ? `
    cursor: pointer;
    &:hover {
      background: ${theme.colors.background.panel};
      border-color: ${theme.colors.border.primary};
      transform: translateX(4px);
    }
  ` : ''}
  
  &:last-child {
    margin-bottom: 0;
  }
  
  ${props => {
    if (props.variant === 'assignment') {
      return `
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        background: ${theme.colors.background.panel};
        border: 1px solid ${theme.colors.border.secondary};
      `;
    }
    return '';
  }}
`;

const StatLabel = styled.span<{ variant?: string }>`
  font-weight: bold;
  text-transform: uppercase;
  color: ${theme.colors.text.secondary};
  font-family: monospace;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${props => props.variant === 'assignment' ? `
    font-size: 0.9rem;
  ` : ''}
`;

const StatValue = styled.span<{ variant?: string }>`
  color: ${theme.colors.text.accent};
  font-weight: bold;
  font-family: monospace;
  font-size: 1.1rem;
  
  ${props => props.variant === 'assignment' ? `
    font-size: 1rem;
  ` : ''}
`;

const StyledStatCategory = styled.div<{ variant?: string }>`
  padding: ${theme.spacing.md};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.dark};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  ${props => props.variant === 'compact' ? `
    padding: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.lg};
  ` : ''}
`;

const CategoryTitle = styled.h3`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledStatGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columns || 3}, 1fr)`};
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.sm};
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  text-align: center;
  padding: ${theme.spacing.xs};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.dark};
  
  .stat-label {
    font-size: 0.7rem;
    color: ${theme.colors.text.muted};
    text-transform: uppercase;
    margin-bottom: 2px;
    
    @media (max-width: 480px) {
      font-size: 0.6rem;
    }
  }
  
  .stat-value {
    font-size: 1rem;
    font-weight: bold;
    color: ${theme.colors.text.accent};
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.xs};
  }
`;

export const StatRow: React.FC<StatRowProps> = ({
  label,
  value,
  icon,
  variant = 'default',
  onClick,
}) => {
  return (
    <StyledStatRow variant={variant} clickable={!!onClick} onClick={onClick}>
      <StatLabel variant={variant}>
        {icon && <span>{icon}</span>}
        {label}
      </StatLabel>
      <StatValue variant={variant}>{value}</StatValue>
    </StyledStatRow>
  );
};

export const StatCategory: React.FC<StatCategoryProps> = ({
  title,
  icon,
  children,
  variant = 'default',
}) => {
  return (
    <StyledStatCategory variant={variant}>
      <CategoryTitle>
        {icon && `${icon} `}{title}
      </CategoryTitle>
      {children}
    </StyledStatCategory>
  );
};

export const StatGrid: React.FC<StatGridProps> = ({
  children,
  columns = 3,
}) => {
  return (
    <StyledStatGrid columns={columns}>
      {children}
    </StyledStatGrid>
  );
};

export const StatGridItem: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => {
  return (
    <StatBox>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </StatBox>
  );
};
