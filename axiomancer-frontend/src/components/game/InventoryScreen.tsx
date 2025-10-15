import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { EquipmentSlot, Item, Equipment, EquipmentType, ItemType } from '../../types/game';
import { equipmentItems } from '../../utils/equipmentItems';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const InventoryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.primary};
  gap: ${theme.spacing.lg};
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
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

  @media (max-width: 768px) {
    width: 100%;
    padding: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
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

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  flex: 1;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xs};
  }
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

    @media (max-width: 480px) {
      font-size: 0.6rem;
    }
  }

  .slot-icon {
    font-size: 1.5rem;

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }

  .item-name {
    color: ${theme.colors.text.accent};
    font-size: 0.75rem;
    text-align: center;
    margin-top: ${theme.spacing.xs};

    @media (max-width: 480px) {
      font-size: 0.65rem;
    }
  }

  @media (max-width: 768px) {
    min-height: 70px;
  }

  @media (max-width: 480px) {
    min-height: 60px;
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

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
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
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: ${theme.spacing.sm};
  flex: 1;
  align-content: start;
`;

const ItemCard = styled.div<{ selected?: boolean }>`
  background: ${props => props.selected
    ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3))'
    : theme.colors.background.secondary
  };
  border: 2px solid ${props => props.selected ? theme.colors.primary : theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 70px;
  height: 70px;
  position: relative;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .item-icon {
    font-size: 2rem;
  }

  .item-name {
    display: none; // Hide name in grid view
  }

  .item-quantity {
    position: absolute;
    bottom: 2px;
    right: 4px;
    background: ${theme.colors.background.primary};
    color: ${theme.colors.text.accent};
    font-size: 0.7rem;
    font-weight: 600;
    padding: 2px 4px;
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border.primary};
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

export const InventoryScreen = React.memo(() => {
  // Zustand store - selective subscriptions
  const character = useGameStore(state => state.gameState.character);
  const updateCharacter = useGameStore(state => state.updateCharacter);
  const equipItemToSlot = useGameStore(state => state.equipItem);
  const unequipItemFromSlot = useGameStore(state => state.unequipItem);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('equipment');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{item: Item | Equipment, x: number, y: number} | null>(null);

  // Initialize equipment slots and inventory categories with test data
  const equippedItems = character.equippedItems || {};
  const inventoryCategories = character.inventoryCategories || {
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

  // Equipment slot compatibility mapping
  const getCompatibleSlots = (item: Item): EquipmentSlot[] => {
    switch (item.type) {
      case 'weapon':
        return ['leftHand', 'rightHand'];
      case 'armor':
        return ['helmet', 'bodyArmor', 'gloves', 'boots'];
      case 'misc':
        // For misc items, check the name to determine what type of accessory it is
        const lowerName = item.name.toLowerCase();
        if (lowerName.includes('ring')) {
          return ['leftRing', 'rightRing'];
        } else if (lowerName.includes('amulet')) {
          return ['amulet'];
        } else if (lowerName.includes('bracelet')) {
          return ['bracelet'];
        } else if (lowerName.includes('cloak')) {
          return ['cloak'];
        }
        return []; // Unknown misc items can't be equipped
      case 'consumable':
        return []; // Consumables can't be equipped
      default:
        return [];
    }
  };

  const canEquipToSlot = (item: Item, slot: EquipmentSlot): boolean => {
    const compatibleSlots = getCompatibleSlots(item);
    return compatibleSlots.includes(slot);
  };

  const equipItem = (item: Item, slot: EquipmentSlot) => {
    if (!canEquipToSlot(item, slot)) return;

    // If there's already an item in the slot, move it back to inventory (handled by unequip)
    const existingItem = equippedItems[slot];
    if (existingItem) {
      // Convert Equipment to Item format for inventory
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

    // Look up the actual equipment from the equipment database
    const equipmentFromDb = equipmentItems[item.id];

    // Convert Item to Equipment format for equipping, using stats from database
    const equipmentItem: Equipment = equipmentFromDb || {
      id: item.id,
      name: item.name,
      type: item.type === 'misc' ? 'accessory' : item.type as EquipmentType,
      stats: {}, // Fallback to empty stats if not found in database
      icon: item.icon
    };

    console.log(`⚔️ Equipping ${equipmentItem.name} with stats:`, equipmentItem.stats);

    // Remove item from inventory
    const category = item.type === 'weapon' ? 'equipment' :
      item.type === 'armor' ? 'equipment' : 'consumables';
    const categoryItems = inventoryCategories[category as keyof typeof inventoryCategories] as Item[];
    const itemIndex = categoryItems.findIndex(i => i.id === item.id);
    if (itemIndex >= 0) {
      categoryItems.splice(itemIndex, 1);
    }

    // Use GameContext's equipItem to properly recalculate stats
    equipItemToSlot(slot, equipmentItem);

    // Update inventory categories
    updateCharacter({ inventoryCategories });
  };

  const unequipItem = (slot: EquipmentSlot) => {
    const item = equippedItems[slot];
    if (!item) return;

    // Convert Equipment to Item format for inventory
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

    // Add item back to inventory
    const category = item.type === 'weapon' ? 'equipment' :
      item.type === 'armor' ? 'equipment' : 'consumables';

    if (inventoryCategories[category as keyof typeof inventoryCategories]) {
      (inventoryCategories[category as keyof typeof inventoryCategories] as Item[]).push(itemForInventory);
    }

    // Use GameContext's unequipItem to properly recalculate stats
    unequipItemFromSlot(slot);

    // Update inventory categories
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

          {'learningRequirement' in item && item.learningRequirement && typeof item.learningRequirement === 'object' ? (
            <TooltipSection>
              <TooltipSectionTitle>Requirements</TooltipSectionTitle>
              {'level' in item.learningRequirement && item.learningRequirement.level ? (
                <TooltipStat>
                  <span className="stat-name">Level</span>
                  <span className="stat-value">{item.learningRequirement.level as number}</span>
                </TooltipStat>
              ) : null}
              {'stats' in item.learningRequirement && item.learningRequirement.stats && typeof item.learningRequirement.stats === 'object' && 'heart' in item.learningRequirement.stats && item.learningRequirement.stats.heart ? (
                <TooltipStat>
                  <span className="stat-name">Heart</span>
                  <span className="stat-value">{item.learningRequirement.stats.heart as number}</span>
                </TooltipStat>
              ) : null}
              {'stats' in item.learningRequirement && item.learningRequirement.stats && typeof item.learningRequirement.stats === 'object' && 'body' in item.learningRequirement.stats && item.learningRequirement.stats.body ? (
                <TooltipStat>
                  <span className="stat-name">Body</span>
                  <span className="stat-value">{item.learningRequirement.stats.body as number}</span>
                </TooltipStat>
              ) : null}
              {'stats' in item.learningRequirement && item.learningRequirement.stats && typeof item.learningRequirement.stats === 'object' && 'mind' in item.learningRequirement.stats && item.learningRequirement.stats.mind ? (
                <TooltipStat>
                  <span className="stat-name">Mind</span>
                  <span className="stat-value">{item.learningRequirement.stats.mind as number}</span>
                </TooltipStat>
              ) : null}
            </TooltipSection>
          ) : null}

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
                  {...(gridArea ? { gridArea } : {})}
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
                  <div className="slot-label">{label}</div>
                  <div className="slot-icon">{equippedItem ? equippedItem.icon : icon}</div>
                  {equippedItem && (
                    <>
                      <div className="item-name">{equippedItem.name}</div>
                      <div style={{ fontSize: '0.6rem', color: theme.colors.text.muted }}>
                        Double-click to unequip
                      </div>
                    </>
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
            {getCurrentItems().map((item) => {
              const compatibleSlots = getCompatibleSlots(item);
              const canEquip = compatibleSlots.length > 0;

              return (
                <ItemCard
                  key={item.id}
                  selected={selectedItem?.id === item.id}
                  onClick={() => canEquip ? setSelectedItem(item) : null}
                  onDoubleClick={() => {
                    if (canEquip && compatibleSlots.length > 0) {
                      // Find first compatible empty slot
                      const firstAvailableSlot = compatibleSlots.find(slot => !equippedItems[slot]);
                      if (firstAvailableSlot) {
                        equipItem(item, firstAvailableSlot);
                        setSelectedItem(null);
                      } else {
                        // If no empty slot, equip to first compatible slot (will swap)
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
                  style={{
                    cursor: canEquip ? 'pointer' : 'default',
                    opacity: canEquip ? 1 : 0.5
                  }}
                  title={canEquip ? `Double-click to equip to ${compatibleSlots[0]}` : 'Cannot be equipped'}
                >
                  <div className="item-icon">{item.icon}</div>
                  {item.stackable && item.quantity > 1 && (
                    <div className="item-quantity">x{item.quantity}</div>
                  )}
                </ItemCard>
              );
            })}
          </ItemGrid>
        ) : (
          <EmptyState>
            No items in this category
          </EmptyState>
        )}
      </InventoryPanel>
    </InventoryContainer>
    {renderTooltip()}
  </DndProvider>
  );
});