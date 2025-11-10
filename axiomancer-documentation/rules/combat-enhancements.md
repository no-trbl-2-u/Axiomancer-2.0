# Combat System Enhancements & Fallacy-Based Skills

## Understanding the Fallacy Combat System

**Core Principle**: Fallacies (skills) interact with the advantage system, modify combat outcomes, and create tactical depth while preserving the elegant RPS core (Heart > Body > Mind > Heart).

**Stat Clarification**:
- **Decision Stats (Body/Mind/Heart)**: Used for base combat rolls and determining attack/defense types
- **Skill Stats (physicalSkill/mentalSkill/heartSkill)**: Used ONLY when activating fallacy skills of that type
  - Example: Using "Strawman" (Mind fallacy) requires a mentalSkill check to succeed
  - These stats don't affect combat unless you're using a skill

**Advantage System Design Space**:
Skills manipulate advantage in multiple ways:
1. **Invert Advantage** - Turn enemy advantage into disadvantage (or vice versa)
2. **Neutralize** - Force a neutral roll (1d20) regardless of type matchup
3. **Steal Advantage** - Copy enemy's advantage state for yourself
4. **Stack Advantage** - Gain advantage even when you shouldn't
5. **Lock Types** - Prevent type changes or force specific types
6. **Conditional Advantage** - Create new advantage conditions beyond RPS triangle

---

# 30 FALLACY-BASED COMBAT SKILLS

**Activation Rules**:
- **Skill Check**: Roll 1d20 + [respective Skill stat] vs. DC 12 (or 10 + enemy's counter-stat for contested)
- **EP Cost**: All fallacies cost Essence Points (2-6 EP depending on power)
- **Cooldowns**: Powerful effects have 1-3 round cooldowns
- **Timing**: Specified per fallacy ("Reaction," "Before rolling," "After seeing types," etc.)

---

## BODY FALLACIES (Physical Combat)
*Require physicalSkill checks. Focus on damage, aggression, force, and physical dominance.*

### 1. **Argumentum ad Baculum** (Argument from the Club) ⭐ PRIORITY
**Type**: Body Fallacy
**Cost**: 4 EP
**Activation**: Before rolling, physicalSkill DC 12
**Effect**: Force opponent to reroll their combat roll with disadvantage. Deals +1d6 damage on hit.
**Cooldown**: 2 rounds
**Flavor**: *Player threatens and intimidates, using raw physical presence to shake enemy's resolve. "Your arguments mean nothing against my strength!"*
**Why Essential**: Provides disadvantage infliction for Body builds. Creates "intimidation tank" playstyle.

### 2. **Ableism** (Exploiting Weakness)
**Type**: Body Fallacy
**Cost**: 3 EP
**Activation**: After seeing enemy choice, physicalSkill DC 10 + enemy Mind
**Effect**: If enemy is at 50% HP or less, you automatically gain advantage regardless of type matchup.
**Cooldown**: 1 round
**Flavor**: *Player targets enemy's weaknesses, injuries, or exhaustion. "You're too slow, too weak! This ends now!"*
**Why Essential**: Creates "execute" mechanic. Rewards aggressive damage-dealing.

### 3. **Finish the Job**
**Type**: Body Fallacy
**Cost**: 5 EP
**Activation**: Reaction when enemy drops below 25% HP, physicalSkill DC 14
**Effect**: Immediately make a bonus attack with advantage. If this reduces enemy to 0 HP, recover 3 EP.
**Cooldown**: Once per combat
**Flavor**: *Player delivers a brutal finishing strike. "No mercy! No surrender!"*
**Why Essential**: Provides burst damage and finishing power. Creates dramatic conclusions.

### 4. **Brute Force** (No Discussion)
**Type**: Body Fallacy
**Cost**: 3 EP
**Activation**: Before rolling, physicalSkill DC 12
**Effect**: Both you and enemy roll neutral (1d20) regardless of type matchup. Add your Body stat twice to your roll.
**Cooldown**: 2 rounds
**Flavor**: *Player overwhelms with pure strength. "I don't care about your tricks! Raw power wins!"*
**Why Essential**: Neutralizes Mind/Heart tactics. Creates "pure brawler" moments.

### 5. **Actions Have Consequences**
**Type**: Body Fallacy
**Cost**: 2 EP (Passive trigger)
**Activation**: Reaction when enemy attacks you, automatic
**Effect**: If enemy deals damage to you, they take 1d4 damage back (like thorns). Stacks with other effects.
**Cooldown**: None (but costs EP each time)
**Flavor**: *Player's body itself becomes a weapon. "You'll pay for every hit you land!"*
**Why Essential**: Makes Body defense viable. Creates counterattack gameplay.

### 6. **Shock and Awe** (Overwhelming Force)
**Type**: Body Fallacy
**Cost**: 6 EP
**Activation**: Before rolling, physicalSkill DC 15
**Effect**: Attack all enemies in Close zone. Each takes your damage roll separately. You gain advantage against all of them.
**Cooldown**: 3 rounds
**Flavor**: *Player unleashes devastating area attack. "Witness my true power!"*
**Why Essential**: Provides AoE damage for Body. Creates crowd control moments.

### 7. **Moving the Goalposts** (Adaptable Fighter)
**Type**: Body Fallacy
**Cost**: 3 EP
**Activation**: After seeing combat rolls but before damage, physicalSkill DC 13
**Effect**: If you lost the combat roll, you may reroll it once. Keep whichever result you prefer.
**Cooldown**: 2 rounds
**Flavor**: *Player adapts mid-strike, changing tactics. "That didn't work? Try this!"*
**Why Essential**: Provides comeback mechanic. Reduces bad-luck frustration.

### 8. **Appeasement** (Intimidating Demand)
**Type**: Body Fallacy
**Cost**: 4 EP
**Activation**: As Action instead of attacking, physicalSkill DC 14
**Effect**: Force enemy to choose specific type next round (Body/Mind/Heart) or take 2d6 damage.
**Cooldown**: 2 rounds
**Flavor**: *Player makes non-negotiable demands. "Attack me head-on or suffer!"*
**Why Essential**: Adds type-prediction gameplay. Creates setup for combos.

### 9. **Cost Bias** (Relentless Pursuit)
**Type**: Body Fallacy
**Cost**: Passive
**Activation**: Automatic
**Effect**: For each consecutive round you attack the same target, gain +1 to combat rolls (max +4).
**Cooldown**: None
**Flavor**: *Player commits fully to destroying one enemy. "I've invested too much to stop now!"*
**Why Essential**: Rewards focus-fire strategy. Creates sticky targeting.

### 10. **Mortification** (No Pain No Gain) ⭐ PRIORITY
**Type**: Body Fallacy
**Cost**: Variable EP (1-5)
**Activation**: Before rolling, physicalSkill DC 10 + EP spent
**Effect**: Take X damage (where X = EP spent). Gain advantage and +X to damage roll this turn.
**Cooldown**: 1 round
**Flavor**: *Player sacrifices health for power. "Pain is weakness leaving the body!"*
**Why Essential**: Creates high-risk high-reward gameplay. Enables berserker builds.

---

## MIND FALLACIES (Tactical/Control)
*Require mentalSkill checks. Focus on information, manipulation, prediction, and advantage system control.*

### 11. **Straw Man** (Inverting Reality) ⭐ PRIORITY
**Type**: Mind Fallacy
**Cost**: 4 EP
**Activation**: After seeing types but before rolling, mentalSkill DC 13
**Effect**: Invert advantage state - if you have disadvantage, gain advantage instead. If enemy has advantage, they gain disadvantage.
**Cooldown**: 2 rounds
**Flavor**: *Player twists perception of the fight. "You think YOU have the advantage? Let me show you how wrong you are!"*
**Why Essential**: Core Mind identity. Fixes disadvantage situations. Creates "reverse psychology" gameplay.

### 12. **False Dilemma** (Either/Or Reasoning)
**Type**: Mind Fallacy
**Cost**: 3 EP
**Activation**: Before enemy chooses type, mentalSkill DC 14
**Effect**: Enemy must choose between two types you specify (e.g., Body or Heart, but not Mind). You see their choice before making yours.
**Cooldown**: 2 rounds
**Flavor**: *Player frames the fight in limiting terms. "You can only attack or defend! No tricks!"*
**Why Essential**: Provides information advantage. Creates mind-games.

### 13. **Cognitive Prediction** (Mind Reading)
**Type**: Mind Fallacy
**Cost**: 2 EP
**Activation**: Before choosing types, mentalSkill DC 12
**Effect**: See what type enemy chose last round. Roll 1d6: on 4-6, also see their current choice.
**Cooldown**: 1 round
**Flavor**: *Player analyzes patterns and predicts moves. "I know exactly what you're going to do!"*
**Why Essential**: Reduces RPS randomness. Rewards pattern recognition.

### 14. **Circular Reasoning** (Catch-22)
**Type**: Mind Fallacy
**Cost**: 5 EP
**Activation**: As Action instead of attacking, mentalSkill DC 15
**Effect**: Enemy is "Confused" for 2 rounds: they must roll 1d6 each round - on 1-3, they attack a random target (possibly ally or self for 1d6).
**Cooldown**: 3 rounds
**Flavor**: *Player creates logical paradox that scrambles enemy thinking. "If you attack me, you prove my point. If you don't, you admit defeat!"*
**Why Essential**: Provides crowd control. Creates chaos in multi-enemy fights.

### 15. **Equivocation** (Word Games)
**Type**: Mind Fallacy
**Cost**: 3 EP
**Activation**: After enemy chooses type but before you choose, mentalSkill DC 12
**Effect**: You may treat your type choice as if it were any other type for advantage calculation (choose after seeing enemy's).
**Cooldown**: 2 rounds
**Flavor**: *Player redefines terms mid-combat. "When I said 'attack,' I meant 'defend!' Words mean what I want!"*
**Why Essential**: Creates ultimate flexibility. Enables "smooth talker" builds.

### 16. **Gaslighting**
**Type**: Mind Fallacy
**Cost**: 4 EP
**Activation**: Reaction when enemy hits you, mentalSkill DC 13
**Effect**: Enemy must reroll their damage. On their next turn, they have disadvantage.
**Cooldown**: 2 rounds
**Flavor**: *Player makes enemy doubt reality. "Did you really hit me? Are you sure? Maybe you missed..."*
**Why Essential**: Defensive tool for Mind. Creates psychological warfare.

### 17. **Moving the Goalposts** (Changing Rules Mid-Fight)
**Type**: Mind Fallacy
**Cost**: 5 EP
**Activation**: After seeing combat rolls, mentalSkill DC 15
**Effect**: Change what type beats what for this round only (e.g., Mind now beats Heart, Heart beats Body, Body beats Mind).
**Cooldown**: Once per combat
**Flavor**: *Player rewrites reality's rules. "Actuallythe way combat REALLY works is..."*
**Why Essential**: Ultimate advantage manipulation. Creates "gotcha" moments.

### 18. **Paralysis of Analysis**
**Type**: Mind Fallacy
**Cost**: 4 EP
**Activation**: Before enemy acts, mentalSkill DC 14
**Effect**: Enemy is "Stunned" - they cannot attack or use fallacies this round, only defend with neutral roll (1d20).
**Cooldown**: 3 rounds
**Flavor**: *Player overwhelms enemy with options and possibilities. "Wait, consider this scenario... and this one... and what if...?"*
**Why Essential**: Hard CC for Mind builds. Creates lockdown potential.

### 19. **Confirmation Bias**
**Type**: Mind Fallacy
**Cost**: 2 EP
**Activation**: Passive, automatic
**Effect**: When you successfully predict enemy's type (via skills or guess), gain +3 to your next combat roll.
**Cooldown**: None
**Flavor**: *Player sees patterns everywhere. "I KNEW you'd do that! Just as I predicted!"*
**Why Essential**: Rewards successful reads. Synergizes with prediction skills.

### 20. **Mala Fides** (Arguing in Bad Faith) ⭐ PRIORITY
**Type**: Mind Fallacy
**Cost**: 3 EP
**Activation**: After seeing types but before rolling, mentalSkill DC 12
**Effect**: Copy enemy's advantage state for yourself (if they have advantage, you gain it too; if neutral, both neutral).
**Cooldown**: 2 rounds
**Flavor**: *Player adopts enemy's tactics dishonestly. "I'll use your own methods against you!"*
**Why Essential**: Provides advantage theft. Creates mirror-match gameplay.

---

## HEART FALLACIES (Social/Diplomatic)
*Require heartSkill checks. Focus on emotions, diplomacy, support, and relationship manipulation.*

### 21. **Appeal to Pity** (Underdog Effect) ⭐ PRIORITY
**Type**: Heart Fallacy
**Cost**: 3 EP
**Activation**: When below 50% HP, heartSkill DC 11
**Effect**: Gain advantage on your next attack AND +2 to Diplomacy Track with that enemy.
**Cooldown**: 2 rounds
**Flavor**: *Player plays up their wounds and suffering. "Look what you've done to me! Have you no mercy?!"*
**Why Essential**: Rewards losing position. Creates comeback + friendship synergy.

### 22. **Affective Fallacy** (Follow Your Heart)
**Type**: Heart Fallacy
**Cost**: 2 EP
**Activation**: Reaction to any logical/tactical enemy ability, heartSkill DC 12
**Effect**: Negate one Mind fallacy targeting you or an ally. Both you and that ally gain +1d4 to next roll.
**Cooldown**: 1 round
**Flavor**: *Player rejects logic with pure emotion. "Your cold calculations mean nothing! This is about feelings!"*
**Why Essential**: Counter-play to Mind builds. Creates Heart vs. Mind rivalry.

### 23. **Diplomatic Gambit** (Olive Branch)
**Type**: Heart Fallacy
**Cost**: 4 EP
**Activation**: As Action instead of attacking, heartSkill DC 13
**Effect**: Add +4 to Diplomacy Track. If enemy accepts (doesn't attack you next round), both gain 5 EP. If enemy refuses, gain +6 to next combat roll against them.
**Cooldown**: 2 rounds
**Flavor**: *Player extends genuine offer of peace. "We don't have to fight! There's another way!"*
**Why Essential**: Makes diplomacy active. Creates prisoner's dilemma gameplay.

### 24. **Empathic Bond** (Shared Suffering)
**Type**: Heart Fallacy
**Cost**: 2 EP per target
**Activation**: Reaction when ally takes damage, heartSkill DC 10
**Effect**: Transfer up to 10 damage from ally to yourself, OR transfer up to 10 HP from yourself to ally.
**Cooldown**: 1 round
**Flavor**: *Player shares pain and life force. "If you hurt them, you hurt me! We stand together!"*
**Why Essential**: Enables healer role. Creates sacrifice gameplay.

### 25. **Bandwagon Fallacy** (Everyone Agrees)
**Type**: Heart Fallacy
**Cost**: 3 EP
**Activation**: Before rolling, heartSkill DC 11 + number of allies
**Effect**: For each ally within Mid/Close zone, gain +1 to combat roll and +1 damage (max +4).
**Cooldown**: 2 rounds
**Flavor**: *Player draws strength from allies. "Everyone's on my side! You're all alone!"*
**Why Essential**: Scales with party size. Creates "strength in numbers" fantasy.

### 26. **Playing on Emotion** (Sob Story)
**Type**: Heart Fallacy
**Cost**: 4 EP
**Activation**: After being hit, heartSkill DC 13
**Effect**: Attacker must roll Wisdom save (DC 12) or become "Hesitant" - disadvantage on attacks against you for 2 rounds. Gain +3 Diplomacy with them.
**Cooldown**: 2 rounds
**Flavor**: *Player makes attacker feel guilty. "How could you? After all we've been through?!"*
**Why Essential**: Defensive debuff for Heart. Creates guilt-trip mechanics.

### 27. **Appeal to Heaven** (Divine Right)
**Type**: Heart Fallacy
**Cost**: 6 EP
**Activation**: Once per combat, heartSkill DC 16
**Effect**: Automatically succeed next combat roll (still roll damage normally). Gain +5 to Diplomacy with all enemies who witness it.
**Cooldown**: Once per combat
**Flavor**: *Player channels higher power or destiny. "The universe itself fights beside me!"*
**Why Essential**: Provides clutch moment. Creates "chosen one" fantasy.

### 28. **Just Plain Folks** (Humble Relatability)
**Type**: Heart Fallacy
**Cost**: 2 EP
**Activation**: Before combat starts, heartSkill DC 10
**Effect**: Start combat with +5 on Diplomacy Track. If you defend in first round, gain +8 instead.
**Cooldown**: Once per combat
**Flavor**: *Player presents as non-threatening. "I'm just like you! We're the same!"*
**Why Essential**: Accelerates friendship path. Creates pacifist builds.

### 29. **Pollyanna Principle** (They're Just Like Us)
**Type**: Heart Fallacy
**Cost**: 3 EP
**Activation**: As Action, heartSkill DC 12
**Effect**: Learn enemy's motivations and one stat. Gain +2 to Diplomacy Track. If Diplomacy reaches +6, enemy becomes non-hostile.
**Cooldown**: 1 round
**Flavor**: *Player sees humanity in enemy. "You're not evil! You're hurting, just like me!"*
**Why Essential**: Information + diplomacy combo. Creates redemption arcs.

### 30. **Blood is Thicker Than Water** (Loyalty Bond) ⭐ PRIORITY
**Type**: Heart Fallacy
**Cost**: 4 EP
**Activation**: Passive aura, heartSkill DC 10 to activate
**Effect**: Choose one ally. When either of you is attacked, the other may spend their reaction to grant +2 to defense roll. Both gain +1d4 to damage when attacking same target.
**Cooldown**: Lasts until end of combat (one use per combat)
**Flavor**: *Player forges unbreakable bond. "We fight as one! An attack on them is an attack on me!"*
**Why Essential**: Creates duo tactics. Enables "bond" playstyle.

---

## IMPLEMENTATION PRIORITY

### ⭐ TIER S - Implement First (Core Identity)
These fallacies define their stat's identity and fix critical gaps:

**Body:**
1. **Argumentum ad Baculum** - Intimidation and disadvantage infliction
2. **Mortification** - Risk/reward HP-for-power mechanic

**Mind:**
3. **Straw Man** - Advantage inversion (signature Mind ability)
4. **Mala Fides** - Advantage theft and copy

**Heart:**
5. **Appeal to Pity** - Underdog comeback mechanic
6. **Diplomatic Gambit** - Active diplomacy system
7. **Blood is Thicker Than Water** - Party synergy core

### TIER A - Implement Second (Tactical Depth)
- False Dilemma, Cognitive Prediction, Equivocation (Mind prediction/control)
- Ableism, Brute Force (Body finishers)
- Empathic Bond, Bandwagon (Heart support)

### TIER B - Implement Third (Polish & Variety)
- All remaining fallacies add flavor and build variety

---

## STAT INTERACTION DETAILS

**physicalSkill** (Used for Body Fallacies):
- Affects: Success rate of intimidation, force-based effects, physical dominance
- Scales: Damage bonuses, intimidation DC, force effects
- Counter Stat: Enemy's mentalSkill (resists physical intimidation)

**mentalSkill** (Used for Mind Fallacies):
- Affects: Success rate of deception, prediction, advantage manipulation
- Scales: Information gathering, confusion duration, advantage theft effectiveness
- Counter Stat: Enemy's heartSkill (resists cold logic with emotion)

**heartSkill** (Used for Heart Fallacies):
- Affects: Success rate of diplomacy, emotional manipulation, support effects
- Scales: Healing amounts, diplomacy gains, buff strength
- Counter Stat: Enemy's physicalSkill (resists emotion with raw force)

**Rock-Paper-Scissors of Skills**:
- Body fallacies beat Heart fallacies (force > emotion)
- Heart fallacies beat Mind fallacies (emotion > logic)
- Mind fallacies beat Body fallacies (intelligence > brute force)

---

## ADVANTAGE MANIPULATION SUMMARY

**Advantage Inversion**: Straw Man
**Advantage Theft**: Mala Fides, Equivocation
**Advantage Granting**: Ableism, Appeal to Pity, Bandwagon
**Disadvantage Infliction**: Argumentum ad Baculum, Gaslighting, Playing on Emotion
**Advantage Negation**: Brute Force (forces neutral rolls)
**Type Manipulation**: False Dilemma (limits choices), Equivocation (changes your type)
**Ultimate Advantage**: Moving the Goalposts (changes entire type triangle), Appeal to Heaven (auto-success)

---

## DESIGN PHILOSOPHY

**Thematic Cohesion**: Every fallacy matches its logical fallacy definition
- Straw Man = misrepresenting opponent's position → inverting advantage
- Gaslighting = making someone doubt reality → disadvantage after hitting
- Circular Reasoning = creating logical loops → confusion status

**Mechanical Distinctness**: No two fallacies feel the same
- Body focuses on damage and intimidation
- Mind focuses on advantage manipulation and information
- Heart focuses on diplomacy and support

**Counterplay Exists**: Every strategy has counters
- Advantage manipulation countered by neutral-forcing effects
- Prediction countered by random abilities
- Diplomacy countered by forced aggression

**Resource Management**: EP costs force meaningful choices
- Can't spam best ability
- Must manage cooldowns
- Creates decision points every turn

**Narrative Integration**: Every fallacy tells a story
- "I use Straw Man" → "I twist your argument against you!"
- Creates memorable combat moments
- Players can describe actions, not just mechanics

---

## TESTING RECOMMENDATIONS

1. **Start with 10 fallacies** (all Tier S + 3 more)
2. **Playtest each stat category separately** first
3. **Monitor advantage manipulation frequency** - should happen ~40% of turns
4. **Track fallacy diversity** - no single fallacy should be >30% of uses
5. **Measure combat length** - aim for 5-8 rounds average
6. **Test skill stat scaling** - should be meaningful but not overwhelming
7. **Validate counterplay** - every dominant strategy should have counter
8. **Narrative test** - can players describe what's happening thematically?

---

*This document synthesizes research from D&D 5E, Pathfinder 2E, FATE Core, Burning Wheel, D&D 4E, Lancer, Star Wars RPG, and the complete logical fallacies reference to create a thematically rich, mechanically sound skill system.*
