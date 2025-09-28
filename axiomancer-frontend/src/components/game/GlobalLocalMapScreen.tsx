import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

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
  type: 'safe' | 'event' | 'combat' | 'treasure';
  completed: boolean;
  position: { x: number; y: number };
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

const generateLocalNodes = (areaId: string): LocalNode[] => {
  const nodeCount = 5 + Math.floor(Math.random() * 3); // 5-7 nodes
  const nodes: LocalNode[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const nodeTypes: LocalNode['type'][] = ['safe', 'event', 'combat', 'treasure'];
    const randomType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];

    nodes.push({
      id: `${areaId}_node_${i}`,
      name: `${randomType === 'safe' ? 'Safe Haven' :
             randomType === 'event' ? 'Mysterious Event' :
             randomType === 'combat' ? 'Dangerous Encounter' : 'Hidden Treasure'}`,
      description: `A ${randomType} location in the ${areaId.replace('_', ' ')}.`,
      type: randomType,
      completed: false,
      position: {
        x: 50 + (Math.cos(i * 2 * Math.PI / nodeCount) * 30),
        y: 50 + (Math.sin(i * 2 * Math.PI / nodeCount) * 30)
      }
    });
  }

  return nodes;
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

const LocalNode = styled.div<{ nodeType: LocalNode['type']; completed: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props =>
    props.completed ? theme.colors.success :
    props.nodeType === 'safe' ? theme.colors.info :
    props.nodeType === 'event' ? theme.colors.warning :
    props.nodeType === 'combat' ? theme.colors.danger :
    theme.colors.primary
  };
  border: 2px solid ${theme.colors.border.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: translate(-50%, -50%);

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
    z-index: 10;
  }

  .icon {
    color: white;
    font-size: 1.2rem;
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
  const { gameState, changeScreen } = useGame();
  const [selectedArea, setSelectedArea] = useState<string>('fishing_village');
  const [localNodes, setLocalNodes] = useState<LocalNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Generate local nodes when area is selected
  useEffect(() => {
    if (selectedArea) {
      setLocalNodes(generateLocalNodes(selectedArea));
    }
  }, [selectedArea]);

  const handleAreaSelect = (areaId: string) => {
    const area = GLOBAL_AREAS.find(a => a.id === areaId);
    if (area?.unlocked) {
      setSelectedArea(areaId);
    }
  };

  const handleNodeClick = (node: LocalNode) => {
    if (node.completed) return;

    // Trigger random event based on node type
    switch (node.type) {
      case 'combat':
        changeScreen('combat');
        break;
      case 'event':
        // Could trigger philosophical dilemma
        changeScreen('exploration');
        break;
      case 'treasure':
        // Could give items
        alert(`You found treasure: Ancient Scroll of Wisdom!`);
        break;
      case 'safe':
        alert(`You rest safely and restore 10 health.`);
        break;
    }

    // Mark node as completed
    setLocalNodes(prev => prev.map(n =>
      n.id === node.id ? { ...n, completed: true } : n
    ));
  };

  const getNodeIcon = (type: LocalNode['type'], completed: boolean) => {
    if (completed) return '✅';

    switch (type) {
      case 'safe': return '🏠';
      case 'event': return '❓';
      case 'combat': return '⚔️';
      case 'treasure': return '💎';
      default: return '❓';
    }
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
              {localNodes.map((node) => (
                <LocalNode
                  key={node.id}
                  nodeType={node.type}
                  completed={node.completed}
                  style={{
                    left: `${node.position.x}%`,
                    top: `${node.position.y}%`
                  }}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="icon">
                    {getNodeIcon(node.type, node.completed)}
                  </div>
                  <NodeTooltip show={hoveredNode === node.id}>
                    {node.name}
                  </NodeTooltip>
                </LocalNode>
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
    </Container>
  );
};