import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './Dialog';
import { X, BookOpen } from 'lucide-react';
import { ScrollArea } from './ScrollArea';
import { useGameStore } from '../../stores/gameStore';
import { NewFriendsModal } from './NewFriendsModal';
import {
  resolveCombatRound,
  generateEnemyDecision,
  createBattleLogEntry,
  checkCombatEnd,
} from '../../utils/newCombatMechanics';
import { CombatType, CombatActionType, CombatDecision } from '../../types/newCombat';

type ActionView = 'primary' | 'secondary';
type PrimaryAction = 'Body' | 'Mind' | 'Heart' | 'Item' | 'Flee';

interface CombatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When true, renders content without Dialog wrapper (for use inside other modals) */
  bare?: boolean;
}

const actionColors: Record<PrimaryAction, string> = {
  Body: 'border-red-400',
  Mind: 'border-cyan-500',
  Heart: 'border-green-400',
  Item: 'border-white',
  Flee: 'border-white',
};

export function CombatModal({ open, onOpenChange, bare = false }: CombatModalProps) {
  const gameState = useGameStore((state) => state.gameState);
  const updateCombat = useGameStore((state) => state.updateCombat);
  const updateCharacter = useGameStore((state) => state.updateCharacter);

  const [actionView, setActionView] = useState<ActionView>('primary');
  const [selectedPrimaryAction, setSelectedPrimaryAction] = useState<PrimaryAction | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [showNewFriendsModal, setShowNewFriendsModal] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Get combat state from game store
  const combatState = gameState.combat;
  const player = combatState?.player;
  const enemy = combatState?.enemy;
  const round = combatState?.round ?? 1;
  const friendshipCounter = combatState?.friendshipCounter ?? 0;
  const battleLog = combatState?.battleLog ?? [];

  // Reset view when modal opens
  useEffect(() => {
    if (open) {
      setActionView('primary');
      setSelectedPrimaryAction(null);
      setShowNewFriendsModal(false);
    }
  }, [open]);

  const handlePrimaryAction = (action: PrimaryAction) => {
    if (action === 'Flee') {
      // Close modal - flee action
      onOpenChange(false);
      return;
    } else if (action === 'Item') {
      // Do nothing for now
      console.log('Item selected - not implemented yet');
      return;
    } else {
      setSelectedPrimaryAction(action);
      setActionView('secondary');
    }
  };

  const handleBack = () => {
    setActionView('primary');
    setSelectedPrimaryAction(null);
  };

  const handleSecondaryAction = async (action: 'Attack' | 'Defense') => {
    if (!combatState || !player || !enemy || !selectedPrimaryAction || isResolving) {
      return;
    }

    setIsResolving(true);

    // Convert UI actions to combat system types
    const playerType: CombatType = selectedPrimaryAction.toLowerCase() as CombatType;
    const playerAction: CombatActionType = action.toLowerCase() as CombatActionType;

    const playerDecision: CombatDecision = {
      type: playerType,
      action: playerAction,
    };

    // Generate enemy decision
    const enemyDecision = generateEnemyDecision();

    // Resolve combat round
    const resolution = resolveCombatRound(playerDecision, enemyDecision, player, enemy);

    // Update HP
    const newPlayerHP = Math.max(0, player.health - resolution.damageToPlayer);
    const newEnemyHP = Math.max(0, enemy.health - resolution.damageToEnemy);

    // Update friendship counter
    const newFriendshipCounter = combatState.friendshipCounter + (resolution.friendshipIncrement ? 1 : 0);

    // Create battle log entry
    const logEntry = createBattleLogEntry(
      round,
      playerDecision,
      enemyDecision,
      resolution,
      newPlayerHP,
      newEnemyHP
    );

    // Update combat state with stagger (wait 500ms for visual effect)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update player HP in character
    updateCharacter({ health: newPlayerHP });

    // Update enemy HP and combat state
    const updatedEnemy = { ...enemy, health: newEnemyHP };

    updateCombat({
      player: { ...player, health: newPlayerHP },
      enemy: updatedEnemy,
      round: round + 1,
      friendshipCounter: newFriendshipCounter,
      battleLog: [...battleLog, logEntry],
      playerChoice: {},
      enemyChoice: {},
      phase: 'choosing_type',
    });

    // Reset UI
    setActionView('primary');
    setSelectedPrimaryAction(null);
    setIsResolving(false);

    // Check combat end conditions
    const endResult = checkCombatEnd(newPlayerHP, newEnemyHP, newFriendshipCounter);

    if (endResult === 'friendship') {
      // Show New Friends modal
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowNewFriendsModal(true);
    } else if (endResult === 'player_win' || endResult === 'enemy_win') {
      // Close modal after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onOpenChange(false);
    }
  };

  const secondaryBorderColor = selectedPrimaryAction ? actionColors[selectedPrimaryAction] : 'border-cyan-500';

  // If no combat state, don't render
  if (!combatState || !player || !enemy) {
    return null;
  }

  const playerHPPercent = (player.health / player.maxHealth) * 100;
  const playerMPPercent = (player.mana / player.maxMana) * 100;
  const enemyHPPercent = (enemy.health / enemy.maxHealth) * 100;
  const enemyMPPercent = (enemy.mana / enemy.maxMana) * 100;

  // The main combat UI content
  const combatContent = (
    <div className="relative min-h-[600px] bg-black">
            {/* Round indicator and Battle Log */}
            <div className="absolute top-4 left-4 right-4">
              <div className="text-xs text-gray-400 text-center border-t border-b border-gray-700 py-1 flex items-center justify-center gap-4">
                <span>Round {round}</span>
                <div className="flex items-center gap-1">
                  <span>Friendship:</span>
                  <span className="text-green-400">{friendshipCounter}/3</span>
                  <span>{'❤️'.repeat(friendshipCounter)}</span>
                </div>
                <button
                  onClick={() => setIsLogOpen(true)}
                  className="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Enemy Card */}
            <div className="absolute top-20 left-4 w-52 bg-black border-2 border-white p-3">
              <div className="mb-2">{enemy.name}</div>
              {/* HP bar */}
              <div className="relative h-3 bg-gray-800 border border-gray-600 mb-1">
                <div className="absolute inset-0 bg-red-600" style={{ width: `${enemyHPPercent}%` }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-yellow-500 text-xs">{enemy.health}</span>
                  <span className="text-white text-xs ml-1">/ {enemy.maxHealth}</span>
                </div>
              </div>
              {/* MP bar */}
              <div className="relative h-3 bg-gray-800 border border-gray-600 mb-1">
                <div className="absolute inset-0 bg-blue-600" style={{ width: `${enemyMPPercent}%` }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-cyan-300 text-xs">{enemy.mana}</span>
                  <span className="text-white text-xs ml-1">/ {enemy.maxMana}</span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-xs">
                  <div>Lv</div>
                  <div>{enemy.level}</div>
                </div>
              </div>
            </div>

          {/* Enemy Image */}
          <div className="absolute top-24 right-8">
            <div className="text-8xl">{enemy.image || '👹'}</div>
          </div>

          {/* Player Card */}
          <div className="absolute bottom-32 right-4 w-52 bg-black border-2 border-red-600 p-3">
            <div className="mb-2">{player.name}</div>
            {/* Health bar (red) */}
            <div className="relative h-3 bg-gray-800 border border-gray-600 mb-1">
              <div className="absolute inset-0 bg-red-600" style={{ width: `${playerHPPercent}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow-500 text-xs">{player.health}</span>
                <span className="text-white text-xs ml-1">/ {player.maxHealth}</span>
              </div>
            </div>
            {/* Mana/Energy bar (blue) */}
            <div className="relative h-3 bg-gray-800 border border-gray-600 mb-1">
              <div className="absolute inset-0 bg-blue-600" style={{ width: `${playerMPPercent}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyan-300 text-xs">{player.mana}</span>
                <span className="text-white text-xs ml-1">/ {player.maxMana}</span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-xs">
                <div>Lv</div>
                <div>{player.level}</div>
              </div>
            </div>
          </div>

          {/* Player Character */}
          <div className="absolute bottom-44 left-8">
            {player.portrait?.imageUrl ? (
              <img
                src={player.portrait.imageUrl}
                alt={player.name}
                className="w-24 h-24 rounded-full border-2 border-cyan-400 object-cover"
              />
            ) : (
              <div className="text-7xl">🧝</div>
            )}
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
              <div className="bg-black border-2 border-white w-full max-w-lg max-h-[500px] flex flex-col">
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
                  <div className="space-y-4">
                    {battleLog.length === 0 ? (
                      <div className="text-gray-500 text-sm text-center">No combat rounds yet</div>
                    ) : (
                      battleLog.map((entry) => (
                        <div key={entry.round} className="border border-gray-700 p-3 space-y-1">
                          <div className="text-cyan-400 font-bold text-xs mb-2">Round {entry.round}</div>

                          {/* Decisions */}
                          <div className="text-xs text-gray-300">
                            <span className="text-green-400">Player:</span>{' '}
                            <span className="capitalize">{entry.playerDecision.type}</span> +{' '}
                            <span className="capitalize">{entry.playerDecision.action}</span>
                          </div>
                          <div className="text-xs text-gray-300">
                            <span className="text-red-400">Enemy:</span>{' '}
                            <span className="capitalize">{entry.enemyDecision.type}</span> +{' '}
                            <span className="capitalize">{entry.enemyDecision.action}</span>
                          </div>

                          {/* Advantage */}
                          {entry.advantage !== 'none' && (
                            <div className="text-xs text-yellow-400">
                              Advantage: {entry.advantage === 'player' ? 'Player' : 'Enemy'}
                            </div>
                          )}

                          {/* Rolls */}
                          {entry.playerRoll && (
                            <div className="text-xs text-gray-400">
                              Player Roll: {entry.playerRoll} ({entry.playerRollDetails})
                            </div>
                          )}
                          {entry.enemyRoll && (
                            <div className="text-xs text-gray-400">
                              Enemy Roll: {entry.enemyRoll} ({entry.enemyRollDetails})
                            </div>
                          )}

                          {/* Damage */}
                          {entry.damageToEnemy > 0 && (
                            <div className="text-xs text-red-300">
                              ⚔️ Dealt {entry.damageToEnemy} damage to enemy
                            </div>
                          )}
                          {entry.damageToPlayer > 0 && (
                            <div className="text-xs text-orange-300">
                              💥 Took {entry.damageToPlayer} damage
                            </div>
                          )}

                          {/* HP After */}
                          <div className="text-xs text-gray-500 mt-1">
                            Player HP: {entry.playerHPAfter} | Enemy HP: {entry.enemyHPAfter}
                          </div>

                          {/* Result */}
                          <div className="text-xs text-gray-400 italic mt-2">{entry.result}</div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
    </div>
  );

  return (
    <>
      {bare ? (
        // Render content directly without Dialog wrapper (for use inside EventModal)
        combatContent
      ) : (
        // Render with Dialog wrapper (for standalone use)
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl bg-black border-2 border-gray-700 text-white p-0 overflow-hidden">
            {combatContent}
          </DialogContent>
        </Dialog>
      )}

      {/* New Friends Modal */}
      <NewFriendsModal
        open={showNewFriendsModal}
        onOpenChange={(open) => {
          setShowNewFriendsModal(open);
          if (!open) {
            // Close combat modal too
            onOpenChange(false);
          }
        }}
        enemyName={enemy?.name || 'Enemy'}
      />
    </>
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
