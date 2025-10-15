import React from 'react';
import styled from '@emotion/styled';
import { OctagonX } from 'lucide-react';
import { theme } from '../../styles/theme';

interface LockedNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.danger};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.xxl};
  max-width: 500px;
  width: 90%;
  box-shadow: 0 0 30px rgba(220, 20, 60, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  animation: scaleIn 0.3s ease;

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.xl};
    max-width: 400px;
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.lg};
    width: 85%;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
`;

const Message = styled.p`
  color: ${theme.colors.text.primary};
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CloseButton = styled.button`
  background: ${theme.colors.danger};
  color: white;
  border: 2px solid ${theme.colors.danger};
  border-radius: ${theme.rpg.buttonBorderRadius};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: ${theme.shadows.button};
  transition: all 0.2s ease;
  font-size: 1rem;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
    background: ${theme.colors.danger};
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: 0.9rem;
  }
`;

export const LockedNodeModal: React.FC<LockedNodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <IconWrapper>
          <OctagonX
            size={120}
            color={theme.colors.danger}
            strokeWidth={2.5}
          />
        </IconWrapper>
        <Message>You can not venture here, young one</Message>
        <CloseButton onClick={onClose}>
          Understood
        </CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};
