# Android Studio Setup Guide for Remory

This guide will help you set up Android Studio and create an emulator to test the VAPI voice integration.

## Step 1: Download Android Studio

### Download Link
**https://developer.android.com/studio**

1. Click the **"Download Android Studio"** button
2. Accept the terms and conditions
3. Download will start (file size: ~1GB)
4. File name: `android-studio-2024.x.x.x-windows.exe`

## Step 2: Install Android Studio

### Installation Process

1. **Run the installer** (`android-studio-*.exe`)
2. Click **"Next"** on the welcome screen
3. **Select components to install**:
   - ✅ Android Studio
   - ✅ Android Virtual Device (AVD) - **IMPORTANT: Make sure this is checked!**
4. Click **"Next"**
5. Choose installation location (default is fine: `C:\Program Files\Android\Android Studio`)
6. Click **"Install"**
7. Wait for installation to complete (5-10 minutes)
8. Click **"Finish"**

### First Launch Setup

1. Android Studio will launch automatically
2. **"Import Android Studio Settings"** dialog:
   - Select: **"Do not import settings"**
   - Click **"OK"**

3. **Android Studio Setup Wizard**:
   - Click **"Next"** on the welcome screen

4. **Install Type**:
   - Select: **"Standard"** (recommended)
   - Click **"Next"**

5. **Select UI Theme**:
   - Choose your preferred theme (Light or Dark)
   - Click **"Next"**

6. **Verify Settings**:
   - You should see:
     - ✅ Android SDK
     - ✅ Android SDK Platform
     - ✅ Android Virtual Device
     - ✅ Performance (Intel HAXM) - for Windows
   - Click **"Next"**

7. **License Agreement**:
   - Click **"Accept"** for all licenses
   - Click **"Finish"**

8. **Downloading Components**:
   - This will download ~2-3GB of files
   - Wait 10-20 minutes depending on your internet speed
   - Click **"Finish"** when complete

## Step 3: Set Up Environment Variables

### Add ANDROID_HOME

1. Press `Win + R` to open Run dialog
2. Type: `sysdm.cpl` and press Enter
3. Click **"Advanced"** tab
4. Click **"Environment Variables"** button

### User Variables

1. Click **"New"** under "User variables"
2. **Variable name**: `ANDROID_HOME`
3. **Variable value**: `C:\Users\Kamalesh\AppData\Local\Android\Sdk`
   - (This is the default SDK location)
4. Click **"OK"**

### Update PATH Variable

1. Find **"Path"** in "User variables"
2. Select it and click **"Edit"**
3. Click **"New"** and add these entries:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
4. Click **"OK"** on all dialogs

### Verify Installation

Open a **NEW** Command Prompt (important - must be new to load new env vars):

```bash
# Check ADB
adb --version

# Should show something like:
# Android Debug Bridge version 1.0.41

# Check emulator
emulator -version

# Should show emulator version info
```

## Step 4: Create Android Virtual Device (AVD)

### Launch Device Manager

1. Open Android Studio
2. Click **"More Actions"** dropdown (or three dots)
3. Select **"Virtual Device Manager"**
   - Or: **Tools** → **Device Manager**

### Create New Device

1. Click **"Create Device"** button (+ icon)

2. **Select Hardware**:
   - Category: **"Phone"**
   - Device: **"Pixel 5"** (recommended)
     - Good balance of features and performance
     - Screen: 6.0", Resolution: 1080x2340
   - Click **"Next"**

3. **System Image** (Android Version):
   - Tab: **"Recommended"**
   - Select: **"Tiramisu"** (API Level 33, Android 13)
     - Click **"Download"** next to it
     - Accept license
     - Wait for download (~1-2GB)
   - After download, select **"Tiramisu"**
   - Click **"Next"**

4. **AVD Configuration**:
   - **AVD Name**: `Pixel_5_API_33` (or keep default)
   - **Startup orientation**: Portrait
   - Click **"Show Advanced Settings"**

   **Advanced Settings**:
   - **RAM**: 2048 MB (minimum), 4096 MB (recommended if you have RAM)
   - **VM heap**: 256 MB
   - **Internal Storage**: 2048 MB (default)
   - **SD card**: Studio-managed, 512 MB
   - **Graphics**: Automatic (or Hardware - GLES 2.0 if you have good GPU)

   - Click **"Finish"**

## Step 5: Start the Emulator

### Launch from Device Manager

1. In **Device Manager**, find your newly created device
2. Click the **▶️ Play button** (green triangle)
3. Wait 30-60 seconds for the emulator to boot
4. You should see an Android phone screen appear

### First Boot Setup

The emulator will boot to Android's home screen:
- You can skip any setup wizards
- No need to sign in to Google Account
- Just get to the home screen

### Verify Emulator is Running

Open Command Prompt:

```bash
adb devices
```

You should see:
```
List of devices attached
emulator-5554   device
```

## Step 6: Build and Run Your Remory App

### Option A: Using Expo (Recommended)

1. **Make sure emulator is running** (you should see the Android home screen)

2. **Open a NEW terminal** (to load new environment variables):

```bash
cd C:\Users\Kamalesh\Remory\remory

# Build and run on the emulator
npx expo run:android
```

This will:
- Detect the running emulator
- Build the native app with VAPI support
- Install it on the emulator
- Launch the app

**First build takes 5-10 minutes** - this is normal!

### Option B: Using Android Studio

1. **Open the project in Android Studio**:
   ```bash
   cd C:\Users\Kamalesh\Remory\remory
   npx expo prebuild --clean
   ```

2. In Android Studio:
   - **File** → **Open**
   - Navigate to: `C:\Users\Kamalesh\Remory\remory\android`
   - Click **"OK"**

3. Wait for Gradle sync to complete

4. Click the **▶️ Run button** (green triangle) in the toolbar

5. Select your emulator from the device list

## Troubleshooting

### Emulator won't start
- **Check virtualization**: Go to Task Manager → Performance → CPU, check if "Virtualization" is Enabled
- If disabled, enable VT-x/AMD-V in BIOS
- Try: Tools → SDK Manager → SDK Tools → Intel x86 Emulator Accelerator (HAXM)

### "adb not found"
- Close and reopen your terminal (to load new PATH)
- Verify ANDROID_HOME is set: `echo %ANDROID_HOME%`

### Emulator is slow
- Increase RAM in AVD settings (4GB recommended)
- Enable Hardware graphics acceleration
- Close other applications
- Try a system image with Google APIs (smaller)

### Build errors
```bash
# Clean and rebuild
cd C:\Users\Kamalesh\Remory\remory
npx expo prebuild --clean
npm install
npx expo run:android
```

## Quick Reference Commands

```bash
# List all emulators
emulator -list-avds

# Start specific emulator from command line
emulator -avd Pixel_5_API_33

# List connected devices
adb devices

# Install APK manually
adb install path/to/app.apk

# View logs
adb logcat

# Restart ADB server
adb kill-server
adb start-server
```

## Testing VAPI Voice Integration

Once the app is running on the emulator:

1. **Login** to the app
2. **Grant microphone permissions** when prompted
3. **Test the voice buttons**:
   - Click any "Recall" button on memory cards
   - Click "I'm feeling confused" ❤️
   - Click "AI Voice Assistant (Vapi)" 🤖

4. **The emulator has microphone support** - you can speak to test!
   - Your PC's microphone will work in the emulator

## Next Steps After Setup

- See `VAPI_INTEGRATION_GUIDE.md` for testing the voice features
- The Python LiveKit agent is already running if you want to test that too
- Both VAPI and LiveKit will work in the development build

---

**Total Setup Time**: ~45-60 minutes (including downloads)

**Disk Space Required**: ~8-10 GB

**RAM Recommended**: 8GB+ (minimum 4GB)
