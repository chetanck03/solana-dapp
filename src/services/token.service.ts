// Token metadata service - Simplified

import { API_ENDPOINTS, STORAGE_KEYS, CACHE_DURATION } from '../config/constants';
import type { TokenMetadata } from '../types/solana';
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenService {
  private tokenMap: Map<string, TokenMetadata> = new Map();
  private initialized = false;
  private loading = false;

  /**
   * Load token list from cache or fetch
   */
  async loadTokenList(): Promise<void> {
    if (this.initialized || this.loading) return;

    this.loading = true;

    try {
      // Try to load from cache first
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.tokenCache);
      if (cached) {
        const { data } = JSON.parse(cached);
        this.tokenMap = new Map(Object.entries(data));
        this.initialized = true;
        console.log('Token metadata loaded from cache');
        this.loading = false;
        return;
      }

      // Try to fetch once (silently fail if network unavailable)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(API_ENDPOINTS.tokenList, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const tokens: TokenMetadata[] = await response.json();
        
        if (Array.isArray(tokens) && tokens.length > 0) {
          this.tokenMap.clear();
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
          console.log('Token metadata loaded:', tokens.length, 'tokens');
        }
      }
    } catch (error) {
      // Silently fail - app works without metadata
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

  /**
   * Check if token list is loaded
   */
  isLoaded(): boolean {
    return this.initialized;
  }

  /**
   * Get total number of tokens loaded
   */
  getTokenCount(): number {
    return this.tokenMap.size;
  }
}

export const tokenService = new TokenService();
