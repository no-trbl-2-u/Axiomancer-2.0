# Types Issues - Uncertain Fixes

This document contains type issues that require clarification or decision-making before implementing fixes.

## 1. Missing Type Definitions - Need to Infer Structure

### BuffDebuff, BuffDebuffEffect, CombatantBuffs, StatusEffectName

**Problem**: These types are imported from `types/game` but don't exist there.

**Current Usage Analysis**:

From `buffDebuffEngine.ts` usage, I can infer:
```typescript
// Inferred from usage:
interface BuffDebuff {
  id: string;
  name: StatusEffectName;
  description: string;
  type: 'buff' | 'debuff';
  effect: BuffDebuffEffect;
  duration: number;
  remainingTurns: number;
  stackable: boolean;
  currentStacks: number;
  maxStacks?: number;
  icon: string;
}

interface BuffDebuffEffect {
  statModifiers?: {
    physicalAttack?: number;
    physicalDefense?: number;
    mindAttack?: number;
    mindDefense?: number;
    ailmentAttack?: number;
    ailmentDefense?: number;
  };
  percentageModifiers?: {
    physicalAttack?: number;
    physicalDefense?: number;
    mindAttack?: number;
    mindDefense?: number;
    ailmentAttack?: number;
    ailmentDefense?: number;
  };
  specialEffects?: {
    fixedDamageNextTurn?: number;
    damageOnAttack?: number;
    reflection?: number;
    immuneToNextAttack?: boolean;
    chanceToFadePerTurn?: number;
  };
}

interface CombatantBuffs {
  buffs: BuffDebuff[];
  debuffs: BuffDebuff[];
}

type StatusEffectName = string; // Could be a union of specific strings
```

**Question**: Should I add these inferred types to `game.ts`, or create a new `types/buffs.ts` file?

**Recommendation**: Add to `game.ts` for now since they're core combat types, but could be refactored later.

---

## 2. Combat System Ambiguity

### Multiple Combat Systems?

**Issue**: There appear to be TWO different combat systems:

1. **"Old" Combat System** (types/game.ts + types/combatState.ts):
   - Uses `CombatChoice`, `CombatRoundResult`
   - Has complex buff/debuff system with `CombatantState`
   - BattleLogEntry with detailed tracking

2. **"New" Combat System** (types/newCombat.ts):
   - Uses `CombatDecision`, `CombatType`, `CombatActionType`
   - Simpler structure
   - Different BattleLogEntry format

**Evidence**:
- CombatModal.tsx uses `newCombat.ts` types
- gameStore.ts uses `game.ts` CombatState
- combatStateManager.ts uses `combatState.ts` types

**Questions**:
1. Are both systems actively used or is one deprecated?
2. Should we consolidate or keep both?
3. Which one should be the "primary" system?

**Recommendation**: 
- Check with stakeholders which system is active
- If only one is active, remove the other
- If both are needed, rename them clearly (e.g., `LegacyCombatState` vs `SimpleCombatState`)

**Current Decision**: Keep both for now, clearly document which is which, mark for future consolidation

---

## 3. Character Type Redundancies

### equipment vs equippedItems

**Issue**: Character has both:
```typescript
equipment: Equipment[];           // Array of equipment items
equippedItems?: EquippedItems;   // Object with specific slots
```

**Usage**:
- `equippedItems` is actively used in gameStore.ts
- `equipment` array is NOT used anywhere

**Question**: Is `equipment` a legacy field or for future inventory expansion?

**Recommendation**: Remove `equipment` array, keep only `equippedItems`

---

### inventory vs inventoryCategories

**Issue**: Character has both:
```typescript
inventory: Item[];                      // Flat array
inventoryCategories?: InventoryCategories;  // Categorized object
```

**Usage**:
- `inventory` array is actively used
- `inventoryCategories` is NOT used anywhere

**Question**: Is `inventoryCategories` for future feature?

**Recommendation**: Remove `inventoryCategories`, keep only `inventory`

---

## 4. Enemy Type Location

### Should Enemy be a type or just an interface in a component?

**Current State**: 
- Enemy is defined in `components/game/Events/CombatModal/enemyHelper.ts`
- Re-exported from `types/game.ts` for "backwards compatibility"

**Issue**: Types should live in the types directory, not in components.

**Question**: 
1. Should we move Enemy to `types/game.ts`?
2. Should we keep the re-export?

**Recommendation**: 
- Move Enemy definition to `types/game.ts`
- Update all imports
- Remove re-export

---

## 5. Unused "Future Feature" Types

### These types are defined but never used:
- `GlobalMapNode`
- `ExplorationNode`
- `DialogueOption`
- `InventoryCategories`
- `NodeChoice`
- `NodeCost`
- `NodeEvent`

**Question**: Are these for planned features or truly unused?

**Recommendation**: 
- If planned features: Keep them but add JSDoc comments like `@future` or `@planned`
- If unused: Remove them to reduce cognitive load

**Current Decision**: Keep them but mark with `@planned` comments, can be removed later if confirmed unused

---

## 6. Type vs Interface Decision

### Inconsistent Usage

**Observation**: The codebase uses both `type` and `interface` inconsistently:
- Simple types/unions: Sometimes `type`, sometimes `interface`
- Complex objects: Mix of both

**Question**: Should we standardize?

**Recommendation**: 
- Use `interface` for object shapes that might be extended
- Use `type` for unions, primitives, and computed types
- This is a low-priority style issue

---

## Summary of Decisions Needed

1. ✅ **BuffDebuff types**: Add inferred types to game.ts
2. ❓ **Combat systems**: Keep both, document clearly (needs stakeholder input)
3. ✅ **Character redundancies**: Remove `equipment` and `inventoryCategories`
4. ✅ **Enemy location**: Move to types/game.ts
5. ✅ **Unused types**: Mark as @planned, can remove later
6. ⏸️  **type vs interface**: Low priority, no action for now
