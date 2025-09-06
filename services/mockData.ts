import { Transaction, Category } from '../store/slices/transactionsSlice';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 25.50,
    description: 'Lunch at McDonald\'s',
    category: '1',
    date: '2024-01-15',
    type: 'expense',
    source: 'receipt',
    merchant: 'McDonald\'s',
    location: 'Downtown',
  },
  {
    id: '2',
    amount: 45.00,
    description: 'Uber ride to airport',
    category: '2',
    date: '2024-01-15',
    type: 'expense',
    source: 'bank',
    merchant: 'Uber',
  },
  {
    id: '3',
    amount: 120.00,
    description: 'Grocery shopping',
    category: '1',
    date: '2024-01-14',
    type: 'expense',
    source: 'manual',
    merchant: 'Whole Foods',
  },
  {
    id: '4',
    amount: 15.99,
    description: 'Netflix subscription',
    category: '4',
    date: '2024-01-14',
    type: 'expense',
    source: 'bank',
    merchant: 'Netflix',
  },
  {
    id: '5',
    amount: 89.50,
    description: 'Gas station',
    category: '2',
    date: '2024-01-13',
    type: 'expense',
    source: 'receipt',
    merchant: 'Shell',
  },
  {
    id: '6',
    amount: 200.00,
    description: 'Electricity bill',
    category: '5',
    date: '2024-01-12',
    type: 'expense',
    source: 'bank',
    merchant: 'Electric Company',
  },
  {
    id: '7',
    amount: 75.00,
    description: 'Doctor visit',
    category: '6',
    date: '2024-01-11',
    type: 'expense',
    source: 'manual',
    merchant: 'City Medical',
  },
  {
    id: '8',
    amount: 3500.00,
    description: 'Salary',
    date: '2024-01-01',
    type: 'income',
    source: 'bank',
    merchant: 'Company Inc',
  },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', spent: 145.50 },
  { id: '2', name: 'Transportation', icon: '🚗', color: '#4ECDC4', spent: 134.50 },
  { id: '3', name: 'Shopping', icon: '🛍️', color: '#45B7D1', spent: 0 },
  { id: '4', name: 'Entertainment', icon: '🎬', color: '#96CEB4', spent: 15.99 },
  { id: '5', name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7', spent: 200.00 },
  { id: '6', name: 'Healthcare', icon: '🏥', color: '#DDA0DD', spent: 75.00 },
  { id: '7', name: 'Education', icon: '📚', color: '#98D8C8', spent: 0 },
  { id: '8', name: 'Other', icon: '📦', color: '#F7DC6F', spent: 0 },
];

export const mockInsights = [
  {
    id: '1',
    type: 'tip',
    message: 'Dining expenses are 20% of your total spending this week',
    categoryId: '1',
    priority: 'medium',
  },
  {
    id: '2',
    type: 'warning',
    message: 'You\'re approaching your transportation budget limit',
    categoryId: '2',
    priority: 'high',
  },
  {
    id: '3',
    type: 'achievement',
    message: 'Great job staying under budget for entertainment this month!',
    categoryId: '4',
    priority: 'low',
  },
  {
    id: '4',
    type: 'tip',
    message: 'Consider cooking at home more often to reduce dining expenses',
    categoryId: '1',
    priority: 'medium',
  },
];

export const getSpendingByCategory = (transactions: Transaction[], categories: Category[]) => {
  const spending = categories.map(category => {
    const categoryTransactions = transactions.filter(
      t => t.category === category.id && t.type === 'expense'
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...category,
      spent: total,
      percentage: 0, // Will be calculated after we know total spending
    };
  });

  const totalSpent = spending.reduce((sum, category) => sum + category.spent, 0);
  
  return spending.map(category => ({
    ...category,
    percentage: totalSpent > 0 ? (category.spent / totalSpent) * 100 : 0,
  }));
};

export const getWeeklySpending = (transactions: Transaction[]) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= weekAgo && t.type === 'expense';
  });
};

export const getMonthlySpending = (transactions: Transaction[]) => {
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= monthAgo && t.type === 'expense';
  });
};
