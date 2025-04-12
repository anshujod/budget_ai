import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';
import { useAuth } from '../../context/AuthContext';

const ChallengesScreen = ({ navigation }) => {
  const { expenses, budgets, goals } = useFinancial();
  const { userData, updateUserData } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('active');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize challenges
    const allChallenges = generateChallenges();
    setChallenges(allChallenges);
    
    // Get user's active and completed challenges
    const userActive = userData?.activeChallenges || [];
    const userCompleted = userData?.completedChallenges || [];
    
    setActiveChallenges(userActive);
    setCompletedChallenges(userCompleted);
    
    // Check for completed challenges
    checkForCompletedChallenges(allChallenges, userActive, userCompleted);
  }, [expenses, budgets, goals]);

  const generateChallenges = () => {
    return [
      // Daily challenges
      {
        id: 'daily-expense-tracking',
        title: 'Daily Tracker',
        description: 'Track all your expenses for today',
        icon: 'calendar-today',
        category: 'daily',
        difficulty: 'easy',
        points: 10,
        duration: '1 day',
        condition: () => checkDailyExpenseTracking(),
      },
      {
        id: 'daily-under-budget',
        title: 'Budget Guardian',
        description: 'Stay under budget in all categories today',
        icon: 'shield-check',
        category: 'daily',
        difficulty: 'medium',
        points: 15,
        duration: '1 day',
        condition: () => checkDailyBudget(),
      },
      {
        id: 'daily-savings',
        title: 'Daily Saver',
        description: 'Add money to any savings goal today',
        icon: 'piggy-bank',
        category: 'daily',
        difficulty: 'easy',
        points: 10,
        duration: '1 day',
        condition: () => checkDailySavings(),
      },
      
      // Weekly challenges
      {
        id: 'weekly-expense-streak',
        title: 'Consistency Champion',
        description: 'Track expenses every day for a week',
        icon: 'calendar-check',
        category: 'weekly',
        difficulty: 'medium',
        points: 50,
        duration: '7 days',
        condition: () => checkExpenseStreak(7),
      },
      {
        id: 'weekly-no-dining',
        title: 'Home Chef',
        description: 'No restaurant or takeout expenses for a week',
        icon: 'food',
        category: 'weekly',
        difficulty: 'hard',
        points: 75,
        duration: '7 days',
        condition: () => checkNoDiningOut(7),
      },
      {
        id: 'weekly-budget-review',
        title: 'Budget Analyst',
        description: 'Review and adjust all your budget categories',
        icon: 'chart-bar',
        category: 'weekly',
        difficulty: 'medium',
        points: 40,
        duration: '7 days',
        condition: () => userData?.budgetReviewCompleted,
      },
      
      // Monthly challenges
      {
        id: 'monthly-savings-goal',
        title: 'Goal Crusher',
        description: 'Contribute to all active savings goals this month',
        icon: 'flag-checkered',
        category: 'monthly',
        difficulty: 'hard',
        points: 100,
        duration: '30 days',
        condition: () => checkAllGoalsContribution(),
      },
      {
        id: 'monthly-expense-categories',
        title: 'Category Master',
        description: 'Track expenses in at least 8 different categories',
        icon: 'tag-multiple',
        category: 'monthly',
        difficulty: 'medium',
        points: 60,
        duration: '30 days',
        condition: () => {
          const categories = new Set(expenses.map(exp => exp.category));
          return categories.size >= 8;
        },
      },
      {
        id: 'monthly-savings-rate',
        title: '20% Saver',
        description: 'Maintain a 20% or higher savings rate for the month',
        icon: 'percent',
        category: 'monthly',
        difficulty: 'hard',
        points: 125,
        duration: '30 days',
        condition: () => checkSavingsRate(20),
      },
      
      // Special challenges
      {
        id: 'special-no-spend',
        title: 'No-Spend Weekend',
        description: 'Complete a weekend with no discretionary spending',
        icon: 'cash-remove',
        category: 'special',
        difficulty: 'medium',
        points: 50,
        duration: 'Weekend',
        condition: () => userData?.noSpendWeekend,
      },
      {
        id: 'special-insight-actions',
        title: 'Insight Implementer',
        description: 'Complete 5 actions from AI insights',
        icon: 'lightbulb-on',
        category: 'special',
        difficulty: 'medium',
        points: 75,
        duration: 'Ongoing',
        condition: () => (userData?.insightActionsCompleted || 0) >= 5,
      },
      {
        id: 'special-emergency-fund',
        title: 'Emergency Ready',
        description: 'Create and fund an emergency savings goal',
        icon: 'shield-half-full',
        category: 'special',
        difficulty: 'hard',
        points: 100,
        duration: 'Ongoing',
        condition: () => {
          const emergencyGoal = goals.find(goal => 
            goal.category === 'emergency' && 
            goal.name.toLowerCase().includes('emergency') &&
            goal.progress > 0
          );
          return !!emergencyGoal;
        },
      },
    ];
  };

  const checkDailyExpenseTracking = () => {
    // In a real app, this would check if all of today's expenses were tracked
    // For this simulation, we'll use a simplified check
    const today = new Date().toDateString();
    const todayExpenses = expenses.filter(exp => new Date(exp.date).toDateString() === today);
    return todayExpenses.length > 0;
  };

  const checkDailyBudget = () => {
    // In a real app, this would check if today's spending is under budget
    // For this simulation, we'll use a simplified check
    return budgets.every(budget => budget.spent <= budget.allocated);
  };

  const checkDailySavings = () => {
    // In a real app, this would check if money was added to a savings goal today
    // For this simulation, we'll use a simplified check
    return userData?.lastSavingsContribution === new Date().toDateString();
  };

  const checkExpenseStreak = (days) => {
    // In a real app, this would check for consecutive days with expense entries
    // For this simulation, we'll use a simplified check
    return userData?.expenseStreak >= days;
  };

  const checkNoDiningOut = (days) => {
    // In a real app, this would check for no dining out expenses in the last X days
    // For this simulation, we'll use a simplified check
    return userData?.noDiningOutStreak >= days;
  };

  const checkAllGoalsContribution = () => {
    // In a real app, this would check if all active goals received contributions this month
    // For this simulation, we'll use a simplified check
    if (goals.length === 0) return false;
    
    const activeGoals = goals.filter(goal => goal.progress < 100);
    if (activeGoals.length === 0) return true;
    
    return userData?.allGoalsContributed === true;
  };

  const checkSavingsRate = (targetRate) => {
    // In a real app, this would calculate the actual savings rate
    // For this simulation, we'll use a simplified check
    return userData?.savingsRate >= targetRate;
  };

  const checkForCompletedChallenges = (allChallenges, active, completed) => {
    const newlyCompleted = [];
    
    active.forEach(challengeId => {
      const challenge = allChallenges.find(c => c.id === challengeId);
      if (challenge && challenge.condition()) {
        newlyCompleted.push(challengeId);
      }
    });
    
    // If new challenges were completed, update user data
    if (newlyCompleted.length > 0) {
      const updatedActive = active.filter(id => !newlyCompleted.includes(id));
      const updatedCompleted = [...completed, ...newlyCompleted];
      
      // Calculate points
      const newPoints = newlyCompleted.reduce((sum, id) => {
        const challenge = allChallenges.find(c => c.id === id);
        return sum + (challenge ? challenge.points : 0);
      }, 0);
      
      const currentPoints = userData?.challengePoints || 0;
      
      // Update user data
      updateUserData({
        activeChallenges: updatedActive,
        completedChallenges: updatedCompleted,
        challengePoints: currentPoints + newPoints
      });
      
      setActiveChallenges(updatedActive);
      setCompletedChallenges(updatedCompleted);
      
      // Show challenge completed notification
      // In a real app, this would trigger a visual notification
      console.log('New challenges completed:', newlyCompleted);
    }
  };

  const handleAcceptChallenge = (challengeId) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedActive = [...activeChallenges, challengeId];
      
      // Update user data
      updateUserData({
        activeChallenges: updatedActive
      });
      
      setActiveChallenges(updatedActive);
      setIsLoading(false);
    }, 1000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return COLORS.success;
      case 'medium':
        return COLORS.warning;
      case 'hard':
        return COLORS.error;
      default:
        return COLORS.primary;
    }
  };

  const getFilteredChallenges = () => {
    if (selectedFilter === 'active') {
      return challenges.filter(challenge => 
        activeChallenges.includes(challenge.id) && 
        !completedChallenges.includes(challenge.id)
      );
    } else if (selectedFilter === 'available') {
      return challenges.filter(challenge => 
        !activeChallenges.includes(challenge.id) && 
        !completedChallenges.includes(challenge.id)
      );
    } else if (selectedFilter === 'completed') {
      return challenges.filter(challenge => 
        completedChallenges.includes(challenge.id)
      );
    }
    
    return challenges;
  };

  const renderChallengeItem = ({ item }) => {
    const isActive = activeChallenges.includes(item.id);
    const isCompleted = completedChallenges.includes(item.id);
    const isAvailable = !isActive && !isCompleted;
    
    return (
      <View style={styles.challengeItem}>
        <View style={styles.challengeHeader}>
          <View 
            style={[
              styles.challengeIconContainer,
              { backgroundColor: isCompleted ? COLORS.success : COLORS.primary }
            ]}
          >
            <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.white} />
          </View>
          
          <View style={styles.challengeTitleContainer}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <Text style={styles.challengeDescription}>{item.description}</Text>
          </View>
        </View>
        
        <View style={styles.challengeDetails}>
          <View style={styles.challengeDetailItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
          
          <View style={styles.challengeDetailItem}>
            <MaterialCommunityIcons name="star" size={16} color={COLORS.warning} />
            <Text style={styles.detailText}>{item.points} pts</Text>
          </View>
          
          <View style={styles.challengeDetailItem}>
            <View 
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(item.difficulty) }
              ]}
            >
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          </View>
        </View>
        
        {isActive && !isCompleted && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>In Progress</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: item.condition() ? '100%' : '30%' }
                ]}
              />
            </View>
          </View>
        )}
        
        {isCompleted && (
          <View style={styles.completedContainer}>
            <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.success} />
            <Text style={styles.completedText}>Challenge Completed</Text>
          </View>
        )}
        
        {isAvailable && (
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={() => handleAcceptChallenge(item.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.acceptButtonText}>Accept Challenge</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const calculateTotalPoints = () => {
    return completedChallenges.reduce((sum, id) => {
      const challenge = challenges.find(c => c.id === id);
      return sum + (challenge ? challenge.points : 0);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeChallenges.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedChallenges.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{calculateTotalPoints()}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'active' && styles.filterButtonSelected
          ]}
          onPress={() => setSelectedFilter('active')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedFilter === 'active' && styles.filterButtonTextSelected
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'available' && styles.filterButtonSelected
          ]}
          onPress={() => setSelectedFilter('available')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedFilter === 'available' && styles.filterButtonTextSelected
            ]}
          >
            Available
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'completed' && styles.filterButtonSelected
          ]}
          onPress={() => setSelectedFilter('completed')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedFilter === 'completed' && styles.filterButtonTextSelected
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={getFilteredChallenges()}
        renderItem={renderChallengeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.challengesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="trophy-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>No Challenges</Text>
            <Text style={styles.emptyDescription}>
              {selectedFilter === 'active' ? 
                'You have no active challenges. Accept some from the Available tab!' :
               selectedFilter === 'completed' ?
                'You haven\'t completed any challenges yet. Keep going!' :
                'No available challenges at the moment. Check back soon!'}
            </Text>
          </View>
        )}
      />
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xxs,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xxs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xxs,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  filterButtonSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  filterButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  filterButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  challengesList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  challengeItem: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  challengeHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  challengeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  challengeTitleContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  challengeDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  challengeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xxs,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  difficultyText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.white,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.successLight,
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  completedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.success,
    marginLeft: SPACING.xs,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  acceptButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ChallengesScreen;
