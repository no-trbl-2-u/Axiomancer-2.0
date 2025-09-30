import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

// Import all our game screens
import { CharacterScreen } from './CharacterScreen';
import { InventoryScreen } from './InventoryScreen';
import { SkillScreen } from './SkillScreen';
import { GlobalLocalMapScreen } from './GlobalLocalMapScreen';

type ActiveTab = 'character' | 'inventory' | 'skills' | 'map';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const BottomNavigation = styled.div`
  background: ${theme.colors.background.panel};
  border-top: 2px solid ${theme.colors.border.primary};
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${theme.spacing.md};
  z-index: 100;
`;

const NavIcon = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.primary : theme.colors.background.secondary};
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.border.primary};
  color: ${props => props.active ? theme.colors.dark : theme.colors.text.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-width: 100px;

  &:hover {
    background: ${theme.colors.primary};
    color: ${theme.colors.dark};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 1.5rem;
  }

  .label {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

export const MainGameInterface: React.FC = () => {
  const { gameState, currentScreen, changeScreen } = useGame();
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);

    // Map our tabs to game screens
    const screenMap: Record<ActiveTab, any> = {
      character: 'character',
      inventory: 'inventory',
      skills: 'skills',
      map: 'map'
    };

    changeScreen(screenMap[tab]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'character':
        return <CharacterScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'skills':
        return <SkillScreen />;
      case 'map':
        return <GlobalLocalMapScreen />;
      default:
        return <GlobalLocalMapScreen />;
    }
  };

  return (
    <GameContainer>
      {/* Main Content Area */}
      <ContentArea>
        {renderContent()}
      </ContentArea>

      {/* Bottom Navigation */}
      <BottomNavigation>
        <NavIcon
          active={activeTab === 'map'}
          onClick={() => handleTabChange('map')}
        >
          <span className="icon">🗺️</span>
          <span className="label">Map</span>
        </NavIcon>

        <NavIcon
          active={activeTab === 'character'}
          onClick={() => handleTabChange('character')}
        >
          <span className="icon">👤</span>
          <span className="label">Character</span>
        </NavIcon>

        <NavIcon
          active={activeTab === 'skills'}
          onClick={() => handleTabChange('skills')}
        >
          <span className="icon">📚</span>
          <span className="label">Skills</span>
        </NavIcon>

        <NavIcon
          active={activeTab === 'inventory'}
          onClick={() => handleTabChange('inventory')}
        >
          <span className="icon">🎒</span>
          <span className="label">Inventory</span>
        </NavIcon>
      </BottomNavigation>
    </GameContainer>
  );
};