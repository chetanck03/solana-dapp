# API Setup Guide - Getting Your API Keys

This guide will help you get all the API keys needed for the Solana Wallet Tracker.

## 🔑 Required APIs

### 1. Solana RPC Endpoint (Required)

You need a Solana RPC endpoint to fetch blockchain data. Here are your options:

#### Option A: Free Public Endpoints (Quick Start)
No signup needed, but rate-limited:

```env
EXPO_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
EXPO_PUBLIC_SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
```

**Pros**: Free, instant
**Cons**: Rate limits, slower, less reliable

---

#### Option B: Helius (Recommended for Development)

**Free Tier**: 100 requests/second

1. Go to [https://www.helius.dev/](https://www.helius.dev/)
2. Click "Start Building" or "Sign Up"
3. Create an account (email or GitHub)
4. Go to Dashboard → Create New Project
5. Copy your API key

```env
EXPO_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
EXPO_PUBLIC_SOLANA_WS_URL=wss://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

**Pros**: Generous free tier, fast, reliable
**Cons**: Requires signup

---

#### Option C: QuickNode

**Free Tier**: 10M requests/month

1. Go to [https://www.quicknode.com/](https://www.quicknode.com/)
2. Click "Sign Up" (top right)
3. Create account
4. Click "Create Endpoint"
5. Select:
   - Chain: Solana
   - Network: Mainnet
   - Plan: Free
6. Copy your HTTP and WSS endpoints

```env
EXPO_PUBLIC_SOLANA_RPC_URL=https://your-endpoint.solana-mainnet.quiknode.pro/YOUR_KEY/
EXPO_PUBLIC_SOLANA_WS_URL=wss://your-endpoint.solana-mainnet.quiknode.pro/YOUR_KEY/
```

**Pros**: Very reliable, good free tier
**Cons**: Requires credit card for signup

---

#### Option D: Alchemy

**Free Tier**: 300M compute units/month

1. Go to [https://www.alchemy.com/](https://www.alchemy.com/)
2. Click "Get Started Free"
3. Create account
4. Create new app:
   - Chain: Solana
   - Network: Mainnet
5. View app → Copy HTTP and WSS URLs

```env
EXPO_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
EXPO_PUBLIC_SOLANA_WS_URL=wss://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

---

### 2. Jupiter Price API (Optional - No Key Needed!)

Jupiter provides free price data without authentication:

```env
EXPO_PUBLIC_JUPITER_PRICE_API=https://price.jup.ag/v4
```

**No signup required!** ✅

---

### 3. Birdeye API (Optional Alternative for Prices)

Only needed if you want more detailed price data or Jupiter is down.

**Free Tier**: 100 requests/day

1. Go to [https://birdeye.so/](https://birdeye.so/)
2. Click "API" in top menu
3. Click "Get API Key"
4. Sign up with email
5. Verify email
6. Go to Dashboard → API Keys
7. Copy your API key

```env
EXPO_PUBLIC_BIRDEYE_API_KEY=your_birdeye_api_key_here
```

**Note**: The app works fine without Birdeye - Jupiter is sufficient!

---

### 4. Token List (No Key Needed!)

Jupiter provides a free token registry:

```env
EXPO_PUBLIC_TOKEN_LIST_URL=https://token.jup.ag/all
```

**No signup required!** ✅

---

## 🚀 Quick Start Setup

### Minimal Setup (Works Immediately)

Create `.env` file with just public endpoints:

```env
# Free public endpoints - no signup needed
EXPO_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
EXPO_PUBLIC_SOLANA_WS_URL=wss://api.mainnet-beta.solana.com

# Free Jupiter APIs - no key needed
EXPO_PUBLIC_JUPITER_PRICE_API=https://price.jup.ag/v4
EXPO_PUBLIC_TOKEN_LIST_URL=https://token.jup.ag/all

# Optional - leave empty for now
EXPO_PUBLIC_BIRDEYE_API_KEY=
```

**This works right away!** You can upgrade to better RPC later.

---

### Recommended Setup (5 minutes)

1. Sign up for Helius (free, no credit card)
2. Get your API key
3. Create `.env`:

```env
# Helius RPC (fast and reliable)
EXPO_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY
EXPO_PUBLIC_SOLANA_WS_URL=wss://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY

# Jupiter APIs (free, no key)
EXPO_PUBLIC_JUPITER_PRICE_API=https://price.jup.ag/v4
EXPO_PUBLIC_TOKEN_LIST_URL=https://token.jup.ag/all

# Optional
EXPO_PUBLIC_BIRDEYE_API_KEY=
```

---

## 📊 Comparison Table

| Provider | Free Tier | Signup | Credit Card | Speed | Reliability |
|----------|-----------|--------|-------------|-------|-------------|
| Public RPC | Unlimited* | ❌ No | ❌ No | ⭐⭐ | ⭐⭐ |
| Helius | 100 req/s | ✅ Yes | ❌ No | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| QuickNode | 10M/month | ✅ Yes | ⚠️ Yes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Alchemy | 300M CU/month | ✅ Yes | ❌ No | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Jupiter | Free | ❌ No | ❌ No | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

*Rate limited, may be slow during peak times

---

## 🎯 My Recommendation

**For Hackathons/Demos:**
- Use Helius (fast, reliable, free)
- Jupiter for prices (no key needed)
- Skip Birdeye (not needed)

**For Quick Testing:**
- Use public RPC (instant, no signup)
- Jupiter for prices
- Upgrade to Helius if you hit rate limits

**For Production:**
- QuickNode or Helius paid tier
- Add Birdeye for advanced analytics

---

## 🔒 Security Tips

1. **Never commit `.env` to git** - it's already in `.gitignore`
2. **Don't share your API keys** publicly
3. **Rotate keys** if accidentally exposed
4. **Use different keys** for dev/production

---

## ❓ Troubleshooting

### "Rate limit exceeded"
→ Upgrade from public RPC to Helius/QuickNode

### "Failed to fetch prices"
→ Check internet connection, Jupiter API is usually very reliable

### "Invalid RPC endpoint"
→ Make sure your API key is correct and endpoint URL has no spaces

### "Token metadata not loading"
→ Jupiter token list might be temporarily down, app will still work without logos

---

## 📝 Final `.env` Example

Here's a complete working example:

```env
# Helius RPC (replace with your key)
EXPO_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=abc123-your-key-here
EXPO_PUBLIC_SOLANA_WS_URL=wss://mainnet.helius-rpc.com/?api-key=abc123-your-key-here

# Jupiter (no key needed)
EXPO_PUBLIC_JUPITER_PRICE_API=https://price.jup.ag/v4
EXPO_PUBLIC_TOKEN_LIST_URL=https://token.jup.ag/all

# Birdeye (optional)
EXPO_PUBLIC_BIRDEYE_API_KEY=
```

---

## 🚀 Ready to Go!

Once you have your `.env` file set up:

```bash
# Install dependencies
npm install

# Start the app
npm start
```

Your Solana wallet tracker is ready to use! 🎉
