import styled from '@emotion/styled';
import { Dialog, DialogContent } from './Dialog';

interface NewFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enemyName: string;
}

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1.5rem;
`;

const FriendshipIcon = styled.div`
  font-size: 3.75rem;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4ade80; // green-400
  margin: 0;
`;

const MessageContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MessageText = styled.p`
  color: #d1d5db; // gray-300
  margin: 0;
`;

const EnemyName = styled.span`
  color: #22d3ee; // cyan-400
`;

const SubText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af; // gray-400
  margin: 0;
`;

const ContinueButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #16a34a; // green-600
  color: white;
  border: 2px solid #4ade80; // green-400
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1rem;

  &:hover {
    background: #15803d; // green-700
  }

  &:focus {
    outline: none;
  }
`;

/**
 * Modal shown when friendship counter reaches 3
 * (Both combatants defended 3 times)
 */
export function NewFriendsModal({ open, onOpenChange, enemyName }: NewFriendsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black border-2 border-green-400 text-white">
        <ModalContainer>
          {/* Friendship Icon */}
          <FriendshipIcon>🤝</FriendshipIcon>

          {/* Title */}
          <Title>New Friends!</Title>

          {/* Message */}
          <MessageContainer>
            <MessageText>
              Through mutual understanding and respect, you and <EnemyName>{enemyName}</EnemyName> have
              become friends!
            </MessageText>
            <SubText>
              Sometimes the best victory is finding common ground.
            </SubText>
          </MessageContainer>

          {/* Close Button */}
          <ContinueButton onClick={() => onOpenChange(false)}>
            Continue
          </ContinueButton>
        </ModalContainer>
      </DialogContent>
    </Dialog>
  );
}
