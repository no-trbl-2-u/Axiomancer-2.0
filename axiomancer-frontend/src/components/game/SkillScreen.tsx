import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { Skill } from '../../types/game';

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
`;

const SkillTitle = styled.h2`
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

const SkillTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  justify-content: center;
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
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${theme.spacing.lg};
  flex: 1;
  overflow-y: auto;
`;

const SkillCard = styled.div<{ level: number }>`
  background: linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  border: 3px solid #10b981;
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

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
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
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  margin: 0 0 ${theme.spacing.xs} 0;
  color: ${theme.colors.text.accent};
  font-size: 1.3rem;
  font-weight: bold;
`;

const SkillLevel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  font-family: monospace;
`;

const SkillDescription = styled.p`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text.primary};
  line-height: 1.4;
  font-size: 0.95rem;
`;

const SkillStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
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
  }

  .stat-value {
    font-size: 1rem;
    font-weight: bold;
    color: ${theme.colors.text.accent};
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

const KnownSkillBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: ${theme.colors.success};
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
  const { gameState } = useGame();
  const { character } = gameState;
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const knownSkills = character.skills;
  const skillTypes = ['all', 'fallacy', 'virtue', 'logic', 'rhetoric', 'meditation'];
  
  const getFilteredSkills = () => {
    if (selectedTab === 'all') return knownSkills;
    return knownSkills.filter(skill => skill.type === selectedTab);
  };

  const hasSkillsInCategory = (category: string) => {
    if (category === 'all') return knownSkills.length > 0;
    return knownSkills.some(skill => skill.type === category);
  };

  return (
    <SkillContainer>
      <SkillTitle>Learned Skills & Abilities</SkillTitle>
      
      <InfoPanel>
        <p>
          Skills cannot be learned from this screen. Instead, you must 
          <span className="highlight"> encounter philosophical challenges, engage in combat with logical fallacies, 
          and make meaningful choices throughout your journey</span> to gain new abilities.
        </p>
        <p style={{ marginTop: theme.spacing.md }}>
          Current skills learned: <span className="highlight">{knownSkills.length}</span>
        </p>
      </InfoPanel>
      
      <SkillTabs>
        {skillTypes.map(type => (
          <SkillTab
            key={type}
            active={selectedTab === type}
            onClick={() => setSelectedTab(type)}
            disabled={!hasSkillsInCategory(type)}
            style={{ opacity: hasSkillsInCategory(type) ? 1 : 0.5 }}
          >
            {type} {type !== 'all' && `(${knownSkills.filter(s => s.type === type).length})`}
          </SkillTab>
        ))}
      </SkillTabs>

      <SkillGrid>
        {getFilteredSkills().length > 0 ? (
          getFilteredSkills().map(skill => (
            <SkillCard key={skill.id} level={skill.level}>
              <KnownSkillBadge>Mastered</KnownSkillBadge>
              
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

              {skill.effect && (
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: theme.borderRadius.sm,
                  padding: theme.spacing.sm,
                  fontSize: '0.85rem',
                  color: '#c4b5fd',
                  fontStyle: 'italic'
                }}>
                  Effect: {skill.effect}
                </div>
              )}
            </SkillCard>
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
            <h3 style={{ color: theme.colors.text.accent, marginBottom: theme.spacing.md }}>No Skills Learned Yet</h3>
            <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>
              Explore the world, engage with philosophical challenges, and defeat logical fallacies 
              to learn new skills and abilities. Your journey of discovery awaits!
            </p>
          </div>
        )}
      </SkillGrid>
    </SkillContainer>
  );
});