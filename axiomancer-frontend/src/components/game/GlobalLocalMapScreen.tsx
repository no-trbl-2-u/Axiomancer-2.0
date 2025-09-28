import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { EventModal } from './EventModal';
import { saveCharacter } from '../../utils/characterSave';

interface GlobalArea {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
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
    unlocked: true,
    completed: false
  },
  {
    id: 'whispering_forest',
    name: 'Whispering Forest',
    description: 'Ancient woods where tree spirits pose philosophical challenges.',
    imageUrl: '/maps/map02.jpg',
    unlocked: false,
    completed: false,
    requiredAreas: ['fishing_village']
  },
  {
    id: 'crystal_caverns',
    name: 'Crystal Caverns',
    description: 'Underground chambers that reflect the nature of reality.',
    imageUrl: '/maps/map03.jpg',
    unlocked: false,
    completed: false,
    requiredAreas: ['whispering_forest']
  },
  {
    id: 'philosophical_ruins',
    name: 'Ancient Philosophical Ruins',
    description: 'Remnants of a great academy where wisdom was once taught.',
    imageUrl: '/maps/map04.jpg',
    unlocked: false,
    completed: false,
    requiredAreas: ['crystal_caverns']
  },
  {
    id: 'temple_contemplation',
    name: 'Temple of Contemplation',
    description: 'The highest peak where ultimate wisdom awaits the worthy.',
    imageUrl: '/maps/map05.png',
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`;

const GlobalMapSection = styled.div`
  flex: 1;
  padding: ${theme.spacing.lg};
  border-right: 2px solid ${theme.colors.border.primary};

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.lg} 0;
    text-align: center;
  }

  .areas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${theme.spacing.md};
  }
`;

const AreaCard = styled.div<{ unlocked: boolean; completed: boolean; selected: boolean }>`
  background: ${theme.colors.background.panel};
  border: 2px solid ${props =>
    props.selected ? theme.colors.primary :
    props.completed ? theme.colors.success :
    props.unlocked ? theme.colors.border.primary :
    theme.colors.gray[600]
  };
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.unlocked ? 1 : 0.6};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.unlocked ? 'translateY(-2px)' : 'none'};
    border-color: ${props => props.unlocked ? theme.colors.primary : theme.colors.gray[600]};
  }

  .area-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.sm};
  }

  .area-name {
    color: ${theme.colors.text.accent};
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }

  .area-description {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .status {
    margin-top: ${theme.spacing.sm};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;

    &.completed {
      background: ${theme.colors.success};
      color: white;
    }

    &.available {
      background: ${theme.colors.warning};
      color: ${theme.colors.dark};
    }

    &.locked {
      background: ${theme.colors.gray[600]};
      color: ${theme.colors.text.muted};
    }
  }
`;

const LocalMapSection = styled.div`
  flex: 1;
  padding: ${theme.spacing.lg};
  position: relative;

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.lg} 0;
    text-align: center;
  }

  .no-area-selected {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60%;
    color: ${theme.colors.text.secondary};
    text-align: center;
    font-style: italic;
  }
`;

const LocalMapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
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
  width: 40px;
  height: 40px;
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
      return '0 0 8px rgba(16, 185, 129, 0.6)';
    }
    return 'none';
  }};

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
    z-index: 10;
    box-shadow: ${props => {
      if (props.unlocked && props.nodeType !== 'person' && props.nodeType !== 'start') {
        return '0 0 12px rgba(16, 185, 129, 0.8)';
      }
      return '0 0 8px rgba(255, 255, 255, 0.4)';
    }};
  }

  .icon {
    color: white;
    font-size: 1.2rem;
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

const ProgressBar = styled.div`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};

  .label {
    color: ${theme.colors.text.primary};
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }

  .bar {
    width: 100%;
    height: 10px;
    background: ${theme.colors.background.primary};
    border-radius: 5px;
    overflow: hidden;

    .fill {
      height: 100%;
      background: ${theme.colors.success};
      transition: width 0.3s ease;
    }
  }

  .text {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    margin-top: ${theme.spacing.sm};
  }
`;

export const GlobalLocalMapScreen: React.FC = () => {
  const { gameState, changeScreen, moveToNode, updateStory, unlockNode, unlockGuardianProgression } = useGame();
  const [selectedArea, setSelectedArea] = useState<string>('fishing_town');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Event modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEventType, setCurrentEventType] = useState<'combat' | 'moral' | 'gathering' | 'rest'>('combat');
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  
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
      alert('This path is not yet accessible.');
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
    console.log('🔍 Character skills:', gameState.character.skills);
    
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
  const completedNodes = localNodes.filter(n => n.completed).length;
  const progressPercent = localNodes.length > 0 ? (completedNodes / localNodes.length) * 100 : 0;

  return (
    <Container>
      <GlobalMapSection>
        <h2>🌍 World Map</h2>
        <div className="areas-grid">
          {GLOBAL_AREAS.map((area) => (
            <AreaCard
              key={area.id}
              unlocked={area.unlocked}
              completed={area.completed}
              selected={selectedArea === area.id}
              onClick={() => handleAreaSelect(area.id)}
            >
              <img src={area.imageUrl} alt={area.name} className="area-image" />
              <div className="area-name">{area.name}</div>
              <div className="area-description">{area.description}</div>
              <div className={`status ${
                area.completed ? 'completed' :
                area.unlocked ? 'available' : 'locked'
              }`}>
                {area.completed ? 'Completed' :
                 area.unlocked ? 'Available' : 'Locked'}
              </div>
            </AreaCard>
          ))}
        </div>
      </GlobalMapSection>

      <LocalMapSection>
        <h2>🗺️ Local Area: {selectedAreaData?.name || 'Unknown'}</h2>

        {selectedArea ? (
          <>
            <LocalMapContainer>
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

            <ProgressBar>
              <div className="label">Area Progress</div>
              <div className="bar">
                <div className="fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="text">
                {completedNodes} of {localNodes.length} locations explored
              </div>
            </ProgressBar>
          </>
        ) : (
          <div className="no-area-selected">
            Select a global area to explore its local map
          </div>
        )}
      </LocalMapSection>
        
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
      </Container>
    );
};