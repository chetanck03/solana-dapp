# EAS (Expo Application Services) Setup Guide

## What is EAS?

**EAS** = **Expo Application Services**

It's Expo's cloud service for:
- Building apps (iOS/Android)
- Submitting to app stores
- Over-the-air updates
- Managing app versions

## Getting Started with EAS

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

If you don't have an account:
1. Go to https://expo.dev/signup
2. Create a free account
3. Then run `eas login`

### Step 3: Initialize EAS in Your Project

```bash
# This will automatically create/update your project ID
eas build:configure
```

This command will:
- Create an Expo project if you don't have one
- Generate a unique project ID
- Update your `app.json` with the project ID
- Create `eas.json` if it doesn't exist

### Step 4: Build Your APK

```bash
# Build preview APK
eas build --platform android --profile preview
```

## How to Get Project ID Manually

If you need to find your project ID:

### Method 1: Automatic (Recommended)
```bash
eas build:configure
```
This automatically adds the project ID to `app.json`

### Method 2: From Expo Dashboard
1. Go to https://expo.dev/
2. Login to your account
3. Click on your project
4. Copy the Project ID from the URL or settings

### Method 3: Create New Project
```bash
# This creates a new project and gets the ID
eas project:init
```

## Do You Need a Project ID?

**For basic builds: NO** ✅

You can build without a project ID by running:
```bash
eas build:configure
```

This will automatically set everything up for you.

**For advanced features: YES**
- Over-the-air updates
- Multiple environments
- Team collaboration
- Build history tracking

## EAS Free Tier

Expo offers a free tier with:
- ✅ 30 builds per month
- ✅ Unlimited projects
- ✅ Basic support
- ✅ Build history

Upgrade to paid plans for:
- More builds per month
- Priority builds (faster)
- Advanced features

## Quick Start Commands

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure (gets project ID automatically)
eas build:configure

# 4. Build APK
eas build --platform android --profile preview

# 5. Check build status
eas build:list
```

## Common EAS Commands

```bash
# View all builds
eas build:list

# View specific build
eas build:view [build-id]

# Cancel a build
eas build:cancel [build-id]

# View project info
eas project:info

# Initialize new project
eas project:init

# Configure builds
eas build:configure
```

## Troubleshooting

### "Not logged in"
```bash
eas login
```

### "No project ID found"
```bash
eas build:configure
```

### "Build failed"
```bash
# View build logs
eas build:view [build-id]

# Or check latest build
eas build:list
```

### "eas: command not found"
```bash
npm install -g eas-cli
```

## Build Profiles

Your `eas.json` has 3 profiles:

1. **development** - For testing with dev tools
2. **preview** - For internal testing (recommended)
3. **production** - For app store release

Use preview for most cases:
```bash
eas build -p android --profile preview
```

## Environment Variables

Your environment variables are configured in `eas.json`:

```json
{
  "env": {
    "EXPO_PUBLIC_SOLANA_RPC_URL": "https://api.mainnet-beta.solana.com",
    "EXPO_PUBLIC_SOLANA_WS_URL": "wss://api.mainnet-beta.solana.com",
    "EXPO_PUBLIC_TOKEN_LIST_URL": "https://token.jup.ag/strict"
  }
}
```

These are automatically included in your APK build.

## Next Steps

1. Run `eas build:configure` to set up your project
2. Run `eas build -p android --profile preview` to build
3. Wait 10-15 minutes for build to complete
4. Download and install the APK

## Resources

- EAS Documentation: https://docs.expo.dev/eas/
- EAS Build: https://docs.expo.dev/build/introduction/
- Expo Dashboard: https://expo.dev/
- Pricing: https://expo.dev/pricing

---

**TL;DR - Quick Start:**

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

That's it! EAS will handle everything automatically. 🚀
