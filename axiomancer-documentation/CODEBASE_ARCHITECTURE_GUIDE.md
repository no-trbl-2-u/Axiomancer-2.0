# Axiomancer Codebase Architecture Guide

## Overview

Axiomancer is a philosophical RPG where players engage in intellectual combat using logical fallacies and philosophical arguments. This guide explains how the codebase is structured and how different components interact to create this unique gaming experience.

## Architecture Overview

The application follows a **full-stack TypeScript architecture** with clear separation between frontend game logic, backend services, and shared type definitions. The key architectural principle is **UI-agnostic game mechanics** - core game logic is separated from React components to enable testing and potential future platform expansion.

## Core System Architecture

### 1. Context-Based State Management

The application uses React Context for state management with two primary contexts:

#### AuthContext (`/src/contexts/AuthContext.tsx`)

Handles user authentication and session management:

```typescript
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Auto-restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('axiomancer_token');
    const userStr = localStorage.getItem('axiomancer_user');
    if (token && userStr) {
      const user = JSON.parse(userStr) as User;
      dispatch({ type: 'SET_USER', payload: { user, token } });
    }
  }, []);
}
```

**Key Interaction Pattern**: The AuthContext automatically restores user sessions on app load and provides authentication state to all child components through the provider pattern.

#### GameContext (`/src/contexts/GameContext.tsx`)

Manages all game state using a reducer pattern:

```typescript
interface GameContextType {
  gameState: GameState;
  currentScreen: GameScreen;
  startNewGame: (characterName: string) => void;
  createCharacter: (characterData: CreateCharacterData) => void;
  loadSavedCharacter: () => Promise<boolean>;
  moveToLocation: (locationId: string) => void;
  moveToNode: (nodeId: string) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  startCombat: (enemyId: string) => void;
  endCombat: () => void;
  // ... more methods
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CREATE_CHARACTER':
      const finalBaseStats = action.payload.baseStats || createInitialBaseStats();
      const finalDerivedStats = calculateDerivedStats(finalBaseStats);
      return {
        ...initialGameState,
        character: {
          ...initialGameState.character,
          id: Date.now().toString(),
          name: action.payload.name,
          portrait: action.payload.portrait,
          baseStats: finalBaseStats,
          derivedStats: finalDerivedStats,
          // ... more character setup
        },
      };
  }
}
```

**Key Interaction Pattern**: The GameContext uses a reducer to manage complex game state transitions and automatically saves character data whenever the game state changes.

### 2. Stat Calculation System

The game uses a **Heart/Body/Mind** base stat system that derives all combat and interaction stats:

#### Base Stats to Derived Stats (`/src/utils/statCalculations.ts`)

```typescript
export function calculateDerivedStats(baseStats: BaseStats): DerivedStats {
  const { heart, body, mind } = baseStats;

  return {
    // Body-derived stats
    physicalAttack: body * 3,
    physicalDefense: body * 2,
    constitutionSave: body * 2,

    // Mind-derived stats
    mindAttack: mind * 3,
    mindDefense: mind * 2,
    reflexSave: mind * 2,
    perception: mind * 2,

    // Heart-derived stats
    ailmentAttack: heart * 3,
    ailmentDefense: heart * 2,
    willSave: heart * 2,

    // Shared stats (evasion combines Mind and Heart)
    evasion: (mind * 1) + (heart * 3),
    accuracy: (heart + body + mind) * 5,
    luck: (heart * 5) + (heart + body + mind),
  };
}
```

**Key Interaction Pattern**: Whenever base stats change, derived stats are automatically recalculated. This creates a cascading effect where character progression affects all combat capabilities.

#### Health and Mana Calculations

```typescript
export function calculateMaxHP(baseStats: BaseStats, baseHP: number = 50): number {
  return baseHP + (baseStats.body * 20) + (baseStats.heart * 8);
}

export function calculateMaxMP(baseStats: BaseStats, baseMP: number = 30): number {
  return baseMP + (baseStats.mind * 15) + (baseStats.heart * 8);
}
```

**Key Interaction Pattern**: Body primarily determines health, Mind primarily determines mana, and Heart contributes to both, reflecting the philosophical nature of the character system.

### 3. Combat System Architecture

The combat system is built around **philosophical aspects** (Body/Mind/Heart) in a rock-paper-scissors relationship:

#### Aspect Advantage System (`/src/utils/combatMechanics.ts`)

```typescript
export function determineAspectWinner(playerAspect: PhilosophicalAspect, enemyAspect: PhilosophicalAspect): 'player' | 'enemy' | 'tie' {
  if (playerAspect === enemyAspect) {
    return 'tie';
  }

  const winConditions: Record<PhilosophicalAspect, PhilosophicalAspect> = {
    body: 'mind',    // Body overcomes Mind
    mind: 'heart',   // Mind overcomes Heart
    heart: 'body',   // Heart overcomes Body
  };

  return winConditions[playerAspect] === enemyAspect ? 'player' : 'enemy';
}
```

**Key Interaction Pattern**: Combat advantage is determined by philosophical aspect matchups, which then influences damage calculations and special effects.

#### D20 Combat Resolution

```typescript
export function calculateHitChance(
  attackerStats: DerivedStats,
  defenderStats: DerivedStats
): boolean {
  const d20Roll = rollD20();
  const accuracyBonus = Math.floor(attackerStats.accuracy / 10);
  const evasionPenalty = Math.floor(defenderStats.evasion / 10);

  const hitRoll = d20Roll + accuracyBonus - evasionPenalty;

  return hitRoll >= 10;
}
```

**Key Interaction Pattern**: Combat uses D&D-style mechanics where derived stats modify dice rolls, creating statistical combat resolution that scales with character progression.

#### UI-Agnostic Combat State Manager

```typescript
export class CombatStateManager {
  private player: Character;
  private enemy: Enemy;
  private playerBuffs: CombatantBuffs;
  private enemyBuffs: CombatantBuffs;

  public async executeTurn(playerChoice: CombatChoice): Promise<{
    roundResult: CombatRoundResult;
    combatEnded: boolean;
    winner?: 'player' | 'enemy' | 'agree_to_disagree';
    turnEffects: string[];
  }> {
    // Process start-of-turn effects
    await this.processStartOfTurn();
    
    // Generate enemy choice
    const enemyChoice = generateEnemyChoice(this.enemy, this.playerChoiceHistory);
    
    // Execute combat actions
    const playerResult = executeCombatAction(/*...*/);
    const enemyResult = executeCombatAction(/*...*/);
    
    // Apply damage and effects
    this.enemy.health = Math.max(0, this.enemy.health - playerResult.damage);
    this.player.health = Math.max(0, this.player.health - enemyResult.damage);
    
    return { roundResult, combatEnded, winner, turnEffects };
  }
}
```

**Key Interaction Pattern**: The CombatStateManager encapsulates all combat logic independently of React components, making it testable and reusable.

### 4. Buff/Debuff System

The game features a comprehensive status effect system:

#### Buff/Debuff Creation (`/src/utils/buffDebuffEngine.ts`)

```typescript
export function createBuffDebuff(
  id: string,
  name: string,
  description: string,
  type: 'buff' | 'debuff',
  effect: BuffDebuffEffect,
  duration: number,
  icon: string,
  stackable: boolean = false
): BuffDebuff {
  return {
    id, name, description, type, effect, duration,
    remainingTurns: duration,
    stackable, currentStacks: 1, icon,
  };
}

// Example: Mind Attack creates follow-up damage
export const createMindAttackBuff = (damage: number): BuffDebuff =>
  createBuffDebuff(
    'mind_attack_followup',
    'Mental Advantage',
    `Deals ${damage} fixed damage next turn`,
    'buff',
    { specialEffects: { fixedDamageNextTurn: damage } },
    1,
    '🧠'
  );
```

**Key Interaction Pattern**: Status effects are created as data structures that define their behavior, then processed by the buff engine during combat turns.

#### Buff Processing System

```typescript
export function processBuffsDebuffs(
  combatantBuffs: CombatantBuffs,
  isStartOfTurn: boolean = true
): {
  updatedBuffs: CombatantBuffs;
  turnEffects: string[];
  damageDealt?: number;
} {
  const turnEffects: string[] = [];
  let damageDealt = 0;

  const activeBuffs = combatantBuffs.buffs
    .map(buff => {
      if (isStartOfTurn && buff.effect.specialEffects?.fixedDamageNextTurn) {
        const damage = buff.effect.specialEffects.fixedDamageNextTurn;
        damageDealt += damage;
        turnEffects.push(`${buff.name} deals ${damage} fixed damage!`);
      }
      
      const updated = { ...buff, remainingTurns: buff.remainingTurns - 1 };
      return updated.remainingTurns > 0 ? updated : null;
    })
    .filter(buff => buff !== null) as BuffDebuff[];

  return { updatedBuffs: { buffs: activeBuffs, debuffs: /*...*/ }, turnEffects, damageDealt };
}
```

**Key Interaction Pattern**: The buff engine processes all active effects each turn, applying their effects and managing their duration automatically.

### 5. Fallacy Spellbook System

The game features 100+ logical fallacies as combat skills:

#### Fallacy Skill Definition (`/src/utils/fallacySpellbook.ts`)

```typescript
export const fallacySpellbook: Record<string, Skill> = {
  ad_hominem: {
    id: 'ad_hominem',
    name: 'Ad Hominem Attack',
    description: 'Tear down the person instead of their argument, exposing their deepest flaws and making them question their very worth.',
    level: 1,
    manaCost: 20,
    damage: 35,
    icon: '👤',
    type: 'fallacy',
    philosophicalAspect: 'heart',
    fallacyType: 'informal',
    combatEffects: {
      baseEffect: "Inflicts severe Self Loathing debuff on opponent (15 damage)",
      advantageEffect: "Inflicts enhanced Self Loathing debuff on opponent (25 damage, 5 turns)",
      baseDefendedEffect: "Attacker suffers Self Loathing debuff (10 damage)",
      defendedAgainstAdvantage: "Grants Strength From Pain buff to defender (20 bonus)",
      defendedWithAdvantage: "Grants Insight buff to defender"
    }
  }
};
```

**Key Interaction Pattern**: Each fallacy defines multiple combat effects based on combat context (advantage, defended against, etc.), creating complex tactical interactions.

#### Fallacy Execution System

```typescript
export function executeFallacy(
  attacker: Character | Enemy,
  defender: Character | Enemy,
  fallacyId: string,
  targetBuffs: CombatantBuffs,
  attackerBuffs: CombatantBuffs,
  hasAdvantage: boolean = false
): CombatActionResult {
  const fallacy = getFallacyById(fallacyId);
  
  // Check mana cost
  if (attacker.mana < fallacy.manaCost) {
    return { hit: false, effects: [`Not enough mana!`], /*...*/ };
  }

  // Calculate damage with stat bonuses
  let baseDamage = fallacy.damage || 0;
  if (fallacy.philosophicalAspect === 'mind') {
    baseDamage += Math.floor(attacker.derivedStats.mindAttack * 0.5);
  }

  // Process fallacy-specific effects
  if (fallacy.combatEffects) {
    const statusEffectResult = processFallacyCombatEffects(
      fallacy.combatEffects,
      hasAdvantage,
      false, // not defended
      false  // not counter attack
    );
    
    result.buffsApplied.push(...statusEffectResult.buffs);
    result.debuffsApplied.push(...statusEffectResult.debuffs);
  }

  return result;
}
```

**Key Interaction Pattern**: Fallacies integrate with the stat system, buff system, and combat advantage system to create emergent tactical gameplay.

### 6. Node-Based Exploration System

The game world is structured as interconnected locations with node-based exploration:

#### Location and Node Structure (`/src/contexts/GameContext.tsx`)

```typescript
const initialGameState: GameState = {
  locations: {
    fishing_town: {
      id: 'fishing_town',
      name: 'Small Fishing Town',
      isNodeMap: true,
      nodes: [
        {
          id: 'home',
          name: 'Your Home',
          type: 'start',
          position: { x: 50, y: 80 },
          connections: ['guardian', 'town_square'],
          unlocked: true,
          visited: true,
          icon: '🏠'
        },
        {
          id: 'guardian',
          name: 'Talk to Guardian',
          type: 'person',
          position: { x: 30, y: 70 },
          connections: ['town_square', 'meditation_garden'],
          unlocked: true,
          visited: false,
          event: {
            id: 'guardian_talk',
            type: 'dialogue',
            npcId: 'guardian'
          },
          icon: '👨‍🏫'
        }
      ]
    }
  }
};
```

**Key Interaction Pattern**: Locations contain nodes that represent specific places or interactions. Nodes can be unlocked based on story progression or character actions.

#### Node Unlocking System

```typescript
const unlockGuardianProgression = () => {
  // Add skill to character
  const basicReasoningSkill = {
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

  dispatch({ type: 'UPDATE_CHARACTER', payload: { skills: [basicReasoningSkill] }});
  dispatch({ type: 'UPDATE_STORY', payload: { talkedToGuardian: true } });

  // Unlock connected nodes
  const guardianNode = gameState.locations[gameState.currentLocation]?.nodes?.find(n => n.id === 'guardian');
  if (guardianNode?.connections) {
    guardianNode.connections.forEach(connectedNodeId => {
      dispatch({ type: 'UNLOCK_NODE', payload: {
        locationId: gameState.currentLocation,
        nodeId: connectedNodeId
      }});
    });
  }
};
```

**Key Interaction Pattern**: Story events can unlock new areas, grant skills, and modify the game world structure dynamically.

### 7. Character Persistence System

Character data is automatically saved and can be migrated between stat system versions:

#### Auto-Save System (`/src/utils/characterSave.ts`)

```typescript
// Auto-save when character is created or updated
React.useEffect(() => {
  if (gameState.character && gameState.character.name && gameState.character.id !== 'placeholder') {
    const saveTimer = setTimeout(async () => {
      try {
        await saveCharacter(gameState);
        console.log('📝 Character auto-saved after game state change');
      } catch (error) {
        console.error('Failed to auto-save character:', error);
      }
    }, 500); // Wait for state to stabilize

    return () => clearTimeout(saveTimer);
  }
}, [gameState.character, gameState.currentLocation]);
```

**Key Interaction Pattern**: The game automatically saves character progress whenever significant state changes occur, with debouncing to prevent excessive save operations.

#### Data Migration System

```typescript
function migrateCharacterData(character: any): Character {
  // If character already has new stat structure, return as is
  if (character.baseStats && character.derivedStats) {
    return character as Character;
  }

  // Migrate old stats to new Heart/Body/Mind system
  const oldStats = character.stats || {};
  const baseStats = {
    heart: oldStats.charisma || oldStats.heart || 1,
    body: Math.max(oldStats.strength || 0, oldStats.constitution || 0, oldStats.body || 1),
    mind: Math.max(oldStats.intelligence || 0, oldStats.wisdom || 0, oldStats.mind || 1)
  };

  const derivedStats = calculateDerivedStats(baseStats);
  const maxHP = calculateMaxHP(baseStats);
  const maxMP = calculateMaxMP(baseStats);

  return { ...character, baseStats, derivedStats, maxHealth: maxHP, maxMana: maxMP };
}
```

**Key Interaction Pattern**: The save system can migrate character data between different versions of the stat system, ensuring backward compatibility.

### 8. Frontend-Backend Communication

The application uses a service layer to communicate with the backend:

#### Authentication Service (`/src/services/auth.service.ts`)

```typescript
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: { 'Content-Type': 'application/json' },
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  async getProfile(): Promise<{ user: any }> {
    const token = localStorage.getItem('axiomancer_token');
    const response = await authApi.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
```

**Key Interaction Pattern**: Services encapsulate HTTP communication and handle authentication tokens automatically.

#### Backend Route Structure (`/src/index.ts`)

```typescript
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/character', characterRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

async function startServer(): Promise<void> {
  await DatabaseService.initialize();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

**Key Interaction Pattern**: The backend provides RESTful APIs with clear separation between authentication, character management, and health monitoring.

### 9. Component Architecture

The frontend uses a hierarchical component structure:

#### Protected Route Pattern (`/src/App.tsx`)

```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <GameProvider>
      <Layout>{children}</Layout>
    </GameProvider>
  );
};
```

**Key Interaction Pattern**: Protected routes ensure authentication before providing access to game content and wrap authenticated areas with the GameProvider.

#### Main Game Interface (`/src/components/game/MainGameInterface.tsx`)

```typescript
export const MainGameInterface: React.FC = () => {
  const { gameState, currentScreen, changeScreen } = useGame();
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'character': return <CharacterScreen />;
      case 'inventory': return <InventoryScreen />;
      case 'skills': return <SkillScreen />;
      case 'map': return <GlobalLocalMapScreen />;
      default: return <GlobalLocalMapScreen />;
    }
  };

  return (
    <GameContainer>
      <TopBar>
        <CharacterInfo>
          <img className="portrait" src={gameState.character.portrait?.imageUrl} />
          <div className="details">
            <div className="name">{gameState.character.name}</div>
            <div className="level">Level {gameState.character.level}</div>
          </div>
        </CharacterInfo>
        <StatsBar>
          <div className="stat">
            <div className="label">Health</div>
            <div className="value">{gameState.character.health}/{gameState.character.maxHealth}</div>
            <div className="bar health">
              <div className="fill" style={{ width: `${(gameState.character.health / gameState.character.maxHealth) * 100}%` }} />
            </div>
          </div>
        </StatsBar>
      </TopBar>
      <Navigation>
        {/* Tab buttons */}
      </Navigation>
      <ContentArea>
        {renderActiveScreen()}
      </ContentArea>
    </GameContainer>
  );
};
```

**Key Interaction Pattern**: The main interface provides a persistent UI shell with character information and navigation, while dynamically rendering different game screens based on user selection.

## Key Architectural Patterns

### 1. **Separation of Concerns**
- Game logic is separated from UI components
- Combat mechanics are UI-agnostic and testable
- State management is centralized in contexts

### 2. **Data-Driven Design**
- Skills, enemies, and events are defined as data structures
- Game content can be modified without changing code
- Status effects are configurable through data

### 3. **Cascading Calculations**
- Base stats automatically derive all other stats
- Equipment bonuses are applied dynamically
- Character progression affects all game systems

### 4. **Event-Driven Architecture**
- Story progression triggers node unlocking
- Combat actions generate status effects
- Character actions update multiple game systems

### 5. **Immutable State Updates**
- All state changes go through reducers
- Components receive new state objects
- Prevents accidental state mutations

### 6. **Service Layer Pattern**
- Backend communication is encapsulated in services
- Authentication is handled transparently
- Error handling is centralized

## Development Workflow

### Adding New Combat Skills

1. Define the skill in `fallacySpellbook.ts`:
```typescript
new_fallacy: {
  id: 'new_fallacy',
  name: 'New Fallacy',
  description: 'Description of the fallacy',
  philosophicalAspect: 'mind',
  combatEffects: {
    baseEffect: "What happens normally",
    advantageEffect: "What happens with advantage"
  }
}
```

2. Create any new status effects in `statusEffects.ts`
3. The combat system will automatically integrate the new skill

### Adding New Locations

1. Define the location structure in `GameContext.tsx`
2. Create nodes with connections and events
3. Add unlock conditions to story progression functions
4. The exploration system will automatically handle navigation

### Modifying Character Progression

1. Update stat calculations in `statCalculations.ts`
2. Modify character creation in `GameContext.tsx`
3. Update migration logic in `characterSave.ts` if needed
4. All derived stats will automatically recalculate

## Testing Strategy

### Unit Testing Combat Mechanics
```typescript
// Test combat advantage system
test('Body beats Mind in philosophical combat', () => {
  const result = determineAspectWinner('body', 'mind');
  expect(result).toBe('player');
});

// Test stat calculations
test('Derived stats calculate correctly', () => {
  const baseStats = { heart: 2, body: 3, mind: 4 };
  const derived = calculateDerivedStats(baseStats);
  expect(derived.physicalAttack).toBe(9); // body * 3
  expect(derived.mindAttack).toBe(12);    // mind * 3
});
```

### Integration Testing Game Flow
```typescript
// Test character creation flow
test('Character creation updates game state', () => {
  const gameContext = renderGameContext();
  gameContext.createCharacter({
    name: 'Test Character',
    gender: 'male',
    portrait: testPortrait
  });
  expect(gameContext.gameState.character.name).toBe('Test Character');
});
```

## Deployment Architecture

The application uses Docker containers orchestrated with Docker Compose:

- **Frontend**: React app served by Nginx
- **Backend**: Node.js/Express API server
- **Database**: SQLite for local, PostgreSQL for staging/production
- **Environment-specific configurations** for local, staging, and production

## Conclusion

The Axiomancer codebase demonstrates a sophisticated game architecture that separates concerns effectively while maintaining tight integration between systems. The philosophical combat mechanics, node-based exploration, and character progression systems all work together through well-defined interfaces and data structures.

Key strengths of this architecture:
- **Testability**: Core game logic is independent of UI
- **Maintainability**: Clear separation of concerns
- **Extensibility**: Data-driven design allows easy content addition
- **Scalability**: Service layer enables backend expansion
- **Robustness**: Migration system handles data format changes

This architecture supports the complex philosophical gameplay while remaining approachable for new developers joining the project.