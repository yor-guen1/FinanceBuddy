import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'expense' | 'income';
  source: 'manual' | 'bank' | 'receipt';
  merchant?: string;
  location?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  categoryIcon?: string;
  onPress?: () => void;
  showDate?: boolean;
}

export default function TransactionCard({ 
  transaction, 
  categoryIcon = '📦', 
  onPress, 
  showDate = true 
}: TransactionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'receipt': return 'camera.fill';
      case 'bank': return 'building.2.fill';
      case 'manual': return 'pencil';
      default: return 'questionmark.circle';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionIcon}>{categoryIcon}</Text>
        <View style={styles.transactionDetails}>
          <ThemedText style={styles.transactionDescription}>
            {transaction.description}
          </ThemedText>
          {transaction.merchant && (
            <ThemedText style={styles.transactionMerchant}>
              {transaction.merchant}
            </ThemedText>
          )}
          {showDate && (
            <ThemedText style={styles.transactionDate}>
              {formatDate(transaction.date)}
            </ThemedText>
          )}
        </View>
      </View>
      <View style={styles.transactionRight}>
        <ThemedText style={[
          styles.transactionAmount,
          { color: transaction.type === 'expense' ? '#FF6B6B' : '#96CEB4' }
        ]}>
          {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
        </ThemedText>
        <View style={styles.sourceIcon}>
          <IconSymbol 
            name={getSourceIcon(transaction.source)} 
            size={12} 
            color="#999" 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: '500',
  },
  transactionMerchant: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sourceIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
