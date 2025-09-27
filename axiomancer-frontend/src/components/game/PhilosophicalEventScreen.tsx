import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { PhilosophicalEvent, PhilosophicalChoice, applyPhilosophicalChoice } from '../../utils/philosophicalEvents';

const EventContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px ${theme.spacing.xl} 100px;
  background: ${theme.colors.background.primary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(75, 0, 130, 0.3) 0%, rgba(0, 0, 0, 0.8) 70%);
    pointer-events: none;
  }
`;

const EventPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: 3px solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.xl};
  max-width: 800px;
  width: 100%;
  box-shadow: ${theme.shadows.panel};
  position: relative;
  z-index: 1;
`;

const EventTitle = styled.h2`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.lg} 0;
  font-size: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: bold;
`;

const EventDescription = styled.div`
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const EventText = styled.p`
  color: ${theme.colors.text.primary};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: ${theme.spacing.lg};
`;

const EventContext = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  font-style: italic;
  color: #c4b5fd;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ChoiceButton = styled.button`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.buttonBorderRadius};
  padding: ${theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  box-shadow: ${theme.shadows.button};

  &:hover {
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChoiceText = styled.div`
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: ${theme.spacing.xs};
  line-height: 1.4;
`;

const ChoicePosition = styled.div`
  color: ${theme.colors.text.accent};
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
`;

const ChoiceConsequences = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.85rem;
  line-height: 1.3;
  font-style: italic;
`;

const ResultPanel = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.xl};
  text-align: center;
  margin-top: ${theme.spacing.xl};
`;

const ResultTitle = styled.h3`
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.5rem;
  font-weight: bold;
`;

const ResultMessage = styled.p`
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: ${theme.spacing.lg};
`;

const ContinueButton = styled.button`
  background: ${theme.colors.success};
  border: 2px solid ${theme.colors.success};
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.1rem;
  box-shadow: ${theme.shadows.button};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

interface PhilosophicalEventScreenProps {
  event: PhilosophicalEvent;
  onComplete: () => void;
}

export const PhilosophicalEventScreen = React.memo<PhilosophicalEventScreenProps>(({ 
  event, 
  onComplete 
}) => {
  const { gameState, updateCharacter } = useGame();
  const { character } = gameState;
  const [selectedChoice, setSelectedChoice] = useState<PhilosophicalChoice | null>(null);
  const [result, setResult] = useState<{ message: string; updates: any } | null>(null);

  const handleChoiceSelect = (choice: PhilosophicalChoice) => {
    const choiceResult = applyPhilosophicalChoice(character, choice);
    
    // Apply the character updates
    updateCharacter(choiceResult.updatedCharacter);
    
    setSelectedChoice(choice);
    setResult({
      message: choiceResult.message,
      updates: choiceResult.updatedCharacter
    });
  };

  const handleContinue = () => {
    onComplete();
  };

  if (result) {
    return (
      <EventContainer>
        <EventPanel>
          <ResultTitle>Philosophical Growth</ResultTitle>
          <ResultMessage>{result.message}</ResultMessage>
          <ContinueButton onClick={handleContinue}>
            Continue Journey
          </ContinueButton>
        </EventPanel>
      </EventContainer>
    );
  }

  return (
    <EventContainer>
      <EventPanel>
        <EventTitle>{event.title}</EventTitle>
        
        <EventDescription>
          <EventText>{event.description}</EventText>
          <EventContext>{event.context}</EventContext>
        </EventDescription>

        <ChoicesContainer>
          {event.choices.map(choice => (
            <ChoiceButton
              key={choice.id}
              onClick={() => handleChoiceSelect(choice)}
            >
              <ChoiceText>{choice.text}</ChoiceText>
              <ChoicePosition>{choice.philosophicalPosition}</ChoicePosition>
              <ChoiceConsequences>{choice.consequences}</ChoiceConsequences>
            </ChoiceButton>
          ))}
        </ChoicesContainer>
      </EventPanel>
    </EventContainer>
  );
});