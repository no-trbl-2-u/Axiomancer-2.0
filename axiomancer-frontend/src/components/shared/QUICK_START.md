# Shared Components Quick Start Guide

A quick reference for using the shared component library in axiomancer-frontend.

---

## 📦 Import

```tsx
// Import everything you need from the shared components
import {
  // Layout
  Container,
  Grid,
  FlexContainer,
  EmptyState,
  
  // Structure
  Modal,
  Panel,
  Card,
  
  // Text
  Title,
  Subtitle,
  Text,
  Label,
  Description,
  Badge,
  ErrorMessage,
  
  // Navigation
  Tab,
  TabsContainer,
  StyledLink,
  
  // Stats
  StatCategory,
  StatRow,
  StatGrid,
  StatGridItem,
  
  // Slots
  Slot,
  SlotsContainer,
  
  // Forms
  Form,
  FormContainer,
  FormGroup,
  FormActions,
  FormError,
  FormSuccess,
  FormHelperText,
  FormLabel,
  
  // Buttons
  ActionButton,
  SaveButton,
  CloseButton,
} from '@/components/shared';
```

---

## 🎨 Common Patterns

### Page Layout

```tsx
// Full game screen layout
<Container variant="game" padding="xl">
  <Panel variant="portrait" title="Character">
    {/* Left panel content */}
  </Panel>
  
  <Panel variant="stats" title="Statistics" fullHeight scrollable>
    {/* Main content with scrolling */}
  </Panel>
</Container>

// Simple page layout
<Container variant="page" padding="xl">
  <Title variant="skill" size="lg">Page Title</Title>
  {/* Page content */}
</Container>
```

### Modal Dialog

```tsx
// Simple modal
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  title="Modal Title"
>
  Content here
</Modal>

// Locked/warning modal
<Modal
  isOpen={isOpen}
  onClose={onClose}
  variant="locked"
  size="sm"
  showCloseButton={false}
  overlayBlur
  animation="scale"
>
  <Icon />
  <Text>Warning message</Text>
  <ActionButton variant="danger" onClick={onClose}>
    OK
  </ActionButton>
</Modal>

// Full-screen combat modal
<Modal
  isOpen={isOpen}
  variant="combat"
  size="full"
  showCloseButton={false}
>
  <CombatScreen />
</Modal>
```

### Stats Display

```tsx
// Simple stat rows
<StatCategory title="⭐ Base Stats">
  <StatRow label="Health" value={character.health} />
  <StatRow label="Mana" value={character.mana} />
</StatCategory>

// Stat grid for compact display
<StatGrid columns={3}>
  <StatGridItem label="Mana Cost" value={skill.manaCost} />
  <StatGridItem label="Damage" value={skill.damage} />
  <StatGridItem label="Type" value={skill.type} />
</StatGrid>
```

### Cards

```tsx
// Skill card
<Card 
  variant="skill"
  isEquipped={isEquipped}
  onDoubleClick={handleEquip}
>
  <Title size="md">{skill.name}</Title>
  <Description variant="skill">{skill.description}</Description>
  <StatGrid columns={3}>
    <StatGridItem label="Cost" value={cost} />
  </StatGrid>
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
  onDoubleClick={handleUnequip}
  gridArea="1 / 2 / 2 / 3"
>
  <div className="slot-label">Helmet</div>
  <div className="slot-icon">{icon}</div>
</Card>
```

### Tabs

```tsx
// Category tabs
<TabsContainer variant="category" gap="sm" wrap>
  {categories.map(category => (
    <Tab
      key={category.id}
      active={selected === category.id}
      onClick={() => setSelected(category.id)}
      variant="category"
    >
      {category.icon} {category.label}
    </Tab>
  ))}
</TabsContainer>

// Aspect tabs (for skills)
<TabsContainer variant="skill" align="center">
  <Tab 
    active={tab === 'body'}
    onClick={() => setTab('body')}
    variant="aspect"
  >
    💪 BODY (3/5)
  </Tab>
  {/* More tabs... */}
</TabsContainer>
```

### Grids

```tsx
// Skill grid
<Grid variant="skill" gap="xl">
  {skills.map(skill => (
    <Card key={skill.id} variant="skill">
      {/* Skill content */}
    </Card>
  ))}
</Grid>

// Item grid
<Grid variant="item" gap="sm">
  {items.map(item => (
    <Card key={item.id} variant="item">
      {/* Item content */}
    </Card>
  ))}
</Grid>

// Equipment grid (custom layout)
<EquipmentGrid>
  {slots.map(slot => (
    <Card 
      key={slot.id} 
      variant="equipment"
      gridArea={slot.gridArea}
    >
      {/* Slot content */}
    </Card>
  ))}
</EquipmentGrid>
```

### Forms

```tsx
// Auth form (login/register)
<FormContainer variant="auth">
  <Title variant="page" size="lg">Welcome</Title>
  {error && <FormError>{error}</FormError>}
  
  <Form variant="default" gap="lg" onSubmit={handleSubmit}>
    <Input
      type="email"
      label="Email"
      value={email}
      onChange={handleChange}
      required
      fullWidth
    />
    
    <ActionButton
      type="submit"
      variant="primary"
      fullWidth
      disabled={isLoading}
    >
      Submit
    </ActionButton>
    
    <StyledLink to="/other-page" variant="underline">
      Link text
    </StyledLink>
  </Form>
</FormContainer>
```

### Buttons

```tsx
// Primary action button
<ActionButton
  variant="primary"
  size="md"
  fullWidth
  onClick={handleClick}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Click Me'}
</ActionButton>

// Danger button
<ActionButton variant="danger" onClick={handleDelete}>
  Delete
</ActionButton>

// Category button (for skill aspects)
<ActionButton
  variant="category"
  category="body"
  selected={selected === 'body'}
  onClick={() => setSelected('body')}
>
  💪 Body
</ActionButton>

// Save button
<SaveButton onClick={handleSave}>
  Save
</SaveButton>
```

### Text Elements

```tsx
// Page title
<Title variant="page" size="lg">Page Title</Title>

// Panel title (auto-styled with panel)
<Panel title="Panel Title">
  {/* Content */}
</Panel>

// Section heading
<Subtitle size="md" variant="category">
  Section Name
</Subtitle>

// Body text
<Text variant="secondary" size="md" align="center">
  Some descriptive text
</Text>

// Description
<Description variant="skill">
  Skill or item description text
</Description>

// Badge
<Badge variant="learned" position="absolute">
  Learned
</Badge>

// Error message
<FormError>An error occurred</FormError>
```

### Slots (Equipment/Skills)

```tsx
// Equipment slots container
<SlotsContainer variant="equipment" gap="md">
  {slots.map((slot, index) => (
    <Slot
      key={index}
      isEmpty={!equipped[index]}
      icon={slot.icon}
      label={slot.label}
      itemIcon={equipped[index]?.icon}
      variant="equipment"
      size="md"
      onDoubleClick={() => handleUnequip(index)}
      gridArea={slot.gridArea}
    />
  ))}
</SlotsContainer>

// Skill slots
<SlotsContainer variant="skill" gap="lg">
  {[...Array(5)].map((_, index) => (
    <Slot
      key={index}
      isEmpty={!skills[index]}
      variant="skill"
      icon={skills[index]?.icon}
      cost={skills[index]?.manaCost}
      onClick={() => handleUnequip(index)}
    />
  ))}
</SlotsContainer>
```

---

## 🎯 Variant Quick Reference

### Modal Variants
- `default` - Standard modal
- `combat` - Full-screen combat
- `locked` - Warning/locked modal
- `event` - Event selection
- `skill` - Skill selection

### Panel Variants
- `default` - Basic panel
- `portrait` - Character portrait (300px)
- `stats` - Stats display (scrollable)
- `equipment` - Equipment panel (400px)
- `inventory` - Inventory panel (flexible)
- `info` - Info/help panel (centered)

### Card Variants
- `default` - Basic card
- `skill` - Skill card (with hover effects)
- `item` - Small item card (70x70px)
- `equipment` - Equipment slot card
- `resource` - Resource gathering card
- `choice` - Event choice card

### Container Variants
- `default` - Basic container
- `page` - Page layout
- `game` - Game screen (2-panel)
- `form` - Form container

### Grid Variants
- `default` - Auto-fit grid
- `equipment` - 3-column grid
- `item` - Auto-fill small items
- `skill` - Large skill cards
- `resource` - Resource cards
- `category` - Category items

### Tab Variants
- `default` - Basic tab
- `category` - Inventory categories
- `skill` - Skill tabs
- `aspect` - Philosophical aspects

### Button Variants
- `primary` - Main actions
- `secondary` - Secondary actions
- `danger` - Destructive actions
- `success` - Success actions
- `warning` - Warning actions
- `category` - Category selection (body/mind/heart)

### Text Variants
- Title: `default`, `panel`, `skill`, `page`
- Subtitle: `default`, `category`, `section`
- Text: `primary`, `secondary`, `muted`, `accent`, `error`, `success`
- Description: `default`, `event`, `skill`, `tooltip`
- Badge: `default`, `success`, `danger`, `warning`, `info`, `skill`, `learned`

---

## 💡 Tips

### DO ✅
- Always use variants instead of creating new components
- Use theme constants for custom styling
- Compose components (put Text inside Cards)
- Use props for customization
- Check existing variants before creating new ones

### DON'T ❌
- Don't create new styled-components for common patterns
- Don't hardcode colors or spacing
- Don't duplicate component logic
- Don't skip variant props (always specify intent)

---

## 🔍 Finding Components

1. **Need a container?** → Check Grid.tsx (Container, Grid, FlexContainer)
2. **Need a panel?** → Check Panel.tsx
3. **Need a card?** → Check Card.tsx
4. **Need text?** → Check Text.tsx
5. **Need a button?** → Check ActionButton.tsx
6. **Need stats?** → Check StatDisplay.tsx
7. **Need tabs?** → Check Tab.tsx
8. **Need forms?** → Check Form.tsx
9. **Need a modal?** → Check Modal.tsx
10. **Need slots?** → Check Slot.tsx

---

## 📚 More Info

- **Full Documentation:** See `README.md`
- **Migration Guide:** See `MIGRATION_MAP.md`
- **Migration Summary:** See `MIGRATION_COMPLETE.md`
- **Component Props:** Check TypeScript interfaces in each file

---

**Quick Start Version:** 1.0  
**Last Updated:** 2025-10-18
