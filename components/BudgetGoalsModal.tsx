import { mockCategories } from '@/services/mockData';
import { RootState } from '@/store';
import { addBudgetGoal, deleteBudgetGoal, updateBudgetGoal } from '@/store/slices/budgetSlice';
import React, { useEffect, useState } from 'react';
import {
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
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface BudgetGoalsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BudgetGoalsModal({ visible, onClose }: BudgetGoalsModalProps) {
  const dispatch = useDispatch();
  const budgetGoals = useSelector((state: RootState) => state.budget.goals);
  const categories = useSelector((state: RootState) => state.categories.categories);
  
  // Use real categories if available, fallback to mock data
  const allCategories = categories && categories.length > 0 ? categories : mockCategories;
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    if (editingGoal) {
      const goal = budgetGoals.find(g => g.id === editingGoal);
      if (goal) {
        setAmount(goal.amount.toString());
        setSelectedCategory(goal.categoryId);
        setPeriod(goal.period);
      }
    } else {
      setAmount('');
      setSelectedCategory('');
      setPeriod('monthly');
    }
  }, [editingGoal, budgetGoals]);

  const handleSaveGoal = () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const now = new Date();
    const startDate = now.toISOString();
    const endDate = new Date(now.getTime() + (period === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString();

    if (editingGoal) {
      dispatch(updateBudgetGoal({
        id: editingGoal,
        updates: {
          amount: numericAmount,
          categoryId: selectedCategory,
          period,
          startDate,
          endDate,
        }
      }));
    } else {
      const newGoal = {
        id: Date.now().toString(),
        categoryId: selectedCategory,
        amount: numericAmount,
        period,
        startDate,
        endDate,
      };
      dispatch(addBudgetGoal(newGoal));
    }

    setEditingGoal(null);
    setAmount('');
    setSelectedCategory('');
    setPeriod('monthly');
  };

  const handleEditGoal = (goalId: string) => {
    setEditingGoal(goalId);
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Budget Goal',
      'Are you sure you want to delete this budget goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteBudgetGoal(goalId)) },
      ]
    );
  };

  const handleClose = () => {
    setEditingGoal(null);
    setAmount('');
    setSelectedCategory('');
    setPeriod('monthly');
    onClose();
  };

  const getCategoryName = (categoryId: string) => {
    return allCategories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryIcon = (categoryId: string) => {
    return allCategories.find(c => c.id === categoryId)?.icon || '📦';
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
          <ThemedText type="title" style={styles.title}>Budget Goals</ThemedText>
          <TouchableOpacity onPress={handleSaveGoal} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>
              {editingGoal ? 'Update' : 'Add'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.form}>
            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Category *</ThemedText>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
              >
                {allCategories.map((category) => (
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

            {/* Period Selection */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Period *</ThemedText>
              <View style={styles.periodContainer}>
                <TouchableOpacity
                  style={[styles.periodButton, period === 'weekly' && styles.selectedPeriodButton]}
                  onPress={() => setPeriod('weekly')}
                >
                  <ThemedText style={[styles.periodText, period === 'weekly' && styles.selectedPeriodText]}>
                    Weekly
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.periodButton, period === 'monthly' && styles.selectedPeriodButton]}
                  onPress={() => setPeriod('monthly')}
                >
                  <ThemedText style={[styles.periodText, period === 'monthly' && styles.selectedPeriodText]}>
                    Monthly
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>

          {/* Existing Goals */}
          <ThemedView style={styles.goalsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Current Goals</ThemedText>
            {budgetGoals.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="target" size={48} color="#ccc" />
                <ThemedText style={styles.emptyText}>No budget goals set</ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Set spending limits for different categories
                </ThemedText>
              </View>
            ) : (
              <View style={styles.goalsList}>
                {budgetGoals.map((goal) => (
                  <View key={goal.id} style={styles.goalItem}>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalIcon}>{getCategoryIcon(goal.categoryId)}</Text>
                      <View style={styles.goalDetails}>
                        <ThemedText style={styles.goalCategory}>
                          {getCategoryName(goal.categoryId)}
                        </ThemedText>
                        <ThemedText style={styles.goalAmount}>
                          ${goal.amount.toFixed(2)} / {goal.period}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.goalActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditGoal(goal.id)}
                      >
                        <IconSymbol name="pencil" size={16} color="#4ECDC4" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteGoal(goal.id)}
                      >
                        <IconSymbol name="trash" size={16} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ThemedView>
        </ScrollView>
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
  content: {
    flex: 1,
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
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriodButton: {
    backgroundColor: '#4ECDC4',
  },
  periodText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  selectedPeriodText: {
    color: 'white',
    fontWeight: '600',
  },
  goalsSection: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    opacity: 0.6,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.4,
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalDetails: {
    flex: 1,
  },
  goalCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalAmount: {
    fontSize: 14,
    opacity: 0.6,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
});

