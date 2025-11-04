import React from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { theme } from '../../../../../styles/theme';
import { BuffDebuff } from '../../../../../types/buffs';

interface BuffDebuffDisplayProps {
  buffs: BuffDebuff[];
  debuffs: BuffDebuff[];
  target: 'player' | 'enemy';
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-height: 60px;
  max-height: 120px;
  overflow-y: auto;
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
  position: fixed;
  bottom: auto;
  top: auto;
  left: auto;
  right: auto;
  transform: translateX(-50%) translateY(-100%);
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm};
  white-space: pre-line;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'block' : 'none'};
  pointer-events: none;
  max-width: 300px;
  min-width: 200px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: ${theme.colors.border.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${theme.colors.background.panel};
    z-index: 1;
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
  const statEffects: string[] = [];

  // Add stat modifier details
  if (effect.effect.statModifiers) {
    Object.entries(effect.effect.statModifiers).forEach(([stat, value]) => {
      if (value && value !== 0) {
        const displayName = stat.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, c => c.toUpperCase());
        const sign = value > 0 ? '+' : '';
        const finalValue = value as number * effect.currentStacks;
        statEffects.push(`${sign}${finalValue} ${displayName}`);
      }
    });
  }

  // Add percentage modifier details
  if (effect.effect.percentageModifiers) {
    Object.entries(effect.effect.percentageModifiers).forEach(([stat, value]) => {
      if (value && value !== 0) {
        const displayName = stat.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, c => c.toUpperCase());
        const sign = value > 0 ? '+' : '';
        statEffects.push(`${sign}${value}% ${displayName}`);
      }
    });
  }

  // Add special effects details
  if (effect.effect.specialEffects) {
    const special = effect.effect.specialEffects;
    if (special.fixedDamageNextTurn) {
      statEffects.push(`${special.fixedDamageNextTurn} fixed damage next turn`);
    }
    if (special.damageOnAttack) {
      statEffects.push(`${special.damageOnAttack} damage when attacking`);
    }
    if (special.reflection) {
      statEffects.push(`${special.reflection} reflection damage`);
    }
    if (special.foresight) {
      statEffects.push('Can see enemy actions');
    }
    if (special.immuneToNextAttack) {
      statEffects.push('Immune to next attack');
    }
    if (special.chanceToFadePerTurn) {
      statEffects.push(`${special.chanceToFadePerTurn}% chance to fade per turn`);
    }
  }

  // Combine description with stat effects
  if (statEffects.length > 0) {
    description += `\n\nEffects: ${statEffects.join(', ')}`;
  }

  // Add stackable information
  if (effect.stackable && effect.currentStacks && effect.currentStacks > 1) {
    description += `\n\nStacks: ${effect.currentStacks}`;
    if (effect.maxStacks) {
      description += `/${effect.maxStacks}`;
    }
  }

  // Add remaining turns info
  if (effect.remainingTurns > 0) {
    const turnsText = effect.remainingTurns === 1 ? 'turn' : 'turns';
    description += `\n\nDuration: ${effect.remainingTurns} ${turnsText} remaining`;
  }

  return description;
};

export const BuffDebuffDisplay: React.FC<BuffDebuffDisplayProps> = ({
  buffs,
  debuffs,
  target,
  className
}) => {
  const [hoveredEffect, setHoveredEffect] = React.useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  const activeBuffs = buffs.filter(buff => buff.remainingTurns > 0);
  const activeDebuffs = debuffs.filter(debuff => debuff.remainingTurns > 0);
  const activeEffects = [...activeBuffs, ...activeDebuffs];

  const buffEffects = activeBuffs;
  const debuffEffects = activeDebuffs;

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
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10
                  });
                  setHoveredEffect(effect.id);
                }}
                onMouseLeave={() => setHoveredEffect(null)}
              >
                {getEffectIcon(effect)}
                <div className="duration">{effect.remainingTurns}</div>

                {hoveredEffect === effect.id && createPortal(
                  <Tooltip
                    show={true}
                    style={{
                      left: tooltipPosition.x,
                      top: tooltipPosition.y,
                    }}
                  >
                    <div className="tooltip-name">{effect.name}</div>
                    <div className="tooltip-description" style={{ whiteSpace: 'pre-line' }}>
                      {formatEffectDescription(effect)}
                    </div>
                  </Tooltip>,
                  document.body
                )}
              </EffectIcon>
            );
          })}
        </EffectsList>
      )}
    </Container>
  );
};