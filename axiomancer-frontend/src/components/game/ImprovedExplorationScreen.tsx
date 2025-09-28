import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

interface ExplorationEvent {
  id: string;
  title: string;
  description: string;
  type: 'philosophical_dilemma' | 'combat' | 'discovery' | 'npc_encounter';
  choices: ExplorationChoice[];
}

interface ExplorationChoice {
  id: string;
  text: string;
  approach: 'body' | 'mind' | 'heart';
  description: string;
  consequences: {
    experience: number;
    attributes?: { body?: number; mind?: number; heart?: number };
    items?: string[];
    corruption?: number;
  };
}

const EXPLORATION_EVENTS: ExplorationEvent[] = [
  {
    id: 'trolley_problem',
    title: 'The Runaway Cart',
    description: 'You come across a runaway cart heading toward five people on the tracks. You could pull a lever to divert it to another track, but there\'s one person on that track. What do you do?',
    type: 'philosophical_dilemma',
    choices: [
      {
        id: 'pull_lever',
        text: 'Pull the lever (Utilitarian approach)',
        approach: 'mind',
        description: 'Save five lives by sacrificing one - the greatest good for the greatest number.',
        consequences: {
          experience: 50,
          attributes: { mind: 1 },
          corruption: 10
        }
      },
      {
        id: 'do_nothing',
        text: 'Do nothing (Deontological approach)',
        approach: 'heart',
        description: 'You cannot actively cause harm, even to prevent greater harm.',
        consequences: {
          experience: 50,
          attributes: { heart: 1 }
        }
      },
      {
        id: 'try_stop_cart',
        text: 'Try to physically stop the cart (Virtue ethics)',
        approach: 'body',
        description: 'Risk yourself to try to save everyone through direct action.',
        consequences: {
          experience: 75,
          attributes: { body: 1, heart: 1 }
        }
      }
    ]
  },
  {
    id: 'sophist_encounter',
    title: 'The Deceiving Sophist',
    description: 'A silver-tongued philosopher challenges you to a debate, but you sense they use false arguments to confuse rather than illuminate truth.',
    type: 'combat',
    choices: [
      {
        id: 'expose_fallacies',
        text: 'Expose their logical fallacies (Mind combat)',
        approach: 'mind',
        description: 'Use rigorous logic to dismantle their deceptive arguments.',
        consequences: {
          experience: 40,
          attributes: { mind: 2 }
        }
      },
      {
        id: 'emotional_appeal',
        text: 'Appeal to their humanity (Heart combat)',
        approach: 'heart',
        description: 'Try to reach their genuine self beneath the sophistry.',
        consequences: {
          experience: 40,
          attributes: { heart: 2 }
        }
      },
      {
        id: 'walk_away',
        text: 'Refuse to engage (Body - physical departure)',
        approach: 'body',
        description: 'Sometimes the wisest choice is not to play the game.',
        consequences: {
          experience: 20,
          attributes: { body: 1 }
        }
      }
    ]
  },
  {
    id: 'ancient_text',
    title: 'Forgotten Wisdom',
    description: 'You discover an ancient philosophical text partially buried in the ruins. Its pages contain insights that could expand your understanding.',
    type: 'discovery',
    choices: [
      {
        id: 'study_carefully',
        text: 'Study it meticulously (Mind approach)',
        approach: 'mind',
        description: 'Analyze every word and argument with scholarly rigor.',
        consequences: {
          experience: 60,
          attributes: { mind: 2 },
          items: ['Ancient Wisdom Scroll']
        }
      },
      {
        id: 'meditate_on_it',
        text: 'Meditate on its meaning (Heart approach)',
        approach: 'heart',
        description: 'Let the wisdom sink into your soul through contemplation.',
        consequences: {
          experience: 60,
          attributes: { heart: 2 },
          items: ['Contemplative Insights']
        }
      }
    ]
  }
];

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.lg};
  gap: ${theme.spacing.lg};
`;

const LocationHeader = styled.div`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};

  h1 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.md} 0;
  }

  .description {
    color: ${theme.colors.text.secondary};
    line-height: 1.6;
    margin-bottom: ${theme.spacing.md};
  }

  .actions {
    display: flex;
    gap: ${theme.spacing.md};
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const EventPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  flex: 1;

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.md} 0;
  }

  .event-description {
    color: ${theme.colors.text.primary};
    line-height: 1.6;
    margin-bottom: ${theme.spacing.lg};
    font-size: 1.1rem;
  }

  .choices {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const ChoiceButton = styled.button<{ approach: 'body' | 'mind' | 'heart' }>`
  background: ${props =>
    props.approach === 'body' ? '#DC143C' :
    props.approach === 'mind' ? '#4169E1' :
    '#FF6B35'
  };
  color: white;
  border: none;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;

  .choice-text {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: ${theme.spacing.sm};
  }

  .choice-description {
    font-size: 0.9rem;
    opacity: 0.9;
    line-height: 1.4;
  }

  .approach-label {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    margin-bottom: ${theme.spacing.sm};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ResultPanel = styled.div`
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.success};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};

  h3 {
    color: ${theme.colors.success};
    margin: 0 0 ${theme.spacing.md} 0;
  }

  .gains {
    display: flex;
    gap: ${theme.spacing.md};
    flex-wrap: wrap;
    margin-top: ${theme.spacing.md};
  }

  .gain {
    background: ${theme.colors.background.secondary};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    color: ${theme.colors.text.primary};
    font-weight: 600;
  }
`;

export const ImprovedExplorationScreen: React.FC = () => {
  const { gameState, updateCharacter, changeScreen } = useGame();
  const [currentEvent, setCurrentEvent] = useState<ExplorationEvent | null>(null);
  const [eventResult, setEventResult] = useState<string | null>(null);
  const [choiceRewards, setChoiceRewards] = useState<any>(null);

  const currentLocation = gameState.locations[gameState.currentLocation];

  const startExploration = () => {
    // 30% chance of combat encounter, 70% chance of philosophical event
    const combatChance = Math.random() < 0.3;

    if (combatChance) {
      // Trigger combat
      changeScreen('combat');
      return;
    }

    // Randomly select a philosophical event
    const randomEvent = EXPLORATION_EVENTS[Math.floor(Math.random() * EXPLORATION_EVENTS.length)];
    setCurrentEvent(randomEvent);
    setEventResult(null);
    setChoiceRewards(null);
  };

  const handleChoice = (choice: ExplorationChoice) => {
    // Apply consequences
    const { experience, attributes, items, corruption } = choice.consequences;

    // Update character
    if (attributes) {
      const currentStats = gameState.character.stats;
      updateCharacter({
        stats: {
          ...currentStats,
          strength: currentStats.strength + (attributes.body || 0),
          intelligence: currentStats.intelligence + (attributes.mind || 0),
          charisma: currentStats.charisma + (attributes.heart || 0),
        }
      });
    }

    // Show results
    setEventResult(choice.description);
    setChoiceRewards(choice.consequences);

    // Clear event after showing result
    setTimeout(() => {
      setCurrentEvent(null);
      setEventResult(null);
      setChoiceRewards(null);
    }, 4000);
  };

  const getApproachIcon = (approach: 'body' | 'mind' | 'heart') => {
    switch (approach) {
      case 'body': return '💪';
      case 'mind': return '🧠';
      case 'heart': return '❤️';
      default: return '❓';
    }
  };

  return (
    <Container>
      <LocationHeader>
        <h1>{currentLocation?.name || 'Unknown Location'}</h1>
        <div className="description">
          {currentLocation?.description || 'A place of mystery and philosophical discovery.'}
        </div>
        <div className="actions">
          <ActionButton onClick={startExploration}>
            🔍 Begin Exploration
          </ActionButton>
          <ActionButton onClick={() => console.log('Rest')}>
            😴 Rest and Restore
          </ActionButton>
          <ActionButton onClick={() => console.log('Meditate')}>
            🧘 Contemplate Life
          </ActionButton>
          <ActionButton onClick={() => console.log('Search for wisdom')}>
            📚 Seek Ancient Wisdom
          </ActionButton>
        </div>
      </LocationHeader>

      {currentEvent && !eventResult && (
        <EventPanel>
          <h2>{currentEvent.title}</h2>
          <div className="event-description">
            {currentEvent.description}
          </div>

          <div className="choices">
            {currentEvent.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                approach={choice.approach}
                onClick={() => handleChoice(choice)}
              >
                <div className="approach-label">
                  {getApproachIcon(choice.approach)} {choice.approach.toUpperCase()} APPROACH
                </div>
                <div className="choice-text">{choice.text}</div>
                <div className="choice-description">{choice.description}</div>
              </ChoiceButton>
            ))}
          </div>
        </EventPanel>
      )}

      {eventResult && choiceRewards && (
        <ResultPanel>
          <h3>Philosophical Growth Achieved!</h3>
          <p>{eventResult}</p>

          <div className="gains">
            {choiceRewards.experience && (
              <div className="gain">+{choiceRewards.experience} Experience</div>
            )}
            {choiceRewards.attributes?.body && (
              <div className="gain">💪 +{choiceRewards.attributes.body} Body</div>
            )}
            {choiceRewards.attributes?.mind && (
              <div className="gain">🧠 +{choiceRewards.attributes.mind} Mind</div>
            )}
            {choiceRewards.attributes?.heart && (
              <div className="gain">❤️ +{choiceRewards.attributes.heart} Heart</div>
            )}
            {choiceRewards.items?.map((item: string) => (
              <div key={item} className="gain">📜 {item}</div>
            ))}
            {choiceRewards.corruption && (
              <div className="gain" style={{ background: '#DC143C' }}>
                ⚠️ +{choiceRewards.corruption} Corruption
              </div>
            )}
          </div>
        </ResultPanel>
      )}
    </Container>
  );
};