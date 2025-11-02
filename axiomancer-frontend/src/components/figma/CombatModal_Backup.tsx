import { useState } from 'react';
import { Dialog, DialogContent } from './Dialog';
import { X, BookOpen } from 'lucide-react';
import { ScrollArea } from './ScrollArea';

type ActionView = 'primary' | 'secondary';
type PrimaryAction = 'Body' | 'Mind' | 'Heart' | 'Item' | 'Flee';

interface CombatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const actionColors: Record<PrimaryAction, string> = {
  Body: 'border-red-400',
  Mind: 'border-cyan-500',
  Heart: 'border-green-400',
  Item: 'border-white',
  Flee: 'border-white',
};

export function CombatModal({ open, onOpenChange }: CombatModalProps) {
  const [actionView, setActionView] = useState<ActionView>('primary');
  const [selectedPrimaryAction, setSelectedPrimaryAction] = useState<PrimaryAction | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const handlePrimaryAction = (action: PrimaryAction) => {
    if (action === 'Flee') {
      console.log('Fleeing!');
    } else if (action === 'Item') {
      console.log('Item selected');
      // For now, do nothing
    } else {
      setSelectedPrimaryAction(action);
      setActionView('secondary');
    }
  };

  const handleBack = () => {
    setActionView('primary');
    setSelectedPrimaryAction(null);
  };

  const handleSecondaryAction = (action: string) => {
    console.log(`${selectedPrimaryAction} -> ${action}`);
    // Handle combat action
  };

  const secondaryBorderColor = selectedPrimaryAction ? actionColors[selectedPrimaryAction] : 'border-cyan-500';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-black border-2 border-gray-700 text-white p-0 overflow-hidden">
        <div className="relative min-h-[600px] bg-black">
          {/* Floor indicator */}
          <div className="absolute top-4 left-4 right-4">
            <div className="text-xs text-gray-400 text-center border-t border-b border-gray-700 py-1 flex items-center justify-center gap-2">
              <span>Round 1</span>
              <button 
                onClick={() => setIsLogOpen(true)}
                className="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <BookOpen className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Enemy Card */}
          <div className="absolute top-20 left-4 w-48 bg-black border-2 border-white p-3">
            <div className="mb-2">Goblin</div>
            <div className="relative h-3 bg-gray-800 border border-gray-600">
              <div className="absolute inset-0 bg-red-600" style={{ width: '60%' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs">39</div>
            </div>
            <div className="flex items-center justify-end mt-2">
              <div className="text-xs">
                <div>Lv</div>
                <div>8</div>
              </div>
            </div>
          </div>

          {/* Enemy Image */}
          <div className="absolute top-24 right-8">
            <div className="text-8xl">👹</div>
          </div>

          {/* Player Card */}
          <div className="absolute bottom-32 right-4 w-52 bg-black border-2 border-red-600 p-3">
            <div className="mb-2">Mononoke</div>
            {/* Health bar (red) */}
            <div className="relative h-3 bg-gray-800 border border-gray-600 mb-1">
              <div className="absolute inset-0 bg-red-600" style={{ width: '75%' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow-500 text-xs">198</span>
                <span className="text-white text-xs ml-1">/ 262</span>
              </div>
            </div>
            {/* Mana/Energy bar (blue) */}
            <div className="relative h-3 bg-gray-800 border border-gray-600 mb-1">
              <div className="absolute inset-0 bg-blue-600" style={{ width: '45%' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyan-300 text-xs">90</span>
                <span className="text-white text-xs ml-1">/ 200</span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-xs">
                <div>Lv</div>
                <div>7</div>
              </div>
            </div>
          </div>

          {/* Player Character */}
          <div className="absolute bottom-44 left-8">
            <div className="text-7xl">🧝</div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 right-4">
            {actionView === 'primary' ? (
              <div className="grid grid-cols-5 gap-3">
                <ActionButton
                  onClick={() => handlePrimaryAction('Body')}
                  label="Body"
                  icon={<BodyIcon />}
                  borderColor="border-red-400"
                />
                <ActionButton
                  onClick={() => handlePrimaryAction('Mind')}
                  label="Mind"
                  icon={<MindIcon />}
                  borderColor="border-cyan-500"
                />
                <ActionButton
                  onClick={() => handlePrimaryAction('Heart')}
                  label="Heart"
                  icon={<HeartIcon />}
                  borderColor="border-green-400"
                />
                <ActionButton
                  onClick={() => handlePrimaryAction('Item')}
                  label="Item"
                  icon={<ItemIcon />}
                  borderColor="border-white"
                />
                <ActionButton
                  onClick={() => handlePrimaryAction('Flee')}
                  label="Flee"
                  icon={<FleeIcon />}
                  borderColor="border-white"
                />
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-3">
                <div></div>
                <ActionButton
                  onClick={() => handleSecondaryAction('Attack')}
                  label="Attack"
                  icon={<AttackIcon />}
                  borderColor={secondaryBorderColor}
                />
                <ActionButton
                  onClick={() => handleSecondaryAction('Defense')}
                  label="Defense"
                  icon={<DefenseIcon />}
                  borderColor={secondaryBorderColor}
                />
                <ActionButton
                  onClick={handleBack}
                  label="Back"
                  icon={<BackIcon />}
                  borderColor="border-white"
                />
                <div></div>
              </div>
            )}
          </div>

          {/* Combat Log Modal */}
          {isLogOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8">
              <div className="bg-black border-2 border-white w-full max-w-md max-h-80 flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-gray-700">
                  <span>Combat Log</span>
                  <button 
                    onClick={() => setIsLogOpen(false)}
                    className="hover:bg-gray-800 rounded p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-2">
                    <LogItem icon="⚔️" text="You attacked the Goblin for 15 damage" />
                    <LogItem icon="🛡️" text="Goblin attacked you for 8 damage" />
                    <LogItem icon="⚔️" text="You attacked the Goblin for 18 damage" />
                    <LogItem icon="🛡️" text="Goblin missed!" />
                    <LogItem icon="💭" text="You used Mind ability" />
                    <LogItem icon="⚔️" text="Critical hit! 25 damage to Goblin" />
                    <LogItem icon="🛡️" text="Goblin attacked you for 10 damage" />
                    <LogItem icon="❤️" text="You healed for 20 HP" />
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  borderColor: string;
}

function ActionButton({ onClick, label, icon, borderColor }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-b from-gray-800 to-gray-900 border-2 ${borderColor} rounded-lg p-4 hover:shadow-lg transition-all aspect-square flex flex-col items-center justify-center gap-2`}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        {icon}
      </div>
      <div className="text-xs text-cyan-400">{label}</div>
    </button>
  );
}

interface LogItemProps {
  icon: string;
  text: string;
}

function LogItem({ icon, text }: LogItemProps) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-sm">{icon}</span>
      <span className="text-gray-300">{text}</span>
    </div>
  );
}

// Icon Components
function BodyIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-cyan-400">
      <circle cx="50" cy="20" r="12" />
      <rect x="35" y="35" width="30" height="35" rx="5" />
      <rect x="25" y="35" width="10" height="25" rx="5" />
      <rect x="65" y="35" width="10" height="25" rx="5" />
      <rect x="35" y="70" width="10" height="25" rx="5" />
      <rect x="55" y="70" width="10" height="25" rx="5" />
    </svg>
  );
}

function MindIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-none stroke-cyan-400 stroke-2">
      <rect x="25" y="40" width="50" height="45" rx="2" />
      <line x1="25" y1="50" x2="75" y2="50" />
      <circle cx="50" cy="30" r="15" />
      <circle cx="50" cy="30" r="8" />
      <circle cx="45" cy="22" r="3" />
      <circle cx="55" cy="22" r="3" />
      <circle cx="50" cy="38" r="3" />
      <circle cx="42" cy="30" r="3" />
      <circle cx="58" cy="30" r="3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-red-500">
      <path d="M50 85 L20 55 Q15 50 15 40 Q15 25 27.5 25 Q40 25 50 40 Q60 25 72.5 25 Q85 25 85 40 Q85 50 80 55 Z" />
    </svg>
  );
}

function ItemIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-none stroke-cyan-400 stroke-2">
      <rect x="30" y="25" width="40" height="50" rx="3" />
      <rect x="35" y="30" width="30" height="8" rx="2" fill="cyan" />
      <rect x="35" y="43" width="30" height="8" rx="2" fill="cyan" />
      <rect x="35" y="56" width="30" height="8" rx="2" fill="cyan" />
      <circle cx="43" cy="34" r="2" fill="black" />
      <circle cx="43" cy="47" r="2" fill="black" />
      <circle cx="43" cy="60" r="2" fill="black" />
    </svg>
  );
}

function FleeIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-cyan-400">
      <circle cx="70" cy="20" r="10" />
      <rect x="45" y="32" width="35" height="25" rx="4" transform="rotate(-15 62.5 44.5)" />
      <rect x="30" y="30" width="8" height="30" rx="4" transform="rotate(-30 34 45)" />
      <rect x="72" y="30" width="8" height="30" rx="4" transform="rotate(30 76 45)" />
      <rect x="45" y="55" width="8" height="25" rx="4" transform="rotate(-45 49 67.5)" />
      <rect x="67" y="55" width="8" height="25" rx="4" transform="rotate(20 71 67.5)" />
    </svg>
  );
}

function AttackIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-none stroke-cyan-400 stroke-2">
      <line x1="15" y1="70" x2="50" y2="30" strokeWidth="3" />
      <rect x="47" y="27" width="8" height="8" fill="cyan" />
      <path d="M 20 75 Q 15 70 20 65 L 35 50 L 45 60 Z" fill="cyan" className="stroke-cyan-400" />
      <line x1="50" y1="30" x2="85" y2="15" strokeWidth="2" />
      <polygon points="82,12 88,15 85,21" fill="cyan" />
    </svg>
  );
}

function DefenseIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-cyan-400 stroke-cyan-600 stroke-2">
      <path d="M 50 15 L 75 25 L 75 50 Q 75 70 50 85 Q 25 70 25 50 L 25 25 Z" />
      <path d="M 50 25 L 65 32 L 65 50 Q 65 62 50 72 Q 35 62 35 50 L 35 32 Z" fill="black" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-none stroke-cyan-400 stroke-[4]">
      <line x1="70" y1="50" x2="30" y2="50" />
      <polyline points="45,35 30,50 45,65" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
