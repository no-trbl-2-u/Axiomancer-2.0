import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { useGameStore } from '../../../stores/gameStore';
import { saveCharacter } from '../../../utils/characterSave';
import { CombatModal } from './CombatModal/CombatModal';

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

// TODO: Move to a separate file
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

// TODO: Move to a separate file
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
  width: ${props => props.isCombat ? 'min(600px, 95vw)' : '90%'};
  max-width: ${props => props.isCombat ? '600px' : '800px'};
  height: ${props => props.isCombat ? 'auto' : 'auto'};
  max-height: ${props => props.isCombat ? '700px' : '90vh'};
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

// TODO: Use the "real" ActionButton component
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

// TODO: Use the "real" ActionButton component
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

// TODO: Use the "real" ActionButton component
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
  const unlockGuardianProgression = useGameStore(state => state.unlockGuardianProgression);
  const startCombat = useGameStore(state => state.startCombat);

  // Event state
  const [currentScenario, setCurrentScenario] = useState<MoralScenario | null>(null);
  const [eventCompleted, setEventCompleted] = useState(false);
  const [eventResult, setEventResult] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      initializeEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, eventType]);

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

  /* initializeEvent() is used to set gameState (combat and moral, now. Gathering in the future) based on the event */
  // TODO: Maybe abstract this into a separate file?
  const initializeEvent = () => {
    setEventCompleted(false);
    setEventResult('');

    switch (eventType) {
      case 'combat':
        // Initialize combat in the global store with forest monsters
        // Get a random enemy based on the current location/map
        /* Call a random enemy */
        startCombat('random');
        /* Call a specific enemy */
        // startCombat('happy_tree1')
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

  // TODO: Abstract to its own file
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
    // const characterWithReducedEffects = processEventEffectReduction(gameState.character);
    // Object.assign(updates, characterWithReducedEffects);

    if (Object.keys(updates).length > 0) {
      updateCharacter(updates);
    }

    // TODO: Update karma and gold
  };

  // TODO: Abstract to its own file
  const handleGathering = (resource: GatheringResource) => {
    // TODO: Check energy and update inventory
    setEventResult(`You gathered ${resource.amount} ${resource.name}!`);
    setEventCompleted(true);

    // TODO: Set item into inventory

    // TODO: decrement any effects on player
    // Process persistent effect duration reduction for non-combat events
    // const characterWithReducedEffects = processEventEffectReduction(gameState.character);
    // updateCharacter(characterWithReducedEffects);
  };

  // TODO: Abstract to its own file
  const handleRest = () => {
    const disruptionChance = Math.random();

    if (disruptionChance < 0.15) {
      // Disrupted rest - only clears effects, doesn't fully restore
      const restoredHp = Math.floor(gameState.character.maxHealth * 0.5);
      const restoredMp = Math.floor(gameState.character.maxMana * 0.5);

      // Clear all persistent effects (as per requirements)
      // const characterWithClearedEffects = clearAllPersistentEffects(gameState.character);

      updateCharacter({
        // ...characterWithClearedEffects,
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
      // const characterWithClearedEffects = clearAllPersistentEffects(gameState.character);

      updateCharacter({
        // ...characterWithClearedEffects,
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

    /* All Event Types firing their respective modals */
    switch (eventType) {
      case 'combat':
        // CombatModal with bare=true renders without Dialog wrapper to avoid nested modals
        // EventModal provides the modal structure, CombatModal provides the combat UI
        return <CombatModal open={true} onOpenChange={onClose} bare={true} />;

      // TODO: Create MoralModal component
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

      // TODO: Create GatheringModal component
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

      // TODO: Create RestModal component
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