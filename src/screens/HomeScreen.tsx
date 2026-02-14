// Home screen - Wallet list

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalletContext } from '../context/WalletContext';
import { truncateAddress, formatSOL } from '../utils/validation';

export function HomeScreen({ navigation }: any) {
  const { wallets, loading, refresh, removeWallet } = useWalletContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Wallets',
      'Are you sure you want to remove all wallets? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            for (const wallet of wallets) {
              await removeWallet(wallet.address);
            }
          },
        },
      ]
    );
  };

  // Filter wallets based on search query
  const filteredWallets = useMemo(() => {
    if (!searchQuery.trim()) return wallets;

    const query = searchQuery.toLowerCase();
    return wallets.filter((wallet) => {
      const nickname = wallet.nickname?.toLowerCase() || '';
      const address = wallet.address.toLowerCase();
      return nickname.includes(query) || address.includes(query);
    });
  }, [wallets, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <View className="px-4 pb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-3xl font-bold text-white">Wallets</Text>
            <Text className="text-gray-400 mt-1">Track your Solana portfolio</Text>
          </View>
          {wallets.length > 0 && (
            <TouchableOpacity
              onPress={handleReset}
              className="bg-red-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold text-sm">Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {wallets.length > 0 && (
          <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-white"
              placeholder="Search by nickname or address..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-gray-400 text-lg">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />
        }
      >
        {wallets.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 text-lg">No wallets added yet</Text>
            <Text className="text-gray-500 text-sm mt-2">Tap + to add your first wallet</Text>
          </View>
        ) : filteredWallets.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 text-lg">No wallets found</Text>
            <Text className="text-gray-500 text-sm mt-2">Try a different search term</Text>
          </View>
        ) : (
          filteredWallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.address}
              className="bg-gray-800 rounded-2xl p-4 mb-3"
              onPress={() => navigation.navigate('WalletDetail', { address: wallet.address })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <View
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: wallet.color || '#8B5CF6' }}
                    />
                    <Text className="text-white font-semibold text-lg">
                      {wallet.nickname || truncateAddress(wallet.address)}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    {truncateAddress(wallet.address, 6)}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-white font-bold text-xl">
                    {formatSOL(wallet.balance.lamports)} SOL
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    {wallet.tokens.length} tokens
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {searchQuery && filteredWallets.length > 0 && (
          <Text className="text-gray-500 text-center py-4">
            Showing {filteredWallets.length} of {wallets.length} wallets
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-8 bg-purple-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddWallet')}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
