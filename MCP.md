# Custom MCP Server Recommendations for Axiomancer

## Vision Statement

An MCP (Model Context Protocol) server specifically designed for TTRPG development would be your **perfect coding partner** - not just generating content, but understanding game design principles, balancing mechanics, ensuring thematic consistency, and accelerating development through intelligent automation.

This document outlines an **ideal MCP server architecture** for Axiomancer that goes beyond simple content generation to become a comprehensive game development assistant.

---

## Core Philosophy

### The Perfect Coding Partner Should:
1. **Understand Context** - Know the game's philosophy theme, tone, and mechanics
2. **Maintain Consistency** - Ensure all generated content aligns with existing lore
3. **Balance Gameplay** - Audit mechanics for fairness and fun
4. **Accelerate Development** - Generate boilerplate, types, tests automatically
5. **Enhance Creativity** - Suggest improvements based on TTRPG best practices
6. **Learn & Adapt** - Remember your preferences and style
7. **Cross-Reference** - Compare your mechanics to successful TTRPGs
8. **Think Holistically** - Consider how changes ripple through the system

---

## 1. Content Generation Functions

### 1.1 `create-enemy`

**Purpose**: Generate fully-formed enemy JSON with philosophical theming

**Input Parameters**:
```typescript
{
  name: string;
  theme: 'fallacy' | 'virtue' | 'existential' | 'cosmic' | 'human';
  difficulty: 1-20;
  philosophicalAspect: 'heart' | 'body' | 'mind' | 'balanced';
  location?: string; // Which map/area
  storyRole?: 'boss' | 'miniboss' | 'common' | 'rare' | 'unique';
  emotionalTone?: 'bright' | 'neutral' | 'dark'; // Matches game progression
}
```

**Output**:
```json
{
  "id": "nihilistic_scholar",
  "name": "The Nihilistic Scholar",
  "description": "A once-brilliant philosopher who embraced the void. His words drain meaning from existence itself.",
  "level": 12,
  "portrait": "portraits/nihilistic-scholar.jpg",
  "health": 180,
  "maxHealth": 180,
  "baseStats": {
    "heart": 8,
    "body": 10,
    "mind": 18
  },
  "derivedStats": { /* calculated */ },
  "skills": [
    "appeal_to_futility",
    "existential_dread",
    "meaningless_void"
  ],
  "loot": {
    "gold": [50, 100],
    "items": [
      { "id": "void_fragment", "chance": 0.3 },
      { "id": "nihilist_manifesto", "chance": 0.1 }
    ]
  },
  "aiPattern": "aggressive_mind_attacks",
  "dialogue": {
    "onEncounter": "There is no point to this fight. Or anything else.",
    "onDefeat": "See? Even victory is hollow...",
    "onSpare": "Your mercy is just another meaningless gesture."
  },
  "fallacyBasis": "Nihilistic fallacy - assuming lack of inherent meaning implies no meaning at all",
  "philosopherReference": "Friedrich Nietzsche (misunderstood)",
  "strategicNotes": "Vulnerable to existentialist virtue skills. Immune to fear (has no hope to lose)."
}
```

**Advanced Features**:
- **Difficulty Scaling**: Auto-adjusts stats based on player level
- **Thematic Consistency**: Enemy skills match their philosophical theme
- **Lore Integration**: References existing world lore
- **Balanced Drops**: Loot appropriate for difficulty and theme

---

### 1.2 `create-skill`

**Purpose**: Generate fallacy or virtue skills with balanced mechanics

**Input Parameters**:
```typescript
{
  fallacyName: string;
  type: 'fallacy' | 'virtue' | 'logic' | 'rhetoric' | 'meditation';
  philosophicalAspect: 'heart' | 'body' | 'mind';
  difficultyLevel: 1-20;
  emotionalTone?: 'devastating' | 'neutral' | 'uplifting';
  realPhilosopher?: string; // Optional attribution
}
```

**Output**:
```json
{
  "id": "kafka_trap",
  "name": "The Kafka Trap",
  "description": "Accuse your opponent such that denial proves guilt. A psychologically devastating attack that leaves no escape.",
  "level": 8,
  "manaCost": 35,
  "damage": 42,
  "effect": "Denial increases guilt; admission confirms it",
  "icon": "🕷️",
  "type": "fallacy",
  "philosophicalAspect": "heart",
  "fallacyType": "informal",
  "learningRequirement": {
    "level": 8,
    "stats": { "heart": 16, "mind": 14 }
  },
  "combatEffects": {
    "baseEffect": "Inflicts Guilt debuff (20 damage over 3 turns)",
    "advantageEffect": "Inflicts Inescapable Guilt (30 damage over 5 turns, cannot be cleansed)",
    "baseDefendedEffect": "Defender gains Innocence buff (+5 to all defenses)",
    "defendedAgainstAdvantage": "Attacker suffers Self-Loathing (backfire damage)",
    "defendedWithAdvantage": "Defender immune to Guilt effects for rest of combat"
  },
  "philosopherReference": "Franz Kafka (via concept, not philosopher)",
  "strategicUse": "Extremely effective against high-Authenticity characters (they feel guilt more deeply). Less effective against already-corrupted opponents.",
  "authenticityImpact": -5,
  "karmaImpact": +3
}
```

**Advanced Features**:
- **Balanced Damage Formula**: `baseDamage = (level * 3) + (aspectModifier * 1.5)`
- **Mana Cost Scaling**: Higher level = higher cost
- **Thematic Consistency**: Description matches fallacy definition
- **Strategic Depth**: Includes when/how to use effectively

---

### 1.3 `create-equipment`

**Purpose**: Generate fallacy-themed equipment with philosopher attribution

**Input Parameters**:
```typescript
{
  fallacyBasis: string;
  equipmentType: 'weapon' | 'armor' | 'accessory' | 'consumable';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';
  philosophicalArchetype?: string[]; // Who can use it
  realPhilosopher?: string;
  level: 1-20;
}
```

**Output**:
```json
{
  "id": "descartes_doubt",
  "name": "Descartes' Radical Doubt",
  "description": "A crystalline lens that questions the reality of everything you perceive. Through it, even certain truths become uncertain.",
  "type": "accessory",
  "rarity": "legendary",
  "level": 15,
  "equipRequirements": {
    "level": 15,
    "archetypes": ["Rationalist", "Skeptic"],
    "stats": { "mind": 20 }
  },
  "effects": {
    "passive": {
      "mindDefense": +8,
      "perception": +10,
      "authenticityDecay": -2 // per combat turn
    },
    "active": {
      "name": "Methodological Skepticism",
      "description": "Question all assumptions. Reveals enemy weaknesses but causes dissonance.",
      "cost": "30 MP",
      "effect": "Reveal all enemy stats and weaknesses. Gain +2 dissonance.",
      "cooldown": 5
    }
  },
  "flavorText": "Cogito, ergo sum... but what if I don't?",
  "philosopherReference": "René Descartes - Meditations on First Philosophy",
  "fallacyConnection": "Radical skepticism taken to extreme (hyperbolic doubt)",
  "loreText": "Found in the deepest chamber of the Labyrinth, where reality itself grows thin.",
  "setBonus": {
    "set": "Rationalist's Regalia",
    "pieces": 4,
    "bonus": "Immunity to confusion effects. +5 to all Mind-based skills."
  }
}
```

**Advanced Features**:
- **Set Bonus System**: Equipment that works together
- **Trade-Offs**: Powerful effects with meaningful costs
- **Philosopher Quotes**: Authentic philosophical grounding
- **Late-Game Scaling**: Stats appropriate for character level

---

### 1.4 `create-event`

**Purpose**: Generate story events with philosophical choices

**Input Parameters**:
```typescript
{
  eventType: 'dilemma' | 'discovery' | 'encounter' | 'trial';
  location: string;
  philosophicalTheme: string;
  difficultyLevel: number;
  hasMultipleOutcomes: boolean;
  emotionalTone: 'bright' | 'neutral' | 'dark';
}
```

**Output**:
```json
{
  "id": "trolley_problem_real",
  "name": "The Broken Bridge",
  "type": "dilemma",
  "location": "forest_path",
  "description": "A cart carrying medical supplies races toward a broken bridge. Five workers repair the bridge below. You can pull a lever to divert the cart onto a side path, but a lone traveler rests there. The cart driver is unconscious. You have seconds to decide.",
  "philosophicalTheme": "Trolley Problem - Utilitarianism vs. Deontology",
  "choices": [
    {
      "id": "pull_lever",
      "text": "Pull the lever (save five, kill one)",
      "requirements": { "body": 10 },
      "immediateOutcome": {
        "description": "The cart diverts. The lone traveler dies instantly. The five workers are saved.",
        "karmaChange": +5,
        "authenticityChange": -3,
        "dissonanceChange": +2
      },
      "delayedConsequences": {
        "description": "Later, you learn the traveler was a doctor who could have saved dozens.",
        "triggerCondition": "next_village_visit",
        "effect": "Additional dissonance +3"
      },
      "npcReaction": {
        "workers": "gratitude",
        "traveler_family": "hatred"
      }
    },
    {
      "id": "do_nothing",
      "text": "Do nothing (let fate decide)",
      "requirements": null,
      "immediateOutcome": {
        "description": "The cart crashes. All five workers die. The traveler lives.",
        "karmaChange": -5,
        "authenticityChange": +2,
        "dissonanceChange": +1
      },
      "delayedConsequences": {
        "description": "The traveler, a doctor, saves many lives in the next village.",
        "triggerCondition": "next_village_visit",
        "effect": "Karma restored +3"
      },
      "npcReaction": {
        "workers_families": "grief and anger",
        "traveler": "survivor's guilt"
      }
    },
    {
      "id": "risk_intervention",
      "text": "[Body 15+] Jump in and try to wake the driver",
      "requirements": { "body": 15 },
      "skillCheck": {
        "stat": "body",
        "dc": 18,
        "advantage": false
      },
      "successOutcome": {
        "description": "You leap onto the cart and wake the driver. They stop just in time. Everyone lives.",
        "karmaChange": -10,
        "authenticityChange": +5,
        "reward": { "xp": 200, "item": "hero_badge" }
      },
      "failureOutcome": {
        "description": "You miss the cart and fall badly. The cart crashes, killing all five workers. You're injured.",
        "karmaChange": -5,
        "healthLoss": 40,
        "dissonanceChange": +5
      }
    },
    {
      "id": "seek_third_option",
      "text": "[Mind 16+] Analyze the situation for another way",
      "requirements": { "mind": 16 },
      "skillCheck": {
        "stat": "mind",
        "dc": 20,
        "advantage": false
      },
      "successOutcome": {
        "description": "You notice the cart's brake lever. You sprint and engage it remotely using a fallen branch. The cart stops safely. Everyone lives.",
        "karmaChange": -12,
        "authenticityChange": +7,
        "reward": { "xp": 300, "skill": "creative_problem_solving" }
      },
      "failureOutcome": {
        "description": "While you analyze, time runs out. The cart crashes. Five workers die.",
        "karmaChange": -5,
        "dissonanceChange": +3,
        "effect": "Paralysis by analysis debuff (1 combat)"
      }
    }
  ],
  "philosopherQuote": "The point is not to choose between the two options, but to recognize that the framing of the question itself may be flawed. - Philippa Foot (creator of the trolley problem)",
  "followUpEvents": {
    "if_pulled_lever": "funeral_scene_traveler",
    "if_did_nothing": "funeral_scene_workers",
    "if_saved_all": "village_celebration"
  },
  "reflectionPrompt": "Was there a 'right' choice? Would you have chosen differently if the one person was someone you loved?"
}
```

**Advanced Features**:
- **Branching Consequences**: Choices matter long-term
- **Hidden Options**: Stat-gated creative solutions
- **Skill Checks**: Dice rolls add uncertainty
- **Philosophical Reflection**: Makes player think
- **NPC Memory**: World reacts to your choice

---

### 1.5 `create-npc`

**Purpose**: Generate philosophically-grounded NPCs with depth

**Input Parameters**:
```typescript
{
  role: 'merchant' | 'questGiver' | 'companion' | 'rival' | 'mentor' | 'victim';
  philosophicalStance: string;
  relationshipWithPlayer: string;
  emotionalState: string;
  location: string;
}
```

**Output**: Full NPC with dialogue trees, quests, relationship mechanics, and philosophical consistency.

---

## 2. Mechanics Auditing Functions

### 2.1 `mechanics-audit`

**Purpose**: Compare your mechanic to other TTRPGs and identify improvements

**Input Parameters**:
```typescript
{
  mechanicName: string;
  mechanicType: 'combat' | 'progression' | 'social' | 'exploration';
  currentImplementation: object;
  comparisonGames?: string[]; // Default: top TTRPGs
}
```

**Output**:
```json
{
  "mechanicName": "Authenticity Metric",
  "analysis": {
    "similar_mechanics": [
      {
        "game": "Darkest Dungeon",
        "mechanic": "Stress & Affliction",
        "similarity": "Both track psychological decay",
        "key_difference": "Stress is combat-focused; Authenticity is choice-based"
      },
      {
        "game": "Disco Elysium",
        "mechanic": "Thought Cabinet",
        "similarity": "Philosophical self-reflection",
        "key_difference": "Thoughts are discrete; Authenticity is a spectrum"
      },
      {
        "game": "Mörk Borg",
        "mechanic": "Misery Calendar",
        "similarity": "Inevitable doom",
        "key_difference": "Misery is time-based; Authenticity is action-based"
      }
    ],
    "strengths": [
      "Ties directly to philosophical theme",
      "Clear mechanical impact (skill access)",
      "Visual feedback (world appearance)",
      "Player agency (can recover or embrace)"
    ],
    "weaknesses": [
      "May feel punishing if unrecoverable",
      "Requires careful balance (too easy/hard to maintain)",
      "Could conflict with Innocence system (redundancy)"
    ],
    "improvement_suggestions": [
      {
        "suggestion": "Add 'Redemption Arcs' - Special quests to restore Authenticity",
        "inspiration": "Dark Souls' Absolution mechanic",
        "impact": "Prevents feeling trapped in corruption"
      },
      {
        "suggestion": "Make low Authenticity a viable playstyle, not just a fail state",
        "inspiration": "Infamous's full Evil path with unique rewards",
        "impact": "Player choice feels meaningful, not punitive"
      },
      {
        "suggestion": "Add thresholds with significant gameplay changes (like Bloodborne's Insight)",
        "inspiration": "Bloodborne - world changes at certain Insight levels",
        "impact": "Makes the stat feel more impactful"
      }
    ],
    "balance_considerations": {
      "recovery_rate": "Currently -5 for fallacies, +2 for virtues. Consider asymmetric balance: easier to fall than climb.",
      "player_feedback": "Ensure clear UI indicators. Players need to know they're losing Authenticity before it's critical.",
      "late_game_power_spike": "Low Authenticity builds could become OP with fallacy bonuses. Cap bonuses or add HP costs."
    }
  }
}
```

**Advanced Features**:
- **Cross-TTRPG Knowledge**: Trained on D&D, Pathfinder, PBTA, FATE, etc.
- **Balance Analysis**: Mathematical modeling of mechanic impact
- **Player Psychology**: Considers fun factor, not just balance
- **Genre-Specific**: Knows TTRPG conventions vs. video game RPGs

---

### 2.2 `balance-check`

**Purpose**: Mathematical analysis of game balance

**Input Parameters**:
```typescript
{
  elementType: 'skill' | 'enemy' | 'equipment' | 'stat';
  element: object;
  compareToExisting?: boolean;
}
```

**Output**:
```json
{
  "element": "Ad Hominem Attack (skill)",
  "balance_score": 7.5,
  "analysis": {
    "damage_per_mana": {
      "value": 2.0,
      "comparison": "Average for Heart skills is 1.8",
      "verdict": "Slightly above average (acceptable for low-level skill)"
    },
    "status_effect_value": {
      "effect": "Self-Loathing debuff",
      "duration": 3,
      "potency": "15 damage over time",
      "comparison": "Similar to Mind confusion effects",
      "verdict": "Balanced"
    },
    "learning_requirement": {
      "level": 1,
      "stats": { "heart": 12 },
      "verdict": "Appropriate for starter fallacy"
    },
    "opportunity_cost": {
      "analysis": "Using this skill vs. basic attack",
      "breakpoint": "Better than basic attack if enemy has >30% vulnerability to Heart",
      "verdict": "Situationally optimal"
    },
    "power_curve": {
      "early_game": "Strong option",
      "mid_game": "Falls off without upgrades",
      "late_game": "Outclassed unless enemy is vulnerable",
      "recommendation": "Add scaling version or combo potential"
    }
  },
  "red_flags": [],
  "recommendations": [
    "Consider adding synergy with other Heart skills",
    "Late-game upgrade: 'Masterful Ad Hominem' with higher damage"
  ]
}
```

---

### 2.3 `consistency-check`

**Purpose**: Ensure new content aligns with existing lore, tone, and mechanics

**Input Parameters**:
```typescript
{
  contentType: 'enemy' | 'skill' | 'equipment' | 'event' | 'npc';
  content: object;
  checkAgainst: 'lore' | 'tone' | 'mechanics' | 'all';
}
```

**Output**:
```json
{
  "contentType": "enemy",
  "contentName": "The Joyful Torturer",
  "consistency_analysis": {
    "lore_consistency": {
      "score": 9,
      "notes": "Fits theme of psychological horror in late-game labyrinth"
    },
    "tone_consistency": {
      "score": 6,
      "warning": "Name suggests late-game darkness, but this is marked for early area",
      "recommendation": "Either darken early game or rename enemy"
    },
    "mechanical_consistency": {
      "score": 8,
      "notes": "Stats align with other level 8 enemies. Skills are thematically appropriate."
    },
    "philosophical_consistency": {
      "score": 10,
      "notes": "Based on sadism and schadenfreude fallacies. Philosopher attribution (Marquis de Sade) is appropriate."
    }
  },
  "conflicts": [
    {
      "type": "tone",
      "description": "Enemy is very dark for an area marked as 'neutral' tone",
      "severity": "medium",
      "suggestion": "Move to 'dark forest depths' area or soften design"
    }
  ],
  "overall_verdict": "Good design, but placement needs adjustment"
}
```

---

## 3. Asset Generation & Integration

### 3.1 `create-enemy-image`

**Purpose**: Generate enemy portraits via integration with image generation MCP

**Input Parameters**:
```typescript
{
  enemyData: object; // From create-enemy output
  artStyle: 'mork-borg' | 'darkest-dungeon' | 'disco-elysium' | 'custom';
  mood: 'bright' | 'neutral' | 'dark';
}
```

**Process**:
1. Parse enemy description and theme
2. Generate detailed art prompt incorporating philosophical symbolism
3. Call image generation MCP (e.g., DALL-E, Midjourney via API)
4. Return image URL and save to project directory
5. Update enemy JSON with image path

**Example Prompt Generated**:
```
"Portrait of The Nihilistic Scholar: A gaunt figure in tattered academic robes, 
hollow eyes staring into the void. Books crumble to dust around him. Dark, 
muted colors. Art style: Mörk Borg meets Darkest Dungeon. Philosophical 
symbolism: Empty void where heart should be. Oppressive, existential dread. 
High detail, dramatic lighting."
```

---

### 3.2 `create-skill-icon`

**Purpose**: Generate consistent skill icons

**Process**: Similar to enemy images but optimized for small icon size, clear symbolism, and consistent style across all skills.

---

### 3.3 `create-map-layout`

**Purpose**: Generate node-based map layouts

**Output**: JSON defining node positions, connections, types, and strategic flow for exploration maps.

---

## 4. Code Generation Functions

### 4.1 `generate-types`

**Purpose**: Automatically generate TypeScript types from content definitions

**Input Parameters**:
```typescript
{
  contentFile: string; // Path to JSON file
  outputFormat: 'typescript' | 'zod' | 'both';
}
```

**Output**:
```typescript
// Auto-generated from nihilistic_scholar.json
export interface NihilisticScholar extends Enemy {
  id: 'nihilistic_scholar';
  fallacyBasis: string;
  philosopherReference: string;
  aiPattern: 'aggressive_mind_attacks';
}

// Zod schema for runtime validation
export const NihilisticScholarSchema = z.object({
  id: z.literal('nihilistic_scholar'),
  name: z.string(),
  // ... rest of schema
});
```

---

### 4.2 `generate-combat-logic`

**Purpose**: Generate combat resolution code for new skills

**Input**: Skill definition JSON
**Output**: TypeScript function that implements the skill's combat effects

```typescript
// Auto-generated combat logic for "Kafka Trap" skill
export function applyKafkaTrap(
  caster: Character,
  target: Character,
  advantage: AdvantageType
): CombatResolutionResult {
  const baseDamage = 42;
  const adjustedDamage = calculateSkillDamage(
    baseDamage,
    caster.baseStats.heart,
    target.derivedStats.ailmentDefense,
    advantage
  );

  let statusEffect: StatusEffect | null = null;

  if (advantage === 'player') {
    statusEffect = createGuiltDebuff(30, 5); // Enhanced version
  } else {
    statusEffect = createGuiltDebuff(20, 3); // Base version
  }

  return {
    damage: adjustedDamage,
    statusEffects: statusEffect ? [statusEffect] : [],
    authenticityImpact: -5,
    karmaImpact: +3,
    message: generateKafkaTrapMessage(advantage, adjustedDamage)
  };
}
```

---

### 4.3 `generate-test-suite`

**Purpose**: Automatically generate unit tests for game mechanics

**Input**: Function or mechanic to test
**Output**: Complete test suite with edge cases

```typescript
describe('Kafka Trap Skill', () => {
  it('should deal correct base damage', () => {
    // Auto-generated test cases
  });

  it('should apply Guilt debuff on successful hit', () => {
    // ...
  });

  it('should handle advantage correctly', () => {
    // ...
  });

  it('should reduce caster Authenticity by 5', () => {
    // ...
  });

  it('should fail gracefully if target is immune to guilt', () => {
    // ...
  });
});
```

---

### 4.4 `generate-database-migration`

**Purpose**: Auto-generate database migrations for new content

**Input**: New content definitions
**Output**: SQL migration files

---

## 5. Lore & Narrative Functions

### 5.1 `expand-lore`

**Purpose**: Generate consistent lore for under-developed areas

**Input Parameters**:
```typescript
{
  topic: 'pantheon' | 'labyrinth' | 'world_history' | 'character_backstory';
  existingLore: string; // Context from docs
  tone: 'bright' | 'neutral' | 'dark';
  length: 'short' | 'medium' | 'long';
}
```

**Example Use**: Fill in the missing Pantheon descriptions
**Output**: Complete, thematically consistent lore that ties to game mechanics

---

### 5.2 `generate-dialogue`

**Purpose**: Create NPC dialogue trees with philosophical depth

**Input**: NPC definition, conversation topic, player relationship level
**Output**: Multi-branch dialogue tree with skill checks, outcomes, and philosophical insights

---

### 5.3 `create-quest`

**Purpose**: Generate complete quests with philosophical themes

**Output**:
```json
{
  "id": "the_liar_paradox",
  "name": "The Liar's Truth",
  "philosophicalTheme": "Liar Paradox (self-referential statements)",
  "questGiver": "scholar_epimenides",
  "description": "A scholar claims 'All scholars are liars.' Is he telling the truth?",
  "objectives": [
    {
      "id": "investigate_scholars",
      "description": "Question three scholars about their honesty",
      "type": "dialogue"
    },
    {
      "id": "solve_paradox",
      "description": "Present a solution to Epimenides",
      "type": "mind_check",
      "dc": 18
    }
  ],
  "outcomes": {
    "success": {
      "xp": 500,
      "item": "paradox_pendant",
      "relationship": { "scholar_epimenides": +20 }
    },
    "failure": {
      "xp": 200,
      "effect": "Epimenides becomes frustrated, closes off"
    },
    "clever_solution": {
      "xp": 800,
      "item": "logician_ring",
      "skill": "resolve_paradoxes",
      "relationship": { "scholar_epimenides": +50 }
    }
  },
  "philosopherReference": "Epimenides of Crete - The Liar Paradox",
  "followUp": "quest_russells_paradox"
}
```

---

## 6. Game Design Assistant Functions

### 6.1 `suggest-progression-arc`

**Purpose**: Analyze current game structure and suggest pacing improvements

**Input**: Current story beats, character progression, map layouts
**Output**: Recommendations for pacing, difficulty curve, emotional arc

---

### 6.2 `identify-redundancies`

**Purpose**: Find overlapping or redundant mechanics

**Example Output**:
```json
{
  "redundancies": [
    {
      "mechanics": ["Authenticity", "Innocence"],
      "overlap": "Both track moral/philosophical decay",
      "recommendation": "Differentiate: Authenticity = choices, Innocence = inevitable story progression"
    },
    {
      "mechanics": ["Karma", "Authenticity"],
      "overlap": "Both affected by moral choices",
      "recommendation": "Merge into single system OR make Karma external (NPC reactions) and Authenticity internal (self-perception)"
    }
  ]
}
```

---

### 6.3 `suggest-missing-features`

**Purpose**: Identify gaps in game systems

**Example Output**:
```json
{
  "missing_features": [
    {
      "feature": "Crafting System",
      "justification": "Players have resources (wood, iron ore, fish) but can't create items",
      "suggested_implementation": "Philosophy-themed crafting: Forge equipment representing philosophical concepts",
      "priority": "medium"
    },
    {
      "feature": "Reputation System",
      "justification": "NPCs remember choices but no numerical tracking",
      "suggested_implementation": "Per-faction reputation (Scholars, Merchants, Guards, etc.)",
      "priority": "low"
    },
    {
      "feature": "Multi-Ending System",
      "justification": "Game has moral choices but unclear if they lead to different endings",
      "suggested_implementation": "5 endings based on Authenticity/Innocence/Knowledge/Karma",
      "priority": "high"
    }
  ]
}
```

---

### 6.4 `optimize-learning-curve`

**Purpose**: Analyze player onboarding and suggest tutorial improvements

**Output**: Recommendations for when to introduce mechanics, how to explain complex systems, and what to defer to late game

---

## 7. Playtesting & QA Functions

### 7.1 `generate-test-scenarios`

**Purpose**: Create specific gameplay scenarios for testing

**Output**:
```json
{
  "scenario": "Low Authenticity Fallacy Build",
  "setup": {
    "character_level": 10,
    "authenticity": 15,
    "skills": ["all_fallacy_skills"],
    "equipment": ["corrupted_items"]
  },
  "test_cases": [
    "Can player still progress story?",
    "Is low-Authenticity viable or punishing?",
    "Do NPCs react appropriately?",
    "Is there a redemption path?"
  ],
  "expected_behavior": "Player should feel powerful but morally conflicted. World should be darker. Path to redemption should exist but be difficult."
}
```

---

### 7.2 `run-balance-simulation`

**Purpose**: Simulate combat with different builds

**Input**: Character build, enemy, number of simulations
**Output**: Win rate, average turns to victory, most common failure point

---

### 7.3 `identify-exploits`

**Purpose**: Use AI to find broken combinations

**Example**:
```json
{
  "exploit": "Infinite Authenticity Loop",
  "description": "Using 'Compassionate Listening' skill repeatedly on same enemy grants Authenticity without time limit",
  "severity": "high",
  "suggested_fix": "Add cooldown or diminishing returns"
}
```

---

## 8. Documentation Functions

### 8.1 `generate-wiki-entry`

**Purpose**: Auto-generate wiki/documentation from game content

**Input**: Enemy, skill, item, or mechanic
**Output**: Formatted wiki page with all relevant info, strategies, lore, and cross-references

---

### 8.2 `create-api-docs`

**Purpose**: Generate API documentation for backend endpoints

**Input**: Source code
**Output**: OpenAPI/Swagger docs

---

### 8.3 `update-changelog`

**Purpose**: Track and document changes

**Input**: Git commits, feature additions
**Output**: Formatted CHANGELOG.md

---

## 9. Integration & Workflow Functions

### 9.1 `end-to-end-content-pipeline`

**Purpose**: Full pipeline from concept to implementation

**Input**: "I want a new boss enemy themed around solipsism"

**Process**:
1. `create-enemy` → Generate boss JSON
2. `create-enemy-image` → Generate portrait
3. `create-skill` → Generate unique boss skills
4. `create-event` → Generate boss encounter event
5. `generate-types` → Create TypeScript types
6. `generate-combat-logic` → Implement boss mechanics
7. `generate-test-suite` → Create tests
8. `balance-check` → Verify it's not too easy/hard
9. `consistency-check` → Ensure it fits the game
10. `generate-wiki-entry` → Document it

**Output**: Complete, tested, documented, playable boss ready to merge

---

### 9.2 `git-integration`

**Purpose**: Auto-commit generated content with meaningful messages

**Example**:
```bash
git add enemies/nihilistic_scholar.json
git add public/portraits/nihilistic-scholar.jpg
git commit -m "feat(enemies): Add Nihilistic Scholar boss

- Level 12 Mind-focused enemy
- Based on nihilistic fallacy
- Philosopher reference: Nietzsche
- Drops Void Fragment and Nihilist Manifesto
- AI pattern: Aggressive mind attacks"
```

---

### 9.3 `dependency-resolution`

**Purpose**: When adding content, identify what else needs to be added

**Example**: Adding new equipment
- Check if it requires new status effects
- Check if it references skills that don't exist
- Check if it needs new enemy types to drop from
- Auto-generate missing dependencies

---

## 10. Advanced AI Features

### 10.1 `philosophical-advisor`

**Purpose**: Act as a philosophy expert

**Capabilities**:
- Fact-check philosophical references
- Suggest relevant philosophers for themes
- Explain complex philosophical concepts
- Identify misuse of philosophical terms

---

### 10.2 `player-psychology-analysis`

**Purpose**: Predict how players will react to mechanics

**Input**: Game mechanic
**Output**: Analysis of player motivation, frustration points, and engagement

---

### 10.3 `competitive-analysis`

**Purpose**: Monitor and analyze other TTRPGs

**Capabilities**:
- Track new TTRPG releases
- Identify trending mechanics
- Suggest innovations based on industry trends
- Warn about oversaturated mechanics

---

### 10.4 `adaptive-difficulty`

**Purpose**: Suggest dynamic difficulty adjustments

**Input**: Player performance data
**Output**: Recommendations for scaling challenges

---

## 11. Creative Collaboration Functions

### 11.1 `brainstorm-session`

**Purpose**: Interactive ideation

**Example Interaction**:
```
Developer: "I need a skill based on the Sorites Paradox (heap paradox)"
MCP: "The Sorites Paradox deals with vague boundaries - when does a heap cease to be a heap? 

Skill Concept: 'Erosion of Certainty'
- Type: Mind-based fallacy
- Effect: Each turn, remove 1 HP from enemy. They can't react until HP drops below threshold they didn't know existed.
- Philosophical: Represents how removing grains one-by-one goes unnoticed until collapse
- Strategic: Slow damage but enemy can't counterattack (don't know they're threatened yet)

Alternative: 'The Heap Paradox' 
- Passive skill: Accumulate small advantages that enemy ignores, then sudden critical strike when threshold reached
- More complex but captures the paradox better

Which direction interests you?"
```

---

### 11.2 `thematic-consistency-advisor`

**Purpose**: Real-time guidance during development

**Example**:
```
Developer: *Adds cute mascot character*
MCP: "Warning: This character's tone (bright, comedic) conflicts with late-game dark tone. Suggestions:
1. Make this early-game only
2. Have character undergo corruption arc
3. Use as intentional tonal contrast (comic relief)
4. Make character secretly dark underneath"
```

---

### 11.3 `alternative-suggestion-generator`

**Purpose**: Always provide options

**Example**:
```
Developer: "Create an enemy based on confirmation bias"
MCP: "Here are three interpretations:

Option 1: 'The Echo Chamber' - Enemy that reflects your skills back at you (only 'hears' what confirms its worldview)

Option 2: 'The Closed Mind' - High defense against arguments it disagrees with, low defense against arguments it already believes

Option 3: 'The Cherry Picker' - Selectively absorbs only certain skill types, ignores others

Which aligns best with your vision?"
```

---

## 12. MCP Server Architecture

### Recommended Tech Stack

**Core MCP Server**:
- Language: TypeScript/Node.js (matches your stack)
- Protocol: Model Context Protocol (Anthropic standard)
- Hosting: Self-hosted or cloud function

**AI Model Integration**:
- Primary: Claude 3.5 Sonnet (best reasoning, understands philosophy)
- Fallback: GPT-4 Turbo (broader knowledge)
- Specialized: Fine-tuned model on TTRPG mechanics

**Knowledge Bases**:
- Vector database (Pinecone/Weaviate) with:
  - Your entire documentation
  - 100+ logical fallacies with definitions
  - Philosopher biographies and works
  - TTRPG mechanics from top games
  - Your existing codebase

**External Integrations**:
- Image Generation: DALL-E 3 / Midjourney API / Stable Diffusion
- Version Control: GitHub API for auto-commits
- Database: PostgreSQL (for content storage)
- Search: Algolia or ElasticSearch (for content querying)

---

## 13. Example MCP Workflow

### Scenario: Adding a Complete Game Area

**Input**: "Create the 'Epistemology Wing' of the labyrinth - a section focused on knowledge and truth"

**MCP Executes**:

1. **Lore Generation**:
   - Generate area description
   - Create philosophical theme document
   - Write NPC backstories

2. **Content Generation**:
   - `create-enemy` × 5 (common enemies, mini-boss, boss)
   - `create-npc` × 3 (questgivers, merchants, victims)
   - `create-skill` × 3 (learnable in this area)
   - `create-equipment` × 5 (drops from enemies)
   - `create-event` × 10 (random encounters, scripted events)
   - `create-quest` × 2 (main quest, side quest)

3. **Asset Creation**:
   - `create-enemy-image` × 5
   - `create-map-layout` (node graph)

4. **Code Implementation**:
   - `generate-types` for all new content
   - `generate-combat-logic` for new skills
   - `generate-test-suite` for area

5. **Balance & QA**:
   - `balance-check` on all enemies
   - `consistency-check` on all content
   - `mechanics-audit` on new mechanics

6. **Documentation**:
   - `generate-wiki-entry` × 15 (all new content)
   - `update-changelog`

7. **Integration**:
   - `dependency-resolution` (check for missing pieces)
   - `git-integration` (commit with proper messages)

**Output**: Complete, balanced, tested, documented game area ready to play.

**Time Saved**: Manual creation = 40+ hours. MCP-assisted = 4 hours review/refinement.

---

## 14. Pricing & Feasibility

### Open Source Option (Free but effort-intensive):
- Use open-source LLMs (Llama 3, Mistral)
- Self-host on cloud VM
- Manual integration with your codebase
- **Pros**: Free, full control
- **Cons**: Requires ML expertise, maintenance burden

### API-Based Option (Paid but simple):
- Use Claude/GPT-4 APIs
- Serverless functions (AWS Lambda / Vercel)
- **Cost**: ~$50-200/month depending on usage
- **Pros**: No infrastructure management, best models
- **Cons**: Ongoing cost, API dependency

### Hybrid Option (Recommended):
- Open-source models for simple tasks (content generation)
- API models for complex tasks (balance analysis, code generation)
- **Cost**: ~$20-50/month
- **Pros**: Balance of cost and quality

---

## 15. Beyond the Ideal - Future Vision

### Natural Language Development Interface
```
Developer: "The early game feels too easy. Players are saying it's boring."
MCP: *Analyzes telemetry data*
"Early game enemies have 30% lower HP than mid-game relative to player DPS scaling. Shall I:
1. Increase early enemy HP by 20%
2. Reduce early player damage by 15%
3. Add more aggressive enemy AI patterns

I recommend option 3 - maintains accessibility but adds tactical depth."

Developer: "Do option 3"
MCP: *Generates new AI patterns*
*Implements in codebase*
*Runs balance simulations*
*Commits changes*
"Done. New AI patterns implemented for 8 early-game enemies. Win rate increased from 95% to 85%. Would you like to review before deploying?"
```

### Autonomous Playtesting
- MCP runs AI agents that play the game
- Identifies bugs, exploits, and balance issues
- Suggests fixes automatically

### Community Integration
- Analyzes player feedback from Discord/Reddit
- Identifies common complaints
- Suggests solutions based on TTRPG best practices

### Living World System
- MCP continuously generates new events, enemies, and quests
- Game never runs out of content
- Each playthrough is unique

---

## Conclusion

### What Makes This MCP Server Special?

1. **Domain Expertise**: Trained specifically on TTRPGs and philosophy
2. **Holistic Understanding**: Knows your entire game, not just snippets
3. **Proactive**: Suggests improvements, not just executes commands
4. **Consistency**: Ensures all content aligns with your vision
5. **Creative Partner**: Generates ideas, not just implementations
6. **Time Multiplier**: 10x development speed

### Implementation Roadmap

**Phase 1** (1-2 months): Core content generation
- `create-enemy`, `create-skill`, `create-equipment`
- Basic balance checking
- Type generation

**Phase 2** (2-3 months): Game design assistant
- Mechanics auditing
- Lore expansion
- Quest generation

**Phase 3** (3-4 months): Code generation
- Combat logic generation
- Test suite generation
- Database migrations

**Phase 4** (4-6 months): Advanced features
- Playtesting automation
- Natural language interface
- Community integration

### The Vision Realized

With this MCP server, you're not just building a game - you're building a **self-improving game development system**. Every time you add content, the MCP learns. Every time you balance a mechanic, it understands better. Over time, it becomes the perfect coding partner: anticipating your needs, maintaining consistency, and accelerating development.

**Axiomancer could become the first TTRPG co-created by human and AI** - a fitting theme for a game about philosophy, truth, and the nature of consciousness.

---

**Note**: This MCP server concept is ambitious but feasible. Start with core functions (content generation) and expand. Each function is modular and can be implemented independently. The key is building the knowledge base of your game's philosophy, mechanics, and tone - then the AI can maintain consistency across all generated content.
