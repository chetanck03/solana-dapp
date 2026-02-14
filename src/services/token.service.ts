// Token metadata service

import { API_ENDPOINTS, STORAGE_KEYS, CACHE_DURATION } from '../config/constants';
import type { TokenMetadata } from '../types/solana';
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenService {
  private tokenMap: Map<string, TokenMetadata> = new Map();
  private initialized = false;
  private loading = false;

  /**
   * Load token list from Jupiter
   */
  async loadTokenList(): Promise<void> {
    if (this.initialized || this.loading) return;

    this.loading = true;

    try {
      // Try to load from cache first
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.tokenCache);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          this.tokenMap = new Map(Object.entries(data));
          this.initialized = true;
          this.loading = false;
          console.log('Token list loaded from cache');
          return;
        }
      }

      // Fetch fresh data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(API_ENDPOINTS.tokenList, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.status}`);
      }

      const tokens: TokenMetadata[] = await response.json();
      
      tokens.forEach((token) => {
        this.tokenMap.set(token.address, token);
      });

      // Cache the data
      await AsyncStorage.setItem(
        STORAGE_KEYS.tokenCache,
        JSON.stringify({
          data: Object.fromEntries(this.tokenMap),
          timestamp: Date.now(),
        })
      );

      this.initialized = true;
      console.log(`Token list loaded: ${tokens.length} tokens`);
    } catch (error) {
      console.log('Token list loading failed (app will work without metadata):', error instanceof Error ? error.message : 'Unknown error');
      // Don't throw - app should work without token metadata
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get token metadata by mint address
   */
  getTokenMetadata(mint: string): TokenMetadata | undefined {
    return this.tokenMap.get(mint);
  }

  /**
   * Get multiple token metadata
   */
  getMultipleTokenMetadata(mints: string[]): Map<string, TokenMetadata> {
    const result = new Map<string, TokenMetadata>();
    mints.forEach((mint) => {
      const metadata = this.tokenMap.get(mint);
      if (metadata) {
        result.set(mint, metadata);
      }
    });
    return result;
  }

  /**
   * Search tokens by symbol or name
   */
  searchTokens(query: string): TokenMetadata[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.tokenMap.values()).filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.name.toLowerCase().includes(lowerQuery)
    );
  }
}

export const tokenService = new TokenService();
