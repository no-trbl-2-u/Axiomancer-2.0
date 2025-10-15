import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { PhilosophicalAspect, CombatAction, Skill } from '../../types/game';
import { BuffDebuffDisplay } from '../combat/BuffDebuffDisplay';
import { SkillSelectionModal } from '../combat/SkillSelectionModal';
import { MasterCombatStateManager } from '../../utils/combatStateManager';
import { CombatState, CombatResolutionStep, BattleLogEntry } from '../../types/combatState';
import { addPersistentEffects } from '../../utils/persistentEffects';

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

const TurnDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const TurnNumber = styled.div`
  color: ${theme.colors.text.accent};
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PhaseIndicator = styled.div<{ phase: string }>`
  color: ${props => {
    switch (props.phase) {
      case 'selection': return theme.colors.info;
      case 'resolution': return theme.colors.warning;
      case 'turn_end': return theme.colors.success;
      case 'ended': return theme.colors.danger;
      default: return theme.colors.text.secondary;
    }
  }};
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid currentColor;

  @media (max-width: 768px) {
    font-size: 0.8rem;
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
  max-height: 300px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    max-height: 250px;
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

const ResolutionOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ResolutionMessage = styled.div`
  background: ${theme.colors.background.panel};
  border: 3px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  max-width: 500px;
  
  h3 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.md} 0;
    font-size: 1.5rem;
  }
  
  p {
    color: ${theme.colors.text.primary};
    margin: 0;
    font-size: 1.1rem;
  }
`;

const BattleLog = styled.div<{ visible: boolean }>`
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
    margin-bottom: ${theme.spacing.sm};
    font-size: 0.85rem;
    line-height: 1.3;
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    border-left: 3px solid ${theme.colors.border.primary};

    .turn {
      color: ${theme.colors.text.accent};
      font-weight: bold;
    }

    .decisions {
      color: ${theme.colors.info};
      font-weight: 600;
    }

    .result {
      color: ${theme.colors.success};
      font-style: italic;
      margin-top: ${theme.spacing.xs};
    }
  }

  @media (max-width: 768px) {
    height: ${props => props.visible ? '150px' : '0'};
    padding: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
  }
`;

export const CombatScreen: React.FC = () => {
  // Zustand store
  const combat = useGameStore(state => state.gameState.combat);
  const character = useGameStore(state => state.gameState.character);
  const endCombat = useGameStore(state => state.endCombat);
  const updateCharacter = useGameStore(state => state.updateCharacter);
  
  // Master Combat State Manager
  const combatManagerRef = useRef<MasterCombatStateManager | null>(null);
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<PhilosophicalAspect | null>(null);
  const [combatPhase, setCombatPhase] = useState<'aspect_selection' | 'action_selection' | 'skill_selection'>('aspect_selection');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showBattleLog, setShowBattleLog] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [currentResolutionStep, setCurrentResolutionStep] = useState<CombatResolutionStep | null>(null);

  // Initialize combat manager
  useEffect(() => {
    console.log('🎮 Combat useEffect triggered:', { combat: !!combat, manager: !!combatManagerRef.current });
    if (combat && !combatManagerRef.current) {
      console.log('🚀 Initializing MasterCombatStateManager with:', { player: combat.player?.name, enemy: combat.enemy?.name });
      try {
        combatManagerRef.current = new MasterCombatStateManager(combat.player, combat.enemy);
        
        // Set up callbacks for visual presentation
        combatManagerRef.current.setCallbacks({
          onStepExecute: (step: CombatResolutionStep) => {
            console.log('⚡ Combat step executed:', step);
            setCurrentResolutionStep(step);
            // Update combat state to reflect the step
            if (combatManagerRef.current) {
              setCombatState(combatManagerRef.current.getCombatState());
            }
          },
          onTurnComplete: (battleLog: BattleLogEntry) => {
            console.log('✅ Turn completed:', battleLog);
          },
          onCombatEnd: (winner: string, result: string) => {
            console.log('🏁 Combat ended:', winner, result);
            handleCombatEnd(winner, result);
          }
        });

        const initialState = combatManagerRef.current.getCombatState();
        console.log('📊 Initial combat state:', initialState);
        setCombatState(initialState);
      } catch (error) {
        console.error('❌ Error initializing combat manager:', error);
      }
    }
  }, [combat]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      combatManagerRef.current = null;
    };
  }, []);

  if (!combat || !combatState) {
    return null;
  }

  const handleAspectSelect = (aspect: PhilosophicalAspect) => {
    if (isProcessingTurn || combatState.phase !== 'selection') return;
    setSelectedAspect(aspect);
    setCombatPhase('action_selection');
  };

  const handleAction = async (action: 'attack' | 'defend' | 'flee' | 'skills' | 'back') => {
    console.log('🎯 Action triggered:', { action, selectedAspect, isProcessingTurn, hasManager: !!combatManagerRef.current });
    
    if (!selectedAspect || isProcessingTurn || !combatManagerRef.current) {
      console.log('❌ Action blocked:', { selectedAspect, isProcessingTurn, hasManager: !!combatManagerRef.current });
      return;
    }

    // Handle back action
    if (action === 'back') {
      setCombatPhase('aspect_selection');
      setSelectedAspect(null);
      return;
    }

    // Handle flee action
    if (action === 'flee') {
      handleCombatEnd('fled', 'You fled from combat!');
      return;
    }

    // Handle skills action
    if (action === 'skills') {
      setCombatPhase('skill_selection');
      return;
    }

    // Execute combat turn
    console.log('⚔️ Executing combat turn:', { aspect: selectedAspect, action });
    setIsProcessingTurn(true);
    
    try {
      const result = await combatManagerRef.current.executeTurn({
        aspect: selectedAspect,
        action: action as CombatAction,
      });

      console.log('📊 Combat turn result:', result);

      // Update local state
      setCombatState(combatManagerRef.current.getCombatState());

      if (result.combatEnded) {
        handleCombatEnd(result.winner || 'unknown', result.battleLogEntry?.result || 'Combat ended');
      } else {
        // Reset for next turn
        setSelectedAspect(null);
        setCombatPhase('aspect_selection');
      }
    } catch (error) {
      console.error('❌ Combat execution error:', error);
    } finally {
      setIsProcessingTurn(false);
      setCurrentResolutionStep(null);
    }
  };

  const handleSkillSelect = async (skill: Skill) => {
    if (!selectedAspect || isProcessingTurn || !combatManagerRef.current) return;

    // Check mana cost
    if (combatState.player.mana < skill.manaCost) {
      return; // Not enough mana
    }

    setShowSkillModal(false);
    setCombatPhase('action_selection');
    setIsProcessingTurn(true);

    try {
      const result = await combatManagerRef.current.executeTurn({
        aspect: selectedAspect,
        action: 'special',
        selectedSkill: skill.id,
      });

      setCombatState(combatManagerRef.current.getCombatState());

      if (result.combatEnded) {
        handleCombatEnd(result.winner || 'unknown', result.battleLogEntry?.result || 'Combat ended');
      } else {
        setSelectedAspect(null);
        setCombatPhase('aspect_selection');
      }
    } catch (error) {
      console.error('Skill execution error:', error);
    } finally {
      setIsProcessingTurn(false);
      setCurrentResolutionStep(null);
    }
  };

  const handleCombatEnd = (_winner: string, _result: string) => {
    if (!combatManagerRef.current) return;

    // Export final combat state
    const finalState = combatManagerRef.current.exportFinalState();

    // Update character with persistent effects and health/mana
    const updatedCharacter = addPersistentEffects(
      {
        ...character,
        health: finalState.playerHealth,
        mana: finalState.playerMana,
      },
      finalState.persistentEffects
    );

    updateCharacter(updatedCharacter);

    // End combat
    setTimeout(() => {
      endCombat();
    }, 2000);
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
        <CombatTopBar>
          <MenuButton onClick={() => setShowBattleLog(!showBattleLog)}>
            📜 Battle Log
          </MenuButton>
          
          <TurnDisplay>
            <TurnNumber>Turn {combatState.turnNumber}</TurnNumber>
            <PhaseIndicator phase={combatState.phase}>
              {combatState.phase.replace('_', ' ')}
            </PhaseIndicator>
          </TurnDisplay>
          
          <MenuButton onClick={() => handleAction('flee')}>
            🏃 Flee
          </MenuButton>
        </CombatTopBar>

        <CombatMainArea>
          {/* Player Panel */}
          <CombatantPanel side="left">
            <PortraitContainer>
              <PortraitImage src={getPortraitUrl(combatState.originalPlayer)} alt={combatState.originalPlayer.name} />
            </PortraitContainer>
            <CombatantName>{combatState.originalPlayer.name}</CombatantName>

            <HPBar>
              <HPFill percentage={(combatState.player.health / combatState.player.maxHealth) * 100} />
              <HPText>{combatState.player.health} / {combatState.player.maxHealth}</HPText>
            </HPBar>

            <MPBar>
              <MPFill percentage={(combatState.player.mana / combatState.player.maxMana) * 100} />
            </MPBar>

            <BuffDebuffDisplay
              buffs={combatState.player.buffs}
              debuffs={combatState.player.debuffs}
              target="player"
            />
          </CombatantPanel>

          {/* Enemy Panel */}
          <CombatantPanel side="right">
            <PortraitContainer>
              <PortraitImage src={getPortraitUrl(combatState.originalEnemy)} alt={combatState.originalEnemy.name} />
            </PortraitContainer>
            <CombatantName>{combatState.originalEnemy.name}</CombatantName>

            <HPBar>
              <HPFill percentage={(combatState.enemy.health / combatState.enemy.maxHealth) * 100} />
              <HPText>{combatState.enemy.health} / {combatState.enemy.maxHealth}</HPText>
            </HPBar>

            <MPBar>
              <MPFill percentage={(combatState.enemy.mana / combatState.enemy.maxMana) * 100} />
            </MPBar>

            <BuffDebuffDisplay
              buffs={combatState.enemy.buffs}
              debuffs={combatState.enemy.debuffs}
              target="enemy"
            />
          </CombatantPanel>
        </CombatMainArea>

        <ActionPanel>
          <ActionTitle>
            {isProcessingTurn ? 'Resolving Actions...' : 'Your Turn'}
          </ActionTitle>

          {combatPhase === 'aspect_selection' && !isProcessingTurn && (
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
          )}

          {combatPhase === 'action_selection' && selectedAspect && !isProcessingTurn && (
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
                <ActionButton onClick={() => handleAction('back')}>
                  ⬅️ Back
                </ActionButton>
              </ActionButtons>
            </>
          )}

           {combatPhase === 'skill_selection' && selectedAspect && !isProcessingTurn && (
             <>
               <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
                 Select {selectedAspect.charAt(0).toUpperCase() + selectedAspect.slice(1)} Skill
               </div>

               <div style={{ marginBottom: theme.spacing.lg }}>
                 {character.equippedSkills[selectedAspect]?.length > 0 ? (
                   character.equippedSkills[selectedAspect].map((skill) => {
                     const canAfford = combatState.player.mana >= skill.manaCost;
                     return (
                       <ActionButton
                         key={skill.id}
                         disabled={!canAfford}
                         onClick={() => canAfford && handleSkillSelect(skill)}
                         style={{ 
                           display: 'block', 
                           width: '100%', 
                           marginBottom: theme.spacing.sm,
                           textAlign: 'left',
                           padding: theme.spacing.md
                         }}
                         title={!canAfford ? `Not enough MP! Need ${skill.manaCost}, have ${combatState.player.mana}` : ''}
                       >
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span>{skill.icon} {skill.name}</span>
                           <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{skill.manaCost} MP</span>
                         </div>
                         <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>
                           {skill.description}
                         </div>
                       </ActionButton>
                     );
                   })
                 ) : (
                   <div style={{ textAlign: 'center', color: theme.colors.text.muted, padding: theme.spacing.lg }}>
                     No skills equipped for {selectedAspect}. Go to Skills tab to equip some!
                   </div>
                 )}
               </div>

               <ActionButton onClick={() => setCombatPhase('action_selection')}>
                 ⬅️ Back
               </ActionButton>
             </>
           )}
        </ActionPanel>

        <BattleLog visible={showBattleLog}>
          <h4>📜 Battle Chronicle</h4>
          {combatState.battleLog.map((entry, index) => (
            <div key={index} className="log-entry">
              <div className="turn">Turn {entry.turn}</div>
              <div className="decisions">{entry.decisions}</div>
              <div>{entry.log}</div>
              {entry.result && <div className="result">{entry.result}</div>}
            </div>
          ))}
        </BattleLog>
      </CombatArea>

      {/* Resolution Overlay */}
      <ResolutionOverlay show={!!currentResolutionStep}>
        {currentResolutionStep && (
          <ResolutionMessage>
            <h3>{currentResolutionStep.type.replace('_', ' ').toUpperCase()}</h3>
            <p>{currentResolutionStep.description}</p>
          </ResolutionMessage>
        )}
      </ResolutionOverlay>

      {/* Skill Selection Modal */}
      <SkillSelectionModal
        isOpen={showSkillModal}
        selectedAspect={selectedAspect}
        onSkillSelect={handleSkillSelect}
        onClose={() => setShowSkillModal(false)}
        playerMana={combatState.player.mana}
        character={character}
      />
    </CombatContainer>
  );
};
