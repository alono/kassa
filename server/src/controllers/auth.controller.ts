import { Request, Response } from 'express';
import { getDb } from '../models/schema.js';

export const login = async (req: Request, res: Response) => {
  const { username, referrerUsername } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const db = await getDb();

  let user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (!user) {
    let referrerId: number | null = null;
    if (referrerUsername) {
      const referrer = await db.get('SELECT id FROM users WHERE username = ?', [referrerUsername]);
      if (referrer) {
        referrerId = referrer.id;
      }
    }
    const result = await db.run('INSERT INTO users (username, referrer_id) VALUES (?, ?)', [username, referrerId]);
    user = { id: result.lastID, username, referrer_id: referrerId };
  }

  res.json({ id: user.id, username: user.username });
};
