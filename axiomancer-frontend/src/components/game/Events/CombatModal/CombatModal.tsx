import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Dialog, DialogContent } from '@components/figma/Dialog';
import { X, BookOpen } from 'lucide-react';
import { ScrollArea } from '@components/figma/ScrollArea';
import { useGameStore } from '@stores/gameStore';
import { NewFriendsModal } from '@components/figma/NewFriendsModal';
import { theme } from '@styles/theme';
import {
  resolveCombatRound,
  generateEnemyDecision,
  createBattleLogEntry,
  checkCombatEnd,
} from '@utils/combat/newCombatMechanics';
import { CombatType, CombatActionType, CombatDecision } from '@type/combat';

type ActionView = 'primary' | 'secondary';
type PrimaryAction = 'Body' | 'Mind' | 'Heart' | 'Item' | 'Flee';

interface CombatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When true, renders content without Dialog wrapper (for use inside other modals) */
  bare?: boolean;
}

const actionColors: Record<PrimaryAction, string> = {
  Body: '#f87171', // red-400
  Mind: '#06b6d4', // cyan-500
  Heart: '#4ade80', // green-400
  Item: '#ffffff',
  Flee: '#ffffff',
};

// Styled Components
const CombatContainer = styled.div<{ backgroundImage?: string }>`
  position: relative;
  min-height: 600px;
  background: ${props => props.backgroundImage
    ? `url(${props.backgroundImage}) center/cover no-repeat, #000`
    : '#000'};
  color: #fff;
`;

const RoundIndicator = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
`;

const RoundInfo = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.text.muted};
  text-align: center;
  border-top: 1px solid ${theme.colors.border.secondary};
  border-bottom: 1px solid ${theme.colors.border.secondary};
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const FriendshipInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FriendshipCount = styled.span`
  color: #4ade80; // green-400
`;

const LogButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${theme.colors.background.secondary};
  }
`;

const CombatantCard = styled.div<{ position: 'enemy' | 'player' }>`
  position: absolute;
  width: 13rem;
  background: #000;
  border: 2px solid ${props => props.position === 'enemy' ? '#fff' : '#dc2626'};
  padding: 0.75rem;

  ${props => props.position === 'enemy' ? `
    top: 5rem;
    left: 1rem;
  ` : `
    bottom: 8rem;
    right: 1rem;
  `}
`;

const CombatantName = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const StatBar = styled.div`
  position: relative;
  height: 0.75rem;
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.secondary};
  margin-bottom: 0.25rem;
`;

const StatBarFill = styled.div<{ percent: number; color: string }>`
  position: absolute;
  inset: 0;
  background: ${props => props.color};
  width: ${props => props.percent}%;
`;

const StatBarText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`;

const CurrentValue = styled.span<{ color: string }>`
  color: ${props => props.color};
`;

const MaxValue = styled.span`
  color: #fff;
  margin-left: 0.25rem;
`;

const LevelDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.75rem;
  margin-top: 0.25rem;

  div {
    text-align: center;
  }
`;

// TODO: I think its container is white so it looks really weird (Player's as well)
const CharacterImage = styled.div<{ position: 'enemy' | 'player', src: string }>`
  position: absolute;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 6rem;
  height: 6rem;
  object-fit: cover;

  ${props => props.position === 'enemy' ? `
    top: 6rem;
    right: 2rem;
    font-size: 6rem;
  ` : `
    bottom: 11rem;
    left: 2rem;
  `}
`;

const PlayerPortrait = styled.img`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border: 2px solid #22d3ee; // cyan-400
  object-fit: cover;
`;

const PlayerEmoji = styled.div`
  font-size: 4.5rem;
`;

const ActionButtonsContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
`;

const StyledActionButton = styled.button<{ borderColor: string }>`
  background: linear-gradient(to bottom, ${theme.colors.background.secondary}, #111);
  border: 2px solid ${props => props.borderColor};
  border-radius: ${theme.borderRadius.md};
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionIconContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ActionLabel = styled.div`
  font-size: 0.75rem;
  color: #22d3ee; // cyan-400
`;

const BattleLogOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const BattleLogModal = styled.div`
  background: #000;
  border: 2px solid #fff;
  width: 100%;
  max-width: 32rem;
  max-height: 500px;
  display: flex;
  flex-direction: column;
`;

const BattleLogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid ${theme.colors.border.secondary};
  flex-shrink: 0;
`;

const CloseLogButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: ${theme.colors.background.secondary};
  }
`;

const BattleLogContent = styled(ScrollArea)`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
`;

const BattleLogEntries = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BattleLogEntry = styled.div`
  border: 1px solid ${theme.colors.border.secondary};
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RoundTitle = styled.div`
  color: #22d3ee; // cyan-400
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const LogText = styled.div<{ color?: string }>`
  font-size: 0.75rem;
  color: ${props => props.color || theme.colors.text.secondary};
  word-wrap: break-word;
`;

const CapitalizeText = styled.span`
  text-transform: capitalize;
`;

const EmptyLogMessage = styled.div`
  color: ${theme.colors.text.muted};
  font-size: 0.875rem;
  text-align: center;
`;

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

  // Get current location for background
  // TODO: Enhance this and take out of file
  const getMapImage = (curLoc: string) => {
    switch (curLoc) {
      case 'fishing_town':
        return '/combat-backgrounds/forest.png'
      default:
        return '/combat-backgrounds/forest.png'
    }
  }
  console.log('🔍 Game State:', gameState.currentLocation);
  const backgroundImage = getMapImage(gameState.currentLocation);

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
      phase: 'choosing_aspect',
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

  const secondaryBorderColor = selectedPrimaryAction ? actionColors[selectedPrimaryAction] : actionColors.Mind;

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
    <CombatContainer {...(backgroundImage ? { backgroundImage } : {})}>
      {/* Round indicator and Battle Log */}
      <RoundIndicator>
        <RoundInfo>
          <span>Round {round}</span>
          <FriendshipInfo>
            <span>Friendship:</span>
            <FriendshipCount>{friendshipCounter}/3</FriendshipCount>
            <span>{'❤️'.repeat(friendshipCounter)}</span>
          </FriendshipInfo>
          <LogButton onClick={() => setIsLogOpen(true)}>
            <BookOpen className="w-3 h-3" />
          </LogButton>
        </RoundInfo>
      </RoundIndicator>

      {/* Enemy Card */}
      <CombatantCard position="enemy">
        <CombatantName>{enemy.name}</CombatantName>
        {/* HP bar */}
        <StatBar>
          <StatBarFill percent={enemyHPPercent} color="#dc2626" />
          <StatBarText>
            <CurrentValue color="#eab308">{enemy.health}</CurrentValue>
            <MaxValue>/ {enemy.maxHealth}</MaxValue>
          </StatBarText>
        </StatBar>
        {/* MP bar */}
        <StatBar>
          <StatBarFill percent={enemyMPPercent} color="#2563eb" />
          <StatBarText>
            <CurrentValue color="#67e8f9">{enemy.mana}</CurrentValue>
            <MaxValue>/ {enemy.maxMana}</MaxValue>
          </StatBarText>
        </StatBar>
        <LevelDisplay>
          <div>
            <div>Lv</div>
            <div>{enemy.level}</div>
          </div>
        </LevelDisplay>
      </CombatantCard>

      {/* Enemy Image */}
      <CharacterImage position="enemy" src={enemy.image || ''} />

      {/* Player Card */}
      <CombatantCard position="player">
        <CombatantName>{player.name}</CombatantName>
        {/* Health bar (red) */}
        <StatBar>
          <StatBarFill percent={playerHPPercent} color="#dc2626" />
          <StatBarText>
            <CurrentValue color="#eab308">{player.health}</CurrentValue>
            <MaxValue>/ {player.maxHealth}</MaxValue>
          </StatBarText>
        </StatBar>
        {/* Mana/Energy bar (blue) */}
        <StatBar>
          <StatBarFill percent={playerMPPercent} color="#2563eb" />
          <StatBarText>
            <CurrentValue color="#67e8f9">{player.mana}</CurrentValue>
            <MaxValue>/ {player.maxMana}</MaxValue>
          </StatBarText>
        </StatBar>
        <LevelDisplay>
          <div>
            <div>Lv</div>
            <div>{player.level}</div>
          </div>
        </LevelDisplay>
      </CombatantCard>

      {/* Player Character */}
      <CharacterImage position="player">
        {player.portrait?.imageUrl ? (
          <PlayerPortrait
            src={player.portrait.imageUrl}
            alt={player.name}
          />
        ) : (
          <PlayerEmoji>🧝</PlayerEmoji>
        )}
      </CharacterImage>

      {/* Action Buttons */}
      <ActionButtonsContainer>
        {actionView === 'primary' ? (
          <ActionGrid>
            <ActionButton
              onClick={() => handlePrimaryAction('Body')}
              label="Body"
              icon={<BodyIcon />}
              borderColor={actionColors.Body}
            />
            <ActionButton
              onClick={() => handlePrimaryAction('Mind')}
              label="Mind"
              icon={<MindIcon />}
              borderColor={actionColors.Mind}
            />
            <ActionButton
              onClick={() => handlePrimaryAction('Heart')}
              label="Heart"
              icon={<HeartIcon />}
              borderColor={actionColors.Heart}
            />
            <ActionButton
              onClick={() => handlePrimaryAction('Item')}
              label="Item"
              icon={<ItemIcon />}
              borderColor={actionColors.Item}
            />
            <ActionButton
              onClick={() => handlePrimaryAction('Flee')}
              label="Flee"
              icon={<FleeIcon />}
              borderColor={actionColors.Flee}
            />
          </ActionGrid>
        ) : (
          <ActionGrid>
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
              borderColor={actionColors.Item}
            />
            <div></div>
          </ActionGrid>
        )}
      </ActionButtonsContainer>

      {/* Combat Log Modal */}
      {isLogOpen && (
        <BattleLogOverlay>
          <BattleLogModal>
            <BattleLogHeader>
              <span>Combat Log</span>
              <CloseLogButton onClick={() => setIsLogOpen(false)}>
                <X className="w-4 h-4 text-white" />
              </CloseLogButton>
            </BattleLogHeader>
            <BattleLogContent>
              <BattleLogEntries>
                {battleLog.length === 0 ? (
                  <EmptyLogMessage>No combat rounds yet</EmptyLogMessage>
                ) : (
                  battleLog.map((entry) => (
                    <BattleLogEntry key={entry.round}>
                      <RoundTitle>Round {entry.round}</RoundTitle>

                      {/* Decisions */}
                      <LogText>
                        <span style={{ color: '#4ade80' }}>{`Player: `}</span>
                        <CapitalizeText>{`${entry.playerDecision.type}`}</CapitalizeText>
                        <CapitalizeText>{entry.playerDecision.action}</CapitalizeText>
                      </LogText>
                      <LogText>
                        <span style={{ color: '#f87171' }}>Enemy:</span>{' '}
                        <CapitalizeText>{entry.enemyDecision.type}</CapitalizeText> +{' '}
                        <CapitalizeText>{entry.enemyDecision.action}</CapitalizeText>
                      </LogText>

                      {/* Advantage */}
                      {entry.advantage !== 'none' && (
                        <LogText color="#facc15">
                          Advantage: {entry.advantage === 'player' ? 'Player' : 'Enemy'}
                        </LogText>
                      )}

                      {/* Rolls */}
                      {entry.playerRoll && (
                        <LogText>
                          Player Roll: {entry.playerRoll} ({entry.playerRollDetails})
                        </LogText>
                      )}
                      {entry.enemyRoll && (
                        <LogText>
                          Enemy Roll: {entry.enemyRoll} ({entry.enemyRollDetails})
                        </LogText>
                      )}

                      {/* Damage */}
                      {entry.damageToEnemy > 0 && (
                        <LogText color="#fca5a5">
                          ⚔️ Dealt {entry.damageToEnemy} damage to enemy
                        </LogText>
                      )}
                      {entry.damageToPlayer > 0 && (
                        <LogText color="#fdba74">
                          💥 Took {entry.damageToPlayer} damage
                        </LogText>
                      )}

                      {/* HP After */}
                      <LogText color="#6b7280" style={{ marginTop: '0.25rem' }}>
                        Player HP: {entry.playerHPAfter} | Enemy HP: {entry.enemyHPAfter}
                      </LogText>

                      {/* Result */}
                      <LogText style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                        {entry.result}
                      </LogText>
                    </BattleLogEntry>
                  ))
                )}
              </BattleLogEntries>
            </BattleLogContent>
          </BattleLogModal>
        </BattleLogOverlay>
      )}
    </CombatContainer>
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
    <StyledActionButton onClick={onClick} borderColor={borderColor}>
      <ActionIconContainer>
        {icon}
      </ActionIconContainer>
      <ActionLabel>{label}</ActionLabel>
    </StyledActionButton>
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
