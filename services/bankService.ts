// Bank Integration Service
// This is a mock implementation. In a real app, you would integrate with:
// - Plaid API
// - Salt Edge
// - Yodlee
// - Open Banking APIs

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  lastFour: string;
  balance: number;
  currency: string;
  isConnected: boolean;
  institution: string;
}

export interface BankTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  merchant?: string;
  type: 'debit' | 'credit';
  status: 'pending' | 'posted';
}

export interface BankConnection {
  id: string;
  institution: string;
  accounts: BankAccount[];
  isActive: boolean;
  lastSync: string;
}

export class BankService {
  // Mock bank connection flow
  static async connectBank(institutionId: string): Promise<BankConnection> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockConnections: { [key: string]: BankConnection } = {
      'chase': {
        id: 'conn_1',
        institution: 'Chase Bank',
        accounts: [
          {
            id: 'acc_1',
            name: 'Chase Total Checking',
            type: 'checking',
            lastFour: '1234',
            balance: 2500.00,
            currency: 'USD',
            isConnected: true,
            institution: 'Chase Bank',
          },
          {
            id: 'acc_2',
            name: 'Chase Freedom Credit Card',
            type: 'credit',
            lastFour: '5678',
            balance: -1200.00,
            currency: 'USD',
            isConnected: true,
            institution: 'Chase Bank',
          },
        ],
        isActive: true,
        lastSync: new Date().toISOString(),
      },
      'wells_fargo': {
        id: 'conn_2',
        institution: 'Wells Fargo',
        accounts: [
          {
            id: 'acc_3',
            name: 'Wells Fargo Everyday Checking',
            type: 'checking',
            lastFour: '9012',
            balance: 1800.00,
            currency: 'USD',
            isConnected: true,
            institution: 'Wells Fargo',
          },
        ],
        isActive: true,
        lastSync: new Date().toISOString(),
      },
    };

    return mockConnections[institutionId] || mockConnections['chase'];
  }

  // Get available institutions
  static async getInstitutions(): Promise<Array<{ id: string; name: string; logo?: string }>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      { id: 'chase', name: 'Chase Bank' },
      { id: 'wells_fargo', name: 'Wells Fargo' },
      { id: 'bank_of_america', name: 'Bank of America' },
      { id: 'citibank', name: 'Citibank' },
      { id: 'us_bank', name: 'U.S. Bank' },
      { id: 'pnc', name: 'PNC Bank' },
    ];
  }

  // Fetch transactions from bank
  static async getTransactions(
    accountId: string, 
    startDate: string, 
    endDate: string
  ): Promise<BankTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock transactions
    const mockTransactions: BankTransaction[] = [
      {
        id: 'txn_1',
        accountId,
        amount: -25.50,
        description: 'MCDONALDS #1234',
        date: '2024-01-15T10:30:00Z',
        category: 'Food & Dining',
        merchant: 'McDonald\'s',
        type: 'debit',
        status: 'posted',
      },
      {
        id: 'txn_2',
        accountId,
        amount: -45.00,
        description: 'UBER TRIP',
        date: '2024-01-15T14:20:00Z',
        category: 'Transportation',
        merchant: 'Uber',
        type: 'debit',
        status: 'posted',
      },
      {
        id: 'txn_3',
        accountId,
        amount: -120.00,
        description: 'WHOLE FOODS MARKET',
        date: '2024-01-14T16:45:00Z',
        category: 'Food & Dining',
        merchant: 'Whole Foods',
        type: 'debit',
        status: 'posted',
      },
      {
        id: 'txn_4',
        accountId,
        amount: -15.99,
        description: 'NETFLIX.COM',
        date: '2024-01-14T00:00:00Z',
        category: 'Entertainment',
        merchant: 'Netflix',
        type: 'debit',
        status: 'posted',
      },
      {
        id: 'txn_5',
        accountId,
        amount: 3500.00,
        description: 'SALARY DEPOSIT',
        date: '2024-01-01T09:00:00Z',
        category: 'Income',
        merchant: 'Company Inc',
        type: 'credit',
        status: 'posted',
      },
    ];

    return mockTransactions.filter(txn => 
      txn.date >= startDate && txn.date <= endDate
    );
  }

  // Sync all connected accounts
  static async syncAllAccounts(): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return {
      success: true,
      message: 'All accounts synced successfully'
    };
  }

  // Disconnect bank account
  static async disconnectBank(connectionId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: 'Bank account disconnected successfully'
    };
  }

  // Get account balance
  static async getAccountBalance(accountId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock balance
    return 2500.00;
  }

  // Categorize bank transactions
  static categorizeTransaction(transaction: BankTransaction): BankTransaction {
    const categoryMap: { [key: string]: string } = {
      'mcdonald': 'Food & Dining',
      'burger': 'Food & Dining',
      'pizza': 'Food & Dining',
      'restaurant': 'Food & Dining',
      'cafe': 'Food & Dining',
      'coffee': 'Food & Dining',
      'uber': 'Transportation',
      'lyft': 'Transportation',
      'taxi': 'Transportation',
      'gas': 'Transportation',
      'fuel': 'Transportation',
      'grocery': 'Food & Dining',
      'market': 'Food & Dining',
      'pharmacy': 'Healthcare',
      'medical': 'Healthcare',
      'doctor': 'Healthcare',
      'entertainment': 'Entertainment',
      'movie': 'Entertainment',
      'netflix': 'Entertainment',
      'spotify': 'Entertainment',
      'utility': 'Bills & Utilities',
      'electric': 'Bills & Utilities',
      'water': 'Bills & Utilities',
      'internet': 'Bills & Utilities',
      'salary': 'Income',
      'deposit': 'Income',
    };

    const description = transaction.description.toLowerCase();
    
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (description.includes(keyword)) {
        return { ...transaction, category };
      }
    }
    
    return { ...transaction, category: 'Other' };
  }

  // Validate bank connection
  static validateConnection(connection: BankConnection): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!connection.institution || connection.institution.trim() === '') {
      errors.push('Institution name is required');
    }
    
    if (!connection.accounts || connection.accounts.length === 0) {
      errors.push('At least one account is required');
    }
    
    connection.accounts.forEach((account, index) => {
      if (!account.name || account.name.trim() === '') {
        errors.push(`Account ${index + 1} name is required`);
      }
      if (!account.lastFour || account.lastFour.length !== 4) {
        errors.push(`Account ${index + 1} last four digits must be 4 characters`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
