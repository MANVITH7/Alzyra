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
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginPage({ navigation }) {
  const [loginType, setLoginType] = useState('patient');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Background floating shadow
  const circleX = useRef(new Animated.Value(0)).current;
  const circleY = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance and animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    // Logo slow rotation (native driver)
    Animated.loop(
      Animated.timing(logoRotate, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();

    // Pulse animation (consistent native driver)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Floating background motion (native driver for transforms)
    const circleAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(circleX, { toValue: 30, duration: 6000, useNativeDriver: true }),
          Animated.timing(circleY, { toValue: 20, duration: 6000, useNativeDriver: true }),
          Animated.timing(circleScale, { toValue: 1.1, duration: 6000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(circleX, { toValue: -20, duration: 6000, useNativeDriver: true }),
          Animated.timing(circleY, { toValue: -15, duration: 6000, useNativeDriver: true }),
          Animated.timing(circleScale, { toValue: 1, duration: 6000, useNativeDriver: true }),
        ]),
      ])
    );
    circleAnimation.start();
    return () => circleAnimation.stop();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleLogin = () => {
    if (!validateForm()) {
      Alert.alert('Please fix the errors', 'Please check all fields and try again.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (loginType === 'patient') {
        navigation.navigate('PatientDashboard', { patientName: 'Kaushal' });
      } else {
        navigation.navigate('CaretakerDashboard');
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password?', 'We’ll send password reset instructions to your email.', [
      { text: 'Send Reset Email' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Moving Background Glow */}
          <Animated.View
            style={[
              styles.backgroundCircle,
              {
                transform: [
                  { translateX: circleX },
                  { translateY: circleY },
                  { scale: circleScale },
                ],
              },
            ]}
          />
          {/* Secondary Glow for Depth */}
          <Animated.View
            style={[
              styles.backgroundCircle,
              {
                backgroundColor: 'rgba(90,125,154,0.08)',
                top: -60,
                right: -50,
                width: 280,
                height: 280,
                borderRadius: 140,
                transform: [
                  { translateX: Animated.multiply(circleX, -0.7) },
                  { translateY: Animated.multiply(circleY, -0.7) },
                  { scale: Animated.add(circleScale, 0.1) },
                ],
              },
            ]}
          />

          {/* Header */}
          <Animated.View
            style={[
              styles.headerSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }, { scale: pulseAnim }] },
              ]}
            >
              <Image
                source={require('../assets/Alzyra_Logo.webp')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
              <Text style={styles.welcomeText}>Welcome to Alzyra</Text>
          </Animated.View>

          {/* Login Type Toggle */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, loginType === 'patient' && styles.toggleButtonActive]}
                onPress={() => setLoginType('patient')}
              >
                <Text
                  style={[styles.toggleButtonText, loginType === 'patient' && styles.toggleButtonTextActive]}
                >
                  👤 Patient
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, loginType === 'caretaker' && styles.toggleButtonActive]}
                onPress={() => setLoginType('caretaker')}
              >
                <Text
                  style={[styles.toggleButtonText, loginType === 'caretaker' && styles.toggleButtonTextActive]}
                >
                  👥 Caretaker
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={v => handleInputChange('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#A0A0A0"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={[styles.textInput, errors.password && styles.inputError]}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={v => handleInputChange('password', v)}
                secureTextEntry
                placeholderTextColor="#A0A0A0"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

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
              {isLoading
                ? 'Signing In...'
                : `Sign In as ${loginType === 'patient' ? 'Patient' : 'Caretaker'}`}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupSection}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
                Sign up
              </Text>
            </Text>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              💡{' '}
              {loginType === 'patient'
                ? 'Having trouble remembering your password? Ask your caretaker for help.'
                : 'Need help accessing your caretaker account? Contact support for assistance.'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F8FF' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },

  backgroundCircle: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(90,125,154,0.12)',
    shadowColor: '#5A7D9A',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 3,
  },

  headerSection: { alignItems: 'center', marginBottom: 10 },
  logoContainer: { marginBottom: 10, shadowColor: '#5A7D9A', shadowOpacity: 0.3 },
  logo: { width: 120, height: 120 },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    textShadowColor: 'rgba(90,125,154,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  toggleSection: { marginBottom: 30, alignItems: 'center' },
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
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: { backgroundColor: '#5A7D9A' },
  toggleButtonText: { fontSize: 16, fontWeight: '600', color: '#5A7D9A' },
  toggleButtonTextActive: { color: '#FFFFFF' },

  formSection: { marginBottom: 24 },
  inputContainer: { marginBottom: 18 },
  label: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 6 },
  textInput: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E8F4FD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: { borderColor: '#E74C3C', backgroundColor: '#FDF2F2' },
  errorText: { color: '#E74C3C', fontSize: 14, marginTop: 4 },

  forgotPasswordContainer: { alignItems: 'flex-end', marginTop: 8 },
  forgotPasswordText: { fontSize: 15, color: '#5A7D9A', textDecorationLine: 'underline' },

  loginButton: {
    backgroundColor: '#5A7D9A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  loginButtonDisabled: { backgroundColor: '#BDC3C7' },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  signupSection: { alignItems: 'center', marginBottom: 16 },
  signupText: { fontSize: 16, color: '#2C3E50', textAlign: 'center' },
  signupLink: { fontSize: 16, color: '#5A7D9A', fontWeight: '600', textDecorationLine: 'underline' },

  helpSection: {
    backgroundColor: '#E8F4FD',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#5A7D9A',
  },
  helpText: { fontSize: 14, color: '#2C3E50', lineHeight: 20, textAlign: 'center' },
});
