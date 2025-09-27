import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { GameScreen } from '../../types/game';

const UIContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
`;

const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: ${theme.colors.background.primary};
  border-bottom: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  pointer-events: auto;
  box-shadow: ${theme.shadows.panel};
`;

const CharacterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.button};
`;

const CharacterName = styled.h3`
  margin: 0 0 ${theme.spacing.xs} 0;
  font-size: 1.4rem;
  color: ${theme.colors.text.accent};
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const HealthBar = styled.div`
  width: 150px;
  height: ${theme.rpg.healthBarHeight};
  background: ${theme.colors.health.background};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
    pointer-events: none;
  }
`;

const HealthFill = styled.div<{ percentage: number }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: ${theme.colors.health.high};
  transition: width 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
  }
`;

const ManaBar = styled.div`
  width: 150px;
  height: ${theme.rpg.manaBarHeight};
  background: ${theme.colors.mana.background};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${theme.spacing.xs};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
    pointer-events: none;
  }
`;

const ManaFill = styled.div<{ percentage: number }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: ${theme.colors.mana.high};
  transition: width 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
  }
`;

const LevelInfo = styled.div`
  text-align: left;
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  font-family: monospace;
`;

const StatText = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.text.muted};
  margin-top: 2px;
  font-family: monospace;
`;

const NavigationTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const NavTab = styled.button<{ active: boolean }>`
  background: ${props => props.active
    ? theme.colors.background.panel
    : theme.colors.background.secondary};
  border: ${theme.rpg.borderWidth} solid ${props => props.active
    ? theme.colors.border.primary
    : theme.colors.border.dark};
  color: ${props => props.active
    ? theme.colors.text.accent
    : theme.colors.text.secondary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: bold;
  pointer-events: auto;
  box-shadow: ${theme.shadows.button};
  text-transform: uppercase;
  min-width: 80px;

  &:hover {
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.border.primary};
    color: ${theme.colors.text.accent};
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${theme.colors.background.primary};
  border-top: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${theme.spacing.lg};
  pointer-events: auto;
  box-shadow: ${theme.shadows.panel};
`;

const LocationInfo = styled.div`
  text-align: center;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.secondary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  box-shadow: ${theme.shadows.button};
  max-width: 400px;
`;

const LocationName = styled.h4`
  margin: 0 0 ${theme.spacing.xs} 0;
  font-size: 1.3rem;
  color: ${theme.colors.text.accent};
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const LocationDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${theme.colors.text.secondary};
  line-height: 1.3;
`;

const tabs: { id: GameScreen; label: string }[] = [
  { id: 'exploration', label: 'Explore' },
  { id: 'character', label: 'Character' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'skills', label: 'Skills' },
  { id: 'map', label: 'Map' },
];

export const GameUI = React.memo(() => {
  const { gameState, currentScreen, changeScreen } = useGame();
  const { character, locations, currentLocation } = gameState;
  const location = locations[currentLocation];

  const healthPercentage = (character.health / character.maxHealth) * 100;
  const manaPercentage = (character.mana / character.maxMana) * 100;

  return (
    <UIContainer>
      <TopBar>
        <CharacterInfo>
          <div>
            <CharacterName>{character.name}</CharacterName>
            <HealthBar>
              <HealthFill percentage={healthPercentage} />
            </HealthBar>
            <StatText>HP: {character.health}/{character.maxHealth}</StatText>
            <ManaBar>
              <ManaFill percentage={manaPercentage} />
            </ManaBar>
            <StatText>MP: {character.mana}/{character.maxMana}</StatText>
          </div>
          <LevelInfo>
            <div>LVL {character.level}</div>
            <div>STR {character.stats.strength}</div>
            <div>CON {character.stats.constitution}</div>
            <div>WIS {character.stats.wisdom}</div>
            <div>INT {character.stats.intelligence}</div>
            <div>DEX {character.stats.dexterity}</div>
            <div>CHA {character.stats.charisma}</div>
          </LevelInfo>
        </CharacterInfo>

        <NavigationTabs>
          {tabs.map(tab => (
            <NavTab
              key={tab.id}
              active={currentScreen === tab.id}
              onClick={() => changeScreen(tab.id)}
            >
              {tab.label}
            </NavTab>
          ))}
        </NavigationTabs>
      </TopBar>

      <BottomBar>
        <LocationInfo>
          <LocationName>{location?.name}</LocationName>
          <LocationDescription>{location?.description}</LocationDescription>
        </LocationInfo>
      </BottomBar>
    </UIContainer>
  );
});