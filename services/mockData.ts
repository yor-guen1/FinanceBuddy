import { Category, Transaction } from '../store/slices/transactionsSlice';

export const mockTransactions: Transaction[] = [
  // Income
  {
    id: 'income-1',
    amount: 4500.00,
    description: 'Monthly Salary',
    date: '2024-01-01',
    type: 'income',
    source: 'bank',
    merchant: 'Tech Solutions Inc',
  },
  {
    id: 'income-2',
    amount: 4500.00,
    description: 'Monthly Salary',
    date: '2023-12-01',
    type: 'income',
    source: 'bank',
    merchant: 'Tech Solutions Inc',
  },
  
  // Food & Dining (Category 1) - $485 total
  {
    id: 'food-1',
    amount: 12.50,
    description: 'Coffee and pastry',
    category: '1',
    date: '2024-01-15',
    type: 'expense',
    source: 'receipt',
    merchant: 'Starbucks',
    location: 'Downtown',
  },
  {
    id: 'food-2',
    amount: 18.75,
    description: 'Lunch with colleagues',
    category: '1',
    date: '2024-01-14',
    type: 'expense',
    source: 'receipt',
    merchant: 'Chipotle',
    location: 'Office District',
  },
  {
    id: 'food-3',
    amount: 85.00,
    description: 'Weekly grocery shopping',
    category: '1',
    date: '2024-01-13',
    type: 'expense',
    source: 'receipt',
    merchant: 'Whole Foods',
    location: 'Main Street',
  },
  {
    id: 'food-4',
    amount: 45.00,
    description: 'Dinner date',
    category: '1',
    date: '2024-01-12',
    type: 'expense',
    source: 'receipt',
    merchant: 'Olive Garden',
    location: 'Mall Area',
  },
  {
    id: 'food-5',
    amount: 8.50,
    description: 'Breakfast sandwich',
    category: '1',
    date: '2024-01-11',
    type: 'expense',
    source: 'receipt',
    merchant: 'McDonald\'s',
    location: 'Highway Exit',
  },
  {
    id: 'food-6',
    amount: 22.00,
    description: 'Pizza delivery',
    category: '1',
    date: '2024-01-10',
    type: 'expense',
    source: 'receipt',
    merchant: 'Domino\'s',
    location: 'Home',
  },
  {
    id: 'food-7',
    amount: 95.00,
    description: 'Grocery shopping',
    category: '1',
    date: '2024-01-08',
    type: 'expense',
    source: 'receipt',
    merchant: 'Trader Joe\'s',
    location: 'Shopping Center',
  },
  {
    id: 'food-8',
    amount: 15.25,
    description: 'Lunch break',
    category: '1',
    date: '2024-01-07',
    type: 'expense',
    source: 'receipt',
    merchant: 'Subway',
    location: 'Office Building',
  },
  {
    id: 'food-9',
    amount: 35.00,
    description: 'Weekend brunch',
    category: '1',
    date: '2024-01-06',
    type: 'expense',
    source: 'receipt',
    merchant: 'Denny\'s',
    location: 'Downtown',
  },
  {
    id: 'food-10',
    amount: 148.00,
    description: 'Grocery shopping',
    category: '1',
    date: '2024-01-05',
    type: 'expense',
    source: 'receipt',
    merchant: 'Kroger',
    location: 'Suburbs',
  },
  
  // Transportation (Category 2) - $320 total
  {
    id: 'trans-1',
    amount: 65.00,
    description: 'Gas fill-up',
    category: '2',
    date: '2024-01-15',
    type: 'expense',
    source: 'receipt',
    merchant: 'Shell',
    location: 'Highway 101',
  },
  {
    id: 'trans-2',
    amount: 12.50,
    description: 'Uber ride',
    category: '2',
    date: '2024-01-14',
    type: 'expense',
    source: 'bank',
    merchant: 'Uber',
  },
  {
    id: 'trans-3',
    amount: 8.75,
    description: 'Bus fare',
    category: '2',
    date: '2024-01-13',
    type: 'expense',
    source: 'manual',
    merchant: 'City Transit',
  },
  {
    id: 'trans-4',
    amount: 45.00,
    description: 'Gas fill-up',
    category: '2',
    date: '2024-01-12',
    type: 'expense',
    source: 'receipt',
    merchant: 'Chevron',
    location: 'Main Street',
  },
  {
    id: 'trans-5',
    amount: 25.00,
    description: 'Parking fee',
    category: '2',
    date: '2024-01-11',
    type: 'expense',
    source: 'receipt',
    merchant: 'City Parking',
    location: 'Downtown',
  },
  {
    id: 'trans-6',
    amount: 18.50,
    description: 'Uber ride',
    category: '2',
    date: '2024-01-10',
    type: 'expense',
    source: 'bank',
    merchant: 'Uber',
  },
  {
    id: 'trans-7',
    amount: 55.00,
    description: 'Gas fill-up',
    category: '2',
    date: '2024-01-08',
    type: 'expense',
    source: 'receipt',
    merchant: 'Exxon',
    location: 'Highway 5',
  },
  {
    id: 'trans-8',
    amount: 15.00,
    description: 'Toll road fee',
    category: '2',
    date: '2024-01-07',
    type: 'expense',
    source: 'bank',
    merchant: 'State Toll Authority',
  },
  {
    id: 'trans-9',
    amount: 22.50,
    description: 'Uber ride',
    category: '2',
    date: '2024-01-06',
    type: 'expense',
    source: 'bank',
    merchant: 'Uber',
  },
  {
    id: 'trans-10',
    amount: 54.25,
    description: 'Gas fill-up',
    category: '2',
    date: '2024-01-05',
    type: 'expense',
    source: 'receipt',
    merchant: 'BP',
    location: 'Interstate 80',
  },
  
  // Entertainment (Category 3) - $89 total
  {
    id: 'ent-1',
    amount: 15.99,
    description: 'Netflix subscription',
    category: '3',
    date: '2024-01-14',
    type: 'expense',
    source: 'bank',
    merchant: 'Netflix',
  },
  {
    id: 'ent-2',
    amount: 9.99,
    description: 'Spotify Premium',
    category: '3',
    date: '2024-01-14',
    type: 'expense',
    source: 'bank',
    merchant: 'Spotify',
  },
  {
    id: 'ent-3',
    amount: 25.00,
    description: 'Movie tickets',
    category: '3',
    date: '2024-01-12',
    type: 'expense',
    source: 'receipt',
    merchant: 'AMC Theaters',
    location: 'Mall Cinema',
  },
  {
    id: 'ent-4',
    amount: 12.50,
    description: 'Coffee shop work session',
    category: '3',
    date: '2024-01-10',
    type: 'expense',
    source: 'receipt',
    merchant: 'Local Coffee Co',
    location: 'Downtown',
  },
  {
    id: 'ent-5',
    amount: 8.99,
    description: 'Apple Music',
    category: '3',
    date: '2024-01-08',
    type: 'expense',
    source: 'bank',
    merchant: 'Apple',
  },
  {
    id: 'ent-6',
    amount: 16.53,
    description: 'Book purchase',
    category: '3',
    date: '2024-01-06',
    type: 'expense',
    source: 'receipt',
    merchant: 'Barnes & Noble',
    location: 'Shopping Mall',
  },
  
  // Bills & Utilities (Category 4) - $485 total
  {
    id: 'bills-1',
    amount: 125.00,
    description: 'Electricity bill',
    category: '4',
    date: '2024-01-12',
    type: 'expense',
    source: 'bank',
    merchant: 'Pacific Electric',
  },
  {
    id: 'bills-2',
    amount: 85.00,
    description: 'Internet bill',
    category: '4',
    date: '2024-01-12',
    type: 'expense',
    source: 'bank',
    merchant: 'Comcast',
  },
  {
    id: 'bills-3',
    amount: 45.00,
    description: 'Phone bill',
    category: '4',
    date: '2024-01-12',
    type: 'expense',
    source: 'bank',
    merchant: 'Verizon',
  },
  {
    id: 'bills-4',
    amount: 1200.00,
    description: 'Rent payment',
    category: '4',
    date: '2024-01-01',
    type: 'expense',
    source: 'bank',
    merchant: 'Property Management Co',
  },
  {
    id: 'bills-5',
    amount: 30.00,
    description: 'Water bill',
    category: '4',
    date: '2024-01-12',
    type: 'expense',
    source: 'bank',
    merchant: 'City Water Department',
  },
  
  // Healthcare (Category 5) - $150 total
  {
    id: 'health-1',
    amount: 25.00,
    description: 'Prescription medication',
    category: '5',
    date: '2024-01-11',
    type: 'expense',
    source: 'receipt',
    merchant: 'CVS Pharmacy',
    location: 'Main Street',
  },
  {
    id: 'health-2',
    amount: 75.00,
    description: 'Doctor visit copay',
    category: '5',
    date: '2024-01-10',
    type: 'expense',
    source: 'receipt',
    merchant: 'City Medical Center',
    location: 'Medical District',
  },
  {
    id: 'health-3',
    amount: 50.00,
    description: 'Dental cleaning',
    category: '5',
    date: '2024-01-08',
    type: 'expense',
    source: 'receipt',
    merchant: 'Smile Dental',
    location: 'Office Park',
  },
  
  // Shopping (Category 6) - $180 total
  {
    id: 'shop-1',
    amount: 45.00,
    description: 'New shirt',
    category: '6',
    date: '2024-01-13',
    type: 'expense',
    source: 'receipt',
    merchant: 'H&M',
    location: 'Shopping Mall',
  },
  {
    id: 'shop-2',
    amount: 25.00,
    description: 'Workout gear',
    category: '6',
    date: '2024-01-11',
    type: 'expense',
    source: 'receipt',
    merchant: 'Nike',
    location: 'Sports Store',
  },
  {
    id: 'shop-3',
    amount: 35.00,
    description: 'Household items',
    category: '6',
    date: '2024-01-09',
    type: 'expense',
    source: 'receipt',
    merchant: 'Target',
    location: 'Shopping Center',
  },
  {
    id: 'shop-4',
    amount: 75.00,
    description: 'New shoes',
    category: '6',
    date: '2024-01-07',
    type: 'expense',
    source: 'receipt',
    merchant: 'Foot Locker',
    location: 'Mall',
  },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', spent: 485.00, budget: 600 },
  { id: '2', name: 'Transportation', icon: '🚗', color: '#4ECDC4', spent: 320.00, budget: 400 },
  { id: '3', name: 'Entertainment', icon: '🎬', color: '#96CEB4', spent: 89.00, budget: 150 },
  { id: '4', name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7', spent: 1485.00, budget: 1500 },
  { id: '5', name: 'Healthcare', icon: '🏥', color: '#DDA0DD', spent: 150.00, budget: 200 },
  { id: '6', name: 'Shopping', icon: '🛍️', color: '#45B7D1', spent: 180.00, budget: 300 },
  { id: '7', name: 'Education', icon: '📚', color: '#98D8C8', spent: 0, budget: 100 },
  { id: '8', name: 'Other', icon: '📦', color: '#F7DC6F', spent: 0, budget: 50 },
];

export const mockInsights = [
  {
    id: '1',
    type: 'tip',
    message: 'Food & Dining expenses are 19% of your total spending this month',
    categoryId: '1',
    priority: 'medium',
  },
  {
    id: '2',
    type: 'achievement',
    message: 'Great job staying under budget for Transportation! You saved $80 this month.',
    categoryId: '2',
    priority: 'low',
  },
  {
    id: '3',
    type: 'achievement',
    message: 'Excellent! You\'re well under budget for Entertainment with $61 remaining.',
    categoryId: '3',
    priority: 'low',
  },
  {
    id: '4',
    type: 'tip',
    message: 'Consider meal prepping to reduce dining out expenses. You could save $100+ monthly.',
    categoryId: '1',
    priority: 'medium',
  },
  {
    id: '5',
    type: 'warning',
    message: 'Bills & Utilities are at 99% of budget. Monitor your usage next month.',
    categoryId: '4',
    priority: 'high',
  },
  {
    id: '6',
    type: 'tip',
    message: 'You have $120 remaining in your Shopping budget. Plan purchases wisely.',
    categoryId: '6',
    priority: 'medium',
  },
];

export const getSpendingByCategory = (transactions: Transaction[], categories: Category[]) => {
  // Only process expense transactions, exclude income
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const spending = categories.map(category => {
    const categoryTransactions = expenseTransactions.filter(
      t => t.category === category.id
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
