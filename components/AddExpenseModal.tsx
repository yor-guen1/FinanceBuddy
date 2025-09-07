import { createTransactionAsync } from '@/store/slices/transactionsSlice';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ visible, onClose }: AddExpenseModalProps) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [location, setLocation] = useState('');

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
      category: '8', // Default to "Other" category ID
      date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      type: 'expense' as const,
      source: 'manual' as const,
      merchant: merchant || undefined,
      location: location || undefined,
    };

    dispatch(createTransactionAsync(newTransaction));
    
    // Reset form
    setAmount('');
    setDescription('');
    setMerchant('');
    setLocation('');
    
    Alert.alert('Success', 'Expense added successfully!');
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setAmount('');
    setDescription('');
    setMerchant('');
    setLocation('');
    onClose();
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
          <ThemedText type="title" style={styles.title}>Add Expense</ThemedText>
          <TouchableOpacity onPress={handleAddExpense} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              />
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
});
