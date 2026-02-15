// Token detail screen

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { tokenService } from '../services/token.service';
import { priceService } from '../services/price.service';
import { rpcService } from '../services/rpc.service';
import { truncateAddress, formatDate } from '../utils/validation';
import type { TokenAccount, TokenMetadata, Transaction } from '../types/solana';

interface TokenDetailScreenProps {
  route: {
    params: {
      token: TokenAccount;
      walletAddress: string;
    };
  };
  navigation: any;
}

export function TokenDetailScreen({ route, navigation }: TokenDetailScreenProps) {
  const { token, walletAddress } = route.params;
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadTokenData();
  }, [token.mint]);

  const loadTokenData = async () => {
    setLoading(true);
    try {
      // Ensure token list is loaded
      await tokenService.loadTokenList();
      
      // Load token metadata
      const meta = tokenService.getTokenMetadata(token.mint);
      
      if (meta) {
        setMetadata(meta);
      } else {
        // Create basic metadata from what we know
        setMetadata({
          address: token.mint,
          symbol: truncateAddress(token.mint, 4),
          name: 'Unknown Token',
          decimals: token.decimals,
        });
      }

      // Load price (disabled - returns 0)
      const prices = await priceService.getPrices([token.mint]);
      setPrice(prices[token.mint]?.price || null);

      // Load transactions for this wallet
      try {
        const txs = await rpcService.getTransactionSignatures(walletAddress, 10);
        setTransactions(txs);
      } catch (error) {
        // Silently fail
      }
    } catch (error) {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const openInExplorer = (signature: string) => {
    const url = `https://solscan.io/tx/${signature}`;
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const openTokenInExplorer = (address: string) => {
    const url = `https://solscan.io/token/${address}`;
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const openAccountInExplorer = (address: string) => {
    const url = `https://solscan.io/account/${address}`;
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const totalValue = price ? token.uiAmount * price : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      <View className="px-4 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Text className="text-purple-500 text-lg">← Back</Text>
        </TouchableOpacity>

        {/* Token Header */}
        <View className="items-center mb-6">
          {metadata?.logoURI && !imageError ? (
            <Image
              source={{ uri: metadata.logoURI }}
              style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }}
              onError={() => {
                console.log('Image load failed, showing fallback');
                setImageError(true);
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', metadata.logoURI);
              }}
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-purple-600 items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">
                {metadata?.symbol?.[0] || token.mint.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}

          <Text className="text-white text-2xl font-bold">
            {metadata?.name || 'Unknown Token'}
          </Text>
          <Text className="text-gray-400 text-lg">{metadata?.symbol || truncateAddress(token.mint, 4)}</Text>
        </View>

        {/* Balance Card */}
        <View className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 mb-4">
          <Text className="text-purple-200 text-sm mb-1">Total Balance</Text>
          <Text className="text-white text-4xl font-bold mb-2">
            {token.uiAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </Text>
          {totalValue && (
            <Text className="text-purple-200 text-lg">
              ≈ ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Token Info */}
        <View className="bg-gray-800 rounded-2xl p-4 mb-4">
          <Text className="text-white text-lg font-bold mb-3">Token Information</Text>
          
          <View className="mb-3">
            <Text className="text-gray-400 text-sm mb-2">Mint Address</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-mono text-sm flex-1">{truncateAddress(token.mint, 8)}</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => copyToClipboard(token.mint, 'Mint address')}
                  className="bg-purple-600 px-3 py-1 rounded-lg mr-2"
                >
                  <Text className="text-white text-xs">Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openTokenInExplorer(token.mint)}
                  className="bg-blue-600 px-3 py-1 rounded-lg"
                >
                  <Text className="text-white text-xs">Explorer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="mb-3">
            <Text className="text-gray-400 text-sm mb-2">Token Account</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-mono text-sm flex-1">{truncateAddress(token.pubkey, 8)}</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => copyToClipboard(token.pubkey, 'Token account')}
                  className="bg-purple-600 px-3 py-1 rounded-lg mr-2"
                >
                  <Text className="text-white text-xs">Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openAccountInExplorer(token.pubkey)}
                  className="bg-blue-600 px-3 py-1 rounded-lg"
                >
                  <Text className="text-white text-xs">Explorer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="mb-3">
            <Text className="text-gray-400 text-sm">Decimals</Text>
            <Text className="text-white text-sm mt-1">{token.decimals}</Text>
          </View>

          {price && (
            <View className="mb-3">
              <Text className="text-gray-400 text-sm">Price</Text>
              <Text className="text-white text-sm mt-1">
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </Text>
            </View>
          )}

          <View>
            <Text className="text-gray-400 text-sm">Raw Amount</Text>
            <Text className="text-white font-mono text-sm mt-1">{token.amount}</Text>
          </View>
        </View>

        {/* Tags */}
        {metadata?.tags && metadata.tags.length > 0 && (
          <View className="bg-gray-800 rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-bold mb-3">Tags</Text>
            <View className="flex-row flex-wrap">
              {metadata.tags.map((tag, index) => (
                <View key={index} className="bg-purple-600 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-white text-sm">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View className="bg-gray-800 rounded-2xl p-4 mb-6">
          <Text className="text-white text-lg font-bold mb-3">Recent Wallet Transactions</Text>
          {loading ? (
            <View className="py-4 items-center">
              <ActivityIndicator color="#8B5CF6" />
            </View>
          ) : transactions.length === 0 ? (
            <Text className="text-gray-400 text-center py-4">No transactions found</Text>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <TouchableOpacity
                key={tx.signature}
                className="border-t border-gray-700 pt-3 mt-3 first:border-t-0 first:mt-0 first:pt-0"
                onPress={() => openInExplorer(tx.signature)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-mono text-xs">
                      {truncateAddress(tx.signature, 8)}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {tx.blockTime ? formatDate(tx.blockTime) : 'Pending'}
                    </Text>
                    <Text className="text-purple-400 text-xs mt-1">Tap to view on Solscan →</Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${tx.err ? 'bg-red-900' : 'bg-green-900'}`}>
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
