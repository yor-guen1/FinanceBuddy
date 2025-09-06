import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';

const { width } = Dimensions.get('window');

interface SpendingData {
  id: string;
  name: string;
  icon: string;
  color: string;
  spent: number;
  percentage: number;
}

interface SpendingChartProps {
  data: SpendingData[];
  maxItems?: number;
}

export default function SpendingChart({ data, maxItems = 5 }: SpendingChartProps) {
  const displayData = data.slice(0, maxItems);

  return (
    <View style={styles.container}>
      {displayData.map((item) => (
        <View key={item.id} style={styles.chartItem}>
          <View style={styles.chartRow}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
            </View>
            <ThemedText style={styles.categoryAmount}>${item.spent.toFixed(2)}</ThemedText>
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
          <ThemedText style={styles.percentageText}>{item.percentage.toFixed(1)}%</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  categoryIcon: {
    fontSize: 20,
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
});
