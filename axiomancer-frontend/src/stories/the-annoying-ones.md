# Components Without Storybook Stories

This document lists components that could not have Storybook stories created due to complexity and heavy dependencies on application state.

## Figma Components

### CombatModal
**File:** `/components/figma/CombatModal.tsx`

**Why it's difficult:**
- **545 lines** of complex component code
- Heavy dependency on Zustand `useGameStore` for all combat state
- Requires full combat system including:
  - `resolveCombatRound`
  - `generateEnemyDecision`
  - `createBattleLogEntry`
  - `checkCombatEnd`
- Manages complex state interactions between player and enemy
- Uses nested modals (SkillSelectionModal, NewFriendsModal)
- Would require mocking the entire combat mechanics system

**What was tried:**
- Considered creating mock game state
- Would need to mock combat resolution logic
- Too interconnected with game mechanics to isolate

**Recommendation:**
- Better suited for integration tests
- Could create a simplified demo version without full state management

---

## Combat Components

### SkillSelectionModal
**File:** `/components/combat/SkillSelectionModal.tsx`

**Why it's difficult:**
- Depends on game store for character skills and equipped skills
- Requires `Skill` type with complex skill effects
- Integrates with skill application system
- Would need extensive mocking of character state

**What was tried:**
- Considered mocking skill data
- Dependencies too deeply integrated with character management system

**Recommendation:**
- Create stories with static mock data when skill system is more decoupled

---

## Game Components

### CharacterCreationScreen
**File:** `/components/game/CharacterCreationScreen.tsx`

**Why it's difficult:**
- Full character creation flow with multiple steps
- Manages portrait selection, naming, stat allocation
- Integrates with character save system
- Uses game store for state management

**Recommendation:**
- Integration test or E2E test would be more appropriate

---

### CharacterScreen
**File:** `/components/game/CharacterScreen.tsx`

**Why it's difficult:**
- Displays full character information from game store
- Equipment management
- Skill viewing and management
- Stat displays
- Heavily coupled to character data structure

**Recommendation:**
- Could create partial stories for sub-components if they were extracted

---

### CombatScreen
**File:** `/components/game/CombatScreen.tsx`

**Why it's difficult:**
- Full combat interface
- Similar issues to CombatModal
- Combat state management
- Turn-based system integration

**Recommendation:**
- Integration testing better suited

---

### EventModal  
**File:** `/components/game/EventModal.tsx`

**Why it's difficult:**
- Handles 4 different event types: combat, moral, gathering, rest
- Each type has different UI and logic
- Integrates with:
  - Combat system
  - Skill system (`getAvailableSkills`, `applySkillEffect`)
  - Character save system
  - Persistent effects system
- Contains hardcoded enemy and scenario data
- Complex state management for event outcomes

**Recommendation:**
- Could extract event type components into smaller, testable pieces
- Create stories for individual event types if separated

---

### GlobalLocalMapScreen
**File:** `/components/game/GlobalLocalMapScreen.tsx`

**Why it's difficult:**
- Map navigation system
- Node management
- Event triggering
- Progress tracking
- Highly interactive with game state

**Recommendation:**
- Visual regression testing might be useful
- Component is too interconnected for isolated stories

---

### InventoryScreen
**File:** `/components/game/InventoryScreen.tsx`

**Why it's difficult:**
- Full inventory management
- Equipment system integration
- Item categorization
- Drag and drop functionality likely
- Depends on character inventory state

**Recommendation:**
- Extract inventory grid/item components for individual stories

---

### MainGameInterface
**File:** `/components/game/MainGameInterface.tsx`

**Why it's difficult:**
- Main game container
- Orchestrates all game screens
- Navigation between screens
- Global game state management
- Too high-level for component stories

**Recommendation:**
- This is the app shell - better tested via E2E tests

---

### SkillScreen
**File:** `/components/game/SkillScreen.tsx`

**Why it's difficult:**
- Skill tree display
- Skill learning/equipping system
- Category filtering (body/mind/heart)
- Requires character skills state
- Skill effects and descriptions

**Recommendation:**
- Extract skill card component for individual stories
- Full screen too integrated with game state

---

## Summary

**Total components: 17**
- ✅ **Successfully created stories: 7**
  - Dialog
  - ScrollArea  
  - NewFriendsModal
  - BuffDebuffDisplay
  - DebugPanel
  - LockedNodeModal
  - Layout

- ❌ **Too complex for stories: 10**
  - CombatModal
  - SkillSelectionModal
  - CharacterCreationScreen
  - CharacterScreen
  - CombatScreen
  - EventModal
  - GlobalLocalMapScreen
  - InventoryScreen
  - MainGameInterface
  - SkillScreen

## General Pattern

The components that couldn't have stories created share these characteristics:
1. Heavy dependency on Zustand game store
2. Complex business logic deeply integrated
3. Multiple interconnected state dependencies
4. Full-screen or container components orchestrating many features
5. Would require extensive mocking that defeats the purpose of component isolation

## Suggested Improvements

1. **Extract presentational components** - Separate UI from business logic
2. **Create sub-components** - Break down large components into smaller, testable pieces
3. **Use composition** - Pass data as props rather than accessing global store directly
4. **Add integration tests** - Test these components as part of user flows
5. **Consider E2E testing** - Tools like Playwright for full application testing
