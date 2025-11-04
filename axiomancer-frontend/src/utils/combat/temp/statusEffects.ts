
/**
 * Complete Status Effects System - Bleak and Heart-Wrenching
 *
 * This file contains every buff, debuff, and unique effect for the Axiomancer combat system.
 * Each effect is designed to be psychologically devastating, reflecting the despairing
 * philosophical horror theme of the game.
 *
 * Fixed: All stat modifiers now use correct property names from BuffDebuffEffect interface:
 * - physicalAttack, physicalDefense, mindAttack, mindDefense, ailmentAttack, ailmentDefense
 * - All effects have required currentStacks property
 */

// =============================================================================
// BUFFS - Hope in a Hopeless World
// =============================================================================

/**
 * Logic Immunity - The cold comfort of rational detachment
 */
export const createLogicImmunityBuff = (duration: number = 3) => ({
  id: 'logic_immunity',
  name: 'Logic Immunity',
  description: 'You\'ve built walls of pure reason against the chaos of emotion, but at what cost to your humanity?',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 50 },
    specialEffects: { immuneToNextAttack: true }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🛡️'
});

/**
 * Strength from Pain - The bitter harvest of suffering
 */
export const createStrengthFromPainBuff = (damage: number, duration: number = 3) => ({
  id: 'strength_from_pain',
  name: 'Strength from Pain',
  description: 'Your wounds have become your armor, your suffering your weapon. Pain is the only truth you know.',
  type: 'buff',
  effect: {
    statModifiers: { physicalDefense: Math.floor(damage / 4) },
    percentageModifiers: { physicalAttack: 25 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '💪'
});

/**
 * Insight into Weaknesses - The terrible knowledge of human frailty
 */
export const createInsightBuff = (duration: number = 4) => ({
  id: 'insight',
  name: 'Insight into Weaknesses',
  description: 'You see the cracks in every soul, including your own. Knowledge is a curse that never leaves.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 3 },
    specialEffects: { immuneToNextAttack: true }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👁️'
});

/**
 * Vision of Truth - The blinding light of reality
 */
export const createVisionBuff = (visionType: string = 'enemy attacks', duration: number = 3) => ({
  id: 'foresight',
  name: 'Foresight',
  description: `You glimpse ${visionType}, but the future holds only more suffering. Hope is the cruelest illusion.`,
  type: 'buff',
  effect: {
    specialEffects: { immuneToNextAttack: true }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔮'
});

/**
 * Resistance to Manipulation - The weary armor of experience
 */
export const createResistanceBuff = (duration: number = 4) => ({
  id: 'resistance',
  name: 'Resistance to Manipulation',
  description: 'You\'ve been broken so many times that lies no longer touch you. But neither does truth.',
  type: 'buff',
  effect: {
    percentageModifiers: {
      mindDefense: 30,
      ailmentDefense: 30
    }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 2,
  currentStacks: 1,
  icon: '🛡️'
});

/**
 * Innovation Spark - The fleeting fire of creation
 */
export const createInnovationBuff = (duration: number = 3) => ({
  id: 'innovation',
  name: 'Innovation',
  description: 'A spark of genuine creation in this dying world. It will be extinguished, but not yet.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { mindAttack: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💡'
});

/**
 * Momentum of Change - The terrifying rush of progress
 */
export const createMomentumBuff = (duration: number = 2) => ({
  id: 'momentum',
  name: 'Momentum',
  description: 'Change accelerates toward an unknown end. What horrors await when it finally stops?',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 50, evasion: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💨'
});

/**
 * Courage in Despair - The last stand of the broken
 */
export const createCourageBuff = (duration: number = 3) => ({
  id: 'courage',
  name: 'Courage',
  description: 'You face the abyss with open eyes. Fear has lost its power over your shattered spirit.',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 25 },
    specialEffects: { immuneToNextAttack: true }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🦁'
});

/**
 * Mental Fortitude - The prison of rational thought
 */
export const createMentalFortitudeBuff = (duration: number = 4) => ({
  id: 'mental_fortitude',
  name: 'Mental Fortitude',
  description: 'Your mind is a fortress against chaos, but inside its walls you\'re utterly alone.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindDefense: 60 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏰'
});

/**
 * Mental Autonomy - Freedom from the chains of thought
 */
export const createMentalAutonomyBuff = (duration: number = 5) => ({
  id: 'mental_autonomy',
  name: 'Mental Autonomy',
  description: 'Your thoughts are your own, but they echo in the empty chambers of your soul.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 35 },
    specialEffects: { immuneToNextAttack: true }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🧠'
});

/**
 * Intellectual Sovereignty - The crown of isolation
 */
export const createIntellectualSovereigntyBuff = (duration: number = 4) => ({
  id: 'intellectual_sovereignty',
  name: 'Intellectual Sovereignty',
  description: 'You reign supreme in your kingdom of one, where truth is your only subject.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 5 },
    percentageModifiers: { mindDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👑'
});

/**
 * Integrity - The fragile shield of self
 */
export const createIntegrityBuff = (duration: number = 3) => ({
  id: 'integrity',
  name: 'Integrity',
  description: 'You cling to your principles like a drowning man to driftwood in a storm of corruption.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🛡️'
});

/**
 * Moral High Ground - The crumbling peak of righteousness
 */
export const createMoralHighGroundBuff = (duration: number = 3) => ({
  id: 'moral_high_ground',
  name: 'Moral High Ground',
  description: 'From your lofty perch you judge others, but the ground beneath you is eroding.',
  type: 'buff',
  effect: {
    statModifiers: { ailmentAttack: 3 },
    percentageModifiers: { ailmentAttack: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⛰️'
});

/**
 * Moral Consistency - The rigid cage of principle
 */
export const createMoralConsistencyBuff = (duration: number = 4) => ({
  id: 'moral_consistency',
  name: 'Moral Consistency',
  description: 'Your principles are unyielding, but they\'ve become a prison that excludes all mercy.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Moral Perfection - The impossible ideal
 */
export const createMoralPerfectionBuff = (duration: number = 5) => ({
  id: 'moral_perfection',
  name: 'Moral Perfection',
  description: 'You\'ve achieved an impossible standard, but the weight of it crushes your spirit.',
  type: 'buff',
  effect: {
    statModifiers: { ailmentAttack: 4 },
    percentageModifiers: { ailmentAttack: 60, ailmentDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '✨'
});

/**
 * Humility - The bitter taste of self-knowledge
 */
export const createHumilityBuff = (duration: number = 3) => ({
  id: 'humility',
  name: 'Humility',
  description: 'You know your place in the vast, uncaring universe. It\'s the lowest rung.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🙇'
});

/**
 * True Moral Understanding - The abyss of ethical clarity
 */
export const createTrueMoralUnderstandingBuff = (duration: number = 6) => ({
  id: 'true_moral_understanding',
  name: 'True Moral Understanding',
  description: 'You see the moral structure of the universe, and it fills you with despair.',
  type: 'buff',
  effect: {
    statModifiers: { heart: 5, mind: 3 },
    percentageModifiers: { ailmentAttack: 50, ailmentDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌌'
});

/**
 * Healthy Spirituality - The fragile bloom in poisoned soil
 */
export const createHealthySpiritualityBuff = (duration: number = 4) => ({
  id: 'healthy_spirituality',
  name: 'Healthy Spirituality',
  description: 'Your spirit finds nourishment in this wasteland, but the toxins still seep through.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 40, mindDefense: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌸'
});

/**
 * Spiritual Wholeness - The shattered vessel made whole
 */
export const createSpiritualWholenessBuff = (duration: number = 5) => ({
  id: 'spiritual_wholeness',
  name: 'Spiritual Wholeness',
  description: 'Your spirit is complete, but the world around you remains broken.',
  type: 'buff',
  effect: {
    statModifiers: { ailmentAttack: 4 },
    percentageModifiers: { ailmentAttack: 45, ailmentDefense: 45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🕊️'
});

/**
 * Stability - The illusion of security
 */
export const createStabilityBuff = (duration: number = 3) => ({
  id: 'stability',
  name: 'Stability',
  description: 'You\'ve found solid ground in a world of shifting sands, but the earth trembles beneath you.',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 30, mindDefense: 25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏛️'
});

/**
 * Strategic Advantage - The cold calculation of survival
 */
export const createStrategicAdvantageBuff = (duration: number = 2) => ({
  id: 'strategic_advantage',
  name: 'Strategic Advantage',
  description: 'You see the battlefield clearly, but victory brings only more battles.',
  type: 'buff',
  effect: {
    percentageModifiers: { accuracy: 40, evasion: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎯'
});

/**
 * Strategic Retreat - The wisdom of temporary surrender
 */
export const createStrategicRetreatBuff = (duration: number = 2) => ({
  id: 'strategic_retreat',
  name: 'Strategic Retreat',
  description: 'You step back to fight another day, but retreat tastes like defeat.',
  type: 'buff',
  effect: {
    percentageModifiers: { evasion: 60 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏃'
});

/**
 * Democratic Discourse - The exhausting process of reason
 */
export const createDemocraticBuff = (duration: number = 3) => ({
  id: 'democratic',
  name: 'Democratic Discourse',
  description: 'You engage in true dialogue, but consensus feels like surrender.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 35, mindDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🗣️'
});

/**
 * Perfect Discourse - The ideal that can never be reached
 */
export const createPerfectDiscourseBuff = (duration: number = 4) => ({
  id: 'perfect_discourse',
  name: 'Perfect Discourse',
  description: 'You achieve true understanding, but it reveals how alone you really are.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 4, heart: 3 },
    percentageModifiers: { mindAttack: 50, mindDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💬'
});

/**
 * Universal Recognition - The burden of being seen
 */
export const createUniversalRecognitionBuff = (duration: number = 3) => ({
  id: 'universal_recognition',
  name: 'Universal Recognition',
  description: 'Everyone sees your worth, but their gaze is a weight you can\'t bear.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👁️'
});

/**
 * Acknowledgment - The painful validation of existence
 */
export const createAcknowledgmentBuff = (duration: number = 2) => ({
  id: 'acknowledgment',
  name: 'Acknowledgment',
  description: 'Someone finally sees you, but their recognition exposes your vulnerabilities.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentAttack: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '✅'
});

/**
 * Perfect Self-Trust - The dangerous illusion of certainty
 */
export const createPerfectSelfTrustBuff = (duration: number = 4) => ({
  id: 'perfect_self_trust',
  name: 'Perfect Self-Trust',
  description: 'You trust yourself completely, but doubt creeps in at the edges of your certainty.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindDefense: 50, ailmentDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💪'
});

/**
 * Clarity - The sharp blade of truth
 */
export const createClarityBuff = (duration: number = 3) => ({
  id: 'clarity',
  name: 'Clarity',
  description: 'You see everything clearly, but the truth is more than you can bear to look at.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 3 },
    percentageModifiers: { accuracy: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔍'
});

/**
 * Imagination - The cruel gift of possibility
 */
export const createImaginationBuff = (duration: number = 3) => ({
  id: 'imagination',
  name: 'Imagination',
  description: 'You can imagine better worlds, but they only make this one more unbearable.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { mindAttack: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎨'
});

/**
 * Broader Understanding - The expanding horizon of despair
 */
export const createBroaderUnderstandingBuff = (duration: number = 4) => ({
  id: 'broader_understanding',
  name: 'Broader Understanding',
  description: 'You understand more than ever, but the scope of human suffering overwhelms you.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 3 },
    percentageModifiers: { mindDefense: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌅'
});

/**
 * Linear Thinking - The straight path to nowhere
 */
export const createLinearThinkingBuff = (duration: number = 3) => ({
  id: 'linear_thinking',
  name: 'Linear Thinking',
  description: 'You follow logical paths, but they all lead to the same dead end.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 40, accuracy: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '➡️'
});

/**
 * Logical Clarity - The cold light of reason
 */
export const createLogicalClarityBuff = (duration: number = 3) => ({
  id: 'logical_clarity',
  name: 'Logical Clarity',
  description: 'Logic illuminates everything, but reveals the meaninglessness beneath.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 45, mindDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💡'
});

/**
 * Enlightenment - The blinding flash of truth
 */
export const createEnlightenmentBuff = (duration: number = 5) => ({
  id: 'enlightenment',
  name: 'Enlightenment',
  description: 'You see the truth of existence, but it burns your eyes and scars your soul.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 5 },
    percentageModifiers: { mindAttack: 60, mindDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '☀️'
});

/**
 * Total Recall - The curse of perfect memory
 */
export const createTotalRecallBuff = (duration: number = 4) => ({
  id: 'total_recall',
  name: 'Total Recall',
  description: 'You remember everything, every failure, every loss, every moment of despair.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 3 },
    percentageModifiers: { mindDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🧠'
});

/**
 * Perfect Memory - The inescapable archive of suffering
 */
export const createPerfectMemoryBuff = (duration: number = 6) => ({
  id: 'perfect_memory',
  name: 'Perfect Memory',
  description: 'Every detail preserved forever, every pain relived in perfect clarity.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { mindAttack: 50, mindDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📚'
});

/**
 * Independence - The lonely freedom of isolation
 */
export const createIndependenceBuff = (duration: number = 3) => ({
  id: 'independence',
  name: 'Independence',
  description: 'You stand alone, free from others\' influence, but utterly isolated in your convictions.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 35, mindDefense: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🆓'
});

/**
 * True Independence - The terrifying freedom of self
 */
export const createTrueIndependenceBuff = (duration: number = 4) => ({
  id: 'true_independence',
  name: 'True Independence',
  description: 'You are completely self-reliant, but the weight of total responsibility crushes you.',
  type: 'buff',
  effect: {
    statModifiers: { ailmentAttack: 3 },
    percentageModifiers: { ailmentDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌟'
});

/**
 * Mental Privacy - The fortress of solitude
 */
export const createMentalPrivacyBuff = (duration: number = 3) => ({
  id: 'mental_privacy',
  name: 'Mental Privacy',
  description: 'Your thoughts are safe from intrusion, but they echo in the silence of your isolation.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindDefense: 60 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔒'
});

/**
 * Thought Sovereignty - The kingdom of one mind
 */
export const createThoughtSovereigntyBuff = (duration: number = 4) => ({
  id: 'thought_sovereignty',
  name: 'Thought Sovereignty',
  description: 'Your mind is your domain, but it\'s a kingdom without subjects.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { mindDefense: 45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👑'
});

/**
 * Genuine Expertise - The burden of true knowledge
 */
export const createGenuineExpertiseBuff = (duration: number = 5) => ({
  id: 'genuine_expertise',
  name: 'Genuine Expertise',
  description: 'You truly understand your field, but expertise brings the curse of seeing how little others know.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 5 },
    percentageModifiers: { mindAttack: 55 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎓'
});

/**
 * Creative Thinking - The spark in the darkness
 */
export const createCreativeThinkingBuff = (duration: number = 3) => ({
  id: 'creative_thinking',
  name: 'Creative Thinking',
  description: 'You find new solutions, but each creation reminds you of all the problems you can\'t solve.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { mindAttack: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎨'
});

/**
 * Complexity Mastery - The labyrinth of understanding
 */
export const createComplexityMasteryBuff = (duration: number = 4) => ({
  id: 'complexity_mastery',
  name: 'Complexity Mastery',
  description: 'You navigate complexity with ease, but the simple truths elude you forever.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 3 },
    percentageModifiers: { mindDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌀'
});

/**
 * Perfect Distinction - The blade that cuts too deep
 */
export const createPerfectDistinctionBuff = (duration: number = 3) => ({
  id: 'perfect_distinction',
  name: 'Perfect Distinction',
  description: 'You see differences clearly, but distinctions become divisions that isolate you.',
  type: 'buff',
  effect: {
    percentageModifiers: { accuracy: 50, mindAttack: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚔️'
});

/**
 * Decisive Action - The commitment that binds
 */
export const createDecisiveActionBuff = (duration: number = 2) => ({
  id: 'decisive_action',
  name: 'Decisive Action',
  description: 'You act without hesitation, but every choice closes doors you can never reopen.',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 40, accuracy: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚡'
});

/**
 * Perfect Decision Making - The paralysis of certainty
 */
export const createPerfectDecisionMakingBuff = (duration: number = 4) => ({
  id: 'perfect_decision_making',
  name: 'Perfect Decision Making',
  description: 'You make perfect choices, but the burden of never being wrong is crushing.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { accuracy: 60, evasion: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '✅'
});

/**
 * Active Agency - The terrifying freedom of choice
 */
export const createActiveAgencyBuff = (duration: number = 3) => ({
  id: 'active_agency',
  name: 'Active Agency',
  description: 'You control your destiny, but the responsibility for every outcome is yours alone.',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 35, ailmentAttack: 25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎭'
});

/**
 * Perfect Autonomy - The isolation of self-determination
 */
export const createPerfectAutonomyBuff = (duration: number = 5) => ({
  id: 'perfect_autonomy',
  name: 'Perfect Autonomy',
  description: 'You are completely self-determining, but no one can share your burden or your joy.',
  type: 'buff',
  effect: {
    statModifiers: { ailmentAttack: 4, physicalAttack: 3 },
    percentageModifiers: { ailmentDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌟'
});

/**
 * Growth Mindset - The endless climb toward impossibility
 */
export const createGrowthMindsetBuff = (duration: number = 4) => ({
  id: 'growth_mindset',
  name: 'Growth Mindset',
  description: 'You believe you can improve, but each step forward reveals how far you still have to go.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 30, ailmentAttack: 25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📈'
});

/**
 * True Confidence - The fragile shell of certainty
 */
export const createTrueConfidenceBuff = (duration: number = 3) => ({
  id: 'true_confidence',
  name: 'True Confidence',
  description: 'You believe in yourself, but doubt whispers from the shadows of your mind.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentAttack: 40, physicalAttack: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💪'
});

/**
 * Contextual Understanding - The web of connections
 */
export const createContextualUnderstandingBuff = (duration: number = 3) => ({
  id: 'contextual_understanding',
  name: 'Contextual Understanding',
  description: 'You see how everything connects, but the vastness of the network overwhelms you.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 3 },
    percentageModifiers: { mindDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🕸️'
});

/**
 * Perfect Empathy - The agony of feeling everything
 */
export const createPerfectEmpathyBuff = (duration: number = 4) => ({
  id: 'perfect_empathy',
  name: 'Perfect Empathy',
  description: 'You feel others\' pain as your own, but their suffering adds to your own burden.',
  type: 'buff',
  effect: {
    statModifiers: { ailmentAttack: 4 },
    percentageModifiers: { ailmentDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💔'
});

/**
 * Universal Understanding - The godlike perspective
 */
export const createUniversalUnderstandingBuff = (duration: number = 6) => ({
  id: 'universal_understanding',
  name: 'Universal Understanding',
  description: 'You comprehend the whole of existence, but the totality crushes your finite mind.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 5, heart: 4 },
    percentageModifiers: { mindAttack: 60, mindDefense: 60 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌍'
});

/**
 * True Enlightenment - The final revelation
 */
export const createTrueEnlightenmentBuff = (duration: number = 7) => ({
  id: 'true_enlightenment',
  name: 'True Enlightenment',
  description: 'You understand everything, but the truth of existence is more than any mind can bear.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 6, heart: 5 },
    percentageModifiers: { mindAttack: 70, mindDefense: 70, ailmentAttack: 50, ailmentDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌟'
});

/**
 * Balanced Perspective - The middle path of despair
 */
export const createBalancedBuff = (duration: number = 3) => ({
  id: 'balanced',
  name: 'Balanced Perspective',
  description: 'You see both sides clearly, but balance requires you to carry the weight of both.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindDefense: 30, ailmentDefense: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Perfect Balance - The impossible equilibrium
 */
export const createPerfectBalanceBuff = (duration: number = 5) => ({
  id: 'perfect_balance',
  name: 'Perfect Balance',
  description: 'You achieve perfect equilibrium, but maintaining it requires constant effort and sacrifice.',
  type: 'buff',
  effect: {
    statModifiers: { physicalAttack: 3, mindAttack: 3, ailmentAttack: 3 },
    percentageModifiers: { physicalDefense: 40, mindDefense: 40, ailmentDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '☯️'
});

/**
 * Civility - The mask of politeness
 */
export const createCivilityBuff = (duration: number = 2) => ({
  id: 'civility',
  name: 'Civility',
  description: 'You maintain composure, but politeness is just a thin veneer over your rage.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎩'
});

/**
 * Articulate Expression - The weapon of words
 */
export const createArticulateExpressionBuff = (duration: number = 3) => ({
  id: 'articulate_expression',
  name: 'Articulate Expression',
  description: 'Your words are precise and powerful, but they reveal the depths of your despair.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🗣️'
});

/**
 * Complete Awareness - The overwhelming flood of information
 */
export const createCompleteAwarenessBuff = (duration: number = 4) => ({
  id: 'complete_awareness',
  name: 'Complete Awareness',
  description: 'You perceive everything, but the totality of existence threatens to drown you.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { accuracy: 50, evasion: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👁️'
});

/**
 * Perfect Objectivity - The cold distance of truth
 */
export const createPerfectObjectivityBuff = (duration: number = 4) => ({
  id: 'perfect_objectivity',
  name: 'Perfect Objectivity',
  description: 'You see everything without bias, but objectivity requires you to abandon your humanity.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 50, mindDefense: 45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔍'
});

/**
 * Genuine Achievement - The hollow victory
 */
export const createGenuineAchievementBuff = (duration: number = 3) => ({
  id: 'genuine_achievement',
  name: 'Genuine Achievement',
  description: 'You\'ve accomplished something real, but success only highlights how little it matters.',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 35, ailmentAttack: 25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏆'
});

/**
 * Real Excellence - The peak that reveals the abyss
 */
export const createRealExcellenceBuff = (duration: number = 4) => ({
  id: 'real_excellence',
  name: 'Real Excellence',
  description: 'You achieve true mastery, but excellence isolates you from those who cannot understand.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4, physicalAttack: 3 },
    percentageModifiers: { mindAttack: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⭐'
});

/**
 * Statistical Understanding - The numbers that lie
 */
export const createStatisticalUnderstandingBuff = (duration: number = 3) => ({
  id: 'statistical_understanding',
  name: 'Statistical Understanding',
  description: 'You understand the patterns, but statistics reveal the inevitability of suffering.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 40, accuracy: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📊'
});

/**
 * Probabilistic Mastery - The illusion of control
 */
export const createProbabilisticMasteryBuff = (duration: number = 4) => ({
  id: 'probabilistic_mastery',
  name: 'Probabilistic Mastery',
  description: 'You master probability, but chance remains the cruel master of your fate.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { accuracy: 45, evasion: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎲'
});

/**
 * Practical Wisdom - The bitter fruit of experience
 */
export const createPracticalWisdomBuff = (duration: number = 3) => ({
  id: 'practical_wisdom',
  name: 'Practical Wisdom',
  description: 'You know what works, but wisdom comes from suffering you wish you could forget.',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 30, mindAttack: 25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🦉'
});

/**
 * Magical Realism - The beautiful lie of possibility
 */
export const createMagicalRealismBuff = (duration: number = 4) => ({
  id: 'magical_realism',
  name: 'Magical Realism',
  description: 'You see magic in the mundane, but reality remains stubbornly mundane.',
  type: 'buff',
  effect: {
    statModifiers: { heart: 3, mind: 2 },
    percentageModifiers: { ailmentAttack: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '✨'
});

/**
 * Trust - The fragile bond of vulnerability
 */
export const createTrustBuff = (duration: number = 3) => ({
  id: 'trust',
  name: 'Trust',
  description: 'You trust others, but trust makes you vulnerable to betrayal.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤝'
});

/**
 * Authentic Discourse - The genuine exchange of despair
 */
export const createAuthenticDiscourseBuff = (duration: number = 3) => ({
  id: 'authentic_discourse',
  name: 'Authentic Discourse',
  description: 'You communicate genuinely, but authenticity exposes your deepest vulnerabilities.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindAttack: 40, ailmentAttack: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💬'
});

/**
 * Holistic Understanding - The interconnected web of suffering
 */
export const createHolisticUnderstandingBuff = (duration: number = 4) => ({
  id: 'holistic_understanding',
  name: 'Holistic Understanding',
  description: 'You see how everything connects, but the connections form a web of inescapable suffering.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: 4 },
    percentageModifiers: { mindDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🕸️'
});

/**
 * Balanced Valuation - The scale that never balances
 */
export const createBalancedValuationBuff = (duration: number = 3) => ({
  id: 'balanced_valuation',
  name: 'Balanced Valuation',
  description: 'You value things appropriately, but appropriate value means accepting life\'s fundamental worthlessness.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Perfect Clarity - The unforgiving light of truth
 */
export const createPerfectClarityBuff = (duration: number = 5) => ({
  id: 'perfect_clarity',
  name: 'Perfect Clarity',
  description: 'You see everything with perfect clarity, but clarity reveals the horror of existence.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 5 },
    percentageModifiers: { accuracy: 60, mindDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔍'
});

/**
 * Perfect Understanding - The complete knowledge that destroys
 */
export const createPerfectUnderstandingBuff = (duration: number = 6) => ({
  id: 'perfect_understanding',
  name: 'Perfect Understanding',
  description: 'You understand everything perfectly, but perfect understanding reveals the meaninglessness of it all.',
  type: 'buff',
  effect: {
    statModifiers: { mind: 6 },
    percentageModifiers: { mindAttack: 70, mindDefense: 60 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💡'
});

/**
 * Perfect Nuance - The subtle distinctions that matter
 */
export const createPerfectNuanceBuff = (duration: number = 4) => ({
  id: 'perfect_nuance',
  name: 'Perfect Nuance',
  description: 'You perceive subtle differences, but nuance becomes a barrier to decisive action.',
  type: 'buff',
  effect: {
    percentageModifiers: { accuracy: 50, mindDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔬'
});

/**
 * Investigative Mastery - The skill that uncovers horror
 */
export const createInvestigativeMasteryBuff = (duration: number = 3) => ({
  id: 'investigative_mastery',
  name: 'Investigative Mastery',
  description: 'You uncover hidden truths, but each revelation exposes deeper layers of corruption.',
  type: 'buff',
  effect: {
    percentageModifiers: { accuracy: 55, mindAttack: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔍'
});

/**
 * Perfect Accountability - The burden of responsibility
 */
export const createPerfectAccountabilityBuff = (duration: number = 4) => ({
  id: 'perfect_accountability',
  name: 'Perfect Accountability',
  description: 'You take responsibility for everything, but the weight of universal accountability crushes you.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Emotional Intelligence - The curse of feeling too much
 */
export const createEmotionalIntelligenceBuff = (duration: number = 3) => ({
  id: 'emotional_intelligence',
  name: 'Emotional Intelligence',
  description: 'You understand emotions perfectly, but perfect understanding means feeling everyone\'s pain.',
  type: 'buff',
  effect: {
    statModifiers: { ailmentAttack: 4 },
    percentageModifiers: { ailmentDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💭'
});

/**
 * Perfect Emotional Mastery - The control that isolates
 */
export const createPerfectEmotionalMasteryBuff = (duration: number = 5) => ({
  id: 'perfect_emotional_mastery',
  name: 'Perfect Emotional Mastery',
  description: 'You control your emotions perfectly, but emotional control means suppressing your humanity.',
  type: 'buff',
  effect: {
    statModifiers: { heart: 5 },
    percentageModifiers: { ailmentAttack: 60, ailmentDefense: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🧘'
});

/**
 * Authentic Expression - The vulnerability of truth
 */
export const createAuthenticExpressionBuff = (duration: number = 3) => ({
  id: 'authentic_expression',
  name: 'Authentic Expression',
  description: 'You express yourself genuinely, but authenticity exposes you to judgment and rejection.',
  type: 'buff',
  effect: {
    percentageModifiers: { ailmentAttack: 45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎭'
});

/**
 * Perfect Communication - The ideal that divides
 */
export const createPerfectCommunicationBuff = (duration: number = 4) => ({
  id: 'perfect_communication',
  name: 'Perfect Communication',
  description: 'You communicate perfectly, but perfect communication reveals how fundamentally alone you are.',
  type: 'buff',
  effect: {
    statModifiers: { heart: 3, mind: 3 },
    percentageModifiers: { ailmentAttack: 50, mindAttack: 50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💬'
});

/**
 * Balanced Perspective - The view from the middle
 */
export const createBalancedPerspectiveBuff = (duration: number = 3) => ({
  id: 'balanced_perspective',
  name: 'Balanced Perspective',
  description: 'You see all sides fairly, but balance requires you to validate even the most terrible views.',
  type: 'buff',
  effect: {
    percentageModifiers: { mindDefense: 35, ailmentDefense: 35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Perfect Realism - The truth that liberates and destroys
 */
export const createPerfectRealismBuff = (duration: number = 5) => ({
  id: 'perfect_realism',
  name: 'Perfect Realism',
  description: 'You accept reality as it is, but perfect acceptance means embracing a fundamentally broken world.',
  type: 'buff',
  effect: {
    statModifiers: { heart: 4, mind: 3 },
    percentageModifiers: { ailmentDefense: 50, mindDefense: 40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌍'
});

// =============================================================================
// DEBUFFS - The Crushing Weight of Despair
// =============================================================================

/**
 * Dogmatic Certainty - The prison of absolute conviction
 */
export const createDogmaticCertaintyDebuff = (duration: number = 3) => ({
  id: 'dogmatic_certainty',
  name: 'Dogmatic Certainty',
  description: 'You\'re absolutely certain you\'re right, but certainty blinds you to the possibility of error.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mindDefense: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔒'
});

/**
 * Self-Loathing - The poison of self-hatred
 */
export const createSelfLoathingDebuff = (damage: number, duration: number = 3) => ({
  id: 'self_loathing',
  name: 'Self-Loathing',
  description: 'You despise yourself so much that every action becomes self-sabotage.',
  type: 'debuff',
  effect: {
    specialEffects: { damageOnAttack: damage }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '💔'
});

/**
 * Inescapable Fate - The weight of predetermined suffering
 */
export const createInescapableFateDebuff = (duration: number = 4) => ({
  id: 'inescapable_fate',
  name: 'Inescapable Fate',
  description: 'Your future is predetermined, and it\'s filled with suffering you can\'t avoid.',
  type: 'debuff',
  effect: {
    percentageModifiers: { evasion: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⏳'
});

/**
 * Personal Doubt - The erosion of self-worth
 */
export const createPersonalDoubtDebuff = (duration: number = 3) => ({
  id: 'personal_doubt',
  name: 'Personal Doubt',
  description: 'You question your very right to exist, making every action feel illegitimate.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -30, physicalAttack: -20 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 2,
  currentStacks: 1,
  icon: '❓'
});

/**
 * Emotional Override - The tyranny of uncontrolled feelings
 */
export const createEmotionalOverrideDebuff = (duration: number = 2) => ({
  id: 'emotional_override',
  name: 'Emotional Override',
  description: 'Your emotions control you completely, overriding all reason and logic.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mindAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '😠'
});

/**
 * Intellectual Exclusion - The isolation of superior knowledge
 */
export const createIntellectualExclusionDebuff = (duration: number = 3) => ({
  id: 'intellectual_exclusion',
  name: 'Intellectual Exclusion',
  description: 'Your knowledge makes you an outsider, excluded from normal human connection.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentDefense: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🚪'
});

/**
 * Closure-Seeking - The desperate need for finality
 */
export const createClosureSeekingDebuff = (duration: number = 3) => ({
  id: 'closure_seeking',
  name: 'Closure-Seeking',
  description: 'You desperately need this to end, making you accept any resolution, no matter how terrible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mindDefense: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔒'
});

/**
 * Divine Judgment - The weight of god's disapproval
 */
export const createDivineJudgmentDebuff = (duration: number = 4) => ({
  id: 'divine_judgment',
  name: 'Divine Judgment',
  description: 'God has judged you and found you wanting. His disapproval is a weight on your soul.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Natural Order - The crushing weight of biological determinism
 */
export const createNaturalOrderDebuff = (duration: number = 3) => ({
  id: 'natural_order',
  name: 'Natural Order',
  description: 'This is how things are "supposed" to be. Your resistance is unnatural and doomed.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -35, ailmentAttack: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌿'
});

/**
 * Guilt Amplification - The echo chamber of self-reproach
 */
export const createGuiltAmplificationDebuff = (duration: number = 3) => ({
  id: 'guilt_amplification',
  name: 'Guilt Amplification',
  description: 'Every action reminds you of your failures, amplifying your guilt exponentially.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '😔'
});

/**
 * Tradition Binding - The chains of inherited obligation
 */
export const createTraditionBindingDebuff = (duration: number = 4) => ({
  id: 'tradition_binding',
  name: 'Tradition Binding',
  description: 'Tradition binds you like chains, limiting your ability to adapt or change.',
  type: 'debuff',
  effect: {
    percentageModifiers: { body: -30, mind: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⛓️'
});

/**
 * Appeasement - The weakness of constant surrender
 */
export const createAppeasementDebuff = (duration: number = 2) => ({
  id: 'appeasement',
  name: 'Appeasement',
  description: 'You constantly give in to avoid conflict, but appeasement only encourages more demands.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤝'
});

/**
 * Consequence Fear - The paralysis of anticipated suffering
 */
export const createConsequenceFearDebuff = (duration: number = 3) => ({
  id: 'consequence_fear',
  name: 'Consequence Fear',
  description: 'You\'re terrified of the consequences of your actions, making you unable to act decisively.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -40, accuracy: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '😨'
});

/**
 * Ignorance Empowerment - The dangerous confidence of the ignorant
 */
export const createIgnoranceEmpowermentBuff = (duration: number = 3) => ({
  id: 'ignorance_empowerment',
  name: 'Ignorance Empowerment',
  description: 'Your ignorance makes you confident, but confidence doesn\'t equal competence.',
  type: 'buff',
  effect: {
    percentageModifiers: { physicalAttack: 30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💪'
});

/**
 * Incredulity - The rejection of uncomfortable truth
 */
export const createIncredulityDebuff = (duration: number = 2) => ({
  id: 'incredulity',
  name: 'Incredulity',
  description: 'You can\'t believe this is happening, so you reject reality itself.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mindDefense: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '😲'
});

/**
 * Inertia - The momentum of stagnation
 */
export const createInertiaDebuff = (duration: number = 3) => ({
  id: 'inertia',
  name: 'Inertia',
  description: 'You\'re stuck in your ways, unable to adapt or change direction.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -35, evasion: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏗️'
});

/**
 * Motive Corruption - The suspicion that poisons trust
 */
export const createMotiveCorruptionDebuff = (duration: number = 4) => ({
  id: 'motive_corruption',
  name: 'Motive Corruption',
  description: 'You suspect everyone\'s motives, making genuine connection impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔍'
});

/**
 * Fear - The paralysis of terror
 */
export const createFearDebuff = (duration: number = 2) => ({
  id: 'fear',
  name: 'Fear',
  description: 'Terror grips you, making every shadow a threat and every action dangerous.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -50, accuracy: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 2,
  currentStacks: 1,
  icon: '😱'
});

/**
 * Mystical Confusion - The disorientation of false mysticism
 */
export const createMysticalConfusionDebuff = (duration: number = 3) => ({
  id: 'mystical_confusion',
  name: 'Mystical Confusion',
  description: 'Mysticism confuses you, making rational thought impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔮'
});

/**
 * Enforced Muteness - The silence of oppression
 */
export const createEnforcedMutenessDebuff = (duration: number = 2) => ({
  id: 'enforced_muteness',
  name: 'Enforced Muteness',
  description: 'You\'re forced to remain silent, your voice stolen by oppression.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mindAttack: -60 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤐'
});

/**
 * Selective Blindness - The willful ignorance of painful truth
 */
export const createSelectiveBlindnessDebuff = (duration: number = 3) => ({
  id: 'selective_blindness',
  name: 'Selective Blindness',
  description: 'You see only what you want to see, blind to the suffering around you.',
  type: 'debuff',
  effect: {
    percentageModifiers: { accuracy: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🙈'
});

/**
 * Isolation - The loneliness of being different
 */
export const createIsolationDebuff = (duration: number = 4) => ({
  id: 'isolation',
  name: 'Isolation',
  description: 'You\'re utterly alone, cut off from human connection by your differences.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏝️'
});

/**
 * Mind Control - The violation of mental autonomy
 */
export const createMindControlDebuff = (duration: number = 3) => ({
  id: 'mind_control',
  name: 'Mind Control',
  description: 'Your thoughts are not your own, controlled by someone else\'s will.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎭'
});

/**
 * Exception Justification - The hypocrisy of special pleading
 */
export const createExceptionJustificationDebuff = (duration: number = 3) => ({
  id: 'exception_justification',
  name: 'Exception Justification',
  description: 'You justify exceptions for yourself, but condemn others for the same actions.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Lie Acceptance - The corruption of truth
 */
export const createLieAcceptanceDebuff = (duration: number = 4) => ({
  id: 'lie_acceptance',
  name: 'Lie Acceptance',
  description: 'You accept lies as truth, corrupting your ability to perceive reality.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mindDefense: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤥'
});

/**
 * Blind Devotion - The slavery of unquestioning loyalty
 */
export const createBlindDevotionDebuff = (duration: number = 3) => ({
  id: 'blind_devotion',
  name: 'Blind Devotion',
  description: 'You\'re devoted without question, blind to the corruption of what you worship.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40, mindAttack: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🙏'
});

/**
 * Blood Obligation - The chains of familial duty
 */
export const createBloodObligationDebuff = (duration: number = 4) => ({
  id: 'blood_obligation',
  name: 'Blood Obligation',
  description: 'Family obligations bind you, even when they demand you sacrifice your own well-being.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🩸'
});

/**
 * Identity Erosion - The loss of self
 */
export const createIdentityErosionDebuff = (duration: number = 5) => ({
  id: 'identity_erosion',
  name: 'Identity Erosion',
  description: 'Your sense of self slowly erodes, leaving you questioning who you really are.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -50, mindAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌊'
});

/**
 * Corruption Temptation - The allure of moral compromise
 */
export const createCorruptionTemptationDebuff = (duration: number = 3) => ({
  id: 'corruption_temptation',
  name: 'Corruption Temptation',
  description: 'The temptation to compromise your values is constant, wearing down your integrity.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '💰'
});

/**
 * Card Playing - The trivialization of serious concerns
 */
export const createCardPlayingDebuff = (duration: number = 2) => ({
  id: 'card_playing',
  name: 'Card Playing',
  description: 'You treat serious issues like a game, trivializing real suffering.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🃏'
});

/**
 * Circular Thinking - The trap of self-referential logic
 */
export const createCircularThinkingDebuff = (duration: number = 3) => ({
  id: 'circular_thinking',
  name: 'Circular Thinking',
  description: 'Your thoughts chase their own tails, never reaching a meaningful conclusion.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔄'
});

/**
 * Self-Condemnation - The voice of inner criticism
 */
export const createSelfCondemnationDebuff = (duration: number = 3) => ({
  id: 'self_condemnation',
  name: 'Self-Condemnation',
  description: 'You constantly condemn yourself, turning every success into a reminder of your failures.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '😔'
});

/**
 * Confirmation Blindness - The rejection of contradictory evidence
 */
export const createConfirmationBlindnessDebuff = (duration: number = 3) => ({
  id: 'confirmation_blindness',
  name: 'Confirmation Blindness',
  description: 'You only see evidence that confirms your beliefs, blind to anything that challenges them.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🙈'
});

/**
 * Cost Obsession - The materialistic fixation
 */
export const createCostObsessionDebuff = (duration: number = 3) => ({
  id: 'cost_obsession',
  name: 'Cost Obsession',
  description: 'You\'re obsessed with material value, blind to true worth and human dignity.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35, heart: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💎'
});

/**
 * Change Resistance - The fear of transformation
 */
export const createChangeResistanceDebuff = (duration: number = 4) => ({
  id: 'change_resistance',
  name: 'Change Resistance',
  description: 'You resist all change, even when change is necessary for survival.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -40, mindAttack: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏛️'
});

/**
 * Ego Damage - The shattering of self-importance
 */
export const createEgoDamageDebuff = (duration: number = 3) => ({
  id: 'ego_damage',
  name: 'Ego Damage',
  description: 'Your ego is damaged, making you question your worth and abilities.',
  type: 'debuff',
  effect: {
    percentageModifiers: { heart: -35, body: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '💔'
});

/**
 * Ignorance Shield - The false protection of not knowing
 */
export const createIgnoranceShieldDebuff = (duration: number = 3) => ({
  id: 'ignorance_shield',
  name: 'Ignorance Shield',
  description: 'You shield yourself with ignorance, but ignorance makes you vulnerable to manipulation.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mindDefense: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🛡️'
});

/**
 * Responsibility Avoidance - The refusal to accept consequences
 */
export const createResponsibilityAvoidanceDebuff = (duration: number = 3) => ({
  id: 'responsibility_avoidance',
  name: 'Responsibility Avoidance',
  description: 'You avoid responsibility for your actions, but avoidance doesn\'t make consequences disappear.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -30, ailmentAttack: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤷'
});

/**
 * Disciplinary Blindness - The tunnel vision of expertise
 */
export const createDisciplinaryBlindnessDebuff = (duration: number = 4) => ({
  id: 'disciplinary_blindness',
  name: 'Disciplinary Blindness',
  description: 'Your expertise blinds you to other perspectives, limiting your understanding.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👓'
});

/**
 * Implication - The weight of unspoken accusations
 */
export const createImplicationDebuff = (duration: number = 3) => ({
  id: 'implication',
  name: 'Implication',
  description: 'You\'re constantly implying terrible things, poisoning relationships with suspicion.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💭'
});

/**
 * Conclusion Manipulation - The forced acceptance of false conclusions
 */
export const createConclusionManipulationDebuff = (duration: number = 3) => ({
  id: 'conclusion_manipulation',
  name: 'Conclusion Manipulation',
  description: 'You\'re manipulated into accepting conclusions that aren\'t your own.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎯'
});

/**
 * False Expertise - The confidence of the incompetent
 */
export const createFalseExpertiseDebuff = (duration: number = 3) => ({
  id: 'false_expertise',
  name: 'False Expertise',
  description: 'You believe you\'re an expert, but your confidence exceeds your actual knowledge.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35, accuracy: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎓'
});

/**
 * Unrecognized Achievement - The bitterness of unappreciated effort
 */
export const createUnrecognizedAchievementDebuff = (duration: number = 3) => ({
  id: 'unrecognized_achievement',
  name: 'Unrecognized Achievement',
  description: 'Your efforts go unrecognized, making success feel meaningless.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '🏆'
});

/**
 * False Choice - The illusion of options
 */
export const createFalseChoiceDebuff = (duration: number = 2) => ({
  id: 'false_choice',
  name: 'False Choice',
  description: 'You\'re given choices that are all terrible, making decision-making torture.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Definition Confusion - The chaos of unclear meaning
 */
export const createDefinitionConfusionDebuff = (duration: number = 3) => ({
  id: 'definition_confusion',
  name: 'Definition Confusion',
  description: 'Words lose their meaning, making communication impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📝'
});

/**
 * End-Times Despair - The hopelessness of apocalypse
 */
export const createEndTimesDespairDebuff = (duration: number = 5) => ({
  id: 'end_times_despair',
  name: 'End-Times Despair',
  description: 'The world is ending, making all effort seem pointless and hopeless.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -50, ailmentAttack: -50, mindAttack: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌋'
});

/**
 * Esotericism - The exclusion of hidden knowledge
 */
export const createEsotericismDebuff = (duration: number = 3) => ({
  id: 'esotericism',
  name: 'Esotericism',
  description: 'Hidden knowledge excludes you, making you feel unworthy and ignorant.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔮'
});

/**
 * Fixed Identity - The prison of immutable self
 */
export const createFixedIdentityDebuff = (duration: number = 4) => ({
  id: 'fixed_identity',
  name: 'Fixed Identity',
  description: 'Your identity is fixed and unchangeable, limiting your potential for growth.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -45, physicalAttack: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏷️'
});

/**
 * Linguistic Purism - The rigidity of perfect language
 */
export const createLinguisticPurismDebuff = (duration: number = 3) => ({
  id: 'linguistic_purism',
  name: 'Linguistic Purism',
  description: 'You insist on perfect language, but perfection excludes genuine expression.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📖'
});

/**
 * Middle Exclusion - The rejection of moderation
 */
export const createMiddleExclusionDebuff = (duration: number = 3) => ({
  id: 'middle_exclusion',
  name: 'Middle Exclusion',
  description: 'You reject moderate positions, forcing extreme and unsustainable choices.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Profanity Passion - The vulgar expression of despair
 */
export const createProfanityPassionDebuff = (duration: number = 2) => ({
  id: 'profanity_passion',
  name: 'Profanity Passion',
  description: 'Your passion expresses itself through vulgarity, alienating those you want to reach.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤬'
});

/**
 * False Equivalence - The misleading comparison
 */
export const createFalseEquivalenceDebuff = (duration: number = 3) => ({
  id: 'false_equivalence',
  name: 'False Equivalence',
  description: 'You equate things that aren\'t equal, distorting understanding and justice.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔗'
});

/**
 * Completion Obsession - The endless drive for closure
 */
export const createCompletionObsessionDebuff = (duration: number = 3) => ({
  id: 'completion_obsession',
  name: 'Completion Obsession',
  description: 'You\'re obsessed with finishing things, even when abandonment would be wiser.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -35, mindAttack: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔨'
});

/**
 * Free Speech Absolutism - The tyranny of unrestricted expression
 */
export const createFreeSpeechAbsolutismDebuff = (duration: number = 3) => ({
  id: 'free_speech_absolutism',
  name: 'Free Speech Absolutism',
  description: 'You insist on absolute free speech, but absolute freedom harms the vulnerable.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🗣️'
});

/**
 * Attribution Bias - The distortion of cause and effect
 */
export const createAttributionBiasDebuff = (duration: number = 4) => ({
  id: 'attribution_bias',
  name: 'Attribution Bias',
  description: 'You misattribute causes and effects, leading to unjust blame and credit.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40, heart: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👤'
});

/**
 * Reality Doubt - The questioning of existence itself
 */
export const createRealityDoubtDebuff = (duration: number = 4) => ({
  id: 'reality_doubt',
  name: 'Reality Doubt',
  description: 'You doubt the reality of your experiences, making all perception unreliable.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💭'
});

/**
 * Collective Guilt - The burden of group responsibility
 */
export const createCollectiveGuiltDebuff = (duration: number = 4) => ({
  id: 'collective_guilt',
  name: 'Collective Guilt',
  description: 'You feel guilty for the actions of your entire group, an impossible burden.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👥'
});

/**
 * Incomplete Understanding - The frustration of partial knowledge
 */
export const createIncompleteUnderstandingDebuff = (duration: number = 3) => ({
  id: 'incomplete_understanding',
  name: 'Incomplete Understanding',
  description: 'You understand partially, but incomplete knowledge is more dangerous than ignorance.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🍎'
});

/**
 * Hero Destruction - The shattering of ideals
 */
export const createHeroDestructionDebuff = (duration: number = 4) => ({
  id: 'hero_destruction',
  name: 'Hero Destruction',
  description: 'You destroy your heroes, leaving yourself without inspiration or guidance.',
  type: 'debuff',
  effect: {
    percentageModifiers: { heart: -45, mind: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🦸'
});

/**
 * False Heroism - The illusion of valor
 */
export const createFalseHeroismDebuff = (duration: number = 3) => ({
  id: 'false_heroism',
  name: 'False Heroism',
  description: 'You believe you\'re a hero, but your actions are selfish and destructive.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏅'
});

/**
 * Probability Denial - The rejection of mathematical reality
 */
export const createProbabilityDenialDebuff = (duration: number = 3) => ({
  id: 'probability_denial',
  name: 'Probability Denial',
  description: 'You deny statistical reality, making rational decision-making impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎲'
});

/**
 * Helplessness - The paralysis of learned hopelessness
 */
export const createHelplessnessDebuff = (duration: number = 3) => ({
  id: 'helplessness',
  name: 'Helplessness',
  description: 'You\'ve learned that nothing you do matters, making action seem pointless.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -50, ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🪄'
});

/**
 * Group Determinism - The prison of collective identity
 */
export const createGroupDeterminismDebuff = (duration: number = 4) => ({
  id: 'group_determinism',
  name: 'Group Determinism',
  description: 'Your group determines everything about you, limiting your individual potential.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -45, physicalAttack: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏷️'
});

/**
 * Truth Dilution - The corruption of information
 */
export const createTruthDilutionDebuff = (duration: number = 4) => ({
  id: 'truth_dilution',
  name: 'Truth Dilution',
  description: 'Truth is diluted with lies, making genuine understanding impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📺'
});

/**
 * Deserved Suffering - The internalization of victim-blaming
 */
export const createDeservedSufferingDebuff = (duration: number = 5) => ({
  id: 'deserved_suffering',
  name: 'Deserved Suffering',
  description: 'You believe your suffering is deserved, making escape from abuse impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { heart: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📖'
});

/**
 * Moral Suppression - The silencing of ethical voice
 */
export const createMoralSuppressionDebuff = (duration: number = 3) => ({
  id: 'moral_suppression',
  name: 'Moral Suppression',
  description: 'Your moral voice is suppressed, making you complicit in injustice.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤐'
});

/**
 * False Relatability - The pretense of shared experience
 */
export const createFalseRelatabilityDebuff = (duration: number = 3) => ({
  id: 'false_relatability',
  name: 'False Relatability',
  description: 'You pretend to relate to others\' experiences, but your pretense alienates them.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👥'
});

/**
 * Consequence Paralysis - The fear that prevents action
 */
export const createConsequenceParalysisDebuff = (duration: number = 3) => ({
  id: 'consequence_paralysis',
  name: 'Consequence Paralysis',
  description: 'You\'re paralyzed by fear of consequences, making decisive action impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { body: -45, mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🧠'
});

/**
 * Numerical Confusion - The distortion of quantitative truth
 */
export const createNumericalConfusionDebuff = (duration: number = 3) => ({
  id: 'numerical_confusion',
  name: 'Numerical Confusion',
  description: 'Numbers confuse and mislead you, making data-driven decisions impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📊'
});

/**
 * Magical Belief - The dependence on supernatural solutions
 */
export const createMagicalBeliefDebuff = (duration: number = 3) => ({
  id: 'magical_belief',
  name: 'Magical Belief',
  description: 'You believe in magic solutions, ignoring practical reality.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '✨'
});

/**
 * Bad Faith - The corruption of genuine discourse
 */
export const createBadFaithDebuff = (duration: number = 4) => ({
  id: 'bad_faith',
  name: 'Bad Faith',
  description: 'You argue in bad faith, corrupting the possibility of genuine understanding.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40, mindAttack: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎭'
});

/**
 * Measurement Obsession - The quantification of quality
 */
export const createMeasurementObsessionDebuff = (duration: number = 3) => ({
  id: 'measurement_obsession',
  name: 'Measurement Obsession',
  description: 'You\'re obsessed with measuring everything, blind to unquantifiable value.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📏'
});

/**
 * Thought Assumption - The arrogance of presumed telepathy
 */
export const createThoughtAssumptionDebuff = (duration: number = 3) => ({
  id: 'thought_assumption',
  name: 'Thought Assumption',
  description: 'You assume you know others\' thoughts, poisoning relationships with suspicion.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔮'
});

/**
 * Moral Exception - The hypocrisy of special pleading
 */
export const createMoralExceptionDebuff = (duration: number = 3) => ({
  id: 'moral_exception',
  name: 'Moral Exception',
  description: 'You make exceptions for yourself, but condemn others for the same actions.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: true,
  maxStacks: 3,
  currentStacks: 1,
  icon: '⚖️'
});

/**
 * Superiority Damage - The shattering of arrogant self-worth
 */
export const createSuperiorityDamageDebuff = (duration: number = 4) => ({
  id: 'superiority_damage',
  name: 'Superiority Damage',
  description: 'Your sense of superiority is damaged, revealing your fundamental insecurity.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👑'
});

/**
 * Mortification - The self-inflicted spiritual wounds
 */
export const createMortificationDebuff = (duration: number = 3) => ({
  id: 'mortification',
  name: 'Mortification',
  description: 'You mortify your flesh for spiritual gain, but the pain only reveals your desperation.',
  type: 'debuff',
  effect: {
    percentageModifiers: { body: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤕'
});

/**
 * Criteria Shifting - The moving target of judgment
 */
export const createCriteriaShiftingDebuff = (duration: number = 3) => ({
  id: 'criteria_shifting',
  name: 'Criteria Shifting',
  description: 'You shift criteria constantly, making fair evaluation impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🥅'
});

/**
 * Boundary Violation - The invasion of personal space
 */
export const createBoundaryViolationDebuff = (duration: number = 3) => ({
  id: 'boundary_violation',
  name: 'Boundary Violation',
  description: 'Your boundaries are violated, making you feel unsafe and exposed.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🚪'
});

/**
 * Identity Destruction - The erasure of self
 */
export const createIdentityDestructionDebuff = (duration: number = 4) => ({
  id: 'identity_destruction',
  name: 'Identity Destruction',
  description: 'Your identity is destroyed, leaving you questioning who you are.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -50, mindAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💔'
});

/**
 * Story Preference - The prioritization of narrative over truth
 */
export const createStoryPreferenceDebuff = (duration: number = 3) => ({
  id: 'story_preference',
  name: 'Story Preference',
  description: 'You prefer comforting stories to harsh truth, blinding yourself to reality.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📚'
});

/**
 * Selfish Preservation - The priority of self over others
 */
export const createSelfishPreservationDebuff = (duration: number = 3) => ({
  id: 'selfish_preservation',
  name: 'Selfish Preservation',
  description: 'You preserve yourself at others\' expense, but selfishness isolates you completely.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🏡'
});

/**
 * Discussion Suppression - The silencing of dissent
 */
export const createDiscussionSuppressionDebuff = (duration: number = 3) => ({
  id: 'discussion_suppression',
  name: 'Discussion Suppression',
  description: 'Discussion is suppressed, making collaborative problem-solving impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔒'
});

/**
 * Recognition Denial - The refusal to acknowledge worth
 */
export const createRecognitionDenialDebuff = (duration: number = 3) => ({
  id: 'recognition_denial',
  name: 'Recognition Denial',
  description: 'Your worth is denied, making you feel invisible and insignificant.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🙈'
});

/**
 * Connection Confusion - The distortion of logical relationships
 */
export const createConnectionConfusionDebuff = (duration: number = 2) => ({
  id: 'connection_confusion',
  name: 'Connection Confusion',
  description: 'Logical connections confuse you, making rational thought impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🤪'
});

/**
 * Novelty Denial - The rejection of innovation
 */
export const createNoveltyDenialDebuff = (duration: number = 3) => ({
  id: 'novelty_denial',
  name: 'Novelty Denial',
  description: 'You deny the possibility of novelty, trapping yourself in outdated thinking.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔄'
});

/**
 * Olfactory Rejection - The disgust of perceived inferiority
 */
export const createOlfactoryRejectionDebuff = (duration: number = 3) => ({
  id: 'olfactory_rejection',
  name: 'Olfactory Rejection',
  description: 'You\'re rejected based on smell, a superficial judgment that dehumanizes.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👃'
});

/**
 * Memory Manipulation - The distortion of personal history
 */
export const createMemoryManipulationDebuff = (duration: number = 4) => ({
  id: 'memory_manipulation',
  name: 'Memory Manipulation',
  description: 'Your memories are manipulated, making your personal history unreliable.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -45 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🧠'
});

/**
 * Othering - The dehumanization of difference
 */
export const createOtheringDebuff = (duration: number = 4) => ({
  id: 'othering',
  name: 'Othering',
  description: 'You\'re treated as "other," excluded from human community and dignity.',
  type: 'debuff',
  effect: {
    percentageModifiers: { heart: -50 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👥'
});

/**
 * Intellectual Humiliation - The shame of exposed ignorance
 */
export const createIntellectualHumiliationDebuff = (duration: number = 3) => ({
  id: 'intellectual_humiliation',
  name: 'Intellectual Humiliation',
  description: 'Your intellectual shortcomings are exposed, making you feel stupid and inadequate.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -40, heart: -30 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📝'
});

/**
 * Universal Condemnation - The judgment of all humanity
 */
export const createUniversalCondemnationDebuff = (duration: number = 4) => ({
  id: 'universal_condemnation',
  name: 'Universal Condemnation',
  description: 'Everyone and everything is condemned, making hope for improvement impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -50, mindAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎯'
});

/**
 * Analysis Paralysis - The overthinking that prevents action
 */
export const createAnalysisParalysisDebuff = (duration: number = 3) => ({
  id: 'analysis_paralysis',
  name: 'Analysis Paralysis',
  description: 'You overanalyze everything, making decisive action impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { body: -45, mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🧠'
});

/**
 * Maturity Denial - The refusal to acknowledge growth
 */
export const createMaturityDenialDebuff = (duration: number = 3) => ({
  id: 'maturity_denial',
  name: 'Maturity Denial',
  description: 'Your maturity is denied, treating you like a child despite your capabilities.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👨‍👧'
});

/**
 * Personalization - The self-centered interpretation of everything
 */
export const createPersonalizationDebuff = (duration: number = 3) => ({
  id: 'personalization',
  name: 'Personalization',
  description: 'You interpret everything personally, making objective reality impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👤'
});

/**
 * Simplicity Demand - The insistence on oversimplification
 */
export const createSimplicityDemandDebuff = (duration: number = 3) => ({
  id: 'simplicity_demand',
  name: 'Simplicity Demand',
  description: 'Complex issues must be simplified, but simplification distorts truth.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📖'
});

/**
 * Deniability Shield - The protection of plausible ignorance
 */
export const createDeniabilityShieldDebuff = (duration: number = 3) => ({
  id: 'deniability_shield',
  name: 'Deniability Shield',
  description: 'You shield yourself with deniability, but deniability doesn\'t absolve responsibility.',
  type: 'debuff',
  effect: {
    percentageModifiers: { physicalAttack: -30, ailmentAttack: -25 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🛡️'
});

/**
 * Sentiment Manipulation - The weaponization of emotion
 */
export const createSentimentManipulationDebuff = (duration: number = 3) => ({
  id: 'sentiment_manipulation',
  name: 'Sentiment Manipulation',
  description: 'Your emotions are manipulated as weapons, making genuine feeling impossible.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -40 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '😢'
});

/**
 * Language Policing - The censorship of expression
 */
export const createLanguagePolicingDebuff = (duration: number = 3) => ({
  id: 'language_policing',
  name: 'Language Policing',
  description: 'Your language is policed, making authentic expression dangerous.',
  type: 'debuff',
  effect: {
    percentageModifiers: { mind: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '📝'
});

/**
 * Toxic Positivity - The denial of legitimate suffering
 */
export const createToxicPositivityDebuff = (duration: number = 3) => ({
  id: 'toxic_positivity',
  name: 'Toxic Positivity',
  description: 'Positivity is demanded, but forced optimism denies real pain and suffering.',
  type: 'debuff',
  effect: {
    percentageModifiers: { ailmentAttack: -35 }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🌈'
});

// =============================================================================
// NATURAL STATUS EFFECTS - Combat mechanics that occur without skills/spells/fallacies
// =============================================================================

/**
 * Mind Attack Follow-up Buff - Natural effect from Mind attacks
 * As mentioned in Combat.md: "buff until the end of the next turn where their next attack triggers a separate attack that causes fixed damage"
 */
export const createMindAttackBuff = (damage: number) => ({
  id: 'mind_attack_followup',
  name: 'Mental Advantage',
  description: 'Your mind attack has planted seeds of doubt that will bloom into additional damage on your next attack.',
  type: 'buff',
  effect: {
    specialEffects: { fixedDamageNextTurn: damage }
  },
  duration: 1,
  remainingTurns: 1,
  stackable: false,
  currentStacks: 1,
  icon: '🧠'
});

/**
 * Heart Attack Guilt Debuff - Natural effect from Heart attacks
 * As mentioned in Combat.md: "DEBUFF for 3 turns where they take (x) damage (Minus Ailment Defense) every time they use "Attack""
 */
export const createailmentAttackDebuff = (damage: number, duration: number = 3) => ({
  id: 'heart_attack_guilt',
  name: 'Emotional Guilt',
  description: 'The weight of your emotional attack creates a growing burden of guilt that damages you when you try to fight back.',
  type: 'debuff',
  effect: {
    specialEffects: {
      damageOnAttack: damage
    }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '💔'
});

/**
 * Body Defense Reflection Buff - Natural effect from Body defense
 * As mentioned in Combat.md: "BUFF called "Reflect" where whenever the player is "Attacked" or recieved damage from a Special Attack, the attacking combatant takes (x) damage"
 */
export const createReflectionBuff = (damage: number) => ({
  id: 'body_reflection',
  name: 'Physical Reflection',
  description: 'Your physical defense creates a barrier that reflects incoming attacks back at your attacker.',
  type: 'buff',
  effect: {
    specialEffects: { reflection: damage }
  },
  duration: 3,
  remainingTurns: 3,
  stackable: false,
  currentStacks: 1,
  icon: '🛡️'
});

/**
 * Mind Defense Counter-Argument Buff - Natural effect from Mind defense
 * As mentioned in Combat.md: "counter their argument by recieving a temporary buff (3 turns), where the player recieves a bonus to their mind attack"
 */
export const createCounterArgumentBuff = (mindAttackBonus: number, duration: number = 3) => ({
  id: 'mind_counter_argument',
  name: 'Counter-Argument',
  description: 'Your mental defense has prepared a devastating counter-argument that will strengthen your future attacks.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: mindAttackBonus }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎯'
});

/**
 * Heart Defense Foresight Buff - Natural effect from Heart defense
 * As mentioned in Combat.md: "the player will be granted a buff for 3 turns where they will be aware of the enemy's Attack action"
 */
export const createForesightBuff = (_visionType: string = 'enemy attacks', duration: number = 3) => ({
  id: 'heart_foresight',
  name: 'Emotional Foresight',
  description: 'Your emotional defense grants you insight into your opponent\'s intentions, letting you anticipate their attacks.',
  type: 'buff',
  effect: {
    specialEffects: { immuneToNextAttack: true }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '👁️'
});

/**
 * Body Defense Enhanced Reflection - Enhanced version for advantage
 * As mentioned in Combat.md: "The player receives a bonus where the attacker recieves 1/2 (instead of 1/4) of the damage"
 */
export const createBodyDefenseBuff = (damage: number) => ({
  id: 'body_defense_enhanced',
  name: 'Enhanced Physical Defense',
  description: 'Your body-based defense creates an even stronger barrier, reflecting more damage back to attackers.',
  type: 'buff',
  effect: {
    specialEffects: { reflection: damage }
  },
  duration: 3,
  remainingTurns: 3,
  stackable: false,
  currentStacks: 1,
  icon: '🛡️'
});

/**
 * Mind Defense Enhanced Counter - Enhanced version for advantage
 * As mentioned in Combat.md: "The player recieves a bonus to Mind Attack equal to x1/2 (instead of 1/4) of the opponents Mind Attack"
 */
export const createMindDefenseBuff = (mindAttackBonus: number, duration: number = 3) => ({
  id: 'mind_defense_enhanced',
  name: 'Enhanced Counter-Argument',
  description: 'Your mental defense has crafted an even more devastating counter-argument against your opponent.',
  type: 'buff',
  effect: {
    statModifiers: { mindAttack: mindAttackBonus }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🎯'
});

/**
 * Heart Defense Enhanced Foresight - Enhanced version for advantage
 * As mentioned in Combat.md: "the player will be granted a buff for 3 turns where they will be aware of the enemy's Attack action and Argument type"
 */
export const createailmentDefenseBuff = (duration: number = 3) => ({
  id: 'heart_defense_enhanced',
  name: 'Enhanced Emotional Foresight',
  description: 'Your emotional defense grants you complete insight into your opponent\'s strategy and intentions.',
  type: 'buff',
  effect: {
    specialEffects: { immuneToNextAttack: true }
  },
  duration,
  remainingTurns: duration,
  stackable: false,
  currentStacks: 1,
  icon: '🔮'
});

// =============================================================================
// UNIQUE EFFECTS - Special mechanics that don't fit buffs/debuffs
// =============================================================================

/**
 * Create a status effect with bleak, heart-wrenching descriptions
 */
export function createBleakStatusEffect(
  id: string,
  name,
  description: string,
  type: 'buff' | 'debuff',
  duration: number,
  icon: string,
  stackable: boolean = false,
  maxStacks?: number
) {
  return {
    id,
    name,
    description,
    type,
    // effect,
    duration,
    remainingTurns: duration,
    stackable,
    ...(maxStacks !== undefined && { maxStacks }),
    icon,
    currentStacks: 1
  };
}

/**
 * Get all available status effects
 */
export function getAllStatusEffects() {
  return {
    // Natural combat effects (from Combat.md)
    mind_attack_followup: createMindAttackBuff(15),
    heart_attack_guilt: createailmentAttackDebuff(10),
    body_reflection: createReflectionBuff(8),
    mind_counter_argument: createCounterArgumentBuff(5),
    heart_foresight: createForesightBuff(),
    body_defense_enhanced: createBodyDefenseBuff(12),
    mind_defense_enhanced: createMindDefenseBuff(8),
    heart_defense_enhanced: createailmentDefenseBuff(),

    // Sample of other effects
    dogmatic_certainty: createDogmaticCertaintyDebuff(),
    self_loathing: createSelfLoathingDebuff(15),
    logic_immunity: createLogicImmunityBuff(),
    strength_from_pain: createStrengthFromPainBuff(20),
  };
}

/**
 * Apply a status effect to a target
 */
export function applyStatusEffect(
  target: any,
  effect,
  _source?: string
): string[] {
  const messages: string[] = [];

  // Add to target's effects
  if (!target.buffs) target.buffs = [];
  if (!target.debuffs) target.debuffs = [];

  if (effect.type === 'buff') {
    target.buffs.push(effect);
    messages.push(`${target.name} gains ${effect.name}: ${effect.description}`);
  } else {
    target.debuffs.push(effect);
    messages.push(`${target.name} suffers ${effect.name}: ${effect.description}`);
  }

  return messages;
}

/**
 * Process status effects for a combat round
 */
export function processStatusEffects(combatant: any): string[] {
  const messages: string[] = [];
  const allEffects = [...(combatant.buffs || []), ...(combatant.debuffs || [])];

  allEffects.forEach(effect => {
    // Decrease duration
    effect.remainingTurns--;

    // Apply effect mechanics
    if (effect.effect.specialEffects?.damageOnAttack) {
      // Handle damage on attack effects
    }

    // Remove expired effects
    if (effect.remainingTurns <= 0) {
      const effectType = effect.type === 'buff' ? 'buffs' : 'debuffs';
      const index = combatant[effectType]?.findIndex((e) => e.id === effect.id);
      if (index !== undefined && index >= 0) {
        combatant[effectType].splice(index, 1);
        messages.push(`${effect.name} fades from ${combatant.name}`);
      }
    }
  });

  return messages;
}
