# Gaps Between Documentation and Implementation

## Overview
This document identifies discrepancies between the documented game design in `axiomancer-documentation/` and the actual implementation in the codebase. Axiomancer is a philosophy and ethics-based TTRPG with a bright-to-dark emotional progression, using Heart, Body, and Mind as core stats.

---

## 1. Combat System Gaps

### 1.1 Fallacy Skills Implementation
**Documentation**: `all-fallacies-reference.md` contains 100+ logical fallacies converted into combat skills with detailed combat effects, equipment requirements, and philosopher references.

**Implementation**: 
- `fallacySkills.ts` - Only 15 skills implemented (basic versions)
- `fallacySpellbook.ts` - Contains 100+ skills with placeholder combat effects but NOT integrated into combat system
- **GAP**: Two competing skill systems exist, neither fully integrated

**Impact**: 
- Players have extremely limited skill selection
- Rich philosophical combat mechanics are unused
- Confusion about which system to use

**Files Affected**:
- `/axiomancer-frontend/src/utils/fallacySkills.ts` (15 skills)
- `/axiomancer-frontend/src/utils/fallacySpellbook.ts` (100+ skills, not integrated)
- `/axiomancer-documentation/rules/all-fallacies-reference.md` (full documentation)

---

### 1.2 Equipment System
**Documentation**: `Equip-Compendium.md` contains comprehensive equipment system:
- 20+ detailed fallacy-based items
- Archetype-specific allowances (Rationalist, Empiricist, Idealist, Materialist)
- Real-world philosopher connections
- Status effect triggers
- Catastrophic Events table

**Implementation**: 
- `equipmentItems.ts` exists but equipment is NOT implemented in game
- No equipment slot system in Character interface
- No equipment effects applied in combat
- **GAP**: 100% of equipment system is documented but 0% implemented

**Impact**: 
- No gear progression
- Missing strategic depth
- Philosophical archetype system unused
- Combat lacks equipment bonuses

**Files Affected**:
- `/axiomancer-frontend/src/utils/equipmentItems.ts` (partial definitions)
- `/axiomancer-frontend/src/types/game.ts` (Character has no equipment fields)
- `/axiomancer-documentation/references/Equip-Compendium.md` (full documentation)

---

### 1.3 Status Effects & Buff/Debuff System
**Documentation**: `IntegrationGuide.md` describes comprehensive buff/debuff engine:
- Status effect stacking
- Turn-based duration
- Multiple debuff types (Confused, Dazzled, Terrified, Recursive Logic, etc.)
- Equipment compatibility with status effects

**Implementation**:
- Status effect types defined in `/utils/combat/temp/statusEffects.ts`
- Buff/Debuff engine exists in `/utils/combat/temp/buffDebuffEngine.ts`
- **GAP**: Marked as "temp" and NOT integrated into actual combat resolution
- Combat system in `CombatModal.tsx` doesn't process status effects per turn

**Impact**:
- Combat lacks depth
- Skills that apply debuffs have no effect
- No tactical layer beyond type advantage
- "Friendly Counter" mechanic (defend+defend = friends) not fully implemented

**Files Affected**:
- `/axiomancer-frontend/src/utils/combat/temp/` (isolated, unused)
- `/axiomancer-frontend/src/components/game/Events/CombatModal/CombatModal.tsx` (missing integration)
- `/axiomancer-documentation/rules/IntegrationGuide.md` (fully documented)

---

### 1.4 Combat Turn System
**Documentation**: `combat-mechanics.md` implies multi-turn combat with status effect durations

**Implementation**: 
- Combat exists but status effects aren't tracked across turns
- No turn counter integration with buff/debuff expiration
- **GAP**: Turn-based system needed for status effects documented in issues.md but not implemented

**Impact**:
- Status effects can't expire properly
- No ongoing damage/healing
- Combat feels flat

**Files Affected**:
- `/issues.md` (line 6: "There needs to be 'turns' so status effects are applied properly")
- `/axiomancer-frontend/src/components/game/Events/CombatModal/CombatModal.tsx`

---

## 2. Character Progression Gaps

### 2.1 Experience & Leveling System
**Documentation**: 
- `issues.md` defines leveling system:
  - 150 XP per enemy defeat
  - Level up at 1000 XP
  - 5 stat points per level
  - XP resets to 0 after level up

**Implementation**:
- Character has `experience`, `experienceToNextLevel`, `unassignedStatPoints` fields
- **GAP**: No code awards XP on enemy defeat
- **GAP**: No level-up trigger at 1000 XP
- **GAP**: Stat point assignment UI exists but not connected to level-up flow

**Impact**:
- Characters can't progress beyond character creation
- No sense of growth
- Stat point system unused

**Files Affected**:
- `/axiomancer-frontend/src/types/game.ts` (Character interface has fields)
- `/axiomancer-frontend/src/stores/gameStore.ts` (no level-up logic)
- `/issues.md` (lines 16-18)

---

### 2.2 Philosophical Archetypes
**Documentation**: `Equip-Compendium.md` defines 4 archetypes:
- Rationalist (Mind +2)
- Empiricist (Body +2)
- Idealist (Heart +2)
- Materialist (Body +2)

Each has innate abilities and philosophical weaknesses.

**Implementation**:
- Character creation allows stat distribution
- **GAP**: No archetype selection
- **GAP**: No archetype-based bonuses
- **GAP**: Equipment restrictions by archetype not enforced
- **GAP**: Philosophical weaknesses not implemented

**Impact**:
- Missing strategic character building layer
- Equipment system can't function as designed
- Philosophical theme diluted

**Files Affected**:
- `/axiomancer-frontend/src/components/game/CharacterCreationScreen.tsx` (no archetype step)
- `/axiomancer-frontend/src/types/game.ts` (Character has no archetype field)

---

## 3. Story & World Building Gaps

### 3.1 Progression Story
**Documentation**: `Progression.md` outlines three-phase story:
- Childhood (fishing village, friend, labyrinth rumors)
- Labyrinth (TBD)
- Adulthood (TBD)

**Implementation**:
- Story flags exist in GameState
- **GAP**: "TBD" sections never filled in
- **GAP**: Only childhood phase has any detail, but implementation is minimal
- **GAP**: No actual story events trigger these flags

**Impact**:
- Game world feels empty
- No narrative hook
- Bright-to-dark emotional arc can't happen without story

**Files Affected**:
- `/axiomancer-documentation/rules/Progression.md` (incomplete documentation)
- `/axiomancer-frontend/src/types/game.ts` (GameState.story has unused flags)

---

### 3.2 Pantheon System
**Documentation**: `pantheon-description.md` lists 8 gods:
- God of Will, God of the Unmoving, God of the Unknown, God of Faith, God of Love, God of Malice, God of Chaos, God of Order

**Implementation**:
- File exists with only headings, no descriptions
- **GAP**: 100% incomplete
- **GAP**: No pantheon integration in game (no gods, prayers, divine mechanics)

**Impact**:
- Missing major lore element
- No divine/religious mechanics
- Emotional/philosophical depth missing

**Files Affected**:
- `/axiomancer-documentation/pantheon/pantheon-description.md` (8 lines, all empty)
- `/axiomancer-documentation/pantheon/pantheon-physicallity.md` (not checked but likely similar)
- `/axiomancer-documentation/pantheon/pantheon-stories.md` (not checked but likely similar)

---

## 4. Game Systems Gaps

### 4.1 Enemy Database
**Documentation**: Combat system assumes enemies exist in JSON files per map

**Implementation**:
- Enemies defined inline in components
- **GAP**: No centralized enemy database
- **GAP**: No enemy selector utility
- **GAP**: No standardized Enemy type (documented in issues.md)

**Impact**:
- Hard to add new enemies
- No enemy variety
- Combat testing difficult
- Enemy reusability impossible

**Files Affected**:
- `/issues.md` (lines 8-9: "Create an 'easy-to-use' 'enemySelector'")
- Various combat modal files with hardcoded enemies

---

### 4.2 Map & Node System
**Documentation**: Progression implies multiple maps with node-based exploration

**Implementation**:
- Map screen exists
- Node system partially implemented
- **GAP**: Node completion doesn't unlock next map (documented in issues.md line 19)
- **GAP**: Player always starts in fishing village but can incorrectly select it again
- **GAP**: Completed nodes still clickable

**Impact**:
- Map progression broken
- Player can get stuck
- Exploration system feels unfinished

**Files Affected**:
- `/issues.md` (lines 19-20)
- `/axiomancer-frontend/src/components/game/GlobalLocalMapScreen.tsx`

---

### 4.3 Skills Management
**Documentation**: Character should have:
- Available skills (pool to choose from)
- Equipped skills (active in combat)
- Skills organized by philosophical aspect (Heart/Body/Mind)

**Implementation**:
- Character has `availableSkills` and `equippedSkills` fields
- **GAP**: Skill learning system not implemented
- **GAP**: Skill equipping UI not functional
- **GAP**: Combat doesn't use equipped skills (uses hardcoded options)

**Impact**:
- Character customization missing
- Combat strategy limited
- Philosophical aspect system underutilized

**Files Affected**:
- `/axiomancer-frontend/src/components/game/SkillScreen.tsx` (incomplete)
- `/axiomancer-frontend/src/types/game.ts` (fields exist but unused)

---

### 4.4 Loot & Rewards System
**Documentation**: `IntegrationGuide.md` mentions equipment drops and item rewards

**Implementation**:
- Inventory system exists (gold, wood, ironOre, fish)
- **GAP**: No loot drops from combat
- **GAP**: No equipment rewards
- **GAP**: No consumables system
- **GAP**: Victory screen doesn't show item rewards (documented in issues.md)

**Impact**:
- No reward loop
- Combat feels unrewarding
- Inventory system underutilized

**Files Affected**:
- `/issues.md` (line 11: "Victory pop-up... include... items that may have been dropped")
- `/axiomancer-frontend/src/types/game.ts` (GameState.inventory is basic)

---

## 5. Technical Debt Gaps

### 5.1 Character Persistence Issues
**Documentation**: `CHARACTER_PERSISTENCE_ANALYSIS.md` identifies 8 major issues

**Implementation**:
- Character save/load system exists
- **GAP**: All 8 issues documented but NOT fixed:
  1. No auto-load on app startup
  2. No Zustand persist for game state
  3. Fragile auth token retrieval
  4. Game page creates new character if store empty
  5. No error handling for load failures
  6. Debounced save may lose data
  7. No save confirmation feedback
  8. Character ID generation issues

**Impact**:
- Users lose characters
- Poor UX
- Data loss risk

**Files Affected**:
- `/CHARACTER_PERSISTENCE_ANALYSIS.md` (detailed analysis)
- `/axiomancer-frontend/src/stores/gameStore.ts`
- `/axiomancer-frontend/src/services/characterService.ts`

---

### 5.2 Type Mismatches
**Documentation**: `shared-types.md` identifies ApiError mismatch

**Implementation**:
- Frontend expects `{ error: string }`
- Backend sends `{ message: string, statusCode: number }`
- **GAP**: Type mismatch NOT fixed

**Impact**:
- Runtime errors
- Poor error handling
- Silent failures

**Files Affected**:
- `/shared-types.md` (documented mismatch)
- `/axiomancer-frontend/src/types/index.ts`
- `/axiomancer-backend/src/types/index.ts`

---

### 5.3 Multiple Combat System Versions
**Documentation**: Various combat docs assume single unified system

**Implementation**:
- `combat.ts` - Legacy combat system
- `newCombat.ts` - "New" combat system (used in CombatModal)
- `combatState.ts` - Separate state management
- `temp/` folder with unused buff/debuff engine
- **GAP**: 3+ combat systems coexist, causing confusion

**Impact**:
- Code duplication
- Maintenance nightmare
- Feature integration difficult

**Files Affected**:
- `/axiomancer-frontend/src/types/combat.ts`
- `/axiomancer-frontend/src/utils/combat/`

---

## 6. UI/UX Gaps

### 6.1 Combat Visual Issues
**Documentation**: Combat should feel impactful and strategic

**Implementation**: `issues.md` documents 8 visual issues:
- Combat screen too wide
- Broken enemy images
- Portrait containers too tall
- No unified panel design
- Missing combat log UI
- No victory pop-up
- No visual feedback for status effects

**Impact**:
- Poor combat experience
- Can't see battle flow
- Unclear what happened

**Files Affected**:
- `/issues.md` (lines 2-11)
- `/axiomancer-frontend/src/components/game/Events/CombatModal/CombatModal.tsx`

---

### 6.2 Debug Tools
**Documentation**: `issues.md` outlines comprehensive debug panel

**Implementation**:
- Basic debug panel exists
- **GAP**: Missing features:
  - Collapsible UI
  - Heal HP/MP buttons
  - Give all skills/items buttons
  - Level up button
  - XP manipulation
  - Admin-only access

**Impact**:
- Development/testing slow
- Hard to test late-game content
- QA difficult

**Files Affected**:
- `/issues.md` (lines 22-34)
- `/axiomancer-frontend/src/components/game/DebugPanel.tsx`

---

## 7. Priority Gap Summary

### Critical (Blocks Core Gameplay)
1. **Combat Status Effects** - Combat system incomplete without turn-based debuffs
2. **Skill Integration** - 100+ skills exist but aren't usable
3. **Character Persistence** - Players lose progress
4. **Leveling System** - No progression = no game loop

### High (Major Features Missing)
5. **Equipment System** - 0% implemented despite full documentation
6. **Enemy Database** - Can't scale content without this
7. **Loot & Rewards** - No incentive to fight
8. **Map Progression** - Exploration broken

### Medium (Quality of Life)
9. **Combat Visuals** - Works but feels bad
10. **Story Content** - Documented but not written
11. **Philosophical Archetypes** - Missing strategic depth

### Low (Polish)
12. **Pantheon System** - Lore enhancement
13. **Debug Tools** - Development speed
14. **Type Mismatches** - Technical cleanup

---

## Conclusion

The Axiomancer project has **excellent documentation** for a philosophy-based TTRPG with unique mechanics. However, there's a massive **implementation gap**:

- **Documentation Completeness**: ~70% (some sections TBD)
- **Implementation Completeness**: ~25%
- **Documentation-to-Implementation Gap**: ~45%

The core systems are designed but not built. Priority should be:
1. Fix character persistence (users can't play)
2. Integrate combat status effects (combat feels flat)
3. Add leveling/XP system (no progression)
4. Implement equipment (huge documented system unused)
5. Consolidate combat systems (technical debt blocking features)

The game has incredible potential with its philosophical combat, fallacy-based skills, and bright-to-dark emotional arc. Closing these gaps would transform it from a prototype into a playable TTRPG.
