import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getSpendingByCategory, mockInsights } from '@/services/mockData';
import { AppDispatch, RootState } from '@/store';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { fetchTransactions } from '@/store/slices/transactionsSlice';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const transactionsLoading = useSelector((state: RootState) => state.transactions.loading);
  const categoriesLoading = useSelector((state: RootState) => state.categories.loading);
  const transactionsError = useSelector((state: RootState) => state.transactions.error);
  const categoriesError = useSelector((state: RootState) => state.categories.error);
  
  // Test user ID (hardcoded for now)
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchTransactions(userId));
    dispatch(fetchCategories(userId));
  }, [dispatch, userId]);
  
  // Show loading state
  if (transactionsLoading || categoriesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading insights...</Text>
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
        </View>
      </SafeAreaView>
    );
  }
  
  // Calculate spending data from transactions
  const spendingData = getSpendingByCategory(transactions || [], categories || []);
  const insights = mockInsights; // For now, keep using mock insights

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
          <ThemedText type="title">Weekly Insights</ThemedText>
          <ThemedText style={styles.subtitle}>
            Your spending analysis and AI-powered recommendations
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.summaryCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>This Week's Spending</ThemedText>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Total Spent</ThemedText>
              <ThemedText type="title" style={styles.summaryValue}>$571.99</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Budget Remaining</ThemedText>
              <ThemedText type="title" style={[styles.summaryValue, styles.positiveValue]}>$1,428.01</ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.chartCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Spending by Category</ThemedText>
          <View style={styles.chartContainer}>
            {spendingData && spendingData.length > 0 ? spendingData.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <View style={styles.chartRow}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                    <ThemedText style={styles.categoryName}>{item.category}</ThemedText>
                  </View>
                  <ThemedText style={styles.categoryAmount}>${(item.spent || 0).toFixed(2)}</ThemedText>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${item.percentage}%`, 
                        backgroundColor: item.color 
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={styles.percentageText}>{(item.percentage || 0).toFixed(1)}%</ThemedText>
              </View>
            )) : (
              <ThemedText style={styles.noDataText}>No spending data available</ThemedText>
            )}
          </View>
        </ThemedView>

        <ThemedView style={styles.insightsCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>AI Insights</ThemedText>
          {insights.map((insight) => (
            <View key={insight.id} style={styles.insightItem}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIconContainer}>
                  <IconSymbol 
                    name={getInsightIcon(insight.type)} 
                    size={20} 
                    color={getInsightColor(insight.type)} 
                  />
                </View>
                <View style={styles.insightContent}>
                  <ThemedText type="defaultSemiBold" style={styles.insightTitle}>
                    {insight.title}
                  </ThemedText>
                  <ThemedText style={styles.insightMessage}>
                    {insight.message}
                  </ThemedText>
                  <ThemedText style={styles.insightCategory}>
                    {insight.category}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </ThemedView>

        <ThemedView style={styles.trendsCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Spending Trends</ThemedText>
          <View style={styles.trendItem}>
            <View style={styles.trendInfo}>
              <ThemedText style={styles.trendLabel}>Weekly Average</ThemedText>
              <ThemedText style={styles.trendValue}>$485.50</ThemedText>
            </View>
            <View style={styles.trendChange}>
              <IconSymbol name="arrow.up.right" size={16} color="#FF6B6B" />
              <Text style={styles.trendChangeText}>+12%</Text>
            </View>
          </View>
          <View style={styles.trendItem}>
            <View style={styles.trendInfo}>
              <ThemedText style={styles.trendLabel}>Monthly Projection</ThemedText>
              <ThemedText style={styles.trendValue}>$2,287.96</ThemedText>
            </View>
            <View style={styles.trendChange}>
              <IconSymbol name="arrow.down.right" size={16} color="#96CEB4" />
              <Text style={styles.trendChangeText}>-5%</Text>
            </View>
          </View>
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
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  positiveValue: {
    color: '#96CEB4',
  },
  chartCard: {
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
  chartContainer: {
    gap: 16,
  },
  chartItem: {
    marginBottom: 8,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    flex: 1,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
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
  percentageText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'right',
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
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  insightCategory: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  trendsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  trendInfo: {
    flex: 1,
  },
  trendLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 2,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendChangeText: {
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
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
