import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { loadCharacter, deleteCharacter, SavedCharacterData } from '../utils/characterSave';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 70vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
`;

const Title = styled.h1`
  color: ${theme.colors.text.accent};
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const CharacterCard = styled.div`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  max-width: 600px;
  width: 100%;
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  
  .portrait {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    border: 3px solid ${theme.colors.border.primary};
  }
  
  .character-info {
    flex: 1;
    
    .name {
      color: ${theme.colors.text.accent};
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: ${theme.spacing.sm};
    }
    
    .level {
      color: ${theme.colors.text.secondary};
      font-size: 1.2rem;
      margin-bottom: ${theme.spacing.sm};
    }
    
    .location {
      color: ${theme.colors.text.muted};
      font-size: 1rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  /* Show 3 columns for stats when we have 5 total items (2 resources + 3 stats) */
  .stats-row {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.md};
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  text-align: center;
  
  .stat-label {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    margin-bottom: ${theme.spacing.xs};
  }
  
  .stat-value {
    color: ${theme.colors.text.primary};
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .stat-bar {
    width: 100%;
    height: 8px;
    background: ${theme.colors.background.primary};
    border-radius: 4px;
    overflow: hidden;
    margin-top: ${theme.spacing.xs};
    
    .fill {
      height: 100%;
      transition: width 0.3s ease;
      
      &.health {
        background: ${theme.colors.success};
      }
      
      &.mana {
        background: ${theme.colors.info};
      }
    }
  }
`;

const ProgressInfo = styled.div`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  
  .progress-title {
    color: ${theme.colors.text.accent};
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }
  
  .progress-details {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-top: ${theme.spacing.lg};
`;

const ActionButton = styled.button<{ variant: 'primary' | 'danger' | 'secondary' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return theme.colors.primary;
      case 'danger': return theme.colors.danger;
      case 'secondary': return theme.colors.background.secondary;
      default: return theme.colors.primary;
    }
  }};
  color: ${props => props.variant === 'secondary' ? theme.colors.text.primary : 'white'};
  border: 2px solid ${props => {
    switch (props.variant) {
      case 'primary': return theme.colors.primary;
      case 'danger': return theme.colors.danger;
      case 'secondary': return theme.colors.border.primary;
      default: return theme.colors.primary;
    }
  }};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: ${props => {
      switch (props.variant) {
        case 'primary': return theme.colors.accent;
        case 'danger': return '#dc3545';
        case 'secondary': return theme.colors.background.panel;
        default: return theme.colors.accent;
      }
    }};
  }
`;

const NoCharacterMessage = styled.div`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  max-width: 500px;
  
  .message {
    color: ${theme.colors.text.primary};
    font-size: 1.2rem;
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ConfirmDialog = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .dialog {
    background: ${theme.colors.background.panel};
    border: 2px solid ${theme.colors.border.primary};
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.xl};
    max-width: 400px;
    text-align: center;
    
    .title {
      color: ${theme.colors.text.accent};
      font-size: 1.5rem;
      margin-bottom: ${theme.spacing.md};
    }
    
    .message {
      color: ${theme.colors.text.primary};
      margin-bottom: ${theme.spacing.lg};
      line-height: 1.4;
    }
    
    .buttons {
      display: flex;
      gap: ${theme.spacing.md};
      justify-content: center;
    }
  }
`;

export const CharacterSelectionPage: React.FC = () => {
  const { logout } = useAuth();
  const { loadSavedCharacter } = useGame();
  const navigate = useNavigate();
  const [savedCharacter, setSavedCharacter] = useState<SavedCharacterData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedCharacterData = async () => {
      try {
        const character = await loadCharacter();
        setSavedCharacter(character);
      } catch (error) {
        console.error('Error loading character:', error);
        setSavedCharacter(null);
      } finally {
        setLoading(false);
      }
    };

    loadSavedCharacterData();
  }, []);

  const handleContinueGame = async () => {
    try {
      const success = await loadSavedCharacter();
      if (success) {
        navigate('/game');
      } else {
        console.error('Failed to load saved character');
        // Could show an error message to the user
      }
    } catch (error) {
      console.error('Error loading saved character:', error);
    }
  };

  const handleDeleteCharacter = async () => {
    try {
      await deleteCharacter();
      setSavedCharacter(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const handleCreateNewCharacter = () => {
    navigate('/character-creation');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLocationDisplayName = (locationId: string) => {
    const locationNames: Record<string, string> = {
      'fishing_town': 'Small Fishing Town',
      'forest': 'Whispering Forest',
      'cave': 'Crystal Caverns',
      'ancient_ruins': 'Ancient Philosophical Ruins',
      'mountaintop_temple': 'Temple of Contemplation',
      'coastal_cliffs': 'Coastal Cliffs',
      'underground_lake': 'Underground Lake'
    };
    return locationNames[locationId] || locationId;
  };

  const formatLastSaved = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Container>
        <Title>Loading...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>🏛️ Axiomancer</Title>
      
      {savedCharacter ? (
        <CharacterCard>
          <CharacterHeader>
            <div className="portrait">
              {savedCharacter.character.portrait?.imageUrl ? (
                <img 
                  src={savedCharacter.character.portrait.imageUrl} 
                  alt="Character portrait" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                '🧙‍♂️'
              )}
            </div>
            <div className="character-info">
              <div className="name">{savedCharacter.character.name}</div>
              <div className="level">Level {savedCharacter.character.level} Philosopher</div>
              <div className="location">📍 {getLocationDisplayName(savedCharacter.currentLocation)}</div>
            </div>
          </CharacterHeader>
          
          <StatsGrid>
            <StatCard>
              <div className="stat-label">Health</div>
              <div className="stat-value">
                {savedCharacter.character.health} / {savedCharacter.character.maxHealth}
              </div>
              <div className="stat-bar">
                <div
                  className="fill health"
                  style={{
                    width: `${(savedCharacter.character.health / savedCharacter.character.maxHealth) * 100}%`
                  }}
                />
              </div>
            </StatCard>

            <StatCard>
              <div className="stat-label">Mana</div>
              <div className="stat-value">
                {savedCharacter.character.mana} / {savedCharacter.character.maxMana}
              </div>
              <div className="stat-bar">
                <div
                  className="fill mana"
                  style={{
                    width: `${(savedCharacter.character.mana / savedCharacter.character.maxMana) * 100}%`
                  }}
                />
              </div>
            </StatCard>

            <div className="stats-row">
              <StatCard>
                <div className="stat-label">Heart</div>
                <div className="stat-value">{savedCharacter.character.baseStats?.heart || 10}</div>
              </StatCard>

              <StatCard>
                <div className="stat-label">Body</div>
                <div className="stat-value">{savedCharacter.character.baseStats?.body || 10}</div>
              </StatCard>

              <StatCard>
                <div className="stat-label">Mind</div>
                <div className="stat-value">{savedCharacter.character.baseStats?.mind || 10}</div>
              </StatCard>
            </div>
          </StatsGrid>
          
          <ProgressInfo>
            <div className="progress-title">Journey Progress</div>
            <div className="progress-details">
              Current Phase: {savedCharacter.gamePhase}<br/>
              Skills Learned: {savedCharacter.character.skills.length}<br/>
              Last Saved: {formatLastSaved(savedCharacter.savedAt)}
            </div>
          </ProgressInfo>
          
          <ButtonContainer>
            <ActionButton variant="primary" onClick={handleContinueGame}>
              Continue Journey
            </ActionButton>
            <ActionButton variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              Delete Character
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleLogout}>
              Logout
            </ActionButton>
          </ButtonContainer>
        </CharacterCard>
      ) : (
        <NoCharacterMessage>
          <div className="message">
            No saved character found. Would you like to create a new character to begin your philosophical journey?
          </div>
          <ButtonContainer>
            <ActionButton variant="primary" onClick={handleCreateNewCharacter}>
              Create New Character
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleLogout}>
              Logout
            </ActionButton>
          </ButtonContainer>
        </NoCharacterMessage>
      )}
      
      <ConfirmDialog show={showDeleteConfirm}>
        <div className="dialog">
          <div className="title">Delete Character</div>
          <div className="message">
            Are you sure you want to delete your character? This action cannot be undone and all progress will be lost.
          </div>
          <div className="buttons">
            <ActionButton variant="danger" onClick={handleDeleteCharacter}>
              Delete
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </ActionButton>
          </div>
        </div>
      </ConfirmDialog>
    </Container>
  );
};