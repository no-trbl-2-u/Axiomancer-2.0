import type { Meta, StoryObj } from '@storybook/react';
import { DebugPanel } from '@components/game/DebugPanel';
import { useState } from 'react';

const meta = {
  title: 'Axiomance/DebugPanel',
  component: DebugPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DebugPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [debugMode, setDebugMode] = useState(false);
    const [nextEventType, setNextEventType] = useState<'combat' | 'moral' | 'gathering' | 'rest'>('combat');
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
      setDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (dragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
        <DebugPanel
          x={position.x}
          y={position.y}
          dragging={dragging}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          debugMode={debugMode}
          setDebugMode={setDebugMode}
          nextEventType={nextEventType}
          setNextEventType={setNextEventType}
        />
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: '#888',
          textAlign: 'center'
        }}>
          <p>Drag the debug panel around</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Current Event Type: {debugMode ? nextEventType : 'Random'}
          </p>
        </div>
      </div>
    );
  },
};

export const DebugModeEnabled: Story = {
  render: () => {
    const [debugMode, setDebugMode] = useState(true);
    const [nextEventType, setNextEventType] = useState<'combat' | 'moral' | 'gathering' | 'rest'>('combat');

    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
        <DebugPanel
          x={50}
          y={50}
          dragging={false}
          onMouseDown={() => {}}
          onMouseMove={() => {}}
          onMouseUp={() => {}}
          onMouseLeave={() => {}}
          debugMode={debugMode}
          setDebugMode={setDebugMode}
          nextEventType={nextEventType}
          setNextEventType={setNextEventType}
        />
      </div>
    );
  },
};

export const DebugModeDisabled: Story = {
  render: () => {
    const [debugMode, setDebugMode] = useState(false);
    const [nextEventType, setNextEventType] = useState<'combat' | 'moral' | 'gathering' | 'rest'>('combat');

    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
        <DebugPanel
          x={50}
          y={50}
          dragging={false}
          onMouseDown={() => {}}
          onMouseMove={() => {}}
          onMouseUp={() => {}}
          onMouseLeave={() => {}}
          debugMode={debugMode}
          setDebugMode={setDebugMode}
          nextEventType={nextEventType}
          setNextEventType={setNextEventType}
        />
      </div>
    );
  },
};

export const AllEventTypes: Story = {
  render: () => {
    const eventTypes: Array<'combat' | 'moral' | 'gathering' | 'rest'> = ['combat', 'moral', 'gathering', 'rest'];
    
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
        {eventTypes.map((eventType, index) => {
          const [debugMode, setDebugMode] = useState(true);
          const [selectedEventType, setSelectedEventType] = useState(eventType);

          return (
            <div key={eventType} style={{ position: 'absolute', left: 50 + (index * 280), top: 50 }}>
              <DebugPanel
                x={0}
                y={0}
                dragging={false}
                onMouseDown={() => {}}
                onMouseMove={() => {}}
                onMouseUp={() => {}}
                onMouseLeave={() => {}}
                debugMode={debugMode}
                setDebugMode={setDebugMode}
                nextEventType={selectedEventType}
                setNextEventType={setSelectedEventType}
              />
            </div>
          );
        })}
      </div>
    );
  },
};
