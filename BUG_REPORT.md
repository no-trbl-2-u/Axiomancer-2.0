# Bug Report: CharacterSelectionPage Issue

## Issue Found with Chrome DevTools MCP

**Date**: October 2, 2025  
**Component**: `CharacterSelectionPage.tsx`  
**Status**: Identified, not yet fixed

## Problem Description

The CharacterSelectionPage crashes with a React error when trying to display character information after login.

### Error Details

```
Error: Cannot read properties of undefined (reading 'length')
```

**Location**: `CharacterSelectionPage.tsx:424`

**Error Stack Trace**:
```
at CharacterSelectionPage (http://localhost:3000/src/pages/CharacterSelectionPage.tsx:287:18)
```

### Root Cause

Line 424 in CharacterSelectionPage.tsx attempts to access `savedCharacter.character.availableSkills.length`:

```typescript
Skills Learned: {savedCharacter.character.availableSkills.length}<br/>
```

However, the `availableSkills` property is `undefined` in the character data returned from the backend.

### Investigation Steps Taken

1. ✅ Navigated to landing page
2. ✅ Clicked to reach login page
3. ✅ Entered credentials (asd@asd.com / asd)
4. ✅ Successfully logged in
5. ✅ Examined console errors
6. ✅ Examined network requests
7. ✅ Identified the exact line causing the error

### Network Request Analysis

The `/api/character/load` endpoint returns character data, but the character object is missing the `availableSkills` array or it's undefined.

**Request**: `GET http://localhost:3001/api/character/load`  
**Status**: 200 (successful)  
**Issue**: The returned character data structure doesn't include `availableSkills` or it's not being initialized properly.

## Possible Solutions

### Option 1: Add Null Safety Check (Quick Fix)
```typescript
Skills Learned: {savedCharacter.character.availableSkills?.length || 0}<br/>
```

### Option 2: Ensure Backend Returns Complete Data
Verify that the backend properly initializes and returns the `availableSkills` array when loading character data.

### Option 3: Data Migration
Add migration logic in `characterSave.ts` to ensure `availableSkills` is always defined:

```typescript
function migrateCharacterData(character: any): Character {
  return {
    ...character,
    availableSkills: character.availableSkills || []
  };
}
```

## Related Files

- `/axiomancer-frontend/src/pages/CharacterSelectionPage.tsx` (line 424)
- `/axiomancer-frontend/src/utils/characterSave.ts` (migration logic)
- `/axiomancer-frontend/src/services/characterService.ts` (API calls)
- `/axiomancer-backend/src/services/database.service.ts` (data storage)

## Testing Performed

- ✅ Chrome DevTools MCP used to reproduce the issue
- ✅ Console messages captured
- ✅ Network requests analyzed
- ✅ Source code location identified

## Recommended Action

Implement **Option 1** (null safety check) immediately as a hotfix, then investigate **Option 2** to ensure the backend properly initializes all character properties.

