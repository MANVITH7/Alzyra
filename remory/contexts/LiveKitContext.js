import React, { createContext, useState, useContext, useCallback } from 'react';
import * as LiveKitService from '../services/livekitService';

const LiveKitContext = createContext({});

export const useLiveKit = () => {
  const context = useContext(LiveKitContext);
  if (!context) {
    throw new Error('useLiveKit must be used within a LiveKitProvider');
  }
  return context;
};

export const LiveKitProvider = ({ children }) => {
  const [room, setRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [agentMessages, setAgentMessages] = useState([]);

  /**
   * Connect to a LiveKit room with an AI agent
   */
  const connectToAgent = useCallback(async (token, roomOptions = {}) => {
    try {
      console.log('=== CONNECTING TO AI AGENT ===');
      setConnectionState('connecting');

      const connectedRoom = await LiveKitService.connectToRoom(token, roomOptions);

      // Set up custom event handlers for the React context
      connectedRoom.on('ParticipantConnected', (participant) => {
        console.log('Agent participant connected:', participant.identity);
        setParticipants(prev => [...prev, participant]);
      });

      connectedRoom.on('ParticipantDisconnected', (participant) => {
        console.log('Agent participant disconnected:', participant.identity);
        setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      });

      connectedRoom.on('DataReceived', (payload, participant) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);

        console.log('Agent message received:', message);
        setAgentMessages(prev => [...prev, {
          from: participant?.identity || 'agent',
          message: message,
          timestamp: new Date().toISOString(),
        }]);
      });

      connectedRoom.on('ConnectionStateChanged', (state) => {
        console.log('Connection state:', state);
        setConnectionState(state);
        setIsConnected(state === 'connected');
      });

      connectedRoom.on('Disconnected', () => {
        console.log('Disconnected from agent');
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
        setConnectionState('disconnected');
      });

      setRoom(connectedRoom);
      setIsConnected(true);
      setConnectionState('connected');

      console.log('Successfully connected to AI agent room');
      return connectedRoom;
    } catch (error) {
      console.error('Failed to connect to agent:', error);
      setConnectionState('disconnected');
      throw error;
    }
  }, []);

  /**
   * Disconnect from the current room
   */
  const disconnect = useCallback(async () => {
    try {
      await LiveKitService.disconnectFromRoom();
      setRoom(null);
      setIsConnected(false);
      setParticipants([]);
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
      setConnectionState('disconnected');
      setAgentMessages([]);
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error;
    }
  }, []);

  /**
   * Toggle microphone on/off
   */
  const toggleMicrophone = useCallback(async () => {
    try {
      const newState = !isAudioEnabled;
      await LiveKitService.toggleMicrophone(newState);
      setIsAudioEnabled(newState);
      return newState;
    } catch (error) {
      console.error('Error toggling microphone:', error);
      throw error;
    }
  }, [isAudioEnabled]);

  /**
   * Toggle camera on/off
   */
  const toggleCamera = useCallback(async () => {
    try {
      const newState = !isVideoEnabled;
      await LiveKitService.toggleCamera(newState);
      setIsVideoEnabled(newState);
      return newState;
    } catch (error) {
      console.error('Error toggling camera:', error);
      throw error;
    }
  }, [isVideoEnabled]);

  /**
   * Send a message to the AI agent
   */
  const sendMessageToAgent = useCallback(async (message) => {
    try {
      await LiveKitService.sendDataMessage(message);

      // Add to local messages for UI
      setAgentMessages(prev => [...prev, {
        from: 'user',
        message: message,
        timestamp: new Date().toISOString(),
      }]);

      console.log('Message sent to agent:', message);
    } catch (error) {
      console.error('Error sending message to agent:', error);
      throw error;
    }
  }, []);

  /**
   * Clear agent message history
   */
  const clearMessages = useCallback(() => {
    setAgentMessages([]);
  }, []);

  const value = {
    // State
    room,
    isConnected,
    participants,
    isAudioEnabled,
    isVideoEnabled,
    connectionState,
    agentMessages,

    // Methods
    connectToAgent,
    disconnect,
    toggleMicrophone,
    toggleCamera,
    sendMessageToAgent,
    clearMessages,
  };

  return <LiveKitContext.Provider value={value}>{children}</LiveKitContext.Provider>;
};

export default LiveKitContext;
