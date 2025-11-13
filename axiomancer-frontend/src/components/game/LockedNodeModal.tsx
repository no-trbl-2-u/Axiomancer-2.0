import React from 'react';
import styled from '@emotion/styled';
import { OctagonX } from 'lucide-react';
import { Modal } from '@components/shared/Modal';
import { Text } from '@components/shared/Text';
import { ActionButton } from '@components/shared/ActionButton';
import { theme } from '@styles/theme';

interface LockedNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const LockedNodeModal: React.FC<LockedNodeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="locked"
      size="sm"
      showCloseButton={false}
      overlayBlur
      animation="scale"
      overlayClick
    >
      <IconWrapper>
        <OctagonX
          size={120}
          color={theme.colors.danger}
          strokeWidth={2.5}
        />
      </IconWrapper>
      <Text 
        size="lg" 
        variant="primary" 
        weight="bold" 
        align="center"
        style={{ 
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          lineHeight: 1.4,
          fontSize: '1.5rem'
        }}
      >
        You can not venture here, young one
      </Text>
      <ActionButton 
        variant="danger" 
        size="md"
        onClick={onClose}
        style={{ minWidth: '120px' }}
      >
        Understood
      </ActionButton>
    </Modal>
  );
};
