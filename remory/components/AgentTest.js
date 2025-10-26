import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLiveKit } from '../contexts/LiveKitContext';
import * as LiveKitService from '../services/livekitService';

export default function AgentTest() {
  const { isConnected, agentMessages, connectionState, connectToAgent: connectToAgentHook, disconnect: disconnectHook } = useLiveKit();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Generate a token for a test room
      const roomName = `test-room-${Date.now()}`;
      const participantName = 'Test User';
      
      const token = await LiveKitService.generateToken(roomName, participantName);
      console.log('Generated token successfully');
      
      // Connect to the room using the LiveKit context
      await connectToAgentHook(token);
      
      Alert.alert('Success', 'Connected to AI agent!');
    } catch (error) {
      console.error('Error connecting to agent:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectHook();
      Alert.alert('Disconnected', 'Disconnected from AI agent');
    } catch (error) {
      console.error('Error disconnecting:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LiveKit AI Agent Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusText, isConnected && styles.statusConnected]}>
          {connectionState}
        </Text>
      </View>

      {!isConnected ? (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Connect to Agent</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleDisconnect}>
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      )}

      {agentMessages.length > 0 && (
        <View style={styles.messagesContainer}>
          <Text style={styles.messagesTitle}>Messages:</Text>
          {agentMessages.map((msg, index) => (
            <Text key={index} style={styles.message}>
              {msg.from}: {msg.message}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  statusConnected: {
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#5A7D9A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagesContainer: {
    marginTop: 20,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
});
