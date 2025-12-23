import express from 'express';
import cors from 'cors';
import { getDb } from './models/schema.js';
import { User, Donation, UserSummary, LevelSummary, TreeNode } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth: Login/Signup by username
app.post('/api/auth/login', async (req, res) => {
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
});

// Donation
app.post('/api/donations', async (req, res) => {
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
});

// Summary
app.get('/api/users/summary/:username', async (req, res) => {
  const { username } = req.params;
  const db = await getDb();

  const user = await db.get('SELECT id, username FROM users WHERE username = ?', [username]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's own total donations
  const userDonationRes = await db.get('SELECT SUM(amount) as total FROM donations WHERE user_id = ?', [user.id]);
  const userTotalDonated = userDonationRes?.total || 0;

  // Calculate descendants recursively
  // For simplicity since it's "local only" and potentially small, we can fetch all users and build the tree or use a recursive query

  // BFS approach to find all descendants by level
  let levels: LevelSummary[] = [];
  let currentLevelUserIds = [user.id];
  let processedUserIds = new Set<number>([user.id]);
  let totalDescendants = 0;
  let descendantsTotalDonated = 0;

  let level = 1;
  while (currentLevelUserIds.length > 0) {
    const nextLevelUsers = await db.all(
      `SELECT id FROM users WHERE referrer_id IN (${currentLevelUserIds.join(',')})`
    );

    if (nextLevelUsers.length === 0) break;

    const nextLevelIds = nextLevelUsers.map((u: any) => u.id);
    const donationRes = await db.get(
      `SELECT SUM(amount) as total FROM donations WHERE user_id IN (${nextLevelIds.join(',')})`
    );

    const levelTotalDonated = donationRes?.total || 0;

    levels.push({
      level,
      userCount: nextLevelIds.length,
      totalDonated: levelTotalDonated
    });

    totalDescendants += nextLevelIds.length;
    descendantsTotalDonated += levelTotalDonated;

    currentLevelUserIds = nextLevelIds;
    level++;
  }

  // Build tree recursively
  async function buildTree(userId: number, username: string): Promise<TreeNode> {
    const userDonations = await db.get('SELECT SUM(amount) as total FROM donations WHERE user_id = ?', [userId]);
    const children = await db.all('SELECT id, username FROM users WHERE referrer_id = ?', [userId]);

    const childNodes = await Promise.all(
      children.map(child => buildTree(child.id, child.username))
    );

    return {
      username,
      totalDonated: userDonations?.total || 0,
      children: childNodes
    };
  }

  const tree = await buildTree(user.id, user.username);

  const summary: UserSummary = {
    referralLink: `${username}`,
    userTotalDonated,
    descendantsTotalDonated,
    totalDescendants,
    levels,
    tree
  };

  res.json(summary);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
