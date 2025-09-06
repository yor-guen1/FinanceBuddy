import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  spent: number;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [
    { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', spent: 0 },
    { id: '2', name: 'Transportation', icon: '🚗', color: '#4ECDC4', spent: 0 },
    { id: '3', name: 'Shopping', icon: '🛍️', color: '#45B7D1', spent: 0 },
    { id: '4', name: 'Entertainment', icon: '🎬', color: '#96CEB4', spent: 0 },
    { id: '5', name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7', spent: 0 },
    { id: '6', name: 'Healthcare', icon: '🏥', color: '#DDA0DD', spent: 0 },
    { id: '7', name: 'Education', icon: '📚', color: '#98D8C8', spent: 0 },
    { id: '8', name: 'Other', icon: '📦', color: '#F7DC6F', spent: 0 },
  ],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<{ id: string; updates: Partial<Category> }>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...action.payload.updates };
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    updateCategorySpent: (state, action: PayloadAction<{ categoryId: string; amount: number }>) => {
      const category = state.categories.find(c => c.id === action.payload.categoryId);
      if (category) {
        category.spent += action.payload.amount;
      }
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
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
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategorySpent,
  setCategories,
  setLoading,
  setError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
