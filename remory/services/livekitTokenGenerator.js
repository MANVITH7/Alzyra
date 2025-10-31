/**
 * DEVELOPMENT ONLY: Client-side token generation
 *
 * WARNING: This is for development/testing only!
 * In production, tokens MUST be generated server-side for security.
 *
 * This bypasses the token server for local testing.
 */

import { LIVEKIT_API_KEY as ENV_API_KEY, LIVEKIT_API_SECRET as ENV_API_SECRET, LIVEKIT_URL as ENV_URL } from '@env';

// Fallback to hardcoded values if @env doesn't load (temporary workaround)
const LIVEKIT_URL = ENV_URL || 'wss://alzyra-41njst7g.livekit.cloud';
const LIVEKIT_API_KEY = ENV_API_KEY || 'APIE5tdvLYC9W4U';
const LIVEKIT_API_SECRET = ENV_API_SECRET || 'fmCcgaHVAMZFJeJXvifGifeT1WQM308EXNDr3bcc2RWC';

// Simple JWT encoder (for development only)
function base64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function textEncode(str) {
  return new TextEncoder().encode(str);
}

async function sign(header, payload, secret) {
  const headerPayload = `${base64url(textEncode(JSON.stringify(header)))}.${base64url(textEncode(JSON.stringify(payload)))}`;

  const key = await crypto.subtle.importKey(
    'raw',
    textEncode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    textEncode(headerPayload)
  );

  return `${headerPayload}.${base64url(signature)}`;
}

/**
 * Generate a LiveKit access token client-side (DEVELOPMENT ONLY)
 */
export const generateTokenClientSide = async (roomName, participantName) => {
  try {
    console.log('=== CLIENT-SIDE TOKEN GENERATION (DEV MODE) ===');
    console.log('Room:', roomName);
    console.log('Participant:', participantName);

    // Debug: Log what we're getting from @env
    console.log('Environment variables loaded:');
    console.log('- LIVEKIT_URL:', LIVEKIT_URL ? `${LIVEKIT_URL.substring(0, 20)}...` : 'UNDEFINED');
    console.log('- LIVEKIT_API_KEY:', LIVEKIT_API_KEY ? `${LIVEKIT_API_KEY.substring(0, 6)}...` : 'UNDEFINED');
    console.log('- LIVEKIT_API_SECRET:', LIVEKIT_API_SECRET ? 'Configured' : 'UNDEFINED');

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
      console.error('❌ Missing credentials:');
      console.error('  LIVEKIT_URL:', !!LIVEKIT_URL);
      console.error('  LIVEKIT_API_KEY:', !!LIVEKIT_API_KEY);
      console.error('  LIVEKIT_API_SECRET:', !!LIVEKIT_API_SECRET);

      throw new Error(
        'LiveKit credentials not loaded from .env file. ' +
        'Please restart your Metro bundler with: npm start -- --clear'
      );
    }

    if (LIVEKIT_API_KEY === 'your-api-key-here' || LIVEKIT_URL === 'your-livekit-url-here') {
      throw new Error('Please configure real LiveKit credentials in .env file');
    }

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: LIVEKIT_API_KEY,
      sub: participantName,
      nbf: now,
      exp: now + 3600, // 1 hour
      video: {
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      },
    };

    console.log('Signing token with HMAC-SHA256...');
    const token = await sign(header, payload, LIVEKIT_API_SECRET);

    console.log('✅ Client-side token generated successfully');
    console.log('Token length:', token.length);

    return {
      token,
      url: LIVEKIT_URL,
    };
  } catch (error) {
    console.error('❌ Client-side token generation failed:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

export default generateTokenClientSide;
