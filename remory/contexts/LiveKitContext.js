import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
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
  const [agentParticipant, setAgentParticipant] = useState(null);
  const [agentState, setAgentState] = useState('initializing');
  const [agentAudioTrack, setAgentAudioTrack] = useState(null);

  /**
   * Connect to a LiveKit room with an AI agent
   */
  const connectToAgent = useCallback(async (token, roomOptions = {}) => {
    try {
      console.log('=== CONNECTING TO AI AGENT ===');
      setConnectionState('connecting');

      const connectedRoom = await LiveKitService.connectToRoom(token, roomOptions);

      // Enable local microphone audio track by default for voice interaction
      try {
        await connectedRoom.localParticipant.setMicrophoneEnabled(true);
        console.log('Microphone enabled for voice interaction');
        setIsAudioEnabled(true);
      } catch (audioError) {
        console.warn('Could not enable microphone:', audioError);
      }

      // Set up custom event handlers for the React context
      connectedRoom.on('ParticipantConnected', (participant) => {
        console.log('Participant connected:', participant.identity, 'kind:', participant.kind);
        
        // Check if this is the agent participant
        if (participant.kind === 'agent' || participant.identity.includes('agent')) {
          console.log('Agent participant detected:', participant.identity);
          setAgentParticipant(participant);
          
          // Try to get agent state from participant attributes
          const agentStateAttr = participant.attributes?.get('lk.agent.state');
          if (agentStateAttr) {
            setAgentState(agentStateAttr);
          }
        }
        
        setParticipants(prev => [...prev, participant]);
      });

      connectedRoom.on('ParticipantDisconnected', (participant) => {
        console.log('Participant disconnected:', participant.identity);
        
        if (participant === agentParticipant) {
          setAgentParticipant(null);
          setAgentState('initializing');
          setAgentAudioTrack(null);
        }
        
        setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      });

      connectedRoom.on('TrackSubscribed', (track, publication, participant) => {
        console.log('Track subscribed:', {
          participant: participant.identity,
          kind: participant.kind,
          trackType: track.kind,
          trackSid: track.sid,
        });
        
        // Store the agent's audio track for visualization
        if (participant.kind === 'agent' && track.kind === 'audio') {
          console.log('Agent audio track ready for voice interaction');
          setAgentAudioTrack(track);
        }
      });

      connectedRoom.on('TrackUnsubscribed', (track, publication, participant) => {
        console.log('Track unsubscribed:', participant.identity, track.kind);
        
        if (participant === agentParticipant && track.kind === 'audio') {
          setAgentAudioTrack(null);
        }
      });

      connectedRoom.on('DataReceived', (payload, participant) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);

        console.log('Data received from agent:', message);
        setAgentMessages(prev => [...prev, {
          from: participant?.identity || 'agent',
          message: message,
          timestamp: new Date().toISOString(),
        }]);
      });

      connectedRoom.on('ConnectionStateChanged', (state) => {
        console.log('Connection state changed:', state);
        setConnectionState(state);
        setIsConnected(state === 'connected');
      });

      connectedRoom.on('ParticipantMetadataChanged', (participant, metadata, kind, prevMetadata) => {
        console.log('Participant metadata changed:', participant.identity, metadata);
        
        // Check for agent state updates
        if (participant === agentParticipant && kind === 'agent') {
          try {
            const metadataObj = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
            if (metadataObj.state) {
              setAgentState(metadataObj.state);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      });

      connectedRoom.on('Disconnected', (reason) => {
        console.log('Disconnected from agent room:', reason);
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
        setIsAudioEnabled(false);
        setIsVideoEnabled(false);
        setConnectionState('disconnected');
        setAgentMessages([]);
        setAgentParticipant(null);
        setAgentState('initializing');
        setAgentAudioTrack(null);
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
  }, [agentParticipant]);

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
      setAgentParticipant(null);
      setAgentState('initializing');
      setAgentAudioTrack(null);
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
    agentParticipant,
    agentState,
    agentAudioTrack,

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
