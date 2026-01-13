import React, { useState } from 'react';
import { Expense, Capital } from '../types';
import { Trash2, Search, Filter, ReceiptText } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  capitals: Capital[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, capitals, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCap, setFilterCap] = useState('all');

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCap = filterCap === 'all' || e.capitalId === filterCap;
    return matchesSearch && matchesCap;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-main">Transactions</h2>
          <p className="text-muted">Detailed history of all your spendings</p>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <select 
            className="input-field pl-10 pr-10 cursor-pointer appearance-none"
            value={filterCap}
            onChange={(e) => setFilterCap(e.target.value)}
          >
            <option value="all">All Sources</option>
            {capitals.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-[var(--bg-surface-alt)] border-b border-[var(--border)] text-xs font-bold text-muted uppercase tracking-wider">
          <div className="col-span-1">Date</div>
          <div className="col-span-2">Description / Category</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {filteredExpenses.map((exp) => {
            const capital = capitals.find(c => c.id === exp.capitalId);
            return (
              <div key={exp.id} className="px-6 py-4 md:grid md:grid-cols-6 items-center gap-4 hover:bg-[var(--bg-surface-alt)] transition-colors">
                <div className="text-xs md:text-sm text-muted md:col-span-1 mb-1 md:mb-0">
                  {new Date(exp.date).toLocaleDateString()}
                </div>
                
                <div className="md:col-span-2 flex flex-col mb-2 md:mb-0">
                  <span className="font-semibold text-main">{exp.note || 'Untitled Expense'}</span>
                  <span className="text-xs bg-[var(--bg-surface-alt)] text-muted w-fit px-2 py-0.5 rounded-full mt-1">
                    {exp.category}
                  </span>
                </div>

                <div className="md:col-span-1 mb-2 md:mb-0">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded-lg border inline-flex items-center gap-1"
                    style={{ borderColor: capital?.color + '40', color: capital?.color, backgroundColor: capital?.color + '15' }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: capital?.color }}></div>
                    {capital?.name || 'Unknown'}
                  </span>
                </div>

                <div className="text-lg md:text-sm font-bold text-danger md:text-right md:col-span-1 flex items-center justify-between md:block">
                  <span className="md:hidden text-xs text-muted font-normal uppercase">Amount</span>
                  -${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>

                <div className="md:col-span-1 text-right flex justify-end">
                  <button 
                    onClick={() => onDelete(exp.id)}
                    className="p-2 text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredExpenses.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-muted mb-2 flex justify-center opacity-50">
                <ReceiptText size={48} />
              </div>
              <p className="text-muted">No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;