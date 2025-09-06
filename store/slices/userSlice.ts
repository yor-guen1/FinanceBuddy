import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserSettings {
  currency: string;
  budgetPeriod: 'weekly' | 'monthly';
  notifications: {
    budgetAlerts: boolean;
    weeklyReports: boolean;
    spendingInsights: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  lastFour: string;
  isConnected: boolean;
}

interface UserState {
  settings: UserSettings;
  bankAccounts: BankAccount[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  settings: {
    currency: 'USD',
    budgetPeriod: 'monthly',
    notifications: {
      budgetAlerts: true,
      weeklyReports: true,
      spendingInsights: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
    },
  },
  bankAccounts: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    addBankAccount: (state, action: PayloadAction<BankAccount>) => {
      state.bankAccounts.push(action.payload);
    },
    removeBankAccount: (state, action: PayloadAction<string>) => {
      state.bankAccounts = state.bankAccounts.filter(account => account.id !== action.payload);
    },
    updateBankAccount: (state, action: PayloadAction<{ id: string; updates: Partial<BankAccount> }>) => {
      const index = state.bankAccounts.findIndex(account => account.id === action.payload.id);
      if (index !== -1) {
        state.bankAccounts[index] = { ...state.bankAccounts[index], ...action.payload.updates };
      }
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateSettings,
  addBankAccount,
  removeBankAccount,
  updateBankAccount,
  setAuthenticated,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
