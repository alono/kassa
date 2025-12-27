import React from 'react';
import { Users } from 'lucide-react';
import type { LevelSummary } from '../../types/index.ts';

interface SummaryViewProps {
  levels: LevelSummary[];
}

export const SummaryView: React.FC<SummaryViewProps> = ({ levels }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        Level Breakdown
        <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-md">BFS TRAVERSAL</span>
      </h2>
      {levels.length > 0 ? (
        <div className="space-y-4">
          {levels.map((lvl) => (
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
  );
};
