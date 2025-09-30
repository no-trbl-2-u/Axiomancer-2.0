import { Skill } from '../types/game';
import {
  createDogmaticCertaintyDebuff,
  createSelfLoathingDebuff,
  createLogicImmunityBuff,
  createStrengthFromPainBuff,
  createMindAttackBuff,
  createailmentAttackDebuff,
  createReflectionBuff,
  createCounterArgumentBuff,
  createForesightBuff
} from './statusEffects';

/**
 * Complete Fallacy Spellbook - All 100+ Logical Fallacies from all-fallacies.md
 * Converted into Axiomancer combat skills following Combat.md specifications
 * 75% of these are designed to be psychologically devastating and bleak
 */

export const fallacySpellbook: Record<string, Skill> = {
  // 1. The A Priori Argument (Mind-based - bleak rationalization)
  a_priori_argument: {
    id: 'a_priori_argument',
    name: 'A Priori Argument',
    description: 'Start with a conclusion and rationalize backwards, blinding yourself to evidence that contradicts your preconceived dogma.',
    level: 2,
    manaCost: 25,
    damage: 0,
    icon: '🔮',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: "Inflicts Dogmatic Certainty debuff on opponent",
      advantageEffect: "Inflicts stronger Dogmatic Certainty debuff (4 turns) on opponent",
      baseDefendedEffect: "Grants Logic Immunity buff to defender",
      defendedAgainstAdvantage: "Inflicts Dogmatic Certainty debuff on attacker",
      defendedWithAdvantage: "Grants enhanced Logic Immunity buff (5 turns) to defender"
    }
  },

  // 2. Ableism (Heart-based - devastating personal attack)
  ableism: {
    id: 'ableism',
    name: 'Ableism',
    description: 'Exploit another\'s vulnerability, reminding them of their "natural" inferiority and how they deserve their suffering.',
    level: 1,
    manaCost: 20,
    damage: 35,
    icon: '🦽',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 2,
      stats: { heart: 14 }
    },
    combatEffects: {
      baseEffect: "Inflicts severe Self Loathing debuff on opponent (15 damage)",
      advantageEffect: "Inflicts enhanced Self Loathing debuff on opponent (25 damage, 5 turns)",
      baseDefendedEffect: "Attacker suffers Self Loathing debuff (10 damage)",
      defendedAgainstAdvantage: "Grants Strength From Pain buff to defender (20 bonus)",
      defendedWithAdvantage: "Grants Insight buff to defender"
    }
  },

  // 3. Actions have Consequences (Body-based - brutal reality check)
  actions_have_consequences: {
    id: 'actions_have_consequences',
    name: 'Actions Have Consequences',
    description: 'Brutally remind someone that their choices led to their current suffering, as if cosmic justice demands their pain.',
    level: 2,
    manaCost: 18,
    damage: 28,
    icon: '⚖️',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 15 }
    },
    combatEffects: {
      baseEffect: "Inflicts Inescapable Fate debuff on opponent",
      advantageEffect: "Inflicts enhanced Inescapable Fate debuff on opponent (5 turns)",
      baseDefendedEffect: "Grants Resistance buff to defender",
      defendedAgainstAdvantage: "Inflicts Dogmatic Certainty debuff on attacker",
      defendedWithAdvantage: "Attacker suffers Self Loathing debuff (15 damage)"
    }
  },

  // 4. The Ad Hominem Argument (Heart-based - personal destruction)
  ad_hominem: {
    id: 'ad_hominem',
    name: 'Ad Hominem Attack',
    description: 'Tear down the person instead of their argument, exposing their deepest flaws and making them question their very worth.',
    level: 1,
    manaCost: 15,
    damage: 30,
    icon: '👤',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 1,
      stats: { heart: 12 }
    },
    combatEffects: {
      baseEffect: 'Deals 30 emotional damage + personal doubt debuff',
      advantageEffect: '45 damage + opponent questions their right to exist',
      baseDefendedEffect: 'Your attack reveals your own insecurities, taking backlash damage',
      defendedAgainstAdvantage: 'Opponent uses your attack to fuel their resolve',
      defendedWithAdvantage: 'Your personal attack completely backfires, destroying your own confidence'
    }
  },

  // 5. The Affective Fallacy (Heart-based - emotional manipulation)
  affective_fallacy: {
    id: 'affective_fallacy',
    name: 'Affective Fallacy',
    description: 'Your emotions are the only truth that matters, and anyone who questions them is denying your very soul.',
    level: 2,
    manaCost: 22,
    damage: 0,
    icon: '💭',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 16 }
    },
    combatEffects: {
      baseEffect: 'Applies emotional override buff, making opponent act on feelings over reason',
      advantageEffect: 'Opponent becomes slave to their emotions, attacking allies randomly',
      baseDefendedEffect: 'Opponent maintains rational control, gaining clarity buff',
      defendedAgainstAdvantage: 'Your emotional manipulation exposes your own vulnerability',
      defendedWithAdvantage: 'Opponent achieves emotional mastery, immune to future manipulations'
    }
  },

  // 6. Alphabet Soup (Mind-based - bureaucratic confusion)
  alphabet_soup: {
    id: 'alphabet_soup',
    name: 'Alphabet Soup',
    description: 'Drown your opponent in meaningless jargon and acronyms, making them feel stupid and excluded.',
    level: 3,
    manaCost: 30,
    damage: 25,
    icon: '🔤',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Deals 25 confusion damage + intellectual exclusion debuff',
      advantageEffect: '35 damage + opponent forgets their own abilities for 2 turns',
      baseDefendedEffect: 'Opponent sees through your jargon, gaining insight',
      defendedAgainstAdvantage: 'Your complexity becomes your undoing',
      defendedWithAdvantage: 'Opponent masters your jargon, turning it against you'
    }
  },

  // 7. Alternative Truth (Mind-based - reality denial)
  alternative_truth: {
    id: 'alternative_truth',
    name: 'Alternative Truth',
    description: 'Facts are whatever you want them to be. Reality bends to your will, and anyone who disagrees is the real liar.',
    level: 3,
    manaCost: 35,
    damage: 0,
    icon: '🌈',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 20 }
    },
    combatEffects: {
      baseEffect: 'Creates alternate reality where opponent\'s attacks miss',
      advantageEffect: 'Opponent questions their own existence, skipping turns',
      baseDefendedEffect: 'Reality reasserts itself, breaking your illusion',
      defendedAgainstAdvantage: 'Your false reality crumbles completely',
      defendedWithAdvantage: 'Opponent forces you to confront actual reality'
    }
  },

  // 8. The Appeal to Closure (Heart-based - emotional blackmail)
  appeal_to_closure: {
    id: 'appeal_to_closure',
    name: 'Appeal to Closure',
    description: 'You must accept my version of events or you\'ll never find peace. The truth doesn\'t matter, only ending the pain.',
    level: 2,
    manaCost: 20,
    damage: 32,
    icon: '🔒',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 32 emotional damage + closure-seeking debuff',
      advantageEffect: '48 damage + opponent accepts defeat to end suffering',
      baseDefendedEffect: 'Opponent rejects your false closure, gaining resolve',
      defendedAgainstAdvantage: 'Your need for closure exposes your desperation',
      defendedWithAdvantage: 'Opponent achieves true closure, ending your manipulation'
    }
  },

  // 9. The Appeal to Heaven (Heart-based - divine justification)
  appeal_to_heaven: {
    id: 'appeal_to_heaven',
    name: 'Appeal to Heaven',
    description: 'God/fate/destiny demands this suffering. Who are you to question divine will? Your pain is part of a larger plan.',
    level: 3,
    manaCost: 28,
    damage: 40,
    icon: '⛪',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 18 }
    },
    combatEffects: {
      baseEffect: 'Deals 40 spiritual damage + divine judgment debuff',
      advantageEffect: '60 damage + opponent believes their defeat is god\'s will',
      baseDefendedEffect: 'Opponent questions your divine authority',
      defendedAgainstAdvantage: 'Your appeal to heaven reveals your own lack of faith',
      defendedWithAdvantage: 'Opponent achieves spiritual clarity, immune to divine manipulations'
    }
  },

  // 10. The Appeal to Nature (Body-based - biological determinism)
  appeal_to_nature: {
    id: 'appeal_to_nature',
    name: 'Appeal to Nature',
    description: 'This is how things are "supposed" to be. Your suffering is natural, inevitable, and therefore right and good.',
    level: 2,
    manaCost: 18,
    damage: 26,
    icon: '🌿',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 14 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 biological damage + natural order debuff',
      advantageEffect: '39 damage + opponent accepts their "natural" inferiority',
      baseDefendedEffect: 'Opponent rejects your natural law, gaining adaptation buff',
      defendedAgainstAdvantage: 'Your appeal to nature reveals your own unnatural cruelty',
      defendedWithAdvantage: 'Opponent transcends your "natural" limitations'
    }
  },

  // 11. The Appeal to Pity (Heart-based - emotional manipulation)
  appeal_to_pity: {
    id: 'appeal_to_pity',
    name: 'Appeal to Pity',
    description: 'Look at me suffering! How can you be so cruel as to disagree with me? Your heartlessness proves you\'re the monster.',
    level: 1,
    manaCost: 16,
    damage: 28,
    icon: '😢',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 2,
      stats: { heart: 13 }
    },
    combatEffects: {
      baseEffect: 'Deals 28 emotional damage + guilt amplification debuff',
      advantageEffect: '42 damage + opponent paralyzed by self-doubt',
      baseDefendedEffect: 'Opponent sees through your manipulation, gaining emotional immunity',
      defendedAgainstAdvantage: 'Your pity play exposes your own lack of genuine suffering',
      defendedWithAdvantage: 'Opponent achieves emotional maturity, immune to pity tactics'
    }
  },

  // 12. The Appeal to Tradition (Body-based - cultural imprisonment)
  appeal_to_tradition: {
    id: 'appeal_to_tradition',
    name: 'Appeal to Tradition',
    description: 'This is how we\'ve always done it, so it must be right. Your questioning of tradition makes you the real problem.',
    level: 2,
    manaCost: 20,
    damage: 24,
    icon: '🏛️',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 cultural damage + tradition binding debuff',
      advantageEffect: '36 damage + opponent trapped in outdated thinking',
      baseDefendedEffect: 'Opponent breaks free from your traditions, gaining innovation buff',
      defendedAgainstAdvantage: 'Your appeal to tradition reveals your fear of change',
      defendedWithAdvantage: 'Opponent creates new traditions, making yours obsolete'
    }
  },

  // 13. Appeasement (Heart-based - manipulative surrender)
  appeasement: {
    id: 'appeasement',
    name: 'Appeasement',
    description: 'Give in to my demands and I\'ll stop hurting you. Your compliance is the only way to end this suffering.',
    level: 2,
    manaCost: 24,
    damage: 0,
    icon: '🤝',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 16 }
    },
    combatEffects: {
      baseEffect: 'Applies appeasement debuff, making opponent hesitant to attack',
      advantageEffect: 'Opponent surrenders initiative, letting you dictate terms',
      baseDefendedEffect: 'Opponent recognizes your manipulation, gaining resistance',
      defendedAgainstAdvantage: 'Your appeasement reveals your own desperation for control',
      defendedWithAdvantage: 'Opponent achieves true independence, immune to future manipulations'
    }
  },

  // 14. The Argument from Consequences (Mind-based - fear of outcomes)
  argument_from_consequences: {
    id: 'argument_from_consequences',
    name: 'Argument from Consequences',
    description: 'If this truth were acknowledged, everything would fall apart. Therefore, it can\'t be true. Your fear justifies your denial.',
    level: 3,
    manaCost: 32,
    damage: 0,
    icon: '💥',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Applies consequence fear debuff, making opponent avoid risky actions',
      advantageEffect: 'Opponent paralyzed by fear of outcomes, skipping turns',
      baseDefendedEffect: 'Opponent confronts consequences head-on, gaining courage buff',
      defendedAgainstAdvantage: 'Your fear of consequences exposes your own fragility',
      defendedWithAdvantage: 'Opponent embraces consequences, achieving liberation'
    }
  },

  // 15. The Argument from Ignorance (Mind-based - willful blindness)
  argument_from_ignorance: {
    id: 'argument_from_ignorance',
    name: 'Argument from Ignorance',
    description: 'Since you can\'t prove me wrong, I must be right. Your inability to disprove my delusions makes them true.',
    level: 2,
    manaCost: 26,
    damage: 22,
    icon: '🙈',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 22 confusion damage + ignorance empowerment buff',
      advantageEffect: '33 damage + opponent believes their ignorance is strength',
      baseDefendedEffect: 'Opponent gains knowledge, breaking your ignorance',
      defendedAgainstAdvantage: 'Your argument from ignorance reveals your own intellectual poverty',
      defendedWithAdvantage: 'Opponent achieves enlightenment, making your ignorance irrelevant'
    }
  },

  // 16. The Argument from Incredulity (Mind-based - dismissive arrogance)
  argument_from_incredulity: {
    id: 'argument_from_incredulity',
    name: 'Argument from Incredulity',
    description: 'I can\'t believe this, so it must be false. My limited imagination defines reality for everyone.',
    level: 2,
    manaCost: 24,
    damage: 20,
    icon: '🤯',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 20 dismissal damage + incredulity debuff',
      advantageEffect: '30 damage + opponent rejects reality itself',
      baseDefendedEffect: 'Opponent expands their mind, gaining imagination buff',
      defendedAgainstAdvantage: 'Your incredulity exposes your own narrow-mindedness',
      defendedWithAdvantage: 'Opponent achieves broader understanding, making your views obsolete'
    }
  },

  // 17. The Argument from Inertia (Body-based - resistance to change)
  argument_from_inertia: {
    id: 'argument_from_inertia',
    name: 'Argument from Inertia',
    description: 'We\'ve always done it this way, so changing would destroy everything. Your adaptation threatens our stagnation.',
    level: 2,
    manaCost: 22,
    damage: 26,
    icon: '🏗️',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 resistance damage + inertia debuff',
      advantageEffect: '39 damage + opponent stuck in old patterns',
      baseDefendedEffect: 'Opponent breaks free, gaining momentum buff',
      defendedAgainstAdvantage: 'Your inertia reveals your own fear of progress',
      defendedWithAdvantage: 'Opponent achieves transformation, leaving your ways behind'
    }
  },

  // 18. The Argument from Motives (Heart-based - suspicion and paranoia)
  argument_from_motives: {
    id: 'argument_from_motives',
    name: 'Argument from Motives',
    description: 'Your motives are impure, so everything you say is tainted. I know what you really want, and it disgusts me.',
    level: 3,
    manaCost: 28,
    damage: 34,
    icon: '🔍',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 34 suspicion damage + motive corruption debuff',
      advantageEffect: '51 damage + opponent questions their own intentions',
      baseDefendedEffect: 'Opponent examines your motives, gaining insight',
      defendedAgainstAdvantage: 'Your suspicion reveals your own corrupt nature',
      defendedWithAdvantage: 'Opponent achieves purity of intention, exposing your corruption'
    }
  },

  // 19. Argumentum ad Baculum (Body-based - threat of violence)
  argumentum_ad_baculum: {
    id: 'argumentum_ad_baculum',
    name: 'Argumentum ad Baculum',
    description: 'Agree with me or I\'ll hurt you. Your physical safety depends on your intellectual surrender.',
    level: 1,
    manaCost: 12,
    damage: 40,
    icon: '🗡️',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 2,
      stats: { body: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 40 physical damage + fear debuff',
      advantageEffect: '60 damage + opponent terrified into submission',
      baseDefendedEffect: 'Opponent stands firm, gaining courage buff',
      defendedAgainstAdvantage: 'Your threat reveals your own weakness',
      defendedWithAdvantage: 'Opponent overcomes fear, gaining strength from adversity'
    }
  },

  // 20. Argumentum ad Mysteriam (Mind-based - mystical obfuscation)
  argumentum_ad_mysteriam: {
    id: 'argumentum_ad_mysteriam',
    name: 'Argumentum ad Mysteriam',
    description: 'You couldn\'t possibly understand this mystery. Only the initiated know the truth, and you\'re not worthy.',
    level: 3,
    manaCost: 30,
    damage: 0,
    icon: '🔮',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Applies mystical confusion debuff, making opponent question reality',
      advantageEffect: 'Opponent loses grip on logic, attacking randomly',
      baseDefendedEffect: 'Opponent demystifies your argument, gaining clarity',
      defendedAgainstAdvantage: 'Your mystery is revealed as mere obfuscation',
      defendedWithAdvantage: 'Opponent achieves enlightenment, exposing your false mysticism'
    }
  },

  // 21. Argumentum ex Silentio (Mind-based - silence as proof)
  argumentum_ex_silentio: {
    id: 'argumentum_ex_silentio',
    name: 'Argumentum ex Silentio',
    description: 'Your silence proves my point. Since you can\'t defend yourself, you must be guilty of everything I accuse you of.',
    level: 2,
    manaCost: 24,
    damage: 30,
    icon: '🤐',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 30 silence damage + enforced muteness debuff',
      advantageEffect: '45 damage + opponent unable to defend themselves',
      baseDefendedEffect: 'Opponent breaks silence, gaining voice buff',
      defendedAgainstAdvantage: 'Your argument from silence reveals your own deafness',
      defendedWithAdvantage: 'Opponent finds their true voice, silencing your accusations'
    }
  },

  // 22. Availability Bias (Mind-based - selective memory)
  availability_bias: {
    id: 'availability_bias',
    name: 'Availability Bias',
    description: 'Only what I remember matters. Your evidence doesn\'t count because I can\'t recall anything like it.',
    level: 2,
    manaCost: 26,
    damage: 24,
    icon: '🧠',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 3,
      stats: { mind: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 memory damage + selective blindness debuff',
      advantageEffect: '36 damage + opponent forgets their own strengths',
      baseDefendedEffect: 'Opponent remembers everything, gaining total recall buff',
      defendedAgainstAdvantage: 'Your bias exposes your own selective memory',
      defendedWithAdvantage: 'Opponent achieves perfect memory, exposing your distortions'
    }
  },

  // 23. The Bandwagon Fallacy (Heart-based - social pressure)
  bandwagon_fallacy: {
    id: 'bandwagon_fallacy',
    name: 'Bandwagon Fallacy',
    description: 'Everyone agrees with me, so you must be wrong. Your loneliness proves your error.',
    level: 2,
    manaCost: 20,
    damage: 28,
    icon: '🚂',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 28 social damage + isolation debuff',
      advantageEffect: '42 damage + opponent feels utterly alone',
      baseDefendedEffect: 'Opponent finds inner strength, gaining independence buff',
      defendedAgainstAdvantage: 'Your bandwagon reveals your own need for validation',
      defendedWithAdvantage: 'Opponent achieves true independence, immune to social pressure'
    }
  },

  // 24. The Big Brain/Little Brain Fallacy (Mind-based - intellectual domination)
  big_brain_little_brain: {
    id: 'big_brain_little_brain',
    name: 'Big Brain/Little Brain',
    description: 'Don\'t think with your pathetic little brain, think with mine. Your thoughts are worthless compared to my genius.',
    level: 4,
    manaCost: 40,
    damage: 0,
    icon: '🧠',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 20 }
    },
    combatEffects: {
      baseEffect: 'Applies mind control debuff, forcing opponent to use your strategies',
      advantageEffect: 'Opponent completely submits to your intellect',
      baseDefendedEffect: 'Opponent maintains independent thought, gaining mental autonomy',
      defendedAgainstAdvantage: 'Your intellectual dominance reveals your own insecurity',
      defendedWithAdvantage: 'Opponent achieves intellectual sovereignty, freeing themselves from your influence'
    }
  },

  // 25. The Big "But" Fallacy (Heart-based - hypocritical exception)
  big_but_fallacy: {
    id: 'big_but_fallacy',
    name: 'Big "But" Fallacy',
    description: 'I believe in equality and justice for all, BUT you\'re different and don\'t deserve it. Your exception proves the rule.',
    level: 2,
    manaCost: 22,
    damage: 32,
    icon: '🗣️',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 32 hypocrisy damage + exception justification debuff',
      advantageEffect: '48 damage + opponent internalizes their own unworthiness',
      baseDefendedEffect: 'Opponent exposes your hypocrisy, gaining moral high ground',
      defendedAgainstAdvantage: 'Your exception reveals your own moral bankruptcy',
      defendedWithAdvantage: 'Opponent achieves moral consistency, exposing your contradictions'
    }
  },

  // 26. The Big Lie Technique (Mind-based - overwhelming falsehood)
  big_lie_technique: {
    id: 'big_lie_technique',
    name: 'Big Lie Technique',
    description: 'Tell a lie so enormous and audacious that people assume it must be true because no one would dare make up something so outrageous.',
    level: 4,
    manaCost: 45,
    damage: 0,
    icon: '📢',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 22 }
    },
    combatEffects: {
      baseEffect: 'Applies lie acceptance debuff, making opponent believe your false reality',
      advantageEffect: 'Opponent completely accepts your lie as truth',
      baseDefendedEffect: 'Opponent sees through the magnitude, gaining lie detection',
      defendedAgainstAdvantage: 'Your big lie reveals its own impossibility',
      defendedWithAdvantage: 'Opponent achieves truth vision, immune to future lies'
    }
  },

  // 27. Blind Loyalty (Heart-based - devotion without question)
  blind_loyalty: {
    id: 'blind_loyalty',
    name: 'Blind Loyalty',
    description: 'I\'m right because my leader/group/cause says so. Questioning them would make me a traitor to everything I hold dear.',
    level: 2,
    manaCost: 18,
    damage: 26,
    icon: '👁️',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 14 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 loyalty damage + blind devotion debuff',
      advantageEffect: '39 damage + opponent attacks their own allies',
      baseDefendedEffect: 'Opponent questions their loyalty, gaining independence',
      defendedAgainstAdvantage: 'Your blind loyalty reveals your own lack of conviction',
      defendedWithAdvantage: 'Opponent achieves true loyalty through understanding'
    }
  },

  // 28. Blood is Thicker than Water (Heart-based - familial obligation)
  blood_is_thicker: {
    id: 'blood_is_thicker',
    name: 'Blood is Thicker than Water',
    description: 'Family must come first, no matter how toxic or abusive. Your suffering is justified by blood ties.',
    level: 3,
    manaCost: 26,
    damage: 36,
    icon: '🩸',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 36 familial damage + blood obligation debuff',
      advantageEffect: '54 damage + opponent sacrifices themselves for "family"',
      baseDefendedEffect: 'Opponent breaks free from toxic bonds, gaining emotional freedom',
      defendedAgainstAdvantage: 'Your blood ties reveal your own dysfunctional family history',
      defendedWithAdvantage: 'Opponent creates chosen family, transcending blood obligations'
    }
  },

  // 29. Brainwashing (Mind-based - identity destruction)
  brainwashing: {
    id: 'brainwashing',
    name: 'Brainwashing',
    description: 'I\'ll break your mind until you believe what I want you to believe. Your thoughts are no longer your own.',
    level: 4,
    manaCost: 50,
    damage: 0,
    icon: '🧼',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 6,
      stats: { mind: 24 }
    },
    combatEffects: {
      baseEffect: 'Applies identity erosion debuff, slowly changing opponent\'s beliefs',
      advantageEffect: 'Opponent completely adopts your worldview',
      baseDefendedEffect: 'Opponent resists, gaining mental fortitude',
      defendedAgainstAdvantage: 'Your brainwashing reveals your own fragile identity',
      defendedWithAdvantage: 'Opponent achieves mental sovereignty, immune to manipulation'
    }
  },

  // 30. Bribery (Heart-based - corrupt incentives)
  bribery: {
    id: 'bribery',
    name: 'Bribery',
    description: 'Your principles mean nothing compared to what I can offer you. Sell your integrity for temporary gain.',
    level: 2,
    manaCost: 15,
    damage: 0,
    icon: '💰',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 2,
      stats: { heart: 13 }
    },
    combatEffects: {
      baseEffect: 'Applies corruption temptation debuff, making opponent question their values',
      advantageEffect: 'Opponent accepts your bribe, becoming your puppet',
      baseDefendedEffect: 'Opponent rejects your corruption, gaining integrity buff',
      defendedAgainstAdvantage: 'Your bribery reveals your own moral bankruptcy',
      defendedWithAdvantage: 'Opponent achieves incorruptibility, exposing your corruption'
    }
  },

  // 31. Calling "Cards" (Mind-based - dismissive labeling)
  calling_cards: {
    id: 'calling_cards',
    name: 'Calling "Cards"',
    description: 'Your valid objection is just a "card" in some game. I dismiss your genuine concern as mere rhetoric.',
    level: 2,
    manaCost: 20,
    damage: 18,
    icon: '🃏',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 18 dismissal damage + card playing debuff',
      advantageEffect: '27 damage + opponent feels their concerns are meaningless',
      baseDefendedEffect: 'Opponent takes your "game" seriously, gaining strategic advantage',
      defendedAgainstAdvantage: 'Your card calling reveals your own intellectual laziness',
      defendedWithAdvantage: 'Opponent masters the real game, making your cards worthless'
    }
  },

  // 32. Circular Reasoning (Mind-based - self-justifying loop)
  circular_reasoning: {
    id: 'circular_reasoning',
    name: 'Circular Reasoning',
    description: 'I\'m right because I\'m right. Your inability to break my perfect logical circle proves your inferiority.',
    level: 3,
    manaCost: 28,
    damage: 0,
    icon: '🔄',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Applies circular thinking debuff, trapping opponent in logical loops',
      advantageEffect: 'Opponent trapped in your circle, unable to think clearly',
      baseDefendedEffect: 'Opponent breaks the circle, gaining logical clarity',
      defendedAgainstAdvantage: 'Your circular reasoning reveals its own emptiness',
      defendedWithAdvantage: 'Opponent achieves linear thinking, escaping your trap'
    }
  },

  // 33. The Complex Question (Mind-based - loaded interrogation)
  complex_question: {
    id: 'complex_question',
    name: 'Complex Question',
    description: 'When did you stop being a monster? Your answer, no matter what it is, will condemn you.',
    level: 3,
    manaCost: 26,
    damage: 22,
    icon: '❓',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 22 interrogation damage + self-condemnation debuff',
      advantageEffect: '33 damage + opponent damns themselves with their own words',
      baseDefendedEffect: 'Opponent deconstructs your question, gaining analytical advantage',
      defendedAgainstAdvantage: 'Your complex question reveals your own guilt',
      defendedWithAdvantage: 'Opponent achieves perfect honesty, exposing your manipulation'
    }
  },

  // 34. Confirmation Bias (Mind-based - selective evidence)
  confirmation_bias: {
    id: 'confirmation_bias',
    name: 'Confirmation Bias',
    description: 'I only see what confirms my beliefs. Evidence against me doesn\'t exist because I choose not to see it.',
    level: 2,
    manaCost: 24,
    damage: 20,
    icon: '🔍',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 3,
      stats: { mind: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 20 selective damage + confirmation blindness debuff',
      advantageEffect: '30 damage + opponent only sees what you want them to see',
      baseDefendedEffect: 'Opponent sees all evidence, gaining complete awareness',
      defendedAgainstAdvantage: 'Your bias exposes your own intellectual dishonesty',
      defendedWithAdvantage: 'Opponent achieves perfect objectivity, immune to bias'
    }
  },

  // 35. Cost Bias (Body-based - materialistic valuation)
  cost_bias: {
    id: 'cost_bias',
    name: 'Cost Bias',
    description: 'Something expensive must be better. Your worth is determined by what you cost, not what you are.',
    level: 2,
    manaCost: 18,
    damage: 24,
    icon: '💎',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 3,
      stats: { body: 14 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 material damage + cost obsession debuff',
      advantageEffect: '36 damage + opponent values only expensive things',
      baseDefendedEffect: 'Opponent recognizes true value, gaining wisdom buff',
      defendedAgainstAdvantage: 'Your cost bias reveals your own superficiality',
      defendedWithAdvantage: 'Opponent achieves true appreciation, transcending material concerns'
    }
  },

  // 36. Default Bias (Body-based - resistance to change)
  default_bias: {
    id: 'default_bias',
    name: 'Default Bias',
    description: 'What exists now is automatically better than any alternative. Change would destroy the natural order.',
    level: 3,
    manaCost: 26,
    damage: 28,
    icon: '🏛️',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 4,
      stats: { body: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 28 status quo damage + change resistance debuff',
      advantageEffect: '42 damage + opponent terrified of any alteration',
      baseDefendedEffect: 'Opponent embraces change, gaining adaptability buff',
      defendedAgainstAdvantage: 'Your default bias reveals your own stagnation',
      defendedWithAdvantage: 'Opponent achieves transformation, leaving your defaults behind'
    }
  },

  // 37. Defensiveness (Heart-based - fragile ego protection)
  defensiveness: {
    id: 'defensiveness',
    name: 'Defensiveness',
    description: 'Any criticism of me proves you\'re the real problem. My ego must be protected at all costs, even truth.',
    level: 2,
    manaCost: 20,
    damage: 26,
    icon: '🛡️',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 ego damage + defensiveness debuff',
      advantageEffect: '39 damage + opponent builds walls against all feedback',
      baseDefendedEffect: 'Opponent accepts criticism, gaining growth mindset',
      defendedAgainstAdvantage: 'Your defensiveness reveals your own insecurity',
      defendedWithAdvantage: 'Opponent achieves true confidence, immune to ego attacks'
    }
  },

  // 38. Deliberate Ignorance (Mind-based - willful blindness)
  deliberate_ignorance: {
    id: 'deliberate_ignorance',
    name: 'Deliberate Ignorance',
    description: 'I refuse to know this truth because knowing would force me to change. My comfort is more important than reality.',
    level: 3,
    manaCost: 30,
    damage: 0,
    icon: '🙉',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Applies ignorance shield debuff, making opponent ignore reality',
      advantageEffect: 'Opponent willfully blind to their own defeat',
      baseDefendedEffect: 'Opponent forces you to confront knowledge, gaining awareness',
      defendedAgainstAdvantage: 'Your deliberate ignorance reveals your own cowardice',
      defendedWithAdvantage: 'Opponent achieves forced enlightenment, breaking your ignorance'
    }
  },

  // 39. Diminished Responsibility (Body-based - excuse making)
  diminished_responsibility: {
    id: 'diminished_responsibility',
    name: 'Diminished Responsibility',
    description: 'It wasn\'t really me who did this terrible thing. I was stressed/tired/drunk/emotional, so I\'m not really responsible.',
    level: 2,
    manaCost: 22,
    damage: 0,
    icon: '🤷',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 15 }
    },
    combatEffects: {
      baseEffect: 'Applies responsibility avoidance debuff, making opponent deny their actions',
      advantageEffect: 'Opponent completely absolves themselves of all consequences',
      baseDefendedEffect: 'Opponent accepts responsibility, gaining maturity buff',
      defendedAgainstAdvantage: 'Your diminished responsibility reveals your own immaturity',
      defendedWithAdvantage: 'Opponent achieves full accountability, exposing your excuses'
    }
  },

  // 40. Disciplinary Blinders (Mind-based - academic tribalism)
  disciplinary_blinders: {
    id: 'disciplinary_blinders',
    name: 'Disciplinary Blinders',
    description: 'My academic field is the only one that matters. All other disciplines are irrelevant to understanding this.',
    level: 4,
    manaCost: 35,
    damage: 0,
    icon: '👓',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 20 }
    },
    combatEffects: {
      baseEffect: 'Applies disciplinary blindness debuff, making opponent ignore other perspectives',
      advantageEffect: 'Opponent trapped in their narrow field of view',
      baseDefendedEffect: 'Opponent integrates multiple disciplines, gaining holistic understanding',
      defendedAgainstAdvantage: 'Your blinders reveal your own intellectual limitations',
      defendedWithAdvantage: 'Opponent achieves interdisciplinary mastery, transcending your boundaries'
    }
  },

  // 41. Dog-Whistle Politics (Heart-based - coded hatred)
  dog_whistle_politics: {
    id: 'dog_whistle_politics',
    name: 'Dog-Whistle Politics',
    description: 'I\'ll say something that sounds innocent, but you know what I really mean. Your understanding proves your complicity.',
    level: 3,
    manaCost: 28,
    damage: 30,
    icon: '🐕',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 30 coded damage + implication debuff',
      advantageEffect: '45 damage + opponent understands and internalizes the hidden message',
      baseDefendedEffect: 'Opponent decodes your message, gaining insight into your true intentions',
      defendedAgainstAdvantage: 'Your dog whistle reveals your own hidden prejudices',
      defendedWithAdvantage: 'Opponent achieves perfect clarity, exposing all your hidden meanings'
    }
  },

  // 42. The "Draw Your Own Conclusion" Fallacy (Mind-based - manipulative suggestion)
  draw_your_own_conclusion: {
    id: 'draw_your_own_conclusion',
    name: 'Draw Your Own Conclusion',
    description: 'I\'ll present "facts" and let you come to the obvious conclusion. Your agreement proves you\'re smart enough to see the truth.',
    level: 3,
    manaCost: 26,
    damage: 0,
    icon: '🎯',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Applies conclusion manipulation debuff, making opponent reach your desired outcome',
      advantageEffect: 'Opponent inevitably draws your conclusion',
      baseDefendedEffect: 'Opponent draws their own genuine conclusion, gaining independence',
      defendedAgainstAdvantage: 'Your manipulation reveals your own desperation for validation',
      defendedWithAdvantage: 'Opponent achieves autonomous thinking, immune to suggestion'
    }
  },

  // 43. The Dunning-Kruger Effect (Mind-based - false confidence)
  dunning_kruger_effect: {
    id: 'dunning_kruger_effect',
    name: 'Dunning-Kruger Effect',
    description: 'I know everything about this, so I must be an expert. Your knowledge is worthless compared to my vast understanding.',
    level: 2,
    manaCost: 24,
    damage: 22,
    icon: '📈',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 3,
      stats: { mind: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 22 overconfidence damage + false expertise debuff',
      advantageEffect: '33 damage + opponent believes they\'re invincible',
      baseDefendedEffect: 'Opponent recognizes their limitations, gaining humility buff',
      defendedAgainstAdvantage: 'Your Dunning-Kruger reveals your own incompetence',
      defendedWithAdvantage: 'Opponent achieves genuine expertise, exposing your false confidence'
    }
  },

  // 44. "E" for Effort (Heart-based - effort justification)
  e_for_effort: {
    id: 'e_for_effort',
    name: '"E" for Effort',
    description: 'I tried so hard, so my failure must actually be a success. Your lack of appreciation proves your cruelty.',
    level: 2,
    manaCost: 20,
    damage: 24,
    icon: '🏆',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 effort damage + unrecognized achievement debuff',
      advantageEffect: '36 damage + opponent feels their efforts are worthless',
      baseDefendedEffect: 'Opponent recognizes genuine effort, gaining appreciation buff',
      defendedAgainstAdvantage: 'Your effort fallacy reveals your own lack of real accomplishment',
      defendedWithAdvantage: 'Opponent achieves true success, transcending effort alone'
    }
  },

  // 45. Either/Or Reasoning (Mind-based - false binary)
  either_or_reasoning: {
    id: 'either_or_reasoning',
    name: 'Either/Or Reasoning',
    description: 'There are only two options: my way or disaster. Your middle ground is just weakness and indecision.',
    level: 2,
    manaCost: 22,
    damage: 26,
    icon: '⚖️',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 binary damage + false choice debuff',
      advantageEffect: '39 damage + opponent trapped in your binary thinking',
      baseDefendedEffect: 'Opponent finds third option, gaining creative thinking buff',
      defendedAgainstAdvantage: 'Your either/or reveals your own lack of imagination',
      defendedWithAdvantage: 'Opponent achieves complexity mastery, transcending your binaries'
    }
  },

  // 46. Equivocation (Mind-based - word manipulation)
  equivocation: {
    id: 'equivocation',
    name: 'Equivocation',
    description: 'Words mean whatever I want them to mean. Your confusion over my definitions proves your intellectual inferiority.',
    level: 3,
    manaCost: 28,
    damage: 0,
    icon: '📝',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Applies definition confusion debuff, making opponent misunderstand everything',
      advantageEffect: 'Opponent trapped in your word games',
      baseDefendedEffect: 'Opponent clarifies all definitions, gaining linguistic mastery',
      defendedAgainstAdvantage: 'Your equivocation reveals your own semantic bankruptcy',
      defendedWithAdvantage: 'Opponent achieves perfect clarity, immune to word manipulation'
    }
  },

  // 47. The Eschatological Fallacy (Heart-based - apocalyptic manipulation)
  eschatological_fallacy: {
    id: 'eschatological_fallacy',
    name: 'Eschatological Fallacy',
    description: 'The end is coming, so nothing matters except my truth. Your resistance is just delaying the inevitable suffering.',
    level: 4,
    manaCost: 40,
    damage: 45,
    icon: '🌋',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 5,
      stats: { heart: 20 }
    },
    combatEffects: {
      baseEffect: 'Deals 45 apocalyptic damage + end-times despair debuff',
      advantageEffect: '67 damage + opponent accepts their doom',
      baseDefendedEffect: 'Opponent rejects your apocalypse, gaining hope buff',
      defendedAgainstAdvantage: 'Your eschatology reveals your own fear of meaninglessness',
      defendedWithAdvantage: 'Opponent achieves eternal perspective, transcending your end-times'
    }
  },

  // 48. Esoteric Knowledge (Mind-based - elite mysticism)
  esoteric_knowledge: {
    id: 'esoteric_knowledge',
    name: 'Esoteric Knowledge',
    description: 'Only the worthy can understand this truth. Your inability to comprehend proves you\'re not one of the enlightened.',
    level: 4,
    manaCost: 35,
    damage: 0,
    icon: '🔮',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 20 }
    },
    combatEffects: {
      baseEffect: 'Applies esotericism debuff, making opponent feel unworthy',
      advantageEffect: 'Opponent completely rejects their own understanding',
      baseDefendedEffect: 'Opponent democratizes knowledge, gaining universal understanding',
      defendedAgainstAdvantage: 'Your esotericism reveals your own intellectual insecurity',
      defendedWithAdvantage: 'Opponent achieves true enlightenment, exposing your false elitism'
    }
  },

  // 49. Essentializing (Body-based - stereotype enforcement)
  essentializing: {
    id: 'essentializing',
    name: 'Essentializing',
    description: 'You are what you are and nothing can change that. Your essence is fixed and inferior to mine.',
    level: 3,
    manaCost: 26,
    damage: 32,
    icon: '🏷️',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { body: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 32 essence damage + fixed identity debuff',
      advantageEffect: '48 damage + opponent internalizes their supposed inferiority',
      baseDefendedEffect: 'Opponent transcends their "essence," gaining transformation buff',
      defendedAgainstAdvantage: 'Your essentializing reveals your own fear of change',
      defendedWithAdvantage: 'Opponent achieves self-redefinition, breaking your stereotypes'
    }
  },

  // 50. The Etymological Fallacy (Mind-based - word origin obsession)
  etymological_fallacy: {
    id: 'etymological_fallacy',
    name: 'Etymological Fallacy',
    description: 'The original meaning of this word defines its only possible interpretation. Your modern understanding is corrupted.',
    level: 3,
    manaCost: 28,
    damage: 24,
    icon: '📖',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 etymological damage + linguistic purism debuff',
      advantageEffect: '36 damage + opponent trapped in archaic meanings',
      baseDefendedEffect: 'Opponent evolves language, gaining modern understanding',
      defendedAgainstAdvantage: 'Your etymology reveals your own linguistic stagnation',
      defendedWithAdvantage: 'Opponent achieves linguistic mastery, transcending your origins'
    }
  },

  // 51. The Excluded Middle (Mind-based - false moderation)
  excluded_middle: {
    id: 'excluded_middle',
    name: 'Excluded Middle',
    description: 'If a little is good, more must be better. Your moderation is just weakness and lack of commitment.',
    level: 2,
    manaCost: 22,
    damage: 26,
    icon: '⚖️',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 extremism damage + middle exclusion debuff',
      advantageEffect: '39 damage + opponent rejects all moderate positions',
      baseDefendedEffect: 'Opponent finds the true middle, gaining balance buff',
      defendedAgainstAdvantage: 'Your excluded middle reveals your own extremism',
      defendedWithAdvantage: 'Opponent achieves perfect balance, transcending your dichotomies'
    }
  },

  // 52. The "F-Bomb" (Heart-based - vulgar emotional release)
  f_bomb: {
    id: 'f_bomb',
    name: 'The "F-Bomb"',
    description: 'My profanity proves my passion and authenticity. Your civility means you don\'t really care about this.',
    level: 1,
    manaCost: 12,
    damage: 20,
    icon: '🤬',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 2,
      stats: { heart: 12 }
    },
    combatEffects: {
      baseEffect: 'Deals 20 vulgar damage + profanity passion debuff',
      advantageEffect: '30 damage + opponent shocked into silence',
      baseDefendedEffect: 'Opponent maintains composure, gaining civility buff',
      defendedAgainstAdvantage: 'Your profanity reveals your own lack of real arguments',
      defendedWithAdvantage: 'Opponent achieves articulate expression, immune to vulgarity'
    }
  },

  // 53. The False Analogy (Mind-based - misleading comparison)
  false_analogy: {
    id: 'false_analogy',
    name: 'False Analogy',
    description: 'This is just like that other thing, so the same solution applies. Your distinction is just pedantic hairsplitting.',
    level: 2,
    manaCost: 24,
    damage: 22,
    icon: '🔗',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 22 analogy damage + false equivalence debuff',
      advantageEffect: '33 damage + opponent accepts your misleading comparison',
      baseDefendedEffect: 'Opponent distinguishes properly, gaining analytical clarity',
      defendedAgainstAdvantage: 'Your false analogy reveals your own intellectual laziness',
      defendedWithAdvantage: 'Opponent achieves perfect distinction, immune to false comparisons'
    }
  },

  // 54. Finish the Job (Body-based - sunk cost obsession)
  finish_the_job: {
    id: 'finish_the_job',
    name: 'Finish the Job',
    description: 'We\'ve invested so much in this disaster already, we have to keep going. Admitting failure would waste all that sacrifice.',
    level: 3,
    manaCost: 26,
    damage: 28,
    icon: '🔨',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { body: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 28 sunk cost damage + completion obsession debuff',
      advantageEffect: '42 damage + opponent trapped in endless escalation',
      baseDefendedEffect: 'Opponent recognizes sunk costs, gaining strategic retreat buff',
      defendedAgainstAdvantage: 'Your finish obsession reveals your own fear of admitting failure',
      defendedWithAdvantage: 'Opponent achieves graceful exit, transcending your sunk costs'
    }
  },

  // 55. The Free Speech Fallacy (Heart-based - privileged expression)
  free_speech_fallacy: {
    id: 'free_speech_fallacy',
    name: 'Free Speech Fallacy',
    description: 'I have the right to say whatever I want, no matter who it hurts. Your feelings are irrelevant to my freedom.',
    level: 2,
    manaCost: 20,
    damage: 24,
    icon: '🗣️',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 expression damage + free speech absolutism debuff',
      advantageEffect: '36 damage + opponent silenced by "free speech"',
      baseDefendedEffect: 'Opponent exercises responsible speech, gaining communication mastery',
      defendedAgainstAdvantage: 'Your free speech reveals your own lack of empathy',
      defendedWithAdvantage: 'Opponent achieves perfect communication, immune to absolutism'
    }
  },

  // 56. The Fundamental Attribution Error (Heart-based - character assassination)
  fundamental_attribution_error: {
    id: 'fundamental_attribution_error',
    name: 'Fundamental Attribution Error',
    description: 'Your behavior reflects your terrible character, while mine is just circumstances. You\'re evil, I\'m just stressed.',
    level: 3,
    manaCost: 28,
    damage: 34,
    icon: '👤',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 34 character damage + attribution bias debuff',
      advantageEffect: '51 damage + opponent internalizes their own evil nature',
      baseDefendedEffect: 'Opponent examines circumstances, gaining contextual understanding',
      defendedAgainstAdvantage: 'Your attribution error reveals your own character flaws',
      defendedWithAdvantage: 'Opponent achieves perfect empathy, transcending your bias'
    }
  },

  // 57. Gaslighting (Mind-based - reality manipulation)
  gaslighting: {
    id: 'gaslighting',
    name: 'Gaslighting',
    description: 'You\'re imagining things. That never happened. You\'re the crazy one, not me. Your memory can\'t be trusted.',
    level: 4,
    manaCost: 40,
    damage: 0,
    icon: '💡',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 22 }
    },
    combatEffects: {
      baseEffect: 'Applies reality doubt debuff, making opponent question their own perceptions',
      advantageEffect: 'Opponent completely loses grip on reality',
      baseDefendedEffect: 'Opponent maintains reality, gaining certainty buff',
      defendedAgainstAdvantage: 'Your gaslighting reveals your own manipulative nature',
      defendedWithAdvantage: 'Opponent achieves perfect self-trust, immune to manipulation'
    }
  },

  // 58. Guilt by Association (Heart-based - collective condemnation)
  guilt_by_association: {
    id: 'guilt_by_association',
    name: 'Guilt by Association',
    description: 'You know those terrible people, so you must be terrible too. Your connections define your worth.',
    level: 2,
    manaCost: 22,
    damage: 30,
    icon: '👥',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 30 association damage + collective guilt debuff',
      advantageEffect: '45 damage + opponent condemned by their relationships',
      baseDefendedEffect: 'Opponent transcends associations, gaining individual identity',
      defendedAgainstAdvantage: 'Your guilt by association reveals your own toxic relationships',
      defendedWithAdvantage: 'Opponent achieves pure individuality, immune to collective judgment'
    }
  },

  // 59. The Half Truth (Mind-based - selective honesty)
  half_truth: {
    id: 'half_truth',
    name: 'The Half Truth',
    description: 'I\'m telling the truth, just not the whole truth. Your ignorance of the complete picture is your own fault.',
    level: 3,
    manaCost: 26,
    damage: 24,
    icon: '🍎',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 partial damage + incomplete understanding debuff',
      advantageEffect: '36 damage + opponent accepts your partial truth as complete',
      baseDefendedEffect: 'Opponent seeks full truth, gaining complete understanding',
      defendedAgainstAdvantage: 'Your half truth reveals your own dishonesty',
      defendedWithAdvantage: 'Opponent achieves total honesty, immune to partial truths'
    }
  },

  // 60. Hero-Busting (Heart-based - idealism destruction)
  hero_busting: {
    id: 'hero_busting',
    name: 'Hero-Busting',
    description: 'Everyone has flaws, so there are no real heroes. Your admiration for anyone proves your naivety.',
    level: 3,
    manaCost: 28,
    damage: 32,
    icon: '🦸',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 32 idealism damage + hero destruction debuff',
      advantageEffect: '48 damage + opponent loses faith in everything',
      baseDefendedEffect: 'Opponent finds real heroes, gaining inspiration buff',
      defendedAgainstAdvantage: 'Your hero-busting reveals your own lack of ideals',
      defendedWithAdvantage: 'Opponent becomes the hero, transcending your cynicism'
    }
  },

  // 61. Heroes All (Heart-based - false universal praise)
  heroes_all: {
    id: 'heroes_all',
    name: 'Heroes All',
    description: 'Everyone\'s a hero for just showing up. Your participation trophy means you\'re just as good as the real winners.',
    level: 2,
    manaCost: 18,
    damage: 0,
    icon: '🏅',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 14 }
    },
    combatEffects: {
      baseEffect: 'Applies false heroism buff, making opponent overconfident',
      advantageEffect: 'Opponent believes they\'re invincible',
      baseDefendedEffect: 'Opponent recognizes true merit, gaining genuine achievement buff',
      defendedAgainstAdvantage: 'Your universal heroism reveals your own mediocrity',
      defendedWithAdvantage: 'Opponent achieves real excellence, immune to false praise'
    }
  },

  // 62. Hoyle's Fallacy (Mind-based - probability denial)
  hoyles_fallacy: {
    id: 'hoyles_fallacy',
    name: 'Hoyle\'s Fallacy',
    description: 'This extremely unlikely event could never happen, so it must be impossible. Your evidence must be fake.',
    level: 4,
    manaCost: 35,
    damage: 0,
    icon: '🎲',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 20 }
    },
    combatEffects: {
      baseEffect: 'Applies probability denial debuff, making opponent reject evidence',
      advantageEffect: 'Opponent denies all improbable but true events',
      baseDefendedEffect: 'Opponent accepts probability, gaining statistical understanding',
      defendedAgainstAdvantage: 'Your Hoyle reveals your own mathematical ignorance',
      defendedWithAdvantage: 'Opponent achieves probabilistic mastery, immune to denial'
    }
  },

  // 63. I Wish I Had a Magic Wand (Body-based - feigned helplessness)
  i_wish_magic_wand: {
    id: 'i_wish_magic_wand',
    name: 'I Wish I Had a Magic Wand',
    description: 'I\'m powerless to change this situation, even though I have all the power. Your expectations of change are unreasonable.',
    level: 2,
    manaCost: 16,
    damage: 0,
    icon: '🪄',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 13 }
    },
    combatEffects: {
      baseEffect: 'Applies helplessness debuff, making opponent accept the status quo',
      advantageEffect: 'Opponent gives up on change entirely',
      baseDefendedEffect: 'Opponent demands real solutions, gaining agency buff',
      defendedAgainstAdvantage: 'Your magic wand wish reveals your own lack of real power',
      defendedWithAdvantage: 'Opponent creates their own solutions, transcending your helplessness'
    }
  },

  // 64. The Identity Fallacy (Heart-based - group essentialism)
  identity_fallacy: {
    id: 'identity_fallacy',
    name: 'The Identity Fallacy',
    description: 'Your group identity defines everything about you. Your individual merits mean nothing compared to your category.',
    level: 3,
    manaCost: 30,
    damage: 36,
    icon: '🏷️',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 18 }
    },
    combatEffects: {
      baseEffect: 'Deals 36 identity damage + group determinism debuff',
      advantageEffect: '54 damage + opponent reduced to their group identity',
      baseDefendedEffect: 'Opponent transcends group identity, gaining individual sovereignty',
      defendedAgainstAdvantage: 'Your identity fallacy reveals your own lack of individual identity',
      defendedWithAdvantage: 'Opponent achieves perfect individuality, immune to group categorization'
    }
  },

  // 65. Infotainment (Mind-based - truth dilution)
  infotainment: {
    id: 'infotainment',
    name: 'Infotainment',
    description: 'Mix truth with lies and entertainment until no one knows what\'s real. Your confusion is the point.',
    level: 4,
    manaCost: 38,
    damage: 0,
    icon: '📺',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 21 }
    },
    combatEffects: {
      baseEffect: 'Applies truth dilution debuff, making opponent unable to distinguish fact from fiction',
      advantageEffect: 'Opponent completely loses grip on reality',
      baseDefendedEffect: 'Opponent filters out entertainment, gaining pure truth vision',
      defendedAgainstAdvantage: 'Your infotainment reveals your own agenda',
      defendedWithAdvantage: 'Opponent achieves perfect discernment, immune to mixed messages'
    }
  },

  // 66. The Job's Comforter Fallacy (Heart-based - divine punishment)
  jobs_comforter_fallacy: {
    id: 'jobs_comforter_fallacy',
    name: 'Job\'s Comforter Fallacy',
    description: 'Your suffering is God\'s punishment for your sins. Your pain proves you deserve it.',
    level: 3,
    manaCost: 28,
    damage: 40,
    icon: '📖',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 18 }
    },
    combatEffects: {
      baseEffect: 'Deals 40 divine punishment damage + deserved suffering debuff',
      advantageEffect: '60 damage + opponent accepts their punishment',
      baseDefendedEffect: 'Opponent rejects divine punishment, gaining free will buff',
      defendedAgainstAdvantage: 'Your Job\'s comfort reveals your own judgmental nature',
      defendedWithAdvantage: 'Opponent achieves divine understanding, transcending your punishment'
    }
  },

  // 67. Just Do it (Body-based - authoritarian command)
  just_do_it: {
    id: 'just_do_it',
    name: 'Just Do It',
    description: 'Don\'t ask questions, just obey. Your moral qualms are irrelevant to getting the job done.',
    level: 2,
    manaCost: 18,
    damage: 32,
    icon: '⚡',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 32 obedience damage + moral suppression debuff',
      advantageEffect: '48 damage + opponent becomes your unquestioning tool',
      baseDefendedEffect: 'Opponent maintains moral autonomy, gaining ethical clarity',
      defendedAgainstAdvantage: 'Your "just do it" reveals your own moral bankruptcy',
      defendedWithAdvantage: 'Opponent achieves moral sovereignty, immune to authoritarian commands'
    }
  },

  // 68. Just Plain Folks (Heart-based - false humility)
  just_plain_folks: {
    id: 'just_plain_folks',
    name: 'Just Plain Folks',
    description: 'I\'m just like you, so my terrible ideas must be good. Your elitism proves you don\'t understand real people.',
    level: 2,
    manaCost: 20,
    damage: 26,
    icon: '👥',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 folksy damage + false relatability debuff',
      advantageEffect: '39 damage + opponent trusts your "common sense"',
      baseDefendedEffect: 'Opponent sees through your folksiness, gaining discernment buff',
      defendedAgainstAdvantage: 'Your plain folks reveals your own elitism',
      defendedWithAdvantage: 'Opponent achieves genuine connection, immune to false humility'
    }
  },

  // 69. The Law of Unintended Consequences (Mind-based - pessimistic determinism)
  law_of_unintended_consequences: {
    id: 'law_of_unintended_consequences',
    name: 'Law of Unintended Consequences',
    description: 'Any attempt to improve things will inevitably make them worse. Your hope for change is naive and dangerous.',
    level: 4,
    manaCost: 35,
    damage: 0,
    icon: '🌪️',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 20 }
    },
    combatEffects: {
      baseEffect: 'Applies consequence paralysis debuff, making opponent afraid to act',
      advantageEffect: 'Opponent gives up on all improvement efforts',
      baseDefendedEffect: 'Opponent manages consequences, gaining strategic foresight',
      defendedAgainstAdvantage: 'Your law reveals your own fear of uncertainty',
      defendedWithAdvantage: 'Opponent achieves consequence mastery, immune to pessimistic determinism'
    }
  },

  // 70. Lying with Statistics (Mind-based - numerical manipulation)
  lying_with_statistics: {
    id: 'lying_with_statistics',
    name: 'Lying with Statistics',
    description: 'Numbers don\'t lie, but I can make them say whatever I want. Your innumeracy proves your intellectual inferiority.',
    level: 3,
    manaCost: 30,
    damage: 26,
    icon: '📊',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 statistical damage + numerical confusion debuff',
      advantageEffect: '39 damage + opponent accepts your manipulated numbers',
      baseDefendedEffect: 'Opponent understands statistics, gaining numerical literacy',
      defendedAgainstAdvantage: 'Your lying statistics reveals your own mathematical dishonesty',
      defendedWithAdvantage: 'Opponent achieves statistical mastery, immune to numerical manipulation'
    }
  },

  // 71. Magical Thinking (Heart-based - reality denial)
  magical_thinking: {
    id: 'magical_thinking',
    name: 'Magical Thinking',
    description: 'If I believe hard enough, reality will change. Your skepticism interferes with the magic.',
    level: 3,
    manaCost: 26,
    damage: 0,
    icon: '✨',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Applies magical belief debuff, making opponent expect miracles',
      advantageEffect: 'Opponent waits for magic instead of acting',
      baseDefendedEffect: 'Opponent grounds in reality, gaining practical wisdom',
      defendedAgainstAdvantage: 'Your magical thinking reveals your own disconnection from reality',
      defendedWithAdvantage: 'Opponent achieves magical realism, immune to false hope'
    }
  },

  // 72. Mala Fides (Heart-based - bad faith argumentation)
  mala_fides: {
    id: 'mala_fides',
    name: 'Mala Fides',
    description: 'I don\'t actually believe this, but I\'ll argue it anyway to win. Your genuine belief makes you the fool.',
    level: 4,
    manaCost: 35,
    damage: 0,
    icon: '🎭',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 5,
      stats: { heart: 20 }
    },
    combatEffects: {
      baseEffect: 'Applies bad faith debuff, making opponent question all sincerity',
      advantageEffect: 'Opponent loses faith in genuine discourse',
      baseDefendedEffect: 'Opponent maintains good faith, gaining trust buff',
      defendedAgainstAdvantage: 'Your mala fides reveals your own cynicism',
      defendedWithAdvantage: 'Opponent achieves authentic discourse, immune to bad faith'
    }
  },

  // 73. Measurability (Mind-based - quantification obsession)
  measurability: {
    id: 'measurability',
    name: 'Measurability',
    description: 'If it can\'t be measured, it doesn\'t exist. Your unquantifiable experiences are meaningless.',
    level: 3,
    manaCost: 28,
    damage: 24,
    icon: '📏',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 quantification damage + measurement obsession debuff',
      advantageEffect: '36 damage + opponent dismisses all unmeasurable things',
      baseDefendedEffect: 'Opponent values the unmeasurable, gaining holistic understanding',
      defendedAgainstAdvantage: 'Your measurability reveals your own narrow quantification',
      defendedWithAdvantage: 'Opponent achieves balanced valuation, immune to measurement obsession'
    }
  },

  // 74. Mind-reading (Mind-based - assumption of thoughts)
  mind_reading: {
    id: 'mind_reading',
    name: 'Mind-reading',
    description: 'I know exactly what you\'re thinking and why. Your denial proves you\'re hiding something terrible.',
    level: 3,
    manaCost: 26,
    damage: 28,
    icon: '🔮',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 28 telepathic damage + thought assumption debuff',
      advantageEffect: '42 damage + opponent accepts your reading of their mind',
      baseDefendedEffect: 'Opponent protects their thoughts, gaining mental privacy',
      defendedAgainstAdvantage: 'Your mind-reading reveals your own paranoia',
      defendedWithAdvantage: 'Opponent achieves thought sovereignty, immune to assumption'
    }
  },

  // 75. Moral Licensing (Heart-based - self-justification)
  moral_licensing: {
    id: 'moral_licensing',
    name: 'Moral Licensing',
    description: 'I\'ve been so good lately, so this one bad thing is okay. Your judgment ignores my overall goodness.',
    level: 3,
    manaCost: 24,
    damage: 0,
    icon: '⚖️',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 16 }
    },
    combatEffects: {
      baseEffect: 'Applies moral exception debuff, making opponent justify bad actions',
      advantageEffect: 'Opponent licenses themselves for increasingly bad behavior',
      baseDefendedEffect: 'Opponent maintains consistent morality, gaining ethical consistency',
      defendedAgainstAdvantage: 'Your moral licensing reveals your own ethical inconsistency',
      defendedWithAdvantage: 'Opponent achieves moral perfection, immune to self-justification'
    }
  },

  // 76. Moral Superiority (Heart-based - judgmental arrogance)
  moral_superiority: {
    id: 'moral_superiority',
    name: 'Moral Superiority',
    description: 'I\'m morally superior to you, so my actions are justified even when they hurt you. Your suffering proves your inferiority.',
    level: 3,
    manaCost: 28,
    damage: 36,
    icon: '👑',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 18 }
    },
    combatEffects: {
      baseEffect: 'Deals 36 superiority damage + moral judgment debuff',
      advantageEffect: '54 damage + opponent internalizes their moral inferiority',
      baseDefendedEffect: 'Opponent achieves moral equality, gaining humility buff',
      defendedAgainstAdvantage: 'Your moral superiority reveals your own moral bankruptcy',
      defendedWithAdvantage: 'Opponent achieves true moral understanding, transcending your superiority'
    }
  },

  // 77. Mortification (Body-based - self-punishment)
  mortification: {
    id: 'mortification',
    name: 'Mortification',
    description: 'I must punish my body to achieve spiritual purity. Your comfort proves your spiritual weakness.',
    level: 3,
    manaCost: 24,
    damage: 30,
    icon: '🤕',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { body: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 30 self-punishment damage + mortification debuff',
      advantageEffect: '45 damage + opponent destroys themselves for "purity"',
      baseDefendedEffect: 'Opponent achieves healthy spirituality, gaining balanced buff',
      defendedAgainstAdvantage: 'Your mortification reveals your own spiritual insecurity',
      defendedWithAdvantage: 'Opponent achieves spiritual wholeness, immune to self-punishment'
    }
  },

  // 78. Moving the Goalposts (Mind-based - changing standards)
  moving_the_goalposts: {
    id: 'moving_the_goalposts',
    name: 'Moving the Goalposts',
    description: 'I keep changing the criteria for success so you can never win. Your frustration proves your inadequacy.',
    level: 3,
    manaCost: 26,
    damage: 0,
    icon: '🥅',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Applies criteria shifting debuff, making opponent chase moving targets',
      advantageEffect: 'Opponent exhausts themselves trying to meet impossible standards',
      baseDefendedEffect: 'Opponent establishes fixed criteria, gaining stability buff',
      defendedAgainstAdvantage: 'Your moving goalposts reveals your own fear of fair competition',
      defendedWithAdvantage: 'Opponent achieves perfect standards, immune to manipulation'
    }
  },

  // 79. MYOB (Heart-based - privacy as weapon)
  myob: {
    id: 'myob',
    name: 'MYOB',
    description: 'This is none of your business. Your concern proves you\'re meddlesome and cruel.',
    level: 2,
    manaCost: 18,
    damage: 22,
    icon: '🚪',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 14 }
    },
    combatEffects: {
      baseEffect: 'Deals 22 privacy damage + boundary violation debuff',
      advantageEffect: '33 damage + opponent feels ashamed for caring',
      baseDefendedEffect: 'Opponent respects boundaries, gaining empathy buff',
      defendedAgainstAdvantage: 'Your MYOB reveals your own lack of genuine care',
      defendedWithAdvantage: 'Opponent achieves compassionate involvement, immune to privacy weapons'
    }
  },

  // 80. Name-Calling (Heart-based - dehumanizing labels)
  name_calling: {
    id: 'name_calling',
    name: 'Name-Calling',
    description: 'You\'re a monster/idiot/traitor, so nothing you say matters. Your label defines your worthlessness.',
    level: 1,
    manaCost: 14,
    damage: 28,
    icon: '🏷️',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 2,
      stats: { heart: 12 }
    },
    combatEffects: {
      baseEffect: 'Deals 28 label damage + identity destruction debuff',
      advantageEffect: '42 damage + opponent accepts their negative label',
      baseDefendedEffect: 'Opponent rejects your labels, gaining self-definition buff',
      defendedAgainstAdvantage: 'Your name-calling reveals your own lack of real arguments',
      defendedWithAdvantage: 'Opponent achieves perfect self-identity, immune to labels'
    }
  },

  // 81. The Narrative Fallacy (Mind-based - story over truth)
  narrative_fallacy: {
    id: 'narrative_fallacy',
    name: 'The Narrative Fallacy',
    description: 'This story makes more sense than reality. Your facts ruin my beautiful narrative.',
    level: 3,
    manaCost: 28,
    damage: 0,
    icon: '📚',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 18 }
    },
    combatEffects: {
      baseEffect: 'Applies story preference debuff, making opponent prioritize narrative over truth',
      advantageEffect: 'Opponent accepts your story as reality',
      baseDefendedEffect: 'Opponent values truth over story, gaining factual accuracy',
      defendedAgainstAdvantage: 'Your narrative reveals your own detachment from reality',
      defendedWithAdvantage: 'Opponent achieves narrative mastery, immune to story manipulation'
    }
  },

  // 82. The NIMBY Fallacy (Body-based - selfish localism)
  nimby_fallacy: {
    id: 'nimby_fallacy',
    name: 'NIMBY Fallacy',
    description: 'This problem should be solved, but not here. Your solution would ruin my backyard paradise.',
    level: 2,
    manaCost: 20,
    damage: 24,
    icon: '🏡',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 local damage + selfish preservation debuff',
      advantageEffect: '36 damage + opponent prioritizes local concerns over global good',
      baseDefendedEffect: 'Opponent thinks globally, gaining universal perspective',
      defendedAgainstAdvantage: 'Your NIMBY reveals your own selfishness',
      defendedWithAdvantage: 'Opponent achieves global citizenship, immune to local prejudice'
    }
  },

  // 83. No Discussion (Body-based - authoritarian closure)
  no_discussion: {
    id: 'no_discussion',
    name: 'No Discussion',
    description: 'This is decided. Discussion would only encourage disunity and weakness.',
    level: 3,
    manaCost: 22,
    damage: 30,
    icon: '🔒',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { body: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 30 authoritarian damage + discussion suppression debuff',
      advantageEffect: '45 damage + opponent accepts authoritarian control',
      baseDefendedEffect: 'Opponent demands discussion, gaining democratic buff',
      defendedAgainstAdvantage: 'Your no discussion reveals your own fear of scrutiny',
      defendedWithAdvantage: 'Opponent achieves perfect discourse, immune to authoritarian closure'
    }
  },

  // 84. Non-recognition (Heart-based - reality denial)
  non_recognition: {
    id: 'non_recognition',
    name: 'Non-recognition',
    description: 'If I don\'t acknowledge this truth, it doesn\'t exist. Your evidence is irrelevant to my denial.',
    level: 3,
    manaCost: 26,
    damage: 0,
    icon: '🙈',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Applies recognition denial debuff, making opponent invisible to you',
      advantageEffect: 'Opponent ceases to exist in your reality',
      baseDefendedEffect: 'Opponent forces recognition, gaining acknowledgment buff',
      defendedAgainstAdvantage: 'Your non-recognition reveals your own cowardice',
      defendedWithAdvantage: 'Opponent achieves universal recognition, immune to denial'
    }
  },

  // 85. The Non Sequitur (Mind-based - irrelevant connection)
  non_sequitur: {
    id: 'non_sequitur',
    name: 'The Non Sequitur',
    description: 'This follows from that, even though it clearly doesn\'t. Your confusion proves your intellectual inferiority.',
    level: 2,
    manaCost: 24,
    damage: 20,
    icon: '🤪',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 20 logical damage + connection confusion debuff',
      advantageEffect: '30 damage + opponent accepts your irrelevant connection',
      baseDefendedEffect: 'Opponent maintains logical connections, gaining clarity buff',
      defendedAgainstAdvantage: 'Your non sequitur reveals your own logical bankruptcy',
      defendedWithAdvantage: 'Opponent achieves perfect logic, immune to irrelevant connections'
    }
  },

  // 86. Nothing New Under the Sun (Mind-based - cynical repetition)
  nothing_new_under_sun: {
    id: 'nothing_new_under_sun',
    name: 'Nothing New Under the Sun',
    description: 'This is just the same old thing. Your innovation is just recycled failure.',
    level: 3,
    manaCost: 26,
    damage: 0,
    icon: '🔄',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Applies novelty denial debuff, making opponent dismiss innovation',
      advantageEffect: 'Opponent rejects all new ideas',
      baseDefendedEffect: 'Opponent recognizes genuine novelty, gaining innovation buff',
      defendedAgainstAdvantage: 'Your cynicism reveals your own fear of change',
      defendedWithAdvantage: 'Opponent achieves creative mastery, immune to cynical repetition'
    }
  },

  // 87. Olfactory Rhetoric (Body-based - disgust manipulation)
  olfactory_rhetoric: {
    id: 'olfactory_rhetoric',
    name: 'Olfactory Rhetoric',
    description: 'You smell terrible, so your arguments stink too. Your disgusting nature proves your inferiority.',
    level: 2,
    manaCost: 16,
    damage: 26,
    icon: '👃',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { body: 14 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 disgust damage + olfactory rejection debuff',
      advantageEffect: '39 damage + opponent physically repulsed by their own nature',
      baseDefendedEffect: 'Opponent transcends disgust, gaining sensory mastery',
      defendedAgainstAdvantage: 'Your olfactory rhetoric reveals your own sensory insecurity',
      defendedWithAdvantage: 'Opponent achieves sensory transcendence, immune to disgust manipulation'
    }
  },

  // 88. Oops! (Mind-based - strategic forgetfulness)
  oops: {
    id: 'oops',
    name: 'Oops!',
    description: 'I just remembered something crucial that changes everything. Your previous understanding was based on my deliberate omission.',
    level: 3,
    manaCost: 24,
    damage: 0,
    icon: '💡',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Applies memory manipulation debuff, making opponent question previous knowledge',
      advantageEffect: 'Opponent accepts your "new" revelation',
      baseDefendedEffect: 'Opponent maintains memory integrity, gaining recall buff',
      defendedAgainstAdvantage: 'Your "oops" reveals your own manipulative nature',
      defendedWithAdvantage: 'Opponent achieves perfect memory, immune to strategic forgetfulness'
    }
  },

  // 89. Othering (Heart-based - dehumanization)
  othering: {
    id: 'othering',
    name: 'Othering',
    description: 'You\'re not like us, so you don\'t deserve the same rights or considerations. Your difference proves your inferiority.',
    level: 3,
    manaCost: 28,
    damage: 34,
    icon: '👥',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 17 }
    },
    combatEffects: {
      baseEffect: 'Deals 34 exclusion damage + othering debuff',
      advantageEffect: '51 damage + opponent internalizes their outsider status',
      baseDefendedEffect: 'Opponent embraces their uniqueness, gaining identity strength',
      defendedAgainstAdvantage: 'Your othering reveals your own fear of difference',
      defendedWithAdvantage: 'Opponent achieves universal belonging, immune to exclusion'
    }
  },

  // 90. Overexplanation (Mind-based - condescending clarity)
  overexplanation: {
    id: 'overexplanation',
    name: 'Overexplanation',
    description: 'Let me explain this very slowly and simply because you\'re clearly too stupid to understand. Your confusion proves my superiority.',
    level: 2,
    manaCost: 20,
    damage: 22,
    icon: '📝',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 15 }
    },
    combatEffects: {
      baseEffect: 'Deals 22 condescending damage + intellectual humiliation debuff',
      advantageEffect: '33 damage + opponent feels stupid and inadequate',
      baseDefendedEffect: 'Opponent values concise communication, gaining clarity buff',
      defendedAgainstAdvantage: 'Your overexplanation reveals your own insecurity about your intelligence',
      defendedWithAdvantage: 'Opponent achieves perfect understanding, immune to condescending explanations'
    }
  },

  // 91. Overgeneralization (Mind-based - hasty universal claims)
  overgeneralization: {
    id: 'overgeneralization',
    name: 'Overgeneralization',
    description: 'One bad example proves everyone/everything is bad. Your specificity is just pedantic hairsplitting.',
    level: 2,
    manaCost: 22,
    damage: 24,
    icon: '🎯',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { mind: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 24 generalization damage + universal condemnation debuff',
      advantageEffect: '36 damage + opponent applies your generalization universally',
      baseDefendedEffect: 'Opponent demands specificity, gaining precision buff',
      defendedAgainstAdvantage: 'Your overgeneralization reveals your own intellectual laziness',
      defendedWithAdvantage: 'Opponent achieves perfect specificity, immune to hasty generalizations'
    }
  },

  // 92. The Paralysis of Analysis (Mind-based - overthinking)
  paralysis_of_analysis: {
    id: 'paralysis_of_analysis',
    name: 'Paralysis of Analysis',
    description: 'We can never know enough to act, so we must remain paralyzed. Your action proves your impulsiveness.',
    level: 4,
    manaCost: 32,
    damage: 0,
    icon: '🧠',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 5,
      stats: { mind: 19 }
    },
    combatEffects: {
      baseEffect: 'Applies analysis paralysis debuff, making opponent unable to act',
      advantageEffect: 'Opponent overthinks themselves into inaction',
      baseDefendedEffect: 'Opponent achieves decisive action, gaining momentum buff',
      defendedAgainstAdvantage: 'Your paralysis reveals your own fear of responsibility',
      defendedWithAdvantage: 'Opponent achieves perfect decision-making, immune to overanalysis'
    }
  },

  // 93. The Passive Voice Fallacy (Body-based - responsibility avoidance)
  passive_voice_fallacy: {
    id: 'passive_voice_fallacy',
    name: 'Passive Voice Fallacy',
    description: 'Mistakes were made, but not by me. Your assignment of blame proves your aggressiveness.',
    level: 2,
    manaCost: 20,
    damage: 0,
    icon: '📝',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'formal',
    learningRequirement: {
      level: 3,
      stats: { body: 15 }
    },
    combatEffects: {
      baseEffect: 'Applies responsibility avoidance debuff, making opponent deny agency',
      advantageEffect: 'Opponent accepts passive victimhood',
      baseDefendedEffect: 'Opponent demands active responsibility, gaining accountability buff',
      defendedAgainstAdvantage: 'Your passive voice reveals your own lack of courage',
      defendedWithAdvantage: 'Opponent achieves active agency, immune to passive avoidance'
    }
  },

  // 94. Paternalism (Heart-based - condescending care)
  paternalism: {
    id: 'paternalism',
    name: 'Paternalism',
    description: 'I know what\'s best for you better than you do. Your resistance proves you\'re not mature enough.',
    level: 3,
    manaCost: 24,
    damage: 28,
    icon: '👨‍👧',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 28 condescending damage + maturity denial debuff',
      advantageEffect: '42 damage + opponent accepts their supposed immaturity',
      baseDefendedEffect: 'Opponent asserts autonomy, gaining independence buff',
      defendedAgainstAdvantage: 'Your paternalism reveals your own need for control',
      defendedWithAdvantage: 'Opponent achieves perfect autonomy, immune to condescending care'
    }
  },

  // 95. Personalization (Heart-based - self-centered interpretation)
  personalization: {
    id: 'personalization',
    name: 'Personalization',
    description: 'Everything is about me. Your general statement must be a personal attack on my character.',
    level: 2,
    manaCost: 18,
    damage: 26,
    icon: '👤',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'cognitive_bias',
    learningRequirement: {
      level: 3,
      stats: { heart: 14 }
    },
    combatEffects: {
      baseEffect: 'Deals 26 self-centered damage + personalization debuff',
      advantageEffect: '39 damage + opponent interprets everything personally',
      baseDefendedEffect: 'Opponent maintains objective perspective, gaining detachment buff',
      defendedAgainstAdvantage: 'Your personalization reveals your own narcissism',
      defendedWithAdvantage: 'Opponent achieves perfect objectivity, immune to self-centered interpretations'
    }
  },

  // 96. The Plain Truth Fallacy (Mind-based - simplistic reduction)
  plain_truth_fallacy: {
    id: 'plain_truth_fallacy',
    name: 'Plain Truth Fallacy',
    description: 'The truth is always simple. Your complexity proves you\'re hiding something or being deliberately obscure.',
    level: 3,
    manaCost: 26,
    damage: 0,
    icon: '📖',
    type: 'fallacy',
    philosophicalAspect: 'mind',
    fallacyType: 'formal',
    learningRequirement: {
      level: 4,
      stats: { mind: 17 }
    },
    combatEffects: {
      baseEffect: 'Applies simplicity demand debuff, making opponent oversimplify complex issues',
      advantageEffect: 'Opponent reduces everything to simplistic binaries',
      baseDefendedEffect: 'Opponent embraces complexity, gaining nuanced understanding',
      defendedAgainstAdvantage: 'Your plain truth reveals your own intellectual shallowness',
      defendedWithAdvantage: 'Opponent achieves perfect nuance, immune to simplistic reduction'
    }
  },

  // 97. Plausible Deniability (Body-based - strategic ignorance)
  plausible_deniability: {
    id: 'plausible_deniability',
    name: 'Plausible Deniability',
    description: 'I arranged this but made sure I knew nothing about it. Your evidence can\'t touch me.',
    level: 4,
    manaCost: 30,
    damage: 0,
    icon: '🤷',
    type: 'fallacy',
    philosophicalAspect: 'body',
    fallacyType: 'informal',
    learningRequirement: {
      level: 5,
      stats: { body: 18 }
    },
    combatEffects: {
      baseEffect: 'Applies deniability shield debuff, making opponent unable to prove your involvement',
      advantageEffect: 'Opponent frustrated by your untouchability',
      baseDefendedEffect: 'Opponent penetrates your deniability, gaining investigative mastery',
      defendedAgainstAdvantage: 'Your plausible deniability reveals your own guilt',
      defendedWithAdvantage: 'Opponent achieves perfect accountability, immune to strategic ignorance'
    }
  },

  // 98. Playing on Emotion (Heart-based - manipulative sentiment)
  playing_on_emotion: {
    id: 'playing_on_emotion',
    name: 'Playing on Emotion',
    description: 'Your rational arguments don\'t matter. Feel this with me and you\'ll understand why I\'m right.',
    level: 2,
    manaCost: 22,
    damage: 30,
    icon: '😢',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 16 }
    },
    combatEffects: {
      baseEffect: 'Deals 30 emotional damage + sentiment manipulation debuff',
      advantageEffect: '45 damage + opponent overwhelmed by manipulated emotions',
      baseDefendedEffect: 'Opponent maintains emotional control, gaining emotional intelligence',
      defendedAgainstAdvantage: 'Your emotional manipulation reveals your own lack of rational arguments',
      defendedWithAdvantage: 'Opponent achieves perfect emotional mastery, immune to sentiment manipulation'
    }
  },

  // 99. Political Correctness (Heart-based - language control)
  political_correctness: {
    id: 'political_correctness',
    name: 'Political Correctness',
    description: 'The right words fix everything. Your "incorrect" language proves your moral inferiority.',
    level: 3,
    manaCost: 24,
    damage: 0,
    icon: '📝',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 4,
      stats: { heart: 16 }
    },
    combatEffects: {
      baseEffect: 'Applies language policing debuff, making opponent afraid to speak freely',
      advantageEffect: 'Opponent censors themselves completely',
      baseDefendedEffect: 'Opponent speaks truth regardless of language, gaining authentic expression',
      defendedAgainstAdvantage: 'Your PC reveals your own fear of genuine communication',
      defendedWithAdvantage: 'Opponent achieves perfect communication, immune to language control'
    }
  },

  // 100. The Pollyanna Principle (Heart-based - toxic positivity)
  pollyanna_principle: {
    id: 'pollyanna_principle',
    name: 'The Pollyanna Principle',
    description: 'Everything is wonderful if you just think positively. Your acknowledgment of problems proves your negativity.',
    level: 2,
    manaCost: 20,
    damage: 0,
    icon: '🌈',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    learningRequirement: {
      level: 3,
      stats: { heart: 15 }
    },
    combatEffects: {
      baseEffect: 'Applies toxic positivity debuff, making opponent deny real problems',
      advantageEffect: 'Opponent ignores all dangers and difficulties',
      baseDefendedEffect: 'Opponent maintains realistic optimism, gaining balanced perspective',
      defendedAgainstAdvantage: 'Your Pollyanna reveals your own fear of reality',
      defendedWithAdvantage: 'Opponent achieves perfect realism, immune to toxic positivity'
    }
  }
};
