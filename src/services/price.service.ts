// Price fetching service

import { API_ENDPOINTS } from '../config/constants';
import type { PriceData } from '../types/solana';

class PriceService {
  private cache: Map<string, { data: PriceData; timestamp: number }> = new Map();
  private cacheDuration = 60000; // 1 minute

  /**
   * Fetch prices for multiple token mints from Jupiter
   */
  async getPrices(mints: string[]): Promise<PriceData> {
    if (mints.length === 0) return {};

    const cacheKey = mints.sort().join(',');
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      const ids = mints.join(',');
      const response = await fetch(`${API_ENDPOINTS.jupiterPrice}/price?ids=${ids}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const result = await response.json();
      const priceData: PriceData = {};

      for (const [mint, data] of Object.entries(result.data || {})) {
        priceData[mint] = {
          price: (data as any).price || 0,
          change24h: (data as any).change24h,
        };
      }

      this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
      return priceData;
    } catch (error) {
      console.error('Error fetching prices:', error);
      return {};
    }
  }

  /**
   * Get SOL price in USD
   */
  async getSOLPrice(): Promise<number> {
    try {
      const prices = await this.getPrices(['So11111111111111111111111111111111111111112']);
      return prices['So11111111111111111111111111111111111111112']?.price || 0;
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      return 0;
    }
  }

  /**
   * Clear price cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const priceService = new PriceService();
