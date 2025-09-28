import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

interface Portrait {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'non-binary';
}

const AVAILABLE_PORTRAITS: Portrait[] = [
  {
    id: 'beggar',
    name: 'The Wandering Philosopher',
    imageUrl: '/portraits/c-begger.png',
    gender: 'non-binary'
  },
  {
    id: 'link',
    name: 'The Young Seeker',
    imageUrl: '/portraits/mc-link.jpg',
    gender: 'male'
  },
  {
    id: 'father',
    name: 'The Wise Guardian',
    imageUrl: '/portraits/npc-father.jpg',
    gender: 'male'
  }
];

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: ${theme.spacing.xl};
`;

const CreationPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: 3px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  max-width: 600px;
  width: 100%;
  box-shadow: ${theme.shadows.panel};
`;

const Title = styled.h1`
  color: ${theme.colors.text.accent};
  text-align: center;
  margin: 0 0 ${theme.spacing.xl} 0;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing.xl} 0;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing.lg};

  label {
    display: block;
    color: ${theme.colors.text.primary};
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
    font-size: 1.1rem;
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: 1.1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(218, 165, 32, 0.2);
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

const GenderSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const GenderButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: ${theme.spacing.md};
  background: ${props => props.selected ? theme.colors.primary : theme.colors.background.secondary};
  color: ${props => props.selected ? theme.colors.dark : theme.colors.text.primary};
  border: 2px solid ${props => props.selected ? theme.colors.primary : theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.selected ? theme.colors.accent : theme.colors.primary};
    color: ${theme.colors.dark};
  }
`;

const PortraitSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
`;

const PortraitOption = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.md};
  background: ${props => props.selected ? theme.colors.primary : theme.colors.background.secondary};
  border: 2px solid ${props => props.selected ? theme.colors.primary : theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.selected ? theme.colors.accent : theme.colors.primary};
    transform: translateY(-2px);
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: ${theme.spacing.sm};
    border: 2px solid ${theme.colors.border.primary};
  }

  span {
    color: ${props => props.selected ? theme.colors.dark : theme.colors.text.primary};
    font-weight: 600;
    text-align: center;
    font-size: 0.9rem;
  }
`;

const CreateButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.success};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: ${theme.spacing.xl};
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.warning};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.muted};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const CharacterCreationScreen: React.FC = () => {
  const { startNewGame } = useGame();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'non-binary'>('male');
  const [selectedPortrait, setSelectedPortrait] = useState<string>('');

  // Filter portraits based on gender
  const availablePortraits = AVAILABLE_PORTRAITS.filter(
    portrait => portrait.gender === gender || portrait.gender === 'non-binary'
  );

  // Auto-select first available portrait when gender changes
  React.useEffect(() => {
    if (availablePortraits.length > 0 && !availablePortraits.find(p => p.id === selectedPortrait)) {
      setSelectedPortrait(availablePortraits[0].id);
    }
  }, [gender, availablePortraits, selectedPortrait]);

  const handleCreateCharacter = () => {
    if (!name.trim() || !selectedPortrait) return;

    const selectedPortraitData = AVAILABLE_PORTRAITS.find(p => p.id === selectedPortrait);

    // Create character and start game
    startNewGame(name.trim());

    // Store portrait selection in character data
    const characterData = {
      name: name.trim(),
      gender,
      portrait: selectedPortraitData
    };

    localStorage.setItem('axiomancer_character', JSON.stringify(characterData));
  };

  const isFormValid = name.trim().length >= 2 && selectedPortrait;

  return (
    <Container>
      <CreationPanel>
        <Title>Create Your Philosopher</Title>
        <Subtitle>
          Begin your journey of wisdom and discovery. Who will you become in this world of moral choices and philosophical challenges?
        </Subtitle>

        <FormSection>
          <label htmlFor="character-name">Character Name</label>
          <TextInput
            id="character-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your philosopher's name..."
            maxLength={30}
          />
        </FormSection>

        <FormSection>
          <label>Gender</label>
          <GenderSelector>
            <GenderButton
              selected={gender === 'male'}
              onClick={() => setGender('male')}
            >
              Male
            </GenderButton>
            <GenderButton
              selected={gender === 'female'}
              onClick={() => setGender('female')}
            >
              Female
            </GenderButton>
            <GenderButton
              selected={gender === 'non-binary'}
              onClick={() => setGender('non-binary')}
            >
              Non-Binary
            </GenderButton>
          </GenderSelector>
        </FormSection>

        <FormSection>
          <label>Choose Your Portrait</label>
          <PortraitSelector>
            {availablePortraits.map((portrait) => (
              <PortraitOption
                key={portrait.id}
                selected={selectedPortrait === portrait.id}
                onClick={() => setSelectedPortrait(portrait.id)}
              >
                <img src={portrait.imageUrl} alt={portrait.name} />
                <span>{portrait.name}</span>
              </PortraitOption>
            ))}
          </PortraitSelector>
        </FormSection>

        <CreateButton
          onClick={handleCreateCharacter}
          disabled={!isFormValid}
        >
          Begin Your Philosophical Journey
        </CreateButton>
      </CreationPanel>
    </Container>
  );
};