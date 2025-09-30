# Axiomancer Combat System Integration Guide

## Overview

This guide explains how to integrate the new combat system components - `fallacySpellbook.ts`, `statusEffects.ts`, and `equipmentItems.ts` - into the existing Axiomancer game architecture. These components work together to create a philosophically rich, psychologically devastating combat experience.

## Architecture Overview

### Core Components

1. **`fallacySpellbook.ts`** - Contains 100+ logical fallacies as combat skills
2. **`statusEffects.ts`** - Manages all buffs, debuffs, and status effects
3. **`equipmentItems.ts`** - Provides weapons, armor, and accessories
4. **`combatMechanics.ts`** - Core combat logic and resolution
5. **`buffDebuffEngine.ts`** - Status effect processing

### Integration Points

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Fallacy       │    │   Status         │    │   Equipment     │
│   Spellbook     │◄──►│   Effects        │◄──►│   Items         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Combat        │    │   Buff/Debuff    │    │   Character     │
│   Mechanics     │◄──►│   Engine         │◄──►│   Stats         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Detailed Integration Guide

### 1. Importing and Using the Fallacy Spellbook

#### Basic Usage
```typescript
import { fallacySpellbook } from '../utils/fallacySpellbook';

// Get all available fallacies
const allFallacies = Object.values(fallacySpellbook);

// Filter by philosophical aspect
const mindFallacies = Object.values(fallacySpellbook)
  .filter(skill => skill.philosophicalAspect === 'mind');

// Get specific fallacy
const adHominem = fallacySpellbook.ad_hominem;
```

#### Learning Requirements
Each fallacy has learning requirements:
```typescript
// Check if character can learn a fallacy
const canLearn = canLearnSkill(character, 'ad_hominem');

// Learn the fallacy
if (canLearn) {
  character.skills.push(fallacySpellbook.ad_hominem);
}
```

### 2. Status Effects Integration

#### Creating Status Effects
```typescript
import {
  createDogmaticCertaintyDebuff,
  createLogicImmunityBuff,
  createMindAttackBuff
} from '../utils/statusEffects';

// Create specific status effects
const dogmaticDebuff = createDogmaticCertaintyDebuff();
const logicBuff = createLogicImmunityBuff();
const mindAttackBuff = createMindAttackBuff(25);
```

#### Applying Effects in Combat
```typescript
import { applyStatusEffect } from '../utils/statusEffects';

// Apply effect to target
const messages = applyStatusEffect(target, dogmaticDebuff, 'attacker');

// Process effects each round
const roundMessages = processStatusEffects(combatant);
```

#### Combat Integration
```typescript
// In combat mechanics, status effects are applied automatically
const result = executeCombatAction(
  attacker,
  defender,
  'mind', // philosophical aspect
  'attack',
  hasAdvantage
);

// Status effects are applied based on combat results
if (result.effects.includes('dogmatic_certainty')) {
  applyStatusEffect(defender, createDogmaticCertaintyDebuff());
}
```

### 3. Equipment Integration

#### Basic Equipment Usage
```typescript
import { equipmentItems, getAvailableEquipment } from '../utils/equipmentItems';

// Get equipment available to character
const availableEquipment = getAvailableEquipment(character);

// Equip an item
const weapon = equipmentItems.broken_compass;
character.equipment.push(weapon);
```

#### Equipment Bonuses
```typescript
import { calculateEquipmentBonuses } from '../utils/equipmentItems';

// Calculate bonuses for combat
const bonuses = calculateEquipmentBonuses(character.equipment, 'mind');

// Apply bonuses to derived stats
character.derivedStats.mindAttack += bonuses.statBonuses.mindAttack || 0;
```

### 4. Combat System Integration

#### Core Combat Loop
```typescript
// 1. Player selects action
const playerChoice = {
  aspect: 'heart',
  action: 'attack',
  selectedSkill: 'ad_hominem'
};

// 2. Execute combat action
const result = executeCombatAction(
  player,
  enemy,
  playerChoice.aspect,
  playerChoice.action,
  hasAdvantage
);

// 3. Apply status effects
result.effects.forEach(effectId => {
  const effect = createStatusEffect(effectId);
  applyStatusEffect(target, effect);
});

// 4. Process ongoing effects
processStatusEffects(player);
processStatusEffects(enemy);
```

#### Status Effect Processing
```typescript
// Each combat round, process all active effects
function processCombatRound() {
  // Apply damage from ongoing effects
  combatants.forEach(combatant => {
    const messages = processStatusEffects(combatant);
    // Update UI with messages
  });

  // Remove expired effects
  combatants.forEach(combatant => {
    combatant.buffs = combatant.buffs.filter(buff => buff.remainingTurns > 0);
    combatant.debuffs = combatant.debuffs.filter(debuff => debuff.remainingTurns > 0);
  });
}
```

### 5. UI Integration

#### Displaying Status Effects
```typescript
// In React components
const StatusEffectDisplay = ({ combatant }) => {
  return (
    <div className="status-effects">
      {/* Buffs */}
      {combatant.buffs.map(buff => (
        <div key={buff.id} className="buff" style={{ borderColor: 'green' }}>
          <span className="icon">{buff.icon}</span>
          <span className="name">{buff.name}</span>
          <span className="duration">{buff.remainingTurns}</span>
        </div>
      ))}

      {/* Debuffs */}
      {combatant.debuffs.map(debuff => (
        <div key={debuff.id} className="debuff" style={{ borderColor: 'red' }}>
          <span className="icon">{debuff.icon}</span>
          <span className="name">{debuff.name}</span>
          <span className="duration">{debuff.remainingTurns}</span>
        </div>
      ))}
    </div>
  );
};
```

#### Skill Selection UI
```typescript
const SkillSelector = ({ character, onSkillSelect }) => {
  const availableSkills = getAvailableSkills(character);

  return (
    <div className="skill-selector">
      {availableSkills.map(skill => (
        <button
          key={skill.id}
          onClick={() => onSkillSelect(skill)}
          disabled={character.mana < skill.manaCost}
        >
          <span className="icon">{skill.icon}</span>
          <span className="name">{skill.name}</span>
          <span className="cost">{skill.manaCost} MP</span>
        </button>
      ))}
    </div>
  );
};
```

### 6. Data Flow Architecture

#### Character Creation
```typescript
// When creating a character
const newCharacter = {
  ...baseCharacter,
  skills: [], // Start with no skills
  equipment: [], // Start with no equipment
  buffs: [], // Start with no active effects
  debuffs: [] // Start with no active effects
};

// Learn initial skills based on philosophical stance
const availableSkills = getAvailableSkills(newCharacter);
newCharacter.skills = availableSkills.slice(0, 3); // Start with 3 skills
```

#### Combat Resolution
```typescript
// 1. Determine combat result
const combatResult = resolveCombatAction(playerChoice, enemyChoice);

// 2. Apply immediate effects
combatResult.effects.forEach(effect => {
  const statusEffect = createStatusEffect(effect.id);
  applyStatusEffect(combatResult.target, statusEffect);
});

// 3. Apply equipment bonuses
const equipmentBonuses = calculateEquipmentBonuses(player.equipment);
combatResult.damage += equipmentBonuses.statBonuses.physicalAttack || 0;

// 4. Process ongoing effects
const effectMessages = processStatusEffects(player);
const enemyEffectMessages = processStatusEffects(enemy);
```

### 7. Advanced Features

#### Equipment Compatibility
```typescript
// Check if equipment complements skills
const complementaryEquipment = getComplementaryEquipment('gaslighting');

// Auto-equip complementary items
character.equipment = [
  ...character.equipment,
  ...complementaryEquipment.slice(0, 2) // Equip up to 2 complementary items
];
```

#### Status Effect Stacking
```typescript
// Some effects can stack
const selfLoathingDebuff = createSelfLoathingDebuff(15);
if (target.debuffs.some(d => d.id === 'self_loathing')) {
  // Stack the effect instead of replacing
  const existingEffect = target.debuffs.find(d => d.id === 'self_loathing');
  existingEffect.currentStacks++;
  existingEffect.remainingTurns = Math.max(existingEffect.remainingTurns, selfLoathingDebuff.duration);
} else {
  applyStatusEffect(target, selfLoathingDebuff);
}
```

### 8. Error Handling and Edge Cases

#### Invalid Status Effects
```typescript
// Handle missing status effects gracefully
try {
  const effect = createStatusEffect(effectId);
  applyStatusEffect(target, effect);
} catch (error) {
  console.warn(`Unknown status effect: ${effectId}`);
}
```

#### Equipment Validation
```typescript
// Validate equipment before applying bonuses
const validEquipment = character.equipment.filter(item =>
  equipmentItems[item.id] !== undefined
);

const bonuses = calculateEquipmentBonuses(validEquipment);
```

### 9. Performance Considerations

#### Effect Processing Optimization
```typescript
// Process effects in batches
function processAllEffects(combatants) {
  combatants.forEach(combatant => {
    const messages = processStatusEffects(combatant);
    // Batch update UI with messages
  });
}
```

#### Memory Management
```typescript
// Clean up expired effects regularly
function cleanupExpiredEffects(combatants) {
  combatants.forEach(combatant => {
    combatant.buffs = combatant.buffs.filter(buff => buff.remainingTurns > 0);
    combatant.debuffs = combatant.debuffs.filter(debuff => debuff.remainingTurns > 0);
  });
}
```

### 10. Testing and Debugging

#### Test Status Effect Application
```typescript
// Test individual status effects
const testEffect = createDogmaticCertaintyDebuff();
const testMessages = applyStatusEffect(testCharacter, testEffect);
console.log('Applied effect:', testMessages);
```

#### Combat Simulation
```typescript
// Simulate combat rounds
for (let round = 1; round <= 10; round++) {
  const messages = processCombatRound();
  console.log(`Round ${round}:`, messages);

  if (isCombatOver()) break;
}
```

## Summary

The integration creates a deeply philosophical combat system where:

- **Fallacies** provide the core combat skills with bleak psychological effects
- **Status Effects** represent the ongoing mental and emotional consequences
- **Equipment** enhances philosophical capabilities and provides strategic depth
- **Combat Mechanics** tie everything together with the rock-paper-scissors system

This creates a combat experience that's not just about dealing damage, but about engaging in a psychologically devastating philosophical battle where every action has profound emotional and intellectual consequences.
