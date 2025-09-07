import BudgetGoalsModal from '@/components/BudgetGoalsModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AppDispatch, RootState } from '@/store';
import { setBudgetPeriod } from '@/store/slices/budgetSettingsSlice';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const budgetPeriod = useSelector((state: RootState) => state.budgetSettings.period);
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReports: true,
    spendingInsights: true,
  });
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
  });
  const [showBudgetGoalsModal, setShowBudgetGoalsModal] = useState(false);

  const handleBudgetPeriodChange = () => {
    Alert.alert(
      'Budget Period',
      'Choose your budget tracking period',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Weekly', onPress: () => dispatch(setBudgetPeriod('weekly')) },
        { text: 'Monthly', onPress: () => dispatch(setBudgetPeriod('monthly')) },
      ]
    );
  };

  const handleBudgetGoalChange = () => {
    setShowBudgetGoalsModal(true);
  };

  const handleBankConnection = () => {
    Alert.alert(
      'Bank Connection',
      'This would open a secure bank connection flow using Plaid or similar service.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect Bank', onPress: () => console.log('Connect bank') },
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'This would allow you to export your financial data in various formats (CSV, PDF, etc.).',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage your account and preferences
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Budget & Goals</ThemedText>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleBudgetPeriodChange}>
            <View style={styles.settingInfo}>
              <IconSymbol name="calendar" size={20} color="#4ECDC4" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Budget Period</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Currently set to {budgetPeriod}
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleBudgetGoalChange}>
            <View style={styles.settingInfo}>
              <IconSymbol name="target" size={20} color="#96CEB4" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Budget Goals</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Set spending limits by category
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Bank & Data</ThemedText>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleBankConnection}>
            <View style={styles.settingInfo}>
              <IconSymbol name="building.2.fill" size={20} color="#45B7D1" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Connect Bank Account</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Import transactions automatically
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleDataExport}>
            <View style={styles.settingInfo}>
              <IconSymbol name="square.and.arrow.up" size={20} color="#FFEAA7" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Export Data</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Download your financial data
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Notifications</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="bell.fill" size={20} color="#FF6B6B" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Budget Alerts</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Get notified when approaching budget limits
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notifications.budgetAlerts}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, budgetAlerts: value }))}
              trackColor={{ false: '#767577', true: '#4ECDC4' }}
              thumbColor={notifications.budgetAlerts ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="chart.bar.fill" size={20} color="#96CEB4" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Weekly Reports</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Receive weekly spending summaries
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notifications.weeklyReports}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, weeklyReports: value }))}
              trackColor={{ false: '#767577', true: '#4ECDC4' }}
              thumbColor={notifications.weeklyReports ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="lightbulb.fill" size={20} color="#DDA0DD" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Spending Insights</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Get AI-powered spending tips
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notifications.spendingInsights}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, spendingInsights: value }))}
              trackColor={{ false: '#767577', true: '#4ECDC4' }}
              thumbColor={notifications.spendingInsights ? '#fff' : '#f4f3f4'}
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Privacy & Security</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="lock.fill" size={20} color="#98D8C8" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Data Sharing</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Allow anonymized data for app improvement
                </ThemedText>
              </View>
            </View>
            <Switch
              value={privacy.dataSharing}
              onValueChange={(value) => setPrivacy(prev => ({ ...prev, dataSharing: value }))}
              trackColor={{ false: '#767577', true: '#4ECDC4' }}
              thumbColor={privacy.dataSharing ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="#F7DC6F" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Analytics</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Help improve app performance
                </ThemedText>
              </View>
            </View>
            <Switch
              value={privacy.analytics}
              onValueChange={(value) => setPrivacy(prev => ({ ...prev, analytics: value }))}
              trackColor={{ false: '#767577', true: '#4ECDC4' }}
              thumbColor={privacy.analytics ? '#fff' : '#f4f3f4'}
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Account</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="person.fill" size={20} color="#4ECDC4" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Profile</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Manage your personal information
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="questionmark.circle.fill" size={20} color="#96CEB4" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold">Help & Support</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Get help and contact support
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleDeleteAccount}>
            <View style={styles.settingInfo}>
              <IconSymbol name="trash.fill" size={20} color="#FF6B6B" />
              <View style={styles.settingContent}>
                <ThemedText type="defaultSemiBold" style={styles.dangerText}>Delete Account</ThemedText>
                <ThemedText style={styles.settingSubtext}>
                  Permanently delete your account and data
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
      
      <BudgetGoalsModal
        visible={showBudgetGoalsModal}
        onClose={() => setShowBudgetGoalsModal(false)}
      />
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
    marginBottom: 30,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  section: {
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
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    marginLeft: 12,
    flex: 1,
  },
  settingSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#FF6B6B',
  },
});
