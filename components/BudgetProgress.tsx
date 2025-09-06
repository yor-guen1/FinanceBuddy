import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  period?: 'weekly' | 'monthly';
  showDetails?: boolean;
}

export default function BudgetProgress({ 
  spent, 
  budget, 
  period = 'monthly',
  showDetails = true 
}: BudgetProgressProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  const getProgressColor = () => {
    if (isOverBudget) return '#FF6B6B';
    if (percentage > 80) return '#FFEAA7';
    return '#4ECDC4';
  };

  const getStatusText = () => {
    if (isOverBudget) return 'Over budget';
    if (percentage > 80) return 'Almost at limit';
    return 'On track';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">
          {period === 'weekly' ? 'Weekly' : 'Monthly'} Budget
        </ThemedText>
        <ThemedText style={styles.budgetAmount}>
          ${budget.toLocaleString()}
        </ThemedText>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: getProgressColor()
              }
            ]} 
          />
        </View>
        <ThemedText style={styles.percentageText}>
          {percentage.toFixed(1)}%
        </ThemedText>
      </View>

      {showDetails && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Spent:</ThemedText>
            <ThemedText style={styles.detailValue}>${spent.toFixed(2)}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>
              {isOverBudget ? 'Over by:' : 'Remaining:'}
            </ThemedText>
            <ThemedText style={[
              styles.detailValue,
              { color: isOverBudget ? '#FF6B6B' : '#96CEB4' }
            ]}>
              ${Math.abs(remaining).toFixed(2)}
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Status:</ThemedText>
            <ThemedText style={[
              styles.detailValue,
              { color: getProgressColor() }
            ]}>
              {getStatusText()}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
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
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: '#666',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
