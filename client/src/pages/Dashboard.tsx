import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Share2, DollarSign, Users, TrendingUp } from 'lucide-react';

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
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('');

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
          <p className="text-gray-500">Your fundraising dashboard</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Your Donations</p>
            <p className="text-2xl font-bold text-gray-900">${summary.userTotalDonated.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Descendants</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalDescendants}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Network Impact</p>
            <p className="text-2xl font-bold text-gray-900">${summary.descendantsTotalDonated.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation and Sharing Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Make a Donation</h2>
            <form onSubmit={handleDonate} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-100"
              >
                Donate Now
              </button>
              {message && <p className="text-center text-sm font-medium text-green-600">{message}</p>}
            </form>
          </div>

          <div className="bg-blue-600 p-8 rounded-2xl shadow-xl text-white">
            <h2 className="text-xl font-bold mb-2">Spread the Word!</h2>
            <p className="text-blue-100 mb-6">Invite friends to join and increase your network impact.</p>
            <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between gap-4 border border-white/20">
              <code className="text-sm truncate">.../login?ref={user?.username}</code>
              <button
                onClick={copyReferralLink}
                className="p-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Multi-level Summary Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Network Breakdown</h2>
          {summary.levels.length > 0 ? (
            <div className="space-y-4">
              {summary.levels.map((lvl) => (
                <div key={lvl.level} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-blue-600 font-bold text-sm shadow-sm">
                      L{lvl.level}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{lvl.userCount} {lvl.userCount === 1 ? 'User' : 'Users'}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Level {lvl.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${lvl.totalDonated.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Donated</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No referrals yet. Share your link to start building your network!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
