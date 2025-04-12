import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { GOAL_TYPES } from '../../constants/appConstants';

// Mock data for demonstration
const mockGoals = [
  {
    id: '1',
    name: 'Vacation Fund',
    type: 'vacation',
    icon: 'airplane',
    target: 2500,
    current: 1200,
    deadline: '2025-08-15',
    progress: 48,
    monthly: 250,
  },
  {
    id: '2',
    name: 'Emergency Fund',
    type: 'emergency',
    icon: 'shield',
    target: 5000,
    current: 2750,
    deadline: '2025-12-31',
    progress: 55,
    monthly: 300,
  },
  {
    id: '3',
    name: 'New Laptop',
    type: 'custom',
    icon: 'laptop',
    target: 1200,
    current: 450,
    deadline: '2025-06-30',
    progress: 37.5,
    monthly: 150,
  },
];

const mockCompletedGoals = [
  {
    id: '4',
    name: 'Weekend Trip',
    type: 'vacation',
    icon: 'airplane',
    target: 500,
    current: 500,
    deadline: '2025-03-15',
    progress: 100,
    completedDate: '2025-03-10',
  },
];

const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const GoalsScreen = ({ navigation }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  
  const renderGoalCard = (item) => {
    return (
      <TouchableOpacity 
        style={styles.goalCard}
        onPress={() => navigation.navigate('GoalDetails', { id: item.id })}
      >
        <View style={styles.goalHeader}>
          <View style={[
            styles.goalIconContainer,
            { backgroundColor: COLORS.secondary }
          ]}>
            <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.white} />
          </View>
          
          <View style={styles.goalHeaderInfo}>
            <Text style={styles.goalName}>{item.name}</Text>
            <Text style={styles.goalTarget}>Target: {formatCurrency(item.target)}</Text>
          </View>
        </View>
        
        <View style={styles.goalProgressContainer}>
          <View style={styles.goalProgressBarBackground}>
            <View 
              style={[
                styles.goalProgressBar, 
                { width: `${item.progress}%` }
              ]} 
            />
          </View>
          <View style={styles.goalProgressDetails}>
            <Text style={styles.goalProgressText}>
              {formatCurrency(item.current)} of {formatCurrency(item.target)}
            </Text>
            <Text style={styles.goalProgressPercentage}>
              {item.progress}%
            </Text>
          </View>
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={styles.goalDeadline}>
            {item.completedDate ? 
              `Completed on ${formatDate(item.completedDate)}` : 
              `Target date: ${formatDate(item.deadline)}`}
          </Text>
          {!item.completedDate && (
            <Text style={styles.goalMonthly}>
              {formatCurrency(item.monthly)}/month
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Savings Goals</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.motivationCard}>
          <Text style={styles.motivationQuote}>
            "A goal without a plan is just a wish."
          </Text>
          <Text style={styles.motivationAuthor}>
            — Antoine de Saint-Exupéry
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          
          {mockGoals.map((goal) => renderGoalCard(goal))}
          
          {mockGoals.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="flag-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyStateText}>
                You don't have any active goals yet.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first savings goal to get started!
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.completedHeader}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Text style={styles.sectionTitle}>Completed Goals</Text>
            <MaterialCommunityIcons 
              name={showCompleted ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={COLORS.textPrimary} 
            />
          </TouchableOpacity>
          
          {showCompleted && mockCompletedGoals.map((goal) => renderGoalCard(goal))}
          
          {showCompleted && mockCompletedGoals.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                You haven't completed any goals yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddGoal')}
      >
        <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>
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
  motivationCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    ...SHADOWS.medium,
  },
  motivationQuote: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontStyle: 'italic',
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  motivationAuthor: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'right',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  goalCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.small,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  goalHeaderInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  goalTarget: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  goalProgressContainer: {
    marginBottom: SPACING.md,
  },
  goalProgressBarBackground: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: SPACING.xs,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  goalProgressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalProgressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  goalProgressPercentage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDeadline: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  goalMonthly: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
});

export default GoalsScreen;
