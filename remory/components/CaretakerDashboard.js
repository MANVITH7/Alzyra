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
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = 36;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function CaretakerDashboard({ navigation, route }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [logoScale] = useState(new Animated.Value(0.8));
  const [logoRotate] = useState(new Animated.Value(0));
  const [logoutPulse] = useState(new Animated.Value(1));
  const [greetingCardScale] = useState(new Animated.Value(1));
  const [patientCardScale] = useState(new Animated.Value(1));
  const [activityCardScale] = useState(new Animated.Value(1));
  const [memoryCardScale] = useState(new Animated.Value(1));
  const [alertsCardScale] = useState(new Animated.Value(1));
  const [timelineCardScale] = useState(new Animated.Value(1));
  const [emergencyCardScale] = useState(new Animated.Value(1));
  
  // Background animations
  const backgroundCircle1 = useRef(new Animated.Value(0)).current;
  const backgroundCircle2 = useRef(new Animated.Value(0)).current;
  const backgroundCircle3 = useRef(new Animated.Value(0)).current;
  const floatingElements = useRef(new Animated.Value(0)).current;
  
  // Button hover animations
  const [callButtonScale] = useState(new Animated.Value(1));
  const [messageButtonScale] = useState(new Animated.Value(1));
  const [viewTimelineButtonScale] = useState(new Animated.Value(1));
  const [reviewButtonScale] = useState(new Animated.Value(1));
  const [resolveButtonScale] = useState(new Animated.Value(1));
  const [filterButtonScale] = useState(new Animated.Value(1));
  const [timelineArrowScale] = useState(new Animated.Value(1));
  const [emergencyCallScale] = useState(new Animated.Value(1));
  const [emergencyProtocolScale] = useState(new Animated.Value(1));
  const [emergencyLocateScale] = useState(new Animated.Value(1));
  const [patientName] = useState(route?.params?.patientName || 'John');
  const [caretakerName] = useState('Sarah'); // In real app, this would come from user profile
  const [currentTime, setCurrentTime] = useState(new Date());
  const [patientStatus, setPatientStatus] = useState('Stable');
  const [lastCheckIn, setLastCheckIn] = useState('2h ago');
  const [memoryStrength, setMemoryStrength] = useState(78);
  const [fadingMemories, setFadingMemories] = useState(3);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Missed Evening Medication',
      time: '4h ago',
      priority: 'MEDIUM',
      description: 'Evening medication not taken at scheduled time (8:00 PM)',
      icon: 'ℹ️',
      resolved: false
    },
    {
      id: 2,
      title: 'Memory Score Declining',
      time: '24h ago',
      priority: 'LOW',
      description: 'Recent memory exercises showing lower scores than usual',
      icon: '✅',
      resolved: false
    },
    {
      id: 3,
      title: 'Low Activity Alert',
      time: '6h ago',
      priority: 'HIGH',
      description: 'Patient has been inactive for longer than usual',
      icon: '⚠️',
      resolved: false
    }
  ]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  // Activity data for filtering
  const [activities] = useState([
    { id: 1, type: 'Sessions', title: 'Memory Recall Session', time: '3:30 PM', icon: '🧠' },
    { id: 2, type: 'Photos', title: 'Photo Viewing', time: '1:30 PM', icon: '📷' },
    { id: 3, type: 'Location', title: 'Park Visit', time: '11:30 AM', icon: '📍' },
    { id: 4, type: 'Medication', title: 'Medication Taken', time: '8:30 AM', icon: '💊' },
    { id: 5, type: 'Communication', title: 'Video Call', time: '4:30 AM', icon: '📞' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Initial entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous logo rotation
    const rotateAnimation = Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // Logout button pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoutPulse, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoutPulse, {
          toValue: 1,
          duration: 1500,
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

  const handlePatientCall = () => {
    Alert.alert(
      'Contact Patient',
      'How would you like to reach your loved one?',
      [
        { text: 'Call Now', onPress: () => console.log('Calling patient') },
        { text: 'Send Message', onPress: () => console.log('Sending message') },
        { text: 'Video Call', onPress: () => console.log('Starting video call') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAssistPatient = () => {
    Alert.alert(
      'Assist Patient',
      'How can you help your loved one right now?',
      [
        { text: 'Guide Through App', onPress: () => console.log('Guiding through app') },
        { text: 'Help with Memory', onPress: () => console.log('Helping with memory') },
        { text: 'Check Location', onPress: () => console.log('Checking location') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Assistance',
      'Is this an emergency situation?',
      [
        { 
          text: 'Call Emergency Services', 
          style: 'destructive',
          onPress: () => console.log('Calling emergency services')
        },
        { text: 'Contact Doctor', onPress: () => console.log('Contacting doctor') },
        { text: 'Family Alert', onPress: () => console.log('Alerting family') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleViewFullTimeline = () => {
    console.log('Opening full timeline view');
    Alert.alert('Full Timeline', 'Opening detailed activity timeline...');
  };

  const handleReviewMemory = () => {
    console.log('Opening memory review');
    Alert.alert('Memory Review', 'Opening detailed memory strength analysis...');
  };

  const handleResolveAlert = (alertId) => {
    console.log(`Resolving alert ${alertId}`);
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    Alert.alert('Alert Resolved', 'The alert has been marked as resolved.');
  };

  const handleFilterChange = (filter) => {
    console.log(`Filtering by: ${filter}`);
    setSelectedFilter(filter);
  };

  const animateCardPress = (scaleAnim, toValue) => {
    Animated.spring(scaleAnim, {
      toValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleActivityPress = (activity) => {
    console.log(`Opening details for: ${activity}`);
    Alert.alert('Activity Details', `Opening detailed view for: ${activity}`);
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


  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Confused': return '#f59e0b';
      case 'Needs Help': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getMemoryStrengthColor = (strength) => {
    if (strength >= 80) return '#10b981';
    if (strength >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Welcome Back, Logo, and Logout */}
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
        <TouchableOpacity 
          activeOpacity={0.9}
          onPressIn={() => animateCardPress(greetingCardScale, 0.98)}
          onPressOut={() => animateCardPress(greetingCardScale, 1)}
          onPress={() => console.log('Greeting Card Pressed')}
        >
          <Animated.View 
            style={[
              styles.greetingSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: greetingCardScale }]
              }
            ]}
          >
            <Text style={styles.greeting}>
              Good morning, {caretakerName}
            </Text>
            <Text style={styles.dateTime}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Patient Profile Section */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPressIn={() => animateCardPress(patientCardScale, 0.98)}
          onPressOut={() => animateCardPress(patientCardScale, 1)}
          onPress={() => console.log('Patient Profile Card Pressed')}
        >
          <Animated.View 
            style={[
              styles.patientProfileSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: patientCardScale }]
              }
            ]}
          >
            <View style={styles.patientProfileCard}>
              <View style={styles.patientInfo}>
                <Image 
                  source={require('../assets/john.png')} 
                  style={styles.patientImage}
                  resizeMode="cover"
                />
                <View style={styles.patientDetails}>
                  <Text style={styles.patientName}>{patientName}</Text>
                  <Text style={styles.patientRelationship}>Father</Text>
                  <Text style={styles.lastCheckIn}>Last check-in: {lastCheckIn}</Text>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: patientStatus === 'Stable' ? '#10B981' : '#EF4444' 
                }]}>
                  <Text style={styles.statusBadgeText}>{patientStatus}</Text>
                </View>
              </View>
              <View style={styles.patientActions}>
                <TouchableOpacity 
                  style={styles.callButton} 
                  onPress={handlePatientCall}
                  onPressIn={() => animateCardPress(callButtonScale, 0.95)}
                  onPressOut={() => animateCardPress(callButtonScale, 1)}
                >
                  <Animated.View style={{ transform: [{ scale: callButtonScale }] }}>
                    <Text style={styles.actionIcon}>📞</Text>
                    <Text style={styles.actionText}>Call</Text>
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.messageButton} 
                  onPress={() => console.log('Message patient')}
                  onPressIn={() => animateCardPress(messageButtonScale, 0.95)}
                  onPressOut={() => animateCardPress(messageButtonScale, 1)}
                >
                  <Animated.View style={{ transform: [{ scale: messageButtonScale }] }}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>Message</Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Today's Activity Section */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPressIn={() => animateCardPress(activityCardScale, 0.98)}
          onPressOut={() => animateCardPress(activityCardScale, 1)}
          onPress={() => console.log('Today\'s Activity Card Pressed')}
        >
          <Animated.View 
            style={[
              styles.activitySection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: activityCardScale }]
              }
            ]}
          >
            <View style={styles.activityCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Activity</Text>
                <TouchableOpacity 
                  style={styles.viewButton} 
                  onPress={handleViewFullTimeline}
                  onPressIn={() => animateCardPress(viewTimelineButtonScale, 0.95)}
                  onPressOut={() => animateCardPress(viewTimelineButtonScale, 1)}
                >
                  <Animated.View style={{ transform: [{ scale: viewTimelineButtonScale }] }}>
                    <Text style={styles.viewButtonText}>View Full Timeline</Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
              <View style={styles.activityMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricIcon}>🧠</Text>
                  <Text style={styles.metricNumber}>3</Text>
                  <Text style={styles.metricLabel}>Sessions</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricIcon}>📷</Text>
                  <Text style={styles.metricNumber}>12</Text>
                  <Text style={styles.metricLabel}>Photos</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricIcon}>👣</Text>
                  <Text style={styles.metricNumber}>2847</Text>
                  <Text style={styles.metricLabel}>Steps</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricIcon}>💊</Text>
                  <Text style={styles.metricNumber}>2</Text>
                  <Text style={styles.metricLabel}>Medications</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Memory Strength Section */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPressIn={() => animateCardPress(memoryCardScale, 0.98)}
          onPressOut={() => animateCardPress(memoryCardScale, 1)}
          onPress={() => console.log('Memory Strength Card Pressed')}
        >
          <Animated.View 
            style={[
              styles.memorySection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: memoryCardScale }]
              }
            ]}
          >
          <View style={styles.memoryCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Memory Strength</Text>
              <TouchableOpacity 
                style={styles.viewButton} 
                onPress={handleReviewMemory}
                onPressIn={() => animateCardPress(reviewButtonScale, 0.95)}
                onPressOut={() => animateCardPress(reviewButtonScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: reviewButtonScale }] }}>
                  <Text style={styles.viewButtonText}>Review</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <View style={styles.memoryScore}>
              <View style={styles.circularProgressContainer}>
                <Svg width="90" height="90">
                  {/* Background circle */}
                  <Circle
                    cx="45"
                    cy="45"
                    r={CIRCLE_RADIUS}
                    stroke="#E5E7EB"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                  />
                  {/* Progress circle */}
                  <Circle
                    cx="45"
                    cy="45"
                    r={CIRCLE_RADIUS}
                    stroke={memoryStrength >= 70 ? '#10B981' : memoryStrength >= 50 ? '#F59E0B' : '#EF4444'}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    strokeDashoffset={CIRCUMFERENCE - (memoryStrength / 100) * CIRCUMFERENCE}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="45,45"
                  />
                </Svg>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>{memoryStrength}%</Text>
                </View>
              </View>
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreTitle}>Overall Score</Text>
                <Text style={styles.scoreSubtitle}>{fadingMemories} fading memories</Text>
              </View>
            </View>
            <View style={styles.memoryAnchors}>
              <Text style={styles.anchorsTitle}>Memory Anchors</Text>
              <View style={styles.anchorItem}>
                <Text style={styles.anchorName}>Sarah (Friend)</Text>
                <View style={styles.anchorProgress}>
                  <View style={[styles.anchorBar, { width: '95%' }]} />
                </View>
                <Text style={styles.anchorPercent}>95%</Text>
              </View>
              <View style={styles.anchorItem}>
                <Text style={styles.anchorName}>Family Home</Text>
                <View style={styles.anchorProgress}>
                  <View style={[styles.anchorBar, { width: '88%' }]} />
                </View>
                <Text style={styles.anchorPercent}>88%</Text>
              </View>
              <View style={styles.anchorItem}>
                <Text style={styles.anchorName}>Wedding Anniversary</Text>
                <View style={styles.anchorProgress}>
                  <View style={[styles.anchorBar, { width: '72%' }]} />
                </View>
                <Text style={styles.anchorPercent}>72%</Text>
              </View>
            </View>
          </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Alerts Section */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPressIn={() => animateCardPress(alertsCardScale, 0.98)}
          onPressOut={() => animateCardPress(alertsCardScale, 1)}
          onPress={() => console.log('Alerts Card Pressed')}
        >
          <Animated.View 
            style={[
              styles.alertsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: alertsCardScale }]
              }
            ]}
          >
          <View style={styles.alertsCard}>
            <View style={styles.alertsHeader}>
              <Text style={styles.sectionTitle}>Alerts</Text>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{alerts.filter(alert => !alert.resolved).length}</Text>
              </View>
            </View>
            <ScrollView style={styles.alertsScroll} showsVerticalScrollIndicator={true}>
              {alerts.filter(alert => !alert.resolved).map((alert) => (
                <View key={alert.id} style={styles.alertItem}>
                  <Text style={styles.alertIcon}>{alert.icon}</Text>
                  <View style={styles.alertContent}>
                    <View style={styles.alertHeader}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <View style={[styles.priorityTag, { 
                        backgroundColor: alert.priority === 'HIGH' ? '#EF4444' : 
                                        alert.priority === 'MEDIUM' ? '#F59E0B' : '#10B981' 
                      }]}>
                        <Text style={styles.priorityText}>{alert.priority}</Text>
                      </View>
                    </View>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                    <TouchableOpacity 
                      style={styles.resolveButton}
                      onPress={() => handleResolveAlert(alert.id)}
                      onPressIn={() => animateCardPress(resolveButtonScale, 0.95)}
                      onPressOut={() => animateCardPress(resolveButtonScale, 1)}
                    >
                      <Animated.View style={{ transform: [{ scale: resolveButtonScale }] }}>
                        <Text style={styles.resolveButtonText}>Mark Resolved</Text>
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Activity Timeline Section */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPressIn={() => animateCardPress(timelineCardScale, 0.98)}
          onPressOut={() => animateCardPress(timelineCardScale, 1)}
          onPress={() => console.log('Activity Timeline Card Pressed')}
        >
          <Animated.View 
            style={[
              styles.timelineSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: timelineCardScale }]
              }
            ]}
          >
          <View style={styles.timelineCard}>
            <Text style={styles.sectionTitle}>Activity Timeline</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterButtonsContainer}
              contentContainerStyle={styles.filterButtons}
            >
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'All' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('All')}
                onPressIn={() => animateCardPress(filterButtonScale, 0.95)}
                onPressOut={() => animateCardPress(filterButtonScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
                  <Text style={selectedFilter === 'All' ? styles.filterButtonTextActive : styles.filterButtonText}>All</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Sessions' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Sessions')}
                onPressIn={() => animateCardPress(filterButtonScale, 0.95)}
                onPressOut={() => animateCardPress(filterButtonScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
                  <Text style={selectedFilter === 'Sessions' ? styles.filterButtonTextActive : styles.filterButtonText}>Sessions</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Photos' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Photos')}
                onPressIn={() => animateCardPress(filterButtonScale, 0.95)}
                onPressOut={() => animateCardPress(filterButtonScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
                  <Text style={selectedFilter === 'Photos' ? styles.filterButtonTextActive : styles.filterButtonText}>Photos</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Location' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Location')}
                onPressIn={() => animateCardPress(filterButtonScale, 0.95)}
                onPressOut={() => animateCardPress(filterButtonScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
                  <Text style={selectedFilter === 'Location' ? styles.filterButtonTextActive : styles.filterButtonText}>Location</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Medication' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Medication')}
                onPressIn={() => animateCardPress(filterButtonScale, 0.95)}
                onPressOut={() => animateCardPress(filterButtonScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
                  <Text style={selectedFilter === 'Medication' ? styles.filterButtonTextActive : styles.filterButtonText}>Medication</Text>
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Communication' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Communication')}
                onPressIn={() => animateCardPress(filterButtonScale, 0.95)}
                onPressOut={() => animateCardPress(filterButtonScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
                  <Text style={selectedFilter === 'Communication' ? styles.filterButtonTextActive : styles.filterButtonText}>Communication</Text>
                </Animated.View>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.timelineList}>
              {activities
                .filter(activity => selectedFilter === 'All' || activity.type === selectedFilter)
                .map((activity) => (
                  <TouchableOpacity 
                    key={activity.id}
                    style={styles.timelineItem} 
                    onPress={() => handleActivityPress(activity.title)}
                    onPressIn={() => animateCardPress(timelineArrowScale, 0.95)}
                    onPressOut={() => animateCardPress(timelineArrowScale, 1)}
                  >
                    <Animated.View style={{ transform: [{ scale: timelineArrowScale }] }}>
                      <Text style={styles.timelineIcon}>{activity.icon}</Text>
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineText}>{activity.title}</Text>
                        <Text style={styles.timelineTime}>{activity.time}</Text>
                      </View>
                      <Text style={styles.timelineArrow}>›</Text>
                    </Animated.View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Emergency Actions Section */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPressIn={() => animateCardPress(emergencyCardScale, 0.98)}
          onPressOut={() => animateCardPress(emergencyCardScale, 1)}
          onPress={() => console.log('Emergency Actions Card Pressed')}
        >
          <Animated.View 
            style={[
              styles.emergencySection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: emergencyCardScale }]
              }
            ]}
          >
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Emergency Actions</Text>
            <View style={styles.emergencyButtons}>
              <TouchableOpacity 
                style={styles.triggerProtocolButton} 
                onPress={handleEmergency}
                onPressIn={() => animateCardPress(emergencyProtocolScale, 0.95)}
                onPressOut={() => animateCardPress(emergencyProtocolScale, 1)}
              >
                <Animated.View style={{ transform: [{ scale: emergencyProtocolScale }] }}>
                  <Text style={styles.triggerProtocolText}>🚨 Trigger Protocol</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
          </Animated.View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Soft blue background matching login screen
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#6A7B8C', // Exact color from the image
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
  greetingSection: {
    backgroundColor: '#E8FDFD', // Light pastel green from first image
    padding: 24,
    borderRadius: 12, // Matching login screen border radius
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
  },
  patientProfileSection: {
    marginBottom: 24,
  },
  patientProfileCard: {
    backgroundColor: '#E8FDFD', // Light pastel green from first image
    padding: 20,
    borderRadius: 12, // Matching login screen border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#F0F0F0',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  patientRelationship: {
    fontSize: 16,
    color: '#5A7D9A',
    marginBottom: 4,
  },
  lastCheckIn: {
    fontSize: 14,
    color: '#5A7D9A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8, // Matching login screen border radius
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  patientActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  callButton: {
    backgroundColor: '#5A7D9A', // Matching login screen button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10, // Matching login screen button border radius
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageButton: {
    backgroundColor: '#6B7280', // Keeping gray for secondary action
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10, // Matching login screen button border radius
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#E8FDFD', // Light pastel green from first image
    padding: 20,
    borderRadius: 12, // Matching login screen border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  viewButton: {
    backgroundColor: '#5A7D9A', // Matching login screen button color
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8, // Matching login screen border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#5A7D9A',
    textAlign: 'center',
  },
  memorySection: {
    marginBottom: 24,
  },
  memoryCard: {
    backgroundColor: '#E8FDFD', // Light pastel green from first image
    padding: 20,
    borderRadius: 12, // Matching login screen border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memoryScore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  circularProgressContainer: {
    width: 90,
    height: 90,
    marginRight: 16,
    position: 'relative',
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularProgressBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#E5E7EB',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circularProgressFill: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: '#5A7D9A',
  },
  memoryAnchors: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  anchorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  anchorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  anchorName: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
  },
  anchorProgress: {
    flex: 2,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginHorizontal: 12,
  },
  anchorBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  anchorPercent: {
    fontSize: 12,
    color: '#5A7D9A',
    minWidth: 30,
    textAlign: 'right',
  },
  alertsSection: {
    marginBottom: 24,
  },
  alertsCard: {
    backgroundColor: '#E8FDFD', // Light pastel green from first image
    padding: 20,
    borderRadius: 12, // Matching login screen border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertsScroll: {
    maxHeight: 300,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertBadge: {
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  alertBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 4,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  priorityTag: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  alertTime: {
    fontSize: 12,
    color: '#5A7D9A',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 18,
  },
  resolveButton: {
    backgroundColor: '#10B981', // Keeping green for positive action
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8, // Matching login screen border radius
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  resolveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineSection: {
    marginBottom: 24,
  },
  timelineCard: {
    backgroundColor: '#E8FDFD', // Light pastel green from first image
    padding: 20,
    borderRadius: 12, // Matching login screen border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonsContainer: {
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8, // Matching login screen border radius
    marginRight: 12,
    backgroundColor: '#E8F4FD', // Matching login screen toggle background
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#5A7D9A', // Matching login screen active button color
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timelineList: {
    paddingLeft: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 16,
    marginBottom: 8,
  },
  timelineIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 12,
    color: '#5A7D9A',
  },
  timelineArrow: {
    fontSize: 16,
    color: '#5A7D9A',
  },
  emergencySection: {
    marginBottom: 20,
  },
  emergencyCard: {
    backgroundColor: '#E8FDFD', // Light pastel green from first image
    padding: 20,
    borderRadius: 12, // Matching login screen border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  emergencyButtons: {
    alignItems: 'center',
  },
  triggerProtocolButton: {
    backgroundColor: '#EF4444', // Red background for emergency
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25, // Oval shape - much larger border radius
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
    flexDirection: 'row', // Horizontal layout for icon and text
    justifyContent: 'center',
  },
  triggerProtocolText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});