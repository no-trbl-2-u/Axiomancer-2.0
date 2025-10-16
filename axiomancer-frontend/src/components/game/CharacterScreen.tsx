import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';
import { characterService } from '../../services/characterService';
import { Button } from '../Button';
import { BuffDebuffDisplay } from '../combat/BuffDebuffDisplay';
import { getPersistentEffects, hasActivePersistentEffects } from '../../utils/persistentEffects';
import { BaseStats } from '../../types/game';

const CharacterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.primary};
  gap: ${theme.spacing.lg};
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`;

const PortraitPanel = styled.div`
  width: 300px;
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.panel};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};

  .portrait-img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: ${theme.borderRadius.lg};
    border: 3px solid ${theme.colors.border.primary};

    @media (max-width: 768px) {
      height: 250px;
    }

    @media (max-width: 480px) {
      height: 200px;
    }
  }

  .character-name {
    color: ${theme.colors.text.accent};
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }

  .character-level {
    color: ${theme.colors.text.secondary};
    font-size: 1.1rem;
    text-align: center;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

const StatsPanel = styled.div`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadows.panel};
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    max-height: 60vh;
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`;

const PanelTitle = styled.h2`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding-bottom: ${theme.spacing.sm};
`;

const StatCategory = styled.div`
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.md};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.dark};

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 2px solid ${theme.colors.border.dark};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.rpg.buttonBorderRadius};
  margin-bottom: ${theme.spacing.sm};
  min-height: 48px;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.border.primary};
    transform: translateX(4px);
  }
`;

const StatName = styled.span`
  font-weight: bold;
  text-transform: uppercase;
  color: ${theme.colors.text.secondary};
  font-family: monospace;
`;

const StatValue = styled.span`
  color: ${theme.colors.text.accent};
  font-weight: bold;
  font-family: monospace;
  font-size: 1.1rem;
`;

const CategoryTitle = styled.h3`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatAssignmentContainer = styled.div`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.border.dark};
`;

const AssignmentTitle = styled.h3`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
`;

const StatAssignmentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
  background: ${theme.colors.background.panel};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.secondary};
`;

const StatAssignmentName = styled.span`
  font-weight: bold;
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const StatAssignmentValue = styled.span`
  color: ${theme.colors.text.accent};
  font-weight: bold;
  font-family: monospace;
`;

const StatAssignmentControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const StatButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${theme.colors.accent};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const UnassignedPointsDisplay = styled.div`
  background: ${theme.colors.warning};
  color: ${theme.colors.dark};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  margin-bottom: ${theme.spacing.md};

  .points-count {
    font-size: 1.3rem;
    font-weight: bold;
    font-family: monospace;
  }

  .points-label {
    font-size: 0.8rem;
    opacity: 0.8;
  }
`;

export const CharacterScreen = React.memo((): JSX.Element => {
  // Zustand stores - selective subscriptions
  const character = useGameStore(state => state.gameState.character);
  const logout = useAuthStore(state => state.logout);
  const assignStatPoint = useGameStore(state => state.assignStatPoint);
  const unassignStatPoint = useGameStore(state => state.unassignStatPoint);
  const [portraitUrl, setPortraitUrl] = useState<string>(character.portrait?.imageUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch character portrait from backend if not available in gameState
  useEffect(() => {
    // If portrait is already in gameState, use it
    if (character.portrait?.imageUrl) {
      setPortraitUrl(character.portrait.imageUrl);
      return;
    }

    // Otherwise, fetch from backend
    const fetchCharacterData = async () => {
      try {
        setIsLoading(true);
        const characterData = await characterService.loadCharacter();
        if (characterData?.character?.portrait?.imageUrl) {
          setPortraitUrl(characterData.character.portrait.imageUrl);
        }
      } catch (error) {
        console.error('Failed to load character portrait:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterData();
  }, [character.portrait]);

  return (
    <CharacterContainer>
      <PortraitPanel>
        <img
          src={portraitUrl}
          alt={character.name}
          className="portrait-img"
        />
        <div className="character-name">{character.name}</div>
        <div className="character-level">Level {character.level} Philosopher</div>
        <Button 
          variant="danger" 
          size="md" 
          onClick={logout}
          style={{ marginTop: theme.spacing.md, width: '100%' }}
        >
          Logout
        </Button>
      </PortraitPanel>

      <StatsPanel>
        <PanelTitle>Character Statistics</PanelTitle>

        <StatCategory>
          <CategoryTitle>🏥 Core Stats</CategoryTitle>
          <StatRow>
            <StatName>Health</StatName>
            <StatValue>{character.health} / {character.maxHealth}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Mana</StatName>
            <StatValue>{character.mana} / {character.maxMana}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Available Stat Points</StatName>
            <StatValue>{character.availableStatPoints}</StatValue>
          </StatRow>
        </StatCategory>

        {character.unassignedStatPoints > 0 && (
          <StatAssignmentContainer>
            <AssignmentTitle>📈 Stat Point Assignment</AssignmentTitle>
            <UnassignedPointsDisplay>
              <div className="points-count">{character.unassignedStatPoints}</div>
              <div className="points-label">Unassigned Points</div>
            </UnassignedPointsDisplay>

            <StatAssignmentRow>
              <StatAssignmentName>Heart</StatAssignmentName>
              <StatAssignmentValue>{character.baseStats.heart}</StatAssignmentValue>
              <StatAssignmentControls>
                <StatButton
                  onClick={() => unassignStatPoint('heart')}
                  disabled={character.baseStats.heart <= 1}
                  title="Remove point from Heart"
                >
                  −
                </StatButton>
                <StatButton
                  onClick={() => assignStatPoint('heart')}
                  disabled={character.unassignedStatPoints <= 0}
                  title="Add point to Heart"
                >
                  +
                </StatButton>
              </StatAssignmentControls>
            </StatAssignmentRow>

            <StatAssignmentRow>
              <StatAssignmentName>Body</StatAssignmentName>
              <StatAssignmentValue>{character.baseStats.body}</StatAssignmentValue>
              <StatAssignmentControls>
                <StatButton
                  onClick={() => unassignStatPoint('body')}
                  disabled={character.baseStats.body <= 1}
                  title="Remove point from Body"
                >
                  −
                </StatButton>
                <StatButton
                  onClick={() => assignStatPoint('body')}
                  disabled={character.unassignedStatPoints <= 0}
                  title="Add point to Body"
                >
                  +
                </StatButton>
              </StatAssignmentControls>
            </StatAssignmentRow>

            <StatAssignmentRow>
              <StatAssignmentName>Mind</StatAssignmentName>
              <StatAssignmentValue>{character.baseStats.mind}</StatAssignmentValue>
              <StatAssignmentControls>
                <StatButton
                  onClick={() => unassignStatPoint('mind')}
                  disabled={character.baseStats.mind <= 1}
                  title="Remove point from Mind"
                >
                  −
                </StatButton>
                <StatButton
                  onClick={() => assignStatPoint('mind')}
                  disabled={character.unassignedStatPoints <= 0}
                  title="Add point to Mind"
                >
                  +
                </StatButton>
              </StatAssignmentControls>
            </StatAssignmentRow>
          </StatAssignmentContainer>
        )}

        <StatCategory>
          <CategoryTitle>⭐ Base Stats</CategoryTitle>
          <StatRow>
            <StatName>Heart</StatName>
            <StatValue>{character.baseStats.heart}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Body</StatName>
            <StatValue>{character.baseStats.body}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Mind</StatName>
            <StatValue>{character.baseStats.mind}</StatValue>
          </StatRow>
        </StatCategory>

        <StatCategory>
          <CategoryTitle>💪 Body-Derived Stats</CategoryTitle>
          <StatRow>
            <StatName>Physical Attack</StatName>
            <StatValue>{character.derivedStats.physicalAttack}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Physical Defense</StatName>
            <StatValue>{character.derivedStats.physicalDefense}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Constitution Save</StatName>
            <StatValue>{character.derivedStats.constitutionSave}</StatValue>
          </StatRow>
        </StatCategory>

        <StatCategory>
          <CategoryTitle>🧠 Mind-Derived Stats</CategoryTitle>
          <StatRow>
            <StatName>Mind Attack</StatName>
            <StatValue>{character.derivedStats.mindAttack}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Mind Defense</StatName>
            <StatValue>{character.derivedStats.mindDefense}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Reflex Save</StatName>
            <StatValue>{character.derivedStats.reflexSave}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Perception</StatName>
            <StatValue>{character.derivedStats.perception}</StatValue>
          </StatRow>
        </StatCategory>

        <StatCategory>
          <CategoryTitle>❤️ Heart-Derived Stats</CategoryTitle>
          <StatRow>
            <StatName>Ailment Attack</StatName>
            <StatValue>{character.derivedStats.ailmentAttack}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Ailment Defense</StatName>
            <StatValue>{character.derivedStats.ailmentDefense}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Will Save</StatName>
            <StatValue>{character.derivedStats.willSave}</StatValue>
          </StatRow>
        </StatCategory>

        <StatCategory>
          <CategoryTitle>🎯 Shared Stats</CategoryTitle>
          <StatRow>
            <StatName>Accuracy</StatName>
            <StatValue>{character.derivedStats.accuracy}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Evasion</StatName>
            <StatValue>{character.derivedStats.evasion}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Luck</StatName>
            <StatValue>{character.derivedStats.luck}</StatValue>
          </StatRow>
        </StatCategory>

        <StatCategory>
          <CategoryTitle>🧘 Philosophical Stance</CategoryTitle>
          <StatRow>
            <StatName>Ethics</StatName>
            <StatValue style={{ textTransform: 'capitalize' }}>{character.philosophicalStance.ethics}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Metaphysics</StatName>
            <StatValue style={{ textTransform: 'capitalize' }}>{character.philosophicalStance.metaphysics}</StatValue>
          </StatRow>
          <StatRow>
            <StatName>Epistemology</StatName>
            <StatValue style={{ textTransform: 'capitalize' }}>{character.philosophicalStance.epistemology}</StatValue>
          </StatRow>
        </StatCategory>

        {hasActivePersistentEffects(character) && (
          <StatCategory>
            <CategoryTitle>⚡ Active Effects</CategoryTitle>
            <div style={{ padding: theme.spacing.md }}>
              <BuffDebuffDisplay
                buffs={getPersistentEffects(character).buffs}
                debuffs={getPersistentEffects(character).debuffs}
                target="player"
              />
            </div>
          </StatCategory>
        )}
      </StatsPanel>
    </CharacterContainer>
  );
});