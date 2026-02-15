import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WalletProvider } from './src/context/WalletContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { tokenService } from './src/services/token.service';

import './global.css';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Try to load token metadata (non-blocking)
      await tokenService.loadTokenList();
    } catch (error) {
      // Silently fail - app works without metadata
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-white mt-4">Loading Solana Wallet Tracker...</Text>
      </View>
    );
  }

  return (
    <WalletProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </WalletProvider>
  );
}
