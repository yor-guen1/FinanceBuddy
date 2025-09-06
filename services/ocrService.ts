// OCR Service for Receipt Scanning
// This is a mock implementation. In a real app, you would integrate with:
// - Google Vision API
// - Tesseract OCR
// - AWS Textract
// - Azure Computer Vision

export interface ReceiptData {
  merchant: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  tax?: number;
  tip?: number;
}

export interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}

export class OCRService {
  // Mock OCR processing - in reality this would call an actual OCR API
  static async processReceipt(imageUri: string): Promise<ReceiptData> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data based on common receipt patterns
    const mockReceipts = [
      {
        merchant: 'McDonald\'s',
        date: new Date().toISOString().split('T')[0],
        total: 25.50,
        items: [
          { name: 'Big Mac Meal', price: 12.99, quantity: 1, category: 'Food' },
          { name: 'Chicken McNuggets', price: 8.99, quantity: 1, category: 'Food' },
          { name: 'Large Fries', price: 3.52, quantity: 1, category: 'Food' },
        ],
        tax: 2.04,
        tip: 0,
      },
      {
        merchant: 'Whole Foods Market',
        date: new Date().toISOString().split('T')[0],
        total: 120.00,
        items: [
          { name: 'Organic Bananas', price: 4.50, quantity: 2, category: 'Groceries' },
          { name: 'Free Range Chicken', price: 18.99, quantity: 1, category: 'Groceries' },
          { name: 'Organic Milk', price: 5.99, quantity: 2, category: 'Groceries' },
          { name: 'Whole Grain Bread', price: 4.99, quantity: 1, category: 'Groceries' },
          { name: 'Assorted Vegetables', price: 15.00, quantity: 1, category: 'Groceries' },
        ],
        tax: 9.60,
        tip: 0,
      },
      {
        merchant: 'Shell Gas Station',
        date: new Date().toISOString().split('T')[0],
        total: 89.50,
        items: [
          { name: 'Regular Gas', price: 85.00, quantity: 1, category: 'Transportation' },
          { name: 'Coffee', price: 2.50, quantity: 1, category: 'Food' },
          { name: 'Snack', price: 2.00, quantity: 1, category: 'Food' },
        ],
        tax: 7.16,
        tip: 0,
      },
    ];

    // Return a random mock receipt for demonstration
    const randomReceipt = mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
    
    return randomReceipt;
  }

  // Extract text from image using Tesseract OCR (would need react-native-tesseract-ocr)
  static async extractText(imageUri: string): Promise<string> {
    // Mock implementation - in reality this would use Tesseract
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `MOCK RECEIPT TEXT
Merchant: Sample Store
Date: ${new Date().toLocaleDateString()}
Items:
- Item 1: $10.00
- Item 2: $15.50
- Item 3: $5.25
Total: $30.75
Tax: $2.46
`;
  }

  // Parse extracted text to structured data
  static parseReceiptText(text: string): ReceiptData {
    // This would contain actual parsing logic
    // For now, return mock data
    return {
      merchant: 'Parsed Store',
      date: new Date().toISOString().split('T')[0],
      total: 30.75,
      items: [
        { name: 'Item 1', price: 10.00, quantity: 1 },
        { name: 'Item 2', price: 15.50, quantity: 1 },
        { name: 'Item 3', price: 5.25, quantity: 1 },
      ],
      tax: 2.46,
    };
  }

  // Categorize items based on merchant and item names
  static categorizeItems(items: ReceiptItem[], merchant: string): ReceiptItem[] {
    const categoryMap: { [key: string]: string } = {
      'mcdonald': 'Food & Dining',
      'burger': 'Food & Dining',
      'pizza': 'Food & Dining',
      'restaurant': 'Food & Dining',
      'cafe': 'Food & Dining',
      'coffee': 'Food & Dining',
      'gas': 'Transportation',
      'fuel': 'Transportation',
      'uber': 'Transportation',
      'lyft': 'Transportation',
      'taxi': 'Transportation',
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
    };

    return items.map(item => {
      const itemName = item.name.toLowerCase();
      const merchantName = merchant.toLowerCase();
      
      // Check merchant name first
      for (const [keyword, category] of Object.entries(categoryMap)) {
        if (merchantName.includes(keyword)) {
          return { ...item, category };
        }
      }
      
      // Check item name
      for (const [keyword, category] of Object.entries(categoryMap)) {
        if (itemName.includes(keyword)) {
          return { ...item, category };
        }
      }
      
      // Default category
      return { ...item, category: 'Other' };
    });
  }

  // Validate receipt data
  static validateReceiptData(data: ReceiptData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.merchant || data.merchant.trim() === '') {
      errors.push('Merchant name is required');
    }
    
    if (!data.date || isNaN(Date.parse(data.date))) {
      errors.push('Valid date is required');
    }
    
    if (!data.total || data.total <= 0) {
      errors.push('Valid total amount is required');
    }
    
    if (!data.items || data.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    // Validate items
    data.items.forEach((item, index) => {
      if (!item.name || item.name.trim() === '') {
        errors.push(`Item ${index + 1} name is required`);
      }
      if (!item.price || item.price <= 0) {
        errors.push(`Item ${index + 1} price must be greater than 0`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
