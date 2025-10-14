# Major UI Overhaul Documentation

**Date:** September 30, 2025  
**Version:** 2.0  
**Author:** UI Redesign Team

## Overview

This document details a comprehensive UI overhaul for the Axiomancer game, transforming the interface from a traditional RPG layout to a modern, mobile-friendly design inspired by contemporary role-playing games.

---

## 1. Navigation System

### Previous Design
- Top navigation bar with tabs (World Map, Character, Philosophy & Skills, Inventory)
- Top status bar showing character portrait, name, level, health, mana, and experience

### New Design
- **Bottom Icon Navigation Bar**: Four primary navigation icons positioned at the bottom of the screen
  - 🗺️ **Map**: Access world map and local area exploration
  - 👤 **Character**: View character stats and portrait
  - 📚 **Skills**: Browse and manage skills organized by aspect
  - 🎒 **Inventory**: Manage equipment and items

### Benefits
- More screen space for content
- Mobile-friendly design
- Cleaner, less cluttered interface
- Easier one-handed navigation on touch devices

### Files Modified
- `/workspace/axiomancer-frontend/src/components/game/MainGameInterface.tsx`

---

## 2. Map Screen Redesign

### Previous Design
- Split view: Global map on left, local map on right
- Area cards displayed in a grid
- Small local map container with node system

### New Design
- **Full-screen local map** with background image
  - Map background images provide visual context for each area
  - Node system overlaid on the background
  - Map title displayed at top center showing current area name
  
- **Bottom map selector bar**
  - Horizontal row of rounded rectangles
  - Each rectangle represents a map area
  - Unlocked maps show their name
  - Locked maps display "???"
  - Selected map is highlighted

### Key Features
- Background images for immersion (attribute: `backgroundImage` added to map data)
- Visual distinction between locked and unlocked content
- Intuitive map switching
- Nodes rendered on top of themed backgrounds

### Files Modified
- `/workspace/axiomancer-frontend/src/components/game/GlobalLocalMapScreen.tsx`
- `/workspace/axiomancer-frontend/src/types/game.ts` (added `backgroundImage` to `GlobalArea` interface)

---

## 3. Character Screen Redesign

### Previous Design
- Two-column layout with stats on left and philosophical stance on right
- All stats displayed in a flat list

### New Design
- **Two-panel layout:**
  - **Left Panel (Portrait)**: 
    - Large character portrait (300px wide)
    - Character name
    - Level and class
  
  - **Right Panel (Stats)**:
    - Stats organized by category with clear visual hierarchy
    - Categories include:
      - 🏥 **Core Stats** (Health, Mana, Available Stat Points)
      - ⭐ **Base Stats** (Heart, Body, Mind)
      - 💪 **Body-Derived Stats** (Physical Attack, Physical Defense, Constitution Save)
      - 🧠 **Mind-Derived Stats** (Mind Attack, Mind Defense, Reflex Save, Perception)
      - ❤️ **Heart-Derived Stats** (Ailment Attack, Ailment Defense, Will Save)
      - 🎯 **Shared Stats** (Accuracy, Evasion, Luck)
      - 🧘 **Philosophical Stance** (Ethics, Metaphysics, Epistemology)

### Benefits
- Clear visual hierarchy with emoji indicators
- Character portrait prominently displayed
- Stats grouped logically by their relationship
- Easier to find specific stats
- Scrollable right panel for all stat information

### Files Modified
- `/workspace/axiomancer-frontend/src/components/game/CharacterScreen.tsx`

---

## 4. Skills Screen Redesign

### Previous Design
- Single "all" or "fallacy" filter
- All skills displayed in one view
- Learned/unlearned status indicated by color

### New Design
- **Three-tab system** based on philosophical aspect:
  - 💪 **BODY**: Body-aspect skills
  - 🧠 **MIND**: Mind-aspect skills
  - ❤️ **HEART**: Heart-aspect skills

- **Skill organization:**
  - Unlocked skills appear **first** (sorted to top)
  - Locked skills appear **below** unlocked ones
  - Locked skills display large "???" overlay
  - Each tab shows unlock progress (e.g., "BODY (2/15)")

### Visual Indicators
- Unlocked skills: Full visibility with green "Unlocked" badge
- Locked skills: Darkened with "???" overlay and gray "Locked" badge

### Benefits
- Skills organized by their core mechanical aspect
- Easier to find skills relevant to character build
- Clear progression tracking per aspect
- Visual mystery for undiscovered skills

### Files Modified
- `/workspace/axiomancer-frontend/src/components/game/SkillScreen.tsx`

---

## 5. Inventory Screen Redesign

### Previous Design
- Equipment compendium showing all available equipment
- Single grid view with filter tabs

### New Design
- **Two-panel layout:**
  
  **Left Panel (Equipment Slots):**
  - 11 equipment slots arranged anatomically:
    - **Top Center**: Helmet
    - **Second Row Center**: Amulet
    - **Third Row**: Left Hand (left), Body Armor (center), Right Hand (right)
    - **Fourth Row**: Gloves (left), Cloak (center), Bracelet (right)
    - **Bottom Row**: Left Ring (left), Boots (center), Right Ring (right)
  - Each slot shows:
    - Slot icon (emoji representation)
    - Slot label
    - Equipped item (if any)
  - Empty slots clearly indicated
  
  **Right Panel (Inventory Categories):**
  - Five category tabs:
    - ⚔️ **Equipment**: Weapons, armor, accessories
    - 🧪 **Consumables**: Potions, scrolls, temporary items
    - 🪵 **Materials**: Crafting components
    - 🔑 **Key Items**: Special permanent items
    - 📜 **Quest Items**: Story-related items
  - Grid of item cards showing:
    - Item icon
    - Item name
    - Quantity (for stackable items)

### Test Data Included
For demonstration purposes, the UI includes one item of each category:
- Equipment: Iron Sword 🗡️
- Consumables: Health Potion x3 🧪
- Materials: Wood x10 🪵
- Key Items: Ancient Key 🔑
- Quest Items: Letter 📜

**Note:** Test items are added via the UI component and can be easily removed by clearing the default values in the `inventoryCategories` initialization.

### Benefits
- Visual equipment representation matches character anatomy
- Clear separation between equipped and inventory items
- Organized inventory by item purpose
- Easy to navigate item types

### Files Modified
- `/workspace/axiomancer-frontend/src/components/game/InventoryScreen.tsx`
- `/workspace/axiomancer-frontend/src/types/game.ts`

---

## 6. Type System Updates

### New Types Added

```typescript
export type EquipmentSlot = 'helmet' | 'bodyArmor' | 'gloves' | 'boots' | 
  'leftHand' | 'rightHand' | 'leftRing' | 'rightRing' | 'bracelet' | 'amulet' | 'cloak';

export interface EquippedItems {
  helmet?: Equipment;
  bodyArmor?: Equipment;
  gloves?: Equipment;
  boots?: Equipment;
  leftHand?: Equipment;
  rightHand?: Equipment;
  leftRing?: Equipment;
  rightRing?: Equipment;
  bracelet?: Equipment;
  amulet?: Equipment;
  cloak?: Equipment;
}

export interface InventoryCategories {
  equipment: Item[];
  consumables: Item[];
  materials: Item[];
  keyItems: Item[];
  questItems: Item[];
}
```

### Character Interface Updates

Added optional fields to the `Character` interface:
- `equippedItems?: EquippedItems` - Tracks items in each equipment slot
- `inventoryCategories?: InventoryCategories` - Organizes inventory by category

### Map Data Updates

Added optional field to map/area interfaces:
- `backgroundImage?: string` - URL to background image for map visualization

### Files Modified
- `/workspace/axiomancer-frontend/src/types/game.ts`

---

## 7. Design Philosophy

### Visual Consistency
- Rounded rectangles for all containers
- Consistent border styling
- Unified color scheme using theme colors
- Emoji icons for quick visual recognition

### User Experience
- Bottom navigation for better ergonomics
- Progressive disclosure (locked content shown as "???")
- Clear visual hierarchy with categorization
- Responsive hover states and transitions

### Accessibility
- High contrast text
- Clear labels for all interactive elements
- Consistent interaction patterns
- Logical tab order

---

## 8. Migration Notes

### Backward Compatibility
- All new character fields are optional
- Existing character data will continue to work
- UI gracefully handles missing data with defaults

### Data Migration
To fully utilize the new features, character data should eventually include:
1. `equippedItems` object with equipment assignments
2. `inventoryCategories` object with categorized items

### Removing Test Data
To remove test items from the inventory screen:
1. Open `/workspace/axiomancer-frontend/src/components/game/InventoryScreen.tsx`
2. Locate the `inventoryCategories` constant initialization (around line 188)
3. Replace the object with:
```typescript
const inventoryCategories = character.inventoryCategories || {
  equipment: [],
  consumables: [],
  materials: [],
  keyItems: [],
  questItems: []
};
```

---

## 9. Future Enhancements

### Potential Improvements
1. **Drag-and-drop** equipment management
2. **Item tooltips** with detailed stats
3. **Equipment comparison** view
4. **Inventory sorting** and filtering
5. **Quick equip** from inventory panel
6. **Map zoom** and pan controls
7. **Skill tree** visualization
8. **Character build** presets

### Performance Considerations
- Background images should be optimized (WebP format recommended)
- Consider lazy loading for inventory items
- Implement virtualization for large skill lists

---

## 10. Testing Checklist

- [x] Bottom navigation switches between all four screens
- [x] Map screen displays background images correctly
- [x] Map selector highlights active map
- [x] Character screen shows portrait and all stat categories
- [x] Skills screen filters by Body/Mind/Heart
- [x] Locked skills display "???" overlay
- [x] Equipment slots render in correct anatomical positions
- [x] Inventory categories switch correctly
- [x] Test items display in appropriate categories
- [x] All hover states and transitions work smoothly

---

## 11. Summary of Changes

### Components Modified
1. `MainGameInterface.tsx` - Bottom navigation implementation
2. `GlobalLocalMapScreen.tsx` - Map screen redesign
3. `CharacterScreen.tsx` - Character screen with portrait and categorized stats
4. `SkillScreen.tsx` - Aspect-based skill tabs
5. `InventoryScreen.tsx` - Complete rewrite with equipment slots and categories

### Types Modified
1. `game.ts` - Added equipment slots, equipped items, and inventory categories

### Design System
- Consistent use of theme colors and spacing
- Emoji-based visual indicators
- Rounded rectangle aesthetic throughout
- Bottom-aligned navigation pattern

---

## Conclusion

This UI overhaul modernizes the Axiomancer interface with a focus on:
- **Mobile-friendly design** with bottom navigation
- **Visual clarity** through categorization and organization
- **Progressive disclosure** for locked content
- **Anatomical equipment** representation
- **Thematic immersion** via map backgrounds

The new design maintains all existing functionality while providing a more intuitive and visually appealing user experience.