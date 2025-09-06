import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ScannerScreen() {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanReceipt = () => {
    Alert.alert(
      'Camera Access',
      'This would open the camera to scan a receipt. In a real app, this would integrate with expo-camera and OCR services.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Camera', onPress: () => setIsScanning(true) },
      ]
    );
  };

  const handleConnectBank = () => {
    Alert.alert(
      'Bank Connection',
      'This would open a secure bank connection flow using Plaid or similar service.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect Bank', onPress: () => console.log('Connect bank') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Receipt Scanner</ThemedText>
          <ThemedText style={styles.subtitle}>
            Scan receipts to automatically track your expenses
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.scannerContainer}>
          <View style={styles.cameraPlaceholder}>
            <IconSymbol name="camera.fill" size={80} color="#666" />
            <ThemedText style={styles.placeholderText}>
              {isScanning ? 'Camera is active...' : 'Tap to scan receipt'}
            </ThemedText>
          </View>
          
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={handleScanReceipt}
            disabled={isScanning}
          >
            <IconSymbol name="camera.fill" size={24} color="white" />
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan Receipt'}
            </Text>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.quickActions}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleConnectBank}>
            <View style={styles.actionIcon}>
              <IconSymbol name="building.2.fill" size={24} color="#4ECDC4" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold">Connect Bank Account</ThemedText>
              <ThemedText style={styles.actionSubtext}>
                Automatically import transactions
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <IconSymbol name="plus.circle.fill" size={24} color="#96CEB4" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold">Add Manual Expense</ThemedText>
              <ThemedText style={styles.actionSubtext}>
                Enter expense details manually
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <IconSymbol name="chart.bar.fill" size={24} color="#FFEAA7" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold">View Weekly Report</ThemedText>
              <ThemedText style={styles.actionSubtext}>
                See your spending breakdown
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.recentSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Scans</ThemedText>
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="doc.text.fill" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>No recent scans</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Start by scanning your first receipt
            </ThemedText>
          </ThemedView>
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
    marginBottom: 30,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  scannerContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.6,
  },
  scanButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  recentSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    opacity: 0.6,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.4,
  },
});
