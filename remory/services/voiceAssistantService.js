// Vapi.ai Voice Assistant Service for React Native
// Real-time voice AI conversations powered by Vapi

import { VapiClient } from '@vapi-ai/react-native';

class VapiVoiceAssistantService {
  constructor() {
    this.vapiClient = null;
    this.isConnected = false;
    this.callId = null;
    this.conversationHistory = [];
  }

  /**
   * Initialize Vapi connection
   */
  async initialize() {
    try {
      console.log('Initializing Vapi.ai...');
      
      const apiKey = process.env.VAPI_API_KEY || 'your-vapi-api-key';
      
      // Initialize Vapi client
      this.vapiClient = new VapiClient({
        apiKey,
      });

      console.log('Vapi initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
      throw error;
    }
  }

  /**
   * Start a voice call with the AI assistant
   */
  async startCall(assistantId = null) {
    try {
      if (!this.vapiClient) {
        await this.initialize();
      }

      console.log('Starting Vapi call...');
      
      const id = assistantId || process.env.VAPI_ASSISTANT_ID || 'your-assistant-id';
      
      // Start the call
      const call = await this.vapiClient.startCall({
        assistantId: id,
        onCallStart: () => {
          console.log('Call started');
          this.isConnected = true;
          this.onCallStart();
        },
        onCallEnd: () => {
          console.log('Call ended');
          this.isConnected = false;
          this.onCallEnd();
        },
        onUserSpeechStart: () => {
          console.log('User started speaking');
          this.onUserStartSpeaking();
        },
        onUserSpeechEnd: () => {
          console.log('User stopped speaking');
          this.onUserStopSpeaking();
        },
        onAssistantSpeechStart: () => {
          console.log('Assistant started speaking');
          this.onAssistantStartSpeaking();
        },
        onAssistantSpeechEnd: () => {
          console.log('Assistant stopped speaking');
          this.onAssistantStopSpeaking();
        },
        onMessage: (message) => {
          console.log('Message received:', message);
          this.conversationHistory.push(message);
          this.onMessage(message);
        },
        onError: (error) => {
          console.error('Vapi error:', error);
          this.onError(error);
        }
      });

      this.callId = call.callId;
      console.log('Call started with ID:', this.callId);
      
      return {
        callId: this.callId,
        isConnected: true
      };
    } catch (error) {
      console.error('Failed to start call:', error);
      throw error;
    }
  }

  /**
   * End the current call
   */
  async endCall() {
    try {
      if (this.vapiClient && this.isConnected) {
        console.log('Ending Vapi call...');
        await this.vapiClient.endCall();
        this.isConnected = false;
        this.callId = null;
        console.log('Call ended');
      }
    } catch (error) {
      console.error('Failed to end call:', error);
      throw error;
    }
  }

  /**
   * Toggle mute/unmute
   */
  async toggleMute() {
    try {
      if (this.vapiClient && this.isConnected) {
        await this.vapiClient.toggleMute();
      }
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  }

  // Event handlers (can be overridden)
  onCallStart() {}
  onCallEnd() {}
  onUserStartSpeaking() {}
  onUserStopSpeaking() {}
  onAssistantStartSpeaking() {}
  onAssistantStopSpeaking() {}
  onMessage(message) {}
  onError(error) {}

  /**
   * Simple start call wrapper for Patient Dashboard
   */
  async startVoiceConversation() {
    try {
      console.log('Starting voice conversation with Vapi...');
      const result = await this.startCall();
      
      return {
        isConnected: true,
        callId: result.callId
      };
    } catch (error) {
      console.error('Voice conversation failed:', error);
      throw error;
    }
  }

  /**
   * Stop the conversation
   */
  async stopVoiceConversation() {
    try {
      await this.endCall();
      this.conversationHistory = [];
      return true;
    } catch (error) {
      console.error('Failed to stop conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}

export default new VapiVoiceAssistantService();
