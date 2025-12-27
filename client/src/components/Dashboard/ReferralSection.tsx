import React from 'react';
import { Share2 } from 'lucide-react';

interface ReferralSectionProps {
  username: string;
  onCopyLink: () => void;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ username, onCopyLink }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
        <Share2 size={120} />
      </div>
      <h2 className="text-xl font-bold mb-2 relative z-10">Spread the Word!</h2>
      <p className="text-indigo-100 mb-6 relative z-10">Invite friends to join and multiply your impact across generations.</p>
      <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between gap-4 border border-white/20 relative z-10 backdrop-blur-sm">
        <code className="text-sm truncate font-mono">.../login?ref={username}</code>
        <button
          onClick={onCopyLink}
          className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors shrink-0 shadow-lg"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};
