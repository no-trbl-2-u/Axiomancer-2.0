import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

interface PanelProps {
  children: React.ReactNode;
  variant?: 'default' | 'portrait' | 'stats' | 'equipment' | 'inventory' | 'info';
  width?: string | number;
  maxWidth?: string;
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  fullHeight?: boolean;
  scrollable?: boolean;
}

const StyledPanel = styled.div<{
  variant?: string | undefined;
  width?: string | number | undefined;
  maxWidth?: string | undefined;
  padding?: string | undefined;
  fullHeight?: boolean | undefined;
  scrollable?: boolean | undefined;
}>`
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  
  padding: ${props => {
    switch (props.padding) {
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      case 'xl': return theme.spacing.xl;
      default: return theme.spacing.lg;
    }
  }};
  
  box-shadow: ${theme.shadows.panel};
  display: flex;
  flex-direction: column;
  
  ${props => props.width ? `width: ${typeof props.width === 'number' ? `${props.width}px` : props.width};` : ''}
  ${props => props.maxWidth ? `max-width: ${props.maxWidth};` : ''}
  ${props => props.fullHeight ? 'height: 100%;' : ''}
  ${props => props.scrollable ? 'overflow-y: auto;' : ''}
  
  ${props => {
    switch (props.variant) {
      case 'portrait':
        return `
          width: 300px;
          align-items: center;
          gap: ${theme.spacing.md};
          
          @media (max-width: 768px) {
            width: 100%;
            max-width: 100%;
          }
        `;
      case 'stats':
        return `
          flex: 1;
          overflow-y: auto;
          
          @media (max-width: 768px) {
            padding: ${theme.spacing.md};
            max-height: 60vh;
          }
          
          @media (max-width: 480px) {
            padding: ${theme.spacing.sm};
          }
        `;
      case 'equipment':
        return `
          width: 400px;
          gap: ${theme.spacing.md};
          
          @media (max-width: 768px) {
            width: 100%;
            padding: ${theme.spacing.md};
          }
          
          @media (max-width: 480px) {
            padding: ${theme.spacing.sm};
          }
        `;
      case 'inventory':
        return `
          flex: 1;
          overflow-y: auto;
          
          @media (max-width: 768px) {
            padding: ${theme.spacing.md};
          }
          
          @media (max-width: 480px) {
            padding: ${theme.spacing.sm};
          }
        `;
      case 'info':
        return `
          margin-bottom: ${theme.spacing.xl};
          text-align: center;
          
          @media (max-width: 768px) {
            padding: ${theme.spacing.md};
            margin-bottom: ${theme.spacing.lg};
          }
          
          @media (max-width: 480px) {
            padding: ${theme.spacing.sm};
          }
        `;
      default:
        return '';
    }
  }}
`;

const PanelTitle = styled.h2<{ align?: string }>`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding-bottom: ${theme.spacing.sm};
  text-align: ${props => props.align || 'left'};

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const Panel: React.FC<PanelProps> = ({
  children,
  variant = 'default',
  width,
  maxWidth,
  title,
  titleAlign = 'left',
  className,
  padding = 'lg',
  fullHeight = false,
  scrollable = false,
}) => {
  return (
    <StyledPanel
      variant={variant}
      width={width}
      maxWidth={maxWidth}
      padding={padding}
      fullHeight={fullHeight}
      scrollable={scrollable}
      className={className}
    >
      {title && <PanelTitle align={titleAlign}>{title}</PanelTitle>}
      {children}
    </StyledPanel>
  );
};
