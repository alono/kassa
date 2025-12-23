export interface User {
  id: number;
  username: string;
  referrerId: number | null;
}

export interface Donation {
  id: number;
  userId: number;
  amount: number;
  createdAt: string;
}

export interface LevelSummary {
  level: number;
  userCount: number;
  totalDonated: number;
}

export interface UserSummary {
  referralLink: string;
  userTotalDonated: number;
  descendantsTotalDonated: number;
  totalDescendants: number;
  levels: LevelSummary[];
}
