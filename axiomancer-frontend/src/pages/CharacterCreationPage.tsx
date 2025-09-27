import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useGame } from '../contexts/GameContext';

const CreationContainer = styled.div`
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  text-align: center;
  border: 2px solid rgba(102, 126, 234, 0.3);
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
`;

const StoryText = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.xl};
  border-left: 4px solid ${theme.colors.primary};

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: ${theme.spacing.md};
    font-style: italic;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const InputGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
  text-align: left;
`;

const Label = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-bottom: ${theme.spacing.sm};
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: ${theme.borderRadius.md};
  color: white;
  font-size: 1.1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const PhilosophySection = styled.div`
  margin: ${theme.spacing.xl} 0;
  text-align: left;
`;

const PhilosophyTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  font-size: 1.3rem;
`;

const PhilosophyGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
`;

const PhilosophyOption = styled.div<{ selected: boolean }>`
  background: rgba(255, 255, 255, ${props => props.selected ? 0.15 : 0.05});
  border: 2px solid ${props => props.selected ? theme.colors.primary : 'rgba(102, 126, 234, 0.2)'};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${theme.colors.primary};
  }

  .option-title {
    color: ${props => props.selected ? theme.colors.primary : 'rgba(255, 255, 255, 0.9)'};
    font-weight: 600;
    margin-bottom: ${theme.spacing.xs};
  }

  .option-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(45deg, ${theme.colors.primary}, #8b5cf6);
  color: white;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${theme.spacing.lg};
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const philosophicalStances = {
  ethics: [
    {
      id: 'virtue',
      title: 'Virtue Ethics',
      description: 'Focus on character and what it means to live a good life. Actions should cultivate virtue and excellence.',
    },
    {
      id: 'deontological',
      title: 'Deontological Ethics',
      description: 'Believe in universal moral duties and rules. Some actions are inherently right or wrong.',
    },
    {
      id: 'consequentialist',
      title: 'Consequentialist Ethics',
      description: 'Judge actions by their outcomes. The ends can justify the means if they produce the greatest good.',
    },
    {
      id: 'nihilistic',
      title: 'Nihilistic Ethics',
      description: 'Question the existence of objective moral truths. Morality may be subjective or meaningless.',
    },
  ],
  metaphysics: [
    {
      id: 'materialist',
      title: 'Materialist',
      description: 'Reality consists of physical matter and energy. Everything can be explained through material processes.',
    },
    {
      id: 'idealist',
      title: 'Idealist',
      description: 'Reality is fundamentally mental or spiritual. The material world may be secondary to consciousness.',
    },
    {
      id: 'dualist',
      title: 'Dualist',
      description: 'Both mind and matter are fundamental aspects of reality, neither reducible to the other.',
    },
    {
      id: 'pragmatist',
      title: 'Pragmatist',
      description: 'Focus on practical consequences rather than abstract truths. What works is what matters.',
    },
  ],
  epistemology: [
    {
      id: 'empiricist',
      title: 'Empiricist',
      description: 'Knowledge comes primarily through sensory experience and observation of the world.',
    },
    {
      id: 'rationalist',
      title: 'Rationalist',
      description: 'Reason and logical thinking are the primary sources of knowledge and truth.',
    },
    {
      id: 'skeptical',
      title: 'Skeptical',
      description: 'Question the possibility of certain knowledge. Doubt claims and demand strong evidence.',
    },
    {
      id: 'mystical',
      title: 'Mystical',
      description: 'Some knowledge comes through intuition, spiritual insight, or direct experience of truth.',
    },
  ],
};

export const CharacterCreationPage = React.memo(() => {
  const { startNewGame } = useGame();
  const [characterName, setCharacterName] = useState('');
  const [selectedStances, setSelectedStances] = useState({
    ethics: 'virtue',
    metaphysics: 'materialist',
    epistemology: 'empiricist',
  });

  const handleStanceSelection = (category: string, stance: string) => {
    setSelectedStances(prev => ({
      ...prev,
      [category]: stance,
    }));
  };

  const handleStartGame = () => {
    if (characterName.trim()) {
      startNewGame(characterName.trim());
    }
  };

  return (
    <CreationContainer>
      <Title>The Axiomancer's Journey</Title>
      <Subtitle>Create your philosopher-adventurer</Subtitle>

      <StoryText>
        <p>
          "In a world where philosophy shapes reality itself, you are a young seeker
          beginning an extraordinary journey of discovery and growth."
        </p>
        <p>
          "Your beliefs will determine not just how you see the world,
          but how the world responds to you. Choose wisely, for each stance
          will open different paths and possibilities."
        </p>
      </StoryText>

      <InputGroup>
        <Label>What is your name, young philosopher?</Label>
        <Input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Enter your character's name"
          maxLength={20}
        />
      </InputGroup>

      <PhilosophySection>
        <PhilosophyTitle>Your Ethical Foundation</PhilosophyTitle>
        <PhilosophyGrid>
          {philosophicalStances.ethics.map(stance => (
            <PhilosophyOption
              key={stance.id}
              selected={selectedStances.ethics === stance.id}
              onClick={() => handleStanceSelection('ethics', stance.id)}
            >
              <div className="option-title">{stance.title}</div>
              <div className="option-description">{stance.description}</div>
            </PhilosophyOption>
          ))}
        </PhilosophyGrid>
      </PhilosophySection>

      <PhilosophySection>
        <PhilosophyTitle>Your View of Reality</PhilosophyTitle>
        <PhilosophyGrid>
          {philosophicalStances.metaphysics.map(stance => (
            <PhilosophyOption
              key={stance.id}
              selected={selectedStances.metaphysics === stance.id}
              onClick={() => handleStanceSelection('metaphysics', stance.id)}
            >
              <div className="option-title">{stance.title}</div>
              <div className="option-description">{stance.description}</div>
            </PhilosophyOption>
          ))}
        </PhilosophyGrid>
      </PhilosophySection>

      <PhilosophySection>
        <PhilosophyTitle>Your Approach to Knowledge</PhilosophyTitle>
        <PhilosophyGrid>
          {philosophicalStances.epistemology.map(stance => (
            <PhilosophyOption
              key={stance.id}
              selected={selectedStances.epistemology === stance.id}
              onClick={() => handleStanceSelection('epistemology', stance.id)}
            >
              <div className="option-title">{stance.title}</div>
              <div className="option-description">{stance.description}</div>
            </PhilosophyOption>
          ))}
        </PhilosophyGrid>
      </PhilosophySection>

      <StartButton
        onClick={handleStartGame}
        disabled={!characterName.trim()}
      >
        Begin Your Journey
      </StartButton>
    </CreationContainer>
  );
});