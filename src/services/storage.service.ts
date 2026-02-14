// Local storage service for wallet data

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import type { WalletData } from '../types/solana';

class StorageService {
  /**
   * Save wallets to local storage
   */
  async saveWallets(wallets: WalletData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.wallets, JSON.stringify(wallets));
    } catch (error) {
      console.error('Error saving wallets:', error);
      throw error;
    }
  }

  /**
   * Load wallets from local storage
   */
  async loadWallets(): Promise<WalletData[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.wallets);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading wallets:', error);
      return [];
    }
  }

  /**
   * Add a new wallet
   */
  async addWallet(wallet: WalletData): Promise<void> {
    const wallets = await this.loadWallets();
    
    // Check if wallet already exists
    const exists = wallets.some((w) => w.address === wallet.address);
    if (exists) {
      throw new Error('Wallet already exists');
    }

    wallets.push(wallet);
    await this.saveWallets(wallets);
  }

  /**
   * Update wallet data
   */
  async updateWallet(address: string, updates: Partial<WalletData>): Promise<void> {
    const wallets = await this.loadWallets();
    const index = wallets.findIndex((w) => w.address === address);

    if (index === -1) {
      throw new Error('Wallet not found');
    }

    wallets[index] = { ...wallets[index], ...updates };
    await this.saveWallets(wallets);
  }

  /**
   * Remove a wallet
   */
  async removeWallet(address: string): Promise<void> {
    const wallets = await this.loadWallets();
    const filtered = wallets.filter((w) => w.address !== address);
    await this.saveWallets(filtered);
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.wallets,
        STORAGE_KEYS.tokenCache,
        STORAGE_KEYS.priceCache,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storageService = new StorageService();
