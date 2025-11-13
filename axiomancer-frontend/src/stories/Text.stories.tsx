import type { Meta, StoryObj } from '@storybook/react';
import { Title, Subtitle, Label, Text, Description, ErrorMessage, Badge } from '@components/shared/Text';

const meta = {
  title: 'Shared/Text',
  component: Title,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

// Title Stories
export const TitleDefault: Story = {
  args: {
    children: 'Default Title',
  },
};

export const TitleSmall: Story = {
  args: {
    children: 'Small Title',
    size: 'sm',
  },
};

export const TitleMedium: Story = {
  args: {
    children: 'Medium Title',
    size: 'md',
  },
};

export const TitleLarge: Story = {
  args: {
    children: 'Large Title',
    size: 'lg',
  },
};

export const TitleExtraLarge: Story = {
  args: {
    children: 'Extra Large Title',
    size: 'xl',
  },
};

export const TitlePanel: Story = {
  args: {
    children: 'Panel Title',
    variant: 'panel',
  },
};

export const TitleSkill: Story = {
  args: {
    children: 'Skill Title',
    variant: 'skill',
  },
};

export const TitlePage: Story = {
  args: {
    children: 'Page Title',
    variant: 'page',
  },
};

export const TitleCentered: Story = {
  args: {
    children: 'Centered Title',
    align: 'center',
  },
};

// Subtitle Stories
export const SubtitleDefault: StoryObj = {
  render: () => <Subtitle>Default Subtitle</Subtitle>,
};

export const SubtitleCategory: StoryObj = {
  render: () => <Subtitle variant="category">Category Subtitle</Subtitle>,
};

export const SubtitleSection: StoryObj = {
  render: () => <Subtitle variant="section">Section Subtitle</Subtitle>,
};

// Label Stories
export const LabelDefault: StoryObj = {
  render: () => <Label>Default Label</Label>,
};

export const LabelForm: StoryObj = {
  render: () => <Label variant="form">Form Label</Label>,
};

export const LabelStat: StoryObj = {
  render: () => <Label variant="stat">Stat Label</Label>,
};

// Text Stories
export const TextDefault: StoryObj = {
  render: () => <Text>Default text content</Text>,
};

export const TextPrimary: StoryObj = {
  render: () => <Text variant="primary">Primary text</Text>,
};

export const TextSecondary: StoryObj = {
  render: () => <Text variant="secondary">Secondary text</Text>,
};

export const TextMuted: StoryObj = {
  render: () => <Text variant="muted">Muted text</Text>,
};

export const TextAccent: StoryObj = {
  render: () => <Text variant="accent">Accent text</Text>,
};

export const TextError: StoryObj = {
  render: () => <Text variant="error">Error text</Text>,
};

export const TextSuccess: StoryObj = {
  render: () => <Text variant="success">Success text</Text>,
};

export const TextSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text size="xs">Extra small text</Text>
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text</Text>
      <Text size="lg">Large text</Text>
    </div>
  ),
};

// Description Stories
export const DescriptionDefault: StoryObj = {
  render: () => (
    <Description>
      This is a default description with some text content that spans multiple lines 
      and provides detailed information about something.
    </Description>
  ),
};

export const DescriptionEvent: StoryObj = {
  render: () => (
    <Description variant="event">
      <div className="event-title">Quest Completed!</div>
      <div className="event-text">
        You have successfully completed the quest "The Lost Artifact" and gained 1,000 XP 
        and 500 gold as a reward.
      </div>
    </Description>
  ),
};

export const DescriptionSkill: StoryObj = {
  render: () => (
    <Description variant="skill">
      Launch a powerful fireball at your target, dealing massive fire damage. 
      This spell can ignite flammable objects and leave enemies burning for additional damage over time.
    </Description>
  ),
};

export const DescriptionTooltip: StoryObj = {
  render: () => (
    <Description variant="tooltip">
      This item increases your attack power by 10% and grants immunity to fire damage.
    </Description>
  ),
};

// ErrorMessage Stories
export const ErrorMessageDefault: StoryObj = {
  render: () => <ErrorMessage>An error has occurred. Please try again.</ErrorMessage>,
};

// Badge Stories
export const BadgeDefault: StoryObj = {
  render: () => <Badge>Default</Badge>,
};

export const BadgeSuccess: StoryObj = {
  render: () => <Badge variant="success">Success</Badge>,
};

export const BadgeDanger: StoryObj = {
  render: () => <Badge variant="danger">Danger</Badge>,
};

export const BadgeWarning: StoryObj = {
  render: () => <Badge variant="warning">Warning</Badge>,
};

export const BadgeInfo: StoryObj = {
  render: () => <Badge variant="info">Info</Badge>,
};

export const BadgeSkill: StoryObj = {
  render: () => <Badge variant="skill">Skill</Badge>,
};

export const BadgeLearned: StoryObj = {
  render: () => <Badge variant="learned">Learned</Badge>,
};

export const AllBadges: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="skill">Skill</Badge>
      <Badge variant="learned">Learned</Badge>
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Title size="xl">Main Page Title</Title>
      <Subtitle>This is a subtitle for the page</Subtitle>
      
      <div>
        <Title variant="panel" size="md">Section Title</Title>
        <Text>
          This is regular paragraph text. Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </div>
      
      <div>
        <Subtitle variant="section">Features</Subtitle>
        <Text variant="secondary">
          This is secondary text that provides additional context or less important information.
        </Text>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Badge variant="success">New</Badge>
        <Badge variant="info">Updated</Badge>
        <Badge variant="warning">Beta</Badge>
      </div>
    </div>
  ),
};
