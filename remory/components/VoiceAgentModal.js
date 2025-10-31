import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useLiveKit } from '../contexts/LiveKitContext';

export default function VoiceAgentModal({ visible, onClose, userName, memoryContext, livekitToken }) {
  const {
    connectToAgent,
    disconnect,
    isConnected,
    connectionState,
    toggleMicrophone,
    isAudioEnabled,
    agentMessages,
  } = useLiveKit();

  const [isConnecting, setIsConnecting] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [error, setError] = useState(null);
  const [hasAutoConnected, setHasAutoConnected] = useState(false);

  // Pulse animation for the microphone when speaking
  useEffect(() => {
    if (isConnected && isAudioEnabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isConnected, isAudioEnabled]);

  // Auto-connect when modal opens
  useEffect(() => {
    if (visible && !hasAutoConnected && !isConnected && !isConnecting && livekitToken) {
      setHasAutoConnected(true);
      handleConnect();
    }
    if (!visible) {
      setHasAutoConnected(false);
      if (isConnected) {
        handleDisconnect();
      }
    }
  }, [visible, hasAutoConnected, isConnected, isConnecting, livekitToken]);

  const handleConnect = async () => {
    if (!livekitToken) {
      setError('LiveKit token is required. Please configure your token service.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      console.log('Connecting to LiveKit agent...');

      // Prepare room options with metadata if provided
      const roomOptions = memoryContext ? {
        metadata: JSON.stringify({
          userName,
          memoryContext: {
            title: memoryContext.title,
            time: memoryContext.time,
            type: memoryContext.type,
          }
        })
      } : {};

      // Connect to LiveKit room with AI agent
      await connectToAgent(livekitToken, roomOptions);

      console.log('Successfully connected to voice agent');

    } catch (err) {
      console.error('Failed to connect to voice agent:', err);
      setError(err.message || 'Failed to connect to voice agent');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onClose();
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const handleToggleMic = async () => {
    try {
      await toggleMicrophone();
    } catch (err) {
      console.error('Failed to toggle microphone:', err);
      setError('Failed to toggle microphone');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Memory Companion</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Connection Status */}
          <View style={styles.statusSection}>
            {!isConnected ? (
              <>
                {memoryContext && (
                  <View style={styles.contextBadge}>
                    <Text style={styles.contextText}>
                      {memoryContext.type === 'recall'
                        ? `Recalling: ${memoryContext.title}`
                        : `Reconstructing: ${memoryContext.period}`}
                    </Text>
                  </View>
                )}
                <Text style={styles.statusText}>
                  {isConnecting
                    ? 'Connecting to your memory companion...'
                    : 'Ready to help you remember'}
                </Text>
                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
                {!livekitToken && (
                  <Text style={styles.warningText}>
                    Note: LiveKit token service needs to be configured
                  </Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.connectButton,
                    (isConnecting || !livekitToken) && styles.connectButtonDisabled,
                  ]}
                  onPress={handleConnect}
                  disabled={isConnecting || !livekitToken}
                >
                  {isConnecting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.connectButtonText}>
                      Start Voice Conversation
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.connectedText}>Connected</Text>
                <Text style={styles.statusSubtext}>
                  {isAudioEnabled
                    ? 'I\'m listening...'
                    : 'Microphone is off'}
                </Text>

                {/* Microphone Button */}
                <Animated.View
                  style={[
                    styles.micContainer,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.micButton,
                      isAudioEnabled
                        ? styles.micButtonActive
                        : styles.micButtonInactive,
                    ]}
                    onPress={handleToggleMic}
                  >
                    <Text style={styles.micIcon}>
                      {isAudioEnabled ? '🎤' : '🔇'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Recent Messages */}
                <View style={styles.messagesContainer}>
                  <Text style={styles.messagesTitle}>Recent Conversation</Text>
                  {agentMessages.length === 0 ? (
                    <Text style={styles.noMessagesText}>
                      Start speaking to begin the conversation
                    </Text>
                  ) : (
                    agentMessages.slice(-3).map((msg, index) => (
                      <View
                        key={`${msg.timestamp}-${index}`}
                        style={[
                          styles.messageCard,
                          msg.from === 'user'
                            ? styles.userMessage
                            : styles.agentMessage,
                        ]}
                      >
                        <Text style={styles.messageFrom}>
                          {msg.from === 'user' ? 'You' : 'Companion'}
                        </Text>
                        <Text style={styles.messageText}>{msg.message}</Text>
                      </View>
                    ))
                  )}
                </View>

                {/* Disconnect Button */}
                <TouchableOpacity
                  style={styles.disconnectButton}
                  onPress={handleDisconnect}
                >
                  <Text style={styles.disconnectButtonText}>
                    End Conversation
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              Your memory companion is here to help you recall and remember.
              Speak naturally and take your time.
            </Text>
            <Text style={styles.infoSubtext}>
              Powered by LiveKit Agents
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#5A7D9A',
    fontWeight: 'bold',
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#5A7D9A',
    marginBottom: 20,
    textAlign: 'center',
  },
  connectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  statusSubtext: {
    fontSize: 16,
    color: '#5A7D9A',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 12,
    color: '#FF9800',
    marginBottom: 12,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#5A7D9A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  micContainer: {
    marginBottom: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  micButtonActive: {
    backgroundColor: '#4CAF50',
  },
  micButtonInactive: {
    backgroundColor: '#9E9E9E',
  },
  micIcon: {
    fontSize: 40,
  },
  messagesContainer: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 20,
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  noMessagesText: {
    fontSize: 14,
    color: '#7B8FA1',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 12,
  },
  messageCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
  },
  agentMessage: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
  },
  messageFrom: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5A7D9A',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  disconnectButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disconnectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#5A7D9A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#7B8FA1',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contextBadge: {
    backgroundColor: '#E8F4FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  contextText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A7D9A',
    textAlign: 'center',
  },
});
