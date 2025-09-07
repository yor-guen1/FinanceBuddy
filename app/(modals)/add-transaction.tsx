import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootState } from '@/store';
import { updateCategorySpent } from '@/store/slices/categoriesSlice';
import { addTransaction, Transaction } from '@/store/slices/transactionsSlice';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function AddTransactionModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => s.categories.categories);

  const [amountText, setAmountText] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('8'); // Default to Other
  const [merchant, setMerchant] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    const amount = Number(amountText);
    return amount > 0 && description.trim().length > 0 && !!categoryId;
  }, [amountText, description, categoryId]);

  const handleSubmit = () => {
    setError(null);
    const amount = Number(amountText);
    if (!isValid) {
      setError('Please fill all required fields with valid values.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const txn: Transaction = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      amount,
      description: description.trim(),
      category: categoryId,
      date: new Date().toISOString(),
      type: 'expense',
      source: 'manual',
      merchant: merchant.trim() || undefined,
    };

    dispatch(addTransaction(txn));
    dispatch(updateCategorySpent({ categoryId, amount }));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Add Expense</ThemedText>


      <View style={styles.fieldGroup}>
        <ThemedText style={styles.label}>Amount</ThemedText>
        <TextInput
          value={amountText}
          onChangeText={setAmountText}
          placeholder="$0.00"
          keyboardType="decimal-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="e.g., Coffee"
          style={styles.input}
        />
      </View>


      <View style={styles.fieldGroup}>
        <ThemedText style={styles.label}>Merchant (optional)</ThemedText>
        <TextInput
          value={merchant}
          onChangeText={setMerchant}
          placeholder="e.g., Starbucks"
          style={styles.input}
        />
      </View>

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!isValid}
        style={[styles.button, !isValid && styles.buttonDisabled]}
      >
        <ThemedText style={styles.buttonText}>Add</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    gap: 14,
  },
  header: { marginBottom: 4 },
  fieldGroup: { gap: 6 },
  label: { opacity: 0.7, fontSize: 12 },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  error: { color: '#FF6B6B', fontSize: 12 },
  button: {
    marginTop: 6,
    backgroundColor: '#4ECDC4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontWeight: '600' },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chipActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  chipText: { fontSize: 12 },
  chipTextActive: { color: 'white', fontWeight: '600' },
});


