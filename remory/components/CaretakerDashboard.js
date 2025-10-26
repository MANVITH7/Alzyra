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
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = 36;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function CaretakerDashboard({ navigation, route }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
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

  const handleMenu = () => {
    Alert.alert(
      'Menu Options',
      'What would you like to do?',
      [
        { text: 'Patient Settings', onPress: () => console.log('Opening patient settings') },
        { text: 'Memory Reports', onPress: () => console.log('Opening memory reports') },
        { text: 'Help & Support', onPress: () => console.log('Opening help') },
        { text: 'About Alzyra', onPress: () => console.log('Opening about') },
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
            Good morning, {caretakerName}
          </Text>
          <Text style={styles.dateTime}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </Animated.View>

        {/* Patient Profile Section */}
        <Animated.View 
          style={[
            styles.patientProfileSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.patientProfileCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientEmoji}>👴</Text>
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
              <TouchableOpacity style={styles.callButton} onPress={handlePatientCall}>
                <Text style={styles.actionIcon}>📞</Text>
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton} onPress={() => console.log('Message patient')}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Today's Activity Section */}
        <Animated.View 
          style={[
            styles.activitySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.activityCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Activity</Text>
              <TouchableOpacity style={styles.viewButton} onPress={handleViewFullTimeline}>
                <Text style={styles.viewButtonText}>View Full Timeline</Text>
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

        {/* Memory Strength Section */}
        <Animated.View 
          style={[
            styles.memorySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.memoryCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Memory Strength</Text>
              <TouchableOpacity style={styles.viewButton} onPress={handleReviewMemory}>
                <Text style={styles.viewButtonText}>Review</Text>
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
                <Text style={styles.anchorName}>Sarah (Daughter)</Text>
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

        {/* Alerts Section */}
        <Animated.View 
          style={[
            styles.alertsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
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
                    >
                      <Text style={styles.resolveButtonText}>Mark Resolved</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {/* Activity Timeline Section */}
        <Animated.View 
          style={[
            styles.timelineSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
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
              >
                <Text style={selectedFilter === 'All' ? styles.filterButtonTextActive : styles.filterButtonText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Sessions' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Sessions')}
              >
                <Text style={selectedFilter === 'Sessions' ? styles.filterButtonTextActive : styles.filterButtonText}>Sessions</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Photos' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Photos')}
              >
                <Text style={selectedFilter === 'Photos' ? styles.filterButtonTextActive : styles.filterButtonText}>Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Location' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Location')}
              >
                <Text style={selectedFilter === 'Location' ? styles.filterButtonTextActive : styles.filterButtonText}>Location</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Medication' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Medication')}
              >
                <Text style={selectedFilter === 'Medication' ? styles.filterButtonTextActive : styles.filterButtonText}>Medication</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'Communication' && styles.filterButtonActive]}
                onPress={() => handleFilterChange('Communication')}
              >
                <Text style={selectedFilter === 'Communication' ? styles.filterButtonTextActive : styles.filterButtonText}>Communication</Text>
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
                  >
                    <Text style={styles.timelineIcon}>{activity.icon}</Text>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineText}>{activity.title}</Text>
                      <Text style={styles.timelineTime}>{activity.time}</Text>
                    </View>
                    <Text style={styles.timelineArrow}>›</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </Animated.View>

        {/* Emergency Actions Section */}
        <Animated.View 
          style={[
            styles.emergencySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Emergency Actions</Text>
            <View style={styles.emergencyButtons}>
              <TouchableOpacity style={styles.emergencyActionButton} onPress={handlePatientCall}>
                <Text style={styles.emergencyActionIcon}>📞</Text>
                <Text style={styles.emergencyActionText}>Call Patient</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.emergencyActionButton, { backgroundColor: '#EF4444' }]} onPress={handleEmergency}>
                <Text style={styles.emergencyActionIcon}>🚨</Text>
                <Text style={styles.emergencyActionText}>Trigger Protocol</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.emergencyActionButton, { backgroundColor: '#6B7280' }]} onPress={() => console.log('Locate patient')}>
                <Text style={styles.emergencyActionIcon}>📍</Text>
                <Text style={styles.emergencyActionText}>Locate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
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
  greetingSection: {
    backgroundColor: '#E8F4FD',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
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
  patientEmoji: {
    fontSize: 48,
    marginRight: 16,
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
    borderRadius: 16,
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
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  messageButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
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
  },
  viewButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
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
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
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
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyActionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  emergencyActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  emergencyActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});