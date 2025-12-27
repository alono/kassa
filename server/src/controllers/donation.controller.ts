import { Request, Response } from 'express';
import { getDb } from '../models/schema.js';
import { logger } from '../utils/logger.js';

export const createDonation = async (req: Request, res: Response) => {
  const { username, amount } = req.body;

  if (!username || !amount || isNaN(amount) || amount <= 0) {
    logger.warn({ username, amount }, 'Invalid donation attempt');
    return res.status(400).json({ error: 'Valid username and amount are required' });
  }

  try {
    const db = await getDb();
    const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);

    if (!user) {
      logger.warn(`Donation attempt for non-existent user: ${username}`);
      return res.status(404).json({ error: 'User not found' });
    }

    await db.run('INSERT INTO donations (user_id, amount) VALUES (?, ?)', [user.id, amount]);
    logger.info(`Donation recorded: $${amount} from ${username}`);
    res.json({ message: 'Donation recorded successfully' });
  } catch (error) {
    logger.error({ error, amount }, `Error recording donation for ${username}:`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
