import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getSpendingByCategory, mockTransactions } from '@/services/mockData';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const { width } = Dimensions.get('window');

// Mock categories for analysis (matching mockData.ts)
const mockCategories = [
  { id: '1', name: 'Food & Dining', budget: 600, color: '#FF6B6B' },
  { id: '2', name: 'Transportation', budget: 400, color: '#4ECDC4' },
  { id: '3', name: 'Entertainment', budget: 150, color: '#96CEB4' },
  { id: '4', name: 'Bills & Utilities', budget: 1500, color: '#FFEAA7' },
  { id: '5', name: 'Healthcare', budget: 200, color: '#DDA0DD' },
  { id: '6', name: 'Shopping', budget: 300, color: '#45B7D1' },
];

export default function ChatbotScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your MoneyMate assistant. I can help you with budgeting, expense tracking, and financial advice. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Hide keyboard after sending message
    Keyboard.dismiss();

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Analyze user's spending data
    const spendingData = getSpendingByCategory(mockTransactions, mockCategories);
    const totalSpent = spendingData.reduce((sum, category) => sum + category.spent, 0);
    const totalBudget = mockCategories.reduce((sum, category) => sum + category.budget, 0);
    const monthlyIncome = 4000; // Mock monthly income
    const monthlySavings = monthlyIncome - totalSpent;
    
    // Car buying advice with personalized data
    if (input.includes('car') || input.includes('buy') || input.includes('vehicle') || input.includes('automobile')) {
      const carBudget = monthlySavings * 12; // Annual savings potential
      const recommendedCarPrice = carBudget * 0.8; // 80% of annual savings
      
      return `Based on your current spending patterns, I can help you plan for a car purchase! 

📊 Your Financial Snapshot:
• Monthly Income: $${monthlyIncome.toLocaleString()}
• Monthly Expenses: $${totalSpent.toLocaleString()}
• Monthly Savings: $${monthlySavings.toLocaleString()}
• Annual Savings Potential: $${carBudget.toLocaleString()}

🚗 Car Buying Recommendations:
• Recommended car budget: $${recommendedCarPrice.toLocaleString()}
• Down payment (20%): $${(recommendedCarPrice * 0.2).toLocaleString()}
• Monthly payment (if financing): $${(recommendedCarPrice * 0.8 / 60).toLocaleString()}/month

💡 To save faster for a car:
• Reduce dining out (you spent $${spendingData.find(c => c.name === 'Food & Dining')?.spent || 0} this month)
• Cut entertainment expenses (you spent $${spendingData.find(c => c.name === 'Entertainment')?.spent || 0} this month)
• Consider a used car to reduce costs

Would you like me to create a specific savings plan for your car purchase?`;
    }
    
    // Budget analysis with real data
    if (input.includes('budget') || input.includes('spending') || input.includes('analysis')) {
      const topCategory = spendingData.reduce((max, category) => 
        category.spent > max.spent ? category : max
      );
      const overBudgetCategories = spendingData.filter(cat => cat.spent > cat.budget);
      
      return `Here's your personalized budget analysis:

📈 Monthly Overview:
• Total Spent: $${totalSpent.toLocaleString()}
• Total Budget: $${totalBudget.toLocaleString()}
• Remaining: $${(totalBudget - totalSpent).toLocaleString()}

🏆 Top Spending Category:
• ${topCategory.name}: $${topCategory.spent.toLocaleString()} (${((topCategory.spent/totalSpent)*100).toFixed(1)}% of total)

⚠️ Over Budget Categories:
${overBudgetCategories.length > 0 ? 
  overBudgetCategories.map(cat => `• ${cat.name}: $${cat.spent.toLocaleString()} (over by $${(cat.spent - cat.budget).toLocaleString()})`).join('\n') :
  '• Great job! You\'re within budget in all categories!'
}

💡 Recommendations:
• Focus on reducing ${topCategory.name} expenses
• Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings
• Your current savings rate: ${((monthlySavings/monthlyIncome)*100).toFixed(1)}%

Would you like specific tips for any category?`;
    }
    
    // Savings advice with personalized data
    if (input.includes('save') || input.includes('saving') || input.includes('money')) {
      const emergencyFund = monthlyIncome * 6; // 6 months of expenses
      const currentEmergencyFund = 2000; // Mock current emergency fund
      const monthsToEmergencyFund = Math.ceil((emergencyFund - currentEmergencyFund) / monthlySavings);
      
      return `Let's boost your savings! Here's your personalized savings plan:

💰 Current Situation:
• Monthly Savings: $${monthlySavings.toLocaleString()}
• Current Emergency Fund: $${currentEmergencyFund.toLocaleString()}
• Target Emergency Fund: $${emergencyFund.toLocaleString()}

🎯 Savings Goals:
• Emergency Fund (6 months): $${emergencyFund.toLocaleString()}
• Time to reach goal: ${monthsToEmergencyFund} months
• Annual savings potential: $${(monthlySavings * 12).toLocaleString()}

💡 Quick Wins to Save More:
• Cut dining out by 50%: Save $${Math.round((spendingData.find(c => c.name === 'Food & Dining')?.spent || 0) * 0.5)}/month
• Reduce entertainment: Save $${Math.round((spendingData.find(c => c.name === 'Entertainment')?.spent || 0) * 0.3)}/month
• Total additional savings: $${Math.round(((spendingData.find(c => c.name === 'Food & Dining')?.spent || 0) * 0.5) + ((spendingData.find(c => c.name === 'Entertainment')?.spent || 0) * 0.3))}/month

Would you like me to set up automatic savings goals?`;
    }
    
    // Investment advice
    if (input.includes('invest') || input.includes('investment') || input.includes('stock')) {
      const investableAmount = monthlySavings * 0.3; // 30% of monthly savings
      
      return `Based on your current financial situation, here's my investment advice:

📊 Your Investment Capacity:
• Monthly Investable Amount: $${investableAmount.toLocaleString()}
• Annual Investment Potential: $${(investableAmount * 12).toLocaleString()}

🎯 Investment Strategy:
• Emergency Fund First: Complete your $${(4000 * 6).toLocaleString()} emergency fund
• Then invest 30% of savings: $${investableAmount.toLocaleString()}/month
• Consider: Low-cost index funds, Roth IRA, 401(k) match

💡 Recommended Allocation:
• 70% Stock Index Funds (S&P 500)
• 20% Bond Index Funds
• 10% International Index Funds

⚠️ Remember: I'm not a financial advisor. Consult a professional for personalized investment advice.

Would you like help setting up investment goals?`;
    }
    
    // Debt management
    if (input.includes('debt') || input.includes('loan') || input.includes('credit')) {
      return `Let's tackle your debt strategically! Here's a personalized debt payoff plan:

📊 Debt Payoff Strategy:
• Pay minimums on all debts
• Put extra money toward highest interest rate debt
• Consider debt consolidation if rates are high

💡 Based on your $${monthlySavings.toLocaleString()}/month savings:
• You could pay an extra $${Math.round(monthlySavings * 0.2)}/month toward debt
• This could save you thousands in interest over time

🎯 Debt Payoff Methods:
• Avalanche Method: Pay highest interest first
• Snowball Method: Pay smallest balance first
• Both work, choose what motivates you more

Would you like me to create a specific debt payoff timeline?`;
    }
    
    // Expense tracking
    if (input.includes('expense') || input.includes('track') || input.includes('receipt')) {
      return `I can help you track expenses better! Here's what I see in your current spending:

📱 Current Tracking:
• Total transactions: ${mockTransactions.length}
• Receipt scans: ${mockTransactions.filter(t => t.source === 'receipt').length}
• Bank imports: ${mockTransactions.filter(t => t.source === 'bank').length}

📊 Top Merchants:
• ${mockTransactions.reduce((acc, t) => {
    const key = t.merchant ?? 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)} transactions

💡 Tracking Tips:
• Use the scanner for all receipts
• Set up automatic bank imports
• Review spending weekly
• Set category budgets

Would you like me to help you set up better expense tracking?`;
    }
    
    // Greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return `Hello! I'm your MoneyMate assistant. I've analyzed your spending and I'm here to help! 

Based on your recent transactions, I can see you've been spending on:
• Food & Dining: $${spendingData.find(c => c.name === 'Food & Dining')?.spent || 0}
• Transportation: $${spendingData.find(c => c.name === 'Transportation')?.spent || 0}
• Entertainment: $${spendingData.find(c => c.name === 'Entertainment')?.spent || 0}

What would you like to know about budgeting, saving, or financial planning?`;
    }
    
    // Default response
    return `That's an interesting question! I'm here to help with your financial journey. 

Based on your current spending patterns, I can help you with:
• Budget analysis and optimization
• Savings strategies and goal setting
• Investment planning
• Debt management
• Expense tracking tips

What specific financial topic would you like to explore?`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>MoneyMate Assistant</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your AI financial advisor
        </ThemedText>
      </ThemedView>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.botMessage
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser 
                    ? [styles.userBubble, { backgroundColor: colors.tint }]
                    : [styles.botBubble, { backgroundColor: colors.background }]
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.isUser 
                    ? styles.userText 
                    : [styles.botText, { color: colors.text }]
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.timestamp,
                  message.isUser 
                    ? styles.userTimestamp 
                    : [styles.botTimestamp, { color: colors.icon }]
                ]}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <View style={[styles.messageBubble, styles.botBubble, { backgroundColor: colors.background }]}>
                <View style={styles.typingIndicator}>
                  <View style={[styles.typingDot, { backgroundColor: colors.tint }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.tint }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.tint }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about budgeting, expenses, or saving..."
            placeholderTextColor={colors.icon}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.tint : colors.icon + '40' }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <IconSymbol 
              name="paperplane.fill" 
              size={20} 
              color={inputText.trim() ? "white" : colors.icon} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: width < 400 ? 12 : 16,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 80,
    paddingTop: 8,
  },
  messageContainer: {
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: width < 400 ? '85%' : '80%',
    minWidth: 60,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  botBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  messageText: {
    fontSize: width < 400 ? 15 : 16,
    lineHeight: width < 400 ? 20 : 22,
    fontWeight: '400',
  },
  userText: {
    color: 'white',
  },
  botText: {
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.7,
    fontWeight: '400',
  },
  userTimestamp: {
    color: 'white',
    textAlign: 'right',
  },
  botTimestamp: {
    textAlign: 'left',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 12,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: width < 400 ? 15 : 16,
    fontWeight: '400',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
});
