import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { EquipmentSlot, Item } from '../../types/game';

const InventoryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.primary};
  gap: ${theme.spacing.lg};
  position: relative;
`;

const EquipmentPanel = styled.div`
  width: 400px;
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.panel};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const PanelTitle = styled.h2`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding-bottom: ${theme.spacing.sm};
  text-align: center;
`;

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: ${theme.spacing.sm};
  flex: 1;
`;

const EquipmentSlotBox = styled.div<{ isEmpty: boolean; gridArea?: string }>`
  background: ${props => props.isEmpty 
    ? theme.colors.background.secondary 
    : 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
  };
  border: 2px solid ${props => props.isEmpty 
    ? theme.colors.border.dark 
    : theme.colors.success
  };
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
  ${props => props.gridArea ? `grid-area: ${props.gridArea};` : ''}

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }

  .slot-label {
    color: ${theme.colors.text.secondary};
    font-size: 0.7rem;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: ${theme.spacing.xs};
  }

  .slot-icon {
    font-size: 1.5rem;
  }

  .item-name {
    color: ${theme.colors.text.accent};
    font-size: 0.75rem;
    text-align: center;
    margin-top: ${theme.spacing.xs};
  }
`;

const InventoryPanel = styled.div`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.panel};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const CategoryTab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.primary : theme.colors.background.secondary};
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.border.dark};
  color: ${props => props.active ? 'white' : theme.colors.text.secondary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.85rem;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${props => props.active ? 'white' : theme.colors.text.accent};
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  flex: 1;
`;

const ItemCard = styled.div`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .item-icon {
    font-size: 2rem;
  }

  .item-name {
    color: ${theme.colors.text.accent};
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
  }

  .item-quantity {
    color: ${theme.colors.text.secondary};
    font-size: 0.75rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${theme.colors.text.secondary};
  font-style: italic;
  text-align: center;
  padding: ${theme.spacing.xl};
`;

export const InventoryScreen = React.memo(() => {
  const { gameState } = useGame();
  const { character } = gameState;
  const [selectedCategory, setSelectedCategory] = useState<string>('equipment');

  // Initialize equipment slots and inventory categories with test data
  const equippedItems = character.equippedItems || {};
  const inventoryCategories = character.inventoryCategories || {
    equipment: [
      { id: 'test-sword', name: 'Iron Sword', description: 'A basic sword', type: 'weapon', value: 10, stackable: false, quantity: 1, icon: '🗡️' }
    ],
    consumables: [
      { id: 'test-potion', name: 'Health Potion', description: 'Restores 50 HP', type: 'consumable', value: 5, stackable: true, quantity: 3, icon: '🧪' }
    ],
    materials: [
      { id: 'test-wood', name: 'Wood', description: 'Crafting material', type: 'crafting', value: 1, stackable: true, quantity: 10, icon: '🪵' }
    ],
    keyItems: [
      { id: 'test-key', name: 'Ancient Key', description: 'Opens ancient doors', type: 'quest', value: 0, stackable: false, quantity: 1, icon: '🔑' }
    ],
    questItems: [
      { id: 'test-letter', name: 'Letter', description: 'A sealed letter', type: 'quest', value: 0, stackable: false, quantity: 1, icon: '📜' }
    ]
  };

  const equipmentSlots: { slot: EquipmentSlot; label: string; icon: string; gridArea?: string }[] = [
    { slot: 'helmet', label: 'Helmet', icon: '⛑️', gridArea: '1 / 2 / 2 / 3' },
    { slot: 'amulet', label: 'Amulet', icon: '📿', gridArea: '2 / 2 / 3 / 3' },
    { slot: 'bodyArmor', label: 'Body Armor', icon: '🛡️', gridArea: '3 / 2 / 4 / 3' },
    { slot: 'cloak', label: 'Cloak', icon: '🧥', gridArea: '4 / 2 / 5 / 3' },
    { slot: 'boots', label: 'Boots', icon: '🥾', gridArea: '5 / 2 / 6 / 3' },
    { slot: 'leftHand', label: 'Left Hand', icon: '🤚', gridArea: '3 / 1 / 4 / 2' },
    { slot: 'rightHand', label: 'Right Hand', icon: '✋', gridArea: '3 / 3 / 4 / 4' },
    { slot: 'gloves', label: 'Gloves', icon: '🧤', gridArea: '4 / 1 / 5 / 2' },
    { slot: 'bracelet', label: 'Bracelet', icon: '📿', gridArea: '4 / 3 / 5 / 4' },
    { slot: 'leftRing', label: 'Left Ring', icon: '💍', gridArea: '5 / 1 / 6 / 2' },
    { slot: 'rightRing', label: 'Right Ring', icon: '💍', gridArea: '5 / 3 / 6 / 4' }
  ];

  const categories = [
    { id: 'equipment', label: 'Equipment', icon: '⚔️' },
    { id: 'consumables', label: 'Consumables', icon: '🧪' },
    { id: 'materials', label: 'Materials', icon: '🪵' },
    { id: 'keyItems', label: 'Key Items', icon: '🔑' },
    { id: 'questItems', label: 'Quest Items', icon: '📜' }
  ];

  const getCurrentItems = (): Item[] => {
    return inventoryCategories[selectedCategory as keyof typeof inventoryCategories] || [];
  };

  return (
    <InventoryContainer>
      <EquipmentPanel>
        <PanelTitle>Equipment</PanelTitle>
        <EquipmentGrid>
          {equipmentSlots.map(({ slot, label, icon, gridArea }) => {
            const equippedItem = equippedItems[slot];
            return (
              <EquipmentSlotBox 
                key={slot} 
                isEmpty={!equippedItem}
                gridArea={gridArea}
              >
                <div className="slot-label">{label}</div>
                <div className="slot-icon">{icon}</div>
                {equippedItem && (
                  <div className="item-name">{equippedItem.name}</div>
                )}
              </EquipmentSlotBox>
            );
          })}
        </EquipmentGrid>
      </EquipmentPanel>

      <InventoryPanel>
        <PanelTitle>Inventory</PanelTitle>
        
        <CategoryTabs>
          {categories.map(({ id, label, icon }) => (
            <CategoryTab
              key={id}
              active={selectedCategory === id}
              onClick={() => setSelectedCategory(id)}
            >
              {icon} {label}
            </CategoryTab>
          ))}
        </CategoryTabs>

        {getCurrentItems().length > 0 ? (
          <ItemGrid>
            {getCurrentItems().map((item) => (
              <ItemCard key={item.id}>
                <div className="item-icon">{item.icon}</div>
                <div className="item-name">{item.name}</div>
                {item.stackable && item.quantity > 1 && (
                  <div className="item-quantity">x{item.quantity}</div>
                )}
              </ItemCard>
            ))}
          </ItemGrid>
        ) : (
          <EmptyState>
            No items in this category
          </EmptyState>
        )}
      </InventoryPanel>
    </InventoryContainer>
  );
});