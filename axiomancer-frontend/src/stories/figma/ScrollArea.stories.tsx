import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@components/figma/ScrollArea';

const meta = {
  title: 'Axiomance/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea style={{ height: '200px', width: '350px', border: '1px solid #666', borderRadius: '8px', padding: '1rem' }}>
      <div style={{ color: '#FFFFFF' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ marginBottom: '0.5rem' }}>
            Line {i + 1}: This is some scrollable content
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const LongContent: Story = {
  render: () => (
    <ScrollArea style={{ height: '300px', width: '400px', border: '1px solid #666', borderRadius: '8px', padding: '1rem', background: '#1a1a1a' }}>
      <div style={{ color: '#FFFFFF' }}>
        <h2 style={{ color: '#DAA520', marginTop: 0 }}>Long Content Example</h2>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i} style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
            Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const BattleLog: Story = {
  render: () => (
    <ScrollArea style={{ height: '250px', width: '450px', border: '2px solid #DAA520', borderRadius: '8px', padding: '1rem', background: '#000000' }}>
      <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
        <div style={{ color: '#DAA520', fontWeight: 'bold', marginBottom: '1rem' }}>
          === BATTLE LOG ===
        </div>
        {[
          { text: 'Round 1: Combat begins!', color: '#FFFFFF' },
          { text: 'Player uses Mind Attack', color: '#4169E1' },
          { text: 'Deals 25 damage to Enemy', color: '#DC143C' },
          { text: 'Enemy uses Body Defense', color: '#CCCCCC' },
          { text: 'Enemy gains +10 Physical Defense', color: '#228B22' },
          { text: 'Round 2: Player\'s turn', color: '#FFFFFF' },
          { text: 'Player uses Heart Attack', color: '#FF6B35' },
          { text: 'Deals 30 damage to Enemy', color: '#DC143C' },
          { text: 'Enemy uses Mind Attack', color: '#CCCCCC' },
          { text: 'Deals 20 damage to Player', color: '#DC143C' },
          { text: 'Round 3: Player\'s turn', color: '#FFFFFF' },
          { text: 'Player uses Body Attack', color: '#DC143C' },
          { text: 'Critical Hit! Deals 45 damage', color: '#FFD700' },
          { text: 'Enemy defeated!', color: '#228B22' },
          { text: 'Victory! Gained 100 XP', color: '#DAA520' },
        ].map((log, i) => (
          <div key={i} style={{ color: log.color, marginBottom: '0.5rem' }}>
            {log.text}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const ItemList: Story = {
  render: () => (
    <ScrollArea style={{ height: '350px', width: '300px', border: '2px solid #666', borderRadius: '8px', padding: '0.5rem', background: '#2a2a2a' }}>
      <div>
        {[
          { icon: '⚔️', name: 'Steel Sword', rarity: 'Common' },
          { icon: '🛡️', name: 'Iron Shield', rarity: 'Common' },
          { icon: '🎩', name: 'Wizard Hat', rarity: 'Rare' },
          { icon: '👕', name: 'Leather Armor', rarity: 'Common' },
          { icon: '👢', name: 'Swift Boots', rarity: 'Uncommon' },
          { icon: '💍', name: 'Ring of Power', rarity: 'Epic' },
          { icon: '🔮', name: 'Crystal Orb', rarity: 'Legendary' },
          { icon: '🏹', name: 'Elven Bow', rarity: 'Rare' },
          { icon: '🪓', name: 'Battle Axe', rarity: 'Uncommon' },
          { icon: '🔨', name: 'Warhammer', rarity: 'Common' },
          { icon: '💎', name: 'Diamond', rarity: 'Epic' },
          { icon: '🔑', name: 'Master Key', rarity: 'Rare' },
          { icon: '📜', name: 'Ancient Scroll', rarity: 'Legendary' },
          { icon: '⚗️', name: 'Health Potion', rarity: 'Common' },
        ].map((item, i) => {
          const rarityColor = {
            Common: '#CCCCCC',
            Uncommon: '#228B22',
            Rare: '#4169E1',
            Epic: '#9B59B6',
            Legendary: '#FFD700'
          }[item.rarity];

          return (
            <div 
              key={i}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: '#1a1a1a',
                borderRadius: '6px',
                border: `1px solid ${rarityColor}`,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: rarityColor, fontSize: '0.75rem' }}>{item.rarity}</div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  ),
};

export const ChatMessages: Story = {
  render: () => (
    <ScrollArea style={{ height: '400px', width: '350px', border: '1px solid #666', borderRadius: '8px', padding: '1rem', background: '#000000' }}>
      <div>
        {[
          { sender: 'Player', message: 'Hello, are you ready for battle?', timestamp: '10:30' },
          { sender: 'NPC', message: 'Indeed! May the best philosopher win.', timestamp: '10:31' },
          { sender: 'Player', message: 'I shall use the power of logic!', timestamp: '10:32' },
          { sender: 'NPC', message: 'And I, the strength of rhetoric!', timestamp: '10:33' },
          { sender: 'System', message: 'Combat has begun!', timestamp: '10:34' },
          { sender: 'Player', message: 'Mind Attack!', timestamp: '10:35' },
          { sender: 'NPC', message: 'Body Defense!', timestamp: '10:36' },
        ].map((msg, i) => {
          const isPlayer = msg.sender === 'Player';
          const isSystem = msg.sender === 'System';
          
          return (
            <div 
              key={i}
              style={{
                marginBottom: '1rem',
                textAlign: isPlayer ? 'right' : isSystem ? 'center' : 'left'
              }}
            >
              <div style={{
                display: 'inline-block',
                padding: '0.75rem',
                borderRadius: '8px',
                background: isSystem ? '#2a2a2a' : isPlayer ? '#1e3a8a' : '#1a4d2e',
                maxWidth: '80%',
                textAlign: 'left'
              }}>
                <div style={{ color: '#DAA520', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {msg.sender}
                </div>
                <div style={{ color: '#FFFFFF', marginBottom: '0.25rem' }}>
                  {msg.message}
                </div>
                <div style={{ color: '#888888', fontSize: '0.7rem' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  ),
};
