import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { PhilosophicalAspect, CombatChoice, CombatAction, Skill } from '../../types/game';
import { generateEnemyChoice } from '../../utils/combatMechanics';
import { BuffDebuffDisplay } from '../combat/BuffDebuffDisplay';
import { SkillSelectionModal } from '../combat/SkillSelectionModal';

const CombatContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
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

const CombatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CombatTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg};
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid ${theme.colors.border.primary};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const MenuButton = styled.button`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  color: ${theme.colors.text.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    color: white;
  }
`;

const RoundIndicator = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CombatMainArea = styled.div`
  flex: 1;
  display: flex;
  padding: ${theme.spacing.xl};
  gap: ${theme.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }
`;

const CombatantPanel = styled.div<{ side: 'left' | 'right' }>`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.panel};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

const PortraitContainer = styled.div`
  width: 250px;
  height: 350px;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  border: 4px solid ${theme.colors.border.primary};
  position: relative;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    width: 180px;
    height: 250px;
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 210px;
  }
`;

const PortraitImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom center;
`;

const CombatantName = styled.h3`
  color: ${theme.colors.text.accent};
  margin: 0;
  font-size: 1.4rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HPBar = styled.div`
  width: 100%;
  height: 20px;
  background: ${theme.colors.background.primary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  position: relative;
`;

const HPFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: ${props => {
    if (props.percentage > 60) return '#10b981';
    if (props.percentage > 30) return '#f59e0b';
    return '#ef4444';
  }};
  transition: width 0.5s ease;
  width: ${props => props.percentage}%;
`;

const HPText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const MPBar = styled.div`
  width: 100%;
  height: 15px;
  background: ${theme.colors.background.primary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const MPFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: #3b82f6;
  transition: width 0.5s ease;
  width: ${props => props.percentage}%;
`;

const ActionPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.panel};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

const ActionTitle = styled.h3`
  color: ${theme.colors.text.accent};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.3rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AspectSelection = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  justify-content: center;

  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
  }
`;

const AspectButton = styled.button<{ selected: boolean; aspect: PhilosophicalAspect }>`
  background: ${props => {
    if (!props.selected) return theme.colors.background.secondary;
    switch (props.aspect) {
      case 'body': return '#dc2626';
      case 'mind': return '#2563eb';
      case 'heart': return '#dc2626';
      default: return theme.colors.primary;
    }
  }};
  color: ${props => props.selected ? 'white' : theme.colors.text.primary};
  border: 2px solid ${props => {
    switch (props.aspect) {
      case 'body': return '#dc2626';
      case 'mind': return '#2563eb';
      case 'heart': return '#dc2626';
      default: return theme.colors.border.primary;
    }
  }};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    min-width: 100px;
    font-size: 0.9rem;

    .icon {
      font-size: 1rem;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
  }
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? theme.colors.background.secondary : theme.colors.primary};
  color: ${props => props.disabled ? theme.colors.text.muted : 'white'};
  border: 2px solid ${props => props.disabled ? theme.colors.border.dark : theme.colors.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: 0.9rem;
  }
`;

const BottomNavigation = styled.div`
  background: ${theme.colors.background.panel};
  border-top: 2px solid ${theme.colors.border.primary};
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${theme.spacing.md};
  z-index: 100;

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
    gap: ${theme.spacing.xs};
  }
`;

const BottomNavIcon = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.primary : theme.colors.background.secondary};
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.border.primary};
  color: ${props => props.active ? theme.colors.dark : theme.colors.text.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-width: 80px;
  flex: 1;

  &:hover {
    background: ${theme.colors.primary};
    color: ${theme.colors.dark};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 2rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;

    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }

  @media (max-width: 768px) {
    min-width: 60px;
    padding: ${theme.spacing.md};
  }
`;

const CombatLog = styled.div<{ visible: boolean }>`
  background: ${theme.colors.background.panel};
  border: ${theme.rpg.borderWidth} solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.md};
  height: ${props => props.visible ? '200px' : '0'};
  overflow-y: auto;
  margin-top: ${theme.spacing.lg};
  transition: height 0.3s ease;

  h4 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.sm} 0;
    font-size: 1rem;
    border-bottom: 1px solid ${theme.colors.border.secondary};
    padding-bottom: ${theme.spacing.xs};
  }

  .log-entry {
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.xs};
    font-size: 0.85rem;
    line-height: 1.3;
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};

    &.damage {
      background: rgba(239, 68, 68, 0.1);
      color: ${theme.colors.danger};
      font-weight: 600;
    }

    &.heal {
      background: rgba(34, 197, 94, 0.1);
      color: ${theme.colors.success};
      font-weight: 600;
    }

    &.system {
      background: rgba(59, 130, 246, 0.1);
      color: ${theme.colors.info};
      font-style: italic;
    }
  }

  @media (max-width: 768px) {
    height: ${props => props.visible ? '150px' : '0'};
    padding: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
  }
`;


const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? theme.colors.background.secondary : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2))'};
  border: 2px solid ${props => props.disabled ? theme.colors.border.dark : theme.colors.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  text-align: left;

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    border-color: ${theme.colors.accent};
  }

  .skill-header {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.xs};
  }

  .skill-icon {
    font-size: 1.5rem;
  }

  .skill-name {
    color: ${theme.colors.text.accent};
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
  }

  .skill-cost {
    color: ${theme.colors.info};
    font-size: 0.85rem;
    font-weight: bold;
    background: rgba(59, 130, 246, 0.2);
    padding: 2px 8px;
    border-radius: ${theme.borderRadius.sm};
  }

  .skill-description {
    color: ${theme.colors.text.secondary};
    font-size: 0.8rem;
    line-height: 1.3;
    margin-top: ${theme.spacing.xs};
  }

  .skill-damage {
    color: ${theme.colors.danger};
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: ${theme.spacing.xs};
  }
`;


export const CombatScreen: React.FC = () => {
  // Zustand store - selective subscriptions for better performance
  const combat = useGameStore(state => state.gameState.combat);
  const character = useGameStore(state => state.gameState.character);
  const endCombat = useGameStore(state => state.endCombat);
  const changeScreen = useGameStore(state => state.changeScreen);
  const updateCharacter = useGameStore(state => state.updateCharacter);
  
  const [selectedAspect, setSelectedAspect] = useState<PhilosophicalAspect | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [combatPhase, setCombatPhase] = useState<'aspect_selection' | 'action_selection' | 'skill_selection'>('aspect_selection');
  const [showBattleLog, setShowBattleLog] = useState(false);

  // Local state for tracking buff/debuff states across turns
  const [playerBuffs, setPlayerBuffs] = useState<import('../../types/game').CombatantBuffs>(() =>
    combat?.playerBuffs || { buffs: [], debuffs: [] }
  );
  const [enemyBuffs, setEnemyBuffs] = useState<import('../../types/game').CombatantBuffs>(() =>
    combat?.enemyBuffs || { buffs: [], debuffs: [] }
  );

  useEffect(() => {
    if (combat) {
      setCombatLog(combat.log.map(entry => `${entry.actor}: ${entry.action}`));
      setIsPlayerTurn(combat.turn === 'player');
    }
  }, [combat]);

  if (!combat) {
    return null;
  }

  const handleAspectSelect = (aspect: PhilosophicalAspect) => {
    setSelectedAspect(aspect);
    setCombatPhase('action_selection');
  };

  const handleAction = async (action: 'attack' | 'defend' | 'flee' | 'skills' | 'back') => {
    if (!selectedAspect || !isPlayerTurn) return;

    // Handle back action
    if (action === 'back') {
      setCombatPhase('aspect_selection');
      setSelectedAspect(null);
      return;
    }

    // Handle flee action separately since it's not a CombatAction
    if (action === 'flee') {
      setCombatLog(prev => [...prev.slice(-7), '🏃 You attempt to flee from combat!']);
      // TODO: Implement flee logic - close modal without progressing map node
      endCombat();
      return;
    }

    // Handle skills action
    if (action === 'skills') {
      setCombatPhase('skill_selection');
      return;
    }

    const playerChoice: CombatChoice = {
      aspect: selectedAspect,
      action: action as CombatAction
    };

    // Generate enemy choice
    const enemyChoice = generateEnemyChoice(combat.enemy, [playerChoice]);

    // Check for Agree to Disagree (both defend)
    if (action === 'defend' && enemyChoice.action === 'defend') {
      const agreeToDisagreeCounter = (combat as any).agreeToDisagreeCounter || 0;
      const newCounter = agreeToDisagreeCounter + 1;
      const threshold = getAgreeToDisagreeThreshold(combat.enemy.enemyTier || 'normal');

      if (newCounter >= threshold) {
        setCombatLog(prev => [...prev.slice(-7), `After ${newCounter} rounds of mutual defense, you both agree to disagree!`]);
        // End combat with agree to disagree resolution
        setTimeout(() => {
          endCombat();
        }, 2000);
        return;
      } else {
        setCombatLog(prev => [...prev.slice(-7), `Both sides defend their positions. Agree to Disagree counter: ${newCounter}/${threshold}`]);
        return;
      }
    }

    // Execute combat round
    try {
      const { CombatStateManager } = await import('../../utils/combatMechanics');
      const manager = new CombatStateManager(combat.player, combat.enemy);

      const result = await manager.executeTurn(playerChoice);

      // Update local buff states with returned values
      setPlayerBuffs(result.playerBuffs);
      setEnemyBuffs(result.enemyBuffs);

      setCombatLog(prev => [...prev.slice(-7), ...result.turnEffects]);

      if (result.combatEnded) {
        if (result.winner === 'agree_to_disagree') {
          setCombatLog(prev => [...prev.slice(-7), 'Combat ends in philosophical agreement!']);
        } else {
          setCombatLog(prev => [...prev.slice(-7), `Combat ended! ${result.winner === 'player' ? 'Victory!' : 'Defeat!'}`]);
        }
        setTimeout(() => {
          endCombat();
        }, 2000);
      }
    } catch (error) {
      console.error('Combat execution error:', error);
      // Fallback to simple combat resolution
      setCombatLog(prev => [...prev.slice(-7), `Combat resolution: ${action} with ${selectedAspect}`]);
    }
  };

  const getAgreeToDisagreeThreshold = (enemyTier: string): number => {
    switch (enemyTier) {
      case 'elite': return 5;
      case 'boss': return 10;
      default: return 3;
    }
  };


  const handleSkillSelectionBack = () => {
    setCombatPhase('action_selection');
  };

  const handleEquippedSkillSelect = async (skill: Skill) => {
    if (!selectedAspect || !isPlayerTurn || !combat) return;

    // Check if player has enough MP
    if (combat.player.mana < skill.manaCost) {
      setCombatLog(prev => [...prev.slice(-7), `❌ Not enough MP! Need ${skill.manaCost}, have ${combat.player.mana}`]);
      return;
    }

    setShowSkillModal(false);
    setCombatPhase('action_selection');

    // Execute skill
    try {
      const { executeFallacy, generateEnemyChoice } = await import('../../utils/combatMechanics');

      // Generate enemy choice
      const enemyChoice = generateEnemyChoice(combat.enemy, [{ aspect: selectedAspect, action: 'skill' }]);

      // Execute the fallacy
      const result = executeFallacy(
        combat.player,
        combat.enemy,
        skill.id,
        combat.enemyBuffs,
        combat.playerBuffs,
        selectedAspect === enemyChoice.aspect // has advantage if aspects match
      );

      // Deduct MP
      const newPlayerMana = combat.player.mana - skill.manaCost;
      updateCharacter({ mana: newPlayerMana });

      // Apply damage
      const newEnemyHealth = Math.max(0, combat.enemy.health - result.damage);

      setCombatLog(prev => [...prev.slice(-7),
        `💫 ${combat.player.name} uses ${skill.name}!`,
        `⚡ Deals ${result.damage} damage to ${combat.enemy.name}!`,
        ...result.effects
      ]);

      // Check if combat ended
      if (newEnemyHealth <= 0) {
        setCombatLog(prev => [...prev.slice(-7), `🎉 Victory! ${combat.enemy.name} has been defeated!`]);
        setTimeout(() => endCombat(), 2000);
      }
    } catch (error) {
      console.error('Error executing skill:', error);
      setCombatLog(prev => [...prev.slice(-7), '❌ Error using skill!']);
    }
  };

  const handleUseSkill = async (skillId: string) => {
    if (!selectedAspect || !isPlayerTurn || !combat) return;

    const skill = character.availableSkills.find(s => s.id === skillId);
    if (!skill) {
      setCombatLog(prev => [...prev.slice(-7), '❌ Skill not found!']);
      return;
    }

    // Check if player has enough MP
    if (combat.player.mana < skill.manaCost) {
      setCombatLog(prev => [...prev.slice(-7), `❌ Not enough MP! Need ${skill.manaCost}, have ${combat.player.mana}`]);
      return;
    }

    setShowSkillModal(false);

    // Execute skill
    try {
      const { executeFallacy, generateEnemyChoice } = await import('../../utils/combatMechanics');

      // Generate enemy choice
      const enemyChoice = generateEnemyChoice(combat.enemy, [{ aspect: selectedAspect, action: 'skill' }]);

      // Execute the fallacy
      const result = executeFallacy(
        combat.player,
        combat.enemy,
        skillId,
        combat.enemyBuffs,
        combat.playerBuffs,
        selectedAspect === enemyChoice.aspect // has advantage if aspects match
      );

      // Deduct MP
      const newPlayerMana = combat.player.mana - skill.manaCost;
      updateCharacter({ mana: newPlayerMana });

      // Apply damage
      const newEnemyHealth = Math.max(0, combat.enemy.health - result.damage);

      setCombatLog(prev => [...prev.slice(-7),
        `💫 ${combat.player.name} uses ${skill.name}!`,
        `⚡ Deals ${result.damage} damage to ${combat.enemy.name}!`,
        ...result.effects
      ]);

      // Check if combat ended
      if (newEnemyHealth <= 0) {
        setCombatLog(prev => [...prev.slice(-7), `🎉 Victory! ${combat.enemy.name} has been defeated!`]);
        setTimeout(() => endCombat(), 2000);
      }
    } catch (error) {
      console.error('Error executing skill:', error);
      setCombatLog(prev => [...prev.slice(-7), '❌ Error using skill!']);
    }
  };

  const getPortraitUrl = (entity: any) => {
    if (entity.portrait?.imageUrl) {
      return entity.portrait.imageUrl;
    }
    return '/portraits/c-begger.png'; // Default portrait
  };

  return (
    <CombatContainer>
      <CombatArea>
        <CombatMainArea>
          {/* Player Panel */}
          <CombatantPanel side="left">
            <PortraitContainer>
              <PortraitImage src={getPortraitUrl(combat.player)} alt={combat.player.name} />
            </PortraitContainer>
            <CombatantName>{combat.player.name}</CombatantName>

            <HPBar>
              <HPFill percentage={(combat.player.health / combat.player.maxHealth) * 100} />
              <HPText>{combat.player.health} / {combat.player.maxHealth}</HPText>
            </HPBar>

            <MPBar>
              <MPFill percentage={(combat.player.mana / combat.player.maxMana) * 100} />
            </MPBar>

            <BuffDebuffDisplay
              buffs={[...playerBuffs.buffs, ...playerBuffs.debuffs]}
              target="player"
            />
          </CombatantPanel>

          {/* Enemy Panel */}
          <CombatantPanel side="right">
            <PortraitContainer>
              <PortraitImage src={getPortraitUrl(combat.enemy)} alt={combat.enemy.name} />
            </PortraitContainer>
            <CombatantName>{combat.enemy.name}</CombatantName>

            <HPBar>
              <HPFill percentage={(combat.enemy.health / combat.enemy.maxHealth) * 100} />
              <HPText>{combat.enemy.health} / {combat.enemy.maxHealth}</HPText>
            </HPBar>

            <MPBar>
              <MPFill percentage={(combat.enemy.mana / combat.enemy.maxMana) * 100} />
            </MPBar>

            <BuffDebuffDisplay
              buffs={[...enemyBuffs.buffs, ...enemyBuffs.debuffs]}
              target="enemy"
            />
          </CombatantPanel>
        </CombatMainArea>

        <ActionPanel>
          <ActionTitle>Your Turn</ActionTitle>

          {combatPhase === 'aspect_selection' && (
            <>
              <AspectSelection>
                {(['body', 'mind', 'heart'] as PhilosophicalAspect[]).map((aspect) => (
                  <AspectButton
                    key={aspect}
                    selected={selectedAspect === aspect}
                    aspect={aspect}
                    onClick={() => handleAspectSelect(aspect)}
                  >
                    <span className="icon">
                      {aspect === 'body' ? '💪' : aspect === 'mind' ? '🧠' : '❤️'}
                    </span>
                    <span>{aspect.charAt(0).toUpperCase() + aspect.slice(1)}</span>
                  </AspectButton>
                ))}
              </AspectSelection>
            </>
          )}

          {combatPhase === 'action_selection' && selectedAspect && (
            <>
              <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
                Selected: {selectedAspect.charAt(0).toUpperCase() + selectedAspect.slice(1)}
              </div>

              <ActionButtons>
                <ActionButton onClick={() => handleAction('attack')}>
                  ⚔️ Attack
                </ActionButton>
                <ActionButton onClick={() => handleAction('skills')}>
                  ✨ Skills
                </ActionButton>
                <ActionButton onClick={() => handleAction('defend')}>
                  🛡️ Defend
                </ActionButton>
                <ActionButton onClick={() => handleAction('flee')}>
                  🏃 Flee
                </ActionButton>
                <ActionButton onClick={() => handleAction('back')}>
                  ⬅️ Back
                </ActionButton>
              </ActionButtons>
            </>
          )}

          {combatPhase === 'skill_selection' && selectedAspect && (
            <>
              <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
                Select {selectedAspect.charAt(0).toUpperCase() + selectedAspect.slice(1)} Skill
              </div>

              <SkillGrid>
                {character.equippedSkills[selectedAspect]?.length > 0 ? (
                  character.equippedSkills[selectedAspect].map((skill) => {
                    const canAfford = combat && combat.player.mana >= skill.manaCost;
                    return (
                      <SkillCard
                        key={skill.id}
                        disabled={!canAfford}
                        onClick={() => canAfford && handleEquippedSkillSelect(skill)}
                        title={!canAfford ? `Not enough MP! Need ${skill.manaCost}, have ${combat?.player.mana}` : ''}
                      >
                        <div className="skill-header">
                          <span className="skill-icon">{skill.icon}</span>
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-cost">{skill.manaCost} MP</span>
                        </div>
                        <div className="skill-description">{skill.description}</div>
                        {skill.damage && (
                          <div className="skill-damage">⚔️ {skill.damage} base damage</div>
                        )}
                      </SkillCard>
                    );
                  })
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: theme.colors.text.muted, padding: theme.spacing.xl }}>
                    No skills equipped for {selectedAspect}. Go to Skills tab to equip some!
                  </div>
                )}
              </SkillGrid>

              <ActionButton onClick={handleSkillSelectionBack}>
                ⬅️ Back
              </ActionButton>
            </>
          )}
        </ActionPanel>

        <CombatLog visible={showBattleLog}>
          <h4>📜 Combat Log</h4>
          {combatLog.slice(-8).map((entry, index) => (
            <div key={index} className="log-entry">{entry}</div>
          ))}
        </CombatLog>
      </CombatArea>

      {/* Skill Selection Modal */}
      <SkillSelectionModal
        isOpen={showSkillModal}
        selectedAspect={selectedAspect}
        onSkillSelect={(skill) => handleUseSkill(skill.id)}
        onClose={() => setShowSkillModal(false)}
        playerMana={combat?.player.mana || 0}
        character={character}
      />
    </CombatContainer>
  );
};
