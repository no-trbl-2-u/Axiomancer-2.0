import { Character, PhilosophicalStance, ChoiceOutcome } from '../types/game';

export interface PhilosophicalEvent {
  id: string;
  title: string;
  description: string;
  context: string;
  choices: PhilosophicalChoice[];
  requiredLocation?: string;
  oneTime?: boolean;
  requirements?: {
    level?: number;
    stats?: Partial<Character['stats']>;
    philosophicalAlignment?: Partial<PhilosophicalStance>;
  };
}

export interface PhilosophicalChoice {
  id: string;
  text: string;
  philosophicalPosition: string;
  alignment: Partial<PhilosophicalStance>;
  outcomes: ChoiceOutcome[];
  consequences: string;
}

export const philosophicalEvents: Record<string, PhilosophicalEvent> = {
  trolley_problem: {
    id: 'trolley_problem',
    title: 'The Trolley Dilemma',
    description: 'You come across a runaway trolley heading toward five people. You can pull a lever to divert it to another track, but there is one person on that track.',
    context: 'A classic ethical thought experiment that tests utilitarian vs. deontological thinking.',
    choices: [
      {
        id: 'pull_lever',
        text: 'Pull the lever - save five lives by sacrificing one',
        philosophicalPosition: 'Utilitarian/Consequentialist',
        alignment: { ethics: 'consequentialist' },
        outcomes: [
          { type: 'stat_change', key: 'constitution', value: 2 },
          { type: 'stat_change', key: 'charisma', value: -1 }
        ],
        consequences: 'You prioritize the greater good, but feel the weight of directly causing harm.'
      },
      {
        id: 'dont_pull',
        text: 'Do not pull the lever - refuse to directly cause harm',
        philosophicalPosition: 'Deontological',
        alignment: { ethics: 'deontological' },
        outcomes: [
          { type: 'stat_change', key: 'wisdom', value: 2 },
          { type: 'stat_change', key: 'strength', value: -1 }
        ],
        consequences: 'You maintain moral purity by not directly harming anyone, despite the greater loss.'
      },
      {
        id: 'question_scenario',
        text: 'Question the validity of the scenario itself',
        philosophicalPosition: 'Meta-ethical Skepticism',
        alignment: { epistemology: 'skeptical' },
        outcomes: [
          { type: 'stat_change', key: 'intelligence', value: 3 },
          { type: 'stat_change', key: 'charisma', value: 1 }
        ],
        consequences: 'You realize that artificial dilemmas may not reflect real moral complexity.'
      }
    ],
    requiredLocation: 'fishing_town',
    oneTime: true
  },

  cave_of_forms: {
    id: 'cave_of_forms',
    title: 'The Cave of Forms',
    description: 'Deep in the crystal caverns, you find a chamber where shadows dance on the walls, reminiscent of Plato\'s Cave allegory.',
    context: 'You must decide how to interpret reality - are the shadows real, or mere reflections of higher truth?',
    choices: [
      {
        id: 'shadows_real',
        text: 'The shadows are the only reality we can know',
        philosophicalPosition: 'Empiricist/Materialist',
        alignment: { epistemology: 'empiricist', metaphysics: 'materialist' },
        outcomes: [
          { type: 'stat_change', key: 'constitution', value: 2 },
          { type: 'stat_change', key: 'dexterity', value: 1 }
        ],
        consequences: 'You ground yourself in observable reality, gaining practical strength.'
      },
      {
        id: 'forms_exist',
        text: 'The shadows point to perfect Forms beyond our perception',
        philosophicalPosition: 'Platonic Idealist',
        alignment: { metaphysics: 'idealist', epistemology: 'rationalist' },
        outcomes: [
          { type: 'stat_change', key: 'intelligence', value: 3 },
          { type: 'stat_change', key: 'wisdom', value: 2 }
        ],
        consequences: 'Your mind expands to contemplate higher realities beyond the physical.'
      },
      {
        id: 'both_valid',
        text: 'Both the shadows and Forms have their place in understanding',
        philosophicalPosition: 'Dualist/Pragmatic',
        alignment: { metaphysics: 'dualist' },
        outcomes: [
          { type: 'stat_change', key: 'wisdom', value: 2 },
          { type: 'stat_change', key: 'charisma', value: 2 },
          { type: 'stat_change', key: 'intelligence', value: 1 }
        ],
        consequences: 'Your balanced perspective allows you to see value in multiple viewpoints.'
      }
    ],
    requiredLocation: 'cave',
    oneTime: true,
    requirements: {
      level: 2,
      stats: { intelligence: 12 }
    }
  },

  ship_of_theseus: {
    id: 'ship_of_theseus',
    title: 'The Ship of Theseus',
    description: 'At the coastal cliffs, you find an ancient ship. Over the years, every plank has been replaced. Is it still the same ship?',
    context: 'This classic paradox questions the nature of identity and continuity over time.',
    choices: [
      {
        id: 'same_ship',
        text: 'Yes, it maintains its essential identity despite changes',
        philosophicalPosition: 'Essentialist',
        alignment: { metaphysics: 'idealist' },
        outcomes: [
          { type: 'stat_change', key: 'wisdom', value: 2 },
          { type: 'stat_change', key: 'constitution', value: 1 }
        ],
        consequences: 'You believe in persistent identity that transcends physical changes.'
      },
      {
        id: 'different_ship',
        text: 'No, it is entirely different - identity is tied to physical composition',
        philosophicalPosition: 'Materialist',
        alignment: { metaphysics: 'materialist' },
        outcomes: [
          { type: 'stat_change', key: 'intelligence', value: 2 },
          { type: 'stat_change', key: 'dexterity', value: 1 }
        ],
        consequences: 'You ground identity in physical reality and observable change.'
      },
      {
        id: 'gradual_change',
        text: 'Identity is gradual and continuous - there is no clear answer',
        philosophicalPosition: 'Process Philosophy',
        alignment: { epistemology: 'skeptical' },
        outcomes: [
          { type: 'stat_change', key: 'wisdom', value: 3 },
          { type: 'stat_change', key: 'charisma', value: 2 }
        ],
        consequences: 'You embrace the complexity of identity as an ongoing process rather than fixed state.'
      }
    ],
    requiredLocation: 'coastal_cliffs',
    oneTime: true,
    requirements: {
      level: 3
    }
  },

  moral_relativism_debate: {
    id: 'moral_relativism_debate',
    title: 'The Relativism Debate',
    description: 'In the ancient ruins, you encounter spirits of philosophers debating whether moral truths are universal or relative to culture.',
    context: 'This fundamental ethical question shapes how we approach moral judgment across different societies.',
    choices: [
      {
        id: 'universal_morals',
        text: 'Moral truths are universal and apply to all beings',
        philosophicalPosition: 'Moral Universalism',
        alignment: { ethics: 'deontological' },
        outcomes: [
          { type: 'stat_change', key: 'constitution', value: 2 },
          { type: 'stat_change', key: 'charisma', value: 1 }
        ],
        consequences: 'Your conviction in universal principles strengthens your resolve.'
      },
      {
        id: 'relative_morals',
        text: 'Morality is relative to culture and context',
        philosophicalPosition: 'Moral Relativism',
        alignment: { epistemology: 'empiricist' },
        outcomes: [
          { type: 'stat_change', key: 'wisdom', value: 2 },
          { type: 'stat_change', key: 'dexterity', value: 2 }
        ],
        consequences: 'Your cultural sensitivity enhances your ability to adapt and understand others.'
      },
      {
        id: 'virtue_focus',
        text: 'Focus on character rather than rules or consequences',
        philosophicalPosition: 'Virtue Ethics',
        alignment: { ethics: 'virtue' },
        outcomes: [
          { type: 'stat_change', key: 'charisma', value: 3 },
          { type: 'stat_change', key: 'wisdom', value: 1 }
        ],
        consequences: 'You prioritize the development of good character over abstract moral rules.'
      }
    ],
    requiredLocation: 'ancient_ruins',
    oneTime: true,
    requirements: {
      level: 4,
      stats: { wisdom: 14 }
    }
  },

  meditation_on_suffering: {
    id: 'meditation_on_suffering',
    title: 'Meditation on Suffering',
    description: 'At the mountaintop temple, you contemplate the nature of suffering and its role in human existence.',
    context: 'Drawing from Buddhist and Stoic traditions, this meditation explores how we relate to unavoidable pain.',
    choices: [
      {
        id: 'suffering_illusion',
        text: 'Suffering is an illusion created by attachment',
        philosophicalPosition: 'Buddhist Philosophy',
        alignment: { epistemology: 'mystical', ethics: 'virtue' },
        outcomes: [
          { type: 'stat_change', key: 'wisdom', value: 4 },
          { type: 'stat_change', key: 'constitution', value: -1 }
        ],
        consequences: 'You gain profound wisdom but may become detached from physical concerns.'
      },
      {
        id: 'suffering_noble',
        text: 'Suffering can be noble and lead to growth',
        philosophicalPosition: 'Stoicism',
        alignment: { ethics: 'virtue', metaphysics: 'dualist' },
        outcomes: [
          { type: 'stat_change', key: 'constitution', value: 3 },
          { type: 'stat_change', key: 'wisdom', value: 2 }
        ],
        consequences: 'You develop resilience and inner strength through accepting hardship.'
      },
      {
        id: 'suffering_eliminate',
        text: 'Suffering should be eliminated through reason and action',
        philosophicalPosition: 'Utilitarian Optimism',
        alignment: { ethics: 'consequentialist', epistemology: 'rationalist' },
        outcomes: [
          { type: 'stat_change', key: 'intelligence', value: 2 },
          { type: 'stat_change', key: 'strength', value: 2 },
          { type: 'stat_change', key: 'dexterity', value: 1 }
        ],
        consequences: 'Your commitment to reducing suffering motivates practical action.'
      }
    ],
    requiredLocation: 'mountaintop_temple',
    oneTime: true,
    requirements: {
      level: 5,
      stats: { wisdom: 16 }
    }
  }
};

/**
 * Get available philosophical events for a location and character
 */
export function getAvailableEvents(character: Character, locationId: string): PhilosophicalEvent[] {
  return Object.values(philosophicalEvents).filter(event => {
    // Check location requirement
    if (event.requiredLocation && event.requiredLocation !== locationId) {
      return false;
    }
    
    // Check character requirements
    if (event.requirements) {
      const req = event.requirements;
      
      if (req.level && character.level < req.level) return false;
      
      if (req.stats) {
        for (const [stat, value] of Object.entries(req.stats)) {
          if (character.stats[stat as keyof typeof character.stats] < value) return false;
        }
      }
      
      if (req.philosophicalAlignment) {
        for (const [aspect, value] of Object.entries(req.philosophicalAlignment)) {
          if (character.philosophicalStance[aspect as keyof PhilosophicalStance] !== value) return false;
        }
      }
    }
    
    return true;
  });
}

/**
 * Apply the consequences of a philosophical choice
 */
export function applyPhilosophicalChoice(
  character: Character, 
  choice: PhilosophicalChoice
): { 
  updatedCharacter: Partial<Character>, 
  message: string 
} {
  const updates: Partial<Character> = {
    philosophicalStance: {
      ...character.philosophicalStance,
      ...choice.alignment
    }
  };

  const stats = { ...character.stats };
  let message = choice.consequences;

  // Apply stat changes
  choice.outcomes.forEach(outcome => {
    if (outcome.type === 'stat_change') {
      const statKey = outcome.key as keyof typeof stats;
      if (typeof outcome.value === 'number') {
        stats[statKey] += outcome.value;
        
        if (outcome.value > 0) {
          message += ` (+${outcome.value} ${outcome.key.toUpperCase()})`;
        } else {
          message += ` (${outcome.value} ${outcome.key.toUpperCase()})`;
        }
      }
    }
  });

  updates.stats = stats;

  return { updatedCharacter: updates, message };
}

/**
 * Generate a random philosophical encounter for a location
 */
export function generateRandomEncounter(locationId: string): PhilosophicalEvent | null {
  const locationEvents = Object.values(philosophicalEvents).filter(
    event => !event.requiredLocation || event.requiredLocation === locationId
  );
  
  if (locationEvents.length === 0) return null;
  
  const selectedEvent = locationEvents[Math.floor(Math.random() * locationEvents.length)];
  return selectedEvent || null;
}

/**
 * Create location-specific meditation events
 */
export function createMeditationEvent(locationId: string): PhilosophicalEvent {
  const baseEvent = {
    id: `meditation_${locationId}`,
    title: 'Moment of Reflection',
    oneTime: false,
    requirements: { level: 1 }
  };

  switch (locationId) {
    case 'fishing_town':
      return {
        ...baseEvent,
        description: 'Sitting by the peaceful waters, you reflect on your journey and purpose.',
        context: 'The tranquil environment invites contemplation of your path.',
        choices: [
          {
            id: 'reflect_past',
            text: 'Reflect on lessons from your guardian',
            philosophicalPosition: 'Gratitude and Tradition',
            alignment: { ethics: 'virtue' },
            outcomes: [{ type: 'stat_change', key: 'wisdom', value: 1 }],
            consequences: 'You feel grounded in the wisdom passed down to you.'
          },
          {
            id: 'plan_future',
            text: 'Plan your future adventures and goals',
            philosophicalPosition: 'Forward-thinking Pragmatism',
            alignment: { metaphysics: 'pragmatist' },
            outcomes: [{ type: 'stat_change', key: 'intelligence', value: 1 }],
            consequences: 'Clear planning sharpens your mind for challenges ahead.'
          }
        ]
      };

    case 'forest':
      return {
        ...baseEvent,
        description: 'Among the ancient trees, you feel connected to the natural world and its wisdom.',
        context: 'Nature has always been a teacher for those who know how to listen.',
        choices: [
          {
            id: 'nature_wisdom',
            text: 'Learn from the natural cycles of growth and decay',
            philosophicalPosition: 'Natural Philosophy',
            alignment: { epistemology: 'empiricist' },
            outcomes: [{ type: 'stat_change', key: 'constitution', value: 1 }],
            consequences: 'Nature teaches you about resilience and adaptation.'
          },
          {
            id: 'interconnection',
            text: 'Contemplate the interconnectedness of all life',
            philosophicalPosition: 'Holistic Thinking',
            alignment: { metaphysics: 'idealist' },
            outcomes: [{ type: 'stat_change', key: 'charisma', value: 1 }],
            consequences: 'You feel your connection to the larger web of existence.'
          }
        ]
      };

    default:
      return {
        ...baseEvent,
        description: 'You take a moment to reflect on your experiences and growth.',
        context: 'Self-reflection is the foundation of philosophical development.',
        choices: [
          {
            id: 'general_reflection',
            text: 'Consider what you have learned so far',
            philosophicalPosition: 'Self-Knowledge',
            alignment: {},
            outcomes: [{ type: 'stat_change', key: 'wisdom', value: 1 }],
            consequences: 'Reflection brings clarity and understanding.'
          }
        ]
      };
  }
}