import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { Skill, PhilosophicalAspect } from '../../types/game';
import { fallacySpellbook } from '../../utils/fallacySpellbook';

const SkillContainer = styled.div`
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

  @media (max-width: 768px) {
    padding: 100px ${theme.spacing.md} 80px;
  }

  @media (max-width: 480px) {
    padding: 80px ${theme.spacing.sm} 70px;
  }
`;

const SkillTitle = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  font-size: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
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

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`;

const SkillTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const SkillTab = styled.button<{ active: boolean }>`
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

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    min-width: 100px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    min-width: 80px;
    font-size: 0.8rem;
  }
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${theme.spacing.lg};
  flex: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const SkillCard = styled.div<{ isEquipped: boolean }>`
  background: ${props => props.isEquipped
    ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3))'
    : 'linear-gradient(45deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))'
  };
  border: 3px solid ${props => props.isEquipped ? '#3b82f6' : '#6b7280'};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  position: relative;
  box-shadow: ${theme.shadows.panel};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
    border-color: ${props => props.isEquipped ? '#60a5fa' : '#9ca3af'};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const SkillIcon = styled.div`
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${theme.borderRadius.lg};
  border: 2px solid ${theme.colors.border.primary};

  @media (max-width: 768px) {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  margin: 0 0 ${theme.spacing.xs} 0;
  color: ${theme.colors.text.accent};
  font-size: 1.3rem;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const SkillLevel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  font-family: monospace;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SkillDescription = styled.p`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text.primary};
  line-height: 1.4;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    margin-bottom: ${theme.spacing.sm};
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const SkillStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.sm};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SkillStat = styled.div`
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

    @media (max-width: 480px) {
      font-size: 0.6rem;
    }
  }

  .stat-value {
    font-size: 1rem;
    font-weight: bold;
    color: ${theme.colors.text.accent};

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.xs};
  }
`;

const SkillType = styled.div<{ skillType: string }>`
  display: inline-block;
  background: ${props => {
    switch (props.skillType) {
      case 'fallacy': return 'rgba(220, 38, 38, 0.2)';
      case 'virtue': return 'rgba(16, 185, 129, 0.2)';
      case 'logic': return 'rgba(59, 130, 246, 0.2)';
      case 'rhetoric': return 'rgba(245, 158, 11, 0.2)';
      case 'meditation': return 'rgba(139, 92, 246, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.skillType) {
      case 'fallacy': return '#fca5a5';
      case 'virtue': return '#86efac';
      case 'logic': return '#93c5fd';
      case 'rhetoric': return '#fcd34d';
      case 'meditation': return '#c4b5fd';
      default: return theme.colors.text.secondary;
    }
  }};
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: ${theme.spacing.md};
`;

const EquipmentSlots = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const EquipmentSlot = styled.div<{ isEmpty: boolean }>`
  width: 120px;
  height: 120px;
  background: ${props => props.isEmpty
    ? 'linear-gradient(45deg, rgba(55, 65, 81, 0.4), rgba(31, 41, 55, 0.4))'
    : 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3))'
  };
  border: 3px solid ${props => props.isEmpty ? '#6b7280' : '#3b82f6'};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.isEmpty ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: ${props => props.isEmpty ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isEmpty ? 'none' : theme.shadows.glow};
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const EmptySlotText = styled.div`
  color: ${theme.colors.text.muted};
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
`;

const SkillCost = styled.div`
  color: ${theme.colors.info};
  font-size: 0.7rem;
  font-weight: bold;
  background: rgba(59, 130, 246, 0.2);
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  margin-top: ${theme.spacing.xs};
`;

const LearnButton = styled.button`
  background: ${theme.colors.success};
  border: 2px solid ${theme.colors.success};
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  text-transform: uppercase;
  width: 100%;
  box-shadow: ${theme.shadows.button};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SkillBadge = styled.div<{ isLearned: boolean }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: ${props => props.isLearned ? theme.colors.success : '#6b7280'};
  color: white;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: ${theme.shadows.button};
`;

const RequirementsList = styled.div`
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.dark};

  .req-title {
    font-size: 0.8rem;
    color: ${theme.colors.text.accent};
    font-weight: bold;
    margin-bottom: ${theme.spacing.xs};
  }

  .req-item {
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
    margin-bottom: 2px;
  }
`;

export const SkillScreen = React.memo(() => {
  // Zustand store - selective subscription
  const character = useGameStore(state => state.gameState.character);
  const equipSkill = useGameStore(state => state.equipSkill);
  const unequipSkill = useGameStore(state => state.unequipSkill);

  const [selectedTab, setSelectedTab] = useState<PhilosophicalAspect>('body');

  // Get all skills from fallacySpellbook
  const allFallacySkills = Object.values(fallacySpellbook);

  const getFilteredSkills = () => {
    return allFallacySkills.filter(skill =>
      skill.philosophicalAspect === selectedTab
    );
  };

  const getEquippedSkills = () => {
    return character.equippedSkills[selectedTab] || [];
  };

  const handleSkillDoubleClick = (skill: Skill) => {
    // Check if skill is already equipped
    const equippedSkills = getEquippedSkills();
    if (equippedSkills.some(s => s.id === skill.id)) {
      unequipSkill(skill.id, selectedTab);
    } else if (equippedSkills.length < 5) {
      equipSkill(skill, selectedTab);
    }
  };

  const getTabIcon = (aspect: PhilosophicalAspect) => {
    switch(aspect) {
      case 'body': return '💪';
      case 'mind': return '🧠';
      case 'heart': return '❤️';
      default: return '';
    }
  };

  return (
    <SkillContainer>
      <SkillTitle>Skills & Abilities</SkillTitle>

      <InfoPanel>
        <p>
          Double-click skills to equip them in your loadout.
          Each philosophical aspect can hold up to 5 skills.
        </p>
      </InfoPanel>

      {/* Equipment Slots */}
      <EquipmentSlots>
        {Array.from({ length: 5 }, (_, index) => {
          const equippedSkills = getEquippedSkills();
          const equippedSkill = equippedSkills[index];

          return (
            <EquipmentSlot
              key={index}
              isEmpty={!equippedSkill}
              onClick={() => equippedSkill && unequipSkill(equippedSkill.id, selectedTab)}
            >
              {equippedSkill ? (
                <>
                  <SkillIcon>{equippedSkill.icon}</SkillIcon>
                  <SkillName>{equippedSkill.name}</SkillName>
                  <SkillCost>{equippedSkill.manaCost} MP</SkillCost>
                </>
              ) : (
                <EmptySlotText>Empty</EmptySlotText>
              )}
            </EquipmentSlot>
          );
        })}
      </EquipmentSlots>

      {/* Tab Selection */}
      <SkillTabs>
        {(['body', 'mind', 'heart'] as PhilosophicalAspect[]).map((aspect) => {
          const availableSkills = allFallacySkills.filter(skill => skill.philosophicalAspect === aspect);
          const equippedCount = (character.equippedSkills[aspect] || []).length;

          return (
            <SkillTab
              key={aspect}
              active={selectedTab === aspect}
              onClick={() => setSelectedTab(aspect)}
            >
              {getTabIcon(aspect)} {aspect.toUpperCase()} ({equippedCount}/5)
            </SkillTab>
          );
        })}
      </SkillTabs>

      {/* Skills Grid */}
      <SkillGrid>
        {getFilteredSkills().map(skill => {
          const isEquipped = getEquippedSkills().some(s => s.id === skill.id);

          return (
            <SkillCard
              key={skill.id}
              isEquipped={isEquipped}
              onDoubleClick={() => handleSkillDoubleClick(skill)}
            >
              <SkillHeader>
                <SkillIcon>{skill.icon}</SkillIcon>
                <SkillInfo>
                  <SkillName>{skill.name}</SkillName>
                  <SkillLevel>Level {skill.level}</SkillLevel>
                </SkillInfo>
              </SkillHeader>

              <SkillType skillType={skill.type}>{skill.type}</SkillType>

              <SkillDescription>{skill.description}</SkillDescription>

              <SkillStats>
                <SkillStat>
                  <div className="stat-label">Mana Cost</div>
                  <div className="stat-value">{skill.manaCost}</div>
                </SkillStat>
                <SkillStat>
                  <div className="stat-label">Damage</div>
                  <div className="stat-value">{skill.damage || 0}</div>
                </SkillStat>
                <SkillStat>
                  <div className="stat-label">Aspect</div>
                  <div className="stat-value">{skill.philosophicalAspect || 'Mind'}</div>
                </SkillStat>
              </SkillStats>

              {(skill.effect || skill.combatEffects) && (
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: theme.borderRadius.sm,
                  padding: theme.spacing.sm,
                  fontSize: '0.85rem',
                  color: '#c4b5fd',
                  fontStyle: 'italic'
                }}>
                  Effect: {skill.effect || (skill.combatEffects?.baseEffect || 'Applies status effects based on combat conditions')}
                </div>
              )}
            </SkillCard>
          );
        })}
      </SkillGrid>
    </SkillContainer>
  );
});