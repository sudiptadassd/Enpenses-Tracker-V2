import React, { useState } from 'react';
import { Capital } from '../types';
import { Plus, Wallet, ShieldCheck, Trash2, X } from 'lucide-react';

interface CapitalManagerProps {
  capitals: Capital[];
  onAdd: (name: string, balance: number, color: string) => void;
  onDelete: (id: string) => void;
}

const CapitalManager: React.FC<CapitalManagerProps> = ({ capitals, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newBalance) {
      onAdd(newName, parseFloat(newBalance), newColor);
      setNewName('');
      setNewBalance('');
      setNewColor('#6366f1');
      setIsAdding(false);
    }
  };

  const confirmDelete = (cap: Capital) => {
    if (window.confirm(`Are you sure you want to delete "${cap.name}"? All associated transactions will also be deleted.`)) {
      onDelete(cap.id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-main">Capital Sources</h2>
          <p className="text-muted">Manage where your money comes from</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="btn btn-primary"
          >
            <Plus size={20} /> New Source
          </button>
        )}
      </header>

      {isAdding && (
        <div className="card p-6 border-2 border-[var(--primary)] animate-in zoom-in-95 relative">
          <button 
            onClick={() => setIsAdding(false)}
            className="absolute top-4 right-4 text-muted hover:text-main"
          >
            <X size={20} />
          </button>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-main">Add New Capital</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="input-label">Source Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="input-field"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="input-label">Initial Balance ($)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  className="input-field"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="input-label">Color</label>
                <input 
                  type="color" 
                  className="h-[46px] w-full p-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg cursor-pointer"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full btn btn-primary"
            >
              Create Source
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capitals.map((cap) => (
          <div key={cap.id} className="card p-6 relative group">
            <div className="flex justify-between items-start mb-4">
              <div 
                className="p-3 rounded-xl text-white shadow-lg"
                style={{ backgroundColor: cap.color }}
              >
                <Wallet size={24} />
              </div>
              <button 
                onClick={() => confirmDelete(cap)}
                className="p-2 text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="font-bold text-xl text-main">{cap.name}</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Balance</span>
                <span className="font-bold text-main">${cap.currentBalance.toLocaleString()}</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-alt)] h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (cap.currentBalance / cap.initialBalance) * 100))}%`,
                    backgroundColor: cap.color 
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-muted">
                <span>Initial: ${cap.initialBalance.toLocaleString()}</span>
                <span>{((cap.currentBalance / cap.initialBalance) * 100).toFixed(0)}% Left</span>
              </div>
            </div>

            {cap.currentBalance < cap.initialBalance * 0.2 && (
              <div className="mt-4 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-xs font-medium">
                <ShieldCheck size={14} /> Low funds alert
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapitalManager;