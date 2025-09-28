import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  imageUrl: string;
  description: string;
}

interface CombatChoice {
  id: string;
  text: string;
  type: 'body' | 'mind' | 'heart';
  damage: number;
  description: string;
}

const FOREST_ENEMIES: Enemy[] = [
  {
    id: 'elder_tree',
    name: 'Ancient Elder Tree',
    health: 80,
    maxHealth: 80,
    imageUrl: '/forest-monsters/Elder Tree.png',
    description: 'A wise but corrupted tree that has seen too much suffering in the world.'
  },
  {
    id: 'tree_guardian_1',
    name: 'Forest Guardian',
    health: 60,
    maxHealth: 60,
    imageUrl: '/forest-monsters/Tree1.jpg',
    description: 'A protective spirit of the forest, testing your philosophical resolve.'
  },
  {
    id: 'tree_guardian_2',
    name: 'Twisted Tree Spirit',
    health: 70,
    maxHealth: 70,
    imageUrl: '/forest-monsters/Tree2.jpg',
    description: 'A once-peaceful tree spirit, now filled with existential doubt.'
  }
];

const COMBAT_CHOICES: CombatChoice[] = [
  {
    id: 'body_attack',
    text: 'Physical Strike',
    type: 'body',
    damage: 25,
    description: 'Use your physical strength to overcome the enemy'
  },
  {
    id: 'mind_attack',
    text: 'Logical Argument',
    type: 'mind',
    damage: 20,
    description: 'Defeat the enemy with pure reasoning and logic'
  },
  {
    id: 'heart_attack',
    text: 'Emotional Appeal',
    type: 'heart',
    damage: 22,
    description: 'Reach their heart with compassion and understanding'
  },
  {
    id: 'body_defend',
    text: 'Defensive Stance',
    type: 'body',
    damage: 0,
    description: 'Reduce incoming damage and prepare for counterattack'
  },
  {
    id: 'mind_defend',
    text: 'Mental Shield',
    type: 'mind',
    damage: 0,
    description: 'Use rational thought to deflect philosophical attacks'
  },
  {
    id: 'heart_defend',
    text: 'Emotional Barrier',
    type: 'heart',
    damage: 0,
    description: 'Protect yourself with inner peace and calm'
  }
];

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a3f1a 0%, #0d2818 50%, #0a1f0a 100%);
  padding: ${theme.spacing.lg};
`;

const BattleHeader = styled.div`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;

  h1 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.sm} 0;
  }

  .description {
    color: ${theme.colors.text.secondary};
    font-style: italic;
  }
`;

const BattleArea = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  flex: 1;
`;

const CombatantCard = styled.div<{ isPlayer?: boolean }>`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: 2px solid ${props => props.isPlayer ? theme.colors.success : theme.colors.danger};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;

  .portrait {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid ${props => props.isPlayer ? theme.colors.success : theme.colors.danger};
    object-fit: cover;
    margin-bottom: ${theme.spacing.md};
  }

  .name {
    color: ${theme.colors.text.accent};
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }

  .health-bar {
    width: 100%;
    height: 20px;
    background: ${theme.colors.background.secondary};
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: ${theme.spacing.md};

    .health-fill {
      height: 100%;
      background: ${props => props.isPlayer ? theme.colors.success : theme.colors.danger};
      transition: width 0.5s ease;
    }
  }

  .health-text {
    color: ${theme.colors.text.primary};
    font-weight: 600;
    margin-bottom: ${theme.spacing.md};
  }
`;

const ChoicesPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};

  h3 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.md} 0;
    text-align: center;
  }

  .choices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${theme.spacing.md};
  }
`;

const ChoiceButton = styled.button<{ choiceType: 'body' | 'mind' | 'heart' }>`
  background: ${props =>
    props.choiceType === 'body' ? '#DC143C' :
    props.choiceType === 'mind' ? '#4169E1' : '#FF6B35'
  };
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  .choice-title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: ${theme.spacing.sm};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
  }

  .choice-desc {
    font-size: 0.9rem;
    opacity: 0.9;
    line-height: 1.3;
  }

  .damage {
    font-weight: 600;
    margin-top: ${theme.spacing.sm};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BattleLog = styled.div`
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  max-height: 150px;
  overflow-y: auto;

  .log-entry {
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.sm};
    font-size: 0.9rem;

    &.damage {
      color: ${theme.colors.danger};
      font-weight: 600;
    }

    &.heal {
      color: ${theme.colors.success};
      font-weight: 600;
    }
  }
`;

const VictoryPanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${theme.colors.background.panel};
  border: 3px solid ${theme.colors.success};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  z-index: 1000;

  h2 {
    color: ${theme.colors.success};
    margin: 0 0 ${theme.spacing.md} 0;
  }

  .rewards {
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.lg};
  }

  button {
    background: ${theme.colors.success};
    color: white;
    border: none;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    font-weight: 600;
  }
`;

export const FixedCombatScreen: React.FC = () => {
  const { gameState, updateCharacter, endCombat, changeScreen } = useGame();

  // Initialize random enemy
  const [enemy, setEnemy] = useState<Enemy>(() =>
    FOREST_ENEMIES[Math.floor(Math.random() * FOREST_ENEMIES.length)]
  );

  const [enemyHealth, setEnemyHealth] = useState(enemy.maxHealth);
  const [playerHealth, setPlayerHealth] = useState(gameState.character.health);
  const [battleLog, setBattleLog] = useState<string[]>([
    `You encounter a ${enemy.name} in the forest!`
  ]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatEnded, setCombatEnded] = useState(false);
  const [victory, setVictory] = useState(false);

  // Get player portrait
  const characterData = JSON.parse(localStorage.getItem('axiomancer_character') || '{}');
  const playerPortrait = characterData.portrait?.imageUrl || '/portraits/c-begger.png';

  const addToLog = (message: string, type: 'normal' | 'damage' | 'heal' = 'normal') => {
    setBattleLog(prev => [...prev, message]);
  };

  const handleChoice = (choice: CombatChoice) => {
    if (!isPlayerTurn || combatEnded) return;

    setIsPlayerTurn(false);

    // Player's turn
    if (choice.damage > 0) {
      const actualDamage = choice.damage + Math.floor(Math.random() * 10) - 5; // ±5 variance
      const finalDamage = Math.max(1, actualDamage);
      setEnemyHealth(prev => Math.max(0, prev - finalDamage));
      addToLog(`You use ${choice.text} for ${finalDamage} damage!`, 'damage');
    } else {
      addToLog(`You use ${choice.text} to defend yourself.`);
    }

    // Check if enemy is defeated
    if (enemyHealth - (choice.damage || 0) <= 0) {
      addToLog(`The ${enemy.name} is defeated!`, 'heal');
      setCombatEnded(true);
      setVictory(true);

      // Give rewards
      updateCharacter({
        health: Math.min(gameState.character.maxHealth, playerHealth + 10)
      });

      return;
    }

    // Enemy's turn after delay
    setTimeout(() => {
      const enemyDamage = 15 + Math.floor(Math.random() * 10); // 15-25 damage
      setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
      addToLog(`The ${enemy.name} attacks you for ${enemyDamage} damage!`, 'damage');

      // Check if player is defeated
      if (playerHealth - enemyDamage <= 0) {
        addToLog('You have been defeated...', 'damage');
        setCombatEnded(true);
        setVictory(false);
      } else {
        setIsPlayerTurn(true);
      }
    }, 1500);
  };

  const handleVictory = () => {
    endCombat();
    changeScreen('exploration');
  };

  const getChoiceIcon = (type: 'body' | 'mind' | 'heart') => {
    switch (type) {
      case 'body': return '💪';
      case 'mind': return '🧠';
      case 'heart': return '❤️';
    }
  };

  const playerHealthPercent = (playerHealth / gameState.character.maxHealth) * 100;
  const enemyHealthPercent = (enemyHealth / enemy.maxHealth) * 100;

  return (
    <Container>
      <BattleHeader>
        <h1>Philosophical Combat</h1>
        <div className="description">{enemy.description}</div>
      </BattleHeader>

      <BattleArea>
        {/* Player */}
        <CombatantCard isPlayer>
          <img src={playerPortrait} alt={gameState.character.name} className="portrait" />
          <div className="name">{gameState.character.name}</div>
          <div className="health-bar">
            <div className="health-fill" style={{ width: `${playerHealthPercent}%` }} />
          </div>
          <div className="health-text">{playerHealth} / {gameState.character.maxHealth} HP</div>
        </CombatantCard>

        {/* Enemy */}
        <CombatantCard>
          <img src={enemy.imageUrl} alt={enemy.name} className="portrait" />
          <div className="name">{enemy.name}</div>
          <div className="health-bar">
            <div className="health-fill" style={{ width: `${enemyHealthPercent}%` }} />
          </div>
          <div className="health-text">{enemyHealth} / {enemy.maxHealth} HP</div>
        </CombatantCard>
      </BattleArea>

      {/* Player Choices */}
      {isPlayerTurn && !combatEnded && (
        <ChoicesPanel>
          <h3>Choose Your Approach</h3>
          <div className="choices-grid">
            {COMBAT_CHOICES.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choiceType={choice.type}
                onClick={() => handleChoice(choice)}
              >
                <div className="choice-title">
                  {getChoiceIcon(choice.type)} {choice.text}
                </div>
                <div className="choice-desc">{choice.description}</div>
                {choice.damage > 0 && (
                  <div className="damage">Damage: {choice.damage}</div>
                )}
              </ChoiceButton>
            ))}
          </div>
        </ChoicesPanel>
      )}

      {/* Battle Log */}
      <BattleLog>
        {battleLog.map((entry, index) => (
          <div key={index} className="log-entry">{entry}</div>
        ))}
      </BattleLog>

      {/* Victory Screen */}
      {combatEnded && victory && (
        <VictoryPanel>
          <h2>Victory!</h2>
          <div className="rewards">
            You have gained wisdom through combat!<br />
            +10 Health restored<br />
            +50 Experience
          </div>
          <button onClick={handleVictory}>Continue Journey</button>
        </VictoryPanel>
      )}
    </Container>
  );
};