import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLiveKit } from '../contexts/LiveKitContext'; // DISABLED - Only using Vapi
// import * as LiveKitService from '../services/livekitService'; // DISABLED - Only using Vapi
import VoiceAssistantService from '../services/voiceAssistantService';

const { width } = Dimensions.get('window');

export default function PatientDashboard({ navigation, route }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 22, condition: 'sunny' });
  // Get patient name from route params or use default
  const [userName] = useState(route?.params?.patientName || 'Patient');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // LiveKit hooks - DISABLED - Only using Vapi
  const isConnected = false; // Always false - LiveKit disabled
  const agentMessages = [];
  const connectionState = 'disconnected';
  const agentState = 'initializing';
  const agentParticipant = null;
  const connectToAgent = () => {};
  const disconnect = () => {};
  const toggleMicrophone = () => {};
  const isAudioEnabled = false;

  // Vapi voice assistant state
  const [isVapiConnected, setIsVapiConnected] = useState(false);
  const [vapiCallId, setVapiCallId] = useState(null);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    return () => clearInterval(timer);
  }, []);

  const formatGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const memoryThreads = [
    {
      id: 1,
      title: 'Lunch with Sarah at Encanto Park',
      time: 'Yesterday, 2:00 PM',
      strength: 85,
      type: 'social',
      icon: '🍃'
    },
    {
      id: 2,
      title: 'Call with Nitant',
      time: 'Today, 9:00 AM',
      strength: 92,
      type: 'communication',
      icon: '📞'
    },
    {
      id: 3,
      title: 'Doctor appointment with Dr. Martinez',
      time: '2 days ago',
      strength: 78,
      type: 'medical',
      icon: '🏥'
    }
  ];

  const handleMemoryRecall = (memory) => {
    Alert.alert(
      'Memory Recall',
      `Let's help you remember: ${memory.title}`,
      [
        {
          text: 'Start AI Reconstruction',
          onPress: () => {
            // Navigate to AI reconstruction screen
            console.log('Starting AI reconstruction for:', memory.title);
            // In a real app, this would navigate to the AI reconstruction screen
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Vapi voice assistant handler
  const handleVapiVoiceAssistant = async () => {
    if (!isVapiConnected) {
      // Start Vapi call
      try {
        Alert.alert(
          'Starting AI Voice Assistant...',
          'Connecting to your AI assistant powered by Vapi.ai',
          [],
          { cancelable: false }
        );

        // Set up event handlers
        VoiceAssistantService.onCallStart = () => {
          setIsVapiConnected(true);
          setIsAssistantSpeaking(false);
          setIsUserSpeaking(false);
          Alert.alert(
            'Connected! 🎉',
            'Your AI assistant is now listening. Just speak naturally!',
            [{ text: 'OK' }]
          );
        };

        VoiceAssistantService.onCallEnd = () => {
          setIsVapiConnected(false);
          setVapiCallId(null);
          setIsAssistantSpeaking(false);
          setIsUserSpeaking(false);
        };

        VoiceAssistantService.onUserStartSpeaking = () => {
          setIsUserSpeaking(true);
        };

        VoiceAssistantService.onUserStopSpeaking = () => {
          setIsUserSpeaking(false);
        };

        VoiceAssistantService.onAssistantStartSpeaking = () => {
          setIsAssistantSpeaking(true);
        };

        VoiceAssistantService.onAssistantStopSpeaking = () => {
          setIsAssistantSpeaking(false);
        };

        VoiceAssistantService.onError = (error) => {
          Alert.alert('Error', 'Voice assistant error: ' + error.message);
        };

        // Start the call
        const result = await VoiceAssistantService.startVoiceConversation();
        setVapiCallId(result.callId);
        
      } catch (error) {
        Alert.alert('Error', 'Failed to start voice assistant: ' + error.message);
      }
    } else {
      // End call
      try {
        await VoiceAssistantService.stopVoiceConversation();
        setIsVapiConnected(false);
        setVapiCallId(null);
        Alert.alert('Disconnected', 'Voice assistant disconnected');
      } catch (error) {
        Alert.alert('Error', 'Failed to disconnect: ' + error.message);
      }
    }
  };

  const handleReconstructMemory = async () => {
    // LIVKIT DISABLED - Only using Vapi
    Alert.alert('LiveKit Disabled', 'LiveKit is currently disabled. Please use the Vapi Voice Assistant button instead.');
    return;
    
    /* DISABLED CODE
    // If already connected, show disconnect option
    if (isConnected) {
      Alert.alert(
        'Disconnect from AI Agent?',
        'You are currently connected to the AI agent. Would you like to disconnect?',
        [
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: async () => {
              try {
                await disconnect();
                Alert.alert('Disconnected', 'You have been disconnected from the AI agent.');
              } catch (error) {
                Alert.alert('Error', 'Failed to disconnect: ' + error.message);
              }
            }
          },
          { text: 'Stay Connected', style: 'cancel' }
        ]
      );
      return;
    }

    // If not connected, connect to the agent
    try {
      Alert.alert(
        'Connecting to AI Agent...',
        'Please wait while we connect you to your memory assistant.',
        [],
        { cancelable: false }
      );

      // Generate a unique room name for this patient session
      const roomName = `patient-${userName}-${Date.now()}`;
      
      // Generate token
      const token = await LiveKitService.generateToken(roomName, userName);
      console.log('Generated LiveKit token for room:', roomName);
      
      // Connect to agent
      await connectToAgent(token);
      
      // Wait a moment for connection to establish
      setTimeout(async () => {
        // Enable microphone automatically for voice interaction
        await toggleMicrophone();
        
        Alert.alert(
          'Connected! 🎉',
          'You are now connected to your AI memory assistant. You can speak to it naturally, and it will help you reconstruct your memories.',
          [
            {
              text: 'Start Talking',
              onPress: () => console.log('Ready to talk to agent'),
              style: 'default'
            }
          ]
        );
      }, 1000);
      
    } catch (error) {
      console.error('Error connecting to agent:', error);
      Alert.alert(
        'Connection Error',
        'We couldn\'t connect to the AI agent. Please make sure the agent is running and try again.\n\nError: ' + error.message
      );
    } */
  };

  const handleConfusion = () => {
    Alert.alert(
      'I\'m Here to Help 💙',
      'It\'s okay to feel confused. Let me help you remember where you are and what you\'re doing.',
      [
        {
          text: 'Help Me Remember',
          onPress: () => console.log('Providing comfort and guidance')
        },
        {
          text: 'Call My Caregiver',
          onPress: () => console.log('Calling caregiver')
        },
        { text: 'I\'m Okay', style: 'cancel' }
      ]
    );
  };

  const handleCallCaregiver = () => {
    Alert.alert(
      'Contacting Caregiver',
      'Would you like to call your caregiver or send them a message?',
      [
        { text: 'Call Now', onPress: () => console.log('Calling caregiver') },
        { text: 'Send Message', onPress: () => console.log('Sending message') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Navigate back to login
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleMenu = () => {
    Alert.alert(
      'Menu Options',
      'What would you like to do?',
      [
        { text: 'Settings', onPress: () => console.log('Opening settings') },
        { text: 'Help & Support', onPress: () => console.log('Opening help') },
        { text: 'About Remory', onPress: () => console.log('Opening about') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header with Menu and Logout */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerButton} onPress={handleMenu}>
          <Text style={styles.headerButtonText}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Text style={styles.headerButtonText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.appTitle}>Remory</Text>
          <Text style={styles.tagline}>Guiding light through memory loss</Text>
        </Animated.View>

        {/* Greeting Section */}
        <Animated.View 
          style={[
            styles.greetingSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.greeting}>
            {formatGreeting()}, {userName}
          </Text>
          <Text style={styles.dateTime}>
            {formatDate()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.weather}>
            {weather.temp}°C and {weather.condition} in Phoenix
          </Text>
        </Animated.View>

        {/* Memory Threads Section */}
        <Animated.View 
          style={[
            styles.memorySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Memory Threads</Text>
          {memoryThreads.map((memory, index) => (
            <Animated.View
              key={memory.id}
              style={[
                styles.memoryCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { 
                      translateY: Animated.add(
                        slideAnim,
                        new Animated.Value(index * 20)
                      )
                    }
                  ]
                }
              ]}
            >
              <View style={styles.memoryContent}>
                <View style={styles.memoryInfo}>
                  <Text style={styles.memoryTime}>{memory.time}</Text>
                  <Text style={styles.memoryTitle}>
                    {memory.title} {memory.icon}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.recallButton}
                  onPress={() => handleMemoryRecall(memory)}
                >
                  <Text style={styles.recallButtonText}>Recall</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* AI Reconstruction Section */}
        <Animated.View 
          style={[
            styles.reconstructionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.reconstructButton,
              isConnected && styles.reconstructButtonConnected
            ]}
            onPress={handleReconstructMemory}
          >
            <Text style={styles.reconstructButtonText}>
              {isConnected ? '✓ Connected to AI Agent' : 'Reconstruct a Memory'}
            </Text>
          </TouchableOpacity>
          
          {/* Vapi Voice Assistant Button */}
          <TouchableOpacity
            style={[
              styles.reconstructButton,
              styles.altVoiceButton,
              isVapiConnected && styles.reconstructButtonConnected
            ]}
            onPress={handleVapiVoiceAssistant}
          >
            <Text style={styles.reconstructButtonText}>
              {isVapiConnected 
                ? '⏸️ Disconnect AI Assistant' 
                : '🤖 AI Voice Assistant (Vapi)'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.reconstructPrompt}>
            {isConnected 
              ? `🎤 Your microphone is active. Agent is ${agentState}. Speak naturally to your AI assistant for help with memories.`
              : isVapiConnected
              ? isUserSpeaking
                ? '🎤 You are speaking...'
                : isAssistantSpeaking
                ? '🎤 AI Assistant is speaking...'
                : '🎤 Connected to AI Assistant! Speak naturally and I will help you remember.'
              : 'Would you like me to help you remember what you did yesterday afternoon?'
            }
          </Text>
          
          {/* Agent Status Display */}
          {isConnected && (
            <View style={styles.agentStatusContainer}>
              <View style={styles.agentStatusRow}>
                <View style={[
                  styles.agentStatusDot,
                  { backgroundColor: agentParticipant ? '#2ECC71' : '#95A5A6' }
                ]} />
                <Text style={styles.agentStatusText}>
                  {agentParticipant ? 'AI Assistant Active' : 'Waiting for AI Assistant...'}
                </Text>
              </View>
              {agentParticipant && (
                <Text style={styles.agentStateText}>
                  Status: {agentState}
                </Text>
              )}
            </View>
          )}
          
          {/* Agent Messages */}
          {isConnected && agentMessages.length > 0 && (
            <View style={styles.agentMessagesContainer}>
              <Text style={styles.agentMessagesTitle}>Conversation:</Text>
              {agentMessages.slice(-3).map((msg, index) => (
                <View key={index} style={styles.agentMessage}>
                  <Text style={styles.agentMessageFrom}>{msg.from}:</Text>
                  <Text style={styles.agentMessageText}>{msg.message}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Emergency Actions */}
        <Animated.View 
          style={[
            styles.emergencySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.emergencyButtons}>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={handleConfusion}
            >
              <Text style={styles.emergencyIcon}>❤️</Text>
              <Text style={styles.emergencyText}>I'm feeling confused</Text>
            </TouchableOpacity>
            
            <View style={styles.emergencyDivider} />
            
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={handleCallCaregiver}
            >
              <Text style={styles.emergencyIcon}>📞</Text>
              <Text style={styles.emergencyText}>Call Caregiver</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Soft blue background
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F0F8FF',
  },
  headerButton: {
    backgroundColor: '#5A7D9A',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#5A7D9A',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  greetingSection: {
    backgroundColor: '#E8F4FD',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 16,
    color: '#5A7D9A',
    marginBottom: 4,
  },
  weather: {
    fontSize: 14,
    color: '#7B8FA1',
  },
  memorySection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  memoryCard: {
    backgroundColor: '#E8F7F0', // Light green-blue
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoryInfo: {
    flex: 1,
    marginRight: 12,
  },
  memoryTime: {
    fontSize: 14,
    color: '#5A7D9A',
    marginBottom: 4,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 22,
  },
  recallButton: {
    backgroundColor: '#A8E6CF', // Light green
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recallButtonText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '600',
  },
  reconstructionSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  reconstructButton: {
    backgroundColor: '#5A7D9A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  reconstructButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reconstructButtonConnected: {
    backgroundColor: '#2ECC71', // Green color when connected
  },
  altVoiceButton: {
    backgroundColor: '#3498DB', // Blue color for alternative voice assistant
    marginTop: 12,
  },
  reconstructPrompt: {
    fontSize: 16,
    color: '#5A7D9A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  agentMessagesContainer: {
    backgroundColor: '#E8F8F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    maxHeight: 200,
  },
  agentMessagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  agentMessage: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D5DBDB',
  },
  agentMessageFrom: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A7D9A',
    marginBottom: 4,
  },
  agentMessageText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  emergencySection: {
    marginBottom: 20,
  },
  emergencyButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  emergencyIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
    textAlign: 'center',
  },
  emergencyDivider: {
    width: 1,
    backgroundColor: '#E8F4FD',
    marginHorizontal: 16,
  },
  agentStatusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  agentStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  agentStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  agentStateText: {
    fontSize: 14,
    color: '#5A7D9A',
    marginTop: 4,
  },
});
