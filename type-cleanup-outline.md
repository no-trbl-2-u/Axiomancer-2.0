# Type Cleanup Analysis & Action Plan

## Executive Summary

This document outlines all type-related issues found in the Axiomancer codebase, organized by severity and action required.

## Critical Issues (Must Fix)

### 1. Missing Type Definitions in game.ts
**Problem**: The following types are imported from `../types/game` but are NOT defined there:
- `BuffDebuff`
- `BuffDebuffEffect`
- `CombatantBuffs`
- `StatusEffectName`

**Current Usage**:
- Used extensively in: `buffDebuffEngine.ts`, `combatMechanics.ts`, `combatVisuals.ts`, `persistentEffects.ts`, `combatEffectBridge.ts`, `combatStateManager.ts`
- These types are referenced in `combatState.ts` as well

**Action**: Need to define these types properly in game.ts or create a dedicated file for them.

**Status**: UNCERTAIN - Need to infer structure from usage patterns

---

### 2. Duplicate BattleLogEntry Definitions
**Problem**: `BattleLogEntry` is defined THREE times with different structures:

**Definition 1** (`types/game.ts`):
```typescript
interface BattleLogEntry {
  round: string;
  playerDecision: CombatChoice;
  enemyDecision: CombatChoice;
  advantage: 'player' | 'enemy' | 'none';
  damage: { toPlayer: number; toEnemy: number; };
  effects: string[];
  playerRoll: string;
  enemyRoll: string;
  playerRollDetails: string;
  enemyRollDetails: string;
  damageToEnemy: number;
  damageToPlayer: number;
  playerHPAfter: string;
  enemyHPAfter: string;
  result: string;
}
```

**Definition 2** (`types/newCombat.ts`):
```typescript
interface BattleLogEntry {
  round: number;
  playerDecision: CombatDecision;
  enemyDecision: CombatDecision;
  advantage: AdvantageType;
  playerRoll?: number;
  playerRollDetails?: string;
  enemyRoll?: number;
  enemyRollDetails?: string;
  damageToPlayer: number;
  damageToEnemy: number;
  playerHPAfter: number;
  enemyHPAfter: number;
  result: string;
  timestamp: number;
}
```

**Definition 3** (`types/combatState.ts`):
```typescript
interface BattleLogEntry {
  decisions: string;
  turn: number;
  log: string;
  result?: string;
}
```

**Usage**: Used in 8 different locations across the codebase

**Action**: Consolidate to ONE definition, likely the newCombat.ts version as it's the most complete and uses better types (numbers instead of strings)

---

### 3. Duplicate CombatState Definitions
**Problem**: `CombatState` is defined TWICE with completely different structures:

**Definition 1** (`types/game.ts`): Simple combat state
**Definition 2** (`types/combatState.ts`): Complex combat state with buffs/debuffs

**Usage**: 
- `game.ts` version: Used in gameStore.ts
- `combatState.ts` version: Used in combatStateManager.ts

**Action**: Need to determine which system is active and consolidate

**Status**: UNCERTAIN - Two different combat systems?

---

### 4. Enemy Type Missing Properties
**Problem**: Enemy type in `enemyHelper.ts` uses `loot` property in the code but it's not in the type definition

**Location**: 
- Type defined in: `components/game/Events/CombatModal/enemyHelper.ts`
- Property used in: `utils/combatMechanics.ts` (5 occurrences)

**Action**: Add `loot` property to Enemy interface

---

## Medium Priority Issues (Unused Types)

### 5. Types Defined But Never Used
The following types are defined but have ZERO usage outside of type definition files:
- `GlobalMapNode` (defined in game.ts, only used in type definitions)
- `ExplorationNode` (defined in game.ts, only used in type definitions)
- `DialogueOption` (defined in game.ts, only used in type definitions)
- `InventoryCategories` (defined in game.ts, only used in type definitions)
- `NodeChoice` (defined in game.ts, only used in type definitions)
- `NodeCost` (defined in game.ts, only used in type definitions)
- `NodeEvent` (defined in game.ts, only used in type definitions)

**Action**: Can be safely removed if confirmed they're for future features, or document them as "planned features"

---

### 6. CombatChoice vs CombatDecision Confusion
**Problem**: Two nearly identical types with different names:
- `CombatChoice` (in game.ts): Has `aspect`, `action`, `type`
- `CombatDecision` (in newCombat.ts): Has `type`, `action`

**Action**: Consolidate to one type

---

## Low Priority Issues (Minor Cleanup)

### 7. Redundant Type Exports
**Problem**: `Enemy` type is re-exported from `game.ts` with a comment about "backwards compatibility"
```typescript
import type { Enemy as EnemyType } from '../components/game/Events/CombatModal/enemyHelper';
export type Enemy = EnemyType;
```

**Action**: Move Enemy type to types directory proper and import from there in all files

---

### 8. Unused Properties on Character Type
**Problem**: Character interface has both:
- `equipment: Equipment[]` (array)
- `equippedItems?: EquippedItems` (object with specific slots)
- `inventory: Item[]` (array)
- `inventoryCategories?: InventoryCategories` (categorized object)

**Usage Pattern**: Only the `equippedItems` and `inventory` array are actually used

**Action**: Remove `equipment` array and `inventoryCategories` if not needed

---

## Backend Type Analysis

### 9. Backend Types Are Minimal
**Backend Types** (`axiomancer-backend/src/types/index.ts`):
- User
- UserCreateInput
- UserLoginInput
- AuthResponse
- JwtPayload
- ApiError

All are actively used, no issues found.

---

## Shared Types Between Frontend & Backend

### 10. Auth-Related Types
**Types that exist in both**:
- `User` - **MISMATCH**
- `AuthResponse` - **MATCH**
- `ApiError` - **MISMATCH**

**User Type Differences**:
- Frontend: `createdAt: string, updatedAt: string`
- Backend: `createdAt: Date, updatedAt: Date, password: string`

**ApiError Differences**:
- Frontend: `{ error: string, stack?: string }`
- Backend: `{ message: string, statusCode: number, stack?: string }`

**Action**: These should match exactly to avoid confusion

---

## Proposed Action Plan

### Phase 1: Critical Fixes (Must Do)
1. ✅ Define missing types (BuffDebuff, CombatantBuffs, etc.)
2. ✅ Consolidate BattleLogEntry to single definition
3. ✅ Consolidate CombatState or clearly separate them
4. ✅ Add missing `loot` property to Enemy type
5. ✅ Fix shared type mismatches (User, ApiError)

### Phase 2: Cleanup (Should Do)
6. ✅ Remove unused types or mark as "planned features"
7. ✅ Consolidate CombatChoice/CombatDecision
8. ✅ Move Enemy type to proper location
9. ✅ Remove unused Character properties

### Phase 3: Documentation (Nice to Have)
10. ✅ Document which combat system is "official"
11. ✅ Add JSDoc comments to complex types
12. ✅ Create types/README.md explaining type organization

---

## Files That Will Be Modified

### Frontend
- `/axiomancer-frontend/src/types/game.ts` - Major consolidation
- `/axiomancer-frontend/src/types/newCombat.ts` - Potential removal/merge
- `/axiomancer-frontend/src/types/combatState.ts` - Potential removal/merge
- `/axiomancer-frontend/src/types/index.ts` - Update exports
- `/axiomancer-frontend/src/components/game/Events/CombatModal/enemyHelper.ts` - Move type

### Backend
- `/axiomancer-backend/src/types/index.ts` - Fix shared type mismatches

### New Files
- `/workspace/Types-Issue.md` - Document uncertain issues
- `/workspace/shared-types.md` - Document shared types
