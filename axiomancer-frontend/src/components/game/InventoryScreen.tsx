import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { allEquipment } from '../../utils/equipmentItems';
import { Equipment } from '../../types/game';

const InventoryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 120px ${theme.spacing.xl} 100px;
  background: ${theme.colors.background.primary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(75, 0, 130, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%);
    pointer-events: none;
  }
`;

const InventoryTitle = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  font-size: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const InfoPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  box-shadow: ${theme.shadows.panel};

  p {
    color: ${theme.colors.text.secondary};
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  .highlight {
    color: ${theme.colors.text.accent};
    font-weight: bold;
  }
`;

const EquipmentTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  justify-content: center;
`;

const EquipmentTab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.primary : theme.colors.background.secondary};
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.border.dark};
  color: ${props => props.active ? 'white' : theme.colors.text.secondary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  text-transform: uppercase;
  min-width: 120px;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.text.accent};
  }
`;

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  flex: 1;
  overflow-y: auto;
`;

const EquipmentCard = styled.div<{ isEquipped: boolean; rarity: string }>`
  background: ${props => {
    if (props.isEquipped) {
      return 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))';
    }
    switch (props.rarity) {
      case 'legendary': return 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2))';
      case 'epic': return 'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(126, 34, 206, 0.2))';
      case 'rare': return 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))';
      case 'common':
      default: return 'linear-gradient(45deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))';
    }
  }};
  border: 3px solid ${props => {
    if (props.isEquipped) return '#10b981';
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#9333ea';
      case 'rare': return '#3b82f6';
      case 'common':
      default: return '#6b7280';
    }
  }};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  position: relative;
  box-shadow: ${theme.shadows.panel};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const EquipmentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const EquipmentIcon = styled.div`
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${theme.borderRadius.lg};
  border: 2px solid ${theme.colors.border.primary};
`;

const EquipmentInfo = styled.div`
  flex: 1;
`;

const EquipmentName = styled.h3`
  margin: 0 0 ${theme.spacing.xs} 0;
  color: ${theme.colors.text.accent};
  font-size: 1.3rem;
  font-weight: bold;
`;

const EquipmentType = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const EquipmentDescription = styled.p`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text.primary};
  line-height: 1.4;
  font-size: 0.95rem;
`;

const EquipmentStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const EquipmentStat = styled.div`
  text-align: center;
  padding: ${theme.spacing.xs};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.dark};

  .stat-label {
    font-size: 0.7rem;
    color: ${theme.colors.text.muted};
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: bold;
    color: ${props => props.children?.toString().includes('+') ? '#10b981' : theme.colors.text.accent};
  }
`;

const RarityBadge = styled.div<{ rarity: string }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: ${props => {
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#9333ea';
      case 'rare': return '#3b82f6';
      case 'common':
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: ${theme.shadows.button};
`;

const EquippedBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.sm};
  background: ${theme.colors.success};
  color: white;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: ${theme.shadows.button};
`;

const SpecialEffects = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm};
  font-size: 0.85rem;
  color: '#c4b5fd';
  font-style: italic;

  .effects-title {
    font-weight: bold;
    margin-bottom: ${theme.spacing.xs};
    color: ${theme.colors.text.accent};
  }
`;

export const InventoryScreen = React.memo(() => {
  const { gameState } = useGame();
  const { character } = gameState;
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const playerEquipment = character.equipment || [];
  const equipmentTypes = ['all', 'weapon', 'armor', 'accessory'];

  const getFilteredEquipment = () => {
    const allEquipmentWithStatus = allEquipment.map(equipment => ({
      ...equipment,
      isEquipped: playerEquipment.some(equipped => equipped.id === equipment.id)
    }));

    if (selectedTab === 'all') return allEquipmentWithStatus;
    return allEquipmentWithStatus.filter(equipment => equipment.type === selectedTab);
  };

  const hasEquipmentInCategory = (category: string) => {
    const equipment = getFilteredEquipment();
    if (category === 'all') return equipment.length > 0;
    return equipment.some(eq => eq.type === category);
  };

  const formatStatBonus = (statBonuses: any, statName: string): string => {
    const value = statBonuses?.[statName];
    if (!value || value === 0) return '—';
    return value > 0 ? `+${value}` : `${value}`;
  };

  const totalEquipment = getFilteredEquipment().length;
  const equippedCount = getFilteredEquipment().filter(eq => eq.isEquipped).length;

  return (
    <InventoryContainer>
      <InventoryTitle>Equipment Compendium</InventoryTitle>

      <InfoPanel>
        <p>
          This compendium shows all philosophical equipment available in Axiomancer.
          <span className="highlight"> Green equipment is currently equipped</span>, while
          <span className="highlight"> other equipment shows what can be found</span> through exploration.
        </p>
        <p style={{ marginTop: theme.spacing.md }}>
          Equipment owned: <span className="highlight">{equippedCount} / {totalEquipment}</span>
          {totalEquipment > 0 && ` (${Math.round((equippedCount / totalEquipment) * 100)}%)`}
        </p>
      </InfoPanel>

      <EquipmentTabs>
        {equipmentTypes.map(type => {
          const equipment = getFilteredEquipment();
          const categoryEquipment = type === 'all' ? equipment : equipment.filter(eq => eq.type === type);
          const equippedInCategory = categoryEquipment.filter(eq => eq.isEquipped).length;

          return (
            <EquipmentTab
              key={type}
              active={selectedTab === type}
              onClick={() => setSelectedTab(type)}
              disabled={!hasEquipmentInCategory(type)}
              style={{ opacity: hasEquipmentInCategory(type) ? 1 : 0.5 }}
            >
              {type} ({equippedInCategory}/{categoryEquipment.length})
            </EquipmentTab>
          );
        })}
      </EquipmentTabs>

      <EquipmentGrid>
        {getFilteredEquipment().length > 0 ? (
          getFilteredEquipment().map(equipment => (
            <EquipmentCard key={equipment.id} isEquipped={equipment.isEquipped} rarity={equipment.rarity}>
              {equipment.isEquipped && <EquippedBadge>Equipped</EquippedBadge>}
              <RarityBadge rarity={equipment.rarity}>{equipment.rarity}</RarityBadge>

              <EquipmentHeader>
                <EquipmentIcon>{equipment.icon}</EquipmentIcon>
                <EquipmentInfo>
                  <EquipmentName>{equipment.name}</EquipmentName>
                  <EquipmentType>{equipment.type}</EquipmentType>
                </EquipmentInfo>
              </EquipmentHeader>

              <EquipmentDescription>{equipment.description}</EquipmentDescription>

              <EquipmentStats>
                <EquipmentStat>
                  <div className="stat-label">Physical Attack</div>
                  <div className="stat-value">{formatStatBonus(equipment.statBonuses, 'physicalAttack')}</div>
                </EquipmentStat>
                <EquipmentStat>
                  <div className="stat-label">Mind Attack</div>
                  <div className="stat-value">{formatStatBonus(equipment.statBonuses, 'mindAttack')}</div>
                </EquipmentStat>
                <EquipmentStat>
                  <div className="stat-label">Physical Defense</div>
                  <div className="stat-value">{formatStatBonus(equipment.statBonuses, 'physicalDefense')}</div>
                </EquipmentStat>
                <EquipmentStat>
                  <div className="stat-label">Mind Defense</div>
                  <div className="stat-value">{formatStatBonus(equipment.statBonuses, 'mindDefense')}</div>
                </EquipmentStat>
              </EquipmentStats>

              {equipment.specialEffects && equipment.specialEffects.length > 0 && (
                <SpecialEffects>
                  <div className="effects-title">Special Effects:</div>
                  {equipment.specialEffects.map((effect, index) => (
                    <div key={index}>• {effect}</div>
                  ))}
                </SpecialEffects>
              )}
            </EquipmentCard>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: theme.spacing.xl,
            background: theme.colors.background.panel,
            border: `2px solid ${theme.colors.border.primary}`,
            borderRadius: theme.rpg.panelBorderRadius,
            color: theme.colors.text.secondary
          }}>
            <h3 style={{ color: theme.colors.text.accent, marginBottom: theme.spacing.md }}>No Equipment Available</h3>
            <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>
              Explore the world and defeat enemies to discover philosophical equipment and artifacts!
            </p>
          </div>
        )}
      </EquipmentGrid>
    </InventoryContainer>
  );
});