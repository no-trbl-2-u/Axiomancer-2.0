import { Skill } from '../types/game';

/**
 * Body Fallacies - Focus on force, intimidation, and physical arguments
 * MP costs: 10 → 15 → 20 → 25 → 30
 */

export const adHominemFallacy: Skill = {
  id: 'ad_hominem',
  name: 'Ad Hominem',
  description: 'Attack the person making the argument rather than the argument itself.',
  level: 1,
  manaCost: 10,
  damage: 15,
  effect: 'Reduces target\'s Mind Defense by 25% for 2 turns',
  icon: '👤',
  type: 'fallacy',
  philosophicalAspect: 'body',
  fallacyType: 'informal',
};

export const appealToForceFallacy: Skill = {
  id: 'appeal_to_force',
  name: 'Appeal to Force',
  description: 'Use threats or intimidation to support your argument.',
  level: 2,
  manaCost: 15,
  damage: 22,
  effect: 'Has 30% chance to cause Fear debuff (opponent skips next turn)',
  icon: '⚔️',
  type: 'fallacy',
  philosophicalAspect: 'body',
  fallacyType: 'informal',
};

export const bullyingFallacy: Skill = {
  id: 'bullying',
  name: 'Argument by Intimidation',
  description: 'Overwhelm your opponent with aggressive rhetoric.',
  level: 3,
  manaCost: 20,
  damage: 28,
  effect: 'Deals extra damage based on opponent\'s missing HP',
  icon: '💪',
  type: 'fallacy',
  philosophicalAspect: 'body',
  fallacyType: 'informal',
};

export const adBaculumFallacy: Skill = {
  id: 'ad_baculum',
  name: 'Ad Baculum Supreme',
  description: 'The ultimate appeal to force - might makes right.',
  level: 4,
  manaCost: 25,
  damage: 35,
  effect: 'Ignores 50% of opponent\'s Physical Defense',
  icon: '🔨',
  type: 'fallacy',
  philosophicalAspect: 'body',
  fallacyType: 'informal',
};

export const nuclearOptionFallacy: Skill = {
  id: 'nuclear_option',
  name: 'Nuclear Option',
  description: 'Threaten to destroy everything if you don\'t get your way.',
  level: 5,
  manaCost: 30,
  damage: 45,
  effect: 'Deals massive damage but reduces your own HP by 25%',
  icon: '💥',
  type: 'fallacy',
  philosophicalAspect: 'body',
  fallacyType: 'informal',
};

/**
 * Mind Fallacies - Focus on logic manipulation, confusion, and mental tricks
 * MP costs: 10 → 15 → 20 → 25 → 30
 */

export const strawManFallacy: Skill = {
  id: 'straw_man',
  name: 'Straw Man',
  description: 'Misrepresent your opponent\'s argument to make it easier to attack.',
  level: 1,
  manaCost: 10,
  damage: 12,
  effect: 'Reduces opponent\'s next attack damage by 40%',
  icon: '🎭',
  type: 'fallacy',
  philosophicalAspect: 'mind',
  fallacyType: 'informal',
};

export const circularReasoningFallacy: Skill = {
  id: 'circular_reasoning',
  name: 'Circular Reasoning',
  description: 'Use your conclusion as your premise in an endless logical loop.',
  level: 2,
  manaCost: 15,
  damage: 18,
  effect: 'Causes Confusion (opponent has 50% chance to hit themselves)',
  icon: '🔄',
  type: 'fallacy',
  philosophicalAspect: 'mind',
  fallacyType: 'formal',
};

export const redHerringFallacy: Skill = {
  id: 'red_herring',
  name: 'Red Herring',
  description: 'Divert attention from the real issue with irrelevant information.',
  level: 3,
  manaCost: 20,
  damage: 25,
  effect: 'Opponent loses their next turn due to confusion',
  icon: '🐟',
  type: 'fallacy',
  philosophicalAspect: 'mind',
  fallacyType: 'informal',
};

export const gaslightingFallacy: Skill = {
  id: 'gaslighting',
  name: 'Gaslighting',
  description: 'Make your opponent question their own perception of reality.',
  level: 4,
  manaCost: 25,
  damage: 20,
  effect: 'Reverses opponent\'s buffs into debuffs for 3 turns',
  icon: '🔦',
  type: 'fallacy',
  philosophicalAspect: 'mind',
  fallacyType: 'cognitive_bias',
};

export const paradoxWeaponFallacy: Skill = {
  id: 'paradox_weapon',
  name: 'Paradox Weapon',
  description: 'Weaponize logical paradoxes to break your opponent\'s reasoning.',
  level: 5,
  manaCost: 30,
  damage: 40,
  effect: 'Deals fixed damage that ignores all defenses',
  icon: '♾️',
  type: 'fallacy',
  philosophicalAspect: 'mind',
  fallacyType: 'formal',
};

/**
 * Heart Fallacies - Focus on emotions, appeals, and psychological manipulation
 * MP costs: 10 → 15 → 20 → 25 → 30
 */

export const appealToEmotionFallacy: Skill = {
  id: 'appeal_to_emotion',
  name: 'Appeal to Emotion',
  description: 'Manipulate emotions instead of using logical arguments.',
  level: 1,
  manaCost: 10,
  damage: 8,
  effect: 'Causes Emotional Instability (reduces accuracy by 30% for 3 turns)',
  icon: '😢',
  type: 'fallacy',
  philosophicalAspect: 'heart',
  fallacyType: 'informal',
};

export const appealToPityFallacy: Skill = {
  id: 'appeal_to_pity',
  name: 'Appeal to Pity',
  description: 'Try to win the argument by making others feel sorry for you.',
  level: 2,
  manaCost: 15,
  damage: 5,
  effect: 'Heals you for 20 HP and grants immunity to next attack',
  icon: '🥺',
  type: 'fallacy',
  philosophicalAspect: 'heart',
  fallacyType: 'informal',
};

export const guilTrip: Skill = {
  id: 'guilt_trip',
  name: 'Guilt Trip',
  description: 'Make your opponent feel guilty for disagreeing with you.',
  level: 3,
  manaCost: 20,
  damage: 15,
  effect: 'Opponent takes damage every time they attack for 3 turns',
  icon: '😔',
  type: 'fallacy',
  philosophicalAspect: 'heart',
  fallacyType: 'informal',
};

export const loveBombingFallacy: Skill = {
  id: 'love_bombing',
  name: 'Love Bombing',
  description: 'Overwhelm with excessive affection to manipulate.',
  level: 4,
  manaCost: 25,
  damage: 10,
  effect: 'Charms opponent - they deal 50% less damage for 4 turns',
  icon: '💕',
  type: 'fallacy',
  philosophicalAspect: 'heart',
  fallacyType: 'cognitive_bias',
};

export const emotionalBlackmail: Skill = {
  id: 'emotional_blackmail',
  name: 'Emotional Blackmail',
  description: 'Threaten emotional consequences to control behavior.',
  level: 5,
  manaCost: 30,
  damage: 25,
  effect: 'Forces opponent to heal you for 30 HP or take double damage',
  icon: '🖤',
  type: 'fallacy',
  philosophicalAspect: 'heart',
  fallacyType: 'informal',
};

/**
 * Collection of all fallacies organized by type
 */
export const BODY_FALLACIES = [
  adHominemFallacy,
  appealToForceFallacy,
  bullyingFallacy,
  adBaculumFallacy,
  nuclearOptionFallacy,
];

export const MIND_FALLACIES = [
  strawManFallacy,
  circularReasoningFallacy,
  redHerringFallacy,
  gaslightingFallacy,
  paradoxWeaponFallacy,
];

export const HEART_FALLACIES = [
  appealToEmotionFallacy,
  appealToPityFallacy,
  guilTrip,
  loveBombingFallacy,
  emotionalBlackmail,
];

export const ALL_FALLACIES = [
  ...BODY_FALLACIES,
  ...MIND_FALLACIES,
  ...HEART_FALLACIES,
];

/**
 * Get fallacies by philosophical aspect
 */
export function getFallaciesByAspect(aspect: 'body' | 'mind' | 'heart'): Skill[] {
  switch (aspect) {
    case 'body':
      return BODY_FALLACIES;
    case 'mind':
      return MIND_FALLACIES;
    case 'heart':
      return HEART_FALLACIES;
    default:
      return [];
  }
}

/**
 * Get fallacy by ID
 */
export function getFallacyById(id: string): Skill | undefined {
  return ALL_FALLACIES.find(fallacy => fallacy.id === id);
}