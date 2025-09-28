import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

// Import all our game screens
import { ExplorationScreen } from './ExplorationScreen';
import { ImprovedExplorationScreen } from './ImprovedExplorationScreen';
import { CombatScreen } from './CombatScreen';
import { FixedCombatScreen } from './FixedCombatScreen';
import { CharacterScreen } from './CharacterScreen';
import { InventoryScreen } from './InventoryScreen';
import { SkillScreen } from './SkillScreen';
import { UnifiedMapScreen } from './UnifiedMapScreen';
import { GlobalLocalMapScreen } from './GlobalLocalMapScreen';

type ActiveTab = 'explore' | 'character' | 'inventory' | 'skills' | 'map' | 'combat';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`;

const TopBar = styled.div`
  background: ${theme.colors.background.panel};
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
`;

const CharacterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  .portrait {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid ${theme.colors.border.primary};
    object-fit: cover;
  }

  .details {
    .name {
      color: ${theme.colors.text.accent};
      font-weight: 600;
      font-size: 1.1rem;
    }
    .level {
      color: ${theme.colors.text.secondary};
      font-size: 0.9rem;
    }
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  align-items: center;

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;

    .label {
      color: ${theme.colors.text.secondary};
      font-size: 0.8rem;
      margin-bottom: 2px;
    }

    .value {
      color: ${theme.colors.text.primary};
      font-weight: 600;
    }

    .bar {
      width: 80px;
      height: 6px;
      background: ${theme.colors.background.secondary};
      border-radius: 3px;
      overflow: hidden;
      margin-top: 2px;

      .fill {
        height: 100%;
        transition: width 0.3s ease;
      }

      &.health .fill { background: ${theme.colors.danger}; }
      &.mana .fill { background: ${theme.colors.info}; }
      &.experience .fill { background: ${theme.colors.success}; }
    }
  }
`;

const Navigation = styled.div`
  background: ${theme.colors.background.secondary};
  border-bottom: 2px solid ${theme.colors.border.primary};
  display: flex;
  overflow-x: auto;
`;

const NavTab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? theme.colors.dark : theme.colors.text.primary};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
  border-bottom: 3px solid ${props => props.active ? theme.colors.primary : 'transparent'};

  &:hover {
    background: ${props => props.active ? theme.colors.accent : theme.colors.background.panel};
    color: ${props => props.active ? theme.colors.dark : theme.colors.text.accent};
  }

  .icon {
    margin-right: ${theme.spacing.sm};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

  button {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border.secondary};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:hover {
      background: ${theme.colors.primary};
      color: ${theme.colors.dark};
    }
  }
`;

export const MainGameInterface: React.FC = () => {
  const { gameState, currentScreen, changeScreen } = useGame();
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');

  // Get character portrait from localStorage
  const characterData = JSON.parse(localStorage.getItem('axiomancer_character') || '{}');
  const portraitUrl = characterData.portrait?.imageUrl || '/portraits/c-begger.png';

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);

    // Map our tabs to game screens
    const screenMap: Record<ActiveTab, any> = {
      explore: 'exploration',
      character: 'character',
      inventory: 'inventory',
      skills: 'skills',
      map: 'map',
      combat: 'combat'
    };

    changeScreen(screenMap[tab]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ImprovedExplorationScreen />;
      case 'character':
        return <CharacterScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'skills':
        return <SkillScreen />;
      case 'map':
        return <GlobalLocalMapScreen />;
      case 'combat':
        return <FixedCombatScreen />;
      default:
        return <ExplorationScreen />;
    }
  };

  const healthPercent = (gameState.character.health / gameState.character.maxHealth) * 100;
  const manaPercent = (gameState.character.mana / gameState.character.maxMana) * 100;
  const expPercent = 65; // Placeholder - calculate based on current level progress

  return (
    <GameContainer>
      {/* Top Status Bar */}
      <TopBar>
        <CharacterInfo>
          <img
            src={portraitUrl}
            alt={gameState.character.name}
            className="portrait"
          />
          <div className="details">
            <div className="name">{gameState.character.name}</div>
            <div className="level">Level {gameState.character.level} Philosopher</div>
          </div>
        </CharacterInfo>

        <StatsBar>
          <div className="stat">
            <div className="label">Health</div>
            <div className="value">{gameState.character.health}/{gameState.character.maxHealth}</div>
            <div className="bar health">
              <div className="fill" style={{ width: `${healthPercent}%` }} />
            </div>
          </div>

          <div className="stat">
            <div className="label">Mana</div>
            <div className="value">{gameState.character.mana}/{gameState.character.maxMana}</div>
            <div className="bar mana">
              <div className="fill" style={{ width: `${manaPercent}%` }} />
            </div>
          </div>

          <div className="stat">
            <div className="label">Experience</div>
            <div className="value">2,150 XP</div>
            <div className="bar experience">
              <div className="fill" style={{ width: `${expPercent}%` }} />
            </div>
          </div>
        </StatsBar>

        <QuickActions>
          <button onClick={() => handleTabChange('combat')}>
            ⚔️ Combat
          </button>
          <button onClick={() => console.log('Rest')}>
            😴 Rest
          </button>
          <button onClick={() => console.log('Meditate')}>
            🧘 Meditate
          </button>
        </QuickActions>
      </TopBar>

      {/* Navigation Tabs */}
      <Navigation>
        <NavTab
          active={activeTab === 'explore'}
          onClick={() => handleTabChange('explore')}
        >
          <span className="icon">🗺️</span>
          Explore
        </NavTab>

        <NavTab
          active={activeTab === 'map'}
          onClick={() => handleTabChange('map')}
        >
          <span className="icon">🌍</span>
          World Map
        </NavTab>

        <NavTab
          active={activeTab === 'character'}
          onClick={() => handleTabChange('character')}
        >
          <span className="icon">👤</span>
          Character
        </NavTab>

        <NavTab
          active={activeTab === 'skills'}
          onClick={() => handleTabChange('skills')}
        >
          <span className="icon">📚</span>
          Philosophy & Skills
        </NavTab>

        <NavTab
          active={activeTab === 'inventory'}
          onClick={() => handleTabChange('inventory')}
        >
          <span className="icon">🎒</span>
          Inventory
        </NavTab>
      </Navigation>

      {/* Main Content Area */}
      <ContentArea>
        {renderContent()}
      </ContentArea>
    </GameContainer>
  );
};