import { Amplify } from 'aws-amplify';
import { signUp as amplifySignUp, signIn as amplifySignIn, signOut as amplifySignOut, confirmSignUp as amplifyConfirmSignUp, resendSignUpCode, fetchAuthSession, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { AWS_COGNITO_USER_POOL_ID, AWS_COGNITO_CLIENT_ID, AWS_COGNITO_REGION } from '@env';

// Log configuration
console.log('=== COGNITO SERVICE CONFIGURATION ===');
console.log('User Pool ID:', AWS_COGNITO_USER_POOL_ID);
console.log('Client ID:', AWS_COGNITO_CLIENT_ID);
console.log('Region:', AWS_COGNITO_REGION || 'us-east-1');

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: AWS_COGNITO_CLIENT_ID,
      region: AWS_COGNITO_REGION || 'us-east-1',
    }
  }
});

console.log('Amplify configured successfully');

/**
 * Sign up a new user
 */
export const signUp = async (email, password, attributes = {}) => {
  try {
    const { userId, isSignUpComplete, nextStep } = await amplifySignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          ...attributes,
        },
      },
    });

    return {
      user: { username: email },
      userConfirmed: isSignUpComplete,
      userSub: userId,
      nextStep,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm email verification
 */
export const confirmSignUp = async (email, code) => {
  try {
    const { isSignUpComplete, nextStep } = await amplifyConfirmSignUp({
      username: email,
      confirmationCode: code,
    });

    return { isSignUpComplete, nextStep };
  } catch (error) {
    throw error;
  }
};

/**
 * Resend confirmation code
 */
export const resendConfirmationCode = async (email) => {
  try {
    await resendSignUpCode({ username: email });
    return 'Code resent successfully';
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in a user
 */
export const signIn = async (email, password) => {
  try {
    const { isSignedIn, nextStep } = await amplifySignIn({
      username: email,
      password,
    });

    // Get session and user attributes
    const session = await fetchAuthSession();
    const userAttributes = await fetchUserAttributes();

    return {
      session,
      user: { username: email },
      attributes: userAttributes,
      idToken: session.tokens?.idToken?.toString(),
      accessToken: session.tokens?.accessToken?.toString(),
      isSignedIn,
      nextStep,
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
    await amplifySignOut();
  } catch (error) {
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentAuthUser = async () => {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();
    const userAttributes = await fetchUserAttributes();

    return {
      session,
      user,
      attributes: userAttributes,
      idToken: session.tokens?.idToken?.toString(),
      accessToken: session.tokens?.accessToken?.toString(),
    };
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
};
