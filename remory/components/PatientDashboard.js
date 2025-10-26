import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function PatientDashboard({ navigation, route }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 22, condition: 'sunny' });
  // Get patient name from route params or use default
  const [userName] = useState(route?.params?.patientName || 'Patient');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // Header animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoutPulse = useRef(new Animated.Value(1)).current;
  
  // Background animations
  const backgroundCircle1 = useRef(new Animated.Value(0)).current;
  const backgroundCircle2 = useRef(new Animated.Value(0)).current;
  const backgroundCircle3 = useRef(new Animated.Value(0)).current;
  const floatingElements = useRef(new Animated.Value(0)).current;

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

    // Header animations
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Continuous logo rotation
    const rotateAnimation = Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // Continuous logout pulse
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoutPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoutPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Background animations
    Animated.parallel([
      Animated.timing(backgroundCircle1, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundCircle2, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundCircle3, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating elements animation
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingElements, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingElements, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation.start();

    return () => {
      clearInterval(timer);
      rotateAnimation.stop();
      pulseAnimation.stop();
      floatingAnimation.stop();
    };
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
      title: 'Call with Nathan',
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
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.centerSection}>
          <Animated.View
            style={[
              styles.headerLogoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })}
                ]
              }
            ]}
          >
            <Image 
              source={require('../assets/Alzyra_Logo.webp')} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.appName}>ALZYRA</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Animated.View
            style={{
              transform: [{ scale: logoutPulse }]
            }}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        {/* Floating Circles */}
        <Animated.View 
          style={[
            styles.backgroundCircle1,
            {
              opacity: backgroundCircle1,
              transform: [
                { 
                  translateY: floatingElements.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20]
                  })
                },
                { 
                  scale: backgroundCircle1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }
              ]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.backgroundCircle2,
            {
              opacity: backgroundCircle2,
              transform: [
                { 
                  translateY: floatingElements.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15]
                  })
                },
                { 
                  scale: backgroundCircle2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1]
                  })
                }
              ]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.backgroundCircle3,
            {
              opacity: backgroundCircle3,
              transform: [
                { 
                  translateY: floatingElements.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10]
                  })
                },
                { 
                  scale: backgroundCircle3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1]
                  })
                }
              ]
            }
          ]}
        />
        
        {/* Floating Elements */}
        <Animated.View 
          style={[
            styles.floatingElement1,
            {
              opacity: floatingElements.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 0.6, 0.3]
              }),
              transform: [
                { 
                  translateY: floatingElements.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30]
                  })
                },
                { 
                  rotate: floatingElements.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }
              ]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.floatingElement2,
            {
              opacity: floatingElements.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.2, 0.5, 0.2]
              }),
              transform: [
                { 
                  translateY: floatingElements.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 25]
                  })
                },
                { 
                  rotate: floatingElements.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-180deg']
                  })
                }
              ]
            }
          ]}
        />
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
              <Image source={require('../assets/Nathan.png')} style={styles.familiarFaceImage} />
              <Text style={styles.faceName}>Nathan</Text>
              <Text style={styles.faceRelationship}>Grandson</Text>
            </View>
            <View style={styles.familiarFaceCard}>
              <Image source={require('../assets/Sarah.png')} style={styles.familiarFaceImage} />
              <Text style={styles.faceName}>Sarah</Text>
              <Text style={styles.faceRelationship}>Friend</Text>
            </View>
            <View style={styles.familiarFaceCard}>
              <Image source={require('../assets/DrMartinez.png')} style={styles.familiarFaceImage} />
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
            <Image 
              source={require('../assets/mic.png')} 
              style={styles.micIcon}
              onError={(error) => console.log('Mic image error:', error)}
              onLoad={() => console.log('Mic image loaded successfully')}
            />
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
            <Text style={styles.emergencyContactName}>Sarah</Text>
            <Text style={styles.emergencyContactRole}>Primary Caregiver</Text>
            <TouchableOpacity style={styles.callNitantButton} onPress={handleCallCaregiver}>
              <Text style={styles.callNitantButtonText}>Call </Text>
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
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backgroundCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(106, 123, 140, 0.08)', // Subtle shadow circle
    top: '15%',
    right: '-10%',
    shadowColor: '#6A7B8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(232, 253, 253, 0.3)', // Light pastel green
    top: '60%',
    left: '-5%',
    shadowColor: '#E8FDFD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 1,
  },
  backgroundCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(90, 125, 154, 0.1)', // Medium blue
    top: '35%',
    left: '70%',
    shadowColor: '#5A7D9A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  floatingElement1: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(106, 123, 140, 0.15)',
    top: '25%',
    left: '20%',
    shadowColor: '#6A7B8C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  floatingElement2: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(232, 253, 253, 0.4)',
    top: '70%',
    right: '25%',
    shadowColor: '#E8FDFD',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#6A7B8C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A7D9A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginRight: 12,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
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
    borderRadius: 30,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reconstructButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  micIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
    backgroundColor: '#E8F4FD', //need 
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
  familiarFaceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
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
    backgroundColor: '#F8F9FA',
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
