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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function EmailVerificationPage({ navigation, route }) {
  const { email, password } = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { confirmSignUp, resendConfirmationCode, signIn } = useAuth();

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Confirm the signup
      await confirmSignUp(email, verificationCode);

      Alert.alert(
        'Email Verified Successfully!',
        'Your email has been verified. You will now be signed in.',
        [
          {
            text: 'Continue',
            onPress: async () => {
              try {
                // Automatically sign in after verification
                await signIn(email, password);
                // Navigate to the appropriate dashboard based on login type
                navigation.navigate('PatientDashboard', {
                  patientName: email.split('@')[0],
                });
              } catch (signInError) {
                Alert.alert(
                  'Sign In Failed',
                  'Verification successful, but there was an error signing you in. Please try logging in manually.',
                  [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]
                );
              }
            },
          },
        ]
      );
    } catch (err) {
      console.error('Verification error:', err);
      let errorMessage = 'Failed to verify email. Please try again.';

      if (err.code === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code. Please check and try again.';
      } else if (err.code === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired. Please request a new code.';
      } else if (err.code === 'NotAuthorizedException') {
        errorMessage = 'User is already confirmed. Please login.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      await resendConfirmationCode(email);
      Alert.alert(
        'Code Resent Successfully',
        'A new verification code has been sent to your email address.'
      );
    } catch (err) {
      console.error('Resend code error:', err);
      let errorMessage = 'Failed to resend verification code. Please try again.';

      if (err.code === 'LimitExceededException') {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert('Resend Failed', errorMessage);
    } finally {
      setIsResending(false);
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
            <Text style={styles.iconText}>✉️</Text>
            <Text style={styles.welcomeText}>Verify Your Email</Text>
            <Text style={styles.subtitleText}>
              We've sent a verification code to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <Text style={styles.instructionText}>
              Please enter the 6-digit code below to verify your email address.
            </Text>
          </View>

          {/* Verification Code Input */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code *</Text>
              <TextInput
                style={[styles.textInput, error && styles.inputError]}
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChangeText={(value) => {
                  setVerificationCode(value.replace(/[^0-9]/g, ''));
                  setError('');
                }}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                placeholderTextColor="#A0A0A0"
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
            onPress={handleVerification}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Email</Text>
            )}
          </TouchableOpacity>

          {/* Resend Code Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={isResending}
              style={styles.resendButton}
            >
              {isResending ? (
                <ActivityIndicator color="#5A7D9A" size="small" />
              ) : (
                <Text style={styles.resendLinkText}>Resend Code</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              💡 Tip: Check your spam folder if you don't see the email. The code is valid for 24 hours.
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
    backgroundColor: '#F0F8FF',
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
  iconText: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 18,
    color: '#5A7D9A',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  instructionText: {
    fontSize: 16,
    color: '#5A7D9A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
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
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8F4FD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    color: '#2C3E50',
    textAlign: 'center',
    letterSpacing: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FDF2F2',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#5A7D9A',
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
  verifyButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 16,
    color: '#2C3E50',
    marginRight: 8,
  },
  resendButton: {
    paddingVertical: 4,
  },
  resendLinkText: {
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
    marginBottom: 16,
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
