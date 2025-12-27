import React from 'react';

interface DonationFormProps {
  amount: string;
  onAmountChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  message: string;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  amount,
  onAmountChange,
  onSubmit,
  message
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Make a Impact</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
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
  );
};
