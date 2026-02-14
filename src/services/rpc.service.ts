// Solana RPC Service - Raw RPC calls

import { RPC_CONFIG, LAMPORTS_PER_SOL, TRANSACTION_LIMIT } from '../config/constants';
import type { RPCResponse, SolanaBalance, TokenAccount, Transaction } from '../types/solana';

class SolanaRPCService {
  private rpcUrl: string;
  private requestId: number = 0;

  constructor() {
    this.rpcUrl = RPC_CONFIG.url;
  }

  /**
   * Generic RPC call method
   */
  private async call<T>(method: string, params: any[] = []): Promise<T> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: ++this.requestId,
          method,
          params,
        }),
      });

      if (!response.ok) {
        throw new Error(`RPC request failed: ${response.statusText}`);
      }

      const data: RPCResponse<T> = await response.json();
      
      if ('error' in data) {
        throw new Error(`RPC error: ${(data as any).error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error(`RPC call failed for ${method}:`, error);
      throw error;
    }
  }

  /**
   * Get SOL balance for an address
   */
  async getBalance(address: string): Promise<SolanaBalance> {
    console.log('Fetching balance for:', address);
    console.log('Using RPC URL:', this.rpcUrl);
    
    const result = await this.call<{ value: number }>('getBalance', [
      address,
      { commitment: RPC_CONFIG.commitment },
    ]);

    console.log('Balance result:', result);

    return {
      lamports: result.value,
      sol: result.value / LAMPORTS_PER_SOL,
    };
  }

  /**
   * Get all SPL token accounts for an address
   */
  async getTokenAccounts(address: string): Promise<TokenAccount[]> {
    const result = await this.call<{
      value: Array<{
        pubkey: string;
        account: {
          data: {
            parsed: {
              info: {
                mint: string;
                owner: string;
                tokenAmount: {
                  amount: string;
                  decimals: number;
                  uiAmount: number;
                };
              };
            };
          };
        };
      }>;
    }>('getTokenAccountsByOwner', [
      address,
      { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
      { encoding: 'jsonParsed' },
    ]);

    return result.value.map((item) => ({
      pubkey: item.pubkey,
      mint: item.account.data.parsed.info.mint,
      owner: item.account.data.parsed.info.owner,
      amount: item.account.data.parsed.info.tokenAmount.amount,
      decimals: item.account.data.parsed.info.tokenAmount.decimals,
      uiAmount: item.account.data.parsed.info.tokenAmount.uiAmount,
    }));
  }

  /**
   * Get recent transaction signatures for an address
   */
  async getTransactionSignatures(address: string, limit: number = TRANSACTION_LIMIT): Promise<Transaction[]> {
    const result = await this.call<
      Array<{
        signature: string;
        slot: number;
        blockTime: number | null;
        err: any;
        memo: string | null;
      }>
    >('getSignaturesForAddress', [address, { limit }]);

    return result.map((tx) => ({
      signature: tx.signature,
      slot: tx.slot,
      blockTime: tx.blockTime,
      err: tx.err,
      memo: tx.memo || undefined,
    }));
  }

  /**
   * Get detailed transaction information
   */
  async getTransaction(signature: string) {
    return await this.call('getTransaction', [
      signature,
      {
        encoding: 'jsonParsed',
        maxSupportedTransactionVersion: 0,
      },
    ]);
  }

  /**
   * Get account info (useful for checking if account exists)
   */
  async getAccountInfo(address: string) {
    return await this.call('getAccountInfo', [
      address,
      { encoding: 'jsonParsed' },
    ]);
  }
}

export const rpcService = new SolanaRPCService();
