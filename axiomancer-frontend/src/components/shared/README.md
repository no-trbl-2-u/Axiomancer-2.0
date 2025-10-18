# Shared Component Library

A comprehensive collection of reusable components with extensive variants to cover all UI patterns in the Axiomancer frontend.

## 🎯 Design Philosophy

These components are designed to:
- **Maximize reusability** - Cover every component pattern in the codebase
- **Support variations** - Multiple variants to reduce code duplication
- **Maintain consistency** - Unified styling and behavior
- **Enable easy updates** - Change once, update everywhere

## 📚 Component Catalog

### 1. Modal Component

**File:** `Modal.tsx`

Universal modal component supporting all modal types in the application.

**Variants:**
- `default` - Standard modal
- `combat` - Full-screen combat modal
- `locked` - Warning/locked node modal
- `event` - Event selection modal
- `skill` - Skill selection modal

**Sizes:**
- `sm` - Small (400px max)
- `md` - Medium (600px max)
- `lg` - Large (800px max)
- `xl` - Extra large (95vw)
- `full` - Full screen (95vw x 95vh)

**Props:**
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'combat' | 'locked' | 'event' | 'skill';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeButtonVariant?: 'danger' | 'secondary' | 'primary';
  title?: string;
  headerVariant?: 'default' | 'centered' | 'minimal';
  overlayBlur?: boolean;
  animation?: 'fade' | 'scale' | 'slide';
  overlayClick?: boolean;
}
```

**Usage:**
```tsx
// Basic modal
<Modal isOpen={isOpen} onClose={handleClose} title="My Modal">
  <p>Modal content</p>
</Modal>

// Combat modal (full screen)
<Modal isOpen={isOpen} variant="combat" size="full">
  <CombatScreen />
</Modal>

// Locked node modal
<Modal 
  isOpen={isOpen} 
  variant="locked" 
  size="sm"
  overlayBlur
  animation="scale"
>
  <IconWrapper>🔒</IconWrapper>
  <Message>You cannot venture here</Message>
</Modal>
```

**Replaces:**
- EventModal overlay/content
- SkillSelectionModal overlay/content
- LockedNodeModal overlay/content

---

### 2. Panel Component

**File:** `Panel.tsx`

Flexible panel component for displaying grouped content.

**Variants:**
- `default` - Basic panel
- `portrait` - Character portrait panel (300px width)
- `stats` - Stats display panel (scrollable)
- `equipment` - Equipment panel (400px width)
- `inventory` - Inventory panel (flexible, scrollable)
- `info` - Info/help panel (centered text)

**Padding Options:**
- `sm` - Small padding
- `md` - Medium padding
- `lg` - Large padding (default)
- `xl` - Extra large padding

**Props:**
```tsx
interface PanelProps {
  children: React.ReactNode;
  variant?: 'default' | 'portrait' | 'stats' | 'equipment' | 'inventory' | 'info';
  width?: string | number;
  maxWidth?: string;
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  fullHeight?: boolean;
  scrollable?: boolean;
}
```

**Usage:**
```tsx
// Portrait panel
<Panel variant="portrait" title="Character">
  <img src={portrait} />
  <h3>{name}</h3>
</Panel>

// Stats panel
<Panel variant="stats" title="Statistics" fullHeight scrollable>
  <StatCategory title="Core Stats">
    <StatRow label="Health" value="100/100" />
  </StatCategory>
</Panel>

// Custom panel
<Panel title="Custom Panel" width={500} padding="xl">
  Content here
</Panel>
```

**Replaces:**
- PortraitPanel
- StatsPanel
- EquipmentPanel
- InventoryPanel
- InfoPanel

---

### 3. Card Component

**File:** `Card.tsx`

Multi-purpose card component for items, skills, choices, etc.

**Variants:**
- `default` - Basic card
- `skill` - Skill card with hover effects
- `item` - Small item card (70x70px)
- `equipment` - Equipment slot card
- `resource` - Resource gathering card
- `choice` - Event choice card

**Props:**
```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'skill' | 'item' | 'equipment' | 'resource' | 'choice';
  isSelected?: boolean;
  isEquipped?: boolean;
  isEmpty?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  className?: string;
  disabled?: boolean;
  gridArea?: string;
  title?: string;
}
```

**Usage:**
```tsx
// Skill card
<Card 
  variant="skill" 
  isEquipped={equipped}
  onDoubleClick={handleEquip}
>
  <SkillHeader>
    <SkillIcon>{skill.icon}</SkillIcon>
    <SkillName>{skill.name}</SkillName>
  </SkillHeader>
  <Description>{skill.description}</Description>
</Card>

// Item card
<Card 
  variant="item"
  isSelected={selected}
  onClick={handleSelect}
  onDoubleClick={handleEquip}
>
  <div className="item-icon">{item.icon}</div>
</Card>

// Equipment slot
<Card 
  variant="equipment"
  isEmpty={!equipped}
  gridArea="1 / 2 / 2 / 3"
  onDoubleClick={handleUnequip}
>
  <div className="slot-label">Helmet</div>
  <div className="slot-icon">{icon}</div>
</Card>
```

**Replaces:**
- SkillCard
- ItemCard
- EquipmentSlotBox
- ResourceCard
- ChoiceButton

---

### 4. Text Components

**File:** `Text.tsx`

Comprehensive text styling components.

**Components:**

#### Title
```tsx
<Title size="lg" variant="panel" align="center">
  Character Statistics
</Title>
```

**Variants:** `default`, `panel`, `skill`, `page`  
**Sizes:** `sm`, `md`, `lg`, `xl`  
**Align:** `left`, `center`, `right`

#### Subtitle
```tsx
<Subtitle size="md" variant="category">
  Core Stats
</Subtitle>
```

**Variants:** `default`, `category`, `section`  
**Sizes:** `sm`, `md`, `lg`

#### Label
```tsx
<Label size="sm" variant="stat">
  Health
</Label>
```

**Variants:** `default`, `form`, `stat`  
**Sizes:** `sm`, `md`, `lg`

#### Text
```tsx
<Text size="md" variant="secondary" weight="medium">
  This is some text
</Text>
```

**Variants:** `primary`, `secondary`, `muted`, `accent`, `error`, `success`  
**Sizes:** `xs`, `sm`, `md`, `lg`  
**Weights:** `normal`, `medium`, `bold`

#### Description
```tsx
<Description variant="skill">
  A powerful skill that deals damage
</Description>
```

**Variants:** `default`, `event`, `skill`, `tooltip`

#### Badge
```tsx
<Badge variant="learned" position="absolute">
  Learned
</Badge>
```

**Variants:** `default`, `success`, `danger`, `warning`, `info`, `skill`, `learned`  
**Position:** `static`, `absolute`

#### ErrorMessage
```tsx
<ErrorMessage>Login failed</ErrorMessage>
```

**Replaces:**
- PanelTitle, CategoryTitle, SkillTitle, Title
- StatName, StatValue, SkillName, etc.
- All text-based components

---

### 5. Grid Components

**File:** `Grid.tsx`

Layout components for grids and containers.

#### Grid
```tsx
<Grid variant="skill" gap="xl">
  {skills.map(skill => <SkillCard key={skill.id} {...skill} />)}
</Grid>
```

**Variants:** `default`, `equipment`, `item`, `skill`, `resource`, `category`  
**Gaps:** `xs`, `sm`, `md`, `lg`, `xl`  
**AlignContent:** `start`, `center`, `end`, `stretch`

#### FlexContainer
```tsx
<FlexContainer 
  direction="row" 
  justify="space-between"
  align="center"
  gap="md"
>
  <div>Left</div>
  <div>Right</div>
</FlexContainer>
```

#### Container
```tsx
<Container variant="game" padding="xl" fullHeight>
  <Panel>Left Panel</Panel>
  <Panel>Right Panel</Panel>
</Container>
```

**Variants:** `default`, `page`, `game`, `form`  
**Padding:** `sm`, `md`, `lg`, `xl`

#### EmptyState
```tsx
<EmptyState variant="inventory">
  No items in this category
</EmptyState>
```

**Replaces:**
- ItemGrid, SkillGrid, EquipmentGrid, ResourceGrid
- All container/layout components

---

### 6. Tab Components

**File:** `Tab.tsx`

Tab navigation components.

```tsx
<TabsContainer variant="skill" align="center" gap="sm">
  <Tab 
    active={tab === 'body'}
    onClick={() => setTab('body')}
    variant="aspect"
  >
    💪 BODY
  </Tab>
  <Tab 
    active={tab === 'mind'}
    onClick={() => setTab('mind')}
    variant="aspect"
  >
    🧠 MIND
  </Tab>
</TabsContainer>
```

**Tab Variants:** `default`, `category`, `skill`, `aspect`

**Replaces:**
- CategoryTabs, CategoryTab
- SkillTabs, SkillTab

---

### 7. Stat Display Components

**File:** `StatDisplay.tsx`

Components for displaying character statistics.

#### StatRow
```tsx
<StatRow 
  label="Health"
  value="100/100"
  icon="❤️"
  variant="default"
/>
```

#### StatCategory
```tsx
<StatCategory title="Core Stats" icon="⭐" variant="default">
  <StatRow label="Health" value="100" />
  <StatRow label="Mana" value="50" />
</StatCategory>
```

#### StatGrid & StatGridItem
```tsx
<StatGrid columns={3}>
  <StatGridItem label="Mana Cost" value={10} />
  <StatGridItem label="Damage" value={50} />
  <StatGridItem label="Aspect" value="Mind" />
</StatGrid>
```

**Replaces:**
- StatRow, StatCategory
- SkillStats, SkillStat
- All stat-related display components

---

### 8. Slot Components

**File:** `Slot.tsx`

Equipment and skill slot components.

```tsx
<SlotsContainer variant="equipment" gap="lg">
  <Slot
    isEmpty={!item}
    icon="⛑️"
    label="Helmet"
    itemIcon={item?.icon}
    itemName={item?.name}
    variant="equipment"
    size="md"
    onDoubleClick={handleUnequip}
    gridArea="1 / 2 / 2 / 3"
  />
</SlotsContainer>
```

**Slot Variants:** `equipment`, `skill`, `inventory`  
**Sizes:** `sm`, `md`, `lg`

**Replaces:**
- EquipmentSlot, EquipmentSlots
- All slot-based components

---

### 9. Form Components

**File:** `Form.tsx`

Form-related components.

```tsx
<FormContainer variant="auth">
  <Form variant="default" gap="lg" onSubmit={handleSubmit}>
    <FormGroup>
      <FormLabel required>Email</FormLabel>
      <Input type="email" />
      <FormHelperText>Enter your email address</FormHelperText>
    </FormGroup>
    
    <FormError>Invalid credentials</FormError>
    
    <FormActions align="space-between">
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Submit</Button>
    </FormActions>
  </Form>
</FormContainer>
```

**Form Variants:** `default`, `inline`, `grid`  
**FormContainer Variants:** `default`, `auth`, `modal`

**Components:**
- `Form` - Form wrapper
- `FormContainer` - Form container with styling
- `FormGroup` - Groups label + input + helper text
- `FormActions` - Button group
- `FormError` - Error message
- `FormSuccess` - Success message
- `FormHelperText` - Helper text
- `FormLabel` - Form label

**Replaces:**
- LoginContainer, RegisterContainer
- Form elements across pages

---

### 10. Action Buttons

**File:** `ActionButton.tsx`

Specialized action buttons.

#### ActionButton
```tsx
<ActionButton 
  variant="primary"
  size="md"
  fullWidth
  disabled={loading}
>
  Save Changes
</ActionButton>

// Category button
<ActionButton
  variant="category"
  category="body"
  selected={selected === 'body'}
  onClick={handleSelect}
>
  💪 Body
</ActionButton>
```

**Variants:** `primary`, `secondary`, `danger`, `success`, `warning`, `category`  
**Sizes:** `xs`, `sm`, `md`, `lg`  
**Categories:** `body`, `mind`, `heart` (for category variant)

#### SaveButton
```tsx
<SaveButton onClick={handleSave}>
  Save
</SaveButton>
```

#### CloseButton
```tsx
<CloseButton variant="danger" onClick={onClose}>
  ×
</CloseButton>
```

**Replaces:**
- ActionButton, CategoryButton
- SaveButton, CloseButton
- LearnButton, ChoiceButton

---

## 🔄 Migration Guide

### Replacing Existing Components

#### Example 1: Modal Migration

**Before:**
```tsx
<ModalOverlay isOpen={isOpen}>
  <ModalContent>
    <CloseButton onClick={onClose}>×</CloseButton>
    <ModalHeader>
      <h2>Title</h2>
    </ModalHeader>
    <ModalBody>
      Content
    </ModalBody>
  </ModalContent>
</ModalOverlay>
```

**After:**
```tsx
import { Modal } from '@/components/shared';

<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  title="Title"
>
  Content
</Modal>
```

#### Example 2: Panel Migration

**Before:**
```tsx
<PortraitPanel>
  <PanelTitle>Character</PanelTitle>
  <img src={portrait} />
  <div className="character-name">{name}</div>
</PortraitPanel>
```

**After:**
```tsx
import { Panel, Title } from '@/components/shared';

<Panel variant="portrait" title="Character">
  <img src={portrait} />
  <Title size="md">{name}</Title>
</Panel>
```

#### Example 3: Stat Display Migration

**Before:**
```tsx
<StatCategory>
  <CategoryTitle>Core Stats</CategoryTitle>
  <StatRow>
    <StatName>Health</StatName>
    <StatValue>100</StatValue>
  </StatRow>
</StatCategory>
```

**After:**
```tsx
import { StatCategory, StatRow } from '@/components/shared';

<StatCategory title="Core Stats">
  <StatRow label="Health" value="100" />
</StatCategory>
```

---

## 📊 Coverage Summary

This shared component library covers:

✅ **All Modal Patterns**
- Event modals
- Skill selection modals
- Locked node modals
- Combat modals

✅ **All Panel Patterns**
- Character panels
- Stats panels
- Equipment panels
- Inventory panels

✅ **All Card Patterns**
- Skill cards
- Item cards
- Equipment slots
- Resource cards
- Choice cards

✅ **All Layout Patterns**
- Grids (skill, item, equipment, resource)
- Flex containers
- Page containers
- Game containers

✅ **All Text Patterns**
- Titles (panel, page, skill)
- Subtitles and labels
- Descriptions
- Error messages
- Badges

✅ **All Form Patterns**
- Login/register forms
- Form containers
- Form groups and actions
- Error/success messages

✅ **All Button Patterns**
- Action buttons
- Category buttons
- Save buttons
- Close buttons
- Tab buttons

✅ **All Stat Display Patterns**
- Stat rows
- Stat categories
- Stat grids
- Skill stats

✅ **All Slot Patterns**
- Equipment slots
- Skill slots
- Slot containers

---

## 🎨 Styling Philosophy

All components follow these principles:

1. **Consistent Theming** - Use theme constants for colors, spacing, shadows
2. **Responsive Design** - Mobile-first with tablet/desktop breakpoints
3. **Accessible** - Proper semantic HTML and ARIA attributes where needed
4. **Performant** - Minimal re-renders, optimized animations
5. **Extensible** - Easy to add new variants without breaking existing ones

---

## 💡 Best Practices

1. **Always use variants** instead of creating new styled components
2. **Compose components** - use Text, Badge, etc. inside Cards and Panels
3. **Use the theme** - never hardcode colors or spacing
4. **Keep it simple** - if a variant gets too complex, consider a new component
5. **Document changes** - update this README when adding new variants

---

## 🚀 Future Enhancements

Potential additions:
- `Loading` component with variants for spinners, skeletons
- `Alert` component for notifications
- `ProgressBar` component for health/mana/experience bars
- `Dropdown` component for select menus
- `Checkbox` and `Radio` components
- `Switch/Toggle` component

---

## 📝 Component Summary Table

| Component | File | Variants | Primary Use Cases |
|-----------|------|----------|-------------------|
| Modal | Modal.tsx | 5 variants, 5 sizes | All modal dialogs |
| Panel | Panel.tsx | 6 variants | Content grouping, layouts |
| Card | Card.tsx | 6 variants | Items, skills, choices |
| Text | Text.tsx | 6 sub-components | All text rendering |
| Grid | Grid.tsx | 6 variants | Layout grids |
| Tab | Tab.tsx | 4 variants | Navigation tabs |
| StatDisplay | StatDisplay.tsx | 4 components | Character stats |
| Slot | Slot.tsx | 3 variants | Equipment/skill slots |
| Form | Form.tsx | 8 components | Forms and inputs |
| ActionButton | ActionButton.tsx | 6 variants | All buttons |

**Total: 10 component files covering 50+ component patterns**

---

## 🔗 Related Files

- `/components/Button.tsx` - Original button component (can be replaced with ActionButton)
- `/components/Input.tsx` - Input component (works with Form components)
- `/components/Tooltip.tsx` - Tooltip component (standalone, works with all components)
- `/components/Layout.tsx` - Layout wrapper (can be replaced with Container)
- `/styles/theme.ts` - Theme constants used by all shared components
