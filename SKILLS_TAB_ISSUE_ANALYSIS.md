# Skills Tab Issue Analysis

## Overview
Investigation into what could be preventing the use of the Skills tab in the Axiomancer game.

## Potential Issues Identified

### 1. **Missing or Undefined `equippedSkills` Property**

**Location**: Multiple components accessing `character.equippedSkills`

**Problem**: The Character interface requires `equippedSkills` to be structured as:
```typescript
equippedSkills: {
  heart: Skill[];
  body: Skill[];
  mind: Skill[];
};
```

However, when loading character data from the backend or creating a new character, this property might not be initialized properly.

**Affected Files**:
- `SkillScreen.tsx` (lines 463, 526)
- Character data loading in `characterSave.ts`

**Evidence**:
```typescript
// SkillScreen.tsx:463
const getEquippedSkills = () => {
  return character.equippedSkills[selectedTab] || [];  // Uses fallback []
};
```

The code defensively uses `|| []` suggesting this property might be undefined.

---

### 2. **Missing or Undefined `availableSkills` Property**

**Location**: `CharacterSelectionPage.tsx:424`

**Problem**: The code tries to access `availableSkills.length` without checking if it exists:
```typescript
Skills Learned: {savedCharacter.character.availableSkills.length}<br/>
```

**Error**: `Cannot read properties of undefined (reading 'length')`

This same property is used in the Skills tab. If `availableSkills` is undefined, it could cause the entire component to crash.

---

### 3. **Character Data Migration Issues**

**Location**: `axiomancer-frontend/src/utils/characterSave.ts`

**Problem**: The `migrateCharacterData` function migrates old character data to the new stat system, but it doesn't ensure that `availableSkills` and `equippedSkills` are initialized.

**Current Migration Code** (lines 25-67):
```typescript
function migrateCharacterData(character: any): Character {
  // If character already has new stat structure, return as is
  if (character.baseStats && character.derivedStats) {
    return character as Character;
  }
  
  // ... migration logic ...
  
  return {
    ...character,
    baseStats,
    derivedStats,
    maxHealth: character.maxHealth || maxHP,
    maxMana: character.maxMana || maxMP,
    health: Math.min(character.health || maxHP, maxHP),
    mana: Math.min(character.mana || maxMP, maxMP),
    availableStatPoints: character.availableStatPoints || 0
    // ❌ Missing: availableSkills initialization
    // ❌ Missing: equippedSkills initialization
  };
}
```

---

### 4. **Initial Character Creation**

**Location**: Need to check character creation screens

**Problem**: When a new character is created, `availableSkills` and `equippedSkills` might not be initialized with empty arrays/objects.

---

### 5. **Backend Data Structure**

**Location**: Backend character storage

**Problem**: The backend might be storing character data without these properties, and when loaded, they remain undefined.

**API Endpoint**: `/api/character/load`

The backend stores character data as JSON text in `character_data` column. If old characters were saved without these properties, they won't exist when loaded.

---

## Recommended Fixes

### Fix 1: Update Character Migration (High Priority)

Update `characterSave.ts` to ensure skills properties are always initialized:

```typescript
function migrateCharacterData(character: any): Character {
  // ... existing migration logic ...
  
  return {
    ...character,
    baseStats,
    derivedStats,
    maxHealth: character.maxHealth || maxHP,
    maxMana: character.maxMana || maxMP,
    health: Math.min(character.health || maxHP, maxHP),
    mana: Math.min(character.mana || maxMP, maxMP),
    availableStatPoints: character.availableStatPoints || 0,
    // ✅ Add these lines:
    availableSkills: character.availableSkills || [],
    equippedSkills: character.equippedSkills || {
      heart: [],
      body: [],
      mind: []
    }
  };
}
```

### Fix 2: Add Null Safety to CharacterSelectionPage (Quick Fix)

Update line 424 in `CharacterSelectionPage.tsx`:

```typescript
// Before:
Skills Learned: {savedCharacter.character.availableSkills.length}<br/>

// After:
Skills Learned: {savedCharacter.character.availableSkills?.length || 0}<br/>
```

### Fix 3: Ensure Initial Character Has Skills Properties

Check character creation code to ensure new characters have:
```typescript
{
  // ... other properties ...
  availableSkills: [],
  equippedSkills: {
    heart: [],
    body: [],
    mind: []
  }
}
```

### Fix 4: Add Error Boundary to Skills Tab

Wrap the SkillScreen component with an error boundary to prevent the entire UI from crashing if there's an issue.

### Fix 5: Database Clear & Fresh Start

Since the database might have corrupted/incomplete character data, use the newly created database clearing tool:

```bash
cd axiomancer-backend
npm run db:clear
```

Then create a fresh character with proper initialization.

---

## Testing Steps

1. ✅ Clear the database using `npm run db:clear` in backend
2. ✅ Start the backend server
3. ✅ Start the frontend
4. ✅ Create a new account
5. ✅ Create a new character (verify it has `availableSkills` and `equippedSkills`)
6. ✅ Navigate to the Skills tab
7. ✅ Verify skills are displayed correctly
8. ✅ Try equipping/unequipping skills
9. ✅ Save and reload the character
10. ✅ Verify skills persist correctly

---

## Root Cause Summary

The most likely cause is that **character data is missing the `availableSkills` and `equippedSkills` properties** due to:

1. Old character data from before these properties were added
2. Migration code not initializing these properties
3. Character creation not setting these properties
4. Backend returning incomplete data

The fix is straightforward: ensure these properties are always initialized with proper default values (empty arrays/objects) in the migration function and character creation code.

---

## Files to Modify

1. **`axiomancer-frontend/src/utils/characterSave.ts`** - Update migration function
2. **`axiomancer-frontend/src/pages/CharacterSelectionPage.tsx`** - Add null safety
3. **Character creation code** - Ensure initial values are set
4. **Consider**: Add TypeScript strict null checks to catch these issues at compile time

