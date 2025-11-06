import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';
import { characterService } from '../../services/characterService';
import { Container } from '../shared/Grid';
import { Panel } from '../shared/Panel';
import { Title, Text, Subtitle } from '../shared/Text';
import { StatCategory, StatRow } from '../shared/StatDisplay';
import { ActionButton } from '../shared/ActionButton';

const PortraitImage = styled.img`
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
`;

const StatAssignmentContainer = styled.div`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.border.dark};
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

const StyledPanel = styled(Panel)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CharacterScreen = React.memo((): JSX.Element => {
  // Zustand stores - selective subscriptions
  const character = useGameStore(state => state.gameState.character);
  const logout = useAuthStore(state => state.logout);
  const assignStatPoint = useGameStore(state => state.assignStatPoint);
  const unassignStatPoint = useGameStore(state => state.unassignStatPoint);
  const [portraitUrl, setPortraitUrl] = useState<string>(character.portrait?.imageUrl || '');

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
        const characterData = await characterService.loadCharacter();
        if (characterData?.character?.portrait?.imageUrl) {
          setPortraitUrl(characterData.character.portrait.imageUrl);
        }
      } catch (error) {
        console.error('Failed to load character portrait:', error);
      }
    };

    fetchCharacterData();
  }, [character.portrait]);

  return (
    <Container variant="game" padding="lg">
      <Panel variant="portrait">
        <PortraitImage
          src={portraitUrl}
          alt={character.name}
        />
        <Title size="md">{character.name}</Title>
        <Text variant="secondary" size="md" align="center">
          Level {character.level} Philosopher
        </Text>
        <ActionButton
          variant="danger"
          size="md"
          onClick={logout}
          style={{ marginTop: theme.spacing.md, width: '100%' }}
        >
          Logout
        </ActionButton>
      </Panel>

      <StyledPanel variant="stats" fullHeight scrollable>
        <StatCategory title="🏥 Core Stats">
          <StatRow label="Health" value={`${character.health} / ${character.maxHealth}`} />
          <StatRow label="Mana" value={`${character.mana} / ${character.maxMana}`} />
          <StatRow label="Available Stat Points" value={character.availableStatPoints} />
        </StatCategory>

        {character.unassignedStatPoints > 0 && (
          <StatAssignmentContainer>
            <Subtitle size="md" variant="category" align="center">
              📈 Stat Point Assignment
            </Subtitle>
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

        <StatCategory title="⭐ Base Stats">
          <StatRow label="Heart" value={character.baseStats.heart} />
          <StatRow label="Body" value={character.baseStats.body} />
          <StatRow label="Mind" value={character.baseStats.mind} />
        </StatCategory>

        <StatCategory title="💪 Body-Derived Stats">
          <StatRow label="Physical Attack" value={character.derivedStats.physicalAttack} />
          <StatRow label="Physical Defense" value={character.derivedStats.physicalDefense} />
          <StatRow label="Constitution Save" value={character.derivedStats.constitutionSave} />
        </StatCategory>

        <StatCategory title="🧠 Mind-Derived Stats">
          <StatRow label="Mind Attack" value={character.derivedStats.mindAttack} />
          <StatRow label="Mind Defense" value={character.derivedStats.mindDefense} />
          <StatRow label="Reflex Save" value={character.derivedStats.reflexSave} />
          <StatRow label="Perception" value={character.derivedStats.perception} />
        </StatCategory>

        <StatCategory title="❤️ Heart-Derived Stats">
          <StatRow label="Ailment Attack" value={character.derivedStats.ailmentAttack} />
          <StatRow label="Ailment Defense" value={character.derivedStats.ailmentDefense} />
          <StatRow label="Will Save" value={character.derivedStats.willSave} />
        </StatCategory>

        <StatCategory title="🎯 Shared Stats">
          <StatRow label="Accuracy" value={character.derivedStats.accuracy} />
          <StatRow label="Evasion" value={character.derivedStats.evasion} />
          <StatRow label="Luck" value={character.derivedStats.luck} />
        </StatCategory>

        {/* TODO: Remove and Replace when I fix Buffs/Debuffs */}
        {/* {hasActivePersistentEffects(character) && (
          <StatCategory title="⚡ Active Effects">
            <div style={{ padding: theme.spacing.md }}>
              <BuffDebuffDisplay
                buffs={getPersistentEffects(character).buffs}
                debuffs={getPersistentEffects(character).debuffs}
                target="player"
              />
            </div>
          </StatCategory>
        )} */}
      </StyledPanel>
    </Container>
  );
});

CharacterScreen.displayName = 'CharacterScreen';
