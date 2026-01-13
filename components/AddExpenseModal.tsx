import React, { useState } from 'react';
import { Capital, Expense } from '../types';
import { X, Calendar, Tag, CreditCard, ChevronDown } from 'lucide-react';

interface AddExpenseModalProps {
  capitals: Capital[];
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  inline?: boolean;
}

const CATEGORIES = [
  'Food & Dining', 
  'Transportation', 
  'Shopping', 
  'Bills & Utilities', 
  'Entertainment', 
  'Health', 
  'Other'
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ capitals, onClose, onAdd, inline = false }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [capitalId, setCapitalId] = useState(capitals[0]?.id || '');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !capitalId) return;

    onAdd({
      amount: parseFloat(amount),
      category,
      capitalId,
      note,
      date
    });
  };

  const content = (
    <div className={`${inline ? '' : 'card w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300'}`}>
      {!inline && (
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-xl font-bold text-main">New Transaction</h3>
          <button onClick={onClose} className="btn-icon">
            <X size={24} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`${inline ? 'space-y-6' : 'p-6 space-y-5'}`}>
        <div className="text-center py-8 bg-[var(--bg-surface-alt)] rounded-3xl border border-[var(--border)] shadow-inner">
          <label className="block input-label mb-2">Transaction Amount</label>
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold text-muted mr-2">$</span>
            <input 
              autoFocus
              required
              type="number" 
              step="0.01"
              placeholder="0.00"
              className="w-48 bg-transparent text-5xl font-black text-main outline-none placeholder:text-muted/20"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 input-label ml-1">
              <Tag size={12} /> Category
            </label>
            <div className="relative">
              <select 
                className="input-field py-4 rounded-2xl appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 input-label ml-1">
              <CreditCard size={12} /> Source
            </label>
            <div className="relative">
              <select 
                className="input-field py-4 rounded-2xl appearance-none"
                value={capitalId}
                onChange={(e) => setCapitalId(e.target.value)}
              >
                {capitals.map(cap => (
                  <option key={cap.id} value={cap.id}>
                    {cap.name} (${cap.currentBalance.toLocaleString()})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 input-label ml-1">
              <Calendar size={12} /> Date
            </label>
            <input 
              required
              type="date" 
              className="input-field py-4 rounded-2xl"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label ml-1">Note</label>
            <input 
              type="text" 
              placeholder="What was this for?"
              className="input-field py-4 rounded-2xl"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {inline && (
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 btn bg-[var(--bg-surface-alt)] text-muted hover:text-main"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit"
            className="flex-[2] btn btn-primary py-4 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            Create Transaction
          </button>
        </div>
      </form>
    </div>
  );

  if (inline) return content;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-300">
      {content}
    </div>
  );
};

export default AddExpenseModal;