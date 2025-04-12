import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';

// Mock user data for demonstration
const mockUserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  memberSince: '2025-01-15',
  profileImage: null, // This would be a URI in a real app
  stats: {
    trackedExpenses: 127,
    activeGoals: 3,
    budgetAdherence: 85,
  },
  achievements: {
    level: 4,
    nextLevelProgress: 65,
    recentBadges: [
      { id: '1', name: 'Budget Master', icon: 'trophy' },
      { id: '2', name: 'Goal Setter', icon: 'flag' },
      { id: '3', name: 'Expense Tracker', icon: 'cash-multiple' },
    ],
  },
};

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {mockUserData.profileImage ? (
              <Image 
                source={{ uri: mockUserData.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>
                  {mockUserData.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.profileName}>{mockUserData.name}</Text>
          <Text style={styles.profileEmail}>{mockUserData.email}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(mockUserData.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockUserData.stats.trackedExpenses}</Text>
            <Text style={styles.statLabel}>Expenses Tracked</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockUserData.stats.activeGoals}</Text>
            <Text style={styles.statLabel}>Active Goals</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockUserData.stats.budgetAdherence}%</Text>
            <Text style={styles.statLabel}>Budget Score</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity 
              style={styles.sectionButton}
              onPress={() => navigation.navigate('Achievements')}
            >
              <Text style={styles.sectionButtonText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.achievementsCard}>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>Level {mockUserData.achievements.level}</Text>
              <View style={styles.levelProgressContainer}>
                <View style={styles.levelProgressBarBackground}>
                  <View 
                    style={[
                      styles.levelProgressBar, 
                      { width: `${mockUserData.achievements.nextLevelProgress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.levelProgressText}>
                  {mockUserData.achievements.nextLevelProgress}% to Level {mockUserData.achievements.level + 1}
                </Text>
              </View>
            </View>
            
            <Text style={styles.badgesTitle}>Recent Badges</Text>
            
            <View style={styles.badgesContainer}>
              {mockUserData.achievements.recentBadges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <View style={styles.badgeIconContainer}>
                    <MaterialCommunityIcons name={badge.icon} size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="account-cog" size={24} color={COLORS.primary} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Account Settings</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.primary} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Notification Preferences</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialCommunityIcons name="currency-usd" size={24} color={COLORS.primary} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Currency and Language</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color={COLORS.primary} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Help & Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.primary} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>About</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingsItem, styles.logoutItem]}>
            <MaterialCommunityIcons name="logout" size={24} color={COLORS.error} style={styles.settingsIcon} />
            <Text style={[styles.settingsText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  profileImageContainer: {
    marginBottom: SPACING.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  profileName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  memberSince: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.small,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.lightGray,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  sectionButton: {
    padding: SPACING.xs,
  },
  sectionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  achievementsCard: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.small,
  },
  levelContainer: {
    marginBottom: SPACING.md,
  },
  levelText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  levelProgressContainer: {
    marginBottom: SPACING.xs,
  },
  levelProgressBarBackground: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginBottom: SPACING.xs,
  },
  levelProgressBar: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  levelProgressText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  badgesTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    alignItems: 'center',
    width: '30%',
  },
  badgeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  badgeName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingsIcon: {
    marginRight: SPACING.md,
  },
  settingsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: SPACING.md,
  },
  logoutText: {
    color: COLORS.error,
  },
});

export default ProfileScreen;
