import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BudgetGoal {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

export interface BudgetInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement';
  message: string;
  categoryId?: string;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetState {
  goals: BudgetGoal[];
  insights: BudgetInsight[];
  totalBudget: number;
  totalSpent: number;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  goals: [],
  insights: [
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
  ],
  totalBudget: 2000,
  totalSpent: 0,
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addBudgetGoal: (state, action: PayloadAction<BudgetGoal>) => {
      state.goals.push(action.payload);
    },
    updateBudgetGoal: (state, action: PayloadAction<{ id: string; updates: Partial<BudgetGoal> }>) => {
      const index = state.goals.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = { ...state.goals[index], ...action.payload.updates };
      }
    },
    deleteBudgetGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(g => g.id !== action.payload);
    },
    addInsight: (state, action: PayloadAction<BudgetInsight>) => {
      state.insights.push(action.payload);
    },
    removeInsight: (state, action: PayloadAction<string>) => {
      state.insights = state.insights.filter(i => i.id !== action.payload);
    },
    updateTotalBudget: (state, action: PayloadAction<number>) => {
      state.totalBudget = action.payload;
    },
    updateTotalSpent: (state, action: PayloadAction<number>) => {
      state.totalSpent = action.payload;
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
  addBudgetGoal,
  updateBudgetGoal,
  deleteBudgetGoal,
  addInsight,
  removeInsight,
  updateTotalBudget,
  updateTotalSpent,
  setLoading,
  setError,
} = budgetSlice.actions;

export default budgetSlice.reducer;
