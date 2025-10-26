# Quick Start Guide - Remory with LiveKit Voice AI

This guide will help you quickly build and run the Remory app with LiveKit voice AI support.

## Prerequisites Checklist

- [ ] Node.js and npm installed
- [ ] Expo CLI installed: `npm install -g expo-cli`
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] LiveKit credentials configured in `.env`
- [ ] LiveKit agent deployed to LiveKit Cloud

## Fastest Way to Get Started (Local Development)

### For iOS Simulator (macOS)

```bash
cd remory
npx expo prebuild --clean
cd ios
pod install
cd ..
npx expo run:ios
```

### For Android

```bash
cd remory
npx expo prebuild --clean
npx expo run:android
```

This will:
1. Generate native iOS/Android projects
2. Install all dependencies
3. Build and launch the app in simulator/emulator

## Using EAS Build (Recommended for Real Devices)

### 1. Login to Expo
```bash
eas login
```

### 2. Configure Project
```bash
eas build:configure
```

### 3. Build Development Client

For iOS:
```bash
eas build --profile development --platform ios
```

For Android:
```bash
eas build --profile development --platform android
```

### 4. After Build Completes

Download and install the app on your device, then:

```bash
cd remory
npx expo start --dev-client
```

Scan the QR code with your device to connect.

## Testing the Voice AI Agent

1. **Start the app** (using one of the methods above)

2. **Navigate to Patient Dashboard** 
   - Login with test credentials
   - You'll land on the Patient Dashboard

3. **Click "Reconstruct a Memory"** 
   - The app will connect to your LiveKit agent
   - You'll see connection status in real-time

4. **Speak to the AI**
   - Say something like "Can you help me remember my lunch with Sarah?"
   - The agent will respond naturally
   - Agent state updates will be visible in the UI

## Current Configuration

- **LiveKit URL**: `wss://alzyra-ag7zclvm.livekit.cloud`
- **Agent**: Deployed to LiveKit Cloud
- **Microphone**: Auto-enabled for voice interactions
- **WebRTC**: Native React Native implementation (not WebView)

## Troubleshooting

### "Module not found" or build errors
```bash
cd remory
npx expo prebuild --clean
npx expo install
```

### Agent not connecting
1. Verify agent is deployed: Check LiveKit Cloud dashboard
2. Check `.env` file has correct credentials
3. Look for connection errors in the app console

### Audio permissions
- iOS: Settings → Remory → Microphone → Enable
- Android: Settings → Apps → Remory → Permissions → Microphone

## Next Steps

1. **Test voice interactions** - Try different questions
2. **Monitor agent performance** - Check LiveKit Cloud dashboard
3. **Customize agent prompts** - Edit `alzyra/src/agent.py`
4. **Add memory features** - Integrate with your memory reconstruction logic

## Resources

- Full build guide: See `BUILD_GUIDE.md`
- LiveKit docs: https://docs.livekit.io
- Expo docs: https://docs.expo.dev
