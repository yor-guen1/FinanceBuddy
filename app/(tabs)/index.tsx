import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getSpendingByCategory, getWeeklySpending, mockCategories, mockInsights, mockTransactions } from '@/services/mockData';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  // Calculate current month spending
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyTransactions = mockTransactions.filter((t) => new Date(t.date) >= monthStart);

  const spendingData = getSpendingByCategory(monthlyTransactions, mockCategories);
  const totalSpent = spendingData.reduce((sum, category) => sum + category.spent, 0);
  const totalBudget = 2000;
  const remainingBudget = totalBudget - totalSpent;

  // Trend: compare ideal-to-date vs. current spending
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const elapsedDays = now.getDate();
  const idealSpentToDate = (elapsedDays / daysInMonth) * totalBudget;
  // Percentage-based trend (actual utilization vs. ideal utilization)
  const idealUtilizationPercent = (elapsedDays / daysInMonth) * 100;
  const actualUtilizationPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const deviationPercent = actualUtilizationPercent - idealUtilizationPercent; // positive = overspending
  const tightThreshold = 5; // percentage points for "on track"
  const isOnTrack = Math.abs(deviationPercent) <= tightThreshold;
  const isOver = deviationPercent > tightThreshold;
  const isUnder = deviationPercent < -tightThreshold;
  const trendColor = isOnTrack ? '#2ecc71' : isOver ? '#e74c3c' : '#2E86C1';
  const trendIcon = isOnTrack ? 'checkmark.circle.fill' : isOver ? 'arrow.up.right' : 'arrow.down.right';
  const trendLabel = isOnTrack ? 'On track' : isOver ? 'Overspending' : 'Under plan';

  // Weekly average and monthly projection
  const weeklyExpenses = getWeeklySpending(monthlyTransactions);
  const weeklyAverage = weeklyExpenses.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
  const monthlyProjection = (actualUtilizationPercent / Math.max(idealUtilizationPercent, 0.0001)) * totalBudget;

  // Dynamic KPI card palette based on trend state
  const trendCardColors = isOnTrack
    ? { borderColor: '#ABEBC6', backgroundColor: '#E9F7EF', iconBg: '#D5F5E3' }
    : isOver
      ? { borderColor: '#F5B7B1', backgroundColor: '#FDEDEC', iconBg: '#FADBD8' }
      : { borderColor: '#AED6F1', backgroundColor: '#EBF5FB', iconBg: '#D6EAF8' };

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
      id: '4',
      title: 'Add Expense',
      subtitle: 'Enter manually',
      icon: 'plus.circle.fill',
      color: '#96CEB4',
      onPress: () => router.push('/add-transaction'),
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

        <ThemedView style={styles.trendCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Spending Trends</ThemedText>
          <View style={styles.trendRows}>
            <View style={styles.trendRowLine}>
              <ThemedText style={styles.trendRowLabel}>Expected Trend</ThemedText>
              <View style={styles.trendRight}>
                <ThemedText type="title" style={styles.trendPercent}>{idealUtilizationPercent.toFixed(0)}%</ThemedText>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.trendRowLine}>
              <ThemedText style={styles.trendRowLabel}>Current Trend</ThemedText>
              <View style={styles.trendRight}>
                <ThemedText type="title" style={styles.trendPercent}>{actualUtilizationPercent.toFixed(0)}%</ThemedText>
                <View style={[
                  styles.deltaPill,
                  { backgroundColor: (actualUtilizationPercent <= idealUtilizationPercent ? '#2ecc71' : '#e74c3c') + '20' }
                ]}>
                  <IconSymbol 
                    name={actualUtilizationPercent <= idealUtilizationPercent ? 'arrow.down.right' : 'arrow.up.right'} 
                    size={12} 
                    color={actualUtilizationPercent <= idealUtilizationPercent ? '#2ecc71' : '#e74c3c'} 
                  />
                  <Text style={[
                    styles.deltaText,
                    { color: actualUtilizationPercent <= idealUtilizationPercent ? '#2ecc71' : '#e74c3c' }
                  ]}>
                    {`${Math.abs(Number((actualUtilizationPercent - idealUtilizationPercent).toFixed(0)))}%`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
              <View style={styles.budgetRightCol}>
                <ThemedText style={[
                  styles.remainingAmount,
                  { color: remainingBudget >= 0 ? '#96CEB4' : '#FF6B6B' }
                ]}>
                  {remainingBudget >= 0 ? 'Remaining' : 'Over budget'}: ${Math.abs(remainingBudget).toFixed(2)}
                </ThemedText>
              </View>
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
  budgetRightCol: {
    alignItems: 'flex-end',
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  trendSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
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
  trendCard: {
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
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  kpiIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  kpiValue: {
    marginTop: 2,
  },
  kpiFooter: {
    marginTop: 10,
  },
  trendRows: {
    marginTop: 4,
  },
  trendRowLine: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendRowLabel: {
    opacity: 0.7,
  },
  trendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendPercent: {
    minWidth: 56,
    textAlign: 'right',
  },
  deltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  deltaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
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
