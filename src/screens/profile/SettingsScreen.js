import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import { CURRENCY_FORMAT } from '../../constants/appConstants';

const SettingsScreen = ({ navigation }) => {
  const { userData, updateProfile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [currency, setCurrency] = useState('USD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricAuthEnabled, setBiometricAuthEnabled] = useState(false);

  useEffect(() => {
    // Initialize form with user data
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
    }
  }, [userData]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        name,
        settings: {
          currency,
          notifications: notificationsEnabled,
          darkMode: darkModeEnabled,
          biometricAuth: biometricAuthEnabled,
        }
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await signOut();
              // Navigation will be handled by the AuthContext
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceLabel}>Currency</Text>
              <Text style={styles.preferenceValue}>{currency}</Text>
            </View>
            <TouchableOpacity style={styles.preferenceAction}>
              <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceLabel}>Notifications</Text>
              <Text style={styles.preferenceDescription}>Receive alerts and reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={notificationsEnabled ? COLORS.primary : COLORS.white}
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceLabel}>Dark Mode</Text>
              <Text style={styles.preferenceDescription}>Use dark theme</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={darkModeEnabled ? COLORS.primary : COLORS.white}
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceLabel}>Biometric Authentication</Text>
              <Text style={styles.preferenceDescription}>Use fingerprint or face ID to login</Text>
            </View>
            <Switch
              value={biometricAuthEnabled}
              onValueChange={setBiometricAuthEnabled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={biometricAuthEnabled ? COLORS.primary : COLORS.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.supportItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color={COLORS.primary} style={styles.supportIcon} />
            <Text style={styles.supportText}>Help Center</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <MaterialCommunityIcons name="email-outline" size={24} color={COLORS.primary} style={styles.supportIcon} />
            <Text style={styles.supportText}>Contact Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <MaterialCommunityIcons name="star-outline" size={24} color={COLORS.primary} style={styles.supportIcon} />
            <Text style={styles.supportText}>Rate the App</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.primary} style={styles.supportIcon} />
            <Text style={styles.supportText}>About</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoading}>
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.white} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>BudgetAI v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  section: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    ...SHADOWS.small,
  },
  disabledInput: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.textSecondary,
  },
  helperText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  preferenceValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  preferenceDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  preferenceAction: {
    padding: SPACING.xs,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  supportIcon: {
    marginRight: SPACING.md,
  },
  supportText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: SPACING.md,
    ...SHADOWS.medium,
  },
  logoutIcon: {
    marginRight: SPACING.sm,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  versionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
});

export default SettingsScreen;
