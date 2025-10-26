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

export default function LoginPage({ navigation }) {
  const [loginType, setLoginType] = useState('patient'); // 'patient' or 'caretaker'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert('Please fix the errors', 'Please check all fields and try again.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (loginType === 'patient') {
        Alert.alert(
          'Welcome Back! 🎉',
          'You have successfully logged in to your Alzyra account.',
          [
            {
              text: 'Go to Dashboard',
              onPress: () => {
                // In a real app, you would get the patient name from the login response
                // For now, we'll use a placeholder or get it from stored user data
                navigation.navigate('PatientDashboard', { 
                  patientName: 'Kaushal' // This should come from login response
                });
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Caretaker Access Granted! 👥',
          'You have successfully logged in to the caretaker dashboard.',
          [
            {
              text: 'Go to Caretaker Dashboard',
              onPress: () => {
                navigation.navigate('CaretakerDashboard');
              }
            }
          ]
        );
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password?',
      `We'll send password reset instructions to your email address.`,
      [
        { text: 'Send Reset Email', onPress: () => console.log('Password reset requested') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const toggleLoginType = () => {
    setLoginType(loginType === 'patient' ? 'caretaker' : 'patient');
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.welcomeText}>Welcome Back to Alzyra</Text>
            <Text style={styles.subtitleText}>
              Sign in to continue your memory journey
            </Text>
          </View>

          {/* Login Type Toggle */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleLabel}>I am logging in as:</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  loginType === 'patient' && styles.toggleButtonActive
                ]}
                onPress={() => setLoginType('patient')}
              >
                <Text style={[
                  styles.toggleButtonText,
                  loginType === 'patient' && styles.toggleButtonTextActive
                ]}>
                  👤 Patient
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  loginType === 'caretaker' && styles.toggleButtonActive
                ]}
                onPress={() => setLoginType('caretaker')}
              >
                <Text style={[
                  styles.toggleButtonText,
                  loginType === 'caretaker' && styles.toggleButtonTextActive
                ]}>
                  👥 Caretaker
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#A0A0A0"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={[styles.textInput, errors.password && styles.inputError]}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                placeholderTextColor="#A0A0A0"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : `Sign In as ${loginType === 'patient' ? 'Patient' : 'Caretaker'}`}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupSection}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Create one here</Text>
              </TouchableOpacity>
            </Text>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              💡 {loginType === 'patient' 
                ? 'Having trouble remembering your password? Ask your caretaker for help.'
                : 'Need help accessing your caretaker account? Contact support for assistance.'
              }
            </Text>
          </View>
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
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50', // Dark blue-grey
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 18,
    color: '#5A7D9A', // Medium blue-grey
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  toggleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#5A7D9A',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A7D9A',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  formSection: {
    marginBottom: 24,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#5A7D9A',
    textDecorationLine: 'underline',
  },
  loginButton: {
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
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  signupText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },
  signupLink: {
    fontSize: 16,
    color: '#5A7D9A',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  helpSection: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5A7D9A',
  },
  helpText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
    textAlign: 'center',
  },
});
