# Building Remory with LiveKit

This guide explains how to build the Remory app with LiveKit voice AI support using Expo development builds.

## Prerequisites

1. **Install EAS CLI** (Expo Application Services):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure your project**:
   ```bash
   eas build:configure
   ```

## Environment Setup

Create a `.env` file in the `remory` directory with your LiveKit credentials:

```bash
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

## Building for iOS (macOS only)

### 1. Install iOS Dependencies

```bash
cd remory
cd ios
pod install
cd ..
```

### 2. Build Development Client

```bash
eas build --profile development --platform ios
```

Or for simulator:

```bash
eas build --profile development --platform ios --local
```

### 3. Install on Device

Once the build completes, you'll get a link to install the app on your iOS device.

### 4. Run the App

```bash
npx expo start --dev-client
```

Then press `i` to open in iOS simulator or scan the QR code with your device.

## Building for Android

### 1. Build Development Client

```bash
eas build --profile development --platform android
```

Or for faster local builds:

```bash
eas build --profile development --platform android --local
```

**Note**: Local builds require Android SDK and related tools to be installed.

### 2. Install APK

Download and install the generated APK on your Android device or emulator.

### 3. Run the App

```bash
npx expo start --dev-client
```

Then press `a` to open on Android.

## Local Development with Simulator

For faster iteration, you can use prebuild to generate native projects:

### iOS

```bash
npx expo prebuild --clean
cd ios
pod install
cd ..
npx expo run:ios
```

### Android

```bash
npx expo prebuild --clean
npx expo run:android
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**:
   - Clean and rebuild: `npx expo prebuild --clean`
   - Reinstall pods: `cd ios && pod install`

2. **Audio permissions issues**:
   - Make sure `app.json` has the correct permissions (already configured)
   - Check device settings to ensure microphone access is granted

3. **WebRTC connection issues**:
   - Verify your `.env` file has correct LiveKit credentials
   - Check that the LiveKit agent is deployed and running

4. **Agent not connecting**:
   - Ensure your LiveKit agent is deployed to LiveKit Cloud
   - Check the agent logs in the LiveKit Cloud dashboard

## Production Build

Once ready for production:

```bash
eas build --profile production --platform all
```

This will create production builds for both iOS and Android.

## Testing Voice AI Agent

1. Start the app
2. Navigate to Patient Dashboard
3. Click "Reconstruct a Memory"
4. Wait for connection to establish
5. Speak naturally to the AI agent

The agent state will be displayed in the UI, showing:
- `initializing`: Agent is starting up
- `listening`: Agent is listening for your voice
- `thinking`: Agent is processing your request
- `speaking`: Agent is responding

## Resources

- [Expo Development Builds Documentation](https://docs.expo.dev/development/build/introduction/)
- [LiveKit React Native Documentation](https://docs.livekit.io/client-sdk-react-native/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
