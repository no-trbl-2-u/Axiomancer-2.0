import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { GameNode, NodeEvent } from '../../types/game';

const NodeMapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
`;

const HeaderPanel = styled.div`
  background: ${theme.colors.background.panel};
  border-bottom: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadows.panel};
  z-index: 10;

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const LocationTitle = styled.h2`
  color: ${theme.colors.text.accent};
  margin: 0;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 1.2rem;
    text-align: center;
  }
`;

const ResourcePanel = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: ${theme.spacing.sm};
  }
`;

const ResourceItem = styled.div`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  font-weight: bold;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  .icon {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: ${theme.spacing.xs};
  }
`;

const MapArea = styled.div`
  flex: 1;
  position: relative;
  background: radial-gradient(circle at center, rgba(139, 69, 19, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%);
  overflow: hidden;
  touch-action: pan-x pan-y;
`;

const NodeContainer = styled.div<{ x: number; y: number; size: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  transform: translate(-50%, -50%);
  z-index: 5;
`;

const NodeButton = styled.button<{ 
  unlocked: boolean; 
  visited: boolean; 
  current: boolean;
  nodeType: string;
}>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid ${props => 
    props.current ? '#fbbf24' :
    props.visited ? '#3b82f6' :
    props.unlocked ? '#10b981' : '#6b7280'
  };
  background: ${props => {
    if (props.current) return 'radial-gradient(circle, #fbbf24, #f59e0b)';
    if (props.visited) return 'radial-gradient(circle, #3b82f6, #1d4ed8)';
    if (props.unlocked) return 'radial-gradient(circle, #10b981, #059669)';
    return 'radial-gradient(circle, #6b7280, #374151)';
  }};
  color: white;
  cursor: ${props => props.unlocked ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  opacity: ${props => props.unlocked ? 1 : 0.5};

  &:hover {
    ${props => props.unlocked && !props.current && `
      transform: scale(1.1);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
      border-color: #fbbf24;
    `}
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ConnectionLine = styled.svg<{ unlocked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const ConnectionPath = styled.line<{ unlocked: boolean }>`
  stroke: ${props => props.unlocked ? '#10b981' : '#6b7280'};
  stroke-width: 3;
  opacity: ${props => props.unlocked ? 0.8 : 0.3};
  stroke-dasharray: ${props => props.unlocked ? 'none' : '5,5'};
`;

const InfoPanel = styled.div`
  background: ${theme.colors.background.panel};
  border-top: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  padding: ${theme.spacing.lg};
  min-height: 160px;
  max-height: 200px;
  box-shadow: ${theme.shadows.panel};
  overflow-y: auto;
  position: relative;
  z-index: 20;

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    min-height: 140px;
    max-height: 180px;
  }
`;

const NodeInfo = styled.div`
  h3 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.sm} 0;
    font-size: 1.3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  p {
    color: ${theme.colors.text.secondary};
    margin: 0 0 ${theme.spacing.md} 0;
    line-height: 1.4;
    font-size: 0.95rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const ActionButton = styled.button`
  background: ${theme.colors.primary};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.button};
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  z-index: 30;
  min-height: 44px;
  min-width: 100px;

  &:hover {
    background: ${theme.colors.success};
    border-color: ${theme.colors.success};
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
    min-height: 44px;
    width: 100%;
    margin-bottom: ${theme.spacing.sm};
  }
`;

export const NodeMapScreen = React.memo(() => {
  const { gameState, moveToNode, changeScreen, updateInventory, updateStory, unlockNode } = useGame();
  const { locations, currentLocation, currentNode, inventory, story } = gameState;
  const location = locations[currentLocation];
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentNode || '');

  if (!location || !location.nodes) {
    return (
      <NodeMapContainer>
        <div style={{ padding: theme.spacing.xl, textAlign: 'center', color: theme.colors.text.secondary }}>
          This location doesn't have a node map.
        </div>
      </NodeMapContainer>
    );
  }

  const selectedNode = location.nodes.find(n => n.id === selectedNodeId);
  const currentNodeObj = location.nodes.find(n => n.id === currentNode);

  const handleNodeClick = (node: GameNode) => {
    if (!node.unlocked) return;
    
    setSelectedNodeId(node.id);
    if (node.id !== currentNode) {
      moveToNode(node.id);
    }
  };

  const handleNodeAction = (node: GameNode) => {
    if (!node.event) return;

    const event = node.event;
    
    switch (event.type) {
      case 'dialogue':
        // Mark guardian as talked to and unlock next nodes
        if (event.npcId === 'guardian') {
          updateStory({ talkedToGuardian: true });
          // Unlock docks after talking to guardian
          unlockNode(currentLocation, 'docks');
        }
        changeScreen('dialogue');
        break;
        
      case 'gather':
        if (event.resource) {
          const resourceGained = Math.floor(Math.random() * 3) + 2; // 2-4 resources
          updateInventory({ 
            [event.resource]: (inventory[event.resource as keyof typeof inventory] as number || 0) + resourceGained 
          });
          
          // Unlock connected nodes
          node.connections.forEach(connectionId => {
            unlockNode(currentLocation, connectionId);
          });
        }
        break;
        
      case 'fishing':
        if (!story.talkedToGuardian) {
          alert('You should talk to your guardian first before starting to fish.');
          return;
        }
        updateStory({ startedFishing: true });
        // Unlock fishing spot after preparing
        unlockNode(currentLocation, 'fishing_spot');
        changeScreen('fishing');
        break;
        
      case 'building':
        if (inventory.fish >= 5 && inventory.wood >= 10) {
          updateInventory({ fish: inventory.fish - 5, wood: inventory.wood - 10 });
          updateStory({ builtBoat: true });
          
          // Unlock connected nodes
          node.connections.forEach(connectionId => {
            unlockNode(currentLocation, connectionId);
          });
        } else {
          alert('You need 5 fish and 10 wood to build a boat.');
        }
        break;
        
      case 'combat':
        if (event.enemyId) {
          // Start combat - will be implemented later
          changeScreen('combat');
        }
        break;
        
      case 'choice':
        // Handle philosophical choices - will be implemented later
        if (event.description.includes('Leave the safety')) {
          // This is the exit to forest
          changeScreen('map'); // Show world map to select forest
        } else {
          changeScreen('dialogue');
        }
        break;
    }
  };

  // Calculate node size based on screen size
  const getNodeSize = () => {
    if (window.innerWidth < 768) return 40;
    return 50;
  };

  const nodeSize = getNodeSize();

  return (
    <NodeMapContainer>
      <HeaderPanel>
        <LocationTitle>{location.name}</LocationTitle>
        <ResourcePanel>
          <ResourceItem>
            <span className="icon">💰</span>
            {inventory.gold}
          </ResourceItem>
          <ResourceItem>
            <span className="icon">🐟</span>
            {inventory.fish}
          </ResourceItem>
          <ResourceItem>
            <span className="icon">🪵</span>
            {inventory.wood}
          </ResourceItem>
          <ResourceItem>
            <span className="icon">⛏️</span>
            {inventory.ironOre}
          </ResourceItem>
        </ResourcePanel>
      </HeaderPanel>

      <MapArea>
        {/* Render connection lines using SVG */}
        <ConnectionLine unlocked={true}>
          {location.nodes.map(node => 
            node.connections.map(connectionId => {
              const connectedNode = location.nodes!.find(n => n.id === connectionId);
              if (!connectedNode) return null;
              
              const x1 = (node.position.x / 100) * (window.innerWidth * 0.6); // Approximate map width
              const y1 = (node.position.y / 100) * (window.innerHeight * 0.6); // Approximate map height
              const x2 = (connectedNode.position.x / 100) * (window.innerWidth * 0.6);
              const y2 = (connectedNode.position.y / 100) * (window.innerHeight * 0.6);
              
              return (
                <ConnectionPath
                  key={`${node.id}-${connectionId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  unlocked={node.unlocked && connectedNode.unlocked}
                />
              );
            })
          )}
        </ConnectionLine>

        {/* Render nodes */}
        {location.nodes.map(node => (
          <NodeContainer
            key={node.id}
            x={node.position.x}
            y={node.position.y}
            size={nodeSize}
          >
            <NodeButton
              unlocked={node.unlocked}
              visited={node.visited}
              current={node.id === currentNode}
              nodeType={node.type}
              onClick={() => handleNodeClick(node)}
              disabled={!node.unlocked}
              title={node.name}
            >
              {node.icon || '📍'}
            </NodeButton>
          </NodeContainer>
        ))}
      </MapArea>

      <InfoPanel>
        {selectedNode ? (
          <NodeInfo>
            <h3 style={{ color: theme.colors.text.accent, fontSize: '1.4rem', marginBottom: theme.spacing.md }}>
              {selectedNode.name}
            </h3>
            <p style={{ 
              color: theme.colors.text.primary, 
              fontSize: '1.1rem', 
              lineHeight: 1.5, 
              marginBottom: theme.spacing.lg,
              background: 'rgba(0,0,0,0.3)',
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.dark}`
            }}>
              {selectedNode.description}
            </p>
            
            {selectedNode.event && (
              <div style={{
                background: theme.colors.background.secondary,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                border: `2px solid ${theme.colors.border.primary}`,
                marginBottom: theme.spacing.md
              }}>
                <h4 style={{ color: theme.colors.text.accent, margin: '0 0 8px 0' }}>Available Action:</h4>
                <p style={{ color: theme.colors.text.secondary, margin: '0 0 12px 0', fontSize: '0.9rem' }}>
                  {selectedNode.event.description}
                </p>
                
                {selectedNode.event.requirements && (
                  <div style={{ marginBottom: theme.spacing.sm }}>
                    <small style={{ color: theme.colors.text.secondary }}>
                      Requirements: {selectedNode.event.requirements.map(req => {
                        const hasReq = story[req.key as keyof typeof story];
                        return `${req.key}: ${req.value} ${hasReq ? '✓' : '✗'}`;
                      }).join(', ')}
                    </small>
                  </div>
                )}
                
                {selectedNode.id === currentNode && (
                  <ActionButton 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Action button clicked for:', selectedNode.name);
                      handleNodeAction(selectedNode);
                    }}
                  >
                    {selectedNode.event.type === 'gather' ? `Gather ${selectedNode.event.resource}` :
                     selectedNode.event.type === 'dialogue' ? 'Talk to Guardian' :
                     selectedNode.event.type === 'fishing' ? 'Prepare Fishing Gear' :
                     selectedNode.event.type === 'building' ? 'Build Boat' :
                     selectedNode.event.type === 'combat' ? 'Enter Combat' :
                     selectedNode.event.type === 'choice' ? 'Explore Path' :
                     'Interact'}
                  </ActionButton>
                )}
              </div>
            )}
            
            {selectedNode.id !== currentNode && selectedNode.unlocked && (
              <ActionButton 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Moving to node:', selectedNode.id);
                  moveToNode(selectedNode.id);
                }}
              >
                Travel to {selectedNode.name}
              </ActionButton>
            )}
            
            {!selectedNode.unlocked && (
              <div style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                color: '#fca5a5'
              }}>
                This location is locked. Complete other tasks to unlock it.
              </div>
            )}
          </NodeInfo>
        ) : currentNodeObj ? (
          <NodeInfo>
            <h3>{currentNodeObj.name}</h3>
            <p>{currentNodeObj.description}</p>
            <small style={{ color: theme.colors.text.secondary }}>
              Click on a node to learn more about it.
            </small>
          </NodeInfo>
        ) : (
          <div style={{ color: theme.colors.text.secondary }}>
            Select a node to see details.
          </div>
        )}
      </InfoPanel>
    </NodeMapContainer>
  );
});