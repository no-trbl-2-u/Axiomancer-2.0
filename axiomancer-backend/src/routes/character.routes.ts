import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// Save character state
router.post('/save', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const characterState = req.body;

    // Validate required fields
    if (!characterState.character || !characterState.currentLocation) {
      res.status(400).json({ error: 'Missing required character state data' });
      return;
    }

    await DatabaseService.saveCharacterState(userId, characterState);

    res.status(200).json({
      message: 'Character state saved successfully',
      savedAt: Date.now()
    });
  } catch (error) {
    console.error('Error saving character state:', error);
    res.status(500).json({ error: 'Failed to save character state' });
  }
});

// Load character state
router.get('/load', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const characterState = await DatabaseService.getCharacterState(userId);

    if (!characterState) {
      res.status(404).json({ error: 'No character state found' });
      return;
    }

    res.status(200).json(characterState);
  } catch (error) {
    console.error('Error loading character state:', error);
    res.status(500).json({ error: 'Failed to load character state' });
  }
});

// Check if character exists
router.get('/exists', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const characterState = await DatabaseService.getCharacterState(userId);

    res.status(200).json({
      exists: !!characterState,
      characterName: characterState?.character?.name || null
    });
  } catch (error) {
    console.error('Error checking character existence:', error);
    res.status(500).json({ error: 'Failed to check character existence' });
  }
});

// Delete character state
router.delete('/delete', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    await DatabaseService.deleteCharacterState(userId);

    res.status(200).json({ message: 'Character state deleted successfully' });
  } catch (error) {
    console.error('Error deleting character state:', error);
    res.status(500).json({ error: 'Failed to delete character state' });
  }
});

export { router as characterRoutes };