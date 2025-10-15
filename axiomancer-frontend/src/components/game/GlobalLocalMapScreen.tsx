import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { EventModal } from './EventModal';
import { LockedNodeModal } from './LockedNodeModal';
import { saveCharacter } from '../../utils/characterSave';

interface GlobalArea {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  backgroundImage?: string; // Optional background image for the map
  unlocked: boolean;
  completed: boolean;
  requiredAreas?: string[];
}

interface LocalNode {
  id: string;
  name: string;
  description: string;
  type: 'start' | 'resource' | 'encounter' | 'person' | 'event' | 'boss' | 'exit' | 'explore' | 'building';
  completed: boolean;
  visited: boolean;
  unlocked: boolean;
  position: { x: number; y: number };
  icon?: string;
  eventType?: 'moral' | 'gathering' | 'rest' | 'combat';
  connections?: string[];
}

const GLOBAL_AREAS: GlobalArea[] = [
  {
    id: 'fishing_village',
    name: 'Small Fishing Village',
    description: 'Your peaceful hometown where the philosophical journey begins.',
    imageUrl: '/maps/map01.jpeg',
    backgroundImage: '/maps/map01.jpeg',
    unlocked: true,
    completed: false
  },
  {
    id: 'whispering_forest',
    name: 'Whispering Forest',
    description: 'Ancient woods where tree spirits pose philosophical challenges.',
    imageUrl: '/maps/map02.jpg',
    backgroundImage: '/maps/map02.jpg',
    unlocked: false,
    completed: false,
    requiredAreas: ['fishing_village']
  },
  {
    id: 'crystal_caverns',
    name: 'Crystal Caverns',
    description: 'Underground chambers that reflect the nature of reality.',
    imageUrl: '/maps/map03.jpg',
    backgroundImage: '/maps/map03.jpg',
    unlocked: false,
    completed: false,
    requiredAreas: ['whispering_forest']
  },
  {
    id: 'philosophical_ruins',
    name: 'Ancient Philosophical Ruins',
    description: 'Remnants of a great academy where wisdom was once taught.',
    imageUrl: '/maps/map04.jpg',
    backgroundImage: '/maps/map04.jpg',
    unlocked: false,
    completed: false,
    requiredAreas: ['crystal_caverns']
  },
  {
    id: 'temple_contemplation',
    name: 'Temple of Contemplation',
    description: 'The highest peak where ultimate wisdom awaits the worthy.',
    imageUrl: '/maps/map05.png',
    backgroundImage: '/maps/map05.png',
    unlocked: false,
    completed: false,
    requiredAreas: ['philosophical_ruins']
  }
];

const assignRandomEventType = (): 'moral' | 'gathering' | 'rest' | 'combat' => {
  const rand = Math.random();
  if (rand < 0.30) return 'combat';
  if (rand < 0.55) return 'moral';
  if (rand < 0.80) return 'gathering';
  return 'rest';
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`;

const LocalMapSection = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MapSelectorSection = styled.div`
  background: ${theme.colors.background.panel};
  border-top: 2px solid ${theme.colors.border.primary};
  padding: ${theme.spacing.md};
  overflow-x: auto;
  overflow-y: hidden;

  .selector-title {
    color: ${theme.colors.text.accent};
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
    text-align: center;
  }
`;

const MapSelectorGrid = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: nowrap;
  min-height: 80px;
`;

const MapSelector = styled.div<{ unlocked: boolean; selected: boolean }>`
  background: ${props => props.unlocked 
    ? theme.colors.background.secondary 
    : 'rgba(55, 65, 81, 0.4)'
  };
  border: 3px solid ${props =>
    props.selected ? theme.colors.primary :
    props.unlocked ? theme.colors.border.primary :
    theme.colors.gray[600]
  };
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.unlocked ? 1 : 0.5};
  transition: all 0.3s ease;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: ${props => props.unlocked ? 'translateY(-2px)' : 'none'};
    border-color: ${props => props.unlocked ? theme.colors.primary : theme.colors.gray[600]};
    box-shadow: ${props => props.unlocked ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none'};
  }

  .map-name {
    color: ${props => props.unlocked ? theme.colors.text.accent : theme.colors.text.muted};
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
  }
`;

const LocalMapContainer = styled.div<{ backgroundImage?: string | undefined }>`
  position: relative;
  width: 100%;
  flex: 1;
  background: ${props => props.backgroundImage 
    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${props.backgroundImage})`
    : theme.colors.background.panel
  };
  background-size: cover;
  background-position: center;
  overflow: hidden;
`;

const ConnectionLines = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const ConnectionLine = styled.line<{ isActive: boolean }>`
  stroke: ${props => props.isActive ? '#10b981' : theme.colors.gray[600]};
  stroke-width: ${props => props.isActive ? '4px' : '2px'};
  stroke-dasharray: ${props => props.isActive ? 'none' : '5,5'};
  opacity: ${props => props.isActive ? 0.9 : 0.4};
  transition: all 0.3s ease;
  filter: ${props => props.isActive ? 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))' : 'none'};
`;

const LocalNodeElement = styled.div<{ nodeType: string; completed: boolean; visited: boolean; unlocked: boolean }>`
  position: absolute;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => {
    if (props.completed) return theme.colors.success;
    if (props.nodeType === 'person' || props.nodeType === 'start') return theme.colors.info;
    if (props.visited) {
      // Show different colors based on discovered event type
      return theme.colors.warning;
    }
    // Unexplored nodes
    return theme.colors.gray[600];
  }};
  border: 3px solid ${props => {
    if (props.unlocked && props.nodeType !== 'person' && props.nodeType !== 'start') {
      return '#10b981'; // Green border for unlocked nodes
    }
    if (props.nodeType === 'person' || props.nodeType === 'start') {
      return theme.colors.border.primary;
    }
    return theme.colors.gray[500];
  }};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: translate(-50%, -50%);
  box-shadow: ${props => {
    if (props.unlocked && props.nodeType !== 'person' && props.nodeType !== 'start') {
      return '0 0 10px rgba(16, 185, 129, 0.7)';
    }
    return 'none';
  }};

  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
    z-index: 10;
    box-shadow: ${props => {
      if (props.unlocked && props.nodeType !== 'person' && props.nodeType !== 'start') {
        return '0 0 20px rgba(16, 185, 129, 0.9)';
      }
      return '0 0 12px rgba(255, 255, 255, 0.6)';
    }};
  }

  .icon {
    color: white;
    font-size: 1.3rem;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
  }
`;

const NodeTooltip = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.secondary};
  white-space: nowrap;
  font-size: 0.8rem;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 20;
`;

const MapTitle = styled.div`
  position: absolute;
  top: ${theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  z-index: 10;

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0;
    font-size: 1.3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
`;

export const GlobalLocalMapScreen: React.FC = () => {
  // Zustand store - selective subscriptions
  const gameState = useGameStore(state => state.gameState);
  const changeScreen = useGameStore(state => state.changeScreen);
  const moveToNode = useGameStore(state => state.moveToNode);
  const updateStory = useGameStore(state => state.updateStory);
  const unlockNode = useGameStore(state => state.unlockNode);
  const unlockGuardianProgression = useGameStore(state => state.unlockGuardianProgression);
  
  const [selectedArea, setSelectedArea] = useState<string>('fishing_town');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Event modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEventType, setCurrentEventType] = useState<'combat' | 'moral' | 'gathering' | 'rest'>('combat');
  const [currentNodeId, setCurrentNodeId] = useState<string>('');

  // Locked node modal state
  const [showLockedModal, setShowLockedModal] = useState(false);
  
  // Get nodes from game context
  const currentLocation = gameState.locations[selectedArea];
  const localNodes: LocalNode[] = currentLocation?.nodes?.map(node => ({
    ...node,
    completed: node.visited && node.type !== 'person', // persons can be revisited
    eventType: (node as any).eventType, // Will be assigned on first visit
    connections: node.connections || []
  })) || [];

  const handleAreaSelect = (areaId: string) => {
    const area = GLOBAL_AREAS.find(a => a.id === areaId);
    if (area?.unlocked) {
      setSelectedArea(areaId);
    }
  };

  const handleNodeClick = async (node: LocalNode) => {
    // Check if node is accessible
    if (!node.unlocked && node.type !== 'person' && node.type !== 'start') {
      setShowLockedModal(true);
      return;
    }
    
    // Handle guardian/person nodes
    if (node.type === 'person') {
      if (node.id === 'guardian') {
        // Show guardian dialogue in modal
        setCurrentEventType('moral'); // Use moral type for dialogue
        setCurrentNodeId(node.id);
        setShowEventModal(true);
      }
      moveToNode(node.id);
      return;
    }
    
    // Check if player has Basic Reasoning skill for other events
    const talkedToGuardian = gameState.story.talkedToGuardian;
    console.log('🔍 Story check - talkedToGuardian:', talkedToGuardian);
    console.log('🔍 Character availableSkills:', gameState.character.availableSkills);
    
    if (!talkedToGuardian) {
      // Show modal instead of alert
      setCurrentEventType('moral');
      setCurrentNodeId('need_guardian');
      setShowEventModal(true);
      return;
    }
    
    // Handle revisiting completed nodes
    if (node.completed) {
      const revisitChance = Math.random();
      if (revisitChance < 0.75) {
        // Show "nothing here" modal instead of alert
        setCurrentEventType('rest'); // Use rest type for "nothing here" message
        setCurrentNodeId(node.id + '_empty');
        setShowEventModal(true);
        return;
      } else {
        // 25% chance of combat when revisiting
        setCurrentEventType('combat');
        setCurrentNodeId(node.id);
        setShowEventModal(true);
        return;
      }
    }
    
    // First time visiting - assign random event type if not already assigned
    let eventType = (node as any).eventType;
    if (!eventType) {
      eventType = assignRandomEventType();
      // TODO: Update the node in game state with this event type
    }
    
    // Handle different event types in modal
    setCurrentEventType(eventType);
    setCurrentNodeId(node.id);
    setShowEventModal(true);
    
    // Mark node as visited and unlock connected nodes
    moveToNode(node.id);

    // Unlock connected nodes
    node.connections?.forEach(connectionId => {
      const targetNode = localNodes.find(n => n.id === connectionId);
      if (targetNode) {
        unlockNode(selectedArea, connectionId);
      }
    });

    // Auto-save after node completion
    console.log('💾 Auto-saving after node interaction:', node.id);
    await saveCharacter(gameState);
  };

  const getNodeIcon = (node: LocalNode) => {
    // Guardian/starting nodes show their actual icon
    if (node.type === 'person' || node.type === 'start') {
      return node.icon || '👨‍🏫';
    }
    
    // Completed nodes show checkmark
    if (node.completed) return '✅';
    
    // Visited nodes show their actual event type icon
    if (node.visited && node.eventType) {
      switch (node.eventType) {
        case 'combat': return '⚔️';
        case 'moral': return '💭';
        case 'gathering': return '🌾';
        case 'rest': return '🏕️';
        default: return '❓';
      }
    }
    
    // Unvisited nodes show ?
    return '❓';
  };

  const selectedAreaData = GLOBAL_AREAS.find(a => a.id === selectedArea);

  return (
    <Container>
      <LocalMapSection>
        {selectedArea ? (
          <LocalMapContainer backgroundImage={selectedAreaData?.backgroundImage}>
            <MapTitle>
              <h2>{selectedAreaData?.unlocked ? selectedAreaData.name : '???'}</h2>
            </MapTitle>

            {/* Connection Lines */}
            <ConnectionLines>
              {localNodes.map((node) => 
                node.connections?.map((connectionId) => {
                  const targetNode = localNodes.find(n => n.id === connectionId);
                  if (!targetNode) return null;
                  
                  const isActive = node.unlocked && targetNode.unlocked;
                  
                  return (
                    <ConnectionLine
                      key={`${node.id}-${connectionId}`}
                      x1={`${node.position.x}%`}
                      y1={`${node.position.y}%`}
                      x2={`${targetNode.position.x}%`}
                      y2={`${targetNode.position.y}%`}
                      isActive={isActive}
                    />
                  );
                })
              ).flat()}
            </ConnectionLines>
            
            {/* Nodes */}
            {localNodes.map((node) => (
              <LocalNodeElement
                key={node.id}
                nodeType={node.type}
                completed={node.completed}
                visited={node.visited}
                unlocked={node.unlocked}
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                  zIndex: 2
                }}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="icon">
                  {getNodeIcon(node)}
                </div>
                <NodeTooltip show={hoveredNode === node.id}>
                  {node.visited || node.type === 'person' || node.type === 'start' ? node.name : 'Unknown Location'}
                </NodeTooltip>
              </LocalNodeElement>
            ))}
          </LocalMapContainer>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.text.secondary,
            fontSize: '1.2rem'
          }}>
            Select a map below to begin your journey
          </div>
        )}
      </LocalMapSection>

      <MapSelectorSection>
        <div className="selector-title">Select Map</div>
        <MapSelectorGrid>
          {GLOBAL_AREAS.map((area) => (
            <MapSelector
              key={area.id}
              unlocked={area.unlocked}
              selected={selectedArea === area.id}
              onClick={() => handleAreaSelect(area.id)}
            >
              <div className="map-name">
                {area.unlocked ? area.name : '???'}
              </div>
            </MapSelector>
          ))}
        </MapSelectorGrid>
      </MapSelectorSection>
        
      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        eventType={currentEventType}
        nodeId={currentNodeId}
        onClose={() => {
          setShowEventModal(false);
          // Mark node as visited and unlock connected nodes after event
          const node = localNodes.find(n => n.id === currentNodeId);
          if (node && !node.visited) {
            moveToNode(node.id);
            // Unlock connected nodes
            node.connections?.forEach(connectionId => {
              const targetNode = localNodes.find(n => n.id === connectionId);
              if (targetNode) {
                unlockNode(selectedArea, connectionId);
              }
            });
          }
        }}
      />

      <LockedNodeModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
      />
    </Container>
  );
};