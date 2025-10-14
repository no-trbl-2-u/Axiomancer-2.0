import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';

// Import all our game screens
import { CharacterScreen } from './CharacterScreen';
import { InventoryScreen } from './InventoryScreen';
import { SkillScreen } from './SkillScreen';
import { GlobalLocalMapScreen } from './GlobalLocalMapScreen';
import { CombatScreen } from './CombatScreen';

type ActiveTab = 'character' | 'inventory' | 'skills' | 'map' | 'combat';

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
  align-items: center;
  gap: ${theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 100;

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }
`;

const PlayerPortrait = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${theme.colors.primary};
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3));
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    border-width: 2px;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-width: 0;
`;

const PlayerName = styled.div`
  color: ${theme.colors.text.accent};
  font-size: 1.1rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PlayerStats = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};

  @media (max-width: 768px) {
    gap: ${theme.spacing.md};
  }
`;

const StatBar = styled.div`
  flex: 1;
  min-width: 120px;

  @media (max-width: 768px) {
    min-width: 80px;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: 2px;
  font-weight: 600;
`;

const StatBarContainer = styled.div`
  height: 12px;
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  position: relative;
`;

const StatBarFill = styled.div<{ percentage: number; type: 'hp' | 'mp' }>`
  height: 100%;
  background: ${props => props.type === 'hp'
    ? (props.percentage > 60 ? '#10b981' : props.percentage > 30 ? '#f59e0b' : '#ef4444')
    : '#3b82f6'};
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const StatText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.65rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
`;

const LevelBadge = styled.div`
  background: ${theme.colors.primary};
  color: ${theme.colors.dark};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: 0.9rem;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  
  position: relative;

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
  }
`;

const BottomNavigation = styled.div`
  background: ${theme.colors.background.panel};
  border-top: 2px solid ${theme.colors.border.primary};
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${theme.spacing.sm};
  z-index: 100;

  @media (max-width: 768px) {
    padding: ${theme.spacing.xs};
    gap: ${theme.spacing.xs};
  }
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
  flex: 1;

  &:hover {
    background: ${theme.colors.primary};
    color: ${theme.colors.dark};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  .label {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;

    @media (max-width: 768px) {
      font-size: 0.7rem;
      line-height: 1.2;
    }
  }

  @media (max-width: 768px) {
    min-width: 60px;
    padding: ${theme.spacing.sm} ${theme.spacing.xs};
  }

  @media (max-width: 480px) {
    min-width: 50px;
    padding: ${theme.spacing.xs};
  }
`;

export const MainGameInterface: React.FC = () => {
  // Zustand store - selective subscriptions
  const character = useGameStore(state => state.gameState.character);
  const combat = useGameStore(state => state.gameState.combat);
  const currentScreen = useGameStore(state => state.currentScreen);
  const changeScreen = useGameStore(state => state.changeScreen);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');

  // Update active tab based on current screen
  React.useEffect(() => {
    if (currentScreen === 'combat' && combat) {
      setActiveTab('combat');
    }
  }, [currentScreen, combat]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);

    // Map our tabs to game screens
    const screenMap: Record<ActiveTab, any> = {
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
      case 'character':
        return <CharacterScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'skills':
        return <SkillScreen />;
      case 'map':
        return <GlobalLocalMapScreen />;
        // TODO: Get THIS to render inside an EventModal
      // case 'combat':
      //   return <CombatScreen />;
      default:
        return <GlobalLocalMapScreen />;
    }
  };

  const getPortraitUrl = () => {    
    if (character?.portrait?.imageUrl) {
      return character.portrait.imageUrl;
    }
    
    // TODO: Create backup system for fallback portrait
    return '/portraits/c-begger.jpg';
  };

  return (
    <GameContainer>
      {/* Top Bar with Player Info */}
      <TopBar>
        <PlayerPortrait>
          <img src={getPortraitUrl()} alt={character.name} />
        </PlayerPortrait>
        <PlayerInfo>
          <PlayerName>{character.name}</PlayerName>
          <PlayerStats>
            <StatBar>
              <StatLabel>HP</StatLabel>
              <StatBarContainer>
                <StatBarFill
                  percentage={(character.health / character.maxHealth) * 100}
                  type="hp"
                />
                <StatText>{character.health}/{character.maxHealth}</StatText>
              </StatBarContainer>
            </StatBar>
            <StatBar>
              <StatLabel>MP</StatLabel>
              <StatBarContainer>
                <StatBarFill
                  percentage={(character.mana / character.maxMana) * 100}
                  type="mp"
                />
                <StatText>{character.mana}/{character.maxMana}</StatText>
              </StatBarContainer>
            </StatBar>
          </PlayerStats>
        </PlayerInfo>
        <LevelBadge>Lv. {character.level}</LevelBadge>
      </TopBar>

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