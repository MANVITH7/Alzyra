# How to Find Your Vapi Assistant ID 🆔

## Step-by-Step Guide

### 1. Go to Vapi Dashboard
Visit: [https://dashboard.vapi.ai](https://dashboard.vapi.ai)

### 2. Sign In
Login with your Vapi account (the one where you have API key `4a205042-5af2-47ac-b785-b79edef19bb8`)

### 3. Navigate to Assistants

You can find Assistants in two ways:

#### Option A: From the Sidebar
- Look for **"Assistants"** in the left sidebar
- Click on it

#### Option B: From the Top Menu
- You might see an "Assistants" tab in the main navigation
- Click on it

### 4. Find Your Assistant

You'll see a list of your assistants. Look for:
- **Assistant Name** (e.g., "My Memory Assistant")
- **Assistant ID** (this is what you need!)

### 5. Copy the Assistant ID

The Assistant ID will look something like:
- `abc12345-6789-0123-4567-890abcdef123`
- Or it might be displayed differently in the dashboard

**Common locations for the ID:**
- Click on an assistant card to view details
- Look in the assistant settings
- Check the URL when viewing an assistant (might be in the path)
- Sometimes shown as "ID" or "Assistant ID" field

### 6. If You Don't Have an Assistant Yet

If you don't see any assistants:

1. **Click "Create Assistant"** or **"+ New Assistant"** button
2. **Configure your assistant:**
   - Name: "Memory Assistant"
   - Model: Choose GPT-4 or GPT-3.5-turbo
   - System Prompt: 
     ```
     You are a helpful memory assistant for people experiencing memory loss. 
     You are empathetic, patient, and encouraging. You help users recall their 
     memories by asking gentle questions. Never mention memory problems directly.
     Always be positive and supportive.
     ```
   - Voice: Choose from the available voices
3. **Save the assistant**
4. **The Assistant ID will be displayed** after creation

## What the Assistant ID Looks Like

The Assistant ID is typically:
- A UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Or a shorter alphanumeric string

## After You Have the ID

Once you have the Assistant ID, either:
1. Update the `.env` file yourself
2. Send me the ID and I'll update it for you

The `.env` file is located at: `remory/.env`

## Quick Check

To see your current `.env` file:
```bash
cd /Users/manvithreddy/Downloads/Alzyra/remory
cat .env
```

You'll see:
```bash
VAPI_ASSISTANT_ID=your-assistant-id-here
```

Just replace `your-assistant-id-here` with the actual ID you get from the dashboard!

## Need Help?

If you can't find the Assistant ID:
1. Make sure you're logged into the correct Vapi account
2. Create a new assistant if you don't have one
3. Look for any ID or "Copy ID" button in the assistant settings

Let me know when you have the ID! 🚀
