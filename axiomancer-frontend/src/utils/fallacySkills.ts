import { Skill, PhilosophicalAspect } from '../types/game';

/**
 * Fallacy-based skills system inspired by philosophical combat
 * These skills represent both offensive fallacies and defensive logical techniques
 */

export const fallacySkills: Record<string, Skill> = {
  // Formal Fallacies (Mind-based)
  affirming_consequent: {
    id: 'affirming_consequent',
    name: 'Affirming the Consequent',
    description: 'A logical fallacy that reverses cause and effect. Confuses enemies with backwards reasoning.',
    level: 1,
    manaCost: 15,
    damage: 20,
    effect: 'Reduces enemy intelligence temporarily',
    icon: '🔄',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 2,
      stats: { intelligence: 12 }
    }
  },

  denying_antecedent: {
    id: 'denying_antecedent',
    name: 'Denying the Antecedent',
    description: 'Another formal fallacy that breaks logical chains. Creates cognitive dissonance in opponents.',
    level: 1,
    manaCost: 18,
    damage: 25,
    effect: 'Chance to skip enemy turn due to confusion',
    icon: '❌',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { intelligence: 14 }
    }
  },

  // Informal Fallacies (Heart-based)
  ad_hominem: {
    id: 'ad_hominem',
    name: 'Ad Hominem Attack',
    description: 'Attack the person rather than their argument. Emotionally devastating but intellectually weak.',
    level: 1,
    manaCost: 12,
    damage: 30,
    effect: 'High emotional damage, low respect from observers',
    icon: '👤',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 1,
      stats: { charisma: 10 }
    }
  },

  appeal_to_emotion: {
    id: 'appeal_to_emotion',
    name: 'Appeal to Emotion',
    description: 'Bypass logic with pure emotional manipulation. Effective but ethically questionable.',
    level: 2,
    manaCost: 20,
    damage: 35,
    effect: 'Manipulates enemy emotional state',
    icon: '😢',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { charisma: 16 },
      philosophicalAlignment: { ethics: 'consequentialist' }
    }
  },

  // Physical/Empirical Fallacies (Body-based)
  hasty_generalization: {
    id: 'hasty_generalization',
    name: 'Hasty Generalization',
    description: 'Jump to conclusions based on limited evidence. Quick but unreliable reasoning.',
    level: 1,
    manaCost: 10,
    damage: 18,
    effect: 'Fast attack but chance of backfire',
    icon: '⚡',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 1,
      stats: { dexterity: 12 }
    }
  },

  false_analogy: {
    id: 'false_analogy',
    name: 'False Analogy',
    description: 'Compare incomparable things to create misleading parallels. Confuses through false similarity.',
    level: 2,
    manaCost: 16,
    damage: 22,
    effect: 'Creates confusion status effect',
    icon: '🔗',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { intelligence: 13, dexterity: 11 }
    }
  },

  // Defensive Logic Skills
  logical_analysis: {
    id: 'logical_analysis',
    name: 'Logical Analysis',
    description: 'Carefully examine arguments for flaws. Defensive technique that reveals enemy weaknesses.',
    level: 1,
    manaCost: 8,
    damage: 0,
    effect: 'Reveals enemy weaknesses and counters fallacies',
    icon: '🔍',
    type: 'logic',
    philosophicalAspect: 'mind',
    learningRequirement: {
      level: 2,
      stats: { wisdom: 14 },
      philosophicalAlignment: { epistemology: 'rationalist' }
    }
  },

  socratic_questioning: {
    id: 'socratic_questioning',
    name: 'Socratic Questioning',
    description: 'Ask probing questions that expose the foundations of arguments. Patience required.',
    level: 2,
    manaCost: 12,
    damage: 15,
    effect: 'Forces enemy to question their own position',
    icon: '❓',
    type: 'logic',
    philosophicalAspect: 'mind',
    learningRequirement: {
      level: 3,
      stats: { wisdom: 16, intelligence: 14 },
      philosophicalAlignment: { epistemology: 'skeptical' }
    }
  },

  // Virtue-based Skills
  compassionate_listening: {
    id: 'compassionate_listening',
    name: 'Compassionate Listening',
    description: 'Truly hear and understand your opponent. Sometimes the greatest victory is mutual understanding.',
    level: 1,
    manaCost: 5,
    damage: 0,
    effect: 'Chance to end combat peacefully, gain wisdom',
    icon: '👂',
    type: 'virtue',
    philosophicalAspect: 'heart',
    learningRequirement: {
      level: 2,
      stats: { wisdom: 12, charisma: 12 },
      philosophicalAlignment: { ethics: 'virtue' }
    }
  },

  moral_courage: {
    id: 'moral_courage',
    name: 'Moral Courage',
    description: 'Stand firm in your ethical convictions despite opposition. Inspires allies and intimidates foes.',
    level: 2,
    manaCost: 18,
    damage: 25,
    effect: 'Immune to fear effects, boost to all stats',
    icon: '🛡️',
    type: 'virtue',
    philosophicalAspect: 'heart',
    learningRequirement: {
      level: 4,
      stats: { constitution: 15, charisma: 14 },
      philosophicalAlignment: { ethics: 'deontological' }
    }
  },

  // Meditation and Awareness Skills
  mindful_awareness: {
    id: 'mindful_awareness',
    name: 'Mindful Awareness',
    description: 'Maintain present-moment awareness during conflict. See situations clearly without reactive thinking.',
    level: 2,
    manaCost: 14,
    damage: 0,
    effect: 'Immunity to confusion, enhanced perception',
    icon: '🧘',
    type: 'meditation',
    philosophicalAspect: 'mind',
    learningRequirement: {
      level: 3,
      stats: { wisdom: 15 },
      philosophicalAlignment: { epistemology: 'mystical' }
    }
  },

  // Rhetorical Skills
  dialectical_method: {
    id: 'dialectical_method',
    name: 'Dialectical Method',
    description: 'Engage in structured dialogue to find truth through opposing viewpoints.',
    level: 3,
    manaCost: 22,
    damage: 30,
    effect: 'Can turn enemy into ally if successful',
    icon: '⚖️',
    type: 'rhetoric',
    philosophicalAspect: 'mind',
    learningRequirement: {
      level: 5,
      stats: { intelligence: 18, charisma: 16 },
      philosophicalAlignment: { epistemology: 'rationalist' }
    }
  }
};

/**
 * Get available skills for a character based on their level and philosophical stance
 */
export function getAvailableSkills(character: any): Skill[] {
  return Object.values(fallacySkills).filter(skill => {
    if (!skill.learningRequirement) return true;
    
    const req = skill.learningRequirement;
    
    // Check level requirement
    if (character.level < req.level) return false;
    
    // Check stat requirements
    if (req.stats) {
      for (const [stat, value] of Object.entries(req.stats)) {
        if (character.stats[stat] < value) return false;
      }
    }
    
    // Check philosophical alignment requirements
    if (req.philosophicalAlignment) {
      for (const [aspect, value] of Object.entries(req.philosophicalAlignment)) {
        if (character.philosophicalStance[aspect] !== value) return false;
      }
    }
    
    return true;
  });
}

/**
 * Learn a new skill if requirements are met
 */
export function canLearnSkill(character: any, skillId: string): boolean {
  const skill = fallacySkills[skillId];
  if (!skill) return false;
  
  // Check if already known
  if (character.skills.some((s: Skill) => s.id === skillId)) return false;
  
  return getAvailableSkills(character).some(s => s.id === skillId);
}

/**
 * Apply skill effect in combat
 */
export function applySkillEffect(skill: Skill, caster: any, target: any): {
  damage: number;
  effects: string[];
  statusChanges: any;
} {
  const effects: string[] = [];
  let damage = skill.damage || 0;
  const statusChanges: any = {};
  
  // Apply philosophical aspect bonuses
  if (skill.philosophicalAspect) {
    switch (skill.philosophicalAspect) {
      case 'mind':
        damage += Math.floor(caster.stats.intelligence * 0.3);
        break;
      case 'heart':
        damage += Math.floor(caster.stats.charisma * 0.3);
        break;
      case 'body':
        damage += Math.floor(caster.stats.strength * 0.3);
        break;
    }
  }
  
  // Apply specific skill effects
  switch (skill.id) {
    case 'affirming_consequent':
      statusChanges.intelligenceDebuff = 3;
      effects.push('Target is confused by backwards logic!');
      break;
      
    case 'ad_hominem':
      if (target.stats.charisma > caster.stats.charisma) {
        damage *= 0.5;
        effects.push('Personal attack backfires against strong personality!');
      }
      break;
      
    case 'compassionate_listening':
      if (Math.random() < 0.3) {
        statusChanges.peacefulResolution = true;
        effects.push('Your compassion reaches through the conflict...');
      }
      break;
      
    case 'logical_analysis':
      statusChanges.revealWeaknesses = true;
      effects.push('You analyze your opponent\'s reasoning patterns...');
      break;
      
    case 'mindful_awareness':
      statusChanges.confusionImmunity = true;
      effects.push('Your awareness protects you from mental manipulation.');
      break;
  }
  
  effects.push(`${skill.name} costs ${skill.manaCost} mana`);
  
  return { damage, effects, statusChanges };
}