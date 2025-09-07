import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BudgetPeriod = 'weekly' | 'monthly';

interface BudgetSettingsState {
  period: BudgetPeriod;
  totalBudget: number;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetSettingsState = {
  period: 'monthly',
  totalBudget: 1000, // Default monthly budget
  loading: false,
  error: null,
};

const budgetSettingsSlice = createSlice({
  name: 'budgetSettings',
  initialState,
  reducers: {
    setBudgetPeriod: (state, action: PayloadAction<BudgetPeriod>) => {
      state.period = action.payload;
      // Adjust budget based on period
      if (action.payload === 'weekly') {
        state.totalBudget = 250; // Weekly budget (1000/4)
      } else {
        state.totalBudget = 1000; // Monthly budget
      }
    },
    setTotalBudget: (state, action: PayloadAction<number>) => {
      state.totalBudget = action.payload;
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
  setBudgetPeriod,
  setTotalBudget,
  setLoading,
  setError,
} = budgetSettingsSlice.actions;

export default budgetSettingsSlice.reducer;

