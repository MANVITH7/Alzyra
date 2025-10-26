# Production Deployment Guide

## ⚠️ Important Security Notice

**The current implementation generates tokens on the client side using the API secret. This is ONLY for development/testing. Do NOT use in production.**

## Current Issue

Your `.env` file contains:
```env
LIVEKIT_URL=wss://alzyra-ag7zclvm.livekit.cloud
LIVEKIT_API_KEY=APIKq5wCZNrj2ZB
LIVEKIT_API_SECRET=cCIbaC81SJXm1mmCj9oyUeKA31jkmOgwtfTniQRPCuA
```

When you build the app for production:
- The API secret gets bundled into the app
- Anyone can extract it and generate unlimited tokens
- This is a major security risk

## Solution: Backend Token Generation

You need to create a backend API endpoint that generates tokens securely.

### Option 1: Simple Backend Endpoint (Recommended)

Create a backend endpoint (Node.js/Python/etc.):

```javascript
// Example: Express.js backend
app.post('/api/livekit/token', async (req, res) => {
  const { roomName, participantName } = req.body;
  
  // Generate token using LiveKit SDK
  const token = generateAccessToken(roomName, participantName);
  
  res.json({ token });
});
```

### Option 2: Update Your React Native App

Update `generateToken` in `remory/services/livekitService.js`:

```javascript
export const generateToken = async (roomName, participantName) => {
  try {
    // Call your backend API
    const response = await fetch('YOUR_BACKEND_URL/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, participantName })
    });
    
    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};
```

### Option 3: Environment-based Approach

For quick deployment, you can use environment variables:

```javascript
const TOKEN_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-backend.com/api/livekit/token'
  : 'http://localhost:3000/api/livekit/token';

export const generateToken = async (roomName, participantName) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomName, participantName })
  });
  
  const { token } = await response.json();
  return token;
};
```

## Current Status

✅ **Safe for Development**: Current implementation is fine for local testing
❌ **NOT Safe for Production**: Do not deploy as-is

## Quick Steps for Deployment

1. **Create a backend server** with token generation endpoint
2. **Store API secret** only on the backend (never in client)
3. **Update `generateToken` function** to call your backend
4. **Remove API secret** from `.env` file for production builds
5. **Add your backend URL** to `.env` as `BACKEND_URL`

## Environment Variables for Production

Your `.env` should look like this for production:

```env
# LiveKit Configuration (Public - OK to expose)
LIVEKIT_URL=wss://alzyra-ag7zclvm.livekit.cloud

# Backend URL (Your server that generates tokens)
BACKEND_URL=https://your-backend.com

# DO NOT include API_SECRET in production builds
```

## Sandbox/Development vs Production

- **Development**: Current implementation with client-side token generation is OK
- **Production**: MUST use backend token generation for security

## Need Help?

If you need to set up a backend:
1. Use LiveKit's official examples: https://docs.livekit.io/agents/
2. Deploy a simple Node.js server to generate tokens
3. Use serverless functions (AWS Lambda, Vercel, etc.)

The most important thing: **Never expose your API secret in production builds.**
