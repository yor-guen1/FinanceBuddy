import PieChart from '@/components/PieChart';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getWeeklySpending, mockTransactions } from '@/services/mockData';
import { useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const [chartPage, setChartPage] = useState(0);
  const [innerChartWidth, setInnerChartWidth] = useState<number>(0);
  const spendingData = [
    { category: 'Food & Dining', amount: 145.50, percentage: 35, color: '#FF6B6B' },
    { category: 'Transportation', amount: 134.50, percentage: 32, color: '#4ECDC4' },
    { category: 'Bills & Utilities', amount: 200.00, percentage: 48, color: '#FFEAA7' },
    { category: 'Entertainment', amount: 15.99, percentage: 4, color: '#96CEB4' },
    { category: 'Healthcare', amount: 75.00, percentage: 18, color: '#DDA0DD' },
  ];

  const totalAmount = spendingData.reduce((sum, d) => sum + d.amount, 0);

  // Compute spending metrics from real transactions
  const weeklyTxns = getWeeklySpending(mockTransactions);
  const weeklyAverage = weeklyTxns.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
  const monthlyProjection = weeklyAverage * 4.3; // approx weeks per month
  // Responsive pie sizing based on screen width
  const pageWidth = innerChartWidth || Math.max(width - 80, 240);
  const dynamicPieSize = Math.min(Math.max(pageWidth * 0.75, 160), 300);
  const dynamicPieThickness = Math.max(18, Math.round(dynamicPieSize * 0.12));

  const insights = [
    {
      id: '1',
      type: 'warning',
      title: 'Budget Alert',
      message: 'You\'re spending 48% more on dining this week compared to last week',
      category: 'Food & Dining',
      priority: 'high',
    },
    {
      id: '2',
      type: 'tip',
      title: 'Savings Tip',
      message: 'Consider using public transportation more often to reduce transportation costs',
      category: 'Transportation',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Great Job!',
      message: 'You stayed under budget for entertainment expenses this month',
      category: 'Entertainment',
      priority: 'low',
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
          <View onLayout={(e: LayoutChangeEvent) => setInnerChartWidth(e.nativeEvent.layout.width)}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={pageWidth}
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
              const x = e.nativeEvent.contentOffset.x;
              const page = Math.round(x / pageWidth);
              if (page !== chartPage) setChartPage(page);
            }}
            onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
              const x = e.nativeEvent.contentOffset.x;
              const page = Math.round(x / pageWidth);
              if (page !== chartPage) setChartPage(page);
            }}
            scrollEventThrottle={16}
          >
            <View style={{ width: pageWidth }}>
              <View style={styles.chartContainer}>
                {spendingData.map((item, index) => (
                  <View key={index} style={styles.chartItem}>
                    <View style={styles.chartRow}>
                      <View style={styles.categoryInfo}>
                        <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                        <ThemedText style={styles.categoryName}>{item.category}</ThemedText>
                      </View>
                      <ThemedText style={styles.categoryAmount}>${item.amount.toFixed(2)}</ThemedText>
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
                    <ThemedText style={styles.percentageText}>{item.percentage}%</ThemedText>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ width: pageWidth }}>
              <View style={styles.pieWrapper}>
                <PieChart
                  size={dynamicPieSize}
                  thickness={dynamicPieThickness}
                  data={spendingData.map((d) => ({ value: d.amount, color: d.color }))}
                />
                <View style={styles.pieCenterLabel}>
                  <ThemedText style={styles.pieCenterTitle}>Total</ThemedText>
                  <ThemedText type="title">${totalAmount.toFixed(2)}</ThemedText>
                </View>
              </View>
              <View style={styles.legendGrid}>
                {spendingData.map((d, idx) => (
                  <View key={idx} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                    <ThemedText style={styles.legendName}>{d.category}</ThemedText>
                    <ThemedText style={styles.legendValue}>${d.amount.toFixed(2)}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          </View>
          <View style={styles.pagerDots}>
            <View style={[styles.dot, chartPage === 0 && styles.dotActive]} />
            <View style={[styles.dot, chartPage === 1 && styles.dotActive]} />
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
              <ThemedText style={styles.trendValue}>${weeklyAverage.toFixed(2)}</ThemedText>
            </View>
            <View style={styles.trendChange}>
              <IconSymbol name="arrow.up.right" size={16} color="#FF6B6B" />
              <Text style={styles.trendChangeText}>+12%</Text>
            </View>
          </View>
          <View style={styles.trendItem}>
            <View style={styles.trendInfo}>
              <ThemedText style={styles.trendLabel}>Monthly Projection</ThemedText>
              <ThemedText style={styles.trendValue}>${monthlyProjection.toFixed(2)}</ThemedText>
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
  pagerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
  },
  dotActive: {
    backgroundColor: '#4ECDC4',
  },
  pieWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    position: 'relative',
  },
  pieCenterLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterTitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  legendGrid: {
    marginTop: 12,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendName: {
    flex: 1,
    marginLeft: 8,
  },
  legendValue: {
    fontWeight: '600',
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
});
