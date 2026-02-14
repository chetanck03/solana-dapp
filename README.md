# Solana Wallet Tracker

A production-grade mobile wallet tracker for Solana built with React Native + Expo. Track SOL balance, SPL tokens, and recent transactions using raw RPC calls.

## 🚀 Features

- **Multi-Wallet Tracking**: Add and monitor multiple Solana wallets
- **Real-Time Balance**: View SOL balance with live updates
- **SPL Token Support**: See all tokens in your wallet
- **Transaction History**: Recent 20 transactions with status
- **Raw RPC Calls**: Direct Solana RPC integration (no heavy SDKs)
- **Offline Support**: Cached data for offline viewing
- **Clean Architecture**: Separated services, hooks, and UI components

## 📁 Project Structure

```
src/
├── config/          # App configuration and constants
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── navigation/      # Navigation setup
├── screens/         # Screen components
├── services/        # Business logic and API calls
│   ├── rpc.service.ts      # Solana RPC calls
│   ├── price.service.ts    # Price fetching
│   ├── token.service.ts    # Token metadata
│   └── storage.service.ts  # Local storage
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🛠 Tech Stack

- **React Native** + **Expo** - Mobile framework
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **AsyncStorage** - Local data persistence
- **React Navigation** - Screen navigation

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your RPC endpoints (optional - defaults to public endpoints)

## 🏃 Running the App

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🔧 Configuration

Edit `.env` file to configure:

- `EXPO_PUBLIC_SOLANA_RPC_URL` - Your Solana RPC endpoint (Helius, QuickNode, etc.)
- `EXPO_PUBLIC_JUPITER_PRICE_API` - Price data API
- `EXPO_PUBLIC_TOKEN_LIST_URL` - Token metadata registry

## 📱 Screens

1. **Home Screen** - List of all tracked wallets
2. **Add Wallet Screen** - Add new wallet by address
3. **Wallet Detail Screen** - View balance, tokens, and transactions

## 🎯 Key Features Explained

### Raw RPC Implementation
Direct Solana RPC calls without using `@solana/web3.js` to demonstrate blockchain fundamentals:
- `getBalance` - Fetch SOL balance
- `getTokenAccountsByOwner` - Get all SPL tokens
- `getSignaturesForAddress` - Recent transactions

### Service Layer Architecture
Clean separation of concerns:
- **RPC Service**: All blockchain interactions
- **Price Service**: Token price fetching with caching
- **Token Service**: Metadata management
- **Storage Service**: Local data persistence

### Custom Hooks
Reusable React hooks for common operations:
- `useWallet` - Single wallet data fetching
- `useWalletList` - Multi-wallet management

## 🚧 Roadmap

- [ ] WebSocket real-time updates
- [ ] QR code scanner for addresses
- [ ] Portfolio analytics dashboard
- [ ] Transaction categorization
- [ ] Push notifications
- [ ] Whale watching mode

## 📝 Notes

This project uses raw RPC calls to showcase understanding of Solana blockchain fundamentals. For production apps, consider using official SDKs like `@solana/web3.js` for additional features and optimizations.

## 🤝 Contributing

This is a portfolio/learning project. Feel free to fork and customize for your needs!

## 📄 License

MIT
