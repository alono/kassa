import { Request, Response } from 'express';
import { getDb } from '../models/schema.js';
import { UserSummary, LevelSummary, TreeNode } from '../types/index.js';

export const getSummary = async (req: Request, res: Response) => {
  const { username } = req.params;
  const db = await getDb();

  const user = await db.get('SELECT id, username FROM users WHERE username = ?', [username]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's own total donations
  const userDonationRes = await db.get('SELECT SUM(amount) as total FROM donations WHERE user_id = ?', [user.id]);
  const userTotalDonated = userDonationRes?.total || 0;

  // BFS approach to find all descendants by level
  let levels: LevelSummary[] = [];
  let currentLevelUserIds = [user.id];
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
      children.map((child: any) => buildTree(child.id, child.username))
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
};
