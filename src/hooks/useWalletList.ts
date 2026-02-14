// Custom hook for managing multiple wallets

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storage.service';
import { rpcService } from '../services/rpc.service';
import { COLORS } from '../config/constants';
import type { WalletData } from '../types/solana';

export function useWalletList() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWallets = useCallback(async () => {
    try {
      const savedWallets = await storageService.loadWallets();
      setWallets(savedWallets);
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addWallet = useCallback(async (address: string, nickname?: string) => {
    try {
      // Fetch real balance and data before adding
      console.log('Fetching wallet data for:', address);
      
      const balance = await rpcService.getBalance(address);
      const tokenAccounts = await rpcService.getTokenAccounts(address);
      const transactions = await rpcService.getTransactionSignatures(address);

      const newWallet: WalletData = {
        address,
        nickname,
        color: COLORS.wallet[wallets.length % COLORS.wallet.length],
        balance,
        tokens: tokenAccounts,
        transactions,
        lastUpdated: Date.now(),
      };

      await storageService.addWallet(newWallet);
      await loadWallets();
    } catch (error) {
      console.error('Error adding wallet:', error);
      throw error;
    }
  }, [wallets.length, loadWallets]);

  const removeWallet = useCallback(async (address: string) => {
    try {
      await storageService.removeWallet(address);
      await loadWallets();
    } catch (error) {
      console.error('Error removing wallet:', error);
    }
  }, [loadWallets]);

  const updateWallet = useCallback(async (address: string, updates: Partial<WalletData>) => {
    try {
      await storageService.updateWallet(address, updates);
      await loadWallets();
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  }, [loadWallets]);

  const refreshAllWallets = useCallback(async () => {
    try {
      const savedWallets = await storageService.loadWallets();
      
      // Fetch fresh data for all wallets
      const updatedWallets = await Promise.all(
        savedWallets.map(async (wallet) => {
          try {
            const balance = await rpcService.getBalance(wallet.address);
            const tokenAccounts = await rpcService.getTokenAccounts(wallet.address);
            const transactions = await rpcService.getTransactionSignatures(wallet.address);

            return {
              ...wallet,
              balance,
              tokens: tokenAccounts,
              transactions,
              lastUpdated: Date.now(),
            };
          } catch (error) {
            console.error(`Error refreshing wallet ${wallet.address}:`, error);
            return wallet; // Return old data if fetch fails
          }
        })
      );

      // Save all updated wallets
      await storageService.saveWallets(updatedWallets);
      setWallets(updatedWallets);
    } catch (error) {
      console.error('Error refreshing wallets:', error);
    }
  }, []);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  return {
    wallets,
    loading,
    addWallet,
    removeWallet,
    updateWallet,
    refresh: refreshAllWallets,
  };
}
