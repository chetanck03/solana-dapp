// Wallet detail screen

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../hooks/useWallet';
import { truncateAddress, formatSOL, formatDate } from '../utils/validation';

export function WalletDetailScreen({ route, navigation }: any) {
  const { address } = route.params;
  const { wallet, loading, error, refresh } = useWallet(address);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !wallet) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-400 mt-4">Loading wallet...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 items-center justify-center px-4" edges={['top']}>
        <Text className="text-red-500 text-lg mb-4">Error: {error}</Text>
        <TouchableOpacity className="bg-purple-600 px-6 py-3 rounded-xl" onPress={refresh}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!wallet) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <View className="px-4 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Text className="text-purple-500 text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">{wallet.nickname || 'Wallet'}</Text>
        <Text className="text-gray-400 mt-1">{truncateAddress(wallet.address, 8)}</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />
        }
      >
        {/* Balance Card */}
        <View className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 mb-4">
          <Text className="text-purple-200 text-sm mb-1">Total Balance</Text>
          <Text className="text-white text-4xl font-bold">{formatSOL(wallet.balance.lamports)} SOL</Text>
        </View>

        {/* Tokens Section */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-3">Tokens ({wallet.tokens.length})</Text>
          {wallet.tokens.length === 0 ? (
            <View className="bg-gray-800 rounded-xl p-6 items-center">
              <Text className="text-gray-400">No tokens found</Text>
            </View>
          ) : (
            wallet.tokens.map((token, index) => (
              <View key={index} className="bg-gray-800 rounded-xl p-4 mb-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{truncateAddress(token.mint, 6)}</Text>
                    <Text className="text-gray-400 text-sm mt-1">
                      {token.decimals} decimals
                    </Text>
                  </View>
                  <Text className="text-white font-bold">{token.uiAmount.toFixed(4)}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Transactions Section */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-3">
            Recent Transactions ({wallet.transactions.length})
          </Text>
          {wallet.transactions.length === 0 ? (
            <View className="bg-gray-800 rounded-xl p-6 items-center">
              <Text className="text-gray-400">No transactions found</Text>
            </View>
          ) : (
            wallet.transactions.map((tx) => (
              <View key={tx.signature} className="bg-gray-800 rounded-xl p-4 mb-2">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-mono text-sm">
                      {truncateAddress(tx.signature, 8)}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {tx.blockTime ? formatDate(tx.blockTime) : 'Pending'}
                    </Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded ${tx.err ? 'bg-red-900' : 'bg-green-900'}`}
                  >
                    <Text className={`text-xs ${tx.err ? 'text-red-300' : 'text-green-300'}`}>
                      {tx.err ? 'Failed' : 'Success'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
