import { Dialog, DialogContent } from './Dialog';

interface NewFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enemyName: string;
}

/**
 * Modal shown when friendship counter reaches 3
 * (Both combatants defended 3 times)
 */
export function NewFriendsModal({ open, onOpenChange, enemyName }: NewFriendsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black border-2 border-green-400 text-white">
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Friendship Icon */}
          <div className="text-6xl">🤝</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-green-400">New Friends!</h2>

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-300">
              Through mutual understanding and respect, you and <span className="text-cyan-400">{enemyName}</span> have
              become friends!
            </p>
            <p className="text-sm text-gray-400">
              Sometimes the best victory is finding common ground.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors border-2 border-green-400"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
