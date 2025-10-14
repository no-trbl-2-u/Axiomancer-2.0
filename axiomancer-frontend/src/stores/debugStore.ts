import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type EventType = 'combat' | 'moral' | 'gathering' | 'rest';

interface DebugStore {
  debugMode: boolean;
  nextEventType: EventType;
  setDebugMode: (enabled: boolean) => void;
  setNextEventType: (eventType: EventType) => void;
}

export const useDebugStore = create<DebugStore>()(
  devtools(
    (set) => ({
      debugMode: false,
      nextEventType: 'combat',
      setDebugMode: (enabled: boolean) => set({ debugMode: enabled }),
      setNextEventType: (eventType: EventType) => set({ nextEventType: eventType }),
    }),
    {
      name: 'axiomancer-debug-store',
    }
  )
);
