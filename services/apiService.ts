// API Service for MoneyMate Frontend
// Handles all communication with the backend API

import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  categoryId?: string;
  type: 'expense' | 'income';
  source: 'manual' | 'bank' | 'receipt' | 'ai';
  merchant?: string;
  location?: string;
  transactionDate: string;
  createdAt: string;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
}

export interface Category {
  id: string;
  userId?: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  createdAt: string;
}

export interface BudgetGoal {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
}

export interface Receipt {
  id: string;
  userId: string;
  transactionId: string;
  imageUrl: string;
  rawText?: string;
  aiAnalysis?: any;
  confidenceScore?: number;
  createdAt: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🔍 API Request:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response Data:', data);
    return data;
  }

  // User endpoints
  async getUserData(userId: string) {
    console.log('🔍 API Service: Fetching user data for:', userId);
    console.log('🔍 API Service: Base URL:', API_BASE_URL);
    
    try {
      const result = await this.request<{
        user: any;
        categories: Category[];
        transactions: Transaction[];
      }>(`/api/users/${userId}`);
      console.log('✅ API Service: User data fetched successfully');
      return result;
    } catch (error) {
      console.error('❌ API Service: Error fetching user data:', error);
      throw error;
    }
  }

  // Transaction endpoints
  async getTransactions(userId: string, filters?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    type?: string;
  }) {
    const params = new URLSearchParams({ userId, ...filters });
    return this.request<Transaction[]>(`/api/transactions?${params}`);
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
    return this.request<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  // Receipt endpoints
  async createReceipt(receipt: Omit<Receipt, 'id' | 'createdAt'>) {
    return this.request<Receipt>('/api/receipts', {
      method: 'POST',
      body: JSON.stringify(receipt),
    });
  }

  async getReceiptAnalysis(receiptId: string) {
    return this.request<{
      aiAnalysis: any;
      confidenceScore: number;
      rawText: string;
    }>(`/api/receipts/${receiptId}/analysis`);
  }

  // Budget endpoints
  async getBudgetGoals(userId: string) {
    return this.request<BudgetGoal[]>(`/api/budget-goals/${userId}`);
  }

  async createBudgetGoal(goal: Omit<BudgetGoal, 'id' | 'createdAt'>) {
    return this.request<BudgetGoal>('/api/budget-goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/api/health');
  }
}

export const apiService = new ApiService();