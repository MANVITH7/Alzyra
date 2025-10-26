# Alternative Voice Assistant Setup 🎙️

## Overview

I've added a **Simple Voice Assistant** that works alongside your existing LiveKit integration. This uses `expo-av` (already installed) and requires installing `expo-speech`.

## What's Been Added

### 1. New Service: `voiceAssistantService.js`
- **File**: `remory/services/voiceAssistantService.js`
- Uses `expo-av` for audio recording
- Uses `expo-speech` for text-to-speech
- Simple recording → transcription → AI response → speech flow

### 2. Updated Patient Dashboard
- New button: **"🗣️ Simple Voice Assistant"**
- Works alongside the existing "Reconstruct a Memory" LiveKit button
- Blue button (vs. green LiveKit button)

## How It Works

### Simple Flow:
1. User clicks "Simple Voice Assistant"
2. App starts recording audio
3. User speaks their question
4. App stops recording and processes audio
5. AI generates response
6. Response is spoken back to user

### Technical Implementation:
```
Click Button
    ↓
Start Recording (expo-av)
    ↓
Stop Recording
    ↓
Speech to Text (Mock - can be OpenAI Whisper)
    ↓
AI Response (Mock - can be OpenAI GPT)
    ↓
Text to Speech (expo-speech)
    ↓
User hears response
```

## Installation

### Step 1: Install Required Package

```bash
cd /Users/manvithreddy/Downloads/Alzyra/remory
npm install expo-speech
```

### Step 2: Install Pods (iOS)

```bash
cd ios
pod install
cd ..
```

### Step 3: Build and Run

```bash
npx expo run:ios
```

## Usage

### In the App:

1. Open the Patient Dashboard
2. You'll see two buttons:
   - **"Reconstruct a Memory"** (Green) - LiveKit agent
   - **"🗣️ Simple Voice Assistant"** (Blue) - New simple assistant

3. Click "Simple Voice Assistant"
4. Speak your question when prompted
5. Click "Stop Recording" when done speaking
6. Wait for AI response
7. Listen to the spoken response

## Current Implementation (Mock)

The current implementation uses **mock responses** for demonstration:

- **Speech to Text**: Returns random mock transcripts
- **AI Response**: Returns random mock responses
- **Text to Speech**: Uses real `expo-speech`

## Making It Production-Ready

### Option 1: Use OpenAI APIs

1. Add your OpenAI API key to `.env`:
```bash
OPENAI_API_KEY=your_key_here
```

2. Update `voiceAssistantService.js`:

```javascript
// Uncomment the OpenAI Whisper API call
async speechToText(audioUri) {
  const formData = new FormData();
  formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'audio.m4a' });
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData
  });
  
  const data = await response.json();
  return data.text;
}

// Uncomment the OpenAI GPT API call
async generateResponse(userMessage) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful memory assistant for people with memory loss. Be empathetic, patient, and encouraging.' 
        },
        ...this.conversationHistory
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### Option 2: Use Google Speech-to-Text

Replace the `speechToText` function with Google's API.

## Benefits of This Approach

✅ **Works immediately** - No complex setup
✅ **No LiveKit required** - Independent of LiveKit
✅ **Simple recording** - Press to start, press to stop
✅ **Native speech** - Uses expo-speech for natural voice
✅ **Can upgrade** - Easy to add real OpenAI APIs later

## LiveKit vs. Simple Voice Assistant

| Feature | LiveKit | Simple Voice Assistant |
|---------|---------|------------------------|
| Real-time | ✅ Yes | ❌ No (request/response) |
| Setup | Complex | Simple |
| Dependencies | Many | Few |
| Works now | Requires build | Works immediately |
| Quality | Production-grade | Mock responses |

## Next Steps

1. Install `expo-speech`: `npm install expo-speech`
2. Install pods: `cd ios && pod install`
3. Build: `npx expo run:ios`
4. Test the new blue button
5. If you want real AI, add OpenAI API keys

## Files Modified

- ✅ Created: `remory/services/voiceAssistantService.js`
- ✅ Modified: `remory/components/PatientDashboard.js`
- ⚠️  Need to install: `expo-speech` package

## Summary

You now have **two voice assistant options**:
1. **LiveKit** (green button) - Real-time, production-grade
2. **Simple Voice** (blue button) - Quick, works immediately

The LiveKit code is untouched. The simple voice assistant is a new addition!
