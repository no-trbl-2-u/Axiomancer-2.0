import { Equipment, Item } from '../types/game';

/**
 * Equipment Items - Philosophically themed weapons, armor, and accessories
 * Designed to work with the Body/Mind/Heart combat system and fallacy skills
 * Inspired by the bleak, fatalistic aesthetic of Mörk Borg
 */

export const equipmentItems: Record<string, Equipment> = {
  // WEAPONS - Body-focused (Physical damage, Mind/Heart debuffs)

  // The Broken Compass of Lost Direction
  broken_compass: {
    id: 'broken_compass',
    name: 'Broken Compass of Lost Direction',
    type: 'weapon',
    stats: { body: 3 },
    special: 'Mind Attack debuff: Opponent loses sense of direction, reducing accuracy by 50%',
    icon: '🧭'
  },

  // The Mirror of Self-Reflection
  mirror_of_self_reflection: {
    id: 'mirror_of_self_reflection',
    name: 'Mirror of Self-Reflection',
    type: 'weapon',
    stats: { body: 2, heart: 2 },
    special: 'Heart Attack: Forces opponent to confront their own flaws, causing self-doubt debuff',
    icon: '🪞'
  },

  // The Chain of Inherited Guilt
  chain_of_inherited_guilt: {
    id: 'chain_of_inherited_guilt',
    name: 'Chain of Inherited Guilt',
    type: 'weapon',
    stats: { body: 4 },
    special: 'Heart Attack bonus: Each hit applies generational trauma debuff, stacking guilt',
    icon: '⛓️'
  },

  // The Quill of Poisoned Words
  quill_of_poisoned_words: {
    id: 'quill_of_poisoned_words',
    name: 'Quill of Poisoned Words',
    type: 'weapon',
    stats: { mind: 3 },
    special: 'Mind Attack: Words cause lasting psychological damage, reducing mental defense',
    icon: '🪶'
  },

  // The Hourglass of Stolen Time
  hourglass_of_stolen_time: {
    id: 'hourglass_of_stolen_time',
    name: 'Hourglass of Stolen Time',
    type: 'weapon',
    stats: { mind: 2, body: 2 },
    special: 'Mind Attack debuff: Opponent feels time slipping away, reducing action speed',
    icon: '⏳'
  },

  // ARMOR - Body/Mind/Heart defensive bonuses

  // The Cloak of Forgotten Memories
  cloak_of_forgotten_memories: {
    id: 'cloak_of_forgotten_memories',
    name: 'Cloak of Forgotten Memories',
    type: 'armor',
    stats: { mind: 3, heart: 2 },
    special: 'Mind Defense: Memories fade, making mental attacks less effective',
    icon: '🧥'
  },

  // The Mask of False Identity
  mask_of_false_identity: {
    id: 'mask_of_false_identity',
    name: 'Mask of False Identity',
    type: 'armor',
    stats: { heart: 4 },
    special: 'Heart Defense: Identity confusion makes emotional attacks backfire',
    icon: '🎭'
  },

  // The Shield of Broken Promises
  shield_of_broken_promises: {
    id: 'shield_of_broken_promises',
    name: 'Shield of Broken Promises',
    type: 'armor',
    stats: { body: 3, heart: 2 },
    special: 'Body Defense: Broken trust reflects physical damage back to attacker',
    icon: '🛡️'
  },

  // The Crown of Unquestioned Authority
  crown_of_unquestioned_authority: {
    id: 'crown_of_unquestioned_authority',
    name: 'Crown of Unquestioned Authority',
    type: 'armor',
    stats: { mind: 4 },
    special: 'Mind Defense: Authority makes logical attacks seem illegitimate',
    icon: '👑'
  },

  // The Amulet of Doubt
  amulet_of_doubt: {
    id: 'amulet_of_doubt',
    name: 'Amulet of Doubt',
    type: 'armor',
    stats: { heart: 3, mind: 2 },
    special: 'Universal Defense: Constant doubt weakens all incoming attacks',
    icon: '🔮'
  },

  // ACCESSORIES - Stat bonuses and special effects

  // The Ring of Circular Logic
  ring_of_circular_logic: {
    id: 'ring_of_circular_logic',
    name: 'Ring of Circular Logic',
    type: 'accessory',
    stats: { mind: 2 },
    special: 'Mind Attack bonus: Arguments become self-sustaining, dealing extra damage over time',
    icon: '💍'
  },

  // The Earring of Emotional Manipulation
  earring_of_emotional_manipulation: {
    id: 'earring_of_emotional_manipulation',
    name: 'Earring of Emotional Manipulation',
    type: 'accessory',
    stats: { heart: 3 },
    special: 'Heart Attack bonus: Emotions become weapons, bypassing rational defenses',
    icon: '👂'
  },

  // The Bracelet of Selective Memory
  bracelet_of_selective_memory: {
    id: 'bracelet_of_selective_memory',
    name: 'Bracelet of Selective Memory',
    type: 'accessory',
    stats: { mind: 2, heart: 1 },
    special: 'Memory manipulation: Remember only what supports your position',
    icon: '🧿'
  },

  // The Necklace of Inherited Trauma
  necklace_of_inherited_trauma: {
    id: 'necklace_of_inherited_trauma',
    name: 'Necklace of Inherited Trauma',
    type: 'accessory',
    stats: { heart: 4 },
    special: 'Heart Attack debuff: Trauma passes to opponent, causing inherited suffering',
    icon: '📿'
  },

  // The Gloves of Unseen Hands
  gloves_of_unseen_hands: {
    id: 'gloves_of_unseen_hands',
    name: 'Gloves of Unseen Hands',
    type: 'accessory',
    stats: { body: 2, mind: 1 },
    special: 'Stealth bonus: Actions seem to happen without your involvement',
    icon: '🧤'
  },

  // CONSUMABLES - Temporary effects and utilities

  // Vial of Liquid Doubt
  vial_of_liquid_doubt: {
    id: 'vial_of_liquid_doubt',
    name: 'Vial of Liquid Doubt',
    type: 'consumable',
    stats: {},
    special: 'Temporary effect: Doubts all incoming arguments, reducing damage by 50% for 3 turns',
    icon: '🧪'
  },

  // Scroll of Alternative Facts
  scroll_of_alternative_facts: {
    id: 'scroll_of_alternative_facts',
    name: 'Scroll of Alternative Facts',
    type: 'consumable',
    stats: {},
    special: 'Temporary effect: Creates alternate reality where opponent\'s attacks miss for 2 turns',
    icon: '📜'
  },

  // Potion of Emotional Numbness
  potion_of_emotional_numbness: {
    id: 'potion_of_emotional_numbness',
    name: 'Potion of Emotional Numbness',
    type: 'consumable',
    stats: {},
    special: 'Temporary immunity to Heart-based attacks for 4 turns',
    icon: '🧪'
  },

  // Crystal of Logical Clarity
  crystal_of_logical_clarity: {
    id: 'crystal_of_logical_clarity',
    name: 'Crystal of Logical Clarity',
    type: 'consumable',
    stats: {},
    special: 'Temporary immunity to Mind-based confusion effects for 3 turns',
    icon: '💎'
  },

  // Feather of Moral Flexibility
  feather_of_moral_flexibility: {
    id: 'feather_of_moral_flexibility',
    name: 'Feather of Moral Flexibility',
    type: 'consumable',
    stats: {},
    special: 'Temporary moral licensing: Justify any action without guilt for 2 turns',
    icon: '🪶'
  }
};

/**
 * Regular Items - Consumables, crafting materials, and quest items
 */

export const regularItems: Record<string, Item> = {
  // Crafting Materials
  philosophers_stone_fragment: {
    id: 'philosophers_stone_fragment',
    name: 'Philosopher\'s Stone Fragment',
    description: 'A shard of the legendary stone that was meant to transmute base metals into gold and grant immortality, but only brought suffering and madness.',
    type: 'crafting',
    value: 50,
    stackable: true,
    quantity: 1,
    icon: '💎'
  },

  broken_dialectic_chain: {
    id: 'broken_dialectic_chain',
    name: 'Broken Dialectic Chain',
    description: 'Links from the great chain of being that once connected all things in perfect harmony, now shattered and meaningless.',
    type: 'crafting',
    value: 25,
    stackable: true,
    quantity: 1,
    icon: '⛓️'
  },

  existential_essence: {
    id: 'existential_essence',
    name: 'Existential Essence',
    description: 'The distilled essence of human suffering and doubt, harvested from those who have stared too long into the abyss.',
    type: 'crafting',
    value: 75,
    stackable: true,
    quantity: 1,
    icon: '🧪'
  },

  // Quest Items
  the_unmoved_mover: {
    id: 'the_unmoved_mover',
    name: 'The Unmoved Mover',
    description: 'An ancient artifact said to be the first cause of all things, but its cold, unchanging nature brings only despair.',
    type: 'quest',
    value: 0,
    stackable: false,
    quantity: 1,
    icon: '🏛️'
  },

  the_form_of_the_good: {
    id: 'the_form_of_the_good',
    name: 'The Form of the Good',
    description: 'Plato\'s ideal form that illuminates all truth, but in this fallen world it only casts shadows of what might have been.',
    type: 'quest',
    value: 0,
    stackable: false,
    quantity: 1,
    icon: '☀️'
  },

  nietzsches_will_to_power: {
    id: 'nietzsches_will_to_power',
    name: 'Nietzsche\'s Will to Power',
    description: 'The raw force that drives all life, but in the hands of the unworthy it becomes a curse of endless striving.',
    type: 'quest',
    value: 0,
    stackable: false,
    quantity: 1,
    icon: '⚡'
  },

  // Consumables
  tears_of_the_sophist: {
    id: 'tears_of_the_sophist',
    name: 'Tears of the Sophist',
    description: 'Bitter tears shed by those who know the truth but choose to deceive. Drinking them grants temporary rhetorical skill but permanent cynicism.',
    type: 'consumable',
    value: 15,
    stackable: true,
    quantity: 1,
    icon: '💧'
  },

  the_socratic_method_pill: {
    id: 'the_socratic_method_pill',
    name: 'The Socratic Method Pill',
    description: 'A bitter pill that forces relentless self-examination. Taking it reveals hidden truths but causes intense mental anguish.',
    type: 'consumable',
    value: 20,
    stackable: true,
    quantity: 1,
    icon: '💊'
  },

  descartes_demon_bane: {
    id: 'descartes_demon_bane',
    name: 'Descartes\' Demon Bane',
    description: 'A ward against the evil demon who deceives our senses. Using it reveals the true nature of reality but shatters illusions forever.',
    type: 'consumable',
    value: 30,
    stackable: false,
    quantity: 1,
    icon: '🛡️'
  },

  // Miscellaneous
  the_veil_of_maya: {
    id: 'the_veil_of_maya',
    name: 'The Veil of Maya',
    description: 'The illusory veil that separates us from ultimate reality. Peering behind it grants forbidden knowledge but drives one mad.',
    type: 'misc',
    value: 100,
    stackable: false,
    quantity: 1,
    icon: '🌫️'
  },

  the_wheel_of_samsara: {
    id: 'the_wheel_of_samsara',
    name: 'The Wheel of Samsara',
    description: 'The endless cycle of suffering and rebirth. Breaking free from it ends the pain but also ends hope.',
    type: 'misc',
    value: 200,
    stackable: false,
    quantity: 1,
    icon: '🎡'
  },

  the_golden_mean_measure: {
    id: 'the_golden_mean_measure',
    name: 'The Golden Mean Measure',
    description: 'Aristotle\'s tool for measuring virtue, but in this world of extremes it only shows how far we\'ve fallen from balance.',
    type: 'misc',
    value: 40,
    stackable: false,
    quantity: 1,
    icon: '📏'
  }
};

/**
 * Get available equipment for character based on level and philosophical stance
 */
export function getAvailableEquipment(character: any): Equipment[] {
  return Object.values(equipmentItems).filter((equipment: Equipment) => {
    // Basic level requirement
    if (equipment.id.includes('advanced') && character.level < 5) return false;
    if (equipment.id.includes('master') && character.level < 8) return false;

    // Philosophical alignment bonuses
    if (equipment.stats.mind && character.philosophicalStance.epistemology === 'rationalist') {
      return true; // Mind equipment favored by rationalists
    }
    if (equipment.stats.heart && character.philosophicalStance.ethics === 'virtue') {
      return true; // Heart equipment favored by virtue ethicists
    }
    if (equipment.stats.body && character.philosophicalStance.metaphysics === 'materialist') {
      return true; // Body equipment favored by materialists
    }

    return true; // Basic availability
  });
}

/**
 * Get equipment that complements specific fallacy skills
 */
export function getComplementaryEquipment(skillId: string): Equipment[] {
  const complementary: Equipment[] = [];

  // Equipment that enhances fallacy effects
  switch (skillId) {
    case 'gaslighting':
      complementary.push(equipmentItems.mirror_of_self_reflection!);
      complementary.push(equipmentItems.crystal_of_logical_clarity!);
      break;
    case 'appeal_to_emotion':
      complementary.push(equipmentItems.earring_of_emotional_manipulation!);
      complementary.push(equipmentItems.potion_of_emotional_numbness!);
      break;
    case 'circular_reasoning':
      complementary.push(equipmentItems.ring_of_circular_logic!);
      complementary.push(equipmentItems.hourglass_of_stolen_time!);
      break;
    case 'ad_hominem':
      complementary.push(equipmentItems.mask_of_false_identity!);
      complementary.push(equipmentItems.necklace_of_inherited_trauma!);
      break;
  }

  return complementary;
}

/**
 * Calculate equipment bonuses for combat
 */
export function calculateEquipmentBonuses(equipment: Equipment[], philosophicalAspect?: string): {
  statBonuses: Partial<Record<'body' | 'mind' | 'heart', number>>;
  specialEffects: string[];
} {
  const statBonuses: Partial<Record<'body' | 'mind' | 'heart', number>> = {};
  const specialEffects: string[] = [];

  equipment.forEach((item: Equipment) => {
    // Apply stat bonuses
    Object.entries(item.stats).forEach(([stat, value]) => {
      const key = stat as 'body' | 'mind' | 'heart';
      statBonuses[key] = (statBonuses[key] || 0) + value;
    });

    // Apply special effects based on philosophical aspect
    if (philosophicalAspect && item.special) {
      specialEffects.push(item.special);
    }
  });

  return { statBonuses, specialEffects };
}

/**
 * Calculate derived stat bonuses for combat mechanics
 */
export function calculateCombatBonuses(equipment: Equipment[], philosophicalAspect?: string): {
  statBonuses: {
    physicalAttack?: number;
    mindAttack?: number;
    ailmentAttack?: number;
    physicalDefense?: number;
    mindDefense?: number;
    ailmentDefense?: number;
    accuracy?: number;
    evasion?: number;
  };
  specialEffects: string[];
} {
  const { statBonuses, specialEffects } = calculateEquipmentBonuses(equipment, philosophicalAspect);

  // Convert base stats to derived combat stats (following statCalculations.ts pattern)
  const combatBonuses = {
    physicalAttack: (statBonuses.body || 0) * 2,
    mindAttack: (statBonuses.mind || 0) * 2,
    ailmentAttack: (statBonuses.heart || 0) * 2,
    physicalDefense: (statBonuses.body || 0) * 1.5,
    mindDefense: (statBonuses.mind || 0) * 1.5,
    ailmentDefense: (statBonuses.heart || 0) * 1.5,
    accuracy: ((statBonuses.mind || 0) + (statBonuses.body || 0)) * 1,
    evasion: ((statBonuses.body || 0) + (statBonuses.heart || 0)) * 1
  };

  return { statBonuses: combatBonuses, specialEffects };
}

/**
 * Apply equipment bonuses to a character's derived stats
 */
export function applyEquipmentBonuses(derivedStats: any, equipment: Equipment[], philosophicalAspect?: string): any {
  const { statBonuses } = calculateCombatBonuses(equipment, philosophicalAspect);

  return {
    ...derivedStats,
    physicalAttack: derivedStats.physicalAttack + (statBonuses.physicalAttack || 0),
    mindAttack: derivedStats.mindAttack + (statBonuses.mindAttack || 0),
    ailmentAttack: derivedStats.ailmentAttack + (statBonuses.ailmentAttack || 0),
    physicalDefense: derivedStats.physicalDefense + (statBonuses.physicalDefense || 0),
    mindDefense: derivedStats.mindDefense + (statBonuses.mindDefense || 0),
    ailmentDefense: derivedStats.ailmentDefense + (statBonuses.ailmentDefense || 0),
    accuracy: derivedStats.accuracy + (statBonuses.accuracy || 0),
    evasion: derivedStats.evasion + (statBonuses.evasion || 0)
  };
}
