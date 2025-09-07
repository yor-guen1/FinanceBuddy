import { geminiAIService } from './geminiAIService';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
  suggestions?: string[];
  actions?: ChatAction[];
}

export interface ChatAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
}

export interface FinancialContext {
  totalSpent: number;
  totalIncome: number;
  monthlySavings: number;
  topCategories: Array<{ name: string; spent: number; percentage: number }>;
  budgetGoals: Array<{ category: string; amount: number; spent: number }>;
  recentTransactions: Array<{ description: string; amount: number; category: string; date: string }>;
  budgetStatus: 'on_track' | 'over_budget' | 'under_budget';
  period: 'weekly' | 'monthly';
}

export class ChatbotService {
  private conversationHistory: ChatMessage[] = [];
  private financialContext: FinancialContext | null = null;

  constructor() {
    this.loadConversationHistory();
  }

  // Set financial context for AI responses
  setFinancialContext(context: FinancialContext) {
    this.financialContext = context;
  }

  // Generate AI-powered response using Gemini
  async generateAIResponse(userInput: string): Promise<ChatMessage> {
    try {
      if (!this.financialContext) {
        return this.getFallbackResponse(userInput);
      }

      // Create context-aware prompt
      const contextPrompt = this.buildContextPrompt(userInput);
      
      // Get AI response from Gemini
      const aiResponse = await geminiAIService.generateText(contextPrompt);
      
      // Parse and enhance the response
      const enhancedResponse = this.enhanceResponse(aiResponse, userInput);
      
      const message: ChatMessage = {
        id: Date.now().toString(),
        text: enhancedResponse.text,
        isUser: false,
        timestamp: new Date(),
        type: enhancedResponse.type,
        suggestions: enhancedResponse.suggestions,
        actions: enhancedResponse.actions,
      };

      this.conversationHistory.push(message);
      this.saveConversationHistory();
      
      return message;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(userInput);
    }
  }

  // Build context-aware prompt for AI
  private buildContextPrompt(userInput: string): string {
    const context = this.financialContext!;
    const recentMessages = this.conversationHistory.slice(-5); // Last 5 messages for context
    
    return `You are BudgetBuddy, a helpful financial assistant. Here's the user's current financial situation:

FINANCIAL CONTEXT:
- Total Spent: $${context.totalSpent.toFixed(2)} (${context.period})
- Total Income: $${context.totalIncome.toFixed(2)}
- Monthly Savings: $${context.monthlySavings.toFixed(2)}
- Budget Status: ${context.budgetStatus}
- Top Spending Categories: ${context.topCategories.map(c => `${c.name}: $${c.spent.toFixed(2)} (${c.percentage.toFixed(1)}%)`).join(', ')}

RECENT CONVERSATION:
${recentMessages.map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`).join('\n')}

USER'S CURRENT MESSAGE: "${userInput}"

Please provide a helpful, personalized response that:
1. Addresses their specific question/concern
2. Uses their actual financial data for context
3. Offers actionable advice when appropriate
4. Suggests relevant follow-up questions or actions
5. Maintains a friendly, supportive tone

Keep your response concise but informative (2-3 paragraphs max).`;
  }

  // Enhance AI response with suggestions and actions
  private enhanceResponse(aiResponse: string, userInput: string): {
    text: string;
    type: 'text' | 'suggestion' | 'action';
    suggestions?: string[];
    actions?: ChatAction[];
  } {
    const suggestions: string[] = [];
    const actions: ChatAction[] = [];

    // Add contextual suggestions based on user input
    if (userInput.toLowerCase().includes('budget') || userInput.toLowerCase().includes('spending')) {
      suggestions.push('View my budget breakdown', 'Set spending goals', 'Analyze my spending patterns');
      actions.push(
        { id: 'view_budget', label: 'View Budget', action: 'navigate_to_budget', icon: 'chart.pie' },
        { id: 'set_goals', label: 'Set Goals', action: 'open_budget_goals', icon: 'target' }
      );
    }

    if (userInput.toLowerCase().includes('save') || userInput.toLowerCase().includes('money')) {
      suggestions.push('Create a savings plan', 'Find ways to cut expenses', 'Set up automatic savings');
      actions.push(
        { id: 'savings_plan', label: 'Savings Plan', action: 'create_savings_plan', icon: 'piggybank' },
        { id: 'cut_expenses', label: 'Cut Expenses', action: 'analyze_expenses', icon: 'scissors' }
      );
    }

    if (userInput.toLowerCase().includes('transaction') || userInput.toLowerCase().includes('expense')) {
      suggestions.push('Add new expense', 'Categorize transactions', 'Review recent spending');
      actions.push(
        { id: 'add_expense', label: 'Add Expense', action: 'add_expense', icon: 'plus' },
        { id: 'view_transactions', label: 'View Transactions', action: 'navigate_to_transactions', icon: 'list' }
      );
    }

    return {
      text: aiResponse,
      type: suggestions.length > 0 ? 'suggestion' : 'text',
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      actions: actions.length > 0 ? actions : undefined,
    };
  }

  // Fallback response when AI is not available
  private getFallbackResponse(userInput: string): ChatMessage {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        id: Date.now().toString(),
        text: "Hi! I'm BudgetBuddy 💰 I can help with spending analysis, budgeting, and savings tips. What do you need?",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestion',
        suggestions: ['Analyze my spending', 'Help with budgeting', 'Create savings plan'],
      };
    }

    if (input.includes('help') || input.includes('what can you do')) {
      return {
        id: Date.now().toString(),
        text: "I help with spending analysis, budgeting, and savings tips 📊 Ask me about your finances!",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestion',
        suggestions: ['Analyze my spending', 'Help with budgeting', 'Create savings plan'],
      };
    }

    return {
      id: Date.now().toString(),
      text: "Ask me about your spending, budgeting, or savings goals 💡 What do you need help with?",
      isUser: false,
      timestamp: new Date(),
      type: 'suggestion',
      suggestions: ['Analyze my spending', 'Help with budgeting', 'Create savings plan'],
    };
  }

  // Get conversation history
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  // Add message to history
  addMessage(message: ChatMessage) {
    this.conversationHistory.push(message);
    this.saveConversationHistory();
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
    this.saveConversationHistory();
  }

  // Load conversation history from storage
  private loadConversationHistory() {
    try {
      // In a real app, this would load from AsyncStorage or similar
      // For now, we'll start with an empty history
      this.conversationHistory = [];
    } catch (error) {
      console.error('Error loading conversation history:', error);
      this.conversationHistory = [];
    }
  }

  // Save conversation history to storage
  private saveConversationHistory() {
    try {
      // In a real app, this would save to AsyncStorage or similar
      // For now, we'll just keep it in memory
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  }
}

export const chatbotService = new ChatbotService();

