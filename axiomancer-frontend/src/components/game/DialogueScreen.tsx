import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { DialogueNode, DialogueChoice, NPC } from '../../types/game';

const DialogueContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0c4a6e 100%);
  color: white;
  padding: 100px ${theme.spacing.xl} 80px;
`;

const NPCSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const NPCName = styled.h2`
  color: ${theme.colors.primary};
  font-size: 2rem;
  margin-bottom: ${theme.spacing.md};
`;

const NPCAvatar = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.lg};
  font-size: 3rem;
`;

const DialoguePanel = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
  flex: 1;
`;

const DialogueText = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: ${theme.spacing.xl};
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
`;

const PhilosophicalTopic = styled.div`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;

  h4 {
    margin: 0;
    color: ${theme.colors.primary};
    font-size: 1.1rem;
  }
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ChoiceButton = styled.button<{ philosophicalType?: string }>`
  background: ${props => {
    switch (props.philosophicalType) {
      case 'virtue': return 'linear-gradient(45deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))';
      case 'deontological': return 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3))';
      case 'consequentialist': return 'linear-gradient(45deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.3))';
      case 'nihilistic': return 'linear-gradient(45deg, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))';
      default: return 'linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(139, 92, 246, 0.3))';
    }
  }};
  border: 2px solid ${props => {
    switch (props.philosophicalType) {
      case 'virtue': return '#10b981';
      case 'deontological': return '#3b82f6';
      case 'consequentialist': return '#f59e0b';
      case 'nihilistic': return '#6b7280';
      default: return theme.colors.primary;
    }
  }};
  color: white;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1rem;
  line-height: 1.4;

  &:hover {
    background: ${props => {
      switch (props.philosophicalType) {
        case 'virtue': return 'linear-gradient(45deg, rgba(16, 185, 129, 0.5), rgba(5, 150, 105, 0.5))';
        case 'deontological': return 'linear-gradient(45deg, rgba(59, 130, 246, 0.5), rgba(29, 78, 216, 0.5))';
        case 'consequentialist': return 'linear-gradient(45deg, rgba(245, 158, 11, 0.5), rgba(217, 119, 6, 0.5))';
        case 'nihilistic': return 'linear-gradient(45deg, rgba(107, 114, 128, 0.5), rgba(75, 85, 99, 0.5))';
        default: return 'linear-gradient(45deg, rgba(102, 126, 234, 0.5), rgba(139, 92, 246, 0.5))';
      }
    }};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const RequirementText = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: ${theme.spacing.xs};
`;

const BackButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${theme.spacing.lg};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// Mock dialogue for the Guardian
const guardianDialogue: DialogueNode[] = [
  {
    id: 'guardian_intro',
    text: 'Ah, my young philosopher, you seek to understand the world beyond our peaceful town. But tell me, what guides your moral compass as you venture forth?',
    philosophicalTopic: 'Ethics and Moral Philosophy',
    choices: [
      {
        id: 'virtue_choice',
        text: 'I believe in cultivating virtue and excellence of character. A good person will naturally do good deeds.',
        philosophicalAlignment: { ethics: 'virtue' },
        outcome: { type: 'stat_change', key: 'wisdom', value: 2 },
      },
      {
        id: 'duty_choice',
        text: 'There are universal moral duties we must follow, regardless of consequences. Some things are simply right or wrong.',
        philosophicalAlignment: { ethics: 'deontological' },
        outcome: { type: 'stat_change', key: 'constitution', value: 2 },
      },
      {
        id: 'consequence_choice',
        text: 'What matters most are the outcomes of our actions. We should act to produce the greatest good for the greatest number.',
        philosophicalAlignment: { ethics: 'consequentialist' },
        outcome: { type: 'stat_change', key: 'intelligence', value: 2 },
      },
      {
        id: 'skeptical_choice',
        text: 'Perhaps there are no universal moral truths. Each situation requires its own consideration.',
        philosophicalAlignment: { ethics: 'nihilistic' },
        outcome: { type: 'stat_change', key: 'dexterity', value: 2 },
      },
    ],
  },
  {
    id: 'guardian_followup',
    text: 'Wise words, young one. But knowledge itself is a mysterious thing. How do you believe we come to know what is true about the world?',
    philosophicalTopic: 'Epistemology - The Nature of Knowledge',
    choices: [
      {
        id: 'empirical_choice',
        text: 'Through experience and observation. Our senses reveal the truth of the world around us.',
        philosophicalAlignment: { epistemology: 'empiricist' },
        outcome: { type: 'stat_change', key: 'dexterity', value: 1 },
      },
      {
        id: 'rational_choice',
        text: 'Through reason and logical thinking. The mind can discover truths independent of sensory experience.',
        philosophicalAlignment: { epistemology: 'rationalist' },
        outcome: { type: 'stat_change', key: 'intelligence', value: 1 },
      },
      {
        id: 'mystical_choice',
        text: 'Some truths come through intuition and spiritual insight, beyond both reason and experience.',
        philosophicalAlignment: { epistemology: 'mystical' },
        outcome: { type: 'stat_change', key: 'wisdom', value: 1 },
      },
      {
        id: 'skeptical_knowledge',
        text: 'Perhaps true knowledge is impossible. We must always doubt and question our beliefs.',
        philosophicalAlignment: { epistemology: 'skeptical' },
        outcome: { type: 'stat_change', key: 'charisma', value: 1 },
      },
    ],
  },
];

const mockNPC: NPC = {
  id: 'guardian',
  name: 'Your Guardian',
  description: 'The wise adult who raised you',
  dialogue: guardianDialogue,
};

interface DialogueScreenProps {
  npcId?: string;
}

export const DialogueScreen = React.memo<DialogueScreenProps>(({ npcId = 'guardian' }) => {
  const { gameState, updateCharacter, changeScreen } = useGame();
  const [currentNodeId, setCurrentNodeId] = useState('guardian_intro');
  const [conversationComplete, setConversationComplete] = useState(false);

  const npc = mockNPC; // In a real game, this would be looked up by npcId
  const currentNode = npc.dialogue.find(node => node.id === currentNodeId);

  const handleChoice = (choice: DialogueChoice) => {
    // Apply philosophical alignment changes
    if (choice.philosophicalAlignment) {
      const updatedStance = {
        ...gameState.character.philosophicalStance,
        ...choice.philosophicalAlignment,
      };
      updateCharacter({ philosophicalStance: updatedStance });
    }

    // Apply stat changes
    if (choice.outcome && choice.outcome.type === 'stat_change') {
      const currentValue = gameState.character.stats[choice.outcome.key as keyof typeof gameState.character.stats];
      const newStats = {
        ...gameState.character.stats,
        [choice.outcome.key]: currentValue + (choice.outcome.value as number),
      };
      updateCharacter({ stats: newStats });
    }

    // Navigate to next node or end conversation
    if (choice.nextNodeId) {
      setCurrentNodeId(choice.nextNodeId);
    } else {
      // Move to next dialogue in sequence
      const currentIndex = npc.dialogue.findIndex(node => node.id === currentNodeId);
      if (currentIndex < npc.dialogue.length - 1) {
        const nextNode = npc.dialogue[currentIndex + 1];
        if (nextNode) {
          setCurrentNodeId(nextNode.id);
        }
      } else {
        setConversationComplete(true);
      }
    }
  };

  const getPhilosophicalType = (choice: DialogueChoice): string => {
    if (choice.philosophicalAlignment?.ethics) {
      return choice.philosophicalAlignment.ethics;
    }
    return 'default';
  };

  const checkRequirements = (choice: DialogueChoice): boolean => {
    // TODO: Implement requirement checking
    return true;
  };

  const getRequirementText = (choice: DialogueChoice): string => {
    if (!choice.requirements) return '';
    // TODO: Format requirements text
    return '';
  };

  if (conversationComplete) {
    return (
      <DialogueContainer>
        <NPCSection>
          <NPCAvatar>👴</NPCAvatar>
          <NPCName>{npc.name}</NPCName>
        </NPCSection>

        <DialoguePanel>
          <DialogueText>
            "You have grown much in wisdom through our conversation, young philosopher.
            May your journey be filled with meaningful choices and deep contemplation.
            Go forth with my blessing."
          </DialogueText>

          <BackButton onClick={() => changeScreen('exploration')}>
            Return to Exploration
          </BackButton>
        </DialoguePanel>
      </DialogueContainer>
    );
  }

  if (!currentNode) {
    return (
      <DialogueContainer>
        <div>Error: Dialogue node not found</div>
        <BackButton onClick={() => changeScreen('exploration')}>
          Return to Exploration
        </BackButton>
      </DialogueContainer>
    );
  }

  return (
    <DialogueContainer>
      <NPCSection>
        <NPCAvatar>👴</NPCAvatar>
        <NPCName>{npc.name}</NPCName>
      </NPCSection>

      <DialoguePanel>
        {currentNode.philosophicalTopic && (
          <PhilosophicalTopic>
            <h4>💭 {currentNode.philosophicalTopic}</h4>
          </PhilosophicalTopic>
        )}

        <DialogueText>"{currentNode.text}"</DialogueText>

        <ChoicesContainer>
          {currentNode.choices.map(choice => (
            <ChoiceButton
              key={choice.id}
              philosophicalType={getPhilosophicalType(choice)}
              disabled={!checkRequirements(choice)}
              onClick={() => handleChoice(choice)}
            >
              {choice.text}
              {getRequirementText(choice) && (
                <RequirementText>{getRequirementText(choice)}</RequirementText>
              )}
            </ChoiceButton>
          ))}
        </ChoicesContainer>
      </DialoguePanel>

      <BackButton onClick={() => changeScreen('exploration')}>
        End Conversation
      </BackButton>
    </DialogueContainer>
  );
});