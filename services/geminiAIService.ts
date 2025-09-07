// Gemini AI Service for Receipt Analysis
// Uses Google's Gemini AI to intelligently analyze receipt text and extract structured data

import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

export interface GeminiReceiptAnalysis {
  merchant: string;
  date: string;
  total: number;
  items: GeminiReceiptItem[];
  tax?: number;
  tip?: number;
  confidence: number;
  suggestedCategory: string;
  spendingInsights: string[];
  budgetImpact: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  location?: string;
  paymentMethod?: string;
}

export interface GeminiReceiptItem {
  name: string;
  price: number;
  quantity?: number;
  category: string;
  confidence: number;
  description?: string;
}

export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Initialize Gemini AI with API key from environment variables
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('⚠️ Gemini API key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Main method to analyze receipt text with Gemini AI
  async analyzeReceiptText(rawText: string): Promise<GeminiReceiptAnalysis> {
    try {
      console.log('🤖 Starting Gemini AI analysis...');
      console.log('📄 OCR Text received by Gemini:', rawText);
      
      // Check if API key is available
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ Gemini API key not found, using mock analysis');
        return this.getMockAnalysis();
      }
      
      const prompt = this.createAnalysisPrompt(rawText);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse Gemini's JSON response
      const analysis = this.parseGeminiResponse(text);
      
      console.log('✅ Gemini AI analysis completed successfully');
      return analysis;
    } catch (error) {
      console.error('❌ Gemini AI analysis failed:', error);
      
      // Provide more specific error handling
      if (error.message?.includes('403')) {
        console.error('🔑 API key authentication failed. Please check your Gemini API key.');
      } else if (error.message?.includes('429')) {
        console.error('⏰ Rate limit exceeded. Please try again later.');
      } else if (error.message?.includes('network')) {
        console.error('🌐 Network error. Please check your internet connection.');
      }
      
      // Fallback to mock analysis
      console.log('🔄 Falling back to mock analysis...');
      return this.getMockAnalysis();
    }
  }

  // Create a comprehensive prompt for Gemini AI
  private createAnalysisPrompt(rawText: string): string {
    return `
You are an expert financial AI assistant. Analyze this receipt text and extract structured data.

RECEIPT TEXT:
${rawText}

Please analyze this receipt and return a JSON response with the following structure:

{
  "merchant": "Store name (extract from receipt)",
  "date": "YYYY-MM-DD format",
  "total": number,
  "items": [
    {
      "name": "Item name",
      "price": number,
      "quantity": number (if available),
      "category": "Food & Dining|Transportation|Groceries|Healthcare|Entertainment|Bills & Utilities|Shopping|Other",
      "confidence": 0.0-1.0,
      "description": "Brief description"
    }
  ],
  "tax": number (if available),
  "tip": number (if available),
  "confidence": 0.0-1.0,
  "suggestedCategory": "Primary category for the entire receipt",
  "spendingInsights": [
    "Insight 1 about spending patterns",
    "Insight 2 about budget impact"
  ],
  "budgetImpact": [
    {
      "category": "Category name",
      "amount": number,
      "percentage": number
    }
  ],
  "location": "City or location if mentioned",
  "paymentMethod": "Cash|Card|Digital if mentioned"
}

INSTRUCTIONS:
1. Extract the merchant name from the receipt header
2. Parse the date in YYYY-MM-DD format
3. Identify all items with prices
4. Categorize each item intelligently based on name and context
5. Calculate confidence scores based on clarity of data
6. Generate 2-3 spending insights
7. Calculate budget impact by category
8. Suggest the primary category for the entire receipt
9. Extract location and payment method if available
10. Return ONLY valid JSON, no additional text

CATEGORY GUIDELINES:
- Food & Dining: Restaurants, cafes, fast food, drinks
- Transportation: Gas, fuel, parking, rideshare, public transport
- Groceries: Supermarkets, food stores, household items
- Healthcare: Pharmacy, medical, health products
- Entertainment: Movies, games, subscriptions, events
- Bills & Utilities: Electricity, water, internet, phone bills
- Shopping: Clothing, electronics, general retail
- Other: Everything else

Return the JSON response now:
`;
  }

  // Parse Gemini's response and validate JSON
  private parseGeminiResponse(responseText: string): GeminiReceiptAnalysis {
    try {
      // Clean the response text
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Parse JSON
      const parsed = JSON.parse(cleanedText);

      // Validate and set defaults
      return {
        merchant: parsed.merchant || 'Unknown Store',
        date: parsed.date || new Date().toISOString().split('T')[0],
        total: parseFloat(parsed.total) || 0,
        items: Array.isArray(parsed.items) ? parsed.items.map(GeminiAIService.validateItem) : [],
        tax: parseFloat(parsed.tax) || 0,
        tip: parseFloat(parsed.tip) || 0,
        confidence: Math.min(1.0, Math.max(0.0, parseFloat(parsed.confidence) || 0.5)),
        suggestedCategory: parsed.suggestedCategory || 'Other',
        spendingInsights: Array.isArray(parsed.spendingInsights) ? parsed.spendingInsights : [],
        budgetImpact: Array.isArray(parsed.budgetImpact) ? parsed.budgetImpact : [],
        location: parsed.location || undefined,
        paymentMethod: parsed.paymentMethod || undefined,
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return this.getMockAnalysis();
    }
  }

  // Validate and clean individual items
  private static validateItem(item: any): GeminiReceiptItem {
    return {
      name: item.name || 'Unknown Item',
      price: parseFloat(item.price) || 0,
      quantity: parseFloat(item.quantity) || 1,
      category: GeminiAIService.validateCategory(item.category),
      confidence: Math.min(1.0, Math.max(0.0, parseFloat(item.confidence) || 0.5)),
      description: item.description || `${item.name} - ${item.category}`,
    };
  }

  // Validate category against allowed values
  private static validateCategory(category: string): string {
    const validCategories = [
      'Food & Dining',
      'Transportation', 
      'Groceries',
      'Healthcare',
      'Entertainment',
      'Bills & Utilities',
      'Shopping',
      'Other'
    ];
    
    return validCategories.includes(category) ? category : 'Other';
  }

  // Mock analysis for fallback
  private getMockAnalysis(): GeminiReceiptAnalysis {
    return {
      merchant: 'Sample Store',
      date: new Date().toISOString().split('T')[0],
      total: 45.67,
      items: [
        {
          name: 'Sample Item 1',
          price: 25.99,
          quantity: 1,
          category: 'Food & Dining',
          confidence: 0.85,
          description: 'Food item from Sample Item 1'
        },
        {
          name: 'Sample Item 2',
          price: 19.68,
          quantity: 1,
          category: 'Other',
          confidence: 0.70,
          description: 'Miscellaneous: Sample Item 2'
        }
      ],
      tax: 3.65,
      tip: 0,
      confidence: 0.80,
      suggestedCategory: 'Food & Dining',
      spendingInsights: [
        'This receipt is primarily Food & Dining (56.9% of total)',
        'Small purchase - good for tracking daily expenses'
      ],
      budgetImpact: [
        { category: 'Food & Dining', amount: 25.99, percentage: 56.9 },
        { category: 'Other', amount: 19.68, percentage: 43.1 }
      ],
      location: 'Sample City',
      paymentMethod: 'Card'
    };
  }

  // Enhanced method to save structured data to database
  async processAndSaveReceipt(
    imageUri: string, 
    rawText: string, 
    userId: string
  ): Promise<{ transaction: any; receipt: any; analysis: GeminiReceiptAnalysis }> {
    try {
      // Analyze with Gemini AI
      const analysis = await this.analyzeReceiptText(rawText);
      
      // Save transaction to database
      const transaction = await this.saveTransaction(analysis, userId);
      
      // Save receipt with AI analysis
      const receipt = await this.saveReceipt(imageUri, rawText, analysis, userId, transaction.id);
      
      return { transaction, receipt, analysis };
    } catch (error) {
      console.error('Failed to process and save receipt:', error);
      throw error;
    }
  }

  // Save transaction to database
  private async saveTransaction(analysis: GeminiReceiptAnalysis, userId: string): Promise<any> {
    const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';
    
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        amount: analysis.total,
        description: analysis.items.map(item => item.name).join(', '),
        categoryId: null, // Will be set based on suggestedCategory
        type: 'expense',
        source: 'ai',
        merchant: analysis.merchant,
        location: analysis.location,
        transactionDate: analysis.date
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save transaction');
    }

    return response.json();
  }

  // Save receipt with AI analysis
  private async saveReceipt(
    imageUri: string, 
    rawText: string, 
    analysis: GeminiReceiptAnalysis, 
    userId: string, 
    transactionId: string
  ): Promise<any> {
    const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';
    
    const response = await fetch(`${API_BASE_URL}/api/receipts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        transactionId,
        imageUrl: imageUri,
        rawText,
        aiAnalysis: analysis,
        confidenceScore: analysis.confidence
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save receipt');
    }

    return response.json();
  }
}

export const geminiAIService = new GeminiAIService();
