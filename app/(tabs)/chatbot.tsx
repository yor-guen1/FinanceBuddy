import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { chatbotService, ChatMessage, FinancialContext } from '@/services/chatbotService';
import { getSpendingByCategory, mockCategories, mockTransactions } from '@/services/mockData';
import { RootState } from '@/store';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

export default function ChatbotScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  // Redux state
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const categories = useSelector((state: RootState) => state.categories.categories);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m BudgetBuddy 💰 I can help with spending analysis, budgeting, and savings tips. What do you need?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Update financial context for AI responses
  const updateFinancialContext = () => {
    const allTransactions = transactions && transactions.length > 0 ? transactions : mockTransactions;
    const allCategories = categories && categories.length > 0 ? categories : mockCategories;
    const spendingData = getSpendingByCategory(allTransactions, allCategories);
    const totalSpent = spendingData.reduce((sum, category) => sum + category.spent, 0);
    
    // Calculate income
    const incomeTransactions = allTransactions.filter(t => t.type === 'income');
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlySavings = totalIncome - totalSpent;
    
    // Get top categories
    const topCategories = spendingData
      .filter(cat => cat.spent > 0)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5)
      .map(cat => ({
        name: cat.name,
        spent: cat.spent,
        percentage: (cat.spent / totalSpent) * 100
      }));
    
    // Get recent transactions
    const recentTransactions = [...allTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(tx => ({
        description: tx.description,
        amount: tx.amount,
        category: tx.category,
        date: tx.date
      }));
    
    // Determine budget status
    const budgetStatus = totalSpent > 1000 ? 'over_budget' : totalSpent < 500 ? 'under_budget' : 'on_track';
    
    const context: FinancialContext = {
      totalSpent,
      totalIncome,
      monthlySavings,
      topCategories,
      budgetGoals: [], // TODO: Add budget goals integration
      recentTransactions,
      budgetStatus,
      period: 'monthly' // TODO: Get from budget settings
    };
    
    chatbotService.setFinancialContext(context);
  };

  // Initialize financial context on component mount
  useEffect(() => {
    updateFinancialContext();
  }, [transactions, categories]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
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

    try {
      // Update financial context for AI
      updateFinancialContext();
      
      // Get AI-powered response
      const botMessage = await chatbotService.generateAIResponse(inputText.trim());
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleActionPress = (action: string) => {
    // Handle quick actions
    // TODO: Implement navigation to specific screens
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.aiIconContainer}>
            <IconSymbol name="brain.head.profile" size={28} color="#4ECDC4" />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="title" style={styles.headerTitle}>BudgetBuddy AI</ThemedText>
            <ThemedText style={styles.subtitle}>
              Your intelligent financial assistant
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom + 90 : insets.bottom + 50}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              <View style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.botMessage,
                { 
                  backgroundColor: message.isUser ? '#4ECDC4' : '#ffffff',
                  shadowColor: message.isUser ? '#4ECDC4' : '#000000'
                }
              ]}>
                <ThemedText style={[
                  styles.messageText,
                  { color: message.isUser ? 'white' : colors.text }
                ]}>
                  {message.text}
                </ThemedText>
                <ThemedText style={[
                  styles.messageTime,
                  { color: message.isUser ? 'rgba(255,255,255,0.7)' : colors.text + '80' }
                ]}>
                  {formatTime(message.timestamp)}
                </ThemedText>
              </View>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionButton}
                      onPress={() => handleSuggestionPress(suggestion)}
                      activeOpacity={0.7}
                    >
                      <IconSymbol name="lightbulb.fill" size={14} color="#4ECDC4" />
                      <ThemedText style={styles.suggestionText}>{suggestion}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {/* Actions */}
              {message.actions && message.actions.length > 0 && (
                <View style={styles.actionsContainer}>
                  {message.actions.map((action) => (
                    <TouchableOpacity
                      key={action.id}
                      style={styles.actionButton}
                      onPress={() => handleActionPress(action.action)}
                    >
                      {action.icon && <IconSymbol name={action.icon as any} size={16} color="#4ECDC4" />}
                      <ThemedText style={styles.actionText}>{action.label}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={[styles.messageBubble, styles.botMessage, { backgroundColor: '#ffffff' }]}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color="#4ECDC4" />
                  <ThemedText style={[styles.messageText, { marginLeft: 8, color: colors.text }]}>
                    AI is thinking...
                  </ThemedText>
                </View>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { 
          backgroundColor: colors.background,
          paddingBottom: Math.max(20, insets.bottom + 15)
        }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, { color: colors.text, borderColor: colors.text + '30' }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your spending, budget, or savings..."
              placeholderTextColor={colors.text + '60'}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: inputText.trim() ? '#4ECDC4' : '#e0e0e0' }]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              activeOpacity={0.8}
            >
              <IconSymbol name="paperplane.fill" size={20} color={inputText.trim() ? "white" : "#999"} />
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4ECDC420',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: width * 0.8,
    padding: 16,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 4,
  },
  suggestionButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ECDC430',
  },
  suggestionText: {
    fontSize: 14,
    color: '#4ECDC4',
    marginLeft: 6,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#4ECDC4',
    marginLeft: 6,
    fontWeight: '600',
  },
  typingContainer: {
    marginBottom: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ECDC4',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
