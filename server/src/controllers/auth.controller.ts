import { Request, Response } from 'express';
import { getDb } from '../models/schema.js';
import { logger } from '../utils/logger.js';

export const login = async (req: Request, res: Response) => {
  const { username, referrerUsername } = req.body;

  if (!username) {
    logger.warn('Login attempt with missing username');
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const db = await getDb();
    let user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      logger.info({ referrerUsername }, `Creating new user: ${username}`);
      let referrerId: number | null = null;
      if (referrerUsername) {
        const referrer = await db.get('SELECT id FROM users WHERE username = ?', [referrerUsername]);
        if (referrer) {
          referrerId = referrer.id;
        } else {
          logger.warn(`Referrer not found: ${referrerUsername} for user: ${username}`);
        }
      }
      const result = await db.run('INSERT INTO users (username, referrer_id) VALUES (?, ?)', [username, referrerId]);
      user = { id: result.lastID, username, referrer_id: referrerId };
    } else {
      logger.info(`User logged in: ${username}`);
    }

    res.json({ id: user.id, username: user.username });
  } catch (error) {
    logger.error({ error }, `Login error for ${username}:`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
