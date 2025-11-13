import React from 'react';
import styled from '@emotion/styled';
import { theme } from '@styles/theme';

type EventType = 'combat' | 'moral' | 'gathering' | 'rest';

type DebugPanelProps = {
  x: number;
  y: number;
  dragging: boolean;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
  debugMode: boolean;
  setDebugMode: (value: boolean) => void;
  nextEventType: EventType;
  setNextEventType: (value: EventType) => void;
};

const Panel = styled.div<{ x: number; y: number }>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  z-index: 1000;
  min-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  .debug-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.md};
    padding-bottom: ${theme.spacing.sm};
    border-bottom: 1px solid ${theme.colors.border.primary};

    h3 {
      margin: 0;
      color: ${theme.colors.primary};
      font-size: 0.9rem;
      font-weight: 600;
    }

    label {
      display: flex;
      align-items: center;
      gap: ${theme.spacing.sm};
      color: ${theme.colors.text.primary};
      font-size: 0.85rem;
      cursor: pointer;

      input[type="checkbox"] {
        cursor: pointer;
      }
    }
  }

  .debug-control {
    margin-bottom: ${theme.spacing.sm};

    label {
      display: block;
      color: ${theme.colors.text.secondary};
      font-size: 0.8rem;
      margin-bottom: ${theme.spacing.xs};
    }

    select {
      width: 100%;
      background: ${theme.colors.background.secondary};
      color: ${theme.colors.text.primary};
      border: 1px solid ${theme.colors.border.primary};
      border-radius: ${theme.borderRadius.sm};
      padding: ${theme.spacing.sm};
      font-size: 0.85rem;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .debug-info {
    margin-top: ${theme.spacing.sm};
    padding-top: ${theme.spacing.sm};
    border-top: 1px solid ${theme.colors.border.secondary};
    font-size: 0.75rem;
    color: ${theme.colors.text.muted};
  }
`;

export const DebugPanel: React.FC<DebugPanelProps> = ({
  x,
  y,
  dragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  debugMode,
  setDebugMode,
  nextEventType,
  setNextEventType,
}) => {
  return (
    <Panel
      x={x}
      y={y}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
    >
      <div className="debug-header" style={{ cursor: dragging ? 'grabbing' : 'grab' }}>
        <h3>🐛 Debug Mode</h3>
        <label>
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
          />
          Enable
        </label>
      </div>

      <div className="debug-control">
        <label>Next Event Type:</label>
        <select
          value={nextEventType}
          onChange={(e) => setNextEventType(e.target.value as EventType)}
          disabled={!debugMode}
        >
          <option value="combat">Combat</option>
          <option value="moral">Moral Dilemma</option>
          <option value="gathering">Resource Gathering</option>
          <option value="rest">Rest</option>
        </select>
      </div>

      <div className="debug-info">
        {debugMode ? (
          <>Next event will be: <strong>{nextEventType}</strong></>
        ) : (
          <>Events are random</>
        )}
      </div>
    </Panel>
  );
};

export default DebugPanel;
