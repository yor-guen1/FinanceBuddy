import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', headerShown: true, headerBackTitle: '' }}>
      <Stack.Screen name="add-transaction" options={{ title: 'Add Expense', headerBackTitle: '' }} />
    </Stack>
  );
}


