import { Request, Response } from 'express';
import { getDb } from '../models/schema.js';

export const createDonation = async (req: Request, res: Response) => {
  const { username, amount } = req.body;

  if (!username || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valid username and amount are required' });
  }

  const db = await getDb();
  const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await db.run('INSERT INTO donations (user_id, amount) VALUES (?, ?)', [user.id, amount]);
  res.json({ message: 'Donation recorded successfully' });
};
