import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

const FishingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #1e3a8a 100%);
  position: relative;
  overflow: hidden;
`;

const WaterSurface = styled.div`
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.6) 100%);
  animation: water-ripple 3s ease-in-out infinite;
  z-index: 1;

  @keyframes water-ripple {
    0%, 100% { transform: scaleX(1); opacity: 0.6; }
    50% { transform: scaleX(1.1); opacity: 0.8; }
  }
`;

const FishingUI = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const HeaderPanel = styled.div`
  background: ${theme.colors.background.panel};
  border-bottom: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  padding: ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadows.panel};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const FishingTitle = styled.h2`
  color: ${theme.colors.text.accent};
  margin: 0;
  font-size: 1.8rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 1.4rem;
    text-align: center;
  }
`;

const StatsPanel = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  align-items: center;

  @media (max-width: 768px) {
    gap: ${theme.spacing.md};
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  .icon {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: 0.9rem;
  }
`;

const FishingArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl};
  position: relative;

  @media (max-width: 768px) {
    padding: ${theme.spacing.lg};
  }
`;

const FishingRod = styled.div<{ casting: boolean; hasBite: boolean }>`
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #8B4513 0%, #654321 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #DEB887;
  border: 4px solid #654321;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.casting && `
    animation: cast-line 2s ease-in-out infinite;
  `}
  
  ${props => props.hasBite && `
    animation: fish-bite 0.5s ease-in-out infinite;
    border-color: #FFD700;
    box-shadow: 0 0 20px #FFD700;
  `}

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }

  @keyframes cast-line {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }

  @keyframes fish-bite {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 3rem;
  }
`;

const FishingLine = styled.div<{ visible: boolean; length: number }>`
  position: absolute;
  top: 100%;
  left: 50%;
  width: 2px;
  background: #333;
  transform: translateX(-50%);
  transform-origin: top;
  transition: all 0.5s ease;
  opacity: ${props => props.visible ? 1 : 0};
  height: ${props => props.length}px;
`;

const ActionPanel = styled.div`
  background: ${theme.colors.background.panel};
  border-top: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  padding: ${theme.spacing.lg};
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.panel};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'success': return theme.colors.success;
      case 'danger': return '#dc2626';
      default: return theme.colors.primary;
    }
  }};
  border: 2px solid ${props => {
    switch (props.variant) {
      case 'success': return theme.colors.success;
      case 'danger': return '#dc2626';
      default: return theme.colors.primary;
    }
  }};
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1rem;
  min-width: 120px;
  box-shadow: ${theme.shadows.button};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: 0.9rem;
    min-width: 100px;
  }
`;

const FishingStatus = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  text-align: center;
  min-width: 300px;
  box-shadow: ${theme.shadows.panel};

  @media (max-width: 768px) {
    min-width: 250px;
    padding: ${theme.spacing.md};
    top: 15%;
  }
`;

const StatusText = styled.p`
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.1rem;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  margin-bottom: ${theme.spacing.md};
`;

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: ${props => props.color || theme.colors.primary};
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

type FishingState = 'waiting' | 'casting' | 'fishing' | 'bite' | 'reeling' | 'caught' | 'escaped';

interface FishCatch {
  name: string;
  size: 'small' | 'medium' | 'large';
  rarity: 'common' | 'uncommon' | 'rare';
  icon: string;
}

const fishTypes: FishCatch[] = [
  { name: 'Minnow', size: 'small', rarity: 'common', icon: '🐟' },
  { name: 'Bass', size: 'medium', rarity: 'common', icon: '🐠' },
  { name: 'Trout', size: 'medium', rarity: 'uncommon', icon: '🐟' },
  { name: 'Salmon', size: 'large', rarity: 'uncommon', icon: '🐠' },
  { name: 'Philosophical Koi', size: 'large', rarity: 'rare', icon: '🐡' },
];

export const FishingScreen = React.memo(() => {
  const { gameState, updateInventory, updateStory, unlockNode, changeScreen } = useGame();
  const { inventory, story } = gameState;
  
  const [fishingState, setFishingState] = useState<FishingState>('waiting');
  const [fishingProgress, setFishingProgress] = useState(0);
  const [currentCatch, setCurrentCatch] = useState<FishCatch | null>(null);
  const [reelProgress, setReelProgress] = useState(0);
  const [sessionCatch, setSessionCatch] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (fishingState === 'fishing') {
      interval = setInterval(() => {
        setFishingProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          if (newProgress >= 100) {
            setFishingState('bite');
            generateFishBite();
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fishingState]);

  const generateFishBite = () => {
    const randomFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    setCurrentCatch(randomFish);
    
    // Auto-start reeling after 2 seconds if player doesn't react
    setTimeout(() => {
      if (fishingState === 'bite') {
        setFishingState('escaped');
        setTimeout(() => resetFishing(), 2000);
      }
    }, 2000);
  };

  const startFishing = () => {
    if (!story.talkedToGuardian) {
      alert('You should talk to your guardian first to learn about fishing.');
      return;
    }
    
    setFishingState('casting');
    setFishingProgress(0);
    
    setTimeout(() => {
      setFishingState('fishing');
    }, 1000);
  };

  const startReeling = () => {
    if (fishingState !== 'bite') return;
    
    setFishingState('reeling');
    setReelProgress(0);
    
    const reelInterval = setInterval(() => {
      setReelProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(reelInterval);
          setFishingState('caught');
          catchFish();
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    // If reeling takes too long, fish escapes
    setTimeout(() => {
      if (fishingState === 'reeling') {
        clearInterval(reelInterval);
        setFishingState('escaped');
        setTimeout(() => resetFishing(), 2000);
      }
    }, 3000);
  };

  const catchFish = () => {
    if (!currentCatch) return;
    
    const fishValue = currentCatch.rarity === 'rare' ? 3 : 
                     currentCatch.rarity === 'uncommon' ? 2 : 1;
    
    updateInventory({ 
      fish: inventory.fish + fishValue,
      gold: inventory.gold + fishValue * 5 
    });
    
    setSessionCatch(prev => prev + fishValue);
    
    // Unlock docks after first successful fishing
    if (!story.startedFishing) {
      updateStory({ startedFishing: true });
      unlockNode('fishing_town', 'docks');
    }
    
    setTimeout(() => resetFishing(), 3000);
  };

  const resetFishing = () => {
    setFishingState('waiting');
    setFishingProgress(0);
    setReelProgress(0);
    setCurrentCatch(null);
  };

  const finishFishing = () => {
    if (sessionCatch >= 3) {
      // Unlock fishing spot after catching enough fish
      unlockNode('fishing_town', 'fishing_spot');
    }
    changeScreen('exploration');
  };

  const getStatusText = () => {
    switch (fishingState) {
      case 'waiting':
        return 'Cast your line into the peaceful waters and wait for a bite.';
      case 'casting':
        return 'Casting your line...';
      case 'fishing':
        return 'Waiting for a fish to bite. Be patient...';
      case 'bite':
        return `A ${currentCatch?.name} is biting! Quick, reel it in!`;
      case 'reeling':
        return `Reeling in the ${currentCatch?.name}... Don't let it escape!`;
      case 'caught':
        return `Success! You caught a ${currentCatch?.name}! ${currentCatch?.icon}`;
      case 'escaped':
        return 'The fish escaped... Try again!';
      default:
        return '';
    }
  };

  return (
    <FishingContainer>
      <WaterSurface />
      
      <FishingUI>
        <HeaderPanel>
          <FishingTitle>Fishing at the Town Docks</FishingTitle>
          <StatsPanel>
            <StatItem>
              <span className="icon">🐟</span>
              Fish: {inventory.fish}
            </StatItem>
            <StatItem>
              <span className="icon">💰</span>
              Gold: {inventory.gold}
            </StatItem>
            <StatItem>
              <span className="icon">🎣</span>
              Session: {sessionCatch}
            </StatItem>
          </StatsPanel>
        </HeaderPanel>

        <FishingArea>
          <FishingStatus>
            <StatusText>{getStatusText()}</StatusText>
            
            {fishingState === 'fishing' && (
              <ProgressBar>
                <ProgressFill percentage={fishingProgress} />
              </ProgressBar>
            )}
            
            {fishingState === 'reeling' && (
              <ProgressBar>
                <ProgressFill percentage={reelProgress} color={theme.colors.success} />
              </ProgressBar>
            )}
          </FishingStatus>

          <FishingRod
            casting={fishingState === 'casting' || fishingState === 'fishing'}
            hasBite={fishingState === 'bite'}
            onClick={fishingState === 'waiting' ? startFishing : undefined}
          >
            🎣
            <FishingLine 
              visible={fishingState !== 'waiting'} 
              length={120} 
            />
          </FishingRod>
        </FishingArea>

        <ActionPanel>
          {fishingState === 'waiting' && (
            <ActionButton variant="primary" onClick={startFishing}>
              Cast Line
            </ActionButton>
          )}
          
          {fishingState === 'bite' && (
            <ActionButton variant="success" onClick={startReeling}>
              Reel In!
            </ActionButton>
          )}
          
          <ActionButton onClick={finishFishing}>
            Return to Town
          </ActionButton>
        </ActionPanel>
      </FishingUI>
    </FishingContainer>
  );
});