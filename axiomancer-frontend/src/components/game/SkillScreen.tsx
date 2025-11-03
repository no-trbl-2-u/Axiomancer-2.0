import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { Skill, PhilosophicalAspect } from '../../types/game';
import { fallacySpellbook } from '../../utils/fallacySpellbook';
import { Container, Grid, FlexContainer } from '../shared/Grid';
import { Card } from '../shared/Card';
import { Panel } from '../shared/Panel';
import { Title, Text, Description } from '../shared/Text';
import { TabsContainer, Tab } from '../shared/Tab';
import { StatGrid, StatGridItem } from '../shared/StatDisplay';
import { SlotsContainer, Slot } from '../shared/Slot';
import { SaveButton } from '../shared/ActionButton';

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

export const SkillScreen = React.memo(() => {
  // Zustand store - selective subscription
  const character = useGameStore(state => state.gameState.character);
  const equipSkill = useGameStore(state => state.equipSkill);
  const unequipSkill = useGameStore(state => state.unequipSkill);
  const saveGame = useGameStore(state => state.saveGame);
  const changeScreen = useGameStore(state => state.changeScreen);

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
    <Container variant="page" padding="xl">
      <FlexContainer justify="space-between" align="center">
        <Title variant="skill" size="lg">Skills & Abilities</Title>
        <SaveButton
          onClick={async () => {
            await saveGame();
            changeScreen('map');
          }}
          title="Save equipped skills and return to the map"
        >
          Save
        </SaveButton>
      </FlexContainer>

      <Panel variant="info">
        <Text variant="secondary" align="center">
          Double-click skills to equip them in your loadout.
          Each philosophical aspect can hold up to 5 skills.
        </Text>
      </Panel>

      {/* Equipment Slots */}
      <SlotsContainer variant="skill" gap="lg">
        {Array.from({ length: 5 }, (_, index) => {
          const equippedSkills = getEquippedSkills();
          const equippedSkill = equippedSkills[index];

          return (
            <Slot
              key={index}
              isEmpty={!equippedSkill}
              variant="skill"
              size="md"
              icon={equippedSkill?.icon}
              cost={equippedSkill?.manaCost}
              onClick={() => equippedSkill && unequipSkill(equippedSkill.id, selectedTab)}
            />
          );
        })}
      </SlotsContainer>

      {/* Tab Selection */}
      <TabsContainer variant="skill" align="center" gap="sm">
        {(['body', 'mind', 'heart'] as PhilosophicalAspect[]).map((aspect) => {
          const availableSkills = allFallacySkills.filter(skill => skill.philosophicalAspect === aspect);
          const equippedCount = (character.equippedSkills[aspect] || []).length;

          return (
            <Tab
              key={aspect}
              active={selectedTab === aspect}
              onClick={() => setSelectedTab(aspect)}
              variant="aspect"
            >
              {getTabIcon(aspect)} {aspect.toUpperCase()} ({equippedCount}/5)
            </Tab>
          );
        })}
      </TabsContainer>

      {/* Skills Grid */}
      <Grid variant="skill" gap="xl">
        {getFilteredSkills().map(skill => {
          const isEquipped = getEquippedSkills().some(s => s.id === skill.id);

          return (
            <Card
              key={skill.id}
              variant="skill"
              isEquipped={isEquipped}
              onDoubleClick={() => handleSkillDoubleClick(skill)}
            >
              <FlexContainer align="center" gap="md">
                <SkillIcon>{skill.icon}</SkillIcon>
                <div style={{ flex: 1 }}>
                  <Title size="md">{skill.name}</Title>
                  <Text variant="secondary" size="sm" style={{ fontFamily: 'monospace' }}>
                    Level {skill.level}
                  </Text>
                </div>
              </FlexContainer>

              <SkillType skillType={skill.type}>{skill.type}</SkillType>

              <Description variant="skill">{skill.description}</Description>

              <StatGrid columns={3}>
                <StatGridItem label="Mana Cost" value={skill.manaCost} />
                <StatGridItem label="Damage" value={skill.damage || 0} />
                <StatGridItem label="Aspect" value={skill.philosophicalAspect || 'Mind'} />
              </StatGrid>

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
            </Card>
          );
        })}
      </Grid>
    </Container>
  );
});
