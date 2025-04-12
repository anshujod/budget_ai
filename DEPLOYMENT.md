# BudgetAI - Deployment Guide

This document provides instructions for deploying the BudgetAI app to both development and production environments.

## Prerequisites

Before deploying, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- An Expo account (create one at https://expo.dev/signup)

## Development Deployment

To run the app in development mode:

1. Clone the repository
```
git clone https://github.com/yourusername/budget-ai.git
cd budget-ai
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npx expo start
```

4. Use the Expo Go app on your device to scan the QR code, or press 'a' to open on an Android emulator or 'i' for iOS simulator.

## Production Deployment

### Setting up EAS Build

1. Log in to your Expo account
```
eas login
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
