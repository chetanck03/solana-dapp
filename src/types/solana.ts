// Solana RPC Types

export interface SolanaBalance {
  lamports: number;
  sol: number;
}

export interface TokenAccount {
  pubkey: string;
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  uiAmount: number;
}

export interface TokenMetadata {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
}

export interface Transaction {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: any;
  memo?: string;
  type?: TransactionType;
}

export interface TransactionDetail extends Transaction {
  fee: number;
  preBalances: number[];
  postBalances: number[];
  instructions: any[];
}

export type TransactionType = 'transfer' | 'swap' | 'stake' | 'nft' | 'unknown';

export interface WalletData {
  address: string;
  nickname?: string;
  color?: string;
  balance: SolanaBalance;
  tokens: TokenAccount[];
  transactions: Transaction[];
  lastUpdated: number;
}

export interface PriceData {
  [mint: string]: {
    price: number;
    change24h?: number;
  };
}

export interface RPCResponse<T> {
  jsonrpc: string;
  result: T;
  id: number;
}

export interface RPCError {
  code: number;
  message: string;
}
