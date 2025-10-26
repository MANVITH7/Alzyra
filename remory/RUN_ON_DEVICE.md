# Run Remory on a Real Device - Step by Step

Follow these exact steps to run Remory with LiveKit voice AI on your iPhone or Android phone.

## Prerequisites

Make sure you have:
- [ ] Node.js installed (`node --version`)
- [ ] Xcode installed (for iOS) - available from Mac App Store
- [ ] Android Studio installed (for Android) - from android.com
- [ ] Your phone connected via USB
- [ ] Developer mode enabled on your phone

---

## Step 1: Install Dependencies

```bash
cd /Users/manvithreddy/Downloads/Alzyra/remory
npm install
```

---

## Step 2: Generate Native Projects (One-time setup)

This creates the iOS and Android native code:

```bash
cd /Users/manvithreddy/Downloads/Alzyra/remory
npx expo prebuild --clean
```

**This step completed successfully!** ✅

---

## Step 3A: Build for iOS (iPhone)

### 3A.1: Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

**Time: ~2-5 minutes** (downloads native libraries)

### 3A.2: Open in Xcode

```bash
open ios/remory.xcworkspace
```

### 3A.3: Configure Signing in Xcode

1. In Xcode, click on **"remory"** in the left sidebar
2. Select **"remory"** target
3. Go to **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** (your Apple ID)
6. Change **Bundle Identifier** if needed (e.g., `com.yourname.remory`)

### 3A.4: Connect iPhone and Build

1. Connect your iPhone via USB
2. Unlock your iPhone
3. Trust the computer if prompted on phone
4. In Xcode, select your iPhone from the device dropdown (top center)
5. Click the **▶️ Play button** (or press `Cmd + R`)
6. Wait for build to complete (3-10 minutes first time)

**If you see signing errors:**
- Go to iPhone Settings → General → VPN & Device Management
- Trust your developer certificate

---

## Step 3B: Build for Android

### 3B.1: Enable Developer Options

1. On your Android phone: **Settings** → **About phone**
2. Tap **Build number** 7 times
3. Go back → **Developer options**
4. Enable **USB debugging**

### 3B.2: Connect Phone and Build

```bash
cd /Users/manvithreddy/Downloads/Alzyra/remory
npx expo run:android
```

This will:
1. Build the app
2. Install on your connected phone
3. Launch the app

**If ADB doesn't see your device:**
```bash
# Verify device is connected
adb devices

# If not showing, restart ADB
adb kill-server
adb start-server
```

---

## Step 4: Start Development Server

Open a **new terminal window** and run:

```bash
cd /Users/manvithreddy/Downloads/Alzyra/remory
npm start
```

Keep this running! It serves your JavaScript code.

---

## Step 5: Test LiveKit Voice AI

1. **Open the Remory app** on your phone
2. **Login** with test credentials
3. You'll see the **Patient Dashboard**
4. **Click "Reconstruct a Memory"**
5. **Grant microphone permission** when prompted
6. **Wait for connection** - you'll see "AI Assistant Active"
7. **Speak naturally** - e.g., "Can you help me remember my lunch with Sarah?"
8. The AI will **respond with voice**!

---

## Troubleshooting

### iOS: "No signing certificate found"
- Go to Xcode → Preferences → Accounts
- Add your Apple ID
- Download certificates

### iOS: Build fails with "Command PhaseScriptExecution failed"
```bash
cd ios
pod install --repo-update
cd ..
# Try building again in Xcode
```

### Android: "SDK location not found"
```bash
echo "sdk.dir=$HOME/Library/Android/sdk" >> ~/.gradle/gradle.properties
```

### App crashes immediately
1. Check logs in Xcode (iOS) or Android Studio (Android)
2. Verify `.env` file exists with LiveKit credentials
3. Check network connection

### Microphone not working
1. Settings → Privacy → Microphone → Enable for Remory
2. Android: Settings → Apps → Remory → Permissions → Microphone

### Agent not connecting
1. Verify agent is deployed: Check LiveKit Cloud dashboard
2. Check internet connection
3. Look for errors in Metro bundler terminal

---

## What's Running Now

After following these steps:
- ✅ Native app installed on your phone
- ✅ JavaScript server running (Metro bundler)
- ✅ Connected to LiveKit Cloud
- ✅ Voice AI agent ready

## Next Builds (Faster!)

After the first build, future builds are much faster (30-60 seconds):
1. Make code changes
2. Save files
3. App automatically reloads on phone
4. No need to rebuild!

---

## Still Having Issues?

1. Check that your `.env` file has correct LiveKit credentials
2. Verify LiveKit agent is deployed and running
3. Check Metro bundler for error messages
4. Try restarting: close app, restart Metro bundler, rebuild

## Support

If you're stuck, share:
- Error message
- Which step you're on
- iOS or Android
- Output from terminal/console
