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

const { width } = Dimensions.get('window');

export default function PatientDashboard({ navigation, route }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 22, condition: 'sunny' });
  // Get patient name from route params or use default
  const [userName] = useState(route?.params?.patientName || 'Patient');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  const handleReconstructMemory = () => {
    Alert.alert(
      'AI Memory Reconstruction',
      'I\'ll help you reconstruct a memory. What would you like to remember?',
      [
        {
          text: 'Yesterday Afternoon',
          onPress: () => console.log('Reconstructing yesterday afternoon')
        },
        {
          text: 'Last Week',
          onPress: () => console.log('Reconstructing last week')
        },
        {
          text: 'Choose Specific Memory',
          onPress: () => console.log('Choosing specific memory')
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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
        { text: 'About Alzyra', onPress: () => console.log('Opening about') },
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
            {formatDate()}
          </Text>
          <View style={styles.memoryReviewBanner}>
            <Text style={styles.memoryReviewText}>⏰ Time for your afternoon memory review</Text>
          </View>
        </Animated.View>

        {/* Familiar Faces Section */}
        <Animated.View 
          style={[
            styles.familiarFacesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.familiarFacesHeader}>
            <Text style={styles.sectionTitle}>Familiar Faces</Text>
            <View style={styles.carouselButtons}>
              <TouchableOpacity style={styles.carouselButton}>
                <Text style={styles.carouselButtonText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.carouselButton}>
                <Text style={styles.carouselButtonText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.familiarFacesScroll}>
            <View style={styles.familiarFaceCard}>
              <Text style={styles.faceEmoji}>👦</Text>
              <Text style={styles.faceName}>Akshin</Text>
              <Text style={styles.faceRelationship}>Grandson</Text>
            </View>
            <View style={styles.familiarFaceCard}>
              <Text style={styles.faceEmoji}>👩</Text>
              <Text style={styles.faceName}>Sarah</Text>
              <Text style={styles.faceRelationship}>Friend</Text>
            </View>
            <View style={styles.familiarFaceCard}>
              <Text style={styles.faceEmoji}>👨‍⚕️</Text>
              <Text style={styles.faceName}>Dr. Martinez</Text>
              <Text style={styles.faceRelationship}>Doctor</Text>
            </View>
          </ScrollView>
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
            style={styles.reconstructButton}
            onPress={handleReconstructMemory}
          >
            <Text style={styles.reconstructButtonText}>Reconstruct a Memory</Text>
          </TouchableOpacity>
          <Text style={styles.reconstructPrompt}>
            Would you like me to help you remember what you did yesterday afternoon?
          </Text>
        </Animated.View>

        {/* Emergency Contact Section */}
        <Animated.View 
          style={[
            styles.emergencySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.emergencyContactCard}>
            <Text style={styles.emergencyContactTitle}>Emergency Contact</Text>
            <Text style={styles.emergencyContactName}>Nitant</Text>
            <Text style={styles.emergencyContactRole}>Primary Caregiver</Text>
            <TouchableOpacity style={styles.callNitantButton} onPress={handleCallCaregiver}>
              <Text style={styles.callNitantButtonText}>📞 Call Nitant</Text>
            </TouchableOpacity>
            <Text style={styles.availabilityText}>Available 24/7 for assistance</Text>
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
  memoryReviewBanner: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  memoryReviewText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
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
  reconstructPrompt: {
    fontSize: 16,
    color: '#5A7D9A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  familiarFacesSection: {
    marginBottom: 24,
  },
  familiarFacesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  carouselButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  carouselButton: {
    backgroundColor: '#5A7D9A',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  familiarFacesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  familiarFaceCard: {
    backgroundColor: '#FFFFFF',
    width: 120,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faceEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  faceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  faceRelationship: {
    fontSize: 12,
    color: '#5A7D9A',
  },
  emergencySection: {
    marginBottom: 20,
  },
  emergencyContactCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyContactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  emergencyContactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  emergencyContactRole: {
    fontSize: 14,
    color: '#5A7D9A',
    marginBottom: 16,
  },
  callNitantButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  callNitantButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  availabilityText: {
    fontSize: 12,
    color: '#5A7D9A',
    textAlign: 'center',
  },
});
