# Skill Saving and Portrait Issues - Fixed

## Issues Identified and Resolved

### Issue 1: Skills Not Persisting After Equipping ✅ FIXED

**Problem:**
When players equipped or unequipped skills in the Skills tab, the changes were stored in the Zustand store (in-memory state) but were **not being saved** to the backend/localStorage. This meant that:
- Skills would appear equipped during the current session
- After refreshing the page or reloading the game, all equipped skills would be lost
- Players couldn't use their equipped skills in combat after a reload

**Root Cause:**
The `equipSkill()` and `unequipSkill()` functions in `gameStore.ts` were missing the auto-save functionality that other similar functions had.

**Comparison:**
- ✅ `equipItem()` (line 1250) - calls `saveGame()` after changes
- ✅ `updateCharacter()` (line 1011) - calls `saveGame()` after changes  
- ❌ `equipSkill()` (line 1382) - **was NOT calling** `saveGame()`
- ❌ `unequipSkill()` (line 1426) - **was NOT calling** `saveGame()`

**Solution Applied:**
Added auto-save functionality to both skill management functions:

```typescript
// In equipSkill() - Added after line 1418
setTimeout(() => {
  get().saveGame();
}, 500);

// In unequipSkill() - Added after line 1448  
setTimeout(() => {
  get().saveGame();
}, 500);
```

**Files Modified:**
- `/home/pn143/Workspace/Axiomancer-2.0/axiomancer-frontend/src/stores/gameStore.ts`

**Testing:**
To verify the fix works:
1. Go to the Skills tab
2. Double-click to equip/unequip skills
3. Check the console for "📝 Game saved successfully" message
4. Refresh the page
5. Navigate back to Skills tab - your equipped skills should still be there
6. Start a combat - your equipped skills should be available to use

---

### Issue 2: Portrait Always Missing/Not Displaying ✅ IMPROVED

**Problem:**
The character portrait in the top bar of `MainGameInterface` was not displaying correctly. The `getPortraitUrl()` function was returning the default portrait even when a portrait should have been set.

**Root Cause:**
The portrait checking logic was too simple and didn't provide enough debugging information to understand why portraits were missing.

**Solution Applied:**
Enhanced the `getPortraitUrl()` function with:
1. Better debugging logs to see what portrait data exists
2. More defensive optional chaining (`character?.portrait?.imageUrl`)
3. Corrected default portrait path (`.png` → `.jpg`)

```typescript
const getPortraitUrl = () => {
  console.log("Character portrait data:", {
    hasPortrait: !!character.portrait,
    portraitData: character.portrait,
    imageUrl: character.portrait?.imageUrl
  });
  
  if (character?.portrait?.imageUrl) {
    return character.portrait.imageUrl;
  }
  
  // Fallback to default portrait
  return '/portraits/c-begger.jpg';
};
```

**Files Modified:**
- `/home/pn143/Workspace/Axiomancer-2.0/axiomancer-frontend/src/components/game/MainGameInterface.tsx`

**Debugging:**
When you load the game, check the browser console for the log message:
```
Character portrait data: {
  hasPortrait: true/false,
  portraitData: {...},
  imageUrl: "..."
}
```

This will tell you:
- Whether the portrait object exists
- What data is in the portrait object
- What the imageUrl value is

**Possible Remaining Issues:**
If the portrait is still not showing after this fix, it could be:

1. **Portrait not saved during character creation** - Check that `createCharacter()` in `gameStore.ts` is receiving the portrait data correctly
2. **Portrait lost during save/load** - The `characterService.ts` saves the entire character object, so this should work, but verify the backend is storing/returning the portrait field
3. **Image file doesn't exist** - Make sure the portrait image file exists at the path specified in `imageUrl`

---

## How Character Data Flows

### Character Creation Flow:
1. User selects portrait in `CharacterCreationScreen.tsx`
2. `createCharacter()` is called with portrait data:
   ```typescript
   createCharacter({
     name: name.trim(),
     gender,
     portrait: {
       imageUrl: selectedPortrait,
       description: `${gender} character portrait`
     },
     baseStats
   });
   ```
3. `gameStore.ts` creates character with portrait
4. Auto-save triggers after 500ms
5. `characterService.ts` saves to backend/localStorage

### Character Loading Flow:
1. `loadSavedCharacter()` called on app start
2. `characterService.loadCharacter()` fetches from backend or localStorage
3. Character data (including portrait) loaded into Zustand store
4. `MainGameInterface` renders with character data
5. `getPortraitUrl()` extracts portrait URL or uses default

### Skill Equipping Flow (NOW WITH SAVE):
1. User double-clicks skill in `SkillScreen.tsx`
2. `equipSkill(skill, aspect)` called
3. Skill added to `character.equippedSkills[aspect]` array
4. ✅ **NEW:** Auto-save triggers after 500ms
5. `characterService.saveCharacter()` persists to backend/localStorage
6. Skills available in combat and persist across sessions

---

## Testing Checklist

### Test Skill Saving:
- [ ] Equip a skill in the Skills tab
- [ ] See "📝 Game saved successfully" in console
- [ ] Refresh the page
- [ ] Verify skill is still equipped
- [ ] Enter combat
- [ ] Verify equipped skills are available to use

### Test Portrait Display:
- [ ] Create a new character with a portrait
- [ ] Check console for portrait data log
- [ ] Verify portrait displays in top bar
- [ ] Save and reload game
- [ ] Verify portrait still displays after reload

---

## Additional Notes

### Why 500ms Delay?
The `setTimeout(() => get().saveGame(), 500)` pattern is used throughout the codebase to:
- Debounce rapid state changes
- Prevent excessive API calls
- Allow React to finish rendering before saving
- Batch multiple changes into a single save operation

### Auto-Save Locations:
Currently, auto-save is triggered by:
- `createCharacter()` - after character creation
- `updateCharacter()` - after any character update
- `equipItem()` - after equipping items
- `unequipItem()` - after unequipping items
- ✅ **NEW:** `equipSkill()` - after equipping skills
- ✅ **NEW:** `unequipSkill()` - after unequipping skills

### Future Improvements:
1. Add visual feedback when saving (e.g., "Saving..." indicator)
2. Add error handling for failed saves
3. Consider adding a manual "Save Game" button
4. Add confirmation when skills are equipped/unequipped
5. Investigate why portrait might be missing in some cases

