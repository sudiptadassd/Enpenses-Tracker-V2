
export interface Capital {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  color: string;
}

export interface Expense {
  id: string;
  capitalId: string;
  amount: number;
  category: string;
  note: string;
  date: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  EXPENSES = 'EXPENSES',
  CAPITALS = 'CAPITALS'
}
