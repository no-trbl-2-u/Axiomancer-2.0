import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import styled from '@emotion/styled';
import { theme } from '@styles/theme';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}

const StyledContent = styled(TooltipPrimitive.Content)`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  font-size: 0.875rem;
  line-height: 1.4;
  max-width: 300px;
  z-index: 10000;
  box-shadow: ${theme.shadows.lg};
  animation: slideUpAndFade 0.2s ease;

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    max-width: 250px;
  }
`;

const StyledArrow = styled(TooltipPrimitive.Arrow)`
  fill: ${theme.colors.border.primary};
`;

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 300,
}) => {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <StyledContent side={side} align={align} sideOffset={5}>
          {content}
          <StyledArrow />
        </StyledContent>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};
