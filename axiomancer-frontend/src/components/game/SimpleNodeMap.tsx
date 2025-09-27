import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`;

const Header = styled.div`
  background: ${theme.colors.background.panel};
  padding: ${theme.spacing.lg};
  border-bottom: 2px solid ${theme.colors.border.primary};
  
  h2 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.md} 0;
  }
  
  .resources {
    display: flex;
    gap: ${theme.spacing.md};
    
    .resource {
      background: ${theme.colors.background.secondary};
      padding: ${theme.spacing.sm};
      border-radius: ${theme.borderRadius.md};
      color: ${theme.colors.text.primary};
      font-weight: bold;
    }
  }
`;

const NodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.xl};
  flex: 1;
  overflow-y: auto;
`;

const NodeCard = styled.div<{ unlocked: boolean; current: boolean }>`
  background: ${props => 
    props.current ? 'linear-gradient(45deg, #f59e0b, #fbbf24)' :
    props.unlocked ? theme.colors.background.panel : theme.colors.background.secondary
  };
  border: 3px solid ${props =>
    props.current ? '#fbbf24' :
    props.unlocked ? theme.colors.border.primary : theme.colors.border.dark
  };
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  cursor: ${props => props.unlocked ? 'pointer' : 'default'};
  opacity: ${props => props.unlocked ? 1 : 0.6};
  transition: all 0.3s ease;

  &:hover {
    ${props => props.unlocked && `
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.glow};
    `}
  }

  .node-header {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
    
    .icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.3);
      border-radius: 50%;
    }
    
    .info h3 {
      margin: 0;
      color: ${theme.colors.text.accent};
      font-size: 1.2rem;
    }
    
    .info .type {
      color: ${theme.colors.text.secondary};
      font-size: 0.9rem;
      text-transform: uppercase;
    }
  }

  .description {
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md};
    line-height: 1.4;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
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
  border: none;
  color: white;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusText = styled.div`
  background: rgba(0,0,0,0.5);
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  margin-top: ${theme.spacing.sm};
`;

export const SimpleNodeMap = React.memo(() => {
  const { gameState, moveToNode, updateStory, updateInventory, unlockNode, changeScreen, startCombat } = useGame();
  const { locations, currentLocation, currentNode, inventory, story } = gameState;
  const location = locations[currentLocation];

  if (!location?.nodes) {
    return <div>No nodes available</div>;
  }

  const handleNodeAction = (nodeId: string) => {
    const node = location.nodes!.find(n => n.id === nodeId);
    if (!node?.event) return;

    console.log('Node action triggered:', nodeId, node.event.type);

    switch (node.event.type) {
      case 'dialogue':
        if (node.event.npcId === 'guardian') {
          updateStory({ talkedToGuardian: true });
          unlockNode(currentLocation, 'docks');
          alert('Guardian: "Remember, young one, every choice shapes who you become. You may now prepare for fishing at the docks."');
        }
        break;

      case 'fishing':
        updateStory({ startedFishing: true });
        unlockNode(currentLocation, 'fishing_spot');
        changeScreen('fishing');
        break;

      case 'gather':
        if (node.event.resource === 'wood') {
          const gained = 5;
          updateInventory({ wood: inventory.wood + gained });
          unlockNode(currentLocation, 'boat_builder');
          alert(`Gathered ${gained} wood! You can now build a boat.`);
        }
        break;

      case 'building':
        if (inventory.fish >= 5 && inventory.wood >= 10) {
          updateInventory({ fish: inventory.fish - 5, wood: inventory.wood - 10 });
          updateStory({ builtBoat: true });
          unlockNode(currentLocation, 'forest_path');
          alert('Boat built! You can now travel to the forest.');
        } else {
          alert('Need 5 fish and 10 wood to build a boat.');
        }
        break;

      case 'combat':
        if (node.event.enemyId) {
          startCombat(node.event.enemyId);
        }
        break;

      case 'choice':
        if (node.event.description.includes('forest')) {
          alert('Opening forest map...');
          // TODO: Switch to forest location
        }
        break;
    }
  };

  const canPerformAction = (node: any) => {
    if (!node.event?.requirements) return true;
    
    return node.event.requirements.every((req: any) => {
      return story[req.key as keyof typeof story] === req.value;
    });
  };

  return (
    <Container>
      <Header>
        <h2>{location.name}</h2>
        <div className="resources">
          <div className="resource">💰 Gold: {inventory.gold}</div>
          <div className="resource">🐟 Fish: {inventory.fish}</div>
          <div className="resource">🪵 Wood: {inventory.wood}</div>
          <div className="resource">⛏️ Iron: {inventory.ironOre}</div>
        </div>
      </Header>

      <NodeGrid>
        {location.nodes.map(node => (
          <NodeCard
            key={node.id}
            unlocked={node.unlocked}
            current={node.id === currentNode}
            onClick={() => node.unlocked && moveToNode(node.id)}
          >
            <div className="node-header">
              <div className="icon">{node.icon}</div>
              <div className="info">
                <h3>{node.name}</h3>
                <div className="type">{node.type}</div>
              </div>
            </div>

            <div className="description">{node.description}</div>

            <div className="actions">
              {node.id === currentNode && node.event && (
                <>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeAction(node.id);
                    }}
                    disabled={!canPerformAction(node)}
                    variant={node.event.type === 'combat' ? 'danger' : 'primary'}
                  >
                    {node.event.type === 'dialogue' ? 'Talk to Guardian' :
                     node.event.type === 'fishing' ? 'Prepare Fishing' :
                     node.event.type === 'gather' ? `Gather ${node.event.resource}` :
                     node.event.type === 'building' ? 'Build Boat' :
                     node.event.type === 'combat' ? 'ENTER BATTLE' :
                     node.event.type === 'choice' ? 'Explore Path' :
                     'Interact'}
                  </ActionButton>
                  
                  {node.event.requirements && !canPerformAction(node) && (
                    <StatusText>
                      Requirements: {node.event.requirements.map((req: any) => 
                        `${req.key}: ${req.value} ${story[req.key as keyof typeof story] ? '✓' : '✗'}`
                      ).join(', ')}
                    </StatusText>
                  )}
                </>
              )}

              {node.id !== currentNode && node.unlocked && (
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToNode(node.id);
                  }}
                  variant="success"
                >
                  Travel Here
                </ActionButton>
              )}

              {!node.unlocked && (
                <StatusText>🔒 Locked - Complete other tasks to unlock</StatusText>
              )}
            </div>
          </NodeCard>
        ))}
      </NodeGrid>
    </Container>
  );
});