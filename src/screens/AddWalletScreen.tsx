// Add wallet screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalletContext } from '../context/WalletContext';
import { isValidSolanaAddress } from '../utils/validation';

export function AddWalletScreen({ navigation }: any) {
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const { addWallet } = useWalletContext();

  const handleAddWallet = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a wallet address');
      return;
    }

    if (!isValidSolanaAddress(address.trim())) {
      Alert.alert('Error', 'Invalid Solana address');
      return;
    }

    setLoading(true);
    try {
      // This will now fetch real balance before adding
      await addWallet(address.trim(), nickname.trim() || undefined);
      Alert.alert('Success', 'Wallet added successfully with current balance');
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add wallet';
      Alert.alert('Error', errorMessage);
      console.error('Add wallet error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 px-4" edges={['top']}>
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Text className="text-purple-500 text-lg">← Back</Text>
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-white mb-2">Add Wallet</Text>
      <Text className="text-gray-400 mb-8">Enter a Solana wallet address to track</Text>

      <View className="mb-6">
        <Text className="text-gray-300 mb-2 font-medium">Wallet Address</Text>
        <TextInput
          className="bg-gray-800 text-white px-4 py-3 rounded-xl"
          placeholder="Enter Solana address..."
          placeholderTextColor="#6B7280"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View className="mb-8">
        <Text className="text-gray-300 mb-2 font-medium">Nickname (Optional)</Text>
        <TextInput
          className="bg-gray-800 text-white px-4 py-3 rounded-xl"
          placeholder="My Wallet"
          placeholderTextColor="#6B7280"
          value={nickname}
          onChangeText={setNickname}
        />
      </View>

      <TouchableOpacity
        className="bg-purple-600 py-4 rounded-xl items-center"
        onPress={handleAddWallet}
        disabled={loading}
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator color="#fff" />
            <Text className="text-white font-semibold text-lg ml-2">Fetching wallet data...</Text>
          </View>
        ) : (
          <Text className="text-white font-semibold text-lg">Add Wallet</Text>
        )}
      </TouchableOpacity>

      <View className="mt-6 p-4 bg-gray-800 rounded-xl">
        <Text className="text-gray-300 text-sm">
          💡 Tip: You can track any Solana wallet address, not just your own. Great for watching whale wallets!
        </Text>
      </View>
    </SafeAreaView>
  );
}
