# Philosophy-Based RPG Implementation

## 🎮 Game Overview

I have successfully implemented the beginning of a philosophy-based RPG using the documentation and rules from the `axiomancer-documentation` folder. The game features a unique rock-paper-scissors combat system based on philosophical aspects.

## ⚔️ Combat System: Body > Mind > Heart > Body

### Core Mechanics
The combat system implements the specified philosophy-based rock-paper-scissors logic:

- **Body** overcomes **Mind** (physical strength beats pure logic)
- **Mind** overcomes **Heart** (rational thought beats emotion)
- **Heart** overcomes **Body** (compassion and intuition beat brute force)

### Two-Phase Combat
1. **Phase 1**: Player chooses their philosophical aspect (Body, Mind, or Heart)
2. **Phase 2**: Player chooses their action (Attack, Defend, or Special)
3. **Resolution**: The system resolves both choices and determines advantages

### Advantage System
- Players gain advantages when their philosophical aspect defeats the opponent's
- Advantages increase damage and effectiveness
- The system tracks accumulated advantages throughout the fight

## 🎨 UI Design

### Aspect Selection
- **Body** (💪): Red gradient - "Physical strength and material force"
- **Mind** (🧠): Blue gradient - "Rational thought and logical analysis"
- **Heart** (❤️): Orange gradient - "Emotion, intuition, and compassion"

### Action Selection
- **Attack** (⚔️): Direct aggressive action
- **Defend** (🛡️): Protective stance
- **Special** (✨): Unique philosophical technique

### Combat Interface
- Real-time health and mana bars for both player and enemy
- Round tracking with advantage counters
- Detailed battle results showing aspect matchups
- Dynamic effects list explaining each round's outcome

## 🤖 AI Strategy

The enemy AI implements strategic counter-play:
- Tracks the player's most-used philosophical aspects
- Attempts to counter with the appropriate opposing aspect
- Balances between different action types based on enemy stats
- Provides an engaging and challenging combat experience

## 📱 Responsive Design

The interface is fully responsive and works across different screen sizes:
- Desktop: Full grid layout with large buttons
- Tablet: Adapted spacing and font sizes
- Mobile: Stacked layout for easy touch interaction

## 🎯 Key Features Implemented

### Character Creation
- ✅ Philosophy-based character creation system
- ✅ Ethical stance selection (Virtue, Deontological, Consequentialist, Nihilistic)
- ✅ Metaphysical worldview selection (Materialist, Idealist, Dualist, Pragmatist)
- ✅ Epistemological approach selection (Empiricist, Rationalist, Skeptical, Mystical)

### Combat System
- ✅ Two-phase combat: Aspect selection → Action selection
- ✅ Rock-paper-scissors logic: Body > Mind > Heart > Body
- ✅ Advantage tracking and damage calculation
- ✅ AI opponent with strategic behavior
- ✅ Real-time battle resolution and effects
- ✅ Visual feedback for all combat phases

### Game Structure
- ✅ Character progression system with stats
- ✅ Game world with multiple locations
- ✅ Story progression tracking (childhood, labyrinth, adulthood phases)
- ✅ Quest and dialogue system foundation
- ✅ Equipment and inventory management types

### Technical Implementation
- ✅ TypeScript with strict type safety
- ✅ React with Context API for state management
- ✅ Styled Components for theming
- ✅ Modular combat mechanics utilities
- ✅ Comprehensive type definitions

## 🧪 Testing Results

### Logic Testing
```
Body vs Mind: player ✅
Mind vs Heart: player ✅
Heart vs Body: player ✅
Mind vs Body: enemy ✅
Heart vs Mind: enemy ✅
Body vs Heart: enemy ✅
All tie conditions: tie ✅
```

### Integration Testing
- ✅ Development server runs without errors
- ✅ Combat screen renders properly
- ✅ UI components respond to user interactions
- ✅ State management functions correctly
- ✅ Combat mechanics calculate damage and advantages

## 🚀 Getting Started

1. **Start the development server:**
   ```bash
   cd axiomancer-frontend
   npm run dev
   ```

2. **Access the game:**
   Open http://localhost:3000 in your browser

3. **Test the combat system:**
   - Create a character with philosophical stances
   - Navigate to combat screen
   - Experience the Body > Mind > Heart > Body mechanics

## 🎲 Combat Example

**Round 1:**
- Player chooses: Mind + Attack
- Enemy chooses: Heart + Defend
- Result: Mind beats Heart → Player gains advantage
- Player deals increased damage due to philosophical superiority

**Round 2:**
- Player chooses: Body + Special
- Enemy chooses: Mind + Attack
- Result: Body beats Mind → Player gains another advantage
- Combined advantages lead to devastating attack

## 🏆 Philosophy Integration

The game successfully integrates philosophical concepts into gameplay:

- **Virtue Ethics**: Emphasis on character and moral excellence
- **Consequentialism**: Focus on outcomes and results
- **Deontological Ethics**: Duty-based moral reasoning
- **Nihilistic Ethics**: Questioning the meaning of moral frameworks

These philosophical stances affect dialogue options and character development throughout the game.

## 🔮 Future Enhancements

The foundation is now in place for expanding the philosophy RPG:

1. **Extended Story**: Implement the full childhood → labyrinth → adulthood progression
2. **Dialogue System**: Add philosophical debates with NPCs
3. **Skill Trees**: Philosophy-based abilities and upgrades
4. **Equipment System**: Philosophical artifacts and tools
5. **Multiplayer**: Philosophical debates between players
6. **Advanced AI**: More sophisticated philosophical reasoning

## 📚 Documentation Used

The implementation is based on:
- **Progression.md**: Childhood story arc and game phases
- **Game Concept and Philosophy Integration.pdf**: Core philosophical mechanics
- **Fallacy Spellbook Creation Plan.pdf**: Combat system design
- **Wireframe images**: UI layout and visual design inspiration

## ✨ Technical Excellence

- **Type Safety**: Comprehensive TypeScript definitions
- **Performance**: React.memo optimization for combat components
- **Accessibility**: Semantic HTML and clear visual feedback
- **Maintainability**: Modular architecture with separation of concerns
- **Testability**: Pure functions for combat logic testing

---

**The philosophy-based RPG is now ready for testing and further development!** 🎮✨