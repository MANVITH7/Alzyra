# Expo Development Build Guide for LiveKit

## The Issue

LiveKit's WebRTC requires native modules (`@livekit/react-native-webrtc`) which are **not available in Expo Go**. You'll see this error:

```
Your JavaScript code tried to access a native module that doesn't exist.
If you're trying to use a module that is not supported in Expo Go, 
you need to create a development build of your app.
```

## Solution: Create a Development Build

You need to create a **development build** (custom Expo client) that includes the native LiveKit modules.

### Option 1: EAS Build (Recommended - Cloud Build)

Easily create a development build in the cloud:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure your project (if not already done)
eas build:configure

# Create a development build for iOS
eas build --profile development --platform ios

# Or for Android
eas build --profile development --platform android
```

### Option 2: Local Development Build

Build locally on your machine:

```bash
# For iOS (requires macOS with Xcode)
npx expo run:ios

# For Android (requires Android Studio)
npx expo run:android
```

### Option 3: Expo Prebuild (Best for Full Control)

Generate native code and use native development tools:

```bash
# Generate native projects
npx expo prebuild

# Then run with native tools
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## What Changes in app.json

Add the LiveKit plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@livekit/react-native-expo-plugin"
    ]
  }
}
```

You may need to install this plugin:
```bash
npm install @livekit/react-native-expo-plugin
```

## Current Workaround

For now, the app has been modified to:
- Skip WebRTC registration in Expo Go
- Show a message that LiveKit is not fully available
- Allow you to test other features

## Testing LiveKit Features

### Without Development Build (Current State)
- ❌ Voice interaction with LiveKit AI agent
- ✅ Other app features work
- ✅ UI and navigation work

### With Development Build
- ✅ Voice interaction with LiveKit AI agent
- ✅ Two-way audio communication
- ✅ Full LiveKit features

## Quick Start: EAS Build

The fastest way to get LiveKit working:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   eas login
   ```

3. **Build:**
   ```bash
   # For iOS (requires Apple Developer account)
   eas build --profile development --platform ios
   
   # For Android
   eas build --profile development --platform android
   ```

4. **Install the build:**
   - EAS will provide a link to download the build
   - Install it on your device
   - Run the app from the development build

## Platform-Specific Notes

### iOS
- Requires Xcode (if building locally)
- Requires Apple Developer account (for EAS builds)
- Can test on iOS Simulator

### Android
- Requires Android Studio (if building locally)
- Can test on Android Emulator or real device
- EAS builds work with Google Play account

## Troubleshooting

### "Module not found" errors
- Make sure you've run `npm install` after adding LiveKit dependencies
- Rebuild the app after adding native modules

### Build fails
- Check that all dependencies are compatible with Expo SDK 54
- Review the build logs for specific errors
- Try clearing the build cache

## Next Steps

1. Choose a build method (EAS recommended)
2. Follow the build instructions
3. Install the development build on your device
4. Test LiveKit voice interaction

Once you have a development build, the LiveKit AI agent voice features will work fully!
