import { apiService, Transaction as ApiTransaction } from '@/services/apiService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'expense' | 'income';
  source: 'manual' | 'bank' | 'receipt' | 'ai';
  merchant?: string;
  location?: string;
}

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

// Helper function to convert API transaction to local format
function convertApiTransaction(apiTransaction: ApiTransaction): Transaction {
  return {
    id: apiTransaction.id,
    amount: apiTransaction.amount,
    description: apiTransaction.description,
    category: apiTransaction.category_id || 'other',
    date: apiTransaction.transaction_date,
    type: apiTransaction.type,
    source: apiTransaction.source,
    merchant: apiTransaction.merchant,
    location: apiTransaction.location,
  };
}

// Async thunks for API calls
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId: string) => {
    try {
      const userData = await apiService.getUserData(userId);
      const transactions = userData.transactions.map(convertApiTransaction);
      return transactions;
    } catch (error) {
      console.error('❌ Transactions: Error fetching transactions:', error);
      // Import mock data as fallback
      const { mockTransactions } = await import('@/services/mockData');
      return mockTransactions;
    }
  }
);

export const createTransactionAsync = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Omit<Transaction, 'id'>) => {
    const apiTransaction = await apiService.createTransaction({
      userId: '550e8400-e29b-41d4-a716-446655440000', // Hardcoded for now
      amount: transaction.amount,
      description: transaction.description,
      categoryId: transaction.category,
      type: transaction.type,
      source: transaction.source,
      merchant: transaction.merchant,
      location: transaction.location,
      transactionDate: transaction.date,
    });
    return convertApiTransaction(apiTransaction);
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<Transaction> }>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...action.payload.updates };
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      // Create transaction
      .addCase(createTransactionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransactionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create transaction';
      });
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setTransactions,
  setLoading,
  setError,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
