import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGameStore } from '../../stores/gameStore';
import { getAvailableSkills, applySkillEffect } from '../../utils/fallacySkills';
import { Skill, PhilosophicalAspect, BuffDebuff } from '../../types/game';
import { saveCharacter } from '../../utils/characterSave';
import { SkillSelectionModal } from '../combat/SkillSelectionModal';
import { CombatScreen } from './CombatScreen';
import { processEventEffectReduction, clearAllPersistentEffects } from '../../utils/persistentEffects';
import { CombatModal } from '../../figma/CombatModal';

type EventType = 'combat' | 'moral' | 'gathering' | 'rest';
type SkillCategory = 'body' | 'mind' | 'heart';

interface EventModalProps {
  isOpen: boolean;
  eventType: EventType;
  onClose: () => void;
  nodeId: string;
}

interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  imageUrl: string;
  description: string;
}

interface MoralScenario {
  id: string;
  title: string;
  description: string;
  choices: {
    id: string;
    text: string;
    result: string;
    rewards: { hp?: number; mp?: number; gold?: number; karma?: number };
    outcome?: {
      type: string;
      description: string;
    };
  }[];
}

interface GatheringResource {
  name: string;
  amount: number;
  energyCost: number;
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

const MORAL_SCENARIOS: MoralScenario[] = [
  {
    id: 'guardian',
    title: 'Guardian\'s Wisdom',
    description: 'Your guardian looks at you with wise, caring eyes. "Young one, I see the curiosity in your eyes. You wish to explore beyond our small town, don\'t you? Before you begin your journey, let me teach you the fundamental skill of reasoning. This will serve you well in the philosophical challenges ahead."',
    choices: [
      {
        id: 'learn_reasoning',
        text: 'Please teach me, Guardian. I am ready to learn.',
        result: 'Your guardian teaches you Basic Reasoning and encourages you to explore the village.',
        rewards: { hp: 10, mp: 10 },
        outcome: {
          type: 'unlock_progression',
          description: 'Your guardian teaches you Basic Reasoning and encourages you to explore the village.'
        }
      },
      {
        id: 'learn_reasoning_eager',
        text: 'I\'m eager to begin! What should I know?',
        result: 'Your guardian smiles and teaches you Basic Reasoning, opening new paths for exploration.',
        rewards: { hp: 10, mp: 10 },
        outcome: {
          type: 'unlock_progression',
          description: 'Your guardian smiles and teaches you Basic Reasoning, opening new paths for exploration.'
        }
      }
    ]
  },
  {
    id: 'need_guardian',
    title: 'Guardian\'s Guidance Needed',
    description: 'You feel unprepared for this challenge. Your guardian\'s wisdom would be valuable before venturing into unknown territory. Perhaps you should speak with them first.',
    choices: [
      {
        id: 'return',
        text: 'Return to seek your guardian\'s guidance',
        result: 'Wisdom comes to those who know when to seek counsel. You head back toward your guardian.',
        rewards: {}
      }
    ]
  },
  {
    id: 'nothing_here',
    title: 'Quiet Location',
    description: 'You search the area thoroughly but find nothing of particular interest. The location seems to have been thoroughly explored already.',
    choices: [
      {
        id: 'continue',
        text: 'Continue your journey',
        result: 'Sometimes the journey itself is more important than what we find.',
        rewards: {}
      }
    ]
  },
  {
    id: 'lost_toy',
    title: 'Lost Toy',
    description: 'You find a beautifully carved wooden toy that a younger child has dropped. You see them crying nearby, but you also notice it would fit perfectly in your collection.',
    choices: [
      {
        id: 'return',
        text: 'Return the toy to the crying child',
        result: 'The child hugs you gratefully. You feel warm inside knowing you did the right thing.',
        rewards: { karma: 5, hp: -5 }
      },
      {
        id: 'ignore',
        text: 'Pretend you didn\'t see anything and walk away',
        result: 'You avoid the situation entirely. Nothing changes.',
        rewards: {}
      },
      {
        id: 'keep',
        text: 'Keep the toy for yourself',
        result: 'You slip the toy into your bag. It\'s beautiful, but you feel a weight in your heart.',
        rewards: { karma: -3, gold: 10 }
      }
    ]
  },
  {
    id: 'hungry_friend',
    title: 'Hungry Friend',
    description: 'Your friend forgot their lunch money and looks sadly at the other kids eating. You have enough to share, but you were really looking forward to buying that sweet pastry.',
    choices: [
      {
        id: 'share',
        text: 'Share your lunch money with your friend',
        result: 'Your friend smiles gratefully and you both enjoy a simple meal together.',
        rewards: { karma: 3, hp: -3, gold: -5 }
      },
      {
        id: 'ignore',
        text: 'Pretend you don\'t notice and buy your pastry',
        result: 'You enjoy your pastry, but it tastes less sweet knowing your friend is hungry.',
        rewards: { karma: -2, hp: 5 }
      }
    ]
  }
];

const GATHERING_RESOURCES: GatheringResource[] = [
  { name: 'Wild Berries', amount: 3, energyCost: 2 },
  { name: 'Fallen Branches', amount: 2, energyCost: 3 },
  { name: 'Smooth Stones', amount: 4, energyCost: 1 },
  { name: 'Medicinal Herbs', amount: 1, energyCost: 4 }
];

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled.div<{ isCombat?: boolean }>`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  width: ${props => props.isCombat ? '95vw' : '90%'};
  max-width: ${props => props.isCombat ? '95vw' : '800px'};
  height: ${props => props.isCombat ? '95vh' : 'auto'};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  ${props => props.isCombat && `
    display: flex;
    flex-direction: column;
  `}
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
`;

const ModalBody = styled.div<{ isCombat?: boolean }>`
  padding: ${props => props.isCombat ? '0' : theme.spacing.lg};
  ${props => props.isCombat && `
    flex: 1;`}
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

// Combat styles
const CombatArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const MonsterDisplay = styled.div`
  text-align: center;
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  .monster-image {
    max-width: 400px;
    max-height: 300px;
    width: 100%;
    object-fit: contain;
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.md};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .monster-stats {
    display: flex;
    justify-content: center;
    gap: ${theme.spacing.xl};
    margin-top: ${theme.spacing.md};

    .stat-group {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-label {
        color: ${theme.colors.text.secondary};
        font-size: 0.9rem;
        margin-bottom: ${theme.spacing.xs};
      }

      .stat-value {
        color: ${theme.colors.text.accent};
        font-size: 1.1rem;
        font-weight: 600;
      }

      .stat-bar {
        width: 100px;
        height: 8px;
        background: ${theme.colors.background.primary};
        border-radius: 4px;
        overflow: hidden;
        margin-top: ${theme.spacing.xs};

        .stat-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        &.health .stat-fill { background: ${theme.colors.danger}; }
        &.mana .stat-fill { background: ${theme.colors.info}; }
      }
    }
  }

  .monster-name {
    color: ${theme.colors.text.accent};
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.md};
  }
`;

const CombatInterface = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: ${theme.spacing.lg};
  height: 200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const BattleLog = styled.div`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  height: 100%;
  overflow-y: auto;

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
`;

const ActionPanel = styled.div`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  height: 100%;
  display: flex;
  flex-direction: column;

  h4 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.sm} 0;
    font-size: 1rem;
    text-align: center;
    border-bottom: 1px solid ${theme.colors.border.secondary};
    padding-bottom: ${theme.spacing.xs};
  }

  .action-grid {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    gap: ${theme.spacing.sm};
    flex: 1;
  }
`;

const CategorySelection = styled.div`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  height: 100%;
  display: flex;
  flex-direction: column;

  h4 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.sm} 0;
    font-size: 1rem;
    text-align: center;
    border-bottom: 1px solid ${theme.colors.border.secondary};
    padding-bottom: ${theme.spacing.xs};
  }

  .category-buttons {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    gap: ${theme.spacing.sm};
    flex: 1;
  }
`;

const CategoryButton = styled.button<{ category: SkillCategory; selected: boolean }>`
  background: ${props => {
    if (!props.selected) return theme.colors.background.primary;
    switch (props.category) {
      case 'body': return '#DC143C';
      case 'mind': return '#4169E1';
      case 'heart': return '#FF6B35';
      default: return theme.colors.primary;
    }
  }};
  color: ${props => props.selected ? 'white' : theme.colors.text.primary};
  border: 2px solid ${props => {
    switch (props.category) {
      case 'body': return '#DC143C';
      case 'mind': return '#4169E1';
      case 'heart': return '#FF6B35';
      default: return theme.colors.border.primary;
    }
  }};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionButtons = styled.div`
  h4 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.sm} 0;
  }

  .action-grid {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    gap: ${theme.spacing.sm};
    flex: 1;
  }
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? theme.colors.background.primary : theme.colors.primary};
  color: ${props => props.disabled ? theme.colors.text.muted : 'white'};
  border: 2px solid ${props => props.disabled ? theme.colors.border.secondary : theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
    background: ${props => props.disabled ? theme.colors.background.primary : theme.colors.accent};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

// Event choice styles
const EventDescription = styled.div`
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};

  .event-title {
    color: ${theme.colors.text.accent};
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.md};
  }

  .event-text {
    color: ${theme.colors.text.primary};
    line-height: 1.6;
  }
`;

const ChoiceButton = styled.button`
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.background.panel};
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }

  .choice-text {
    color: ${theme.colors.text.primary};
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const ResourceCard = styled.div`
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  text-align: center;

  .resource-name {
    color: ${theme.colors.text.accent};
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }

  .resource-info {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    margin-bottom: ${theme.spacing.md};
  }

  button {
    background: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background: ${theme.colors.accent};
    }

    &:disabled {
      background: ${theme.colors.background.primary};
      color: ${theme.colors.text.muted};
      cursor: not-allowed;
    }
  }
`;

export const EventModal: React.FC<EventModalProps> = ({ isOpen, eventType, onClose, nodeId }) => {
  // Zustand store - selective subscriptions
  const gameState = useGameStore(state => state.gameState);
  const updateCharacter = useGameStore(state => state.updateCharacter);
  const updateStory = useGameStore(state => state.updateStory);
  const unlockGuardianProgression = useGameStore(state => state.unlockGuardianProgression);
  const startCombat = useGameStore(state => state.startCombat);

  // Combat state
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatEnded, setCombatEnded] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [playerBuffs, setPlayerBuffs] = useState<BuffDebuff[]>([]);
  const [enemyBuffs, setEnemyBuffs] = useState<BuffDebuff[]>([]);

  // Event state
  const [currentScenario, setCurrentScenario] = useState<MoralScenario | null>(null);
  const [eventCompleted, setEventCompleted] = useState(false);
  const [eventResult, setEventResult] = useState<string>('');

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (isOpen) {
      initializeEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, eventType]);

  useEffect(() => {
    const skills = getAvailableSkills(gameState.character);
    setAvailableSkills(skills);
  }, [gameState.character]);

  // Close the entire event modal when the enemy is defeated in combat
  useEffect(() => {
    if (!isOpen || eventType !== 'combat') return;
    
    const combat = gameState.combat;
    
    // Only close if combat exists and enemy is defeated
    // Don't close if combat is null during initialization
    if (combat && combat.enemy && combat.enemy.health <= 0) {
      onClose();
    }
  }, [isOpen, eventType, gameState.combat, onClose]);

  const initializeEvent = () => {
    setEventCompleted(false);
    setEventResult('');

    // EventType is already determined by GlobalLocalMapScreen (respecting debug mode)
    // This just initializes the appropriate event content
    switch (eventType) {
      case 'combat':
        // Initialize combat in the global store with forest monsters
        const forestMonsters = ['elder_tree', 'tree_guardian_1', 'tree_guardian_2'];
        const randomMonster = forestMonsters[Math.floor(Math.random() * forestMonsters.length)];
        startCombat(randomMonster || 'elder_tree');
        break;
      case 'moral':
        // Handle special cases first
        if (nodeId === 'guardian') {
          const guardianScenario = MORAL_SCENARIOS.find(s => s.id === 'guardian');
          if (guardianScenario) {
            setCurrentScenario(guardianScenario);
          }
        } else if (nodeId === 'need_guardian') {
          const needGuardianScenario = MORAL_SCENARIOS.find(s => s.id === 'need_guardian');
          if (needGuardianScenario) {
            setCurrentScenario(needGuardianScenario);
          }
        } else if (nodeId.includes('_empty')) {
          const nothingScenario = MORAL_SCENARIOS.find(s => s.id === 'nothing_here');
          if (nothingScenario) {
            setCurrentScenario(nothingScenario);
          }
        } else {
          // Random scenario for regular moral events
          const regularScenarios = MORAL_SCENARIOS.filter(s => !['guardian', 'need_guardian', 'nothing_here'].includes(s.id));
          const scenarioIndex = Math.floor(Math.random() * regularScenarios.length);
          const randomScenario = regularScenarios[scenarioIndex];
          if (randomScenario) {
            setCurrentScenario(randomScenario);
          }
        }
        break;
      default:
        break;
    }
  };

  const addToLog = (message: string, type: 'normal' | 'damage' | 'heal' = 'normal') => {
    setBattleLog(prev => [...prev, message]);
  };

  const handleSkillUse = (skill: Skill) => {
    if (!enemy || !isPlayerTurn || combatEnded || !selectedCategory) return;

    // Check if player has enough mana
    if (gameState.character.mana < skill.manaCost) {
      addToLog('Not enough mana to use this skill!');
      return;
    }

    // Deduct mana cost
    updateCharacter({ mana: Math.max(0, gameState.character.mana - skill.manaCost) });

    // Apply skill effect using the existing system
    const skillResult = applySkillEffect(skill, gameState.character, enemy);

    // Calculate damage and apply to enemy
    const finalDamage = Math.max(0, skillResult.damage);

    setEnemyHealth(prev => {
      const newHealth = Math.max(0, prev - finalDamage);
      addToLog(`You use ${skill.name} for ${finalDamage} damage!`, 'damage');

      // Add skill-specific effects to log
      skillResult.effects.forEach(effect => addToLog(effect));

      if (newHealth <= 0) {
        addToLog(`${enemy.name} is defeated!`, 'heal');
        setCombatEnded(true);
        setEventCompleted(true);
        setEventResult('Victory! You gain experience and wisdom from this encounter.');
        return 0;
      }

      return newHealth;
    });

    setIsPlayerTurn(false);

    // Enemy turn after skill use
    setTimeout(() => {
      const enemyDamage = 15 + Math.floor(Math.random() * 10);
      updateCharacter({ health: Math.max(0, gameState.character.health - enemyDamage) });
      addToLog(`${enemy.name} attacks for ${enemyDamage} damage!`, 'damage');
      setIsPlayerTurn(true);
    }, 1500);
  };

  const handleCombatAction = (actionType: 'attack' | 'special' | 'defend' | 'flee') => {
    if (!enemy || !isPlayerTurn || combatEnded) return;

    if (actionType === 'defend') {
      addToLog('You take a defensive stance.');
      setIsPlayerTurn(false);
      
      setTimeout(() => {
        const damage = Math.floor((15 + Math.random() * 10) * 0.5);
        updateCharacter({ health: Math.max(0, gameState.character.health - damage) });
        addToLog(`${enemy.name} attacks, but your defense reduces damage to ${damage}!`);
        setIsPlayerTurn(true);
      }, 1000);
      return;
    }

    if (actionType === 'flee') {
      addToLog('You attempt to flee...');
      if (Math.random() > 0.3) {
        addToLog('You successfully escaped!', 'heal');
        onClose();
      } else {
        addToLog('You could not escape!');
        setIsPlayerTurn(false);
        setTimeout(() => {
          const damage = 15 + Math.floor(Math.random() * 10);
          updateCharacter({ health: Math.max(0, gameState.character.health - damage) });
          addToLog(`${enemy.name} attacks while you're distracted for ${damage} damage!`, 'damage');
          setIsPlayerTurn(true);
        }, 1000);
      }
      return;
    }

    // For attack/special, need category and skill selection
    if (!selectedCategory) {
      addToLog('Please select a philosophical approach first!');
      return;
    }

    // For now, use basic attack
    const baseDamage = actionType === 'attack' ? 20 : 15;
    const damage = baseDamage + Math.floor(Math.random() * 10);
    
    setEnemyHealth(prev => {
      const newHealth = Math.max(0, prev - damage);
      addToLog(`You use ${selectedCategory} ${actionType} for ${damage} damage!`, 'damage');
      
      if (newHealth <= 0) {
        addToLog(`${enemy.name} is defeated!`, 'heal');
        setCombatEnded(true);
        setEventCompleted(true);
        setEventResult('Victory! You gain experience and wisdom from this encounter.');
        return 0;
      }
      
      return newHealth;
    });

    setIsPlayerTurn(false);
    
    setTimeout(() => {
      const enemyDamage = 15 + Math.floor(Math.random() * 10);
      updateCharacter({ health: Math.max(0, gameState.character.health - enemyDamage) });
      addToLog(`${enemy.name} attacks for ${enemyDamage} damage!`, 'damage');
      setIsPlayerTurn(true);
    }, 1500);
  };

  const handleMoralChoice = (choice: any) => {
    if (!currentScenario) return;

    console.log('🎭 Guardian Choice Selected:', choice);
    console.log('📝 Current Scenario ID:', currentScenario.id);
    console.log('🔓 Choice Outcome:', choice.outcome);

    setEventResult(choice.result);
    setEventCompleted(true);

    // Handle special guardian progression
    if (currentScenario.id === 'guardian' && choice.outcome?.type === 'unlock_progression') {
      console.log('🚀 Triggering Guardian Progression!');
      unlockGuardianProgression();
      setEventResult(choice.outcome.description);
    }

    // Apply rewards/penalties
    const updates: any = {};
    if (choice.rewards.hp) {
      updates.health = Math.max(0, Math.min(gameState.character.maxHealth, gameState.character.health + choice.rewards.hp));
    }
    if (choice.rewards.mp) {
      updates.mana = Math.max(0, Math.min(gameState.character.maxMana, gameState.character.mana + choice.rewards.mp));
    }

    // Process persistent effect duration reduction for non-combat events
    const characterWithReducedEffects = processEventEffectReduction(gameState.character);
    Object.assign(updates, characterWithReducedEffects);

    if (Object.keys(updates).length > 0) {
      updateCharacter(updates);
    }

    // TODO: Update karma and gold
  };

  const handleGathering = (resource: GatheringResource) => {
    // TODO: Check energy and update inventory
    setEventResult(`You gathered ${resource.amount} ${resource.name}!`);
    setEventCompleted(true);

    // Process persistent effect duration reduction for non-combat events
    const characterWithReducedEffects = processEventEffectReduction(gameState.character);
    updateCharacter(characterWithReducedEffects);
  };

  const handleRest = () => {
    const disruptionChance = Math.random();
    
    if (disruptionChance < 0.15) {
      // Disrupted rest - only clears effects, doesn't fully restore
      const restoredHp = Math.floor(gameState.character.maxHealth * 0.5);
      const restoredMp = Math.floor(gameState.character.maxMana * 0.5);
      
      // Clear all persistent effects (as per requirements)
      const characterWithClearedEffects = clearAllPersistentEffects(gameState.character);
      
      updateCharacter({
        ...characterWithClearedEffects,
        health: Math.min(gameState.character.maxHealth, gameState.character.health + restoredHp),
        mana: Math.min(gameState.character.maxMana, gameState.character.mana + restoredMp)
      });
      
      const theftChance = Math.random();
      if (theftChance < 0.15) {
        setEventResult('Your rest was disrupted by strange noises, and you discover some of your gold is missing! All effects cleared. (Restored 50% HP/MP)');
      } else {
        setEventResult('Your rest was disrupted by strange noises in the night. All effects cleared. (Restored 50% HP/MP)');
      }
    } else {
      // Full rest - clears all effects and fully restores
      const characterWithClearedEffects = clearAllPersistentEffects(gameState.character);
      
      updateCharacter({
        ...characterWithClearedEffects,
        health: gameState.character.maxHealth,
        mana: gameState.character.maxMana
      });
      setEventResult('You sleep peacefully and wake up fully refreshed! All effects cleared. (Restored 100% HP/MP)');
    }
    
    setEventCompleted(true);
  };

  const getEventTitle = () => {
    switch (eventType) {
      case 'combat': return 'Combat Encounter';
      case 'moral': return 'Moral Dilemma';
      case 'gathering': return 'Resource Gathering';
      case 'rest': return 'Resting Spot';
      default: return 'Event';
    }
  };

  const renderEventContent = () => {
    if (eventCompleted) {
      return (
      <EventDescription>
      <div className="event-title">Event Complete</div>
      <div className="event-text">{eventResult}</div>
      <ActionButton onClick={() => {
      // Auto-save character progress after completing event
        saveCharacter(gameState);
          onClose();
          }} style={{ marginTop: theme.spacing.md }}>
              Continue Journey
            </ActionButton>
          </EventDescription>
        );
    }

    switch (eventType) {
      case 'combat':
        // CombatModal renders its own Dialog which conflicts with EventModal's structure
        // We need to render it but the Dialog should manage its own visibility
        // Pass open=true to make the Dialog visible (it has its own portal)
        return <CombatModal open={true} onOpenChange={onClose} />;
        
      case 'moral':
        if (!currentScenario) return null;
        
        return (
          <div>
            <EventDescription>
              <div className="event-title">{currentScenario.title}</div>
              <div className="event-text">{currentScenario.description}</div>
            </EventDescription>
            
            {currentScenario.choices.map((choice) => (
              <ChoiceButton key={choice.id} onClick={() => handleMoralChoice(choice)}>
                <div className="choice-text">{choice.text}</div>
              </ChoiceButton>
            ))}
          </div>
        );
        
      case 'gathering':
        return (
          <div>
            <EventDescription>
              <div className="event-title">Resource Gathering</div>
              <div className="event-text">You&apos;ve discovered a location rich with natural resources. What would you like to gather?</div>
            </EventDescription>
            
            <ResourceGrid>
              {GATHERING_RESOURCES.map((resource) => (
                <ResourceCard key={resource.name}>
                  <div className="resource-name">{resource.name}</div>
                  <div className="resource-info">
                    Amount: {resource.amount}<br />
                    Energy Cost: {resource.energyCost}
                  </div>
                  <button 
                    onClick={() => handleGathering(resource)}
                    disabled={gameState.mapEnergy < resource.energyCost}
                  >
                    Gather
                  </button>
                </ResourceCard>
              ))}
            </ResourceGrid>
          </div>
        );
        
      case 'rest':
        return (
          <div>
            <EventDescription>
              <div className="event-title">Peaceful Resting Spot</div>
              <div className="event-text">You&apos;ve found a safe place to rest and recover. The soft grass and gentle breeze make this an ideal spot to regain your strength.</div>
            </EventDescription>
            
            <ActionButton onClick={handleRest}>
              Rest Here
            </ActionButton>
          </div>
        );
        
      default:
        return <div>Unknown event type</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent isCombat={eventType === 'combat'}>
        {/* Only show close button for non-combat events */}
        {eventType !== 'combat' && (
          <CloseButton onClick={onClose}>×</CloseButton>
        )}
        {/* Hide header for combat since CombatScreen has its own */}
        {eventType !== 'combat' && (
          <ModalHeader>
            <h2>{getEventTitle()}</h2>
          </ModalHeader>
        )}
        <ModalBody isCombat={eventType === 'combat'}>
          {renderEventContent()}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};