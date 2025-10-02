import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { Skill, PhilosophicalAspect, Character } from '../../types/game';
import { fallacySpellbook } from '../../utils/fallacySpellbook';

interface SkillSelectionModalProps {
  isOpen: boolean;
  selectedAspect: PhilosophicalAspect | null;
  onSkillSelect: (skill: Skill) => void;
  onClose: () => void;
  playerMana: number;
  character: Character;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled.div`
  background: ${theme.colors.background.primary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  background: ${theme.colors.background.secondary};
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding: ${theme.spacing.lg};
  text-align: center;

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0;
    font-size: 1.5rem;
  }

  .aspect-indicator {
    color: ${theme.colors.text.secondary};
    font-size: 1rem;
    margin-top: ${theme.spacing.sm};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: ${theme.colors.danger};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const SkillGrid = styled.div`
  padding: ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.md};
`;

const SkillCard = styled.button<{ canAfford: boolean }>`
  background: ${props => props.canAfford ? theme.colors.background.panel : theme.colors.background.secondary};
  border: 2px solid ${props => props.canAfford ? theme.colors.border.primary : theme.colors.border.dark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  cursor: ${props => props.canAfford ? 'pointer' : 'not-allowed'};
  text-align: left;
  transition: all 0.3s ease;
  opacity: ${props => props.canAfford ? 1 : 0.6};

  &:hover {
    transform: ${props => props.canAfford ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.canAfford ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none'};
    border-color: ${props => props.canAfford ? theme.colors.primary : theme.colors.border.dark};
  }

  .skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.sm};

    .skill-title {
      display: flex;
      align-items: center;
      gap: ${theme.spacing.sm};

      .skill-icon {
        font-size: 1.2rem;
      }

      .skill-name {
        color: ${theme.colors.text.accent};
        font-size: 1rem;
        font-weight: 600;
      }
    }

    .skill-cost {
      background: ${theme.colors.primary};
      color: white;
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      border-radius: ${theme.borderRadius.sm};
      font-size: 0.8rem;
      font-weight: 600;
    }
  }

  .skill-description {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    margin-bottom: ${theme.spacing.sm};
  }

  .skill-effect {
    color: ${theme.colors.text.primary};
    font-size: 0.8rem;
    font-style: italic;
  }
`;

const NoSkillsMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
  font-size: 1.1rem;

  .icon {
    font-size: 3rem;
    margin-bottom: ${theme.spacing.md};
  }
`;

const getAspectColor = (aspect: PhilosophicalAspect): string => {
  switch (aspect) {
    case 'body': return '#e74c3c'; // Red
    case 'mind': return '#3498db'; // Blue
    case 'heart': return '#e91e63'; // Pink
    default: return theme.colors.text.secondary;
  }
};

const getAspectIcon = (aspect: PhilosophicalAspect): string => {
  switch (aspect) {
    case 'body': return '💪';
    case 'mind': return '🧠';
    case 'heart': return '❤️';
    default: return '❓';
  }
};

export const SkillSelectionModal: React.FC<SkillSelectionModalProps> = ({
  isOpen,
  selectedAspect,
  onSkillSelect,
  onClose,
  playerMana,
  character
}) => {
  if (!isOpen || !selectedAspect) return null;

  // Filter skills by selected aspect
  const availableSkills = Object.values(fallacySpellbook).filter(
    skill => skill.philosophicalAspect === selectedAspect
  );

  // Get equipped skills for this aspect
  const equippedSkills = character.equippedSkills[selectedAspect] || [];

  const aspectColor = getAspectColor(selectedAspect);
  const aspectIcon = getAspectIcon(selectedAspect);

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>
          <h2>
            {aspectIcon} {selectedAspect.charAt(0).toUpperCase() + selectedAspect.slice(1)} Skills
          </h2>
          <div className="aspect-indicator" style={{ color: aspectColor }}>
            Select a skill to use in combat
          </div>
        </ModalHeader>

        {availableSkills.length === 0 ? (
          <NoSkillsMessage>
            <div className="icon">😔</div>
            <div>No Skills of selected argument</div>
            <div style={{ fontSize: '0.9rem', marginTop: theme.spacing.sm }}>
              You don't have any {selectedAspect} skills available yet.
            </div>
          </NoSkillsMessage>
        ) : (
          <SkillGrid>
            {availableSkills.map((skill) => {
              const canAfford = playerMana >= skill.manaCost;

              return (
                <SkillCard
                  key={skill.id}
                  canAfford={canAfford}
                  onClick={() => canAfford && onSkillSelect(skill)}
                >
                  <div className="skill-header">
                    <div className="skill-title">
                      <span className="skill-icon">{skill.icon}</span>
                      <span className="skill-name">{skill.name}</span>
                    </div>
                    <div className="skill-cost">{skill.manaCost} MP</div>
                  </div>

                  <div className="skill-description">
                    {skill.description}
                  </div>

                  <div className="skill-effect">
                    {skill.combatEffects?.baseEffect || "No effect description available"}
                  </div>
                </SkillCard>
              );
            })}
          </SkillGrid>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};