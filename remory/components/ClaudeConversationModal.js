import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ClaudeService from '../services/claudeService';

export default function ClaudeConversationModal({ visible, onClose, memoryContext, userName }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const scrollViewRef = useRef();

  // Start conversation when modal opens
  useEffect(() => {
    if (visible && messages.length === 0) {
      startConversation();
    }
  }, [visible]);

  const startConversation = async () => {
    try {
      setIsLoading(true);
      let response;

      if (memoryContext?.type === 'emergency') {
        // Confusion support
        response = await ClaudeService.startConfusionSupport();
      } else {
        // Memory recall
        response = await ClaudeService.startMemoryConversation(memoryContext);
      }

      // Add Claude's initial message
      const claudeMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages([claudeMessage]);
      setConversationHistory([claudeMessage]);

    } catch (error) {
      console.error('Failed to start conversation:', error);
      const errorMessage = {
        role: 'assistant',
        content: '😔 I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Send to Claude API
      const response = await ClaudeService.continueConversation(
        conversationHistory,
        userMessage.content
      );

      const claudeMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      // Update conversation history (for API)
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage.content },
        claudeMessage
      ]);

      // Add Claude's response to UI
      setMessages(prev => [...prev, claudeMessage]);

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        role: 'assistant',
        content: '😔 I had trouble understanding that. Could you try saying it differently?',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessages([]);
    setUserInput('');
    setConversationHistory([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Memory Companion</Text>
            {memoryContext && (
              <Text style={styles.headerSubtitle}>
                {memoryContext.type === 'emergency'
                  ? 'I\'m here to help you feel oriented'
                  : `Discussing: ${memoryContext.title}`
                }
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userText : styles.assistantText
                ]}
              >
                {message.content}
              </Text>
              <Text style={styles.messageTime}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <ActivityIndicator size="small" color="#5A7D9A" />
              <Text style={styles.loadingText}>Claude is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type your response here..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={!isLoading}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!userInput.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!userInput.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            💙 Take your time. I'm here to help you remember.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#5A7D9A',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F4FD',
    marginTop: 4,
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#5A7D9A',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#2C3E50',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingText: {
    fontSize: 14,
    color: '#5A7D9A',
    marginTop: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
    color: '#2C3E50',
  },
  sendButton: {
    backgroundColor: '#5A7D9A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helperContainer: {
    padding: 12,
    backgroundColor: '#E8F4FD',
  },
  helperText: {
    fontSize: 14,
    color: '#5A7D9A',
    textAlign: 'center',
  },
});
