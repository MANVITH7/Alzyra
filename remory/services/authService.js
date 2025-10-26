import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';

/**
 * Simple local authentication service
 * Stores users in AsyncStorage
 */

/**
 * Get all users from storage
 */
const getUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
  } catch (error) {
    console.error('Error getting users:', error);
    return {};
  }
};

/**
 * Save users to storage
 */
const saveUsers = async (users) => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

/**
 * Sign up a new user
 */
export const signUp = async (email, password, attributes = {}) => {
  try {
    const users = await getUsers();
    
    if (users[email]) {
      throw new Error('User already exists');
    }

    const newUser = {
      email,
      password,
      attributes,
      createdAt: new Date().toISOString(),
      userConfirmed: true, // Auto-confirm for simplicity
    };

    users[email] = newUser;
    await saveUsers(users);

    return {
      user: { username: email },
      userConfirmed: true,
      userSub: email,
      nextStep: { signUpStep: 'DONE' },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm sign up (no-op for local auth)
 */
export const confirmSignUp = async (email, code) => {
  return { isSignUpComplete: true, nextStep: { signUpStep: 'DONE' } };
};

/**
 * Resend confirmation code (no-op for local auth)
 */
export const resendConfirmationCode = async (email) => {
  return { isSuccess: true };
};

/**
 * Sign in a user
 */
export const signIn = async (email, password) => {
  try {
    const users = await getUsers();
    const user = users[email];

    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password');
    }

    // Set current user
    await AsyncStorage.setItem(CURRENT_USER_KEY, email);

    return {
      session: {
        tokens: {
          idToken: { toString: () => `local-token-${email}-${Date.now()}` },
          accessToken: { toString: () => `local-access-${email}-${Date.now()}` },
        },
      },
      user: { username: email },
      attributes: user.attributes,
      idToken: `local-token-${email}`,
      accessToken: `local-access-${email}`,
      isSignedIn: true,
      nextStep: { signInStep: 'DONE' },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentAuthUser = async () => {
  try {
    const email = await AsyncStorage.getItem(CURRENT_USER_KEY);
    
    if (!email) {
      throw new Error('No user logged in');
    }

    const users = await getUsers();
    const user = users[email];

    if (!user) {
      throw new Error('User not found');
    }

    return {
      session: {
        tokens: {
          idToken: { toString: () => `local-token-${email}` },
          accessToken: { toString: () => `local-access-${email}` },
        },
      },
      user: { username: email },
      attributes: user.attributes,
      idToken: `local-token-${email}`,
      accessToken: `local-access-${email}`,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Forgot password (no-op for local auth)
 */
export const forgotPassword = async (email) => {
  return { isSuccess: true };
};

/**
 * Confirm password reset (no-op for local auth)
 */
export const confirmPassword = async (email, code, newPassword) => {
  try {
    const users = await getUsers();
    const user = users[email];
    
    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;
    await saveUsers(users);

    return { isSuccess: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const email = await AsyncStorage.getItem(CURRENT_USER_KEY);
    
    if (!email) {
      throw new Error('No user logged in');
    }

    const users = await getUsers();
    const user = users[email];

    if (!user || user.password !== oldPassword) {
      throw new Error('Incorrect password');
    }

    user.password = newPassword;
    await saveUsers(users);

    return { isSuccess: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Update user attributes
 */
export const updateUserAttributes = async (attributes) => {
  try {
    const email = await AsyncStorage.getItem(CURRENT_USER_KEY);
    
    if (!email) {
      throw new Error('No user logged in');
    }

    const users = await getUsers();
    const user = users[email];

    if (!user) {
      throw new Error('User not found');
    }

    user.attributes = { ...user.attributes, ...attributes };
    await saveUsers(users);

    return { isSuccess: true };
  } catch (error) {
    throw error;
  }
};

export default {
  signUp,
  confirmSignUp,
  resendConfirmationCode,
  signIn,
  signOut,
  getCurrentAuthUser,
  forgotPassword,
  confirmPassword,
  changePassword,
  updateUserAttributes,
};
