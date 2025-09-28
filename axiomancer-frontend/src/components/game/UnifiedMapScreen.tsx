import React, { useMemo, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { GlobalMapNode, ExplorationNode } from '../../types/game';
import { generateRandomExplorationNodes } from '../../utils/explorationGenerator';

interface TreeNode {
  name: string;
  id: string;
  type: string;
  unlocked: boolean;
  completed: boolean;
  description: string;
  energyCost?: number;
  nodeData: GlobalMapNode | ExplorationNode;
  children?: TreeNode[];
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`;

const Header = styled.div`
  background: ${theme.colors.background.panel};
  padding: ${theme.spacing.lg};
  border-bottom: 2px solid ${theme.colors.border.primary};
  z-index: 10;

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.md} 0;
  }

  .controls {
    display: flex;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
    align-items: center;

    .energy-display {
      background: ${theme.colors.background.secondary};
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      border-radius: ${theme.borderRadius.md};
      color: ${theme.colors.text.primary};
      font-weight: 600;
      border: 2px solid ${theme.colors.border.secondary};

      .energy-bar {
        width: 100px;
        height: 8px;
        background: ${theme.colors.background.primary};
        border-radius: 4px;
        margin-top: 4px;
        overflow: hidden;

        .energy-fill {
          height: 100%;
          background: linear-gradient(90deg, ${theme.colors.success} 0%, ${theme.colors.warning} 70%, ${theme.colors.danger} 100%);
          transition: width 0.3s ease;
        }
      }
    }

    .guardian-status {
      background: ${theme.colors.background.secondary};
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      border-radius: ${theme.borderRadius.md};
      color: ${theme.colors.text.primary};
      border: 2px solid ${theme.colors.border.secondary};
    }
  }

  .map-info {
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
  }
`;

const MapToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.primary : theme.colors.background.secondary};
  color: ${props => props.active ? theme.colors.dark : theme.colors.text.primary};
  border: 2px solid ${theme.colors.border.primary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  min-height: 44px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? theme.colors.accent : theme.colors.primary};
    color: ${theme.colors.dark};
  }
`;

const MapContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const GlobalMapSection = styled.div`
  flex: 1;
  position: relative;
  border-right: 2px solid ${theme.colors.border.primary};

  h3 {
    position: absolute;
    top: 10px;
    left: 10px;
    color: ${theme.colors.text.accent};
    background: ${theme.colors.background.panel};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    margin: 0;
    z-index: 5;
  }
`;

const ExplorationSection = styled.div`
  flex: 1;
  position: relative;

  h3 {
    position: absolute;
    top: 10px;
    left: 10px;
    color: ${theme.colors.text.accent};
    background: ${theme.colors.background.panel};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    margin: 0;
    z-index: 5;
  }

  .no-exploration {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${theme.colors.text.secondary};
    text-align: center;
    padding: ${theme.spacing.xl};

    .instruction {
      background: ${theme.colors.background.panel};
      padding: ${theme.spacing.lg};
      border-radius: ${theme.borderRadius.lg};
      border: 2px solid ${theme.colors.border.primary};
    }
  }
`;

const NodeInfoPanel = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  z-index: 5;
  transform: translateX(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;

  h3 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.md} 0;
  }

  p {
    color: ${theme.colors.text.secondary};
    margin: 0 0 ${theme.spacing.md} 0;
    line-height: 1.4;
  }

  .energy-cost {
    color: ${theme.colors.warning};
    font-weight: 600;
    margin-bottom: ${theme.spacing.md};
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }

  button {
    background: ${theme.colors.primary};
    color: white;
    border: none;
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    font-weight: 600;
    min-height: 44px;

    &:hover {
      background: ${theme.colors.accent};
    }

    &:disabled {
      background: ${theme.colors.background.secondary};
      color: ${theme.colors.text.muted};
      cursor: not-allowed;
    }

    &.explore-button {
      background: ${theme.colors.success};
      &:hover {
        background: ${theme.colors.warning};
      }
    }
  }
`;

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export const UnifiedMapScreen: React.FC = () => {
  const { gameState, moveToNode, changeScreen } = useGame();
  const [selectedNode, setSelectedNode] = useState<GlobalMapNode | ExplorationNode | null>(null);
  const [explorationNodes, setExplorationNodes] = useState<ExplorationNode[]>([]);
  const [width] = useState(400);
  const [height] = useState(600);

  // Create initial global map structure
  const globalMapData = useMemo(() => {
    const fishingVillage: GlobalMapNode = {
      id: 'fishing_village',
      name: 'Small Fishing Village',
      description: 'A peaceful town by the water where your philosophical journey begins.',
      position: { x: 100, y: 300 },
      unlocked: true,
      completed: gameState.story?.talkedToGuardian || false,
      connections: ['forest_edge'],
      theme: 'peaceful'
    };

    const forestEdge: GlobalMapNode = {
      id: 'forest_edge',
      name: 'Forest Edge',
      description: 'Where the familiar village meets the mysterious woods.',
      position: { x: 300, y: 200 },
      unlocked: fishingVillage.completed,
      completed: false,
      connections: ['ancient_grove'],
      requiredCompletions: ['fishing_village'],
      theme: 'mysterious'
    };

    return {
      fishing_village: fishingVillage,
      forest_edge: forestEdge
    };
  }, [gameState.story?.talkedToGuardian]);

  // Generate exploration nodes when guardian conversation is completed
  useEffect(() => {
    if (gameState.story?.talkedToGuardian && explorationNodes.length === 0) {
      const randomCount = Math.floor(Math.random() * 5) + 1; // 1-5 nodes
      const newNodes = generateRandomExplorationNodes('fishing_village', randomCount);
      setExplorationNodes(newNodes);
    }
  }, [gameState.story?.talkedToGuardian, explorationNodes.length]);

  // Transform global map data for visx
  const globalTreeData = useMemo(() => {
    const rootNode = globalMapData.fishing_village;
    if (!rootNode) return null;

    const buildGlobalTreeNode = (node: GlobalMapNode, visited = new Set<string>()): TreeNode => {
      if (visited.has(node.id)) {
        return {
          name: node.name,
          id: node.id,
          type: 'global',
          unlocked: node.unlocked,
          completed: node.completed,
          description: node.description,
          nodeData: node,
        };
      }

      visited.add(node.id);
      const children = node.connections
        .map(connId => globalMapData[connId])
        .filter((connectedNode): connectedNode is GlobalMapNode => !!connectedNode)
        .map(connectedNode => buildGlobalTreeNode(connectedNode, new Set(visited)));

      return {
        name: node.name,
        id: node.id,
        type: 'global',
        unlocked: node.unlocked,
        completed: node.completed,
        description: node.description,
        nodeData: node,
        children: children.length > 0 ? children : undefined,
      };
    };

    return buildGlobalTreeNode(rootNode);
  }, [globalMapData]);

  // Transform exploration data for visx
  const explorationTreeData = useMemo(() => {
    if (explorationNodes.length === 0) return null;

    const rootExploration = explorationNodes[0];
    return {
      name: rootExploration.title,
      id: rootExploration.id,
      type: rootExploration.type,
      unlocked: true,
      completed: rootExploration.completed,
      description: rootExploration.description,
      energyCost: rootExploration.energyCost,
      nodeData: rootExploration,
      children: explorationNodes.slice(1).map(node => ({
        name: node.title,
        id: node.id,
        type: node.type,
        unlocked: true,
        completed: node.completed,
        description: node.description,
        energyCost: node.energyCost,
        nodeData: node,
      }))
    };
  }, [explorationNodes]);

  const handleNodeClick = (nodeData: TreeNode) => {
    setSelectedNode(nodeData.nodeData);
  };

  const getNodeColor = (node: TreeNode, isGlobal: boolean = false) => {
    if (!node.unlocked) return theme.colors.gray[600];
    if (node.completed) return theme.colors.success;
    if (isGlobal && node.id === gameState.currentGlobalNode) return theme.colors.primary;
    if (!isGlobal && node.id === gameState.currentExplorationNode) return theme.colors.primary;
    return theme.colors.warning;
  };

  const getNodeSize = (node: TreeNode, isGlobal: boolean = false) => {
    if (isGlobal) return node.completed ? 18 : 16;
    return node.completed ? 14 : 12;
  };

  const getNodeIcon = (node: TreeNode, isGlobal: boolean = false) => {
    if (node.completed) return '✓';
    if (isGlobal) return '🏛️';

    const exploreNode = node.nodeData as ExplorationNode;
    switch (exploreNode.type) {
      case 'dialogue': return '💬';
      case 'combat': return '⚔️';
      case 'discovery': return '🔍';
      default: return '❓';
    }
  };

  const handleGuardianTalk = () => {
    // TODO: Implement guardian conversation logic
    console.log('Talking to guardian...');
  };

  const xMax = width - defaultMargin.left - defaultMargin.right;
  const yMax = height - defaultMargin.top - defaultMargin.bottom;
  const energyPercentage = (gameState.mapEnergy || 10) / (gameState.maxMapEnergy || 10) * 100;

  return (
    <Container>
      <Header>
        <h2>World Map</h2>
        <div className="controls">
          <div className="energy-display">
            Energy: {gameState.mapEnergy || 10}/{gameState.maxMapEnergy || 10}
            <div className="energy-bar">
              <div className="energy-fill" style={{ width: `${energyPercentage}%` }} />
            </div>
          </div>
          <div className="guardian-status">
            {gameState.story?.talkedToGuardian ?
              'Guardian conversation completed ✓' :
              'Talk to your guardian to unlock exploration'
            }
          </div>
        </div>
        <div className="map-info">
          Global map shows your overall progress. Exploration appears after talking to your guardian.
        </div>
      </Header>

      <MapContainer>
        {/* Global Map Section */}
        <GlobalMapSection>
          <h3>Global Map</h3>
          {globalTreeData && (
            <svg width={width} height={height}>
              <LinearGradient id="global-gradient" from="#1e293b" to="#0f172a" />
              <rect width={width} height={height} fill="url(#global-gradient)" />

              <Tree
                root={hierarchy(globalTreeData)}
                size={[xMax, yMax]}
                separation={(a, b) => (a.parent === b.parent ? 1 : 2) / a.depth}
              >
                {tree => (
                  <Group top={defaultMargin.top} left={defaultMargin.left}>
                    {tree.links().map((link, i) => (
                      <line
                        key={`global-link-${i}`}
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}
                        stroke={theme.colors.border.secondary}
                        strokeWidth={2}
                        strokeOpacity={0.6}
                      />
                    ))}
                    {tree.descendants().map((node, i) => {
                      const nodeData = node.data as TreeNode;
                      return (
                        <Group key={`global-node-${i}`} top={node.y} left={node.x}>
                          <circle
                            r={getNodeSize(nodeData, true)}
                            fill={getNodeColor(nodeData, true)}
                            stroke={theme.colors.border.primary}
                            strokeWidth={2}
                            onClick={() => handleNodeClick(nodeData)}
                            style={{ cursor: nodeData.unlocked ? 'pointer' : 'not-allowed' }}
                            opacity={nodeData.unlocked ? 1 : 0.4}
                          />
                          <text
                            dy=".33em"
                            fontSize={12}
                            fontFamily="Arial"
                            textAnchor="middle"
                            fill={theme.colors.text.primary}
                            style={{ pointerEvents: 'none' }}
                          >
                            {getNodeIcon(nodeData, true)}
                          </text>
                          <text
                            dy="2.2em"
                            fontSize={9}
                            fontFamily="Arial"
                            textAnchor="middle"
                            fill={theme.colors.text.secondary}
                            style={{ pointerEvents: 'none' }}
                          >
                            {nodeData.name}
                          </text>
                        </Group>
                      );
                    })}
                  </Group>
                )}
              </Tree>
            </svg>
          )}
        </GlobalMapSection>

        {/* Exploration Section */}
        <ExplorationSection>
          <h3>Exploration</h3>
          {!gameState.story?.talkedToGuardian ? (
            <div className="no-exploration">
              <div className="instruction">
                <h4>Talk to Your Guardian</h4>
                <p>Visit your guardian to begin your journey and unlock exploration opportunities.</p>
                <button onClick={handleGuardianTalk}>
                  Talk to Guardian
                </button>
              </div>
            </div>
          ) : explorationTreeData ? (
            <svg width={width} height={height}>
              <LinearGradient id="exploration-gradient" from="#0f172a" to="#1e293b" />
              <rect width={width} height={height} fill="url(#exploration-gradient)" />

              <Tree
                root={hierarchy(explorationTreeData)}
                size={[xMax, yMax]}
                separation={(a, b) => (a.parent === b.parent ? 1 : 2) / a.depth}
              >
                {tree => (
                  <Group top={defaultMargin.top} left={defaultMargin.left}>
                    {tree.links().map((link, i) => (
                      <line
                        key={`exploration-link-${i}`}
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}
                        stroke={theme.colors.border.secondary}
                        strokeWidth={1}
                        strokeOpacity={0.4}
                      />
                    ))}
                    {tree.descendants().map((node, i) => {
                      const nodeData = node.data as TreeNode;
                      return (
                        <Group key={`exploration-node-${i}`} top={node.y} left={node.x}>
                          <circle
                            r={getNodeSize(nodeData, false)}
                            fill={getNodeColor(nodeData, false)}
                            stroke={theme.colors.border.primary}
                            strokeWidth={1}
                            onClick={() => handleNodeClick(nodeData)}
                            style={{ cursor: 'pointer' }}
                          />
                          <text
                            dy=".33em"
                            fontSize={10}
                            fontFamily="Arial"
                            textAnchor="middle"
                            fill={theme.colors.text.primary}
                            style={{ pointerEvents: 'none' }}
                          >
                            {getNodeIcon(nodeData, false)}
                          </text>
                          <text
                            dy="2em"
                            fontSize={8}
                            fontFamily="Arial"
                            textAnchor="middle"
                            fill={theme.colors.text.secondary}
                            style={{ pointerEvents: 'none' }}
                          >
                            {nodeData.name}
                          </text>
                        </Group>
                      );
                    })}
                  </Group>
                )}
              </Tree>
            </svg>
          ) : (
            <div className="no-exploration">
              <div className="instruction">
                <p>Generating exploration opportunities...</p>
              </div>
            </div>
          )}
        </ExplorationSection>

        <NodeInfoPanel isVisible={!!selectedNode}>
          {selectedNode && (
            <>
              <h3>{'name' in selectedNode ? selectedNode.name : selectedNode.title}</h3>
              <p>{selectedNode.description}</p>

              {'energyCost' in selectedNode && selectedNode.energyCost && (
                <div className="energy-cost">
                  Energy Cost: {selectedNode.energyCost}
                </div>
              )}

              <div className="actions">
                {'name' in selectedNode ? (
                  // Global node
                  <>
                    {selectedNode.unlocked ? (
                      <button
                        className="explore-button"
                        onClick={() => {
                          console.log('Exploring global node:', selectedNode);
                          setSelectedNode(null);
                        }}
                      >
                        Current Area
                      </button>
                    ) : (
                      <button disabled>
                        Locked - Complete current area first
                      </button>
                    )}
                  </>
                ) : (
                  // Exploration node
                  <>
                    <button onClick={() => {
                      console.log('Starting exploration node:', selectedNode);
                      setSelectedNode(null);
                    }}>
                      Begin {selectedNode.type === 'dialogue' ? 'Conversation' :
                             selectedNode.type === 'combat' ? 'Encounter' : 'Discovery'}
                    </button>
                  </>
                )}
                <button onClick={() => setSelectedNode(null)}>Close</button>
              </div>
            </>
          )}
        </NodeInfoPanel>
      </MapContainer>
    </Container>
  );
};