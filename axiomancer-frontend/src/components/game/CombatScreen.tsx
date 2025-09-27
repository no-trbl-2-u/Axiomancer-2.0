import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { PhilosophicalAspect, CombatAction, CombatChoice, CombatRoundResult } from '../../types/game';
import { resolveCombatRound, generateEnemyChoice, createPhilosophicalGoblin } from '../../utils/combatMechanics';

const CombatContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  padding: 120px ${theme.spacing.xl} 100px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(139, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 70%);
    pointer-events: none;
  }
`;

const BattleArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xl};
`;

const CharacterSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const CharacterCard = styled.div<{ isEnemy?: boolean }>`
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${props => props.isEnemy ? theme.colors.danger : theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  width: 100%;
  text-align: center;
  box-shadow: ${theme.shadows.panel};
  position: relative;
  z-index: 1;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CharacterImage = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto ${theme.spacing.md} auto;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    font-size: 3rem;
    opacity: 0.6;
  }
`;

const EnemyDescription = styled.div`
  margin: ${theme.spacing.sm} 0;
  padding: ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.85rem;
  color: ${theme.colors.text.secondary};
  line-height: 1.3;
  font-style: italic;
`;

const WeaknessStrengthInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.sm};
  font-size: 0.75rem;
  
  .weakness, .strength {
    padding: 2px 6px;
    border-radius: ${theme.borderRadius.sm};
    font-weight: bold;
    text-transform: uppercase;
  }
  
  .weakness {
    background: rgba(220, 38, 38, 0.2);
    color: #fca5a5;
  }
  
  .strength {
    background: rgba(16, 185, 129, 0.2);
    color: #86efac;
  }
`;

const CharacterName = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text.accent};
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
`;

const HealthBar = styled.div`
  width: 100%;
  height: 20px;
  background: ${theme.colors.health.background};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${theme.spacing.sm};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
    pointer-events: none;
  }
`;

const HealthFill = styled.div<{ percentage: number; isEnemy?: boolean }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: ${props => props.isEnemy ? theme.colors.danger : theme.colors.health.high};
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
  }
`;

const HealthText = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
  font-family: monospace;
`;

const ManaBar = styled.div`
  width: 100%;
  height: 16px;
  background: ${theme.colors.mana.background};
  border: 2px solid ${theme.colors.border.dark};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${theme.spacing.sm};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
    pointer-events: none;
  }
`;

const ManaFill = styled.div<{ percentage: number }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: ${theme.colors.mana.high};
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
  }
`;

const ManaText = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.text.muted};
  font-family: monospace;
`;

const CombatActions = styled.div`
  background: ${theme.colors.background.panel};
  border-top: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  padding: ${theme.spacing.lg};
  min-height: 220px;
  position: relative;
  z-index: 1;
  box-shadow: ${theme.shadows.panel};
`;

const PhaseIndicator = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.button};

  h3 {
    margin: 0;
    color: ${theme.colors.text.accent};
    font-size: 1.3rem;
    text-transform: uppercase;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  p {
    margin: ${theme.spacing.xs} 0 0 0;
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
  }
`;

const PhilosophyChoice = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const AspectButton = styled.button<{ selected?: boolean; aspect: PhilosophicalAspect }>`
  background: ${props => {
    if (props.selected) {
      switch (props.aspect) {
        case 'body': return theme.colors.background.panel;
        case 'mind': return theme.colors.background.panel;
        case 'heart': return theme.colors.background.panel;
        default: return theme.colors.background.panel;
      }
    }
    return theme.colors.background.secondary;
  }};
  border: ${theme.rpg.borderWidth} solid ${props => {
    if (props.selected) {
      switch (props.aspect) {
        case 'body': return '#dc2626';
        case 'mind': return '#2563eb';
        case 'heart': return '#f59e0b';
        default: return theme.colors.border.primary;
      }
    }
    return theme.colors.border.dark;
  }};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: ${theme.shadows.button};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.glow};
    border-color: ${props => {
      switch (props.aspect) {
        case 'body': return '#dc2626';
        case 'mind': return '#2563eb';
        case 'heart': return '#f59e0b';
        default: return theme.colors.border.primary;
      }
    }};
  }

  &:active {
    transform: translateY(-1px);
  }

  .aspect-icon {
    font-size: 3rem;
    margin-bottom: ${theme.spacing.sm};
  }

  .aspect-name {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: ${theme.spacing.xs};
    text-transform: uppercase;
    color: ${props => props.selected ? theme.colors.text.accent : theme.colors.text.primary};
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .aspect-description {
    font-size: 0.9rem;
    color: ${theme.colors.text.secondary};
    text-align: center;
    line-height: 1.2;
  }
`;

const ActionChoice = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const ActionButton = styled.button<{ selected?: boolean; action: CombatAction }>`
  background: ${props => props.selected
    ? theme.colors.background.panel
    : theme.colors.background.secondary};
  border: ${theme.rpg.borderWidth} solid ${props => props.selected ? theme.colors.border.primary : theme.colors.border.dark};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  box-shadow: ${theme.shadows.button};

  &:hover {
    transform: translateY(-2px);
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.border.primary};
    box-shadow: ${theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }

  .action-icon {
    font-size: 2rem;
    margin-bottom: ${theme.spacing.xs};
    display: block;
  }

  .action-name {
    font-weight: bold;
    margin-bottom: ${theme.spacing.xs};
    display: block;
    text-transform: uppercase;
    color: ${props => props.selected ? theme.colors.text.accent : theme.colors.text.primary};
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .action-description {
    font-size: 0.8rem;
    color: ${theme.colors.text.secondary};
    line-height: 1.2;
  }
`;

const ConfirmButton = styled.button<{ disabled?: boolean }>`
  background: ${theme.colors.success};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.success};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-size: 1.2rem;
  font-weight: bold;
  opacity: ${props => props.disabled ? 0.5 : 1};
  margin: 0 auto;
  display: block;
  text-transform: uppercase;
  box-shadow: ${theme.shadows.button};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  &:hover {
    ${props => !props.disabled && `
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.glow};
      background: ${theme.colors.success};
      border-color: ${theme.colors.border.primary};
    `}
  }

  &:active {
    ${props => !props.disabled && `
      transform: translateY(0);
    `}
  }
`;

const AdvantageIndicator = styled.div<{ player: number; enemy: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  .advantage-side {
    text-align: center;
    flex: 1;
  }

  .advantage-count {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${theme.colors.primary};
  }

  .advantage-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
  }
`;

const RoundResult = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};

  .result-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.primary};
  }

  .choices-display {
    display: flex;
    justify-content: space-around;
    margin-bottom: ${theme.spacing.lg};
  }

  .choice-display {
    text-align: center;
  }

  .choice-aspect {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.xs};
    text-transform: uppercase;
  }

  .choice-action {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .effects-list {
    text-align: left;
    margin-top: ${theme.spacing.md};
  }

  .effect {
    margin-bottom: ${theme.spacing.xs};
    color: rgba(255, 255, 255, 0.9);
  }
`;

const TurnIndicator = styled.div<{ isPlayerTurn: boolean }>`
  text-align: center;
  padding: ${theme.spacing.md};
  background: ${props => props.isPlayerTurn
    ? 'linear-gradient(45deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))'
    : 'linear-gradient(45deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))'};
  border: 2px solid ${props => props.isPlayerTurn ? '#10b981' : '#ef4444'};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};

  h3 {
    margin: 0;
    color: ${props => props.isPlayerTurn ? '#10b981' : '#ef4444'};
  }
`;

const CombatLog = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  height: 100px;
  overflow-y: auto;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const aspectData = {
  body: {
    icon: '💪',
    name: 'Body',
    description: 'Physical strength and material force',
    color: '#dc2626'
  },
  mind: {
    icon: '🧠',
    name: 'Mind',
    description: 'Rational thought and logical analysis',
    color: '#2563eb'
  },
  heart: {
    icon: '❤️',
    name: 'Heart',
    description: 'Emotion, intuition, and compassion',
    color: '#f59e0b'
  }
};

const actionData = {
  attack: {
    icon: '⚔️',
    name: 'Attack',
    description: 'Direct aggressive action'
  },
  defend: {
    icon: '🛡️',
    name: 'Defend',
    description: 'Protective stance'
  },
  special: {
    icon: '✨',
    name: 'Special',
    description: 'Unique philosophical technique'
  },
  skill: {
    icon: '📚',
    name: 'Use Skill',
    description: 'Employ learned philosophical techniques'
  }
};

export const CombatScreen = React.memo(() => {
  const { gameState, endCombat, updateCharacter } = useGame();
  const { character, combat } = gameState;

  const [enemy, setEnemy] = useState(() => combat?.enemy || createPhilosophicalGoblin());
  const [phase, setPhase] = useState<'choosing_aspect' | 'choosing_action' | 'resolving' | 'ended'>('choosing_aspect');
  const [playerChoice, setPlayerChoice] = useState<Partial<CombatChoice>>({});
  const [roundResult, setRoundResult] = useState<CombatRoundResult | null>(null);
  const [round, setRound] = useState(1);
  const [advantages, setAdvantages] = useState({ player: 0, enemy: 0 });
  const [playerChoiceHistory, setPlayerChoiceHistory] = useState<CombatChoice[]>([]);

  // Update enemy when combat state changes
  useEffect(() => {
    if (combat?.enemy) {
      setEnemy(combat.enemy);
      setPhase('choosing_aspect');
      setPlayerChoice({});
      setRoundResult(null);
      setRound(1);
      setAdvantages({ player: 0, enemy: 0 });
      setPlayerChoiceHistory([]);
    }
  }, [combat?.enemy?.id]);

  const selectAspect = (aspect: PhilosophicalAspect) => {
    setPlayerChoice({ aspect });
    setPhase('choosing_action');
  };

  const selectAction = (action: CombatAction) => {
    const fullChoice: CombatChoice = {
      aspect: playerChoice.aspect!,
      action
    };
    setPlayerChoice(fullChoice);
  };

  const confirmChoice = () => {
    if (!playerChoice.aspect || !playerChoice.action) return;

    const fullPlayerChoice = playerChoice as CombatChoice;
    const enemyChoice = generateEnemyChoice(enemy, playerChoiceHistory);

    const result = resolveCombatRound(character, enemy, fullPlayerChoice, enemyChoice);

    setRoundResult(result);
    setPhase('resolving');
    setPlayerChoiceHistory(prev => [...prev, fullPlayerChoice]);

    // Update advantages
    if (result.advantage === 'player') {
      setAdvantages(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (result.advantage === 'enemy') {
      setAdvantages(prev => ({ ...prev, enemy: prev.enemy + 1 }));
    }

    // Apply damage
    updateCharacter({ health: Math.max(0, character.health - result.damage.toPlayer) });
    setEnemy(prev => ({ ...prev, health: Math.max(0, prev.health - result.damage.toEnemy) }));

    // Check for combat end
    setTimeout(() => {
      if (character.health - result.damage.toPlayer <= 0) {
        setPhase('ended');
        setTimeout(() => endCombat(), 3000);
      } else if (enemy.health - result.damage.toEnemy <= 0) {
        setPhase('ended');
        setTimeout(() => endCombat(), 3000);
      } else {
        nextRound();
      }
    }, 3000);
  };

  const nextRound = () => {
    setPlayerChoice({});
    setRoundResult(null);
    setPhase('choosing_aspect');
    setRound(prev => prev + 1);
  };

  const playerHealthPercent = (character.health / character.maxHealth) * 100;
  const playerManaPercent = (character.mana / character.maxMana) * 100;
  const enemyHealthPercent = (enemy.health / enemy.maxHealth) * 100;
  const enemyManaPercent = (enemy.mana / enemy.maxMana) * 100;

  const getPhaseText = () => {
    switch (phase) {
      case 'choosing_aspect':
        return {
          title: 'Choose Your Philosophical Aspect',
          description: 'Select the philosophical foundation for your approach'
        };
      case 'choosing_action':
        return {
          title: 'Choose Your Action',
          description: `With ${aspectData[playerChoice.aspect!]?.name} as your foundation, how will you act?`
        };
      case 'resolving':
        return {
          title: 'Round Results',
          description: 'The philosophical clash unfolds...'
        };
      case 'ended':
        return {
          title: 'Combat Concluded',
          description: character.health <= 0 ? 'You have been defeated...' : 'Victory through philosophical mastery!'
        };
      default:
        return { title: '', description: '' };
    }
  };

  return (
    <CombatContainer>
      <BattleArea>
        <CharacterSide>
          <CharacterCard>
            <div>
              <CharacterImage>
                <div className="placeholder">🧙‍♂️</div>
              </CharacterImage>
              <CharacterName>{character.name}</CharacterName>
            </div>
            <div>
              <HealthBar>
                <HealthFill percentage={playerHealthPercent} />
              </HealthBar>
              <HealthText>{character.health} / {character.maxHealth} HP</HealthText>
              <ManaBar>
                <ManaFill percentage={playerManaPercent} />
              </ManaBar>
              <ManaText>{character.mana} / {character.maxMana} MP</ManaText>
            </div>
          </CharacterCard>
        </CharacterSide>

        <div style={{ textAlign: 'center', fontSize: '3rem', position: 'relative', zIndex: 1 }}>⚔️</div>

        <CharacterSide>
          <CharacterCard isEnemy>
            <div>
              <CharacterImage>
                {enemy.image ? (
                  <img src={enemy.image} alt={enemy.name} />
                ) : (
                  <div className="placeholder">👹</div>
                )}
              </CharacterImage>
              <CharacterName>{enemy.name}</CharacterName>
              <EnemyDescription>{enemy.description}</EnemyDescription>
              {(enemy.weaknesses || enemy.strengths) && (
                <WeaknessStrengthInfo>
                  {enemy.weaknesses && (
                    <div className="weakness">
                      Weak: {enemy.weaknesses.join(', ')}
                    </div>
                  )}
                  {enemy.strengths && (
                    <div className="strength">
                      Strong: {enemy.strengths.join(', ')}
                    </div>
                  )}
                </WeaknessStrengthInfo>
              )}
            </div>
            <div>
              <HealthBar>
                <HealthFill percentage={enemyHealthPercent} isEnemy />
              </HealthBar>
              <HealthText>{enemy.health} / {enemy.maxHealth} HP</HealthText>
              <ManaBar>
                <ManaFill percentage={enemyManaPercent} />
              </ManaBar>
              <ManaText>{enemy.mana} / {enemy.maxMana} MP</ManaText>
            </div>
          </CharacterCard>
        </CharacterSide>
      </BattleArea>

      <CombatActions>
        <PhaseIndicator>
          <h3>{getPhaseText().title}</h3>
          <p>{getPhaseText().description}</p>
        </PhaseIndicator>

        <AdvantageIndicator player={advantages.player} enemy={advantages.enemy}>
          <div className="advantage-side">
            <div className="advantage-count">{advantages.player}</div>
            <div className="advantage-label">Your Advantages</div>
          </div>
          <div style={{ textAlign: 'center', color: theme.colors.primary, fontSize: '1.2rem' }}>
            Round {round}
          </div>
          <div className="advantage-side">
            <div className="advantage-count">{advantages.enemy}</div>
            <div className="advantage-label">Enemy Advantages</div>
          </div>
        </AdvantageIndicator>

        {phase === 'choosing_aspect' && (
          <PhilosophyChoice>
            {(Object.keys(aspectData) as PhilosophicalAspect[]).map(aspect => (
              <AspectButton
                key={aspect}
                aspect={aspect}
                selected={playerChoice.aspect === aspect}
                onClick={() => selectAspect(aspect)}
              >
                <div className="aspect-icon">{aspectData[aspect].icon}</div>
                <div className="aspect-name">{aspectData[aspect].name}</div>
                <div className="aspect-description">{aspectData[aspect].description}</div>
              </AspectButton>
            ))}
          </PhilosophyChoice>
        )}

        {phase === 'choosing_action' && (
          <>
            <ActionChoice>
              {(Object.keys(actionData) as CombatAction[]).map(action => (
                <ActionButton
                  key={action}
                  action={action}
                  selected={playerChoice.action === action}
                  onClick={() => selectAction(action)}
                >
                  <div className="action-icon">{actionData[action].icon}</div>
                  <div className="action-name">{actionData[action].name}</div>
                  <div className="action-description">{actionData[action].description}</div>
                </ActionButton>
              ))}
            </ActionChoice>
            <ConfirmButton
              disabled={!playerChoice.aspect || !playerChoice.action}
              onClick={confirmChoice}
            >
              Confirm Choice
            </ConfirmButton>
          </>
        )}

        {phase === 'resolving' && roundResult && (
          <RoundResult>
            <div className="result-title">
              {roundResult.advantage === 'player' && 'You gain the advantage!'}
              {roundResult.advantage === 'enemy' && 'Enemy gains the advantage!'}
              {roundResult.advantage === 'none' && 'No advantage gained'}
            </div>
            <div className="choices-display">
              <div className="choice-display">
                <div className="choice-aspect" style={{ color: aspectData[roundResult.playerChoice.aspect].color }}>
                  {aspectData[roundResult.playerChoice.aspect].icon} {aspectData[roundResult.playerChoice.aspect].name}
                </div>
                <div className="choice-action">
                  {actionData[roundResult.playerChoice.action].icon} {actionData[roundResult.playerChoice.action].name}
                </div>
              </div>
              <div style={{ fontSize: '2rem', alignSelf: 'center' }}>VS</div>
              <div className="choice-display">
                <div className="choice-aspect" style={{ color: aspectData[roundResult.enemyChoice.aspect].color }}>
                  {aspectData[roundResult.enemyChoice.aspect].icon} {aspectData[roundResult.enemyChoice.aspect].name}
                </div>
                <div className="choice-action">
                  {actionData[roundResult.enemyChoice.action].icon} {actionData[roundResult.enemyChoice.action].name}
                </div>
              </div>
            </div>
            <div className="effects-list">
              {roundResult.effects.map((effect, index) => (
                <div key={index} className="effect">• {effect}</div>
              ))}
              {roundResult.damage.toEnemy > 0 && (
                <div className="effect">• {enemy.name} takes {roundResult.damage.toEnemy} damage</div>
              )}
              {roundResult.damage.toPlayer > 0 && (
                <div className="effect">• {character.name} takes {roundResult.damage.toPlayer} damage</div>
              )}
            </div>
          </RoundResult>
        )}

        {phase === 'ended' && (
          <RoundResult>
            <div className="result-title">
              {character.health <= 0 ? 'Defeat' : 'Victory!'}
            </div>
            <div className="effects-list">
              {character.health <= 0 ? (
                <div className="effect">The philosophical challenge proved too great...</div>
              ) : (
                <>
                  <div className="effect">You have mastered the art of philosophical combat!</div>
                  <div className="effect">Your understanding of Body &gt; Mind &gt; Heart &gt; Body deepens.</div>
                </>
              )}
            </div>
          </RoundResult>
        )}
      </CombatActions>
    </CombatContainer>
  );
});