import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { WalletProvider } from './src/context/WalletContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { tokenService } from './src/services/token.service';

import './global.css';

export default function App() {
  useEffect(() => {
    // Initialize token metadata on app start (non-blocking)
    tokenService.loadTokenList().catch((err) => {
      console.log('Token metadata unavailable, app will work without it');
    });
  }, []);

  return (
    <WalletProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </WalletProvider>
  );
}
