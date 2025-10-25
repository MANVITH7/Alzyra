import React, { useState } from 'react';
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
        'Your Remory account has been set up. You can now start using the app to help with your memory.',
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
