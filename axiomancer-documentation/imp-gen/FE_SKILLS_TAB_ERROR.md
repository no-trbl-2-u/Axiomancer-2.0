# Frontend Skills Tab Error - Diagnostic Report

## Issue Summary
The Skills tab in the game is not working properly, preventing users from viewing or managing their skills.

## Frontend Error Analysis

### **Root Cause: Undefined Skills Properties**

The SkillScreen component expects the character object to have these properties:
```typescript
character.equippedSkills: {
  heart: Skill[];
  body: Skill[];
  mind: Skill[];
}
```

However, when loading an existing character from the database, these properties may be `undefined`.

### Code References

**SkillScreen.tsx - Lines that fail when properties are undefined:**

1. **Line 463** - Getting equipped skills:
```typescript
const getEquippedSkills = () => {
  return character.equippedSkills[selectedTab] || [];  // ✅ Has fallback
};
```

2. **Line 526** - Getting equipped count:
```typescript
const equippedCount = (character.equippedSkills[aspect] || []).length;  // ✅ Has fallback
```

**✅ The SkillScreen component DOES have defensive coding!**

However, if `character.equippedSkills` itself is `undefined` (not just the nested arrays), then:
- `character.equippedSkills[selectedTab]` will throw: **"Cannot read properties of undefined"**
- The fallback `|| []` never executes because the error happens first

### **The Actual Problem**

When you try to access:
```typescript
character.equippedSkills['body']
```

If `equippedSkills` is `undefined`, JavaScript throws an error **before** it can check the `|| []` fallback.

### Visual Representation

```javascript
// What we expect:
character.equippedSkills = { heart: [], body: [], mind: [] }
character.equippedSkills['body']  // ✅ Returns []

// What actually happens with old data:
character.equippedSkills = undefined
character.equippedSkills['body']  // ❌ ERROR: Cannot read properties of undefined
// The || [] fallback is never reached!
```

## Why It's Happening

1. **Old Character Data**: Characters saved before the skills system was implemented don't have these properties
2. **Migration Not Applied**: The `migrateCharacterData()` function doesn't initialize `equippedSkills`
3. **First Access Fails**: When the Skills tab tries to render, it immediately crashes

## The Fix

### Option 1: Fix the Migration Function (RECOMMENDED)

Update `/axiomancer-frontend/src/utils/characterSave.ts`:

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
    // 🔧 ADD THESE LINES:
    availableSkills: character.availableSkills || [],
    equippedSkills: character.equippedSkills || {
      heart: [],
      body: [],
      mind: []
    }
  };
}
```

### Option 2: Add Better Defensive Coding in SkillScreen

Update the `getEquippedSkills` function:

```typescript
const getEquippedSkills = () => {
  // Check if equippedSkills exists first
  if (!character.equippedSkills) {
    return [];
  }
  return character.equippedSkills[selectedTab] || [];
};
```

And line 526:

```typescript
const equippedCount = character.equippedSkills?.[aspect]?.length || 0;
```

### Option 3: Clear Database and Start Fresh

```bash
cd axiomancer-backend
npm run db:clear
```

Then create a new character - it will have proper initialization.

## Testing the Fix

After applying the fix:

1. Load the Skills tab
2. Verify no console errors
3. Try switching between Body/Mind/Heart tabs
4. Try double-clicking skills to equip them
5. Save and reload - verify skills persist

## Console Error You'll See

When the bug occurs, you'll see:

```
Error: Cannot read properties of undefined (reading 'body')
    at getEquippedSkills (SkillScreen.tsx:463)
    at SkillScreen (SkillScreen.tsx:499)
```

Or:

```
TypeError: Cannot read properties of undefined (reading 'heart')
    at SkillScreen.tsx:526
```

## Related Issues

This is the same root cause as the CharacterSelectionPage error:
- `CharacterSelectionPage.tsx:424` - `availableSkills.length` fails
- Both caused by incomplete character data migration

## Priority

**HIGH** - This completely blocks access to the Skills tab, which is a core game feature.

## Estimated Fix Time

- 5 minutes to update migration function
- Or 2 minutes to clear database and test with fresh character

