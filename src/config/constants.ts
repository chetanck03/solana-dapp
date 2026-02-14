// App Constants

export const LAMPORTS_PER_SOL = 1_000_000_000;

export const RPC_CONFIG = {
  url: process.env.EXPO_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  wsUrl: process.env.EXPO_PUBLIC_SOLANA_WS_URL || 'wss://api.mainnet-beta.solana.com',
  commitment: 'confirmed' as const,
};

export const API_ENDPOINTS = {
  jupiterPrice: process.env.EXPO_PUBLIC_JUPITER_PRICE_API || 'https://price.jup.ag/v4',
  tokenList: process.env.EXPO_PUBLIC_TOKEN_LIST_URL || 'https://token.jup.ag/all',
};

export const STORAGE_KEYS = {
  wallets: '@solana_tracker:wallets',
  tokenCache: '@solana_tracker:token_cache',
  priceCache: '@solana_tracker:price_cache',
};

export const COLORS = {
  wallet: [
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#EF4444', // red
  ],
};

export const TRANSACTION_LIMIT = 20;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
