import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import type { TreeNode } from '../../types/index.ts';

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

interface NetworkTreeViewProps {
  tree: TreeNode;
  username: string;
}

export const NetworkTreeView: React.FC<NetworkTreeViewProps> = ({ tree, username }) => {
  return (
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
              <p className="font-black text-indigo-900 tracking-tight">{username.toUpperCase()}</p>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Growth Root</p>
            </div>
          </div>
        </div>
        {tree.children.length > 0 ? (
          <div>
            {tree.children.map((child, idx) => (
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
  );
};
