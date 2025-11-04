# Zustand Quick Reference Guide

## 🚀 Quick Start

### Import the Store
```typescript
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
```

### Use in Components
```typescript
// Get state and actions
function MyComponent() {
  const characterName = useGameStore(state => state.gameState.character.name);
  const startCombat = useGameStore(state => state.startCombat);
  
  return <button onClick={() => startCombat('goblin')}>{characterName}</button>;
}
```

## 📚 Common Patterns

### 1. Subscribe to Single Value
```typescript
// ✅ Best - Only re-renders when name changes
const name = useGameStore(state => state.gameState.character.name);
```

### 2. Subscribe to Multiple Values
```typescript
// ✅ Good - Only re-renders when these values change
const { health, maxHealth } = useGameStore(state => ({
  health: state.gameState.character.health,
  maxHealth: state.gameState.character.maxHealth,
}));
```

### 3. Call Actions
```typescript
const updateCharacter = useGameStore(state => state.updateCharacter);

// Later
updateCharacter({ health: newHealth });
```

### 4. Access Outside Components
```typescript
// Get current state
const currentHealth = useGameStore.getState().gameState.character.health;

// Call actions
useGameStore.getState().updateCharacter({ health: 100 });

// Subscribe to changes
const unsubscribe = useGameStore.subscribe(
  (state) => console.log('State changed:', state)
);
```

## 🎮 Game Store Cheat Sheet

### Character Management
```typescript
// Create character
const createCharacter = useGameStore(state => state.createCharacter);
createCharacter({
  name: 'Philosopher',
  gender: 'male',
  portrait: { imageUrl: '...', description: '...' }
});

// Update character
const updateCharacter = useGameStore(state => state.updateCharacter);
updateCharacter({ health: 100, mana: 50 });

// Load saved character
const loadSavedCharacter = useGameStore(state => state.loadSavedCharacter);
await loadSavedCharacter();
```

### Navigation
```typescript
// Move to location
const moveToLocation = useGameStore(state => state.moveToLocation);
moveToLocation('forest');

// Move to node
const moveToNode = useGameStore(state => state.moveToNode);
moveToNode('guardian');

// Unlock node
const unlockNode = useGameStore(state => state.unlockNode);
unlockNode('fishing_town', 'town_square');
```

### Combat
```typescript
// Start combat
const startCombat = useGameStore(state => state.startCombat);
startCombat('abortive_fallacy');

// End combat
const endCombat = useGameStore(state => state.endCombat);
endCombat();

// Update combat state
const updateCombat = useGameStore(state => state.updateCombat);
updateCombat({ round: 2, turn: 'enemy' });
```

### Equipment
```typescript
// Equip item
const equipItem = useGameStore(state => state.equipItem);
equipItem('helmet', { id: 'iron_helmet', name: 'Iron Helmet', /* ... */ });

// Unequip item
const unequipItem = useGameStore(state => state.unequipItem);
unequipItem('helmet');
```

### Skills
```typescript
// Learn skill
const learnSkill = useGameStore(state => state.learnSkill);
learnSkill({
  id: 'basic_reasoning',
  name: 'Basic Reasoning',
  manaCost: 5,
  damage: 10,
  /* ... */
});

// Check if can learn
const canLearnSkill = useGameStore(state => state.canLearnSkill);
if (canLearnSkill(skill)) {
  learnSkill(skill);
}
```

### Inventory & Story
```typescript
// Update inventory
const updateInventory = useGameStore(state => state.updateInventory);
updateInventory({ gold: 100, wood: 10 });

// Update story
const updateStory = useGameStore(state => state.updateStory);
updateStory({ talkedToGuardian: true });

// Unlock progression
const unlockGuardianProgression = useGameStore(state => state.unlockGuardianProgression);
unlockGuardianProgression();
```

### Quests
```typescript
// Add quest
const addQuest = useGameStore(state => state.addQuest);
addQuest({
  id: 'quest_1',
  title: 'Learn Basic Reasoning',
  /* ... */
});

// Complete quest
const completeQuest = useGameStore(state => state.completeQuest);
completeQuest('quest_1');
```

### Persistence
```typescript
// Save game
const saveGame = useGameStore(state => state.saveGame);
await saveGame();

// Reset game
const resetGame = useGameStore(state => state.resetGame);
resetGame();
```

### Screen Navigation
```typescript
const changeScreen = useGameStore(state => state.changeScreen);
changeScreen('combat'); // 'exploration' | 'combat' | 'character' | 'skills' | 'inventory' | 'map'
```

## 🔐 Auth Store Cheat Sheet

### Authentication
```typescript
// Login
const login = useAuthStore(state => state.login);
await login({ email: 'user@example.com', password: 'password' });

// Register
const register = useAuthStore(state => state.register);
await register({ 
  username: 'player1', 
  email: 'user@example.com', 
  password: 'password' 
});

// Logout
const logout = useAuthStore(state => state.logout);
logout();

// Initialize auth (checks localStorage)
const initAuth = useAuthStore(state => state.initAuth);
initAuth();
```

### Auth State
```typescript
// Check auth status
const isAuthenticated = useAuthStore(state => state.isAuthenticated);
const isLoading = useAuthStore(state => state.isLoading);
const user = useAuthStore(state => state.user);
const token = useAuthStore(state => state.token);
```

## 🎨 Component Examples

### Character Display
```typescript
function CharacterDisplay() {
  const character = useGameStore(state => state.gameState.character);
  
  return (
    <div>
      <h2>{character.name}</h2>
      <p>HP: {character.health}/{character.maxHealth}</p>
      <p>MP: {character.mana}/{character.maxMana}</p>
    </div>
  );
}
```

### Combat Button
```typescript
function CombatButton({ enemyId }: { enemyId: string }) {
  const startCombat = useGameStore(state => state.startCombat);
  
  return (
    <button onClick={() => startCombat(enemyId)}>
      Fight!
    </button>
  );
}
```

### Auth Guard
```typescript
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
}
```

### Equipment Manager
```typescript
function EquipmentSlot({ slot }: { slot: EquipmentSlot }) {
  const equippedItem = useGameStore(
    state => state.gameState.character.equippedItems?.[slot]
  );
  const equipItem = useGameStore(state => state.equipItem);
  const unequipItem = useGameStore(state => state.unequipItem);
  
  const handleEquip = (item: Equipment) => {
    equipItem(slot, item);
  };
  
  const handleUnequip = () => {
    if (equippedItem) unequipItem(slot);
  };
  
  return (
    <div>
      {equippedItem ? (
        <div onClick={handleUnequip}>
          {equippedItem.icon} {equippedItem.name}
        </div>
      ) : (
        <div>Empty</div>
      )}
    </div>
  );
}
```

## 🔍 Performance Tips

### ✅ Do This
```typescript
// Subscribe to specific values
const name = useGameStore(state => state.gameState.character.name);
const health = useGameStore(state => state.gameState.character.health);
```

### ❌ Don't Do This
```typescript
// Subscribes to entire store (re-renders on any change)
const store = useGameStore();
const name = store.gameState.character.name;
```

### ✅ Do This
```typescript
// Actions can be safely destructured (they don't change)
const { startCombat, endCombat, updateCombat } = useGameStore(state => ({
  startCombat: state.startCombat,
  endCombat: state.endCombat,
  updateCombat: state.updateCombat,
}));
```

### ✅ Use Shallow Equality for Objects
```typescript
import { shallow } from 'zustand/shallow';

const baseStats = useGameStore(
  state => state.gameState.character.baseStats,
  shallow
);
```

## 🧪 Testing Examples

### Test Store Logic
```typescript
import { useGameStore } from './gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });
  
  it('should start combat', () => {
    const { startCombat } = useGameStore.getState();
    startCombat('goblin');
    
    const combat = useGameStore.getState().gameState.combat;
    expect(combat?.active).toBe(true);
    expect(combat?.enemy.id).toBe('goblin');
  });
  
  it('should equip items', () => {
    const { equipItem } = useGameStore.getState();
    
    const helmet = {
      id: 'iron_helmet',
      name: 'Iron Helmet',
      type: 'armor' as const,
      stats: { body: 5 },
      icon: '🪖'
    };
    
    equipItem('helmet', helmet);
    
    const equipped = useGameStore.getState().gameState.character.equippedItems?.helmet;
    expect(equipped?.id).toBe('iron_helmet');
  });
});
```

### Test Component with Store
```typescript
import { render, fireEvent } from '@testing-library/react';
import { useGameStore } from '../stores/gameStore';

function CombatButton() {
  const startCombat = useGameStore(state => state.startCombat);
  return <button onClick={() => startCombat('goblin')}>Fight</button>;
}

test('starts combat when clicked', () => {
  const { getByText } = render(<CombatButton />);
  
  fireEvent.click(getByText('Fight'));
  
  const combat = useGameStore.getState().gameState.combat;
  expect(combat?.active).toBe(true);
});
```

## 🛠️ DevTools

### Enable DevTools
Already enabled in stores:
```typescript
export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({ /* ... */ }),
    { name: 'axiomancer-game-store' }
  )
);
```

### Using DevTools
1. Install Redux DevTools browser extension
2. Open browser DevTools
3. Go to Redux tab
4. See state changes in real-time
5. Time-travel debug
6. Export/import state

## 📝 Migration from Context

### Old Pattern (Context)
```typescript
const { gameState, startCombat } = useGame();
```

### New Pattern (Zustand)
```typescript
const gameState = useGameStore(state => state.gameState);
const startCombat = useGameStore(state => state.startCombat);
```

### Both Work!
Context wrappers remain for backward compatibility, but Zustand is recommended for new code.

## 🔗 Useful Links

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [State Management Refactor Documentation](./State-Management-Refactor.md)
- [Refactor Summary](./REFACTOR_SUMMARY.md)

## 💡 Pro Tips

1. **Selective Subscriptions**: Only subscribe to what you need
2. **Actions Don't Trigger Re-renders**: Safe to use in effects
3. **Use `get()` in Actions**: Access current state inside actions
4. **Immutable Updates**: Always create new objects
5. **Outside React**: Access store with `.getState()` anywhere
6. **DevTools**: Use Redux DevTools for debugging
7. **Persistence**: Auth store auto-saves to localStorage
8. **Testing**: Test stores without React rendering

---

Happy coding! 🚀
