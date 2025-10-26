# Expo Go Limitations with LiveKit

## Current Status: Expo Go Compatible ✅

The app has been modified to work in **Expo Go** by removing native LiveKit dependencies.

### What Works in Expo Go:
- ✅ Token generation
- ✅ App UI and navigation
- ✅ Authentication
- ✅ Dashboard features
- ✅ All non-WebRTC features

### What Doesn't Work in Expo Go:
- ❌ LiveKit voice AI agent (requires native WebRTC)

## Why LiveKit Doesn't Work in Expo Go

LiveKit's WebRTC implementation requires native modules that are not available in Expo Go. Expo Go only includes a limited set of pre-built native modules.

### Options:

1. **Use Expo Go** (Current)
   - All app features except LiveKit voice work
   - Perfect for development and testing UI
   - No build required

2. **Create Development Build** (For LiveKit)
   - Use `eas build` or `npx expo run:ios`
   - Includes LiveKit native modules
   - Full voice AI features work
   - Requires build/compilation

## Running the App in Expo Go

Simply run:
```bash
cd remory
npx expo start
```

Then scan the QR code with the Expo Go app on your phone.

The LiveKit "Reconstruct a Memory" button will show a message that voice features are not available in Expo Go.

## Summary

- **For general app testing**: Use Expo Go (current setup)
- **For LiveKit voice testing**: Create a development build
- **For production**: Always use a development/production build

The app is fully functional in Expo Go except for the LiveKit voice AI agent feature.
