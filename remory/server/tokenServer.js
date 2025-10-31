const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());

const PORT = process.env.TOKEN_SERVER_PORT || 3001;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Generate LiveKit access token for a participant
 * POST /api/livekit/token
 * Body: { roomName: string, participantName: string, participantMetadata?: string }
 */
app.post('/api/livekit/token', async (req, res) => {
  try {
    const { roomName, participantName, participantMetadata } = req.body;

    // Validate required fields
    if (!roomName || !participantName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['roomName', 'participantName'],
      });
    }

    // Check if LiveKit credentials are configured
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('LiveKit credentials not configured');
      return res.status(500).json({
        error: 'Server configuration error: LiveKit credentials missing',
      });
    }

    // Create access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      metadata: participantMetadata || '',
    });

    // Grant permissions
    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Generate JWT
    const jwt = await token.toJwt();

    console.log(`Generated token for ${participantName} in room ${roomName}`);

    res.json({
      token: jwt,
      url: process.env.LIVEKIT_URL,
      roomName,
      participantName,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      error: 'Failed to generate token',
      message: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    livekitConfigured: !!(process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET),
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=== LiveKit Token Server ===');
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Token endpoint: http://localhost:${PORT}/api/livekit/token`);
  console.log();

  // Configuration check
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    console.warn('⚠️  WARNING: LiveKit credentials not configured!');
    console.warn('Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in your .env file');
  } else {
    console.log('✅ LiveKit credentials configured');
  }

  if (!process.env.LIVEKIT_URL) {
    console.warn('⚠️  WARNING: LIVEKIT_URL not configured!');
  } else {
    console.log(`✅ LiveKit URL: ${process.env.LIVEKIT_URL}`);
  }
  console.log();
});

module.exports = app;
