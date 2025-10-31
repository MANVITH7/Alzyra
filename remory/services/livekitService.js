import { Room, RoomEvent, Track, VideoPresets } from 'livekit-client';
import { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } from '@env';

// Log configuration
console.log('=== LIVEKIT SERVICE CONFIGURATION ===');
console.log('LiveKit URL:', LIVEKIT_URL);
console.log('API Key:', LIVEKIT_API_KEY ? 'Configured' : 'Not configured');

/**
 * LiveKit Room instance
 * This will be initialized when connecting to a room
 */
let currentRoom = null;

/**
 * Generate a LiveKit access token for a participant
 * Note: In production, this should be done on your backend server for security
 * This is a simplified version for development
 */
export const generateToken = async (roomName, participantName) => {
  try {
    // In a real app, you would call your backend API here to generate the token
    // For now, we'll need to implement this on the backend
    // Example:
    // const response = await fetch('YOUR_BACKEND_URL/api/livekit/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ roomName, participantName })
    // });
    // const { token } = await response.json();
    // return token;

    console.warn('Token generation should be implemented on backend for security');
    throw new Error('Token generation not implemented - requires backend endpoint');
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

/**
 * Connect to a LiveKit room
 */
export const connectToRoom = async (token, roomOptions = {}) => {
  try {
    console.log('=== CONNECTING TO LIVEKIT ROOM ===');

    // Create a new room instance
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
      ...roomOptions,
    });

    // Set up event listeners
    setupRoomListeners(room);

    // Connect to the room
    await room.connect(LIVEKIT_URL, token);

    console.log('Successfully connected to room:', room.name);
    console.log('Local participant:', room.localParticipant.identity);

    currentRoom = room;
    return room;
  } catch (error) {
    console.error('=== LIVEKIT CONNECTION ERROR ===');
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Set up event listeners for the room
 */
const setupRoomListeners = (room) => {
  // Participant connected
  room.on(RoomEvent.ParticipantConnected, (participant) => {
    console.log('Participant connected:', participant.identity);
  });

  // Participant disconnected
  room.on(RoomEvent.ParticipantDisconnected, (participant) => {
    console.log('Participant disconnected:', participant.identity);
  });

  // Track subscribed (audio/video from remote participant)
  room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    console.log('Track subscribed:', {
      participant: participant.identity,
      trackType: track.kind,
      trackSid: track.sid,
    });
  });

  // Track unsubscribed
  room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
    console.log('Track unsubscribed:', {
      participant: participant.identity,
      trackType: track.kind,
    });
  });

  // Data received (for AI agent messages)
  room.on(RoomEvent.DataReceived, (payload, participant) => {
    const decoder = new TextDecoder();
    const message = decoder.decode(payload);
    console.log('Data received from', participant?.identity || 'server', ':', message);
  });

  // Connection state changed
  room.on(RoomEvent.ConnectionStateChanged, (state) => {
    console.log('Connection state changed:', state);
  });

  // Disconnected
  room.on(RoomEvent.Disconnected, (reason) => {
    console.log('Disconnected from room:', reason);
    currentRoom = null;
  });
};

/**
 * Disconnect from the current room
 */
export const disconnectFromRoom = async () => {
  try {
    if (currentRoom) {
      console.log('Disconnecting from room...');
      await currentRoom.disconnect();
      currentRoom = null;
      console.log('Disconnected successfully');
    }
  } catch (error) {
    console.error('Error disconnecting from room:', error);
    throw error;
  }
};

/**
 * Enable/disable local microphone
 */
export const toggleMicrophone = async (enabled) => {
  try {
    if (!currentRoom) {
      throw new Error('Not connected to a room');
    }

    await currentRoom.localParticipant.setMicrophoneEnabled(enabled);
    console.log('Microphone', enabled ? 'enabled' : 'disabled');
    return enabled;
  } catch (error) {
    console.error('Error toggling microphone:', error);
    throw error;
  }
};

/**
 * Enable/disable local camera
 */
export const toggleCamera = async (enabled) => {
  try {
    if (!currentRoom) {
      throw new Error('Not connected to a room');
    }

    await currentRoom.localParticipant.setCameraEnabled(enabled);
    console.log('Camera', enabled ? 'enabled' : 'disabled');
    return enabled;
  } catch (error) {
    console.error('Error toggling camera:', error);
    throw error;
  }
};

/**
 * Send data message to the room (e.g., to the AI agent)
 */
export const sendDataMessage = async (message, destination = null) => {
  try {
    if (!currentRoom) {
      throw new Error('Not connected to a room');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    await currentRoom.localParticipant.publishData(data, {
      reliable: true,
      destination: destination ? [destination] : undefined,
    });

    console.log('Data message sent:', message);
  } catch (error) {
    console.error('Error sending data message:', error);
    throw error;
  }
};

/**
 * Get current room instance
 */
export const getCurrentRoom = () => {
  return currentRoom;
};

/**
 * Check if currently connected to a room
 */
export const isConnected = () => {
  return currentRoom !== null && currentRoom.state === 'connected';
};

export default {
  generateToken,
  connectToRoom,
  disconnectFromRoom,
  toggleMicrophone,
  toggleCamera,
  sendDataMessage,
  getCurrentRoom,
  isConnected,
};
