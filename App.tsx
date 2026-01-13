import React, { useState, useEffect } from 'react';
import { View, Capital, Expense } from './types';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import CapitalManager from './components/CapitalManager';
import AddExpenseModal from './components/AddExpenseModal';
import { 
  LayoutDashboard, 
  Wallet, 
  ReceiptText, 
  PlusCircle, 
  Settings, 
  Sun, 
  Moon, 
  Trash2, 
  User, 
  ChevronRight,
  X,
  PlusSquare,
  Calendar,
  Mail,
  Shield
} from 'lucide-react';

const STORAGE_KEY_CAPITALS = 'captrack_capitals';
const STORAGE_KEY_EXPENSES = 'captrack_expenses';
const STORAGE_KEY_THEME = 'captrack_theme';

const INITIAL_CAPITALS: Capital[] = [
  { id: '1', name: 'Cash', initialBalance: 1000, currentBalance: 1000, color: '#10b981' },
  { id: '2', name: 'Bank Account', initialBalance: 5000, currentBalance: 5000, color: '#3b82f6' }
];

const App: React.FC = () => {
  const [view, setView] = useState<View | 'MORE' | 'ADD_VIEW'>(View.DASHBOARD);
  const [capitals, setCapitals] = useState<Capital[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedCapitals = localStorage.getItem(STORAGE_KEY_CAPITALS);
    const savedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    
    if (savedCapitals) setCapitals(JSON.parse(savedCapitals));
    else setCapitals(INITIAL_CAPITALS);

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    
    const initialDark = savedTheme === 'dark';
    setIsDarkMode(initialDark);
    if (initialDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem(STORAGE_KEY_THEME, newMode ? 'dark' : 'light');
    if (newMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CAPITALS, JSON.stringify(capitals));
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [capitals, expenses]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    const newExpenses = [newExpense, ...expenses];
    setExpenses(newExpenses);
    
    const updatedCapitals = capitals.map(cap => {
      const capExpenses = newExpenses
        .filter(e => e.capitalId === cap.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return { ...cap, currentBalance: cap.initialBalance - capExpenses };
    });
    setCapitals(updatedCapitals);
    setView(View.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="nav-sidebar hidden md:flex flex-col fixed left-0 top-0 h-full w-64 p-6 z-10">
        <div className="flex items-center gap-3 mb-10 text-primary">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-main">CapTrack</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: View.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
            { id: View.EXPENSES, icon: ReceiptText, label: 'Transactions' },
            { id: View.CAPITALS, icon: Wallet, label: 'Capitals' },
            { id: 'MORE', icon: Settings, label: 'Settings' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === item.id ? 'btn-primary font-semibold' : 'text-muted hover:bg-[var(--bg-surface-alt)]'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-alt)] flex items-center justify-center">
              <User size={20} className="text-muted" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-main truncate">John Doe</div>
              <div className="text-[10px] text-muted truncate uppercase tracking-wide">Pro Member</div>
            </div>
          </div>
          <button onClick={() => setView('ADD_VIEW')} className="btn-primary w-full">
            <PlusCircle size={20} /> Add Expense
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="nav-mobile md:hidden flex items-center justify-between px-6 py-4 sticky top-0 z-20 shadow-sm border-b-0">
        <h1 className="text-lg font-bold text-main">CapTrack Pro</h1>
        <button onClick={toggleTheme} className="btn-icon">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {view === View.DASHBOARD && <Dashboard capitals={capitals} expenses={expenses} />}
        {view === View.EXPENSES && <ExpenseList expenses={expenses} capitals={capitals} onDelete={(id) => setExpenses(prev => prev.filter(e => e.id !== id))} />}
        {view === View.CAPITALS && <CapitalManager capitals={capitals} onAdd={(n, b, c) => setCapitals([...capitals, { id: Date.now().toString(), name: n, initialBalance: b, currentBalance: b, color: c }])} onDelete={(id) => setCapitals(prev => prev.filter(c => c.id !== id))} />}
        
        {view === 'ADD_VIEW' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <header className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-main">New Transaction</h2>
                  <p className="text-muted">Record spending from your capital</p>
                </div>
                <button onClick={() => setView(View.DASHBOARD)} className="btn-icon">
                  <X size={20} />
                </button>
             </header>
             <div className="max-w-2xl mx-auto">
               <AddExpenseModal capitals={capitals} onClose={() => setView(View.DASHBOARD)} onAdd={handleAddExpense} inline />
             </div>
          </div>
        )}

        {view === 'MORE' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <header>
              <h2 className="text-2xl font-bold text-main">Profile & Settings</h2>
              <p className="text-muted">Personal details and preferences</p>
            </header>

            {/* Profile Section */}
            <div className="card p-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border-4 border-[var(--bg-surface)] shadow-md">
                  <User size={40} />
                </div>
                <div className="absolute bottom-1 right-1 bg-[var(--success)] p-1.5 rounded-full border-2 border-[var(--bg-surface)] shadow-sm">
                  <Shield size={12} className="text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h3 className="text-2xl font-bold text-main">John Doe</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center sm:justify-start">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted">
                    <Mail size={16} />
                    <span className="text-sm">john.doe@example.com</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted">
                    <Calendar size={16} />
                    <span className="text-sm">Joined January 2024</span>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    Tier: Premium User
                  </span>
                </div>
              </div>
            </div>

            {/* Capital Balances List */}
            <div className="card">
              <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-main">Asset Portfolio</h3>
                <span className="text-xs font-semibold text-muted bg-[var(--bg-surface-alt)] px-2 py-1 rounded">Live Balances</span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {capitals.map((cap) => (
                  <div key={cap.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-surface-alt)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cap.color }}></div>
                      <span className="font-medium text-main">{cap.name}</span>
                    </div>
                    <span className="font-bold text-main">
                      ₹{cap.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                {capitals.length === 0 && (
                  <div className="px-6 py-8 text-center text-muted italic">No capitals configured.</div>
                )}
              </div>
              <div className="px-6 py-4 bg-[var(--bg-surface-alt)]/50 rounded-b-xl flex justify-between items-center">
                <span className="text-sm font-semibold text-muted">Total Net Value</span>
                <span className="text-lg font-black text-primary">
                  ₹{capitals.reduce((sum, c) => sum + c.currentBalance, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="card p-2 space-y-1">
              <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-surface-alt)] transition-all text-main">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[var(--bg-surface-alt)] text-primary rounded-xl">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Display Theme</div>
                    <div className="text-xs text-muted">{isDarkMode ? 'Dark' : 'Light'} Mode</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted" />
              </button>
              
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl">
                    <Trash2 size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Reset App</div>
                    <div className="text-xs opacity-70">Wipe all local data</div>
                  </div>
                </div>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="nav-mobile md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-20 px-2 shadow-lg">
        {[
          { id: View.DASHBOARD, icon: LayoutDashboard, label: 'Home' },
          { id: View.EXPENSES, icon: ReceiptText, label: 'History' },
          { id: 'ADD_VIEW', icon: PlusSquare, label: 'Add' },
          { id: View.CAPITALS, icon: Wallet, label: 'Capitals' },
          { id: 'MORE', icon: Settings, label: 'More' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id as any)} 
            className={`flex flex-col items-center gap-1 flex-1 ${view === item.id ? 'text-primary' : 'text-muted'}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;