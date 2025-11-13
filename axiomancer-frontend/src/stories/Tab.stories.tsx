import type { Meta, StoryObj } from '@storybook/react';
import { Tab, TabsContainer } from '@components/shared/Tab';
import { useState } from 'react';

const meta = {
  title: 'Shared/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Active state',
    },
    variant: {
      control: 'select',
      options: ['default', 'category', 'skill', 'aspect'],
      description: 'Tab variant style',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    active: true,
    children: 'Active Tab',
    onClick: () => {},
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    children: 'Inactive Tab',
    onClick: () => {},
  },
};

export const Disabled: Story = {
  args: {
    active: false,
    disabled: true,
    children: 'Disabled Tab',
    onClick: () => {},
  },
};

const TabGroupTemplate = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContainer>
      <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
        Tab 1
      </Tab>
      <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
        Tab 2
      </Tab>
      <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
        Tab 3
      </Tab>
    </TabsContainer>
  );
};

export const TabGroup: Story = {
  render: () => <TabGroupTemplate />,
};

const CategoryTabsTemplate = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContainer variant="category">
      <Tab active={activeTab === 0} variant="category" onClick={() => setActiveTab(0)}>
        Body
      </Tab>
      <Tab active={activeTab === 1} variant="category" onClick={() => setActiveTab(1)}>
        Mind
      </Tab>
      <Tab active={activeTab === 2} variant="category" onClick={() => setActiveTab(2)}>
        Heart
      </Tab>
    </TabsContainer>
  );
};

export const CategoryTabs: Story = {
  render: () => <CategoryTabsTemplate />,
};

const SkillTabsTemplate = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContainer variant="skill">
      <Tab active={activeTab === 0} variant="skill" onClick={() => setActiveTab(0)}>
        Offensive
      </Tab>
      <Tab active={activeTab === 1} variant="skill" onClick={() => setActiveTab(1)}>
        Defensive
      </Tab>
      <Tab active={activeTab === 2} variant="skill" onClick={() => setActiveTab(2)}>
        Support
      </Tab>
    </TabsContainer>
  );
};

export const SkillTabs: Story = {
  render: () => <SkillTabsTemplate />,
};

const AspectTabsTemplate = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContainer variant="skill">
      <Tab active={activeTab === 0} variant="aspect" onClick={() => setActiveTab(0)}>
        Fire
      </Tab>
      <Tab active={activeTab === 1} variant="aspect" onClick={() => setActiveTab(1)}>
        Water
      </Tab>
      <Tab active={activeTab === 2} variant="aspect" onClick={() => setActiveTab(2)}>
        Earth
      </Tab>
      <Tab active={activeTab === 3} variant="aspect" onClick={() => setActiveTab(3)}>
        Air
      </Tab>
    </TabsContainer>
  );
};

export const AspectTabs: Story = {
  render: () => <AspectTabsTemplate />,
};

export const CenteredTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <TabsContainer align="center">
        <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Home
        </Tab>
        <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Profile
        </Tab>
        <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
          Settings
        </Tab>
      </TabsContainer>
    );
  },
};

export const RightAlignedTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <TabsContainer align="right">
        <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
          View
        </Tab>
        <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Edit
        </Tab>
        <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
          Delete
        </Tab>
      </TabsContainer>
    );
  },
};

export const TabsWithOneDisabled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <TabsContainer>
        <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Available
        </Tab>
        <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Active
        </Tab>
        <Tab active={activeTab === 2} disabled onClick={() => setActiveTab(2)}>
          Locked
        </Tab>
      </TabsContainer>
    );
  },
};

export const ManyTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <TabsContainer wrap>
        {['All', 'Weapons', 'Armor', 'Potions', 'Materials', 'Quest Items', 'Misc'].map((tab, i) => (
          <Tab key={i} active={activeTab === i} onClick={() => setActiveTab(i)}>
            {tab}
          </Tab>
        ))}
      </TabsContainer>
    );
  },
};
