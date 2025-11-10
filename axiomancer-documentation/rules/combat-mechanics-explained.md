# Combat Mechanics - Comprehensive Explanation

## Core Concept

Axiomancer's combat system fuses Rock-Paper-Scissors strategy with D&D-style dice mechanics. At its heart, combat is about **type advantage** (which combat type beats which) combined with **dice rolls** (introducing chance and drama).

**The Triangle of Combat Types**:
```
    HEART
    /   \
   /     \
  /       \
BODY ─── MIND
```

- **Heart beats Body** (emotion triumphs over brute force)
- **Body beats Mind** (force overcomes cunning)
- **Mind beats Heart** (logic defeats emotion)

---

## The Two Stat Systems

### Decision Stats (Body, Mind, Heart)
These stats power your **base combat actions** - attacking and defending. Every player has all three decision stats at varying levels.

**When Used**:
- Added to combat rolls when attacking or defending
- Added to damage calculations
- Determine your defenses (Physical Defense, Mental Defense, Heart Defense)

**Example**: A character with Body 5, Mind 3, Heart 7 uses:
- Body 5 when making/defending Body attacks
- Mind 3 when making/defending Mind attacks
- Heart 7 when making/defending Heart attacks

### Skill Stats (physicalSkill, mentalSkill, heartSkill)
These stats power your **fallacy skills** - special abilities that manipulate combat advantage, deal extra damage, or create unique effects.

**When Used**:
- ONLY when activating a fallacy skill
- Rolled against a DC to determine if the fallacy succeeds
- Do NOT affect base combat in any way

**Example**: A character with physicalSkill 4 who wants to use "Argumentum ad Baculum" (Body fallacy):
- Rolls 1d20 + 4 vs. DC 12
- If successful, the fallacy effect activates
- Base combat rolls still use Body decision stat, not physicalSkill

**Critical Distinction**: You could have high Body (good at physical combat) but low physicalSkill (bad at physical fallacies), or vice versa.

---

## Combat Round Structure

Each combat round follows this sequence:

### 1. **Choose Type & Action**
Both combatants secretly choose:
- **Attack** (Body/Mind/Heart) - Attempt to damage opponent
- **Defend** (Body/Mind/Heart) - Protect yourself with enhanced defenses

**Optional**: Activate a fallacy skill (if you have EP and meet requirements)

### 2. **Reveal Choices Simultaneously**
Both players reveal their choices at the same time.

### 3. **Determine Advantage**
Based on the type triangle, determine who has advantage:

**Advantage States**:
- ✅ **Advantage**: Your type beats theirs (roll 2d20, take highest)
- ⚖️ **Neutral**: Same type chosen (roll 1d20)
- ❌ **Disadvantage**: Their type beats yours (roll 2d20, take lowest)

### 4. **Resolve Combat Roll**
Different rules apply based on what actions were chosen:

---

## Attack vs. Attack Resolution

When both combatants attack, they compete to see who lands their blow first.

### Step 1: Combat Roll
Both players roll based on their advantage state:

**Attacker with Advantage** (your type beats theirs):
- Roll 2d20, take the higher result
- Add your decision stat (the one matching your chosen type)
- Example: Body attack with Body 5 → roll 2d20 (gets 17, 8), take 17 + 5 = **22**

**Attacker with Neutral** (same types):
- Roll 1d20
- Add your decision stat
- Example: Mind attack with Mind 6 → roll 1d20 (gets 11) + 6 = **17**

**Attacker with Disadvantage** (their type beats yours):
- Roll 2d20, take the lower result
- Add your decision stat
- Example: Heart attack with Heart 4 → roll 2d20 (gets 14, 7), take 7 + 4 = **11**

### Step 2: Determine Winner
Whoever rolled higher **wins the exchange** and gets to roll damage. Loser takes damage but deals none.

### Step 3: Damage Roll
The winner rolls for damage based on their advantage state:

**Winner with Advantage**:
- Roll 2d20, take higher result
- Add your decision stat
- Subtract enemy's matching defense
- Example: Body attack winner with Body 5 vs. enemy with 10 Physical Defense
  - Roll 2d20 (gets 18, 9), take 18 + 5 = 23
  - 23 - 10 = **13 damage dealt**

**Winner with Neutral**:
- Roll 1d20
- Add your decision stat
- Subtract enemy's matching defense
- Example: Mind attack winner with Mind 6 vs. enemy with 12 Mental Defense
  - Roll 1d20 (gets 4) + 6 = 10
  - 10 - 12 = -2 → **0 damage** (negatives round to 0)

**Winner with Disadvantage** (you won despite disadvantage!):
- Roll 2d20, take lower result
- Add your decision stat
- Subtract enemy's matching defense
- Example: Heart attack winner with Heart 4 vs. enemy with 8 Heart Defense
  - Roll 2d20 (gets 15, 11), take 11 + 4 = 15
  - 15 - 8 = **7 damage dealt**

**Defense Matching**: Damage is always subtracted from the defender's defense of the **attacker's chosen type**:
- Body attack → subtract Physical Defense
- Mind attack → subtract Mental Defense
- Heart attack → subtract Heart Defense

---

## Attack vs. Defense Resolution

When attacker faces defender, the attacker **automatically hits** - no combat roll contest. However, defender gains significant defensive bonuses.

### Defender Bonuses
**1.5x Defense Multiplier**: Defender's defense stat is multiplied by 1.5 (round down).

**Example**: Enemy has 10 Physical Defense
- When defending: 10 × 1.5 = **15 Physical Defense**

### Advantage Still Matters

**Attacker with Advantage** (attack type beats defense type):
- Roll 2d20 for damage, take higher
- Add your decision stat
- Subtract defender's **attacker's type defense × 1.5**
- **Special Rule**: Defender uses YOUR type's defense, not theirs!

**Example**:
- You use Body attack (Body 5)
- Enemy defends with Mind defense
- You have advantage (Body > Mind)
- Enemy has Physical Defense 10, Mental Defense 8
- Roll 2d20 damage (gets 16, 9), take 16 + 5 = 21
- Subtract enemy's **Physical Defense × 1.5** = 10 × 1.5 = 15
- 21 - 15 = **6 damage dealt**

**Attacker with Neutral** (same types):
- Roll 1d20 for damage
- Add your decision stat
- Subtract defender's **defense × 1.5**

**Example**:
- You use Body attack (Body 5)
- Enemy defends with Body defense (Physical Defense 10)
- Roll 1d20 damage (gets 8) + 5 = 13
- Subtract 10 × 1.5 = 15
- 13 - 15 = -2 → **0 damage**

**Attacker with Disadvantage** (defense type beats attack type):
- Roll 2d20 for damage, take lower
- Add your decision stat
- Subtract defender's **their own type defense × 1.5**

**Example**:
- You use Body attack (Body 5)
- Enemy defends with Heart defense (Heart Defense 12)
- You have disadvantage (Heart > Body)
- Roll 2d20 damage (gets 18, 7), take 7 + 5 = 12
- Subtract 12 × 1.5 = 18
- 12 - 18 = -6 → **0 damage**

### Key Insight
Defending is powerful but passive - you take reduced/no damage but can't damage the enemy. You're buying time, not winning the fight.

---

## Defense vs. Defense Resolution

When both combatants defend, **no damage occurs** and the **Friendly Counter** increments.

### Friendly Counter System

**What It Tracks**: Each time both players defend, it signals neither wants to fight aggressively. This represents de-escalation.

**Counter Values**:
- Start of combat: Friendly Counter = 0
- Each Defense vs. Defense: +1 to Friendly Counter
- If Friendly Counter reaches **3**: Combat ends peacefully

### Peaceful Resolution (Counter = 3)
When the Friendly Counter hits 3:
1. Combat immediately ends
2. Both combatants become friendly (or at least non-hostile)
3. UI shows both portraits side-by-side with a smiley face
4. Players can continue their adventure together or part ways amicably

**Narrative Meaning**: Three mutual defenses means "we don't actually want to hurt each other" - the fight fizzles into mutual respect or understanding.

### Strategic Implications
- Defending is safer but defensive
- If you want to befriend enemies, defend repeatedly
- If enemy keeps defending, you can attack safely (they take 1.5x defense)
- If both want peace, three rounds of mutual defense ends combat

---

## Fallacy Skills (Advanced Combat)

Fallacies are special abilities that cost **Essence Points (EP)** and require **skill stat checks** to activate.

### Activation Process

**Step 1: Declare Fallacy Use**
Announce which fallacy you're using and when (timing varies per fallacy).

**Common Timings**:
- "Before rolling" - Before combat/damage rolls
- "After seeing types" - After reveals but before rolls
- "Reaction" - In response to enemy action
- "As Action" - Instead of attacking/defending this turn

**Step 2: Pay EP Cost**
Spend the required Essence Points (typically 2-6 EP).

**Step 3: Make Skill Check**
Roll 1d20 + [matching skill stat] vs. DC:
- **Body Fallacy**: 1d20 + physicalSkill vs. DC
- **Mind Fallacy**: 1d20 + mentalSkill vs. DC
- **Heart Fallacy**: 1d20 + heartSkill vs. DC

**Common DCs**:
- DC 10-12: Easy fallacies or unopposed
- DC 13-14: Moderate fallacies
- DC 15+: Powerful/game-changing fallacies
- DC 10 + enemy counter-stat: Contested checks

**Step 4: Apply Effect**
If successful, the fallacy's effect activates immediately.

### Example Fallacies in Action

**Straw Man (Mind Fallacy)**:
- **Cost**: 4 EP
- **Timing**: After seeing types but before rolling
- **Check**: 1d20 + mentalSkill vs. DC 13
- **Effect**: Invert advantage - if you have disadvantage, gain advantage instead. If enemy has advantage, they gain disadvantage.
- **Scenario**:
  - You chose Mind attack, enemy chose Heart attack (you have disadvantage)
  - Activate Straw Man: roll 1d20 + mentalSkill (gets 14) vs. DC 13 → Success!
  - Your disadvantage becomes advantage (roll 2d20 take highest)
  - Enemy's advantage becomes disadvantage

**Argumentum ad Baculum (Body Fallacy)**:
- **Cost**: 4 EP
- **Timing**: Before rolling
- **Check**: 1d20 + physicalSkill vs. DC 12
- **Effect**: Force opponent to reroll their combat roll with disadvantage. Deal +1d6 damage on hit.
- **Scenario**:
  - Both chose Attack
  - Activate before combat rolls
  - Enemy must roll their combat roll with disadvantage (2d20 take lowest)
  - If you win and hit, add +1d6 to your damage

**Diplomatic Gambit (Heart Fallacy)**:
- **Cost**: 4 EP
- **Timing**: As Action (instead of attacking)
- **Check**: 1d20 + heartSkill vs. DC 13
- **Effect**: Add +4 to Diplomacy Track. If enemy doesn't attack you next round, both gain 5 EP. If they do attack, you gain +6 to combat roll against them.
- **Scenario**:
  - Use as your action (you don't attack/defend this round)
  - Success adds +4 to peaceful resolution progress
  - Creates prisoner's dilemma: enemy must choose to accept peace or betray you

### Fallacy Strategy

**Body Fallacies**: Damage amplification, intimidation, area attacks, finishing moves
- Best for: Aggressive fighters, damage dealers, tanks
- Counter Stat: Enemy mentalSkill resists physical intimidation

**Mind Fallacies**: Advantage manipulation, prediction, confusion, type control
- Best for: Tacticians, controllers, tricksters
- Counter Stat: Enemy heartSkill resists cold logic with emotion

**Heart Fallacies**: Diplomacy, support, emotional manipulation, party buffs
- Best for: Healers, diplomats, support characters
- Counter Stat: Enemy physicalSkill resists emotion with force

---

## Advanced Tactics

### Reading the Type Triangle
**When You Should Attack**:
- You have type advantage (your type beats theirs)
- Enemy is low on HP (finish them)
- You have a damage-boosting fallacy ready

**When You Should Defend**:
- You're at low HP and need to survive
- Enemy has type advantage on you
- You're trying to befriend enemy (Friendly Counter strategy)
- You have defensive fallacies (counterattack, thorns damage)

### Type Prediction Mind-Games
Since choices are revealed simultaneously, combat becomes psychological:

**Pattern Breaking**:
- Enemy expects you to repeat your last choice → switch types
- Enemy expects you to switch → repeat your choice

**Baiting**:
- Show pattern for 2 rounds → make enemy predict pattern → break pattern on round 3

**Fallacy Combos**:
- Use "False Dilemma" (Mind) to limit enemy to 2 types → you know exactly what they'll pick
- Use "Cognitive Prediction" (Mind) to see their last choice → predict their next
- Use "Appeasement" (Body) to force their next choice → guarantee your advantage

### Resource Management (EP)
Essence Points are limited, so spend wisely:

**When to Spend EP**:
- Critical moments (low HP, must win this exchange)
- Setting up combos (use prediction → guarantee advantage → use damage boost)
- Preventing enemy fallacies (Nullify, Affective Fallacy)

**When to Save EP**:
- You already have advantage naturally
- Enemy is low and will die soon anyway
- Building resources for ultimate fallacy (Appeal to Heaven, Perfect Focus)

### Diplomacy Track Strategy

The Friendly Counter (Defense vs. Defense) represents one path to peace. The **Diplomacy Track** (from fallacy enhancements) is a more granular system:

**Diplomacy Track**: Ranges from -10 (Fight to Death) to +10 (Permanent Ally)

**Building Diplomacy**:
- Use Heart fallacies (Diplomatic Gambit, Appeal to Pity, Just Plain Folks)
- Defend repeatedly (shows you don't want to hurt them)
- Take damage without retaliating (Appeal to Pity triggers)

**Breaking Diplomacy**:
- Aggressive attacks reduce Diplomacy
- Body fallacies that intimidate lower Diplomacy
- Breaking promises (using Diplomatic Gambit then attacking) severely damages Diplomacy

**Thresholds**:
- +10: Enemy joins your party
- +6 to +9: Temporary truce, can negotiate
- +3 to +5: Hesitant, diplomacy possible
- 0 to +2: Neutral combat
- -3 to -9: Increasingly hostile
- -10: Fight to death, no mercy

---

## Damage and HP

### Taking Damage
When you take damage from a successful attack:
1. Subtract calculated damage from your HP
2. If HP reaches 0, you're defeated (knocked out, captured, or killed depending on narrative)

### Negative Damage = 0
If damage calculation results in negative numbers, round up to 0 damage.

**Example**: Attack deals 7 damage, defender has 10 defense × 1.5 = 15
- 7 - 15 = -8 → **0 damage dealt**

This is common when:
- Attacker has disadvantage
- Defender has high defense and is defending
- Attacker rolls poorly on damage

---

## Example Combat: Full Round Breakdown

**Characters**:
- **Player**: Body 6, Mind 4, Heart 5, Physical Defense 12, Mental Defense 10, Heart Defense 11
- **Enemy**: Body 5, Mind 7, Heart 4, Physical Defense 10, Mental Defense 14, Heart Defense 9

### Round 1

**Choices**:
- Player: Mind Attack
- Enemy: Body Attack

**Advantage**: Body > Mind, so enemy has advantage

**Combat Roll**:
- Player rolls: 1d20 (13) + 4 = **17**
- Enemy rolls: 2d20 (16, 8), takes 16 + 5 = **21**

**Winner**: Enemy (21 > 17)

**Damage Roll**:
- Enemy has advantage, rolls 2d20 (19, 7), takes 19 + 5 = 24
- Subtract Player's Physical Defense: 24 - 12 = **12 damage to Player**

**Result**: Player takes 12 damage from enemy's brutal Body attack.

---

### Round 2

**Choices**:
- Player: Body Attack (switching types)
- Enemy: Mind Defense

**Advantage**: Body > Mind, Player has advantage (attacking vs. defending)

**Damage Roll** (attacker auto-hits vs. defender):
- Player has advantage, rolls 2d20 (14, 6), takes 14 + 6 = 20
- Enemy defends with Mind but Player has advantage → use Physical Defense × 1.5
- Subtract 10 × 1.5 = 15
- 20 - 15 = **5 damage to Enemy**

**Result**: Player deals 5 damage. Enemy's defensive tactic reduces damage significantly.

---

### Round 3

**Choices**:
- Player: Heart Defense (low HP, needs to survive)
- Enemy: Heart Defense (also defensive)

**Advantage**: N/A (both defending)

**Result**: No damage. Friendly Counter increases to 1. Combat de-escalates slightly.

---

### Round 4

**Choices**:
- Player uses **Straw Man** (Mind Fallacy, 4 EP) + Mind Attack
- Enemy: Heart Attack

**Advantage Check**: Heart > Mind, enemy should have advantage

**Straw Man Activation**:
- Player rolls: 1d20 + mentalSkill (let's say 5) = 1d20 + 5 → gets 16 vs. DC 13 → **Success!**
- Advantage inverts: Enemy's advantage becomes disadvantage, Player's disadvantage becomes advantage

**Combat Roll**:
- Player rolls (now with advantage): 2d20 (18, 11), takes 18 + 4 = **22**
- Enemy rolls (now with disadvantage): 2d20 (15, 9), takes 9 + 4 = **13**

**Winner**: Player (22 > 13)

**Damage Roll**:
- Player has advantage, rolls 2d20 (12, 8), takes 12 + 4 = 16
- Subtract Enemy's Mental Defense: 16 - 14 = **2 damage to Enemy**

**Result**: Through clever fallacy use, Player turned a losing matchup into a win and dealt 2 damage.

---

## Summary: Combat Flow Chart

```
1. CHOOSE TYPE & ACTION
   ↓
2. REVEAL SIMULTANEOUSLY
   ↓
3. DETERMINE ADVANTAGE (type triangle)
   ↓
4. BRANCH:

   ATTACK vs. ATTACK:
   → Combat rolls (winner determined)
   → Winner rolls damage
   → Subtract defense

   ATTACK vs. DEFENSE:
   → No combat roll (auto-hit)
   → Attacker rolls damage
   → Subtract defense × 1.5

   DEFENSE vs. DEFENSE:
   → No combat roll
   → No damage
   → Friendly Counter +1
   → If Counter = 3: Combat ends peacefully
```

---

## Design Strengths

**1. Accessibility**: RPS is instantly understandable, even for non-gamers
**2. Depth**: Advantage system, fallacies, and EP management create tactical complexity
**3. Narrative Integration**: Friendly Counter and Diplomacy create story-driven combat resolutions
**4. Risk/Reward**: Defending is safe but passive; attacking is risky but rewarding
**5. Mind-Games**: Simultaneous choice creates prediction gameplay
**6. Fallacy Theming**: Logical fallacies as combat abilities creates unique thematic cohesion

---

## Quick Reference Tables

### Type Triangle
| Your Type | Enemy Type | Result |
|-----------|------------|--------|
| Heart | Body | Advantage (2d20 high) |
| Body | Mind | Advantage (2d20 high) |
| Mind | Heart | Advantage (2d20 high) |
| Same | Same | Neutral (1d20) |
| Body | Heart | Disadvantage (2d20 low) |
| Mind | Body | Disadvantage (2d20 low) |
| Heart | Mind | Disadvantage (2d20 low) |

### Combat Roll Modifiers
| Situation | Combat Roll |
|-----------|-------------|
| Advantage | 2d20 + decision stat (take higher) |
| Neutral | 1d20 + decision stat |
| Disadvantage | 2d20 + decision stat (take lower) |

### Damage Roll Modifiers
| Situation | Damage Roll |
|-----------|-------------|
| Advantage | 2d20 + decision stat (take higher) |
| Neutral | 1d20 + decision stat |
| Disadvantage | 2d20 + decision stat (take lower) |
| Vs. Defender | Subtract defense × 1.5 |
| Vs. Attacker | Subtract normal defense |

### Friendly Counter
| Counter | Effect |
|---------|--------|
| 0-2 | Normal combat |
| 3 | Combat ends peacefully, both become friendly |

---

*This document provides a complete explanation of Axiomancer's combat system, from basic mechanics to advanced fallacy tactics. Combat blends strategic type selection, dice-driven chance, and narrative-rich fallacy skills to create a unique TTRPG experience.*
