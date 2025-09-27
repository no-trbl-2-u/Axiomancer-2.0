import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

const ExplorationContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120px ${theme.spacing.xl} 100px;
  background: ${theme.colors.background.primary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(139, 69, 19, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%);
    pointer-events: none;
  }
`;

const LocationImage = styled.div`
  width: 100%;
  max-width: 700px;
  height: 350px;
  background: ${theme.colors.background.secondary};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.panel};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg,
      rgba(218, 165, 32, 0.1) 0%,
      rgba(139, 69, 19, 0.1) 50%,
      rgba(218, 165, 32, 0.1) 100%);
  }
`;

const LocationPlaceholder = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 1.4rem;
  z-index: 1;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const ActionPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 700px;
  box-shadow: ${theme.shadows.panel};
  position: relative;
  z-index: 1;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const ActionButton = styled.button`
  background: ${theme.colors.background.secondary};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.dark};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  box-shadow: ${theme.shadows.button};

  &:hover {
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.border.primary};
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

  h4 {
    margin: 0 0 ${theme.spacing.sm} 0;
    color: ${theme.colors.text.accent};
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  p {
    margin: 0;
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ConnectionsSection = styled.div`
  margin-top: ${theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const ConnectionButton = styled.button`
  background: ${theme.colors.background.secondary};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.secondary};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.button};
  font-weight: bold;
  text-transform: uppercase;

  &:hover {
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.border.primary};
    color: ${theme.colors.text.accent};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ExplorationScreen = React.memo(() => {
  const { gameState, moveToLocation, startCombat, changeScreen } = useGame();
  const { locations, currentLocation, character } = gameState;
  const location = locations[currentLocation];

  const handleGatherResource = (resource: string) => {
    // TODO: Implement resource gathering logic
    console.log(`Gathering ${resource}...`);
  };

  const handleTalkToNPC = (npcId: string) => {
    if (npcId === 'guardian') {
      changeScreen('dialogue');
    } else {
      console.log(`Talking to ${npcId}...`);
    }
  };

  const handleExploreEvent = (eventId: string) => {
    if (eventId === 'philosophical_tree') {
      // Start a philosophical combat encounter
      startCombat('philosophical_goblin');
    } else {
      console.log(`Exploring ${eventId}...`);
    }
  };

  if (!location) {
    return (
      <ExplorationContainer>
        <div>Location not found</div>
      </ExplorationContainer>
    );
  }

  return (
    <ExplorationContainer>
      <LocationImage>
        <LocationPlaceholder>
          {location.name} - Visual representation coming soon
        </LocationPlaceholder>
      </LocationImage>

      <ActionPanel>
        <ActionGrid>
          {location.resources.map(resource => (
            <ActionButton
              key={resource}
              onClick={() => handleGatherResource(resource)}
            >
              <h4>Gather {resource}</h4>
              <p>Collect valuable {resource} for crafting and trading</p>
            </ActionButton>
          ))}

          {location.npcs.map(npc => (
            <ActionButton
              key={npc.id}
              onClick={() => handleTalkToNPC(npc.id)}
            >
              <h4>Talk to {npc.name}</h4>
              <p>{npc.description}</p>
            </ActionButton>
          ))}

          {location.events
            .filter(event => !event.triggered)
            .map(event => (
              <ActionButton
                key={event.id}
                onClick={() => handleExploreEvent(event.id)}
              >
                <h4>{event.name}</h4>
                <p>{event.description}</p>
              </ActionButton>
            ))}
        </ActionGrid>

        {location.connections.length > 0 && (
          <ConnectionsSection>
            <SectionTitle>Travel to:</SectionTitle>
            {location.connections.map(connectionId => {
              const connectedLocation = locations[connectionId];
              return connectedLocation ? (
                <ConnectionButton
                  key={connectionId}
                  onClick={() => moveToLocation(connectionId)}
                >
                  {connectedLocation.name}
                </ConnectionButton>
              ) : null;
            })}
          </ConnectionsSection>
        )}
      </ActionPanel>
    </ExplorationContainer>
  );
});