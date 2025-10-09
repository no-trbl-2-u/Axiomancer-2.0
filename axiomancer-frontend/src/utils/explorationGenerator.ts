import { ExplorationNode, DialogueOption } from '../types/game';

// Childhood theme data for peaceful exploration
const childhoodDialogueTopics = [
  {
    npcName: 'Elder Finn',
    questions: [
      {
        shallow: 'How is the fishing today?',
        deep: 'What wisdom have the tides taught you?',
        response: 'Ah, a thoughtful question! The tides teach us that all things flow in cycles, young one. Life ebbs and flows like the sea - sometimes we must be patient like the fisherman, sometimes bold like the wave.'
      },
      {
        shallow: 'Is it going to rain?',
        deep: 'How do the clouds reflect the moods of the heart?',
        response: 'You see with an artist\'s eye! Indeed, the sky mirrors our inner weather. When we are troubled, we notice the storms. When at peace, even gray clouds seem gentle.'
      }
    ]
  },
  {
    npcName: 'Baker Martha',
    questions: [
      {
        shallow: 'What bread do you have today?',
        deep: 'What does the act of baking teach about patience and transformation?',
        response: 'Oh my dear, you understand! Bread is life\'s greatest teacher. We mix simple things - flour, water, time - and with patience and warmth, something wonderful emerges. Just like growing up!'
      }
    ]
  },
  {
    npcName: 'Young Tom',
    questions: [
      {
        shallow: 'Want to play?',
        deep: 'What do you think makes a game truly fun?',
        response: 'Wow, nobody ever asked me that! I think... games are fun when everyone gets to be important, and when we make up new rules together. It\'s like making a story where we\'re all heroes!'
      }
    ]
  }
];

const childhoodCombatEnemies = [
  { id: 'friendly_seagull', name: 'Playful Seagull', description: 'A curious seagull that wants to play tug-of-war with your scarf.' },
  { id: 'mischievous_cat', name: 'Village Cat', description: 'A fluffy cat that playfully pounces on your feet.' },
  { id: 'stubborn_goat', name: 'Stubborn Goat', description: 'A goat blocking the path who needs gentle persuasion to move.' },
];

const childhoodDiscoveries = [
  {
    type: 'quest_item' as const,
    name: 'Beautiful Shell',
    description: 'An iridescent shell that catches the light beautifully. Someone might appreciate this.'
  },
  {
    type: 'consumable' as const,
    name: 'Sweet Berry',
    description: 'A wild berry that restores energy when eaten.',
    effect: 'restore_energy',
    amount: 2
  },
  {
    type: 'consumable' as const,
    name: 'Fresh Spring Water',
    description: 'Crystal clear water that refreshes the mind.',
    effect: 'restore_energy',
    amount: 3
  },
  {
    type: 'quest_item' as const,
    name: 'Forgotten Letter',
    description: 'An old letter someone dropped. You should return it to its owner.'
  }
];

export function generateRandomExplorationNodes(globalNodeId: string, count: number = 3): ExplorationNode[] {
  const nodes: ExplorationNode[] = [];

  for (let i = 0; i < count; i++) {
    const nodeType = Math.random() < 0.4 ? 'dialogue' : Math.random() < 0.7 ? 'discovery' : 'combat';

    switch (nodeType) {
      case 'dialogue': {
        const dialogueData = childhoodDialogueTopics[Math.floor(Math.random() * childhoodDialogueTopics.length)];
        const question = dialogueData?.questions[Math.floor(Math.random() * dialogueData.questions.length)];

        if (!question) {
          console.warn('No question found for dialogue node');
          continue;
        }

        // Generate 6 dialogue options with one being the "real" answer
        const correctIndex = Math.floor(Math.random() * 6);
        const options: DialogueOption[] = [
          {
            id: `option_0`,
            text: correctIndex === 0 ? question.deep : question.shallow,
            isCorrect: correctIndex === 0,
            response: correctIndex === 0 ? question.response : 'Oh, well...',
            energyReward: correctIndex === 0 ? 2 : 0
          },
          {
            id: `option_1`,
            text: correctIndex === 1 ? question.deep : generateShallowResponse(),
            isCorrect: correctIndex === 1,
            response: correctIndex === 1 ? question.response : 'I suppose...',
            energyReward: correctIndex === 1 ? 2 : 0
          },
          {
            id: `option_2`,
            text: correctIndex === 2 ? question.deep : generateShallowResponse(),
            isCorrect: correctIndex === 2,
            response: correctIndex === 2 ? question.response : 'Hmm, maybe...',
            energyReward: correctIndex === 2 ? 2 : 0
          },
          {
            id: `option_3`,
            text: correctIndex === 3 ? question.deep : generateShallowResponse(),
            isCorrect: correctIndex === 3,
            response: correctIndex === 3 ? question.response : 'That\'s nice...',
            energyReward: correctIndex === 3 ? 2 : 0
          },
          {
            id: `option_4`,
            text: correctIndex === 4 ? question.deep : generateShallowResponse(),
            isCorrect: correctIndex === 4,
            response: correctIndex === 4 ? question.response : 'Sure...',
            energyReward: correctIndex === 4 ? 2 : 0
          },
          {
            id: `option_5`,
            text: correctIndex === 5 ? question.deep : generateShallowResponse(),
            isCorrect: correctIndex === 5,
            response: correctIndex === 5 ? question.response : 'I see...',
            energyReward: correctIndex === 5 ? 2 : 0
          }
        ];

        if (!dialogueData) {
          console.warn('No dialogue data found for dialogue node');
          continue;
        }

        nodes.push({
          id: `${globalNodeId}_dialogue_${i}`,
          type: 'dialogue',
          title: `Talk with ${dialogueData.npcName}`,
          description: `${dialogueData.npcName} seems to have wisdom to share.`,
          energyCost: 1,
          completed: false,
          npcName: dialogueData.npcName,
          dialogueOptions: options
        });
        break;
      }

      case 'combat': {
        const enemy = childhoodCombatEnemies[Math.floor(Math.random() * childhoodCombatEnemies.length)];
        if (!enemy) {
          console.warn('No enemy found for combat node');
          continue;
        }
        nodes.push({
          id: `${globalNodeId}_combat_${i}`,
          type: 'combat',
          title: `Encounter with ${enemy.name}`,
          description: enemy.description,
          energyCost: 2,
          completed: false,
          enemyId: enemy.id
        });
        break;
      }

      case 'discovery': {
        const discovery = childhoodDiscoveries[Math.floor(Math.random() * childhoodDiscoveries.length)];
        if (!discovery) {
          console.warn('No discovery found for discovery node');
          continue;
        }
        nodes.push({
          id: `${globalNodeId}_discovery_${i}`,
          type: 'discovery',
          title: `Discover ${discovery.name}`,
          description: discovery.description,
          energyCost: 1,
          completed: false,
          discoveryType: discovery.type
        });
        break;
      }
    }
  }

  return nodes.filter(node => node !== null);
}

function generateShallowResponse(): string {
  const shallowResponses = [
    'Nice weather today, isn\'t it?',
    'How has your day been?',
    'Everything going well?',
    'Busy day?',
    'Things look good here.',
    'Hope you\'re doing fine.'
  ];
  const index = Math.floor(Math.random() * shallowResponses.length);
  return shallowResponses[index] || 'That\'s interesting...';
}