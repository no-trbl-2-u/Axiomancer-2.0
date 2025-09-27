import { Quest, QuestObjective, Character, GameLocation } from '../types/game';

export const initialQuests: Quest[] = [
  {
    id: 'philosophical_awakening',
    name: 'Philosophical Awakening',
    description: 'Begin your journey of philosophical discovery by exploring different ways of thinking.',
    objectives: [
      {
        id: 'talk_to_guardian',
        description: 'Speak with your guardian about the philosophical journey ahead',
        completed: false,
        requirement: { type: 'stat', key: 'dialogue_guardian', value: 1 }
      },
      {
        id: 'visit_forest',
        description: 'Visit the Whispering Forest and contemplate nature',
        completed: false,
        requirement: { type: 'stat', key: 'visited_forest', value: 1 }
      },
      {
        id: 'first_combat',
        description: 'Face your first philosophical challenge in combat',
        completed: false,
        requirement: { type: 'stat', key: 'combat_victories', value: 1 }
      }
    ],
    completed: false,
    philosophicalTheme: 'Introduction to philosophical thinking and the journey of self-discovery'
  },

  {
    id: 'fallacy_hunter',
    name: 'The Fallacy Hunter',
    description: 'Learn to identify and combat logical fallacies that plague reasoning.',
    objectives: [
      {
        id: 'defeat_abortive_fallacy',
        description: 'Defeat the Abortive Fallacy in the Whispering Forest',
        completed: false,
        requirement: { type: 'stat', key: 'defeated_abortive_fallacy', value: 1 }
      },
      {
        id: 'learn_fallacy_skill',
        description: 'Learn your first fallacy-based skill',
        completed: false,
        requirement: { type: 'stat', key: 'fallacy_skills_learned', value: 1 }
      },
      {
        id: 'collect_fallacy_essence',
        description: 'Collect essence from defeated fallacies',
        completed: false,
        requirement: { type: 'item', key: 'fallacy_essence', value: 3 }
      }
    ],
    completed: false,
    philosophicalTheme: 'Critical thinking and the identification of logical errors'
  },

  {
    id: 'wisdom_seeker',
    name: 'Seeker of Ancient Wisdom',
    description: 'Explore the ancient ruins and temples to gain deeper philosophical understanding.',
    objectives: [
      {
        id: 'visit_ruins',
        description: 'Explore the Ancient Philosophical Ruins',
        completed: false,
        requirement: { type: 'stat', key: 'visited_ancient_ruins', value: 1 }
      },
      {
        id: 'meet_ancient_sage',
        description: 'Speak with the Spirit of an Ancient Sage',
        completed: false,
        requirement: { type: 'stat', key: 'met_ancient_sage', value: 1 }
      },
      {
        id: 'reach_temple',
        description: 'Reach the Temple of Contemplation',
        completed: false,
        requirement: { type: 'stat', key: 'visited_temple', value: 1 }
      },
      {
        id: 'master_meditation',
        description: 'Learn advanced meditation techniques',
        completed: false,
        requirement: { type: 'stat', key: 'meditation_level', value: 3 }
      }
    ],
    completed: false,
    philosophicalTheme: 'Ancient wisdom and the pursuit of deeper understanding'
  },

  {
    id: 'ethical_trials',
    name: 'The Ethical Trials',
    description: 'Face moral dilemmas that will shape your ethical framework and character.',
    objectives: [
      {
        id: 'trolley_problem',
        description: 'Resolve the trolley problem dilemma',
        completed: false,
        requirement: { type: 'stat', key: 'trolley_resolved', value: 1 }
      },
      {
        id: 'ship_theseus',
        description: 'Contemplate the Ship of Theseus paradox',
        completed: false,
        requirement: { type: 'stat', key: 'theseus_contemplated', value: 1 }
      },
      {
        id: 'develop_ethics',
        description: 'Develop a clear ethical stance through choices',
        completed: false,
        requirement: { type: 'stat', key: 'ethical_choices_made', value: 5 }
      }
    ],
    completed: false,
    philosophicalTheme: 'Moral reasoning and the development of ethical principles'
  }
];

/**
 * Check if a quest objective is completed based on character progress
 */
export function checkQuestObjectiveCompletion(
  objective: QuestObjective, 
  character: Character,
  gameState: any
): boolean {
  const req = objective.requirement;
  
  switch (req.type) {
    case 'stat':
      // For now, we'll track these as custom properties on the character
      // In a full implementation, these would be tracked in the game state
      return (character as any)[req.key] >= req.value;
      
    case 'item':
      const item = character.inventory.find(item => item.id === req.key);
      return item ? item.quantity >= (req.value as number) : false;
      
    case 'level':
      return character.level >= (req.value as number);
      
    default:
      return false;
  }
}

/**
 * Update quest progress based on character and game state changes
 */
export function updateQuestProgress(
  quests: Quest[], 
  character: Character, 
  gameState: any
): Quest[] {
  return quests.map(quest => {
    if (quest.completed) return quest;
    
    const updatedObjectives = quest.objectives.map(objective => ({
      ...objective,
      completed: objective.completed || checkQuestObjectiveCompletion(objective, character, gameState)
    }));
    
    const allObjectivesComplete = updatedObjectives.every(obj => obj.completed);
    
    return {
      ...quest,
      objectives: updatedObjectives,
      completed: allObjectivesComplete
    };
  });
}

/**
 * Award experience and rewards for completed quests
 */
export function awardQuestRewards(quest: Quest, character: Character): Partial<Character> {
  if (!quest.completed) return {};
  
  // Base quest rewards
  const experienceGained = quest.objectives.length * 50;
  const newLevel = character.level + (experienceGained >= 100 ? 1 : 0);
  
  // Philosophical theme bonuses
  const statBonuses: Partial<Character['stats']> = {};
  
  switch (quest.philosophicalTheme?.toLowerCase()) {
    case 'critical thinking':
      statBonuses.intelligence = (statBonuses.intelligence || 0) + 2;
      statBonuses.wisdom = (statBonuses.wisdom || 0) + 1;
      break;
    case 'ancient wisdom':
      statBonuses.wisdom = (statBonuses.wisdom || 0) + 3;
      statBonuses.charisma = (statBonuses.charisma || 0) + 1;
      break;
    case 'moral reasoning':
      statBonuses.charisma = (statBonuses.charisma || 0) + 2;
      statBonuses.constitution = (statBonuses.constitution || 0) + 1;
      break;
    default:
      statBonuses.wisdom = (statBonuses.wisdom || 0) + 1;
  }
  
  return {
    level: newLevel,
    stats: {
      ...character.stats,
      ...Object.fromEntries(
        Object.entries(statBonuses).map(([key, bonus]) => [
          key, 
          character.stats[key as keyof Character['stats']] + (bonus || 0)
        ])
      )
    }
  };
}