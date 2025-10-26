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

export default function SignupPage({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const formSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(formSlideAnim, { toValue: 0, duration: 1000, delay: 300, useNativeDriver: true }),
    ]).start();

    Animated.loop(Animated.timing(logoRotate, { toValue: 1, duration: 25000, useNativeDriver: true })).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Please fix the errors', 'Please check all fields and try again.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('CaretakerInfo', { patientData: formData });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Animated Background */}
          <Animated.View
            style={[
              styles.backgroundCircle,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: pulseAnim },
                  {
                    rotate: logoRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />

          {/* Header */}
          <Animated.View style={[styles.headerSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }, { scale: pulseAnim }] }]}>
              <Image source={require('../assets/Alzyra_Logo.webp')} style={styles.logo} resizeMode="contain" />
            </Animated.View>
            <Text style={styles.welcomeText}>Welcome to Alzyra</Text>
            <Text style={styles.subtitleText}>
              Let's create your account to help you remember the important moments in your life.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.formSection, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={v => handleInputChange('name', v)}
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
                autoComplete="name"
                placeholderTextColor="#A0A0A0"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.textInput, errors.phone && styles.inputError]}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={v => handleInputChange('phone', v)}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                placeholderTextColor="#A0A0A0"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={v => handleInputChange('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                placeholderTextColor="#A0A0A0"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* ✅ Password Field Fix */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={[styles.textInput, errors.password && styles.inputError]}
                placeholder="Create a password"
                value={formData.password}
                onChangeText={v => handleInputChange('password', v)}
                secureTextEntry
                textContentType="oneTimeCode"  // 👈 prevents iOS strong password popup
                autoComplete="off"
                importantForAutofill="no"
                passwordRules=""
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="none"
                placeholderTextColor="#A0A0A0"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* ✅ Confirm Password Field Fix */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={[styles.textInput, errors.confirmPassword && styles.inputError]}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChangeText={v => handleInputChange('confirmPassword', v)}
                secureTextEntry
                textContentType="oneTimeCode"
                autoComplete="off"
                importantForAutofill="no"
                passwordRules=""
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="none"
                placeholderTextColor="#A0A0A0"
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </Animated.View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creating Account...' : 'Continue to Caretaker Setup'}
            </Text>
          </TouchableOpacity>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              💡 Tip: Use a password you can easily recall. Your caretaker can assist if needed.
            </Text>
          </View>

          <TouchableOpacity style={styles.backToLoginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backToLoginText}>← Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F8FF' },
  keyboardView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 0 },
  backgroundCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(90, 125, 154, 0.1)',
  },
  headerSection: { marginBottom: 0, alignItems: 'center', paddingTop: 0, marginTop: 0 },
  logoContainer: {
    marginBottom: 20,
    shadowColor: '#5A7D9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: { width: 120, height: 120 },
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
  },
  formSection: { marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 18, fontWeight: '600', color: '#2C3E50', marginBottom: 8 },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8F4FD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: '#2C3E50',
  },
  inputError: { borderColor: '#E74C3C', backgroundColor: '#FDF2F2' },
  errorText: { color: '#E74C3C', fontSize: 16, marginTop: 4, fontWeight: '500' },
  submitButton: {
    backgroundColor: '#5A7D9A',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: { backgroundColor: '#BDC3C7' },
  submitButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  helpSection: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5A7D9A',
  },
  helpText: { fontSize: 16, color: '#2C3E50', lineHeight: 22, textAlign: 'center' },
  backToLoginButton: {
    backgroundColor: '#BDC3C7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: { color: '#2C3E50', fontSize: 16, fontWeight: '600' },
});
