import { AIReceiptAnalysis, AIReceiptService } from '@/services/aiReceiptService';
import { CategoryService } from '@/services/categoryService';
import { createTransactionAsync } from '@/store/slices/transactionsSlice';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface AIExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  receiptImageUri?: string;
}

export default function AIExpenseModal({ visible, onClose, receiptImageUri }: AIExpenseModalProps) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIReceiptAnalysis | null>(null);
  const [showAIDetails, setShowAIDetails] = useState(false);

  useEffect(() => {
    if (visible && receiptImageUri) {
      analyzeReceiptWithAI();
    }
  }, [visible, receiptImageUri]);

  const analyzeReceiptWithAI = async () => {
    if (!receiptImageUri) return;
    
    setIsAnalyzing(true);
    try {
      // Use a test user ID for now - in production this would come from auth context
      const testUserId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID v4
      const analysis = await AIReceiptService.processReceiptWithAI(receiptImageUri, testUserId);
      setAiAnalysis(analysis);
      
      // Auto-fill form with AI analysis
      setAmount(analysis.total.toString());
      setDescription(analysis.items.map(item => item.name).join(', '));
      setMerchant(analysis.merchant);
      setSelectedCategory(analysis.suggestedCategory);
      
      // Show AI insights
      Alert.alert(
        'AI Analysis Complete',
        `I found ${analysis.items.length} items with ${analysis.confidence * 100}% confidence. The main category is ${analysis.suggestedCategory}.`,
        [
          { text: 'View Details', onPress: () => setShowAIDetails(true) },
          { text: 'Continue', onPress: () => setShowAIDetails(false) }
        ]
      );
    } catch (error) {
      console.error('AI analysis failed:', error);
      Alert.alert('AI Analysis Failed', 'Could not analyze the receipt. Please enter the details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddExpense = () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      amount: numericAmount,
      description,
      category: selectedCategory || '8', // Default to "Other" category ID
      date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      type: 'expense' as const,
      source: 'receipt' as const,
      merchant: merchant || undefined,
      location: location || undefined,
    };

    dispatch(createTransactionAsync(newTransaction));

    // Reset form
    setAmount('');
    setDescription('');
    setMerchant('');
    setLocation('');
    setSelectedCategory('');
    setAiAnalysis(null);
    setShowAIDetails(false);

    Alert.alert('Success', 'Expense added successfully!');
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setMerchant('');
    setLocation('');
    setSelectedCategory('');
    setAiAnalysis(null);
    setShowAIDetails(false);
    onClose();
  };

  const getCategoryIcon = (categoryName: string) => {
    return CategoryService.getCategoryIcon(categoryName);
  };

  const getCategoryName = (categoryName: string) => {
    return categoryName || 'Other';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#666" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            {isAnalyzing ? 'AI Analysis' : 'Add Expense'}
          </ThemedText>
          <TouchableOpacity onPress={handleAddExpense} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {isAnalyzing ? (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <ThemedText style={styles.analyzingText}>AI is analyzing your receipt...</ThemedText>
            <ThemedText style={styles.analyzingSubtext}>
              Extracting text, categorizing items, and generating insights
            </ThemedText>
          </View>
        ) : (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* AI Analysis Summary */}
            {aiAnalysis && (
              <ThemedView style={styles.aiSummaryCard}>
                <View style={styles.aiHeader}>
                  <IconSymbol name="sparkles" size={20} color="#4ECDC4" />
                  <ThemedText type="defaultSemiBold" style={styles.aiTitle}>AI Analysis</ThemedText>
                  <TouchableOpacity onPress={() => setShowAIDetails(!showAIDetails)}>
                    <ThemedText style={styles.toggleText}>
                      {showAIDetails ? 'Hide' : 'Show'} Details
                    </ThemedText>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.aiSummary}>
                  <View style={styles.aiStat}>
                    <ThemedText style={styles.aiStatLabel}>Confidence</ThemedText>
                    <ThemedText style={styles.aiStatValue}>
                      {(aiAnalysis.confidence * 100).toFixed(0)}%
                    </ThemedText>
                  </View>
                  <View style={styles.aiStat}>
                    <ThemedText style={styles.aiStatLabel}>Category</ThemedText>
                    <ThemedText style={styles.aiStatValue}>{aiAnalysis.suggestedCategory}</ThemedText>
                  </View>
                  <View style={styles.aiStat}>
                    <ThemedText style={styles.aiStatLabel}>Items</ThemedText>
                    <ThemedText style={styles.aiStatValue}>{aiAnalysis.items.length}</ThemedText>
                  </View>
                </View>

                {showAIDetails && (
                  <View style={styles.aiDetails}>
                    <ThemedText type="subtitle" style={styles.detailsTitle}>Spending Insights</ThemedText>
                    {aiAnalysis.spendingInsights.map((insight, index) => (
                      <View key={index} style={styles.insightItem}>
                        <IconSymbol name="lightbulb.fill" size={16} color="#FFEAA7" />
                        <ThemedText style={styles.insightText}>{insight}</ThemedText>
                      </View>
                    ))}

                    <ThemedText type="subtitle" style={styles.detailsTitle}>Budget Impact</ThemedText>
                    {aiAnalysis.budgetImpact.map((impact, index) => (
                      <View key={index} style={styles.budgetImpactItem}>
                        <ThemedText style={styles.impactCategory}>{impact.category}</ThemedText>
                        <ThemedText style={styles.impactAmount}>
                          ${impact.amount.toFixed(2)} ({impact.percentage.toFixed(1)}%)
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </ThemedView>
            )}

            <ThemedView style={styles.form}>
              {/* Amount Field */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Amount *</ThemedText>
                <View style={styles.amountContainer}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Description Field */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Description *</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What did you buy?"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Category Selection */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Category *</ThemedText>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesContainer}
                >
                  {CategoryService.getDefaultCategories().map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category.id && styles.selectedCategoryButton
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <ThemedText style={[
                        styles.categoryText,
                        selectedCategory === category.id && styles.selectedCategoryText
                      ]}>
                        {category.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Merchant Field */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Merchant (Optional)</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={merchant}
                  onChangeText={setMerchant}
                  placeholder="Store or business name"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Location Field */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Location (Optional)</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City or address"
                  placeholderTextColor="#999"
                />
              </View>
            </ThemedView>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  analyzingSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  aiSummaryCard: {
    margin: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    flex: 1,
    marginLeft: 8,
  },
  toggleText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  aiSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  aiStat: {
    alignItems: 'center',
  },
  aiStatLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  aiStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  aiDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsTitle: {
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  budgetImpactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  impactCategory: {
    fontSize: 14,
  },
  impactAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4ECDC4',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  selectedCategoryButton: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: 'white',
  },
});
