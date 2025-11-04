import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { EquipmentSlot, Item, Equipment, EquipmentType, ItemType } from '../../types/equipment';
import { equipmentItems } from '../../utils/equipmentItems';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container, Grid, EmptyState } from '../shared/Grid';
import { Panel } from '../shared/Panel';
import { Card } from '../shared/Card';
import { TabsContainer, Tab } from '../shared/Tab';

const TooltipOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  display: ${props => props.show ? 'flex' : 'none'};
  background: ${theme.colors.background.modal};
  border: 3px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  min-width: 400px;
  max-width: 500px;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  gap: ${theme.spacing.md};

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg,
      ${theme.colors.primary}22 0%,
      ${theme.colors.accent}22 50%,
      ${theme.colors.primary}22 100%
    );
    border-radius: ${theme.borderRadius.lg};
    z-index: -1;
  }
`;

const TooltipLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  flex: 1;
`;

const TooltipPortrait = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2));
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  margin-bottom: ${theme.spacing.sm};
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const TooltipName = styled.div`
  color: ${theme.colors.text.accent};
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing.xs};
`;

const TooltipDescription = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.85rem;
  line-height: 1.4;
  font-style: italic;
`;

const TooltipRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  min-width: 160px;
  padding-left: ${theme.spacing.md};
  border-left: 2px solid ${theme.colors.border.dark};
`;

const TooltipSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const TooltipSectionTitle = styled.div`
  color: ${theme.colors.text.accent};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing.xs};
  border-bottom: 1px solid ${theme.colors.border.dark};
  padding-bottom: ${theme.spacing.xs};
`;

const TooltipStat = styled.div<{ positive?: boolean }>`
  color: ${props => props.positive ? theme.colors.success : theme.colors.text.primary};
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.sm};

  .stat-name {
    color: ${theme.colors.text.secondary};
  }

  .stat-value {
    font-weight: 600;
    color: ${props => props.positive ? theme.colors.success : theme.colors.text.accent};
  }
`;

const TooltipType = styled.div`
  display: inline-block;
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.accent};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid ${theme.colors.border.primary};
  margin-top: ${theme.spacing.xs};
`;

const TooltipSpecial = styled.div`
  color: ${theme.colors.info};
  font-size: 0.8rem;
  font-style: italic;
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background: rgba(59, 130, 246, 0.1);
  border-radius: ${theme.borderRadius.sm};
  border-left: 3px solid ${theme.colors.info};
`;

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.md};
  flex: 1;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.sm};
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.sm};
  }
`;

export const InventoryScreen = React.memo(() => {
  // Zustand store - selective subscriptions
  const character = useGameStore(state => state.gameState.character);
  const updateCharacter = useGameStore(state => state.updateCharacter);
  const equipItemToSlot = useGameStore(state => state.equipItem);
  const unequipItemFromSlot = useGameStore(state => state.unequipItem);

  const [selectedCategory, setSelectedCategory] = useState<string>('equipment');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ item: Item | Equipment, x: number, y: number } | null>(null);

  // Initialize equipment slots and inventory categories with test data
  const equippedItems = character.equippedItems || {};
  const inventoryCategories = character.inventoryCategories || {
    // REMOVE: These are hard-coded test items for the inventory
    equipment: [
      { id: 'broken_compass', name: 'Broken Compass of Lost Direction', description: 'A compass that has lost its way', type: 'weapon' as const, value: 10, stackable: false, quantity: 1, icon: '🧭' },
      { id: 'mirror_of_self_reflection', name: 'Mirror of Self-Reflection', description: 'Forces self-examination', type: 'weapon' as const, value: 15, stackable: false, quantity: 1, icon: '🪞' },
      { id: 'cloak_of_forgotten_memories', name: 'Cloak of Forgotten Memories', description: 'Memories fade when worn', type: 'armor' as const, value: 20, stackable: false, quantity: 1, icon: '🧥' },
      { id: 'mask_of_false_identity', name: 'Mask of False Identity', description: 'Hide your true self', type: 'armor' as const, value: 25, stackable: false, quantity: 1, icon: '🎭' }
    ],
    consumables: [
      { id: 'test-potion', name: 'Health Potion', description: 'Restores 50 HP', type: 'consumable' as const, value: 5, stackable: false, quantity: 3, icon: '🧪' }
    ],
    materials: [
      { id: 'test-wood', name: 'Wood', description: 'Crafting material', type: 'crafting' as const, value: 1, stackable: true, quantity: 10, icon: '🪵' }
    ],
    keyItems: [
      { id: 'test-key', name: 'Ancient Key', description: 'Opens ancient doors', type: 'quest' as const, value: 0, stackable: false, quantity: 1, icon: '🔑' }
    ],
    questItems: [
      { id: 'test-letter', name: 'Letter', description: 'A sealed letter', type: 'quest' as const, value: 0, stackable: false, quantity: 1, icon: '📜' }
    ]
  };

  const equipmentSlots: { slot: EquipmentSlot; label: string; icon: string; gridArea?: string }[] = [
    { slot: 'helmet', label: 'Helmet', icon: '⛑️', gridArea: '1 / 2 / 2 / 3' },
    { slot: 'amulet', label: 'Amulet', icon: '📿', gridArea: '1 / 3 / 2 / 4' },
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

  const getCompatibleSlots = (item: Item): EquipmentSlot[] => {
    switch (item.type) {
      case 'weapon':
        return ['leftHand', 'rightHand'];
      case 'armor':
        return ['helmet', 'bodyArmor', 'gloves', 'boots'];
      case 'misc':
        const lowerName = item.name.toLowerCase();
        if (lowerName.includes('ring')) return ['leftRing', 'rightRing'];
        else if (lowerName.includes('amulet')) return ['amulet'];
        else if (lowerName.includes('bracelet')) return ['bracelet'];
        else if (lowerName.includes('cloak')) return ['cloak'];
        return [];
      default:
        return [];
    }
  };

  const canEquipToSlot = (item: Item, slot: EquipmentSlot): boolean => {
    return getCompatibleSlots(item).includes(slot);
  };

  const equipItem = (item: Item, slot: EquipmentSlot) => {
    if (!canEquipToSlot(item, slot)) return;

    const existingItem = equippedItems[slot];
    if (existingItem) {
      const itemForInventory: Item = {
        id: existingItem.id,
        name: existingItem.name,
        description: existingItem.special || '',
        type: existingItem.type === 'accessory' ? 'misc' : existingItem.type as ItemType,
        value: 0,
        stackable: false,
        quantity: 1,
        icon: existingItem.icon
      };

      const category = existingItem.type === 'weapon' ? 'equipment' :
        existingItem.type === 'armor' ? 'equipment' : 'consumables';

      if (inventoryCategories[category as keyof typeof inventoryCategories]) {
        (inventoryCategories[category as keyof typeof inventoryCategories] as Item[]).push(itemForInventory);
      }
    }

    const equipmentFromDb = equipmentItems[item.id];
    const equipmentItem: Equipment = equipmentFromDb || {
      id: item.id,
      name: item.name,
      type: item.type === 'misc' ? 'accessory' : item.type as EquipmentType,
      stats: {},
      icon: item.icon
    };

    console.log(`⚔️ Equipping ${equipmentItem.name} with stats:`, equipmentItem.stats);

    const category = item.type === 'weapon' ? 'equipment' :
      item.type === 'armor' ? 'equipment' : 'consumables';
    const categoryItems = inventoryCategories[category as keyof typeof inventoryCategories] as Item[];
    const itemIndex = categoryItems.findIndex(i => i.id === item.id);
    if (itemIndex >= 0) {
      categoryItems.splice(itemIndex, 1);
    }

    equipItemToSlot(slot, equipmentItem);
    updateCharacter({ inventoryCategories });
  };

  const unequipItem = (slot: EquipmentSlot) => {
    const item = equippedItems[slot];
    if (!item) return;

    const itemForInventory: Item = {
      id: item.id,
      name: item.name,
      description: item.special || '',
      type: item.type === 'accessory' ? 'misc' : item.type as ItemType,
      value: 0,
      stackable: false,
      quantity: 1,
      icon: item.icon
    };

    const category = item.type === 'weapon' ? 'equipment' :
      item.type === 'armor' ? 'equipment' : 'consumables';

    if (inventoryCategories[category as keyof typeof inventoryCategories]) {
      (inventoryCategories[category as keyof typeof inventoryCategories] as Item[]).push(itemForInventory);
    }

    unequipItemFromSlot(slot);
    updateCharacter({ inventoryCategories });
  };

  const renderTooltip = () => {
    if (!hoveredItem) return null;

    const item = hoveredItem.item;
    const equipmentData = equipmentItems[item.id];
    const equipment: Equipment = equipmentData || (item as Equipment);

    return (
      <TooltipOverlay
        show={true}
        style={{
          left: `${hoveredItem.x + 20}px`,
          top: `${hoveredItem.y}px`,
        }}
      >
        <TooltipLeft>
          <TooltipPortrait>{item.icon}</TooltipPortrait>
          <TooltipName>{item.name}</TooltipName>
          <TooltipDescription>
            {equipment.special || ('description' in item ? (item as Item).description : 'A mysterious item')}
          </TooltipDescription>
          <TooltipType>{equipment.type}</TooltipType>
        </TooltipLeft>

        <TooltipRight>
          <TooltipSection>
            <TooltipSectionTitle>Stats</TooltipSectionTitle>
            {equipment.stats?.heart && (
              <TooltipStat positive={equipment.stats.heart > 0}>
                <span className="stat-name">❤️ Heart</span>
                <span className="stat-value">+{equipment.stats.heart}</span>
              </TooltipStat>
            )}
            {equipment.stats?.body && (
              <TooltipStat positive={equipment.stats.body > 0}>
                <span className="stat-name">💪 Body</span>
                <span className="stat-value">+{equipment.stats.body}</span>
              </TooltipStat>
            )}
            {equipment.stats?.mind && (
              <TooltipStat positive={equipment.stats.mind > 0}>
                <span className="stat-name">🧠 Mind</span>
                <span className="stat-value">+{equipment.stats.mind}</span>
              </TooltipStat>
            )}
            {(!equipment.stats?.heart && !equipment.stats?.body && !equipment.stats?.mind) && (
              <TooltipStat>
                <span className="stat-name">No stat bonuses</span>
              </TooltipStat>
            )}
          </TooltipSection>

          {equipment.special && (
            <TooltipSpecial>
              ✨ {equipment.special}
            </TooltipSpecial>
          )}
        </TooltipRight>
      </TooltipOverlay>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container variant="game" padding="xl">
        <Panel variant="equipment" title="Equipment">
          <EquipmentGrid>
            {equipmentSlots.map(({ slot, label, icon, gridArea }) => {
              const equippedItem = equippedItems[slot];
              return (
                <Card
                  key={slot}
                  variant="equipment"
                  isEmpty={!equippedItem}
                  {...(gridArea && { gridArea })}
                  onDoubleClick={() => {
                    if (equippedItem) {
                      unequipItem(slot);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (equippedItem) {
                      setHoveredItem({
                        item: equippedItem,
                        x: e.clientX,
                        y: e.clientY
                      });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (equippedItem) {
                      setHoveredItem({
                        item: equippedItem,
                        x: e.clientX,
                        y: e.clientY
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={equippedItem ? `Double-click to unequip ${equippedItem.name}` : 'Drag equipment here or double-click equipment to equip'}
                >
                  <div className="slot-label" style={{ color: theme.colors.text.secondary, fontSize: '0.7rem', textAlign: 'center', textTransform: 'uppercase', marginBottom: theme.spacing.xs }}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <div className="slot-icon" style={{ fontSize: '1.5rem' }}>{equippedItem ? equippedItem.icon : icon}</div>
                  </div>
                </Card>
              );
            })}
          </EquipmentGrid>
        </Panel>

        <Panel variant="inventory" title="Inventory" fullHeight scrollable>
          <TabsContainer variant="category" gap="sm" wrap>
            {categories.map(({ id, label, icon }) => (
              <Tab
                key={id}
                active={selectedCategory === id}
                onClick={() => setSelectedCategory(id)}
                variant="category"
              >
                {icon} {label}
              </Tab>
            ))}
          </TabsContainer>

          {getCurrentItems().length > 0 ? (
            <Grid variant="item" gap="sm">
              {getCurrentItems().map((item) => {
                const compatibleSlots = getCompatibleSlots(item);
                const canEquip = compatibleSlots.length > 0;

                return (
                  <Card
                    key={item.id}
                    variant="item"
                    isSelected={selectedItem?.id === item.id}
                    onClick={() => canEquip ? setSelectedItem(item) : null}
                    onDoubleClick={() => {
                      if (canEquip && compatibleSlots.length > 0) {
                        const firstAvailableSlot = compatibleSlots.find(slot => !equippedItems[slot]);
                        if (firstAvailableSlot) {
                          equipItem(item, firstAvailableSlot);
                          setSelectedItem(null);
                        } else {
                          equipItem(item, compatibleSlots[0]!);
                          setSelectedItem(null);
                        }
                      }
                    }}
                    onMouseEnter={(e) => {
                      setHoveredItem({
                        item,
                        x: e.clientX,
                        y: e.clientY
                      });
                    }}
                    onMouseMove={(e) => {
                      setHoveredItem({
                        item,
                        x: e.clientX,
                        y: e.clientY
                      });
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                    disabled={!canEquip}
                    title={canEquip ? `Double-click to equip to ${compatibleSlots[0]}` : 'Cannot be equipped'}
                  >
                    <div className="item-icon" style={{ fontSize: '2rem' }}>{item.icon}</div>
                    {item.stackable && item.quantity > 1 && (
                      <div className="item-quantity" style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '4px',
                        background: theme.colors.background.primary,
                        color: theme.colors.text.accent,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 4px',
                        borderRadius: theme.borderRadius.sm,
                        border: `1px solid ${theme.colors.border.primary}`
                      }}>x{item.quantity}</div>
                    )}
                  </Card>
                );
              })}
            </Grid>
          ) : (
            <EmptyState variant="inventory">
              No items in this category
            </EmptyState>
          )}
        </Panel>
      </Container>
      {renderTooltip()}
    </DndProvider>
  );
});
