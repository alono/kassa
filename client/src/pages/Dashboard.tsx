import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Share2, DollarSign, Users, TrendingUp, LayoutList, GitBranch } from 'lucide-react';

interface TreeNode {
  username: string;
  totalDonated: number;
  children: TreeNode[];
}

interface LevelSummary {
  level: number;
  userCount: number;
  totalDonated: number;
}

interface UserSummary {
  referralLink: string;
  userTotalDonated: number;
  descendantsTotalDonated: number;
  totalDescendants: number;
  levels: LevelSummary[];
  tree: TreeNode;
}

const TreeItem: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Open first couple levels by default

  return (
    <div className="ml-4 border-l-2 border-gray-100 pl-4 py-2">
      <div
        className="group flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
          {node.username[0].toUpperCase()}
        </div>
        <div className="flex-grow">
          <p className="font-bold text-gray-900 flex items-center gap-2">
            {node.username}
            {node.children.length > 0 && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-normal">
                {node.children.length} {node.children.length === 1 ? 'ref' : 'refs'}
              </span>
            )}
          </p>
          <p className="text-xs text-blue-600 font-medium">${node.totalDonated.toLocaleString()} donated</p>
        </div>
        {node.children.length > 0 && (
          <div className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
            ▶
          </div>
        )}
      </div>
      {isOpen && node.children.length > 0 && (
        <div className="mt-1">
          {node.children.map((child, idx) => (
            <TreeItem key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'tree'>('summary');

  const fetchSummary = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/users/summary/${user.username}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary');
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || isNaN(Number(donationAmount))) return;

    try {
      const res = await fetch('http://localhost:3001/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user?.username, amount: Number(donationAmount) }),
      });
      if (res.ok) {
        setMessage('Thank you for your donation!');
        setDonationAmount('');
        fetchSummary();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Donation failed. Please try again.');
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/login?ref=${user?.username}`;
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  if (!summary) return <div className="p-8 text-center text-gray-600">Loading your profile...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
          <p className="text-gray-500">Your fundraising dashboard</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-transparent hover:border-red-100"
        >
          <LogOut size={20} /> Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Your Donations</p>
            <p className="text-2xl font-bold text-gray-900">${summary.userTotalDonated.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Descendants</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalDescendants}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Network Impact</p>
            <p className="text-2xl font-bold text-gray-900">${summary.descendantsTotalDonated.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Make a Impact</h2>
            <form onSubmit={handleDonate} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-100 active:scale-95"
              >
                Donate Now
              </button>
              {message && <p className="text-center text-sm font-medium text-emerald-600 animate-pulse">{message}</p>}
            </form>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <Share2 size={120} />
            </div>
            <h2 className="text-xl font-bold mb-2 relative z-10">Spread the Word!</h2>
            <p className="text-indigo-100 mb-6 relative z-10">Invite friends to join and multiply your impact across generations.</p>
            <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between gap-4 border border-white/20 relative z-10 backdrop-blur-sm">
              <code className="text-sm truncate font-mono">.../login?ref={user?.username}</code>
              <button
                onClick={copyReferralLink}
                className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-blue-50 transition-colors shrink-0 shadow-lg"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Network Breakdown with Tabs */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-grow">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'summary'
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <LayoutList size={18} /> Summary View
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'tree'
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <GitBranch size={18} /> Network Tree
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8 flex-grow">
              {activeTab === 'summary' ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Level Breakdown
                    <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-md">BFS TRAVERSAL</span>
                  </h2>
                  {summary.levels.length > 0 ? (
                    <div className="space-y-4">
                      {summary.levels.map((lvl) => (
                        <div key={lvl.level} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-white border border-indigo-100 rounded-full text-indigo-600 font-bold text-sm shadow-sm">
                              L{lvl.level}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{lvl.userCount} {lvl.userCount === 1 ? 'User' : 'Users'}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Generation {lvl.level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">${lvl.totalDonated.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Donated</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100">
                      <Users size={64} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium">No referrals yet. Share your link to grow your network!</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Network Topology
                    <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-md">INTERACTIVE TREE</span>
                  </h2>
                  <div className="max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="bg-indigo-50/30 rounded-xl p-4 mb-4 border border-indigo-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">
                          You
                        </div>
                        <div>
                          <p className="font-black text-indigo-900 tracking-tight">{user?.username.toUpperCase()}</p>
                          <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Growth Root</p>
                        </div>
                      </div>
                    </div>
                    {summary.tree.children.length > 0 ? (
                      <div>
                        {summary.tree.children.map((child, idx) => (
                          <TreeItem key={idx} node={child} level={1} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100">
                        <GitBranch size={64} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">Your network tree is empty. Start referring to see branches!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
