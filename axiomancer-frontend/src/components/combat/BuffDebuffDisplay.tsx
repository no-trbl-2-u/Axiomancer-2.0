import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { BuffDebuff } from '../../types/game';

interface BuffDebuffDisplayProps {
  buffs: BuffDebuff[];
  target: 'player' | 'enemy';
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-height: 60px;
`;

const EffectsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`;

const EffectIcon = styled.div<{ type: 'buff' | 'debuff' }>`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.sm};
  background: ${props => props.type === 'buff'
    ? 'linear-gradient(135deg, #10b981, #059669)'
    : 'linear-gradient(135deg, #ef4444, #dc2626)'
  };
  border: 2px solid ${props => props.type === 'buff' ? '#34d399' : '#f87171'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }

  .duration {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: ${theme.colors.background.primary};
    color: ${theme.colors.text.accent};
    border-radius: 50%;
    width: 14px;
    height: 14px;
    font-size: 0.6rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${theme.colors.border.primary};
  }
`;

const Tooltip = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm};
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: ${props => props.show ? 'block' : 'none'};

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${theme.colors.border.primary};
  }

  .tooltip-name {
    color: ${theme.colors.text.accent};
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: ${theme.spacing.xs};
  }

  .tooltip-description {
    color: ${theme.colors.text.secondary};
    font-size: 0.8rem;
    margin-bottom: ${theme.spacing.xs};
  }

  .tooltip-effect {
    color: ${theme.colors.text.primary};
    font-size: 0.8rem;
    font-style: italic;
  }
`;

const Header = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing.xs};
`;

const NoEffectsMessage = styled.div`
  color: ${theme.colors.text.muted};
  font-size: 0.8rem;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
`;

const getEffectIcon = (effect: BuffDebuff): string => {
  // Use the icon from the status effect if available
  if (effect.icon) {
    return effect.icon;
  }

  // Map specific effect IDs to icons for legacy effects
  switch (effect.id) {
    case 'mind_attack_followup':
      return '🧠';
    case 'heart_attack_guilt':
      return '💔';
    case 'body_reflection':
      return '🛡️';
    case 'mind_counter_argument':
      return '🎯';
    case 'heart_foresight':
      return '👁️';
    case 'body_defense_stance':
      return '💪';
    case 'mind_defense_stance':
      return '🧠';
    case 'heart_defense_stance':
      return '❤️';
    default:
      // Fallback based on buff/debuff type with philosophical themes
      if (effect.type === 'buff') {
        return effect.name.toLowerCase().includes('mind') ? '🧠' :
               effect.name.toLowerCase().includes('heart') ? '❤️' :
               effect.name.toLowerCase().includes('body') ? '💪' : '✨';
      } else {
        return effect.name.toLowerCase().includes('mind') ? '🤯' :
               effect.name.toLowerCase().includes('heart') ? '💔' :
               effect.name.toLowerCase().includes('body') ? '🤕' : '💀';
      }
  }
};

const formatEffectDescription = (effect: BuffDebuff): string => {
  let description = effect.description;

  // Add stackable information
  if (effect.stackable && effect.currentStacks && effect.currentStacks > 1) {
    description += ` | Stacks: ${effect.currentStacks}`;
    if (effect.maxStacks) {
      description += `/${effect.maxStacks}`;
    }
  }

  // Add remaining turns info
  if (effect.remainingTurns > 0) {
    description += ` | ${effect.remainingTurns} turns left`;
  }

  return description;
};

export const BuffDebuffDisplay: React.FC<BuffDebuffDisplayProps> = ({
  buffs,
  target,
  className
}) => {
  const [hoveredEffect, setHoveredEffect] = React.useState<string | null>(null);

  const activeEffects = buffs.filter(buff => buff.remainingTurns > 0);
  const buffEffects = activeEffects.filter(effect => effect.type === 'buff');
  const debuffEffects = activeEffects.filter(effect => effect.type === 'debuff');

  return (
    <Container className={className}>
      <Header>
        {target === 'player' ? 'Your Effects' : 'Enemy Effects'}
        {activeEffects.length > 0 && ` (${activeEffects.length})`}
      </Header>

      {activeEffects.length === 0 ? (
        <NoEffectsMessage>
          No active effects
        </NoEffectsMessage>
      ) : (
        <EffectsList>
          {[...buffEffects, ...debuffEffects].map((effect) => {
            return (
              <EffectIcon
                key={effect.id}
                type={effect.type}
                onMouseEnter={() => setHoveredEffect(effect.id)}
                onMouseLeave={() => setHoveredEffect(null)}
              >
                {getEffectIcon(effect)}
                <div className="duration">{effect.remainingTurns}</div>

                <Tooltip show={hoveredEffect === effect.id}>
                  <div className="tooltip-name">{effect.name}</div>
                  <div className="tooltip-description">{effect.description}</div>
                  <div className="tooltip-effect">
                    {formatEffectDescription(effect)}
                  </div>
                </Tooltip>
              </EffectIcon>
            );
          })}
        </EffectsList>
      )}
    </Container>
  );
};