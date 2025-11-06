# Character Persistence Analysis

## Overview
The character persistence system has multiple components across the frontend and backend. Here's a comprehensive analysis of how characters are being saved and loaded.

---

## Architecture Flow

```
Frontend (React) ←→ Backend (Express) ←→ Database (SQLite/PostgreSQL)
    ↓                    ↓                       ↓
  gameStore          characterRoutes         character_states table
  characterService   DatabaseService         (stores full game state)
```

---

## Frontend Components

### 1. **Character Service** (`/axiomancer-frontend/src/services/characterService.ts`)
**Purpose**: HTTP client for communicating with the backend

**Key Methods**:
- `saveCharacter(gameState)` - POST to `/api/character/save`
- `loadCharacter()` - GET from `/api/character/load`
- `hasExistingCharacter()` - GET from `/api/character/exists`
- `deleteCharacter()` - DELETE `/api/character/delete`

**Important Detail**: Retrieves auth token from localStorage using Zustand persist:
```typescript
const getAuthToken = (): string | null => {
  const storeData = localStorage.getItem('axiomancer-auth-store');
  if (storeData) {
    const parsed = JSON.parse(storeData);
    return parsed.state?.token || null;  // Gets token from Zustand persist
  }
  return null;
};
```

### 2. **Character Save Utilities** (`/axiomancer-frontend/src/utils/characterSave.ts`)
**Purpose**: High-level wrapper around characterService with data migration and validation

**Key Functions**:
- `saveCharacter(gameState)` - Calls characterService.saveCharacter()
- `loadCharacter()` - Calls characterService.loadCharacter() with data migration
- `hasExistingCharacter()` - Checks if character exists on backend
- `deleteCharacter()` - Deletes character from backend
- `migrateCharacterData()` - Handles old→new stat system migration

**Saved Data Structure** (SavedCharacterData):
```typescript
{
  character: GameState['character'],
  currentLocation: string,
  currentNode: string,
  story: GameState['story'],
  inventory: GameState['inventory'],
  locations: GameState['locations'],
  questLog: GameState['questLog'],
  mapEnergy: number,
  maxMapEnergy: number,
  gamePhase: string,
  savedAt: number
}
```

### 3. **Game Store** (`/axiomancer-frontend/src/stores/gameStore.ts`)
**Purpose**: Zustand state management store for all game mechanics

**Key Persistence Methods**:
- `createCharacter(data)` - Creates new character and auto-saves after 500ms
- `loadSavedCharacter()` - Loads character from backend into game state
- `updateCharacter(updates)` - Updates character and auto-saves after 500ms
- `saveGame()` - Main save function called by other actions

**Auto-Save Strategy**: Debounced saves with 500ms timeout on most mutations:
```typescript
setTimeout(() => {
  get().saveGame();
}, 500);
```

**saveGame() Logic**:
```typescript
saveGame: async () => {
  const state = get();
  const char = state.gameState.character;
  
  // Only saves if character has name and valid id
  if (char && char.name && char.id !== 'placeholder') {
    await saveCharacter(state.gameState);
  } else {
    console.warn('Skipping save - character not ready');
  }
}
```

### 4. **App Routing** (`/axiomancer-frontend/src/App.tsx`)
**Purpose**: Determines which page to show based on character existence

**CharacterRoute Component**:
```typescript
const CharacterRoute: React.FC = (): JSX.Element => {
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCharacter = async () => {
      const result = await hasExistingCharacter();
      setHasCharacter(result);
    };
    checkCharacter();
  }, []);

  if (hasCharacter === null) {
    return <div>Loading...</div>;
  }

  if (hasCharacter) {
    return <Navigate to="/character-selection" replace />;
  } else {
    return <Navigate to="/character-creation" replace />;
  }
};
```

### 5. **Character Selection Page** (`/axiomancer-frontend/src/pages/CharacterSelectionPage.tsx`)
**Purpose**: Shows saved character or prompts to create new

**Flow**:
1. On mount, calls `loadCharacter()` to fetch saved data from backend
2. If character exists, shows "Continue Journey" button
3. If no character, shows "Create New Character" button
4. "Continue Journey" button calls `useGameStore.loadSavedCharacter()`

### 6. **Game Page** (`/axiomancer-frontend/src/pages/GamePage.tsx`)
**Purpose**: Entry point to main game

**Validation**:
```typescript
const character = useGameStore(state => state.gameState.character);

if (!character.name) {
  return <CharacterCreationScreen />;
}

return <MainGameInterface />;
```

---

## Backend Components

### 1. **Character Routes** (`/axiomancer-backend/src/routes/character.routes.ts`)
**Purpose**: API endpoints for character persistence

**Endpoints**:
- `POST /character/save` - Saves character state to database
- `GET /character/load` - Retrieves character state
- `GET /character/exists` - Checks if character exists
- `DELETE /character/delete` - Deletes character

**Auth**: All routes require `authenticateToken` middleware

**Load Endpoint Logic**:
```typescript
router.get('/load', authenticateToken, async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const characterState = await DatabaseService.getCharacterState(userId);
  
  if (!characterState) {
    res.status(404).json({ error: 'No character state found' });
    return;
  }
  
  res.status(200).json(characterState);
});
```

### 2. **Database Service** (`/axiomancer-backend/src/services/database.service.ts`)
**Purpose**: Database abstraction layer (supports SQLite and PostgreSQL)

**Schema** (character_states table):
```sql
CREATE TABLE character_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  character_data TEXT NOT NULL,          -- JSON serialized
  current_location TEXT NOT NULL,
  current_node TEXT NOT NULL,
  story_data TEXT NOT NULL,              -- JSON serialized
  inventory_data TEXT NOT NULL,          -- JSON serialized
  locations_data TEXT NOT NULL,          -- JSON serialized
  quest_log_data TEXT NOT NULL,          -- JSON serialized
  map_energy INTEGER DEFAULT 100,
  max_map_energy INTEGER DEFAULT 100,
  game_phase TEXT DEFAULT 'exploration',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)
```

**Key Methods**:
- `saveCharacterState(userId, state)` - INSERT or UPDATE
- `getCharacterState(userId)` - SELECT and deserialize JSON
- `deleteCharacterState(userId)` - DELETE

**mapRowToCharacterState()**:
```typescript
private static mapRowToCharacterState(row: any): any {
  return {
    character: JSON.parse(row.character_data),
    currentLocation: row.current_location,
    currentNode: row.current_node,
    story: JSON.parse(row.story_data),
    inventory: JSON.parse(row.inventory_data),
    locations: JSON.parse(row.locations_data),
    questLog: JSON.parse(row.quest_log_data),
    mapEnergy: row.map_energy,
    maxMapEnergy: row.max_map_energy,
    gamePhase: row.game_phase,
    savedAt: new Date(row.updated_at).getTime()
  };
}
```

---

## Identified Issues & Potential Problems

### Issue 1: No Automatic Load on App Startup
**Problem**: When user logs in, the game state is NOT automatically loaded from the database.

**Current Flow**:
1. User logs in → goes to `/` route
2. `CharacterRoute` checks `hasExistingCharacter()` 
3. If true, redirects to `/character-selection`
4. User sees selection page and must click "Continue Journey"
5. ONLY THEN is `loadSavedCharacter()` called

**Why Users Always See New Character**:
- The game state in `useGameStore` is initialized with empty character (`name: ''`)
- If user navigates directly or refresh on game page, character creation screen appears
- Characters may not be properly persisting between sessions

### Issue 2: Zustand Persist Not Configured for Game State
**Problem**: The game store uses Zustand but doesn't have persistence middleware for game data.

```typescript
export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'axiomancer-game-store',  // Only name, no persist middleware!
    }
  )
);
```

**Missing**: No `persist` middleware configured. This means game state is NOT automatically saved to localStorage.

### Issue 3: Auth Store Token Retrieval Fragile
**Problem**: Character service relies on manually parsing localStorage to get auth token:

```typescript
const getAuthToken = (): string | null => {
  const storeData = localStorage.getItem('axiomancer-auth-store');
  if (storeData) {
    try {
      const parsed = JSON.parse(storeData);
      return parsed.state?.token || null;
    } catch (e) {
      return null;
    }
  }
  return null;
};
```

**Risk**: If auth store structure changes, all character operations fail silently.

### Issue 4: Game Page Creates New Character if Store is Empty
**Problem**: On `/game` page:

```typescript
if (!character.name) {
  return <CharacterCreationScreen />;
}
```

If user navigates to `/game` directly, or store is reset, they'll see character creation even if they have a saved character in the database.

### Issue 5: No Error Handling for Load Failures
**Problem**: If character load fails, no user feedback. In `CharacterSelectionPage`:

```typescript
const handleContinueGame = async () => {
  try {
    const success = await loadSavedCharacter();
    if (success) {
      navigate('/game');
    } else {
      console.error('Failed to load saved character');
      // No error message shown to user
    }
  } catch (error) {
    console.error('Error loading saved character:', error);
    // No error message shown to user
  }
};
```

### Issue 6: Debounced Save May Lose Data
**Problem**: 500ms debounced saves mean unsaved data exists during gameplay. If user:
- Closes browser immediately after action
- Network disconnects
- App crashes

The last change won't be saved.

### Issue 7: No Save Confirmation Feedback
**Problem**: Users don't know if their save succeeded. Only console logs exist:
```typescript
console.log('✅ Character saved to backend successfully');
```

No visual indication (save icon, notification, etc.) for players.

### Issue 8: Character.id Generation Issues
**Problem**: Character ID is generated as:
```typescript
id: Date.now().toString()
```

Could create duplicates if two characters created within same millisecond.

---

## Data Flow Diagram

### Save Flow
```
User Action
    ↓
updateCharacter() / Other mutation
    ↓
setTimeout(...saveGame(), 500ms)  ← Debounced!
    ↓
saveGame() in gameStore
    ↓
saveCharacter(gameState) from characterSave.ts
    ↓
characterService.saveCharacter() via fetch
    ↓
POST /api/character/save (needs auth token)
    ↓
Backend authenticateToken middleware
    ↓
DatabaseService.saveCharacterState(userId, state)
    ↓
INSERT/UPDATE character_states (JSON serialized)
    ↓
Database (SQLite/PostgreSQL)
```

### Load Flow
```
User clicks "Continue Journey"
    ↓
handleContinueGame()
    ↓
useGameStore.loadSavedCharacter()
    ↓
loadCharacter() from characterSave.ts
    ↓
characterService.loadCharacter() via fetch
    ↓
GET /api/character/load (needs auth token)
    ↓
Backend authenticateToken middleware
    ↓
DatabaseService.getCharacterState(userId)
    ↓
SELECT * FROM character_states WHERE user_id = ?
    ↓
mapRowToCharacterState() deserializes JSON
    ↓
characterSave migrateCharacterData() handles old stats
    ↓
set() in gameStore updates gameState with loaded data
    ↓
Navigate to /game
```

---

## Why "Always Start with New Character"

### Most Likely Scenario:
1. **Backend save succeeds** - Data is in database
2. **Frontend doesn't auto-load** - Game store starts empty
3. **User thinks character is lost** - Actually just not loaded yet
4. **User creates new character** - Overwrites saved one (or saves alongside)

### Contributing Factors:
1. No automatic load on app startup
2. No visual confirmation of successful saves
3. Character routing relies on external API call at page load time
4. No Zustand persist for game state fallback
5. Unclear flow between pages

---

## Recommended Fixes (Priority Order)

### Priority 1: Add Zustand Persist for Game State
```typescript
import { persist } from 'zustand/middleware';

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({ /* store */ }),
      {
        name: 'axiomancer-game-store',
        partialize: (state) => ({
          gameState: state.gameState,
          // Don't persist currentScreen if you want it to reset
        }),
      }
    )
  )
);
```

### Priority 2: Auto-Load on Game Page Mount
In `GamePage.tsx`:
```typescript
useEffect(() => {
  if (!character.name) {
    useGameStore.getState().loadSavedCharacter();
  }
}, [character.name]);
```

### Priority 3: Add Save Feedback
Add visual indicator in UI when save completes:
```typescript
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

saveGame: async () => {
  setSaveStatus('saving');
  try {
    await saveCharacter(state.gameState);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  } catch (error) {
    setSaveStatus('error');
  }
}
```

### Priority 4: Improve Error Handling
Show user-facing error messages instead of console logs only.

### Priority 5: Use Better Character ID
```typescript
id: crypto.randomUUID() // or nanoid()
```

### Priority 6: Handle Save Failures Gracefully
Retry failed saves, show error UI, suggest manual backup.

---

## Testing Recommendations

### Test 1: Character Persistence Across Sessions
1. Create character
2. Make progress (move locations, gain XP, etc.)
3. Refresh browser
4. Verify character loads with all progress intact

### Test 2: Simultaneous Save Attempts
1. Trigger multiple saves quickly
2. Verify database has correct final state (no race conditions)

### Test 3: Network Failure Recovery
1. Create character
2. Disable network
3. Try to save
4. Re-enable network
5. Verify save eventually succeeds

### Test 4: Character Overwrite
1. Create character A
2. Save it
3. Create character B
4. Verify character A is NOT overwritten (or handle appropriately)

### Test 5: Auth Token Expiry
1. Start game with valid token
2. Simulate token expiry
3. Attempt save
4. Verify graceful error handling

---

## File Locations Summary

| Component | File Path |
|-----------|-----------|
| Character Service | `/axiomancer-frontend/src/services/characterService.ts` |
| Character Save Utils | `/axiomancer-frontend/src/utils/characterSave.ts` |
| Game Store | `/axiomancer-frontend/src/stores/gameStore.ts` |
| App Router | `/axiomancer-frontend/src/App.tsx` |
| Character Selection | `/axiomancer-frontend/src/pages/CharacterSelectionPage.tsx` |
| Game Page | `/axiomancer-frontend/src/pages/GamePage.tsx` |
| Character Routes | `/axiomancer-backend/src/routes/character.routes.ts` |
| Database Service | `/axiomancer-backend/src/services/database.service.ts` |

---

## Code Snippets for Investigation

### Check Database for Saved Characters
Run in backend:
```typescript
// In database service
static async getAllCharacters(): Promise<any[]> {
  if (this.sqliteDb) {
    return new Promise((resolve, reject) => {
      this.sqliteDb!.all('SELECT user_id, character_data FROM character_states', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}
```

### Log Auth Token Status
In `characterService.ts`:
```typescript
const token = getAuthToken();
console.log('Auth token available:', !!token);
console.log('Token value:', token ? token.substring(0, 20) + '...' : 'none');
```

### Add Save Logging
In `gameStore.ts` saveGame:
```typescript
console.log('Attempting to save:', {
  characterName: char.name,
  characterId: char.id,
  location: state.gameState.currentLocation,
  level: char.level,
  timestamp: new Date().toISOString()
});
```

