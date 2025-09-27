import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { PhilosophicalEventScreen } from './PhilosophicalEventScreen';
import { philosophicalEvents, createMeditationEvent, getAvailableEvents } from '../../utils/philosophicalEvents';

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
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.panel};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
  }

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
    z-index: 1;
    pointer-events: none;
  }
`;

const LocationOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: ${theme.spacing.lg};
  z-index: 2;

  h2 {
    margin: 0 0 ${theme.spacing.xs} 0;
    font-size: 1.8rem;
    color: ${theme.colors.text.accent};
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    font-weight: bold;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
`;

const LocationPlaceholder = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 1.4rem;
  z-index: 3;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
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
  const [currentEvent, setCurrentEvent] = useState<any>(null);

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
    switch (eventId) {
      case 'philosophical_tree':
        startCombat('philosophical_goblin');
        break;
      case 'fallacy_encounter':
        startCombat('abortive_fallacy');
        break;
      case 'strawman_ambush':
        startCombat('strawman_argument');
        break;
      case 'philosophical_trial':
        startCombat('sophist');
        break;
      case 'confirmation_bias_beast':
        startCombat('confirmation_bias');
        break;
      case 'circular_reasoning_demon':
        startCombat('circular_reasoning');
        break;
      case 'wisdom_guardian_trial':
        startCombat('wisdom_guardian');
        break;
      case 'crystal_meditation':
        setCurrentEvent(philosophicalEvents.cave_of_forms);
        break;
      case 'wind_wisdom':
        setCurrentEvent(createMeditationEvent(currentLocation));
        break;
      case 'lake_reflection':
        setCurrentEvent(createMeditationEvent(currentLocation));
        break;
      case 'trolley_dilemma':
        setCurrentEvent(philosophicalEvents.trolley_problem);
        break;
      default:
        // Check for location-specific philosophical events
        const availableEvents = getAvailableEvents(character, currentLocation);
        if (availableEvents.length > 0) {
          setCurrentEvent(availableEvents[0]);
        } else {
          console.log(`Exploring ${eventId}...`);
        }
    }
  };

  if (!location) {
    return (
      <ExplorationContainer>
        <div>Location not found</div>
      </ExplorationContainer>
    );
  }

  // Show philosophical event if one is active
  if (currentEvent) {
    return (
      <PhilosophicalEventScreen 
        event={currentEvent} 
        onComplete={() => setCurrentEvent(null)} 
      />
    );
  }

  return (
    <ExplorationContainer>
      <LocationImage>
        {location.mapImage ? (
          <>
            <img src={location.mapImage} alt={location.name} />
            <LocationOverlay>
              <h2>{location.name}</h2>
              <p>{location.description}</p>
            </LocationOverlay>
          </>
        ) : (
          <LocationPlaceholder>
            {location.name} - Visual representation coming soon
          </LocationPlaceholder>
        )}
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

          {/* Add meditation/reflection action for every location */}
          <ActionButton
            onClick={() => setCurrentEvent(createMeditationEvent(currentLocation))}
          >
            <h4>🧘 Reflect and Meditate</h4>
            <p>Take a moment for philosophical contemplation in this place</p>
          </ActionButton>

          {/* Add philosophical encounter if available */}
          {getAvailableEvents(character, currentLocation).length > 0 && (
            <ActionButton
              onClick={() => {
                const events = getAvailableEvents(character, currentLocation);
                setCurrentEvent(events[Math.floor(Math.random() * events.length)]);
              }}
            >
              <h4>🤔 Philosophical Encounter</h4>
              <p>Engage with deep philosophical questions relevant to this place</p>
            </ActionButton>
          )}
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