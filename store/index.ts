import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import categoriesReducer from './slices/categoriesSlice';
import budgetReducer from './slices/budgetSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    categories: categoriesReducer,
    budget: budgetReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
