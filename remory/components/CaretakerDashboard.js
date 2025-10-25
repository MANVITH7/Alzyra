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

export default function CaretakerDashboard({ navigation, route }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [patientName] = useState(route?.params?.patientName || 'Your Loved One');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [patientStatus, setPatientStatus] = useState('Active'); // Active, Confused, Needs Help
  const [lastActivity, setLastActivity] = useState('2 hours ago');
  const [memoryStrength, setMemoryStrength] = useState(78);

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
        { text: 'About Remory', onPress: () => console.log('Opening about') },
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
          <Text style={styles.appTitle}>Caretaker Dashboard</Text>
          <Text style={styles.tagline}>Supporting your loved one's memory journey</Text>
        </Animated.View>

        {/* Patient Status Section */}
        <Animated.View 
          style={[
            styles.statusSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Patient Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.patientName}>{patientName}</Text>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(patientStatus) }]}>
                <Text style={styles.statusText}>{patientStatus}</Text>
              </View>
            </View>
            <Text style={styles.lastActivity}>Last active: {lastActivity}</Text>
            <View style={styles.memoryStrengthContainer}>
              <Text style={styles.memoryStrengthLabel}>Memory Strength</Text>
              <View style={styles.memoryStrengthBar}>
                <View style={[styles.memoryStrengthFill, { 
                  width: `${memoryStrength}%`,
                  backgroundColor: getMemoryStrengthColor(memoryStrength)
                }]} />
              </View>
              <Text style={styles.memoryStrengthText}>{memoryStrength}%</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handlePatientCall}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionTitle}>Call Patient</Text>
              <Text style={styles.actionDescription}>Contact your loved one</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleAssistPatient}>
              <Text style={styles.actionIcon}>🤝</Text>
              <Text style={styles.actionTitle}>Assist Patient</Text>
              <Text style={styles.actionDescription}>Help with app usage</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => console.log('View reports')}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionTitle}>View Reports</Text>
              <Text style={styles.actionDescription}>Memory progress tracking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => console.log('Set reminders')}>
              <Text style={styles.actionIcon}>⏰</Text>
              <Text style={styles.actionTitle}>Set Reminders</Text>
              <Text style={styles.actionDescription}>Create memory prompts</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View 
          style={[
            styles.activitySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>2 hours ago</Text>
              <Text style={styles.activityText}>Patient used memory reconstruction</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>4 hours ago</Text>
              <Text style={styles.activityText}>Patient recalled lunch with Sarah</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>Yesterday</Text>
              <Text style={styles.activityText}>Patient completed cognitive training</Text>
            </View>
          </View>
        </Animated.View>

        {/* Emergency Section */}
        <Animated.View 
          style={[
            styles.emergencySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyText}>Emergency Assistance</Text>
          </TouchableOpacity>
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 32,
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
  statusSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lastActivity: {
    fontSize: 16,
    color: '#5A7D9A',
    marginBottom: 16,
  },
  memoryStrengthContainer: {
    marginTop: 8,
  },
  memoryStrengthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  memoryStrengthBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  memoryStrengthFill: {
    height: '100%',
    borderRadius: 4,
  },
  memoryStrengthText: {
    fontSize: 14,
    color: '#5A7D9A',
    textAlign: 'right',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#5A7D9A',
    textAlign: 'center',
    lineHeight: 16,
  },
  activitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activityTime: {
    fontSize: 12,
    color: '#5A7D9A',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  emergencySection: {
    marginBottom: 20,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
