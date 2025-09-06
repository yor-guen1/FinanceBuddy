import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { OCRService } from '@/services/ocrService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScanReceipt = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is required to scan receipts.');
        return;
      }
    }
    setIsScanning(true);
  };

  const handleTakePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setIsScanning(false);
        await processReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
      setIsScanning(false);
    }
  };

  const handleSelectFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        await processReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const processReceiptImage = async (imageUri: string) => {
    setIsProcessing(true);
    try {
      console.log('Processing receipt image...');
      const extractedText = await OCRService.processReceipt(imageUri);
      
      console.log('OCR Result:', extractedText);
      
      if (extractedText && extractedText.trim().length > 0) {
        Alert.alert(
          'Receipt Text Extracted Successfully!',
          extractedText,
          [
            { text: 'OK', onPress: () => setCapturedImage(null) }
          ]
        );
      } else {
        Alert.alert(
          'No Text Found',
          'Could not extract any text from the image. Please try with a clearer, well-lit receipt.',
          [
            { text: 'OK', onPress: () => setCapturedImage(null) }
          ]
        );
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
      Alert.alert(
        'Processing Error', 
        error instanceof Error ? error.message : 'Failed to process receipt. Please try again with a clearer image.',
        [
          { text: 'OK', onPress: () => setCapturedImage(null) }
        ]
      );
    } finally {
      setIsProcessing(false);
    }
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
          {isScanning ? (
            <View style={styles.cameraContainer}>
              <CameraView style={styles.camera} facing="back" />
              <View style={styles.cameraOverlay}>
                <View style={styles.scanFrame} />
                <ThemedText style={styles.scanInstruction}>
                  Position receipt within the frame
                </ThemedText>
              </View>
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.cameraButton} 
                  onPress={() => setIsScanning(false)}
                >
                  <IconSymbol name="xmark" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.captureButton} 
                  onPress={handleTakePicture}
                >
                  <IconSymbol name="camera.fill" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.libraryButton} 
                  onPress={handleSelectFromLibrary}
                >
                  <IconSymbol name="photo" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : capturedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
              <View style={styles.imageOverlay}>
                {isProcessing ? (
                  <View style={styles.processingContainer}>
                    <IconSymbol name="arrow.clockwise" size={32} color="white" />
                    <ThemedText style={styles.processingText}>Processing...</ThemedText>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.retakeButton} 
                    onPress={() => setCapturedImage(null)}
                  >
                    <IconSymbol name="arrow.clockwise" size={24} color="white" />
                    <Text style={styles.retakeText}>Retake</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <IconSymbol name="camera.fill" size={80} color="#666" />
              <ThemedText style={styles.placeholderText}>
                Tap to scan receipt
              </ThemedText>
            </View>
          )}
          
          {!isScanning && !capturedImage && (
            <TouchableOpacity 
              style={styles.scanButton} 
              onPress={handleScanReceipt}
              disabled={isProcessing}
            >
              <IconSymbol name="camera.fill" size={24} color="white" />
              <Text style={styles.scanButtonText}>
                {isProcessing ? 'Processing...' : 'Scan Receipt'}
              </Text>
            </TouchableOpacity>
          )}
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
  cameraContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  scanInstruction: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retakeText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
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
