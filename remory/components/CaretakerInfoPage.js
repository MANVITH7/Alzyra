import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CaretakerInfoPage({ navigation, route }) {
  const { patientData } = navigation.getState()?.routes?.find(route => route.name === 'Signup')?.params || route.params || {};
  
  const [caretakerData, setCaretakerData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    relationship: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Background animations
  const backgroundCircle1 = useRef(new Animated.Value(0)).current;
  const backgroundCircle2 = useRef(new Animated.Value(0)).current;
  const backgroundCircle3 = useRef(new Animated.Value(0)).current;
  const floatingElements = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      floatingAnimation.stop();
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!caretakerData.name.trim()) {
      newErrors.name = 'Caretaker name is required';
    }

    if (!caretakerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(caretakerData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!caretakerData.password) {
      newErrors.password = 'Password is required';
    } else if (caretakerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (caretakerData.password !== caretakerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!caretakerData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }

    if (!caretakerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(caretakerData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCaretakerData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Please fix the errors', 'Please check all fields and try again.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
        Alert.alert(
          'Account Created Successfully! 🎉',
          'Your Alzyra account has been set up. You can now start using the app to help with your memory.',
        [
          {
            text: 'Get Started',
            onPress: () => {
              // Navigate to main dashboard
              console.log('Patient Data:', patientData);
              console.log('Caretaker Data:', caretakerData);
              // In a real app, you would navigate to the main dashboard here
            }
          }
        ]
      );
    }, 1500);
  };

  const relationshipOptions = [
    'Spouse/Partner',
    'Adult Child',
    'Parent',
    'Sibling',
    'Friend',
    'Professional Caregiver',
    'Other'
  ];

  return (
    <SafeAreaView style={styles.container}>
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

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.welcomeText}>Caretaker Information</Text>
            <Text style={styles.subtitleText}>
              Please provide information about your primary caretaker. They will have access to help you and monitor your progress.
            </Text>
          </View>

          {/* Patient Info Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Your Information:</Text>
            <Text style={styles.summaryText}>Name: {patientData.name || 'Not provided'}</Text>
            <Text style={styles.summaryText}>Email: {patientData.email || 'Not provided'}</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Caretaker Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Caretaker's Full Name *</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                placeholder="Enter caretaker's full name"
                value={caretakerData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#A0A0A0"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Relationship */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Relationship to You *</Text>
              <TextInput
                style={[styles.textInput, errors.relationship && styles.inputError]}
                placeholder="e.g., Spouse, Adult Child, Friend"
                value={caretakerData.relationship}
                onChangeText={(value) => handleInputChange('relationship', value)}
                autoCapitalize="words"
                placeholderTextColor="#A0A0A0"
              />
              {errors.relationship && <Text style={styles.errorText}>{errors.relationship}</Text>}
            </View>

            {/* Caretaker Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Caretaker's Email *</Text>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                placeholder="Enter caretaker's email address"
                value={caretakerData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#A0A0A0"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Caretaker Phone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Caretaker's Phone Number *</Text>
              <TextInput
                style={[styles.textInput, errors.phone && styles.inputError]}
                placeholder="Enter caretaker's phone number"
                value={caretakerData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                placeholderTextColor="#A0A0A0"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Caretaker Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Caretaker's Password *</Text>
              <TextInput
                style={[styles.textInput, errors.password && styles.inputError]}
                placeholder="Create password for caretaker"
                value={caretakerData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                placeholderTextColor="#A0A0A0"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Caretaker's Password *</Text>
              <TextInput
                style={[styles.textInput, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm caretaker's password"
                value={caretakerData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                placeholderTextColor="#A0A0A0"
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creating Account...' : 'Complete Setup'}
            </Text>
          </TouchableOpacity>

          {/* Help Text */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              🔐 Your caretaker will receive login credentials to access their dashboard where they can help monitor your memory progress and provide support when needed.
            </Text>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back to Patient Information</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50', // Dark blue-grey
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 16,
    color: '#5A7D9A', // Medium blue-grey
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  summarySection: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#5A7D9A',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#5A7D9A',
    marginBottom: 4,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8F4FD', // Light blue border
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#E74C3C', // Red border for errors
    backgroundColor: '#FDF2F2',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#5A7D9A', // Calming blue
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  helpSection: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5A7D9A',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#BDC3C7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
});
