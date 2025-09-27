import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

const CharacterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 120px ${theme.spacing.xl} 100px;
  background: ${theme.colors.background.primary};
  gap: ${theme.spacing.xl};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(34, 139, 34, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%);
    pointer-events: none;
  }
`;

const StatsPanel = styled.div`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadows.panel};
  position: relative;
  z-index: 1;
`;

const PhilosophyPanel = styled.div`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.secondary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadows.panel};
  position: relative;
  z-index: 1;
`;

const PanelTitle = styled.h2`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.lg} 0;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding-bottom: ${theme.spacing.md};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.border.dark};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.rpg.buttonBorderRadius};
  margin-bottom: ${theme.spacing.xs};

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.border.primary};
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

const PhilosophySection = styled.div`
  margin-bottom: ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: ${theme.rpg.buttonBorderRadius};
  padding: ${theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: ${theme.colors.border.primary};
  }
`;

const PhilosophyTitle = styled.h3`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const PhilosophyValue = styled.p`
  margin: 0;
  color: ${theme.colors.text.primary};
  text-transform: capitalize;
  font-weight: bold;
  font-size: 1.1rem;
`;

export const CharacterScreen = React.memo(() => {
  const { gameState } = useGame();
  const { character } = gameState;

  return (
    <CharacterContainer>
      <StatsPanel>
        <PanelTitle>Character Stats</PanelTitle>

        <StatRow>
          <StatName>Name</StatName>
          <StatValue>{character.name}</StatValue>
        </StatRow>

        <StatRow>
          <StatName>Level</StatName>
          <StatValue>{character.level}</StatValue>
        </StatRow>

        <StatRow>
          <StatName>Health</StatName>
          <StatValue>{character.health} / {character.maxHealth}</StatValue>
        </StatRow>

        <StatRow>
          <StatName>Mana</StatName>
          <StatValue>{character.mana} / {character.maxMana}</StatValue>
        </StatRow>

        {Object.entries(character.stats).map(([statName, value]) => (
          <StatRow key={statName}>
            <StatName>{statName}</StatName>
            <StatValue>{value}</StatValue>
          </StatRow>
        ))}
      </StatsPanel>

      <PhilosophyPanel>
        <PanelTitle>Philosophical Stance</PanelTitle>

        <PhilosophySection>
          <PhilosophyTitle>Ethics</PhilosophyTitle>
          <PhilosophyValue>{character.philosophicalStance.ethics}</PhilosophyValue>
        </PhilosophySection>

        <PhilosophySection>
          <PhilosophyTitle>Metaphysics</PhilosophyTitle>
          <PhilosophyValue>{character.philosophicalStance.metaphysics}</PhilosophyValue>
        </PhilosophySection>

        <PhilosophySection>
          <PhilosophyTitle>Epistemology</PhilosophyTitle>
          <PhilosophyValue>{character.philosophicalStance.epistemology}</PhilosophyValue>
        </PhilosophySection>
      </PhilosophyPanel>
    </CharacterContainer>
  );
});