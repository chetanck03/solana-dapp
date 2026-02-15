# Solana Wallet Tracker

A production-grade mobile wallet tracker for Solana built with React Native + Expo. Track SOL balance, SPL tokens, and recent transactions using raw RPC calls.

## 🚀 Features

- **Multi-Wallet Tracking**: Add and monitor multiple Solana wallets
- **Real-Time Balance**: View SOL balance with live updates
- **SPL Token Support**: See all tokens in your wallet with logos and metadata
- **Transaction History**: Recent transactions with clickable links to Solscan
- **Raw RPC Calls**: Direct Solana RPC integration (no heavy SDKs)
- **Offline Support**: Cached data for offline viewing
- **Clean Architecture**: Separated services, hooks, and UI components
- **Search & Filter**: Search wallets by nickname or address
- **Copy & Explorer**: Copy addresses and open in Solscan explorer

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
│   ├── price.service.ts    # Price fetching (disabled)
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
- **Ionicons** - Icon library

## 📦 Installation

### Prerequisites

```bash
# Install Node.js (v16 or higher)
# Install npm or yarn
```

### Create New Project (Optional)

If starting from scratch:

```bash
# Create new React Native project with NativeWind
npx rn-new@latest solana-dapp --nativewind
```

### Install Dependencies

```bash
cd solana-dapp

# Install dependencies
npm install
```

### Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Update `.env` with your RPC endpoints (optional - defaults to public endpoints):

```env
EXPO_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
EXPO_PUBLIC_SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
EXPO_PUBLIC_TOKEN_LIST_URL=https://token.jup.ag/strict
```

For better performance, get a free Helius API key:
- Go to https://www.helius.dev/
- Sign up and create a project
- Update `.env` with your key

## 🏃 Running the App

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## 🔧 Configuration

### Solana RPC Documentation

For more information about Solana RPC methods and endpoints:
- Official Docs: https://solana.com/docs/rpc
- RPC Methods: https://solana.com/docs/rpc/http
- WebSocket API: https://solana.com/docs/rpc/websocket

### Available RPC Providers

1. **Public RPC** (Free, rate-limited)
   - `https://api.mainnet-beta.solana.com`

2. **Helius** (Recommended - Free tier: 100 req/s)
   - https://www.helius.dev/

3. **QuickNode** (Free tier: 10M req/month)
   - https://www.quicknode.com/

4. **Alchemy** (Free tier: 300M compute units/month)
   - https://www.alchemy.com/

## 📱 Screens

1. **Home Screen** - List of all tracked wallets with search
2. **Add Wallet Screen** - Add new wallet by address
3. **Wallet Detail Screen** - View balance, tokens, and transactions
4. **Token Detail Screen** - View token info and transactions

## 🎯 Key Features Explained

### Raw RPC Implementation
Direct Solana RPC calls without using `@solana/web3.js` to demonstrate blockchain fundamentals:
- `getBalance` - Fetch SOL balance
- `getTokenAccountsByOwner` - Get all SPL tokens
- `getSignaturesForAddress` - Recent transactions

### Service Layer Architecture
Clean separation of concerns:
- **RPC Service**: All blockchain interactions
- **Token Service**: Metadata management with caching
- **Storage Service**: Local data persistence

### Custom Hooks
Reusable React hooks for common operations:
- `useWallet` - Single wallet data fetching
- `useWalletList` - Multi-wallet management

## 🔨 Building APK

Quick build:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

## 🚧 Roadmap

- [ ] WebSocket real-time updates
- [ ] QR code scanner for addresses
- [ ] Portfolio analytics dashboard
- [ ] Transaction categorization
- [ ] Push notifications
- [ ] NFT gallery viewer
- [ ] Wallet Connect integration

## 📝 Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier

# Build
npm run prebuild       # Generate native code
```

## 🤝 Contributing

This is a portfolio/learning project. Feel free to fork and customize for your needs!

## 📄 License

MIT

## 🔗 Resources

- **Solana Documentation**: https://solana.com/docs
- **Solana RPC API**: https://solana.com/docs/rpc
- **Expo Documentation**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **NativeWind**: https://www.nativewind.dev/

## 💡 Tips

- Use Helius or QuickNode for better performance
- Token metadata loads from Jupiter's registry
- App works offline with cached data
- All transactions link to Solscan explorer
- Search wallets by nickname or address

## 🐛 Troubleshooting

### Token metadata not loading
- Check internet connection
- Token list loads from Jupiter (may be slow)
- App works without metadata (shows placeholders)

### RPC errors
- Public RPC has rate limits
- Use Helius/QuickNode for better reliability
- Check `.env` configuration

### Build errors
- Run `npm install` to ensure dependencies
- Clear cache: `npm start -- --clear`
- Check [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md)

---

**Built with ❤️ for the Solana ecosystem**
