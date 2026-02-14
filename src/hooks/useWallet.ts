// Custom hook for wallet operations

import { useState, useEffect, useCallback } from 'react';
import { rpcService } from '../services/rpc.service';
import { priceService } from '../services/price.service';
import { tokenService } from '../services/token.service';
import { storageService } from '../services/storage.service';
import type { WalletData, TokenAccount } from '../types/solana';

export function useWallet(address: string | null) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch balance
      const balance = await rpcService.getBalance(address);

      // Fetch token accounts
      const tokenAccounts = await rpcService.getTokenAccounts(address);

      // Fetch transactions
      const transactions = await rpcService.getTransactionSignatures(address);

      const walletData: WalletData = {
        address,
        balance,
        tokens: tokenAccounts,
        transactions,
        lastUpdated: Date.now(),
      };

      setWallet(walletData);

      // Update storage
      await storageService.updateWallet(address, walletData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallet data';
      setError(message);
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchWalletData();
    }
  }, [address, fetchWalletData]);

  return {
    wallet,
    loading,
    error,
    refresh: fetchWalletData,
  };
}
