import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { GameNode } from '../../types/game';

interface TreeNode {
  name: string;
  id: string;
  type: string;
  unlocked: boolean;
  visited: boolean;
  description: string;
  gameNode: GameNode;
  children?: TreeNode[] | undefined;
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

  .resources {
    display: flex;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};

    .resource {
      background: ${theme.colors.background.secondary};
      padding: ${theme.spacing.sm};
      border-radius: ${theme.borderRadius.md};
      color: ${theme.colors.text.primary};
      font-size: 0.875rem;
    }
  }

  .location-info {
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const NodeInfoPanel = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
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
  }
`;

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export const VisxNodeMapScreen: React.FC = () => {
  const { gameState, moveToNode, changeScreen } = useGame();
  const [selectedNode, setSelectedNode] = useState<GameNode | null>(null);
  const [width] = useState(800);
  const [height] = useState(600);

  const currentLocation = gameState.locations[gameState.currentLocation];

  // Transform our node data into visx tree structure
  const treeData = useMemo(() => {
    if (!currentLocation?.nodes) return null;

    // Find the start node or first node
    const startNode = currentLocation.nodes.find(node => node.type === 'start') || currentLocation.nodes[0];
    if (!startNode) return null;

    // Build tree structure from our flat node structure
    const buildTreeNode = (node: GameNode, visited = new Set<string>()): TreeNode => {
      if (visited.has(node.id)) {
        // Return a simple reference to avoid cycles
        return {
          name: node.name,
          id: node.id,
          type: node.type,
          unlocked: node.unlocked,
          visited: node.visited,
          description: node.description,
          gameNode: node,
        };
      }

      visited.add(node.id);

      const children = node.connections
        .map(connectionId => currentLocation.nodes?.find(n => n.id === connectionId))
        .filter((connectedNode): connectedNode is GameNode => !!connectedNode)
        .map(connectedNode => buildTreeNode(connectedNode, new Set(visited)));

      return {
        name: node.name,
        id: node.id,
        type: node.type,
        unlocked: node.unlocked,
        visited: node.visited,
        description: node.description,
        gameNode: node,
        children: children.length > 0 ? children : undefined,
      };
    };

    return buildTreeNode(startNode);
  }, [currentLocation]);

  const handleNodeClick = (nodeData: TreeNode) => {
    setSelectedNode(nodeData.gameNode);
  };

  const handleMoveToNode = (nodeId: string) => {
    moveToNode(nodeId);
    setSelectedNode(null);
  };

  const getNodeColor = (node: TreeNode) => {
    if (!node.unlocked) return theme.colors.gray[600];
    if (node.visited) return theme.colors.success;
    if (node.id === gameState.currentNode) return theme.colors.primary;
    return theme.colors.warning;
  };

  const getNodeSize = (node: TreeNode) => {
    if (node.id === gameState.currentNode) return 16;
    if (node.type === 'boss') return 14;
    return 12;
  };

  if (!treeData) {
    return (
      <Container>
        <Header>
          <h2>No nodes available</h2>
        </Header>
      </Container>
    );
  }

  const xMax = width - defaultMargin.left - defaultMargin.right;
  const yMax = height - defaultMargin.top - defaultMargin.bottom;

  return (
    <Container>
      <Header>
        <h2>{currentLocation?.name || 'Unknown Location'}</h2>
        <div className="resources">
          <div className="resource">Wood: {gameState.inventory.wood || 0}</div>
          <div className="resource">Iron Ore: {gameState.inventory.ironOre || 0}</div>
          <div className="resource">Fish: {gameState.inventory.fish || 0}</div>
        </div>
        <div className="location-info">{currentLocation?.description || 'Unknown location'}</div>
      </Header>

      <MapContainer>
        <svg width={width} height={height}>
          <LinearGradient id="node-gradient" from="#1e293b" to="#0f172a" />
          <rect width={width} height={height} fill="url(#node-gradient)" />

          <Tree
            root={hierarchy(treeData)}
            size={[xMax, yMax]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 2) / a.depth}
          >
            {tree => (
              <Group top={defaultMargin.top} left={defaultMargin.left}>
                {tree.links().map((link, i) => (
                  <line
                    key={i}
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
                    <Group key={i} top={node.y} left={node.x}>
                      <circle
                        r={getNodeSize(nodeData)}
                        fill={getNodeColor(nodeData)}
                        stroke={theme.colors.border.primary}
                        strokeWidth={2}
                        onClick={() => handleNodeClick(nodeData)}
                        style={{ cursor: nodeData.unlocked ? 'pointer' : 'not-allowed' }}
                        opacity={nodeData.unlocked ? 1 : 0.4}
                      />
                      <text
                        dy=".33em"
                        fontSize={10}
                        fontFamily="Arial"
                        textAnchor="middle"
                        fill={theme.colors.text.primary}
                        style={{ pointerEvents: 'none' }}
                      >
                        {nodeData.type === 'boss' ? '👑' :
                         nodeData.type === 'resource' ? '📦' :
                         nodeData.type === 'person' ? '👤' :
                         nodeData.visited ? '✓' : ''}
                      </text>
                      <text
                        dy="2em"
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

        <NodeInfoPanel isVisible={!!selectedNode}>
          {selectedNode && (
            <>
              <h3>{selectedNode.name}</h3>
              <p>{selectedNode.description}</p>
              <div className="actions">
                {selectedNode.unlocked ? (
                  <>
                    <button onClick={() => handleMoveToNode(selectedNode.id)}>
                      {selectedNode.id === gameState.currentNode ? 'Current Location' : 'Travel Here'}
                    </button>
                    {selectedNode.event && (
                      <button onClick={() => console.log('Trigger event:', selectedNode.event)}>
                        {selectedNode.event.description}
                      </button>
                    )}
                  </>
                ) : (
                  <button disabled>Locked</button>
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