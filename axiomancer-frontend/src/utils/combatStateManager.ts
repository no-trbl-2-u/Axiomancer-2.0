import { Character, Enemy, PhilosophicalAspect, CombatAction } from '../types/game';
import { CombatState, BattleLogEntry, TurnResolution, CombatResolutionStep } from '../types/combatState';
import { BuffDebuff, CombatantBuffs } from '../types/buffs';
import { calculateModifiedStats, processBuffsDebuffs } from './buffDebuffEngine';
import { executeCombatAction, executeFallacy, determineAspectWinner, generateEnemyChoice } from './combatMechanics';
import { fallacySpellbook } from './fallacySpellbook';

/**
 * Master Combat State Manager
 * The ultimate turn-based philosophical combat system
 * 
 * Handles:
 * - Simultaneous action resolution with visual staggering
 * - Proper turn-based progression
 * - Persistent buff/debuff effects
 * - Rich battle logging
 * - Perfect synchronization with game state
 */
export class MasterCombatStateManager {
  private combatState: CombatState;
  private resolutionCallbacks: {
    onStepExecute?: (step: CombatResolutionStep) => void;
    onTurnComplete?: (battleLog: BattleLogEntry) => void;
    onCombatEnd?: (winner: string, result: string) => void;
  } = {};

  constructor(player: Character, enemy: Enemy) {
    console.log('🏗️ MasterCombatStateManager constructor called with:', { 
      playerName: player?.name, 
      enemyName: enemy?.name,
      playerHealth: player?.health,
      enemyHealth: enemy?.health
    });
    
    this.combatState = this.initializeCombatState(player, enemy);
    console.log('✅ MasterCombatStateManager initialized successfully');
  }

  /**
   * Initialize combat state from character and enemy data
   */
  private initializeCombatState(player: Character, enemy: Enemy): CombatState {
    // Import any existing persistent effects from character
    const playerBuffs = player.persistentEffects?.buffs || [];
    const playerDebuffs = player.persistentEffects?.debuffs || [];

    return {
      player: {
        health: player.health,
        maxHealth: player.maxHealth,
        mana: player.mana,
        maxMana: player.maxMana,
        buffs: [...playerBuffs],
        debuffs: [...playerDebuffs],
      },
      enemy: {
        health: enemy.health,
        maxHealth: enemy.maxHealth,
        mana: enemy.mana,
        maxMana: enemy.maxMana,
        buffs: [],
        debuffs: [],
      },
      turnNumber: 1,
      phase: 'selection',
      battleLog: [],
      currentPhaseData: {},
      agreeToDisagreeCounter: 0,
      originalPlayer: { ...player },
      originalEnemy: { ...enemy },
    };
  }

  /**
   * Set callbacks for visual presentation
   */
  public setCallbacks(callbacks: {
    onStepExecute?: (step: CombatResolutionStep) => void;
    onTurnComplete?: (battleLog: BattleLogEntry) => void;
    onCombatEnd?: (winner: string, result: string) => void;
  }): void {
    this.resolutionCallbacks = callbacks;
  }

  /**
   * Get current combat state for UI display
   */
  public getCombatState(): CombatState {
    return { ...this.combatState };
  }

  /**
   * Execute a complete combat turn with player choice
   */
  public async executeTurn(playerChoice: {
    aspect: PhilosophicalAspect;
    action: CombatAction;
    selectedSkill?: string;
  }): Promise<TurnResolution> {
    console.log('🎮 MasterCombatStateManager.executeTurn called with:', playerChoice);
    
    // Phase 1: Generate enemy choice
    const enemyChoice = generateEnemyChoice(this.combatState.originalEnemy, []);
    console.log('🤖 Enemy choice generated:', enemyChoice);
    
    // Phase 2: Store choices and determine advantage
    const aspectResult = determineAspectWinner(playerChoice.aspect, enemyChoice.aspect);
    const advantage = aspectResult === 'tie' ? 'none' : aspectResult;
    
    this.combatState.currentPhaseData = {
      playerChoice,
      enemyChoice,
      advantage,
    };
    
    console.log('⚖️ Advantage determined:', this.combatState.currentPhaseData.advantage);
    this.combatState.phase = 'resolution';

    // Phase 3: Calculate all effects simultaneously (but present staggered)
    console.log('🔄 Resolving simultaneous actions...');
    const resolution = await this.resolveSimultaneousActions();
    console.log('✅ Resolution calculated:', resolution);
    
    // Phase 4: Execute visual presentation with delays
    console.log('🎬 Executing visual resolution...');
    await this.executeVisualResolution(resolution);
    
    // Phase 5: Process end of turn
    console.log('🔚 Processing end of turn...');
    await this.processEndOfTurn();
    
    // Phase 6: Check for combat end
    const combatResult = this.checkCombatEnd();
    console.log('🏁 Combat end check:', combatResult);
    
    if (combatResult.ended) {
      this.combatState.phase = 'ended';
      resolution.combatEnded = true;
      resolution.winner = combatResult.winner || 'player'; // Default fallback
      
      // Add result to battle log
      if (resolution.battleLogEntry && combatResult.resultText) {
        resolution.battleLogEntry.result = combatResult.resultText;
      }
    } else {
      // Prepare for next turn
      this.combatState.turnNumber++;
      this.combatState.phase = 'selection';
      this.combatState.currentPhaseData = {};
    }

    console.log('📊 Final combat state:', this.combatState);
    return resolution;
  }

  /**
   * Calculate all combat effects simultaneously
   */
  private async resolveSimultaneousActions(): Promise<TurnResolution> {
    const { playerChoice, enemyChoice, advantage } = this.combatState.currentPhaseData;
    if (!playerChoice || !enemyChoice) {
      throw new Error('Invalid combat phase data');
    }

    const steps: CombatResolutionStep[] = [];
    let playerDamage = 0;
    let enemyDamage = 0;
    const playerEffects: string[] = [];
    const enemyEffects: string[] = [];

    // Step 1: Apply defense stance buffs IMMEDIATELY (before damage calculation)
    if (playerChoice.action === 'defend') {
      const defenseBuffs = this.createDefenseBuffs(playerChoice.aspect, 'player', advantage === 'player');
      defenseBuffs.forEach(buff => {
        this.combatState.player.buffs.push(buff);
        steps.push({
          type: 'buff_application',
          target: 'player',
          description: `${buff.name} applied`,
          effect: buff,
          delay: 0
        });
      });
    }

    if (enemyChoice.action === 'defend') {
      const defenseBuffs = this.createDefenseBuffs(enemyChoice.aspect, 'enemy', advantage === 'enemy');
      defenseBuffs.forEach(buff => {
        this.combatState.enemy.buffs.push(buff);
        steps.push({
          type: 'buff_application',
          target: 'enemy',
          description: `${buff.name} applied`,
          effect: buff,
          delay: 0
        });
      });
    }

    // Step 2: Calculate modified stats with current buffs
    const playerModifiedStats = calculateModifiedStats(
      this.combatState.originalPlayer.derivedStats,
      { buffs: this.combatState.player.buffs, debuffs: this.combatState.player.debuffs }
    );
    const enemyModifiedStats = calculateModifiedStats(
      this.combatState.originalEnemy.derivedStats,
      { buffs: this.combatState.enemy.buffs, debuffs: this.combatState.enemy.debuffs }
    );

    // Step 3: Execute player action
    if (playerChoice.action === 'attack' || playerChoice.action === 'special' || playerChoice.action === 'skill') {
      const result = (playerChoice.action === 'special' || playerChoice.action === 'skill') && playerChoice.selectedSkill
        ? executeFallacy(
            { ...this.combatState.originalPlayer, derivedStats: playerModifiedStats },
            { ...this.combatState.originalEnemy, derivedStats: enemyModifiedStats },
            playerChoice.selectedSkill,
            { buffs: this.combatState.enemy.buffs, debuffs: this.combatState.enemy.debuffs },
            { buffs: this.combatState.player.buffs, debuffs: this.combatState.player.debuffs },
            advantage === 'player'
          )
        : executeCombatAction(
            { ...this.combatState.originalPlayer, derivedStats: playerModifiedStats },
            { ...this.combatState.originalEnemy, derivedStats: enemyModifiedStats },
            playerChoice.aspect,
            playerChoice.action,
            advantage === 'player',
            { buffs: this.combatState.player.buffs, debuffs: this.combatState.player.debuffs },
            { buffs: this.combatState.enemy.buffs, debuffs: this.combatState.enemy.debuffs }
          );

      if (result.hit) {
        enemyDamage = result.damage;
        playerEffects.push(...result.effects);
        
        // Apply new buffs/debuffs (they take effect next turn)
        result.buffsApplied?.forEach(buff => {
          this.combatState.player.buffs.push(buff);
        });
        result.debuffsApplied?.forEach(debuff => {
          this.combatState.enemy.debuffs.push(debuff);
        });
      } else {
        playerEffects.push(`${this.combatState.originalPlayer.name}'s attack missed!`);
      }

      // Deduct mana for skills
      if ((playerChoice.action === 'special' || playerChoice.action === 'skill') && playerChoice.selectedSkill) {
        const skill = fallacySpellbook[playerChoice.selectedSkill];
        if (skill) {
          this.combatState.player.mana = Math.max(0, this.combatState.player.mana - skill.manaCost);
        }
      }
    }

    // Step 4: Execute enemy action
    if (enemyChoice.action === 'attack' || enemyChoice.action === 'special') {
      const result = enemyChoice.action === 'special' && enemyChoice.selectedSkill
        ? executeFallacy(
            { ...this.combatState.originalEnemy, derivedStats: enemyModifiedStats },
            { ...this.combatState.originalPlayer, derivedStats: playerModifiedStats },
            enemyChoice.selectedSkill,
            { buffs: this.combatState.player.buffs, debuffs: this.combatState.player.debuffs },
            { buffs: this.combatState.enemy.buffs, debuffs: this.combatState.enemy.debuffs },
            advantage === 'enemy'
          )
        : executeCombatAction(
            { ...this.combatState.originalEnemy, derivedStats: enemyModifiedStats },
            { ...this.combatState.originalPlayer, derivedStats: playerModifiedStats },
            enemyChoice.aspect,
            enemyChoice.action,
            advantage === 'enemy',
            { buffs: this.combatState.enemy.buffs, debuffs: this.combatState.enemy.debuffs },
            { buffs: this.combatState.player.buffs, debuffs: this.combatState.player.debuffs }
          );

      if (result.hit) {
        playerDamage = result.damage;
        enemyEffects.push(...result.effects);
        
        // Apply new buffs/debuffs (they take effect next turn)
        result.buffsApplied?.forEach(buff => {
          this.combatState.enemy.buffs.push(buff);
        });
        result.debuffsApplied?.forEach(debuff => {
          this.combatState.player.debuffs.push(debuff);
        });
      } else {
        enemyEffects.push(`${this.combatState.originalEnemy.name}'s attack missed!`);
      }

      // Deduct mana for skills
      if (enemyChoice.action === 'special' && enemyChoice.selectedSkill) {
        const skill = fallacySpellbook[enemyChoice.selectedSkill];
        if (skill) {
          this.combatState.enemy.mana = Math.max(0, this.combatState.enemy.mana - skill.manaCost);
        }
      }
    }

    // Step 5: Create visual resolution steps (staggered presentation)
    let currentDelay = 500; // Start after half second

    // Enemy takes damage first
    if (enemyDamage > 0) {
      steps.push({
        type: 'damage',
        target: 'enemy',
        description: `${this.combatState.originalEnemy.name} takes ${enemyDamage} damage`,
        value: enemyDamage,
        delay: currentDelay
      });
      currentDelay += 1000; // 1 second delay
    }

    // Then player takes damage
    if (playerDamage > 0) {
      steps.push({
        type: 'damage',
        target: 'player',
        description: `${this.combatState.originalPlayer.name} takes ${playerDamage} damage`,
        value: playerDamage,
        delay: currentDelay
      });
      currentDelay += 1000; // 1 second delay
    }

    // Then status effect damage (if any)
    const statusDamageSteps = await this.calculateStatusEffectDamage();
    statusDamageSteps.forEach(step => {
      step.delay = currentDelay;
      steps.push(step);
      currentDelay += 1000;
    });

    // Store calculated damage for actual application
    this.combatState.currentPhaseData.playerDamage = playerDamage;
    this.combatState.currentPhaseData.enemyDamage = enemyDamage;
    this.combatState.currentPhaseData.playerEffects = playerEffects;
    this.combatState.currentPhaseData.enemyEffects = enemyEffects;

    // Create battle log entry
    const decisions = `${this.formatChoice(playerChoice)} vs. ${this.formatChoice(enemyChoice)}`;
    const logParts: string[] = [];
    
    if (playerDamage > 0) {
      logParts.push(`Player takes ${playerDamage} damage`);
    }
    if (enemyDamage > 0) {
      logParts.push(`Enemy takes ${enemyDamage} damage`);
    }
    
    // Add status effects to log
    const newPlayerEffects = this.combatState.player.buffs.concat(this.combatState.player.debuffs)
      .filter(effect => effect.remainingTurns === effect.duration); // New effects
    const newEnemyEffects = this.combatState.enemy.buffs.concat(this.combatState.enemy.debuffs)
      .filter(effect => effect.remainingTurns === effect.duration); // New effects
    
    if (newPlayerEffects.length > 0) {
      logParts.push(`Player gains ${newPlayerEffects.map(e => e.name).join(', ')}`);
    }
    if (newEnemyEffects.length > 0) {
      logParts.push(`Enemy gains ${newEnemyEffects.map(e => e.name).join(', ')}`);
    }

    const battleLogEntry: BattleLogEntry = {
      decisions,
      turn: this.combatState.turnNumber,
      log: logParts.join(', ') || 'No damage dealt',
    };

    // Add battle log entry to combat state
    this.combatState.battleLog.push(battleLogEntry);

    return {
      steps,
      battleLogEntry,
      combatEnded: false,
    };
  }

  /**
   * Execute visual resolution with proper delays
   */
  private async executeVisualResolution(resolution: TurnResolution): Promise<void> {
    for (const step of resolution.steps) {
      if (step.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      // Apply the actual effect
      if (step.type === 'damage' && step.value) {
        if (step.target === 'player') {
          this.combatState.player.health = Math.max(0, this.combatState.player.health - step.value);
        } else {
          this.combatState.enemy.health = Math.max(0, this.combatState.enemy.health - step.value);
        }
      }

      // Notify UI of the step
      if (this.resolutionCallbacks.onStepExecute) {
        this.resolutionCallbacks.onStepExecute(step);
      }
    }
  }

  /**
   * Process end of turn effects
   */
  private async processEndOfTurn(): Promise<void> {
    this.combatState.phase = 'turn_end';

    // Process player buffs/debuffs
    const playerResult = processBuffsDebuffs(
      { buffs: this.combatState.player.buffs, debuffs: this.combatState.player.debuffs },
      true
    );
    this.combatState.player.buffs = playerResult.updatedBuffs.buffs;
    this.combatState.player.debuffs = playerResult.updatedBuffs.debuffs;

    // Process enemy buffs/debuffs
    const enemyResult = processBuffsDebuffs(
      { buffs: this.combatState.enemy.buffs, debuffs: this.combatState.enemy.debuffs },
      true
    );
    this.combatState.enemy.buffs = enemyResult.updatedBuffs.buffs;
    this.combatState.enemy.debuffs = enemyResult.updatedBuffs.debuffs;

    // Apply any damage from ongoing effects
    if (playerResult.damageDealt) {
      this.combatState.player.health = Math.max(0, this.combatState.player.health - playerResult.damageDealt);
    }
    if (enemyResult.damageDealt) {
      this.combatState.enemy.health = Math.max(0, this.combatState.enemy.health - enemyResult.damageDealt);
    }
  }

  /**
   * Calculate status effect damage (happens after main damage)
   */
  private async calculateStatusEffectDamage(): Promise<CombatResolutionStep[]> {
    const steps: CombatResolutionStep[] = [];

    // Check for damage-dealing debuffs on player
    this.combatState.player.debuffs.forEach(debuff => {
      if (debuff.effect.specialEffects?.damageOnAttack) {
        const damage = Math.max(1, debuff.effect.specialEffects.damageOnAttack - 
          this.combatState.originalPlayer.derivedStats.ailmentDefense);
        steps.push({
          type: 'status_effect',
          target: 'player',
          description: `${debuff.name} deals ${damage} ailment damage`,
          value: damage,
          delay: 0
        });
      }
    });

    // Check for damage-dealing debuffs on enemy
    this.combatState.enemy.debuffs.forEach(debuff => {
      if (debuff.effect.specialEffects?.damageOnAttack) {
        const damage = Math.max(1, debuff.effect.specialEffects.damageOnAttack - 
          this.combatState.originalEnemy.derivedStats.ailmentDefense);
        steps.push({
          type: 'status_effect',
          target: 'enemy',
          description: `${debuff.name} deals ${damage} ailment damage`,
          value: damage,
          delay: 0
        });
      }
    });

    return steps;
  }

  // TODO: Clean this up!
  /**
   * Create defense stance buffs
   */
  private createDefenseBuffs(aspect: PhilosophicalAspect, target: 'player' | 'enemy', hasAdvantage: boolean): BuffDebuff[] {
    const buffs = [];
    const stats = target === 'player' ? this.combatState.originalPlayer.derivedStats : this.combatState.originalEnemy.derivedStats;

    switch (aspect) {
      case 'body':
        // Body Defense: 2x Physical Defense, 0.5x Ailment Defense
        buffs.push({
          id: 'body_defense_stance',
          name: 'Enhanced Physical Defense',
          description: '2x Physical Defense, 0.5x Ailment Defense',
          type: 'buff',
          effect: {
            percentageModifiers: {
              physicalDefense: 100, // 2x = +100%
              ailmentDefense: -50,  // 0.5x = -50%
            },
          },
          duration: 1,
          remainingTurns: 1,
          stackable: false,
          currentStacks: 1,
          icon: '💪'
        });
        
        // Reflection buff
        const reflectDamage = Math.floor(stats.physicalAttack * (hasAdvantage ? 0.5 : 0.25));
        buffs.push({
          id: 'body_reflection',
          name: 'Physical Reflection',
          description: `Reflects ${reflectDamage} damage to attackers`,
          type: 'buff',
          effect: { specialEffects: { reflection: reflectDamage } },
          duration: 3,
          remainingTurns: 3,
          stackable: false,
          currentStacks: 1,
          icon: '🛡️'
        });
        break;
        
      case 'mind':
        // Mind Defense: 2x Mind Defense, 0.5x Physical Defense
        buffs.push({
          id: 'mind_defense_stance',
          name: 'Mental Fortitude',
          description: '2x Mind Defense, 0.5x Physical Defense',
          type: 'buff',
          effect: {
            percentageModifiers: {
              mindDefense: 100,     // 2x = +100%
              physicalDefense: -50, // 0.5x = -50%
            },
          },
          duration: 1,
          remainingTurns: 1,
          stackable: false,
          currentStacks: 1,
          icon: '🧠'
        });
        
        // Counter-argument buff
        const counterBonus = Math.floor(stats.mindAttack * (hasAdvantage ? 0.5 : 0.25));
        buffs.push({
          id: 'mind_counter_argument',
          name: 'Counter-Argument',
          description: `+${counterBonus} Mind Attack for 3 turns`,
          type: 'buff',
          effect: { statModifiers: { mindAttack: counterBonus } },
          duration: 3,
          remainingTurns: 3,
          stackable: false,
          currentStacks: 1,
          icon: '🎯'
        });
        break;
        
      case 'heart':
        // Heart Defense: 2x Ailment Defense, 0.5x Mind Defense
        buffs.push({
          id: 'heart_defense_stance',
          name: 'Perfect Emotional Mastery',
          description: '2x Ailment Defense, 0.5x Mind Defense',
          type: 'buff',
          effect: {
            percentageModifiers: {
              ailmentDefense: 100,  // 2x = +100%
              mindDefense: -50,     // 0.5x = -50%
            },
          },
          duration: 1,
          remainingTurns: 1,
          stackable: false,
          currentStacks: 1,
          icon: '❤️'
        });
        
        // Foresight buff
        const visionType = hasAdvantage ? 'both' : 'attack';
        buffs.push({
          id: 'heart_foresight',
          name: 'Emotional Foresight',
          description: `Can see ${visionType}`,
          type: 'buff',
          effect: { specialEffects: { foresight: true } },
          duration: 3,
          remainingTurns: 3,
          stackable: false,
          currentStacks: 1,
          icon: '👁️'
        });
        break;
    }

    return buffs;
  }

  /**
   * Check if combat has ended
   */
  private checkCombatEnd(): { ended: boolean; winner?: 'player' | 'enemy' | 'agree_to_disagree'; resultText?: string } {
    if (this.combatState.player.health <= 0 && this.combatState.enemy.health <= 0) {
      return {
        ended: true,
        winner: Math.random() > 0.5 ? 'player' : 'enemy',
        resultText: 'Mutual defeat - random winner determined'
      };
    }
    
    if (this.combatState.player.health <= 0) {
      return {
        ended: true,
        winner: 'enemy',
        resultText: 'Defeat! Your argument crumbled under pressure.'
      };
    }
    
    if (this.combatState.enemy.health <= 0) {
      const xpGained = 150; // Fixed 150 XP as per requirements
      return {
        ended: true,
        winner: 'player',
        resultText: `Victory! Gained ${xpGained} XP`
      };
    }

    // Check for Agree to Disagree
    if (this.combatState.agreeToDisagreeCounter >= this.getAgreeToDisagreeThreshold()) {
      return {
        ended: true,
        winner: 'agree_to_disagree',
        resultText: 'Philosophical harmony achieved through mutual respect'
      };
    }

    return { ended: false };
  }

  /**
   * Get Agree to Disagree threshold based on enemy tier
   */
  private getAgreeToDisagreeThreshold(): number {
    const enemyTier = this.combatState.originalEnemy.enemyTier || 'normal';
    switch (enemyTier) {
      case 'elite': return 5;
      case 'boss': return 10;
      default: return 3;
    }
  }

  /**
   * Format choice for battle log
   */
  private formatChoice(choice: { aspect: PhilosophicalAspect; action: CombatAction; selectedSkill?: string }): string {
    const aspect = choice.aspect.charAt(0).toUpperCase() + choice.aspect.slice(1);
    const action = choice.action === 'special' && choice.selectedSkill 
      ? fallacySpellbook[choice.selectedSkill]?.name || 'Special'
      : choice.action.charAt(0).toUpperCase() + choice.action.slice(1);
    return `${aspect} ${action}`;
  }

  /**
   * Export final combat state for persistence
   */
  public exportFinalState(): {
    playerHealth: number;
    playerMana: number;
    persistentEffects: { buffs: BuffDebuff[]; debuffs: BuffDebuff[] };
    battleLog: BattleLogEntry[];
  } {
    return {
      playerHealth: this.combatState.player.health,
      playerMana: this.combatState.player.mana,
      persistentEffects: {
        buffs: this.combatState.player.buffs,
        debuffs: this.combatState.player.debuffs,
      },
      battleLog: this.combatState.battleLog,
    };
  }
}
