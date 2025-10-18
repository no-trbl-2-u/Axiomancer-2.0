import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'combat' | 'locked' | 'event' | 'skill';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeButtonVariant?: 'danger' | 'secondary' | 'primary';
  title?: string;
  headerVariant?: 'default' | 'centered' | 'minimal';
  overlayBlur?: boolean;
  animation?: 'fade' | 'scale' | 'slide';
  overlayClick?: boolean;
}

const ModalOverlay = styled.div<{ 
  isOpen: boolean; 
  blur?: boolean;
  animation?: string;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.lg};
  backdrop-filter: ${props => props.blur ? 'blur(4px)' : 'none'};
  
  ${props => {
    if (props.animation === 'fade') {
      return `
        animation: fadeIn 0.2s ease;
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
    }
    if (props.animation === 'scale') {
      return `
        animation: scaleIn 0.3s ease;
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `;
    }
    return '';
  }}
`;

const ModalContent = styled.div<{ 
  variant?: string; 
  size?: string;
  animation?: string;
}>`
  background: ${props => {
    switch (props.variant) {
      case 'combat':
      case 'event':
        return theme.colors.background.panel;
      case 'locked':
        return theme.colors.background.panel;
      default:
        return theme.colors.background.primary;
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'locked':
        return `${theme.rpg.borderWidth} solid ${theme.colors.danger}`;
      case 'combat':
      case 'event':
        return `2px solid ${theme.colors.border.primary}`;
      default:
        return `2px solid ${theme.colors.border.primary}`;
    }
  }};
  
  border-radius: ${theme.borderRadius.lg};
  
  width: ${props => {
    switch (props.size) {
      case 'sm': return '90%';
      case 'md': return '90%';
      case 'lg': return '90%';
      case 'xl': return '95vw';
      case 'full': return '95vw';
      default: return '90%';
    }
  }};
  
  max-width: ${props => {
    switch (props.size) {
      case 'sm': return '400px';
      case 'md': return '600px';
      case 'lg': return '800px';
      case 'xl': return '95vw';
      case 'full': return '95vw';
      default: return '800px';
    }
  }};
  
  height: ${props => {
    if (props.variant === 'combat' || props.size === 'full') {
      return '95vh';
    }
    return 'auto';
  }};
  
  max-height: ${props => props.variant === 'combat' || props.size === 'full' ? '95vh' : '90vh'};
  overflow-y: auto;
  position: relative;
  
  ${props => props.variant === 'combat' || props.size === 'full' ? `
    display: flex;
    flex-direction: column;
  ` : ''}
  
  ${props => props.variant === 'locked' ? `
    box-shadow: 0 0 30px rgba(220, 20, 60, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${theme.spacing.xxl};
    gap: ${theme.spacing.lg};
  ` : ''}
  
  ${props => {
    if (props.animation === 'scale') {
      return `
        animation: contentScaleIn 0.3s ease;
        @keyframes contentScaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `;
    }
    return '';
  }}

  @media (max-width: 768px) {
    width: ${props => props.size === 'sm' ? '85%' : '90%'};
    max-width: ${props => {
      switch (props.size) {
        case 'sm': return '400px';
        case 'md': return '450px';
        default: return '95vw';
      }
    }};
    padding: ${props => props.variant === 'locked' ? theme.spacing.xl : '0'};
  }

  @media (max-width: 480px) {
    width: ${props => props.size === 'sm' ? '90%' : '95%'};
    max-width: ${props => props.size === 'sm' ? '380px' : '95vw'};
    padding: ${props => props.variant === 'locked' ? theme.spacing.lg : '0'};
  }
`;

const ModalHeader = styled.div<{ variant?: string }>`
  background: ${theme.colors.background.secondary};
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding: ${theme.spacing.lg};
  text-align: ${props => props.variant === 'centered' ? 'center' : 'left'};

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0;
    font-size: 1.5rem;
  }

  ${props => props.variant === 'minimal' ? `
    background: transparent;
    border-bottom: none;
    padding: ${theme.spacing.md};
  ` : ''}
`;

const ModalBody = styled.div<{ isCombat?: boolean }>`
  padding: ${props => props.isCombat ? '0' : theme.spacing.lg};
  ${props => props.isCombat ? `flex: 1;` : ''}
`;

const CloseButton = styled.button<{ variant?: string }>`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: ${props => {
    switch (props.variant) {
      case 'danger': return theme.colors.danger;
      case 'secondary': return theme.colors.gray[500];
      case 'primary': return theme.colors.primary;
      default: return theme.colors.danger;
    }
  }};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.secondary};
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  closeButtonVariant = 'danger',
  title,
  headerVariant = 'default',
  overlayBlur = false,
  animation = 'fade',
  overlayClick = true,
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayClick && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isCombat = variant === 'combat';

  return (
    <ModalOverlay 
      isOpen={isOpen} 
      blur={overlayBlur}
      animation={animation}
      onClick={handleOverlayClick}
    >
      <ModalContent variant={variant} size={size} animation={animation}>
        {showCloseButton && onClose && variant !== 'combat' && (
          <CloseButton onClick={onClose} variant={closeButtonVariant}>
            ×
          </CloseButton>
        )}
        
        {title && variant !== 'combat' && (
          <ModalHeader variant={headerVariant}>
            <h2>{title}</h2>
          </ModalHeader>
        )}
        
        <ModalBody isCombat={isCombat}>
          {children}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
