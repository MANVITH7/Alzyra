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
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (@$!%*?&)';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Please fix the errors', 'Please check all fields and try again.');
      return;
    }

    console.log('=== SIGNUP ATTEMPT START ===');
    console.log('Email:', formData.email);
    console.log('Name:', formData.name);

    setIsLoading(true);

    try {
      console.log('Calling signUp...');
      const result = await signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
        }
      );

      console.log('SignUp result:', JSON.stringify(result, null, 2));
      setIsLoading(false);

      Alert.alert(
        'Account Created Successfully!',
        'A verification code has been sent to your email address. Please verify your email to continue.',
        [
          {
            text: 'Verify Now',
            onPress: () => {
              navigation.navigate('EmailVerification', {
                email: formData.email,
                password: formData.password,
              });
            },
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      console.error('=== SIGNUP ERROR ===');
      console.error('Error object:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);

      let errorMessage = 'Failed to create account. Please try again.';

      if (error.name === 'UsernameExistsException' || error.code === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists. Please login instead.';
      } else if (error.name === 'InvalidPasswordException' || error.code === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements. Please ensure it has at least 8 characters, including uppercase, lowercase, number, and special character.';
      } else if (error.name === 'InvalidParameterException' || error.code === 'InvalidParameterException') {
        errorMessage = 'Invalid input. Please check your information.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Signup Failed', `${errorMessage}\n\nError: ${error.name || error.code}`);
    }
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
            <Text style={styles.welcomeText}>Welcome to Remory</Text>
            <Text style={styles.subtitleText}>
              Let's create your account to help you remember the important moments in your life.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Name Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#A0A0A0"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

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
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                placeholderTextColor="#A0A0A0"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={[styles.textInput, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Help Text */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              💡 Password Requirements: At least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&).
            </Text>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backToLoginText}>← Back to Login</Text>
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
    marginBottom: 24,
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
  },
  helpText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
    textAlign: 'center',
  },
  backToLoginButton: {
    backgroundColor: '#BDC3C7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
});
