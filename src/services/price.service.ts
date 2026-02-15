// Price fetching service - Simplified without external APIs

import type { PriceData } from '../types/solana';

class PriceService {
  private cache: Map<string, { data: PriceData; timestamp: number }> = new Map();
  private cacheDuration = 60000; // 1 minute

  /**
   * Fetch prices for multiple token mints
   * Returns empty object - prices disabled for simplicity
   */
  async getPrices(mints: string[]): Promise<PriceData> {
    // Prices disabled - app works without them
    return {};
  }

  /**
   * Get SOL price in USD
   * Returns 0 - prices disabled for simplicity
   */
  async getSOLPrice(): Promise<number> {
    // Prices disabled - app works without them
    return 0;
  }

  /**
   * Clear price cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const priceService = new PriceService();
