import React, { useMemo } from 'react';
import { Capital, Expense } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, ArrowDownRight, DollarSign } from 'lucide-react';

interface DashboardProps {
  capitals: Capital[];
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ capitals, expenses }) => {
  const totalBalance = useMemo(() => capitals.reduce((sum, c) => sum + c.currentBalance, 0), [capitals]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Get current CSS variables for chart styling
  const getCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-main">Financial Overview</h2>
        <p className="text-muted">Track your assets and spending habits</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-medium bg-white/10 px-2 py-1 rounded">Total Net Worth</span>
          </div>
          <div className="text-3xl font-bold mb-1">${totalBalance.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-indigo-100 text-sm">
            <TrendingUp size={16} />
            <span>Across {capitals.length} sources</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
              <ArrowDownRight size={24} />
            </div>
            <span className="text-sm font-medium text-muted">Total Spent</span>
          </div>
          <div className="text-3xl font-bold text-main mb-1">${totalExpenses.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-muted text-sm">
            <span>{expenses.length} Total transactions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="font-semibold text-main mb-6">Spending by Category</h3>
          <div className="h-[250px] w-full">
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: 'var(--shadow-lg)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-main)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted italic">
                No expense data yet
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-main mb-6">Capital Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capitals}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-surface-alt)' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: 'var(--shadow-lg)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-main)'
                  }}
                />
                <Bar dataKey="currentBalance" radius={[6, 6, 0, 0]}>
                  {capitals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
          <h3 className="font-semibold text-main">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {expenses.slice(0, 5).map(exp => (
            <div key={exp.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-surface-alt)] transition-colors">
              <div>
                <div className="font-medium text-main">{exp.note || exp.category}</div>
                <div className="text-xs text-muted">{new Date(exp.date).toLocaleDateString()} • {capitals.find(c => c.id === exp.capitalId)?.name}</div>
              </div>
              <div className="text-danger font-bold">-${exp.amount.toLocaleString()}</div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="px-6 py-10 text-center text-muted">No recent transactions.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;