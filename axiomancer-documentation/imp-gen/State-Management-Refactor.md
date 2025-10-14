# State Management Refactor

## Overview

This document describes the refactoring of Axiomancer's state management from React Context/Provider pattern to **Zustand**, a lightweight state management library. This refactor achieves two major goals:

1. **UI-Agnostic Game Mechanics**: All game logic is now separated from UI components and lives in centralized stores
2. **Better Performance & DX**: Zustand provides better performance, devtools support, and simpler API compared to Context

## Table of Contents

- [Why Zustand?](#why-zustand)
- [Architecture Overview](#architecture-overview)
- [How to Use Zustand](#how-to-use-zustand)
- [Migration Guide](#migration-guide)
- [Store Reference](#store-reference)
- [Best Practices](#best-practices)
- [Examples from This Repository](#examples-from-this-repository)

---

## Why Zustand?

### Problems with React Context

1. **Performance Issues**: Every context update re-renders all consuming components
2. **Prop Drilling Alternative**: Context was often overused as a solution to prop drilling
3. **Tight UI Coupling**: Game logic was mixed with React-specific code
4. **Complex Testing**: Testing context-based logic required extensive React wrapper setup
5. **No DevTools**: Limited debugging capabilities

### Benefits of Zustand

1. **Minimal Boilerplate**: Simple API with no providers needed
2. **Performance**: Components only re-render when the data they use changes
3. **UI-Agnostic**: Store logic is pure TypeScript, testable without React
4. **DevTools Support**: Built-in Redux DevTools integration
5. **Persistence**: Easy state persistence with middleware
6. **TypeScript First**: Excellent TypeScript support out of the box

---

## Architecture Overview

### Store Structure

```
src/
├── stores/
│   ├── gameStore.ts      # All game mechanics and state
│   └── authStore.ts      # Authentication state and logic
├── contexts/             # Legacy compatibility wrappers
│   ├── GameContext.tsx   # Wraps gameStore for backward compatibility
│   └── AuthContext.tsx   # Wraps authStore for backward compatibility
```

### Design Principles

1. **Single Source of Truth**: All state lives in stores
2. **UI-Agnostic Logic**: Game mechanics have zero React dependencies
3. **Selective Subscriptions**: Components subscribe only to needed state slices
4. **Immutable Updates**: All state updates create new objects
5. **Side Effects in Actions**: All async logic and side effects in store actions

---

## How to Use Zustand

### Basic Concepts

Zustand stores are created using the `create` function and return a hook that can be used in any React component.

### 1. Creating a Store

```typescript
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterStore>((set) => ({
  // Initial state
  count: 0,
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### 2. Using a Store in Components

```typescript
import { useCounterStore } from '../stores/counterStore';

function Counter() {
  // Subscribe to entire store
  const { count, increment, decrement } = useCounterStore();
  
  // Or subscribe to specific values (better performance)
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### 3. Accessing Store Outside Components

```typescript
import { useCounterStore } from '../stores/counterStore';

// Get current state
const currentCount = useCounterStore.getState().count;

// Call actions
useCounterStore.getState().increment();

// Subscribe to changes
const unsubscribe = useCounterStore.subscribe(
  (state) => console.log('Count changed:', state.count)
);
```

### 4. Advanced: Using Middleware

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
      }),
      {
        name: 'user-storage', // localStorage key
      }
    ),
    {
      name: 'user-store', // DevTools name
    }
  )
);
```

---

## Migration Guide

### Old Pattern (React Context)

```typescript
// Context definition
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const startCombat = (enemyId: string) => {
    dispatch({ type: 'START_COMBAT', payload: { enemyId } });
  };
  
  return (
    <GameContext.Provider value={{ state, startCombat }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook usage
export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}

// Component usage
function CombatButton() {
  const { startCombat } = useGame();
  return <button onClick={() => startCombat('goblin')}>Fight!</button>;
}
```

### New Pattern (Zustand)

```typescript
// Store definition
import { create } from 'zustand';

interface GameStore {
  combat: CombatState | null;
  startCombat: (enemyId: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  combat: null,
  
  startCombat: (enemyId: string) => {
    const enemy = createEnemyByType(enemyId);
    set({ 
      combat: {
        active: true,
        player: /* ... */,
        enemy,
        // ... other combat state
      }
    });
  },
}));

// Component usage (no provider needed!)
function CombatButton() {
  const startCombat = useGameStore((state) => state.startCombat);
  return <button onClick={() => startCombat('goblin')}>Fight!</button>;
}
```

### Key Differences

1. **No Provider Required**: Zustand stores work without wrapping components
2. **Simpler API**: Direct function calls instead of dispatch actions
3. **Selective Subscriptions**: Components only re-render on used state changes
4. **Better TypeScript**: Full type inference without complex generics

---

## Store Reference

### Game Store (`gameStore.ts`)

The game store contains all game mechanics and state management.

#### State Structure

```typescript
interface GameStore {
  gameState: GameState;           // Complete game state
  currentScreen: GameScreen;      // Current UI screen
  
  // Character management
  createCharacter: (data: CreateCharacterData) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  loadSavedCharacter: () => Promise<boolean>;
  
  // Navigation
  moveToLocation: (locationId: string) => void;
  moveToNode: (nodeId: string) => void;
  unlockNode: (locationId: string, nodeId: string) => void;
  
  // Combat
  startCombat: (enemyId: string) => void;
  endCombat: () => void;
  updateCombat: (updates: Partial<CombatState>) => void;
  
  // Inventory & Equipment
  updateInventory: (updates: Partial<Inventory>) => void;
  equipItem: (slot: EquipmentSlot, item: Equipment) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  
  // Skills
  learnSkill: (skill: Skill) => void;
  canLearnSkill: (skill: Skill) => boolean;
  
  // Story progression
  updateStory: (updates: Partial<StoryState>) => void;
  unlockGuardianProgression: () => void;
  
  // Quests
  addQuest: (quest: Quest) => void;
  completeQuest: (questId: string) => void;
  
  // Persistence
  saveGame: () => Promise<void>;
  resetGame: () => void;
}
```

### Auth Store (`authStore.ts`)

The auth store manages authentication state.

#### State Structure

```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}
```

---

## Best Practices

### 1. Use Selective Subscriptions

**❌ Bad** - Subscribes to entire store:
```typescript
function MyComponent() {
  const store = useGameStore();
  // Component re-renders on ANY store change
  return <div>{store.gameState.character.name}</div>;
}
```

**✅ Good** - Subscribes to specific values:
```typescript
function MyComponent() {
  const characterName = useGameStore(state => state.gameState.character.name);
  // Component only re-renders when character name changes
  return <div>{characterName}</div>;
}
```

### 2. Keep Actions in the Store

**❌ Bad** - Logic in component:
```typescript
function EquipButton({ item }: { item: Equipment }) {
  const { character, updateCharacter } = useGameStore();
  
  const handleEquip = () => {
    const newStats = calculateStats(character, item);
    updateCharacter({ stats: newStats });
  };
  
  return <button onClick={handleEquip}>Equip</button>;
}
```

**✅ Good** - Logic in store:
```typescript
// In store
equipItem: (slot: EquipmentSlot, item: Equipment) => {
  set((state) => {
    const newStats = calculateStats(state.gameState.character, item);
    return {
      gameState: {
        ...state.gameState,
        character: {
          ...state.gameState.character,
          equippedItems: { ...state.gameState.character.equippedItems, [slot]: item },
          stats: newStats,
        },
      },
    };
  });
},

// In component
function EquipButton({ item }: { item: Equipment }) {
  const equipItem = useGameStore(state => state.equipItem);
  return <button onClick={() => equipItem('helmet', item)}>Equip</button>;
}
```

### 3. Use `get()` for Accessing Current State in Actions

```typescript
export const useGameStore = create<GameStore>((set, get) => ({
  unlockGuardianProgression: () => {
    const state = get(); // Get current state
    const guardianNode = state.gameState.locations[state.gameState.currentLocation]
      ?.nodes?.find(n => n.id === 'guardian');
    
    if (guardianNode?.connections) {
      guardianNode.connections.forEach(nodeId => {
        get().unlockNode(state.gameState.currentLocation, nodeId);
      });
    }
  },
}));
```

### 4. Immutable Updates

Always create new objects when updating state:

```typescript
// ❌ Bad - Mutates state
updateCharacter: (updates) => {
  set((state) => {
    state.gameState.character.health = updates.health; // WRONG!
    return state;
  });
},

// ✅ Good - Creates new objects
updateCharacter: (updates) => {
  set((state) => ({
    gameState: {
      ...state.gameState,
      character: {
        ...state.gameState.character,
        ...updates,
      },
    },
  }));
},
```

### 5. Async Actions with Error Handling

```typescript
loadSavedCharacter: async (): Promise<boolean> => {
  try {
    const savedData = await loadCharacter();
    if (!savedData) return false;
    
    set({
      gameState: {
        character: savedData.character,
        // ... rest of state
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to load:', error);
    return false;
  }
},
```

---

## Examples from This Repository

### Example 1: Starting Combat (Game Store)

```typescript
// From: src/stores/gameStore.ts

startCombat: (enemyId: string) => {
  const state = get();
  const enemy = createEnemyByType(enemyId);
  
  set({
    gameState: {
      ...state.gameState,
      combat: {
        active: true,
        turn: 'player',
        phase: 'choosing_aspect',
        round: 1,
        player: state.gameState.character,
        enemy,
        playerChoice: {},
        enemyChoice: {},
        roundResult: null,
        advantages: { player: 0, enemy: 0 },
        playerBuffs: clearAllBuffsDebuffs(),
        enemyBuffs: clearAllBuffsDebuffs(),
        agreeToDisagreeCounter: 0,
        log: [
          { id: '1', timestamp: Date.now(), actor: 'System', action: 'start', target: 'combat' },
          { id: '2', timestamp: Date.now(), actor: enemy.name, action: 'appears', target: 'battlefield' }
        ]
      }
    },
    currentScreen: 'combat',
  });
},
```

**Usage in Component:**
```typescript
// From: src/components/game/GlobalLocalMapScreen.tsx

function MapNode({ node }: { node: GameNode }) {
  const startCombat = useGameStore(state => state.startCombat);
  
  const handleNodeClick = () => {
    if (node.event?.type === 'combat') {
      startCombat(node.event.enemyId);
    }
  };
  
  return <NodeButton onClick={handleNodeClick}>{node.name}</NodeButton>;
}
```

### Example 2: Equipment Management (Game Store)

```typescript
// From: src/stores/gameStore.ts

equipItem: (slot: EquipmentSlot, item: Equipment) => {
  set((state) => {
    // Update equipped items
    const newEquippedItems = {
      ...state.gameState.character.equippedItems,
      [slot]: item,
    };

    // Recalculate stats with new equipment
    const totalBaseStats = calculateTotalBaseStats(
      state.gameState.character.baseStats, 
      newEquippedItems
    );
    const newDerivedStats = calculateDerivedStats(totalBaseStats);
    const newMaxHP = calculateMaxHP(totalBaseStats);
    const newMaxMP = calculateMaxMP(totalBaseStats);

    console.log(`⚔️ Equipped ${item.name} to ${slot}`);

    return {
      gameState: {
        ...state.gameState,
        character: {
          ...state.gameState.character,
          equippedItems: newEquippedItems,
          derivedStats: newDerivedStats,
          maxHealth: newMaxHP,
          maxMana: newMaxMP,
          health: Math.min(state.gameState.character.health, newMaxHP),
          mana: Math.min(state.gameState.character.mana, newMaxMP),
        },
      },
    };
  });
},
```

**Usage in Component:**
```typescript
// From: src/components/game/InventoryScreen.tsx

function EquipmentSlot({ slot, item }: Props) {
  const equipItem = useGameStore(state => state.equipItem);
  const unequipItem = useGameStore(state => state.unequipItem);
  
  const handleDrop = (droppedItem: Equipment) => {
    equipItem(slot, droppedItem);
  };
  
  const handleUnequip = () => {
    if (item) unequipItem(slot);
  };
  
  return (
    <SlotContainer onDrop={handleDrop}>
      {item ? (
        <ItemIcon onClick={handleUnequip}>{item.icon}</ItemIcon>
      ) : (
        <EmptySlot>Empty</EmptySlot>
      )}
    </SlotContainer>
  );
}
```

### Example 3: Authentication (Auth Store)

```typescript
// From: src/stores/authStore.ts

login: async (credentials: LoginCredentials) => {
  try {
    set({ isLoading: true });
    const response = await authService.login(credentials);

    localStorage.setItem('axiomancer_token', response.token);
    localStorage.setItem('axiomancer_user', JSON.stringify(response.user));

    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      isLoading: false,
    });
  } catch (error) {
    set({ isLoading: false });
    throw error;
  }
},
```

**Usage in Component:**
```typescript
// From: src/pages/LoginPage.tsx

function LoginPage() {
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Navigate to game
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example 4: Complex Game Logic (Story Progression)

```typescript
// From: src/stores/gameStore.ts

unlockGuardianProgression: () => {
  const state = get();
  console.log('🌟 unlockGuardianProgression() called!');

  // Create the Basic Reasoning skill
  const basicReasoningSkill: Skill = {
    id: 'basic_reasoning',
    name: 'Basic Reasoning',
    description: 'Fundamental logical thinking skills unlocked by your guardian.',
    level: 1,
    manaCost: 5,
    damage: 10,
    icon: '🤔',
    type: 'logic',
    philosophicalAspect: 'mind',
  };

  // Update story flag
  get().updateStory({ talkedToGuardian: true });
  
  // Add skill to character
  get().updateCharacter({
    skills: [basicReasoningSkill]
  });

  // Unlock connected nodes
  const guardianNode = state.gameState.locations[state.gameState.currentLocation]
    ?.nodes?.find(n => n.id === 'guardian');

  if (guardianNode?.connections) {
    guardianNode.connections.forEach(connectedNodeId => {
      console.log(`🔓 Unlocking node: ${connectedNodeId}`);
      get().unlockNode(state.gameState.currentLocation, connectedNodeId);
    });
  }
},
```

**Usage in Component:**
```typescript
// From: src/components/game/EventModal.tsx

function GuardianDialogue() {
  const unlockGuardianProgression = useGameStore(
    state => state.unlockGuardianProgression
  );
  
  const handleChoice = (choiceId: string) => {
    if (choiceId === 'learn_reasoning' || choiceId === 'learn_reasoning_eager') {
      unlockGuardianProgression();
      closeModal();
    }
  };
  
  return (
    <DialogueBox>
      <p>Your guardian speaks about reasoning...</p>
      <button onClick={() => handleChoice('learn_reasoning')}>
        Please teach me, Guardian
      </button>
    </DialogueBox>
  );
}
```

### Example 5: Accessing Store Outside React

```typescript
// From: src/utils/combatMechanics.ts

import { useGameStore } from '../stores/gameStore';

export function executeCombatTurn(playerChoice: CombatChoice) {
  // Access store outside component
  const gameState = useGameStore.getState().gameState;
  const updateCombat = useGameStore.getState().updateCombat;
  
  if (!gameState.combat) return;
  
  // Perform combat calculations
  const result = calculateCombatResult(
    gameState.combat.player,
    gameState.combat.enemy,
    playerChoice
  );
  
  // Update combat state
  updateCombat({
    round: gameState.combat.round + 1,
    log: [...gameState.combat.log, result.logEntry],
  });
  
  return result;
}
```

### Example 6: Multiple Subscriptions in One Component

```typescript
// From: src/components/game/CombatScreen.tsx

function CombatScreen() {
  // Subscribe to different pieces of state
  const combat = useGameStore(state => state.gameState.combat);
  const character = useGameStore(state => state.gameState.character);
  const startCombat = useGameStore(state => state.startCombat);
  const endCombat = useGameStore(state => state.endCombat);
  const updateCharacter = useGameStore(state => state.updateCharacter);
  
  // Component only re-renders when these specific values change
  
  if (!combat) return null;
  
  return (
    <CombatContainer>
      <PlayerPanel character={character} />
      <EnemyPanel enemy={combat.enemy} />
      <ActionButtons onAttack={handleAttack} onDefend={handleDefend} />
    </CombatContainer>
  );
}
```

---

## Testing with Zustand

### Testing Store Logic

```typescript
// gameStore.test.ts
import { useGameStore } from './gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().resetGame();
  });
  
  it('should start combat correctly', () => {
    const { startCombat, gameState } = useGameStore.getState();
    
    startCombat('goblin');
    
    expect(gameState.combat).toBeDefined();
    expect(gameState.combat?.enemy.id).toBe('goblin');
    expect(gameState.combat?.active).toBe(true);
  });
  
  it('should equip items and recalculate stats', () => {
    const { equipItem, gameState } = useGameStore.getState();
    
    const helmet = {
      id: 'iron_helmet',
      name: 'Iron Helmet',
      type: 'armor',
      stats: { body: 5 },
      icon: '🪖'
    };
    
    const initialDefense = gameState.character.derivedStats.physicalDefense;
    equipItem('helmet', helmet);
    
    const newDefense = useGameStore.getState().gameState.character.derivedStats.physicalDefense;
    expect(newDefense).toBeGreaterThan(initialDefense);
  });
});
```

### Testing Components with Zustand

```typescript
// CombatButton.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { useGameStore } from '../stores/gameStore';
import CombatButton from './CombatButton';

describe('CombatButton', () => {
  it('should start combat when clicked', () => {
    const { getByText } = render(<CombatButton enemyId="goblin" />);
    
    fireEvent.click(getByText('Fight!'));
    
    const combat = useGameStore.getState().gameState.combat;
    expect(combat).toBeDefined();
    expect(combat?.enemy.id).toBe('goblin');
  });
});
```

---

## Debugging with DevTools

Zustand integrates with Redux DevTools for powerful debugging:

1. Install Redux DevTools browser extension
2. Stores wrapped with `devtools()` middleware appear in the extension
3. Inspect state changes, time-travel debug, and export/import state

```typescript
// DevTools middleware usage
export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'axiomancer-game-store', // Name shown in DevTools
    }
  )
);
```

---

## Performance Considerations

### Render Optimization

Zustand automatically prevents unnecessary re-renders:

```typescript
// Component only re-renders when characterName changes
function CharacterName() {
  const name = useGameStore(state => state.gameState.character.name);
  return <h1>{name}</h1>;
}

// This component won't re-render when character name changes!
function CombatLog() {
  const log = useGameStore(state => state.gameState.combat?.log);
  return <div>{log?.map(entry => <p>{entry}</p>)}</div>;
}
```

### Comparing Complex Objects

For deep object comparisons, use a custom equality function:

```typescript
import { shallow } from 'zustand/shallow';

function CharacterStats() {
  const stats = useGameStore(
    state => state.gameState.character.baseStats,
    shallow // Only re-render if stats object reference changes
  );
  
  return <StatsDisplay stats={stats} />;
}
```

---

## Conclusion

The refactor to Zustand provides:

✅ **UI-Agnostic Game Mechanics** - All logic separated from React components  
✅ **Better Performance** - Selective subscriptions and optimized re-renders  
✅ **Improved DX** - Simpler API, better TypeScript support, DevTools  
✅ **Easier Testing** - Pure functions testable without React  
✅ **Future-Proof** - Easy to migrate to other frameworks if needed  

The Context wrappers remain for backward compatibility but new code should use Zustand stores directly with `useGameStore()` and `useAuthStore()`.

---

## Additional Resources

- [Zustand Official Documentation](https://github.com/pmndrs/zustand)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
- [TypeScript with Zustand](https://docs.pmnd.rs/zustand/guides/typescript)
