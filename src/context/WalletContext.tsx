// Global wallet context

import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletList } from '../hooks/useWalletList';
import type { WalletData } from '../types/solana';

interface WalletContextType {
  wallets: WalletData[];
  loading: boolean;
  addWallet: (address: string, nickname?: string) => Promise<void>;
  removeWallet: (address: string) => Promise<void>;
  updateWallet: (address: string, updates: Partial<WalletData>) => Promise<void>;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const walletList = useWalletList();

  return (
    <WalletContext.Provider value={walletList}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
}
