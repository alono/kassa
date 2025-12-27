import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { DollarSign, Users, TrendingUp, LayoutList, GitBranch } from 'lucide-react';
import type { UserSummary } from '../types/index.ts';
import { Header } from '../components/Dashboard/Header.tsx';
import { StatCard } from '../components/Dashboard/StatCard.tsx';
import { DonationForm } from '../components/Dashboard/DonationForm.tsx';
import { ReferralSection } from '../components/Dashboard/ReferralSection.tsx';
import { SummaryView } from '../components/Dashboard/SummaryView.tsx';
import { NetworkTreeView } from '../components/Dashboard/NetworkTreeView.tsx';

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
      <Header username={user?.username || ''} onLogout={logout} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          label="Your Donations"
          value={`$${summary.userTotalDonated.toLocaleString()}`}
          iconBgColor="bg-blue-50"
          iconTextColor="text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Total Descendants"
          value={summary.totalDescendants}
          iconBgColor="bg-indigo-50"
          iconTextColor="text-indigo-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Network Impact"
          value={`$${summary.descendantsTotalDonated.toLocaleString()}`}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions */}
        <div className="space-y-6 lg:col-span-1">
          <DonationForm
            amount={donationAmount}
            onAmountChange={setDonationAmount}
            onSubmit={handleDonate}
            message={message}
          />
          <ReferralSection
            username={user?.username || ''}
            onCopyLink={copyReferralLink}
          />
        </div>

        {/* Right Column: Network Breakdown with Tabs */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-grow">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${activeTab === 'summary'
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <LayoutList size={18} /> Summary View
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${activeTab === 'tree'
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
                <SummaryView levels={summary.levels} />
              ) : (
                <NetworkTreeView tree={summary.tree} username={user?.username || ''} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
