import { configureStore } from '@reduxjs/toolkit';
import budgetSettingsReducer from './slices/budgetSettingsSlice';
import budgetReducer from './slices/budgetSlice';
import categoriesReducer from './slices/categoriesSlice';
import transactionsReducer from './slices/transactionsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    categories: categoriesReducer,
    budget: budgetReducer,
    budgetSettings: budgetSettingsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
