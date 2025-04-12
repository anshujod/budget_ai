import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/appConstants';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Check if onboarding is completed
        const onboardingStatus = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
        setIsOnboardingCompleted(onboardingStatus === 'true');

        // Check if user is logged in
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const user = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && user) {
          setUserToken(token);
          setUserData(JSON.parse(user));
        }
      } catch (error) {
        console.log('Error restoring auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Auth functions
  const authContext = {
    isLoading,
    userToken,
    userData,
    isOnboardingCompleted,
    
    // Complete onboarding
    completeOnboarding: async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
        setIsOnboardingCompleted(true);
      } catch (error) {
        console.log('Error completing onboarding:', error);
      }
    },
    
    // Sign in
    signIn: async (email, password) => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call to authenticate
        // For demo purposes, we'll simulate a successful login
        const mockUserData = {
          id: '1',
          name: 'Alex Johnson',
          email: email,
          memberSince: new Date().toISOString(),
          profileImage: null,
          stats: {
            trackedExpenses: 0,
            activeGoals: 0,
            budgetAdherence: 100,
          },
          achievements: {
            level: 1,
            nextLevelProgress: 0,
            recentBadges: [],
          },
        };
        
        const mockToken = 'mock-auth-token-' + Math.random().toString(36).substring(2);
        
        // Store auth data
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUserData));
        
        setUserToken(mockToken);
        setUserData(mockUserData);
      } catch (error) {
        console.log('Error signing in:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Sign up
    signUp: async (name, email, password) => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call to register
        // For demo purposes, we'll simulate a successful registration
        const mockUserData = {
          id: '1',
          name: name,
          email: email,
          memberSince: new Date().toISOString(),
          profileImage: null,
          stats: {
            trackedExpenses: 0,
            activeGoals: 0,
            budgetAdherence: 100,
          },
          achievements: {
            level: 1,
            nextLevelProgress: 0,
            recentBadges: [],
          },
        };
        
        const mockToken = 'mock-auth-token-' + Math.random().toString(36).substring(2);
        
        // Store auth data
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUserData));
        
        setUserToken(mockToken);
        setUserData(mockUserData);
      } catch (error) {
        console.log('Error signing up:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Sign out
    signOut: async () => {
      try {
        setIsLoading(true);
        
        // Remove auth data
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        setUserToken(null);
        setUserData(null);
      } catch (error) {
        console.log('Error signing out:', error);
      } finally {
        setIsLoading(false);
      }
    },
    
    // Update user profile
    updateProfile: async (updatedData) => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call to update profile
        const updatedUserData = { ...userData, ...updatedData };
        
        // Store updated user data
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUserData));
        
        setUserData(updatedUserData);
      } catch (error) {
        console.log('Error updating profile:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
