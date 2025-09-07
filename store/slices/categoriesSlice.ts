import { Category as ApiCategory, apiService } from '@/services/apiService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  categories: [],
  loading: false,
  error: null,
};

// Helper function to convert API category to local format
function convertApiCategory(apiCategory: ApiCategory): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    icon: apiCategory.icon,
    color: apiCategory.color,
    spent: 0, // Will be calculated from transactions
  };
}

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (userId: string) => {
    console.log('🔄 Categories: Starting fetch for user:', userId);
    try {
      const userData = await apiService.getUserData(userId);
      console.log('✅ Categories: User data received:', userData);
      const categories = userData.categories.map(convertApiCategory);
      console.log('✅ Categories: Converted categories:', categories);
      return categories;
    } catch (error) {
      console.error('❌ Categories: Error fetching categories:', error);
      throw error;
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
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
