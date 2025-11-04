# System Encapsulation Summary

## Overview

This document explains how the buff/debuff, equipment, and loot systems have been encapsulated to keep the codebase simple while preserving the work for future use.

## The Problem

You initially implemented buffs, equipment, and loot systems congruently, which led to:
- Types bleeding into core game types (Character, Enemy, GameState)
- Tight coupling making it hard to work on simpler features
- Complexity that wasn't needed yet

## The Solution: Encapsulation

These systems are now **completely isolated** in their own type files and only used by specific components/utilities.

---

## 🎯 Core Principle

**Core types (Character, Enemy, GameState) have ZERO dependencies on buff/equipment systems.**

This means you can:
- Work on core gameplay without thinking about these systems
- Plug them back in when ready
- Test and develop them independently

---

## 📦 Encapsulated Systems

### 1. Buff/Debuff System

**Location**: `/axiomancer-frontend/src/types/buffs.ts`

**Exported Types**:
- `BuffDebuff`
- `BuffDebuffEffect`
- `CombatantBuffs`
- `StatusEffectName`

**Used ONLY in**:
- `src/utils/buffDebuffEngine.ts`
- `src/utils/combatEffectBridge.ts`
- `src/utils/combatVisuals.ts`
- `src/utils/persistentEffects.ts`
- `src/utils/combatStateManager.ts`
- `src/utils/combatMechanics.ts`
- `src/utils/statusEffects.ts`

**NOT used in**:
- ❌ Character type
- ❌ Enemy type  
- ❌ GameState
- ❌ Any core game types

### 2. Equipment & Loot System

**Location**: `/axiomancer-frontend/src/types/equipment.ts`

**Exported Types**:
- `Equipment`
- `Item`
- `EquipmentSlot`
- `EquipmentType`
- `ItemType`
- `EquippedItems`
- `InventoryCategories` (marked as @planned)

**Used ONLY in**:
- `src/components/game/InventoryScreen.tsx` (Equipment UI)
- `src/stores/gameStore.ts` (Equipment management actions)
- `src/utils/equipmentItems.ts` (Equipment definitions)
- `src/utils/statCalculations.ts` (Equipment stat bonuses)

**NOT used in**:
- ❌ Character type (no inventory/equippedItems properties)
- ❌ Enemy type (no loot property)
- ❌ GameState inventory (no items array)
- ❌ Any core game types

---

## 🧹 What Was Removed from Core Types

### Character Type
**Before**:
```typescript
interface Character {
  // ... other props
  inventory: Item[];
  equippedItems?: EquippedItems;
}
```

**After**:
```typescript
interface Character {
  // ... other props
  // No inventory or equipment properties!
}
```

### Enemy Type
**Before**:
```typescript
interface Enemy {
  // ... other props
  loot?: Item[];
}
```

**After**:
```typescript
interface Enemy {
  // ... other props
  // No loot property!
}
```

### GameState
**Before**:
```typescript
interface GameState {
  // ... other props
  inventory: {
    gold: number;
    wood: number;
    ironOre: number;
    fish: number;
    items: Item[];  // ❌ Removed
  };
}
```

**After**:
```typescript
interface GameState {
  // ... other props
  inventory: {
    gold: number;
    wood: number;
    ironOre: number;
    fish: number;
    // No items array!
  };
}
```

---

## 🔌 How to Plug Systems Back In

When you're ready to re-enable these systems:

### Option 1: Add Properties Back (Simple)

Just add the properties back to core types and import from the encapsulated files:

```typescript
// types/game.ts
import { EquippedItems } from './equipment';

export interface Character {
  // ... existing props
  equippedItems?: EquippedItems;
}
```

### Option 2: Extension Pattern (Recommended)

Create extended types that add the optional systems:

```typescript
// types/extensions/characterWithEquipment.ts
import { Character } from '../game';
import { EquippedItems } from '../equipment';

export interface CharacterWithEquipment extends Character {
  equippedItems: EquippedItems;
}
```

This way:
- Core Character remains simple
- Components that need equipment use `CharacterWithEquipment`
- You can mix and match systems

---

## 📂 File Structure

```
axiomancer-frontend/src/types/
├── game.ts              # ✅ Core types ONLY (Character, Enemy, GameState)
├── buffs.ts             # 🎯 Isolated buff system
├── equipment.ts         # 🎯 Isolated equipment system
├── newCombat.ts         # Active combat system
├── combatState.ts       # Alternate combat system
└── index.ts             # Auth types (shared with backend)
```

---

## ✅ Benefits

1. **Simpler Core**: Work on game mechanics without equipment/buff complexity
2. **Preserved Work**: All your buff/equipment code is saved and ready
3. **Plug-and-Play**: Easy to re-enable when needed
4. **Independent Development**: Test/develop systems separately
5. **Clear Boundaries**: Easy to see what depends on what

---

## 🧪 Storybook Compatibility

### What Still Works

- ✅ All core UI components
- ✅ Character creation/display
- ✅ Combat modal (uses newCombat.ts types)
- ✅ Skill screen
- ✅ Layout components

### What Uses Encapsulated Systems

- `InventoryScreen` - Uses equipment types (still works, just isolated)
- Buff/debuff displays - Uses buff types (still works, just isolated)

**Important**: These components still work! They just import from the encapsulated type files instead of game.ts.

---

## 🎮 Current Game State

Your game now has:

**Core Systems** (Always Active):
- ✅ Character with baseStats & derivedStats
- ✅ Skills and skill system
- ✅ Combat (newCombat.ts simple system)
- ✅ Location navigation
- ✅ Quest system
- ✅ Story progression
- ✅ Resource inventory (gold, wood, fish, etc.)

**Encapsulated Systems** (Plug-in When Ready):
- 🎯 Equipment & Items (isolated in types/equipment.ts)
- 🎯 Buffs & Debuffs (isolated in types/buffs.ts)

---

## 🚀 Next Steps

When you're ready to work on equipment or buffs again:

1. **Test the isolated system** in its own component/utility
2. **Decide on integration point** (extend core types or keep separate)
3. **Import from encapsulated files** where needed
4. **Keep core types clean** - only add if truly core to gameplay

---

## 📝 Notes

- Equipment/buff utilities still exist and work
- They just don't pollute core game types anymore
- The game can run without ever importing equipment.ts or buffs.ts
- Storybook will work fine - components import what they need
- No breaking changes to existing systems that already use these types

---

## Example: Adding Equipment Back

```typescript
// When you're ready, in stores/gameStore.ts:
import { EquippedItems } from '../types/equipment';

// Add to Character management:
interface CharacterData {
  // ... existing
  equippedItems?: EquippedItems;
}

// Add equipment actions:
equipItem: (slot: EquipmentSlot, item: Equipment) => void;
unequipItem: (slot: EquipmentSlot) => void;
```

The infrastructure is all there, just waiting to be plugged back in!
