export interface TreeNode {
  username: string;
  totalDonated: number;
  children: TreeNode[];
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
  tree: TreeNode;
}
