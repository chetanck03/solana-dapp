// Navigation setup

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { AddWalletScreen } from '../screens/AddWalletScreen';
import { WalletDetailScreen } from '../screens/WalletDetailScreen';
import { TokenDetailScreen } from '../screens/TokenDetailScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#111827' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddWallet" component={AddWalletScreen} />
          <Stack.Screen name="WalletDetail" component={WalletDetailScreen} />
          <Stack.Screen name="TokenDetail" component={TokenDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
