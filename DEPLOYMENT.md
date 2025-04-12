# Deployment Guide for BudgetAI

This document provides step-by-step instructions to deploy the BudgetAI mobile application for development, testing, and production (publishing to app stores).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running Locally (Development)](#running-locally-development)
- [Building for Production](#building-for-production)
- [Publishing to App Stores](#publishing-to-app-stores)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## Prerequisites

- **Node.js** (v16 or later recommended)
- **npm** (v7 or later) or **yarn**
- **Expo CLI** (if using Expo)
- **Git**
- **Android Studio** (for Android builds/emulator)
- **Xcode** (for iOS builds/simulator, macOS only)
- Accounts for [Google Play Console](https://play.google.com/console/) and [Apple Developer](https://developer.apple.com/account/) (for publishing)

---

## Environment Setup

1. **Clone the repository:**
   ```sh
   git clone <REPO_URL>
   cd BudgetAI-delivery
   ```

2. **Install dependencies:**
   ```sh
```

2. Configure the project
```
eas build:configure
```

### Building for Android

1. Create a build for Android
```
eas build --platform android
```

2. Submit to Google Play Store
```
eas submit --platform android
```

### Building for iOS

1. Create a build for iOS
```
eas build --platform ios
```

2. Submit to Apple App Store
```
eas submit --platform ios
```

## Environment Variables

The app uses the following environment variables that should be configured in your Expo account or through EAS:

- `API_URL`: Base URL for backend API (if applicable)
- `STORAGE_KEY`: Key for local storage encryption

## Custom Configuration

You can customize the app's behavior by modifying the following files:

- `app.json`: Main configuration file for Expo
- `src/constants/appConstants.js`: Application-specific constants

## Troubleshooting

If you encounter issues during deployment:

1. Ensure all dependencies are correctly installed
2. Verify that your Expo account has the necessary permissions
3. Check the build logs for specific error messages
4. For iOS builds, ensure your Apple Developer account is properly configured

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
