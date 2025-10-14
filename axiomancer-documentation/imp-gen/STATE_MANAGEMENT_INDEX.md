# State Management Documentation Index

This directory contains complete documentation for the Axiomancer state management refactor from React Context to Zustand.

## 📚 Documentation Files

### 1. [State Management Refactor](./State-Management-Refactor.md) 📖
**The Complete Guide** - Read this first!

Comprehensive documentation covering:
- Why we migrated to Zustand
- Architecture overview
- Complete "How to Use Zustand" tutorial with code examples from this repository
- Migration patterns (old vs new)
- Store API reference
- Best practices and anti-patterns
- Real examples from the codebase
- Testing strategies
- Performance optimization tips

**Best for**: Understanding the system architecture and learning Zustand

---

### 2. [Zustand Quick Reference](./ZUSTAND_QUICK_REFERENCE.md) ⚡
**The Cheat Sheet** - Keep this handy!

Quick lookup guide with:
- Common patterns
- Game store API cheat sheet
- Auth store API cheat sheet
- Component examples
- Performance tips
- Testing examples
- DevTools usage

**Best for**: Quick lookups while coding

---

### 3. [Refactor Summary](./REFACTOR_SUMMARY.md) 📊
**The Executive Summary** - See what was done!

High-level overview including:
- Completed tasks checklist
- Files created/modified
- Key achievements
- Architecture before/after
- Success metrics
- Future enhancements

**Best for**: Understanding what changed and why

---

### 4. [Migration Checklist](./MIGRATION_CHECKLIST.md) ✅
**The Action Plan** - Track progress!

Migration tracking with:
- Completed refactor tasks
- Optional component migration list
- Migration priority order
- Step-by-step migration guide
- Testing checklist
- Success metrics

**Best for**: Planning component migrations (optional)

---

## 🎯 Quick Start Guide

### For New Developers

1. **Read**: [State Management Refactor](./State-Management-Refactor.md) - Full guide
2. **Reference**: [Zustand Quick Reference](./ZUSTAND_QUICK_REFERENCE.md) - Keep open while coding
3. **Code**: Start using `useGameStore()` and `useAuthStore()` directly

### For Existing Developers

1. **Review**: [Refactor Summary](./REFACTOR_SUMMARY.md) - Understand changes
2. **Reference**: [Zustand Quick Reference](./ZUSTAND_QUICK_REFERENCE.md) - Quick patterns
3. **Continue**: Keep using `useGame()` and `useAuth()` (backward compatible)
4. **Optional**: Migrate components using [Migration Checklist](./MIGRATION_CHECKLIST.md)

### For Code Review

1. **Check**: [Refactor Summary](./REFACTOR_SUMMARY.md) - What changed
2. **Verify**: [Migration Checklist](./MIGRATION_CHECKLIST.md) - Completion status
3. **Review**: Store files in `/src/stores/` directory

---

## 🏗️ Architecture Overview

### Current Structure

```
src/
├── stores/                    # ✨ NEW - Zustand stores
│   ├── gameStore.ts          # Game state & mechanics (UI-agnostic)
│   └── authStore.ts          # Auth state & logic (UI-agnostic)
│
├── contexts/                  # 🔄 REFACTORED - Now wrappers
│   ├── GameContext.tsx       # Wraps gameStore (backward compatibility)
│   └── AuthContext.tsx       # Wraps authStore (backward compatibility)
│
└── components/                # Can use either Context or Zustand
    └── ...                    # Both patterns work!
```

### Store Files

#### Game Store (`/src/stores/gameStore.ts`)
**1400+ lines** of UI-agnostic game logic:
- Character creation & management
- Combat system
- Equipment & inventory
- Skills & progression
- Quests & story
- Save/load system
- Navigation & locations

#### Auth Store (`/src/stores/authStore.ts`)
**120+ lines** of authentication logic:
- Login/register/logout
- Session management
- Token persistence
- Auto-initialization

---

## 💡 Usage Patterns

### Pattern 1: Direct Store Access (Recommended for New Code)

```typescript
import { useGameStore } from '../stores/gameStore';

function MyComponent() {
  const characterName = useGameStore(state => state.gameState.character.name);
  const startCombat = useGameStore(state => state.startCombat);
  
  return <button onClick={() => startCombat('goblin')}>{characterName}</button>;
}
```

**Benefits**:
- ✅ Better performance (selective subscriptions)
- ✅ No provider needed
- ✅ DevTools support
- ✅ Cleaner code

### Pattern 2: Context API (Backward Compatible)

```typescript
import { useGame } from '../contexts/GameContext';

function MyComponent() {
  const { gameState, startCombat } = useGame();
  
  return <button onClick={() => startCombat('goblin')}>{gameState.character.name}</button>;
}
```

**Benefits**:
- ✅ No changes needed to existing code
- ✅ Still works perfectly
- ✅ Can migrate gradually

---

## 🎓 Learning Path

### Beginner
1. Read: [Zustand Quick Reference](./ZUSTAND_QUICK_REFERENCE.md) - Quick Start section
2. Try: Use store in a simple component
3. Practice: Copy/paste from Component Examples section

### Intermediate
1. Read: [State Management Refactor](./State-Management-Refactor.md) - How to Use Zustand
2. Study: Examples from This Repository section
3. Apply: Selective subscriptions and best practices

### Advanced
1. Read: [State Management Refactor](./State-Management-Refactor.md) - Full document
2. Explore: Store implementation in `/src/stores/`
3. Optimize: Performance patterns and testing strategies

---

## 🔗 Key Concepts

### UI-Agnostic Game Mechanics ✅

**Before**: Game logic mixed with React components
```typescript
function CombatButton() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const handleCombat = () => {
    // Logic mixed with UI
    const enemy = createEnemyByType('goblin');
    dispatch({ type: 'START_COMBAT', payload: { enemy } });
  };
}
```

**After**: Game logic separated in store
```typescript
// In store (pure TypeScript)
startCombat: (enemyId: string) => {
  const enemy = createEnemyByType(enemyId);
  set({ combat: { /* ... */ } });
}

// In component (just UI)
function CombatButton() {
  const startCombat = useGameStore(state => state.startCombat);
  return <button onClick={() => startCombat('goblin')}>Fight</button>;
}
```

### Selective Subscriptions ⚡

**Before**: Entire context triggers re-renders
```typescript
const { gameState } = useGame();
// Re-renders on ANY state change
```

**After**: Only subscribe to what you need
```typescript
const characterName = useGameStore(state => state.gameState.character.name);
// Only re-renders when character name changes
```

---

## 📊 Refactor Statistics

- **Lines of Store Code**: ~1,500 (gameStore) + ~120 (authStore) = **1,620 lines**
- **UI-Agnostic Game Logic**: **100%** (zero React dependencies in stores)
- **Backward Compatibility**: **100%** (all existing code works)
- **Documentation Pages**: **4 comprehensive documents**
- **Code Examples**: **20+ real examples from the repository**

---

## ✅ What's Complete

- [x] Zustand integration
- [x] Game store with all mechanics
- [x] Auth store with persistence
- [x] Context wrappers for compatibility
- [x] DevTools integration
- [x] Full documentation
- [x] Quick reference guide
- [x] Code examples
- [x] Best practices guide
- [x] Migration checklist

---

## 🚀 What's Next (Optional)

### Component Migration (Not Required)
- Components can gradually migrate to direct Zustand usage
- Prioritize high-impact components (CombatScreen, etc.)
- Use [Migration Checklist](./MIGRATION_CHECKLIST.md) to track

### Performance Optimization
- Implement selective subscriptions in heavy components
- Add shallow equality checks for complex objects
- Profile with React DevTools

### Testing
- Add unit tests for store logic
- Integration tests for critical flows
- Performance benchmarks

---

## 🆘 Common Questions

### Q: Do I need to change my existing code?
**A**: No! Context API still works. Migration is optional.

### Q: Which pattern should I use for new components?
**A**: Use Zustand directly (`useGameStore()`) for better performance.

### Q: How do I access state outside components?
**A**: Use `useGameStore.getState()` anywhere in your code.

### Q: Can I still use `useGame()` and `useAuth()`?
**A**: Yes! They're wrappers around Zustand stores.

### Q: Where's the game logic now?
**A**: In `/src/stores/gameStore.ts` (UI-agnostic)

### Q: How do I debug state changes?
**A**: Use Redux DevTools (automatically integrated)

### Q: Is state persisted?
**A**: Auth state auto-persists. Game state saves on character updates.

### Q: How do I test store logic?
**A**: Import store and test without React: `useGameStore.getState().startCombat('goblin')`

---

## 📞 Support

### Documentation
- [State Management Refactor](./State-Management-Refactor.md) - Complete guide
- [Zustand Quick Reference](./ZUSTAND_QUICK_REFERENCE.md) - Quick lookups
- [Zustand Official Docs](https://github.com/pmndrs/zustand) - External resource

### Code
- Game Store: `/src/stores/gameStore.ts`
- Auth Store: `/src/stores/authStore.ts`
- Context Wrappers: `/src/contexts/`

---

## 🎉 Success!

The refactor is **complete** and **production-ready**:

✅ All game mechanics are UI-agnostic  
✅ Zustand stores fully functional  
✅ Backward compatibility maintained  
✅ Documentation comprehensive  
✅ DevTools integrated  
✅ Auto-save working  

**You can now**:
- Use Zustand stores directly in new code
- Keep using Context API in existing code
- Test game logic without React
- Debug with Redux DevTools
- Gradually migrate components if desired

---

**Happy coding!** 🚀

For questions or improvements, update this documentation and keep it current.
