import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { mockTransactions, mockCategories, mockInsights, getSpendingByCategory } from '@/services/mockData';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const spendingData = getSpendingByCategory(mockTransactions, mockCategories);
  const totalSpent = spendingData.reduce((sum, category) => sum + category.spent, 0);
  const totalBudget = 2000;
  const remainingBudget = totalBudget - totalSpent;

  const quickActions = [
    {
      id: '1',
      title: 'Scan Receipt',
      subtitle: 'Add expense from receipt',
      icon: 'camera.fill',
      color: '#4ECDC4',
      onPress: () => console.log('Scan receipt'),
    },
    {
      id: '2',
      title: 'Connect Bank',
      subtitle: 'Import transactions',
      icon: 'building.2.fill',
      color: '#45B7D1',
      onPress: () => console.log('Connect bank'),
    },
    {
      id: '3',
      title: 'Weekly Report',
      subtitle: 'View insights',
      icon: 'chart.bar.fill',
      color: '#96CEB4',
      onPress: () => console.log('Weekly report'),
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Dashboard</ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your spending and get AI insights
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <ThemedText type="subtitle">Monthly Budget</ThemedText>
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
          <ThemedText type="subtitle" style={styles.cardTitle}>Spending by Category</ThemedText>
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
          <TouchableOpacity style={styles.viewAllButton}>
            <ThemedText style={styles.viewAllText}>View All Categories</ThemedText>
            <IconSymbol name="chevron.right" size={16} color="#4ECDC4" />
          </TouchableOpacity>
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
                  <IconSymbol name={action.icon} size={24} color={action.color} />
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
            <TouchableOpacity>
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsList}>
            {mockTransactions.slice(0, 3).map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
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
              </View>
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
          <TouchableOpacity style={styles.remindButton}>
            <ThemedText style={styles.remindButtonText}>Set Reminder</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
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
});
