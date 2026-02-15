// Wallet detail screen

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useWallet } from '../hooks/useWallet';
import { tokenService } from '../services/token.service';
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

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const openInExplorer = (address: string) => {
    const url = `https://solscan.io/account/${address}`;
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const openTransactionInExplorer = (signature: string) => {
    const url = `https://solscan.io/tx/${signature}`;
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
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
        
        <Text className="text-2xl font-bold text-white mb-2">{wallet.nickname || 'Wallet'}</Text>
        
        {/* Wallet Address with Copy and Explorer */}
        <View className="flex-row items-center justify-between bg-gray-800 rounded-xl p-3 mb-4">
          <Text className="text-gray-400 flex-1 font-mono text-sm">{truncateAddress(wallet.address, 8)}</Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => copyToClipboard(wallet.address, 'Wallet address')}
              className="bg-purple-600 px-3 py-2 rounded-lg mr-2 flex-row items-center"
            >
              <Ionicons name="copy-outline" size={16} color="#fff" />
              <Text className="text-white text-xs ml-1">Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openInExplorer(wallet.address)}
              className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center"
            >
              <Ionicons name="open-outline" size={16} color="#fff" />
              <Text className="text-white text-xs ml-1">Explorer</Text>
            </TouchableOpacity>
          </View>
        </View>
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
            wallet.tokens.map((token, index) => {
              const metadata = tokenService.getTokenMetadata(token.mint);
              return (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-800 rounded-xl p-4 mb-2 flex-row items-center"
                  onPress={() => navigation.navigate('TokenDetail', { token, walletAddress: wallet.address })}
                >
                  {metadata?.logoURI ? (
                    <Image
                      source={{ uri: metadata.logoURI }}
                      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                      onError={() => console.log('Failed to load image for:', metadata.symbol)}
                    />
                  ) : (
                    <View className="w-10 h-10 rounded-full bg-purple-600 items-center justify-center mr-3">
                      <Text className="text-white font-bold">
                        {metadata?.symbol?.[0] || token.mint.slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-white font-semibold">
                      {metadata?.symbol || truncateAddress(token.mint, 6)}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">
                      {metadata?.name || `${token.decimals} decimals`}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white font-bold">
                      {token.uiAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">→</Text>
                  </View>
                </TouchableOpacity>
              );
            })
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
              <TouchableOpacity
                key={tx.signature}
                className="bg-gray-800 rounded-xl p-4 mb-2"
                onPress={() => openTransactionInExplorer(tx.signature)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-mono text-sm">
                      {truncateAddress(tx.signature, 8)}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {tx.blockTime ? formatDate(tx.blockTime) : 'Pending'}
                    </Text>
                    <Text className="text-purple-400 text-xs mt-1">Tap to view on Solscan →</Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded ${tx.err ? 'bg-red-900' : 'bg-green-900'}`}
                  >
                    <Text className={`text-xs ${tx.err ? 'text-red-300' : 'text-green-300'}`}>
                      {tx.err ? 'Failed' : 'Success'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
