import AddExpenseModal from '@/components/AddExpenseModal';
import PieChart from '@/components/PieChart';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getSpendingByCategory, mockCategories, mockInsights, mockTransactions } from '@/services/mockData';
import { AppDispatch, RootState } from '@/store';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { fetchTransactions } from '@/store/slices/transactionsSlice';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const budgetPeriod = useSelector((state: RootState) => state.budgetSettings.period);
  const totalBudget = useSelector((state: RootState) => state.budgetSettings.totalBudget);
  const transactionsLoading = useSelector((state: RootState) => state.transactions.loading);
  const categoriesLoading = useSelector((state: RootState) => state.categories.loading);
  const transactionsError = useSelector((state: RootState) => state.transactions.error);
  const categoriesError = useSelector((state: RootState) => state.categories.error);
  
  // Local state
  const [currentSpendingView, setCurrentSpendingView] = useState(0);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  
  // Test user ID (hardcoded for now)
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchTransactions(userId));
    dispatch(fetchCategories(userId));
  }, [dispatch]);
  
  // Use fetched data from database, fallback to mock data if empty
  const allTransactions = transactions && transactions.length > 0 ? transactions : mockTransactions;
  const allCategories = categories && categories.length > 0 ? categories : mockCategories;
  const spendingData = getSpendingByCategory(allTransactions, allCategories)
    .filter(category => category.spent > 0) // Only show categories with spending
    .sort((a, b) => b.spent - a.spent); // Sort by spending amount (highest first)
  
  
  // Check if using real data or mock data
  const isUsingRealData = transactions && transactions.length > 0 && categories && categories.length > 0;
  const dataSource = isUsingRealData ? 'Database' : 'Demo Data';
  const totalSpent = spendingData.reduce((sum, category) => sum + category.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  // Show loading state
  if (transactionsLoading || categoriesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your financial data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Show error state
  if (transactionsError || categoriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {transactionsError || categoriesError}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              dispatch(fetchTransactions(userId));
              dispatch(fetchCategories(userId));
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Prepare data for pie chart (only categories with spending)
  const pieChartData = spendingData
    .filter(category => category.spent > 0)
    .map(category => ({
      id: category.id,
      name: category.name,
      value: category.spent,
      color: category.color,
      percentage: category.percentage,
    }));

  const handleConnectBank = () => {
    Alert.alert(
      'Connect Bank Account',
      'This feature will allow you to automatically import transactions from your bank account using secure banking APIs like Plaid or Yodlee.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Learn More', onPress: () => {} },
        { text: 'Connect', onPress: () => {} },
      ]
    );
  };

  const quickActions = [
    {
      id: '1',
      title: 'Add Expense',
      subtitle: 'Enter expense manually',
      icon: 'plus.circle.fill',
      color: '#96CEB4',
      onPress: () => setShowAddExpenseModal(true),
    },
    {
      id: '2',
      title: 'Scan Receipt',
      subtitle: 'Add expense from receipt',
      icon: 'camera.fill',
      color: '#4ECDC4',
      onPress: () => router.push('/scanner'),
    },
    {
      id: '3',
      title: 'Connect Bank',
      subtitle: 'Import transactions',
      icon: 'building.2.fill',
      color: '#45B7D1',
      onPress: handleConnectBank,
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return 'exclamationmark.triangle.fill';
      case 'tip': return 'lightbulb.fill';
      case 'achievement': return 'star.fill';
      default: return 'info.circle.fill';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return '#FF6B6B';
      case 'tip': return '#4ECDC4';
      case 'achievement': return '#96CEB4';
      default: return '#666';
    }
  };

  const goToView = (index: number) => {
    setCurrentSpendingView(index);
  };

  const handleViewAllCategories = () => {
    router.push('/insights');
  };

  const handleViewAllTransactions = () => {
    // For now, show an alert. In a real app, this would navigate to a transactions screen
    Alert.alert(
      'All Transactions',
      'This would show a detailed list of all your transactions with filtering and search options.',
      [{ text: 'OK' }]
    );
  };

  const handleSetReminder = () => {
    Alert.alert(
      'Set Reminder',
      'You will be reminded to check your weekly financial report in 2 days.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Reminder', onPress: () => {} },
      ]
    );
  };

  const handleTransactionPress = (transaction: any) => {
    Alert.alert(
      'Transaction Details',
      `Description: ${transaction.description}\nAmount: $${transaction.amount.toFixed(2)}\nDate: ${new Date(transaction.date).toLocaleDateString()}\nCategory: ${transaction.category}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Dashboard</ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your spending and get AI insights
          </ThemedText>
          <View style={styles.dataSourceIndicator}>
            <ThemedText style={styles.dataSourceText}>
              📊 {dataSource} • {allTransactions.length} transactions
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <ThemedText type="subtitle">{budgetPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Budget</ThemedText>
            <ThemedText style={styles.budgetAmount}>${totalBudget.toLocaleString()}</ThemedText>
          </View>
          <View style={styles.budgetProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                    backgroundColor: totalSpent > totalBudget ? '#FF6B6B' : '#4ECDC4'
                  }
                ]} 
              />
            </View>
            <View style={styles.budgetStats}>
              <ThemedText style={styles.spentAmount}>Spent: ${totalSpent.toFixed(2)}</ThemedText>
              <ThemedText style={[
                styles.remainingAmount,
                { color: remainingBudget >= 0 ? '#96CEB4' : '#FF6B6B' }
              ]}>
                {remainingBudget >= 0 ? 'Remaining' : 'Over budget'}: ${Math.abs(remainingBudget).toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.spendingCard}>
          <View style={styles.spendingHeader}>
            <ThemedText type="subtitle" style={styles.cardTitle}>Spending Analysis</ThemedText>
            <View style={styles.viewTabs}>
              <TouchableOpacity 
                style={[styles.tab, currentSpendingView === 0 && styles.activeTab]}
                onPress={() => goToView(0)}
              >
                <ThemedText style={[styles.tabText, currentSpendingView === 0 && styles.activeTabText]}>
                  List
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, currentSpendingView === 1 && styles.activeTab]}
                onPress={() => goToView(1)}
              >
                <ThemedText style={[styles.tabText, currentSpendingView === 1 && styles.activeTabText]}>
                  Chart
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.swipeContainer}>
            {/* List View */}
            {currentSpendingView === 0 && (
              <View style={styles.swipePage}>
                <View style={styles.categoriesList}>
                  {spendingData.slice(0, 4).map((category) => (
                    <View key={category.id} style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryIcon}>{category.icon}</Text>
                        <View style={styles.categoryDetails}>
                          <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                          <ThemedText style={styles.categoryPercentage}>
                            {category.percentage.toFixed(1)}%
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText style={styles.categoryAmount}>${category.spent.toFixed(2)}</ThemedText>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllCategories}>
                  <ThemedText style={styles.viewAllText}>View All Categories</ThemedText>
                  <IconSymbol name="chevron.right" size={16} color="#4ECDC4" />
                </TouchableOpacity>
              </View>
            )}

            {/* Chart View */}
            {currentSpendingView === 1 && (
              <View style={styles.swipePage}>
                <PieChart data={pieChartData} size={180} />
              </View>
            )}
          </View>
        </ThemedView>

        <ThemedView style={styles.insightsCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>AI Insights</ThemedText>
          {mockInsights.slice(0, 2).map((insight) => (
            <View key={insight.id} style={styles.insightItem}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIconContainer}>
                  <IconSymbol 
                    name={getInsightIcon(insight.type)} 
                    size={16} 
                    color={getInsightColor(insight.type)} 
                  />
                </View>
                <ThemedText style={styles.insightMessage}>
                  {insight.message}
                </ThemedText>
              </View>
            </View>
          ))}
        </ThemedView>

        <ThemedView style={styles.quickActionsCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.actionButton}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <IconSymbol name={action.icon as any} size={24} color={action.color} />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                  {action.title}
                </ThemedText>
                <ThemedText style={styles.actionSubtitle}>
                  {action.subtitle}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.recentTransactionsCard}>
          <View style={styles.transactionsHeader}>
            <ThemedText type="subtitle">Recent Transactions</ThemedText>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsList}>
            {allTransactions.slice(0, 3).map((transaction) => (
              <TouchableOpacity key={transaction.id} style={styles.transactionItem} onPress={() => handleTransactionPress(transaction)}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionIcon}>
                    {mockCategories.find(c => c.id === transaction.category)?.icon || '📦'}
                  </Text>
                  <View style={styles.transactionDetails}>
                    <ThemedText style={styles.transactionDescription}>
                      {transaction.description}
                    </ThemedText>
                    <ThemedText style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'expense' ? '#FF6B6B' : '#96CEB4' }
                ]}>
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.nextReportCard}>
          <View style={styles.reportInfo}>
            <IconSymbol name="clock.fill" size={20} color="#4ECDC4" />
            <View style={styles.reportDetails}>
              <ThemedText type="defaultSemiBold">Next Report</ThemedText>
              <ThemedText style={styles.reportSubtext}>
                Weekly insights available in 2 days
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.remindButton} onPress={handleSetReminder}>
            <ThemedText style={styles.remindButtonText}>Set Reminder</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
      
      <AddExpenseModal
        visible={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  dataSourceIndicator: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dataSourceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  budgetProgress: {
    gap: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  spendingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  spendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewTabs: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  swipeContainer: {
    minHeight: 280,
  },
  swipePage: {
    width: '100%',
  },
  cardTitle: {
    marginBottom: 16,
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    opacity: 0.6,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
  },
  viewAllText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  insightsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightMessage: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  recentTransactionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextReportCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportDetails: {
    marginLeft: 12,
    flex: 1,
  },
  reportSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  remindButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  remindButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
