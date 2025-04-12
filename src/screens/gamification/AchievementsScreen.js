import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';
import { useAuth } from '../../context/AuthContext';

const AchievementsScreen = ({ navigation }) => {
  const { expenses, budgets, goals } = useFinancial();
  const { userData, updateUserData } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Initialize achievements
    const allAchievements = generateAchievements();
    setAchievements(allAchievements);
    
    // Get user's unlocked achievements
    const userUnlocked = userData?.achievements || [];
    setUserAchievements(userUnlocked);
    
    // Check for newly unlocked achievements
    checkForNewAchievements(allAchievements, userUnlocked);
  }, [expenses, budgets, goals]);

  const generateAchievements = () => {
    return [
      // Expense tracking achievements
      {
        id: 'first-expense',
        title: 'First Steps',
        description: 'Track your first expense',
        icon: 'cash-register',
        category: 'tracking',
        points: 10,
        condition: () => expenses.length > 0,
      },
      {
        id: 'expense-streak-7',
        title: 'Consistency is Key',
        description: 'Track expenses for 7 consecutive days',
        icon: 'calendar-check',
        category: 'tracking',
        points: 25,
        condition: () => checkExpenseStreak(7),
      },
      {
        id: 'expense-streak-30',
        title: 'Habit Formed',
        description: 'Track expenses for 30 consecutive days',
        icon: 'calendar-star',
        category: 'tracking',
        points: 100,
        condition: () => checkExpenseStreak(30),
      },
      {
        id: 'all-categories',
        title: 'Category Master',
        description: 'Track expenses in at least 8 different categories',
        icon: 'tag-multiple',
        category: 'tracking',
        points: 50,
        condition: () => {
          const categories = new Set(expenses.map(exp => exp.category));
          return categories.size >= 8;
        },
      },
      
      // Budget achievements
      {
        id: 'first-budget',
        title: 'Budget Beginner',
        description: 'Create your first budget',
        icon: 'calculator',
        category: 'budgeting',
        points: 15,
        condition: () => budgets.length > 0,
      },
      {
        id: 'budget-master',
        title: 'Budget Master',
        description: 'Stay under budget in all categories for a month',
        icon: 'trophy',
        category: 'budgeting',
        points: 75,
        condition: () => {
          if (budgets.length === 0) return false;
          return budgets.every(budget => budget.spent <= budget.allocated);
        },
      },
      {
        id: 'budget-complete',
        title: 'Full Coverage',
        description: 'Create budgets for at least 10 categories',
        icon: 'view-grid',
        category: 'budgeting',
        points: 50,
        condition: () => budgets.length >= 10,
      },
      
      // Savings achievements
      {
        id: 'first-goal',
        title: 'Goal Setter',
        description: 'Create your first savings goal',
        icon: 'flag',
        category: 'savings',
        points: 15,
        condition: () => goals.length > 0,
      },
      {
        id: 'goal-milestone',
        title: 'Milestone Reached',
        description: 'Reach 50% of any savings goal',
        icon: 'flag-checkered',
        category: 'savings',
        points: 30,
        condition: () => goals.some(goal => goal.progress >= 50),
      },
      {
        id: 'goal-complete',
        title: 'Mission Accomplished',
        description: 'Complete any savings goal',
        icon: 'star-circle',
        category: 'savings',
        points: 100,
        condition: () => goals.some(goal => goal.progress >= 100),
      },
      {
        id: 'multiple-goals',
        title: 'Ambitious Saver',
        description: 'Have 3 active savings goals at once',
        icon: 'flag-plus',
        category: 'savings',
        points: 40,
        condition: () => {
          const activeGoals = goals.filter(goal => goal.progress < 100);
          return activeGoals.length >= 3;
        },
      },
      
      // Insights achievements
      {
        id: 'first-insight',
        title: 'Insight Seeker',
        description: 'View your first AI-powered insight',
        icon: 'lightbulb-on',
        category: 'insights',
        points: 20,
        condition: () => userData?.insightsViewed > 0,
      },
      {
        id: 'insight-action',
        title: 'Action Taker',
        description: 'Complete an action from an insight recommendation',
        icon: 'check-circle',
        category: 'insights',
        points: 35,
        condition: () => userData?.insightActionsCompleted > 0,
      },
      {
        id: 'financial-health',
        title: 'Health Conscious',
        description: 'Improve your financial health score by 10 points',
        icon: 'heart-pulse',
        category: 'insights',
        points: 60,
        condition: () => {
          const previousScore = userData?.previousHealthScore || 0;
          const currentScore = userData?.currentHealthScore || 0;
          return (currentScore - previousScore) >= 10;
        },
      },
      
      // Special achievements
      {
        id: 'emergency-fund',
        title: 'Safety Net',
        description: 'Save 3 months of expenses in an emergency fund',
        icon: 'shield-check',
        category: 'special',
        points: 150,
        condition: () => {
          const emergencyGoal = goals.find(goal => 
            goal.category === 'emergency' && 
            goal.name.toLowerCase().includes('emergency')
          );
          return emergencyGoal && emergencyGoal.progress >= 100;
        },
      },
      {
        id: 'debt-free',
        title: 'Debt Free',
        description: 'Pay off all your tracked debt',
        icon: 'cash-lock',
        category: 'special',
        points: 200,
        condition: () => userData?.debtFree === true,
      },
      {
        id: 'savings-rate',
        title: 'Super Saver',
        description: 'Maintain a 20%+ savings rate for 3 months',
        icon: 'rocket',
        category: 'special',
        points: 100,
        condition: () => userData?.highSavingsStreak >= 3,
      },
    ];
  };

  const checkExpenseStreak = (days) => {
    // In a real app, this would check for consecutive days with expense entries
    // For this simulation, we'll use a simplified check
    if (expenses.length < days) return false;
    
    // Check if user has a streak property in userData
    return userData?.expenseStreak >= days;
  };

  const checkForNewAchievements = (allAchievements, unlockedAchievements) => {
    const newlyUnlocked = [];
    
    allAchievements.forEach(achievement => {
      // Skip if already unlocked
      if (unlockedAchievements.includes(achievement.id)) return;
      
      // Check if condition is met
      if (achievement.condition()) {
        newlyUnlocked.push(achievement.id);
      }
    });
    
    // If new achievements were unlocked, update user data
    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [...unlockedAchievements, ...newlyUnlocked];
      
      // Calculate points
      const newPoints = newlyUnlocked.reduce((sum, id) => {
        const achievement = allAchievements.find(a => a.id === id);
        return sum + (achievement ? achievement.points : 0);
      }, 0);
      
      const currentPoints = userData?.achievementPoints || 0;
      
      // Update user data
      updateUserData({
        achievements: updatedAchievements,
        achievementPoints: currentPoints + newPoints
      });
      
      setUserAchievements(updatedAchievements);
      
      // Show achievement unlocked notification
      // In a real app, this would trigger a visual notification
      console.log('New achievements unlocked:', newlyUnlocked);
    }
  };

  const calculateProgress = () => {
    const total = achievements.length;
    const unlocked = userAchievements.length;
    const percentage = total > 0 ? (unlocked / total) * 100 : 0;
    
    return {
      total,
      unlocked,
      percentage
    };
  };

  const calculateTotalPoints = () => {
    return userAchievements.reduce((sum, id) => {
      const achievement = achievements.find(a => a.id === id);
      return sum + (achievement ? achievement.points : 0);
    }, 0);
  };

  const getAchievementsByCategory = () => {
    if (selectedCategory === 'all') {
      return achievements;
    }
    
    return achievements.filter(achievement => achievement.category === selectedCategory);
  };

  const renderAchievementItem = ({ item }) => {
    const isUnlocked = userAchievements.includes(item.id);
    
    return (
      <View 
        style={[
          styles.achievementItem,
          isUnlocked ? styles.achievementUnlocked : styles.achievementLocked
        ]}
      >
        <View 
          style={[
            styles.achievementIconContainer,
            isUnlocked ? styles.iconContainerUnlocked : styles.iconContainerLocked
          ]}
        >
          <MaterialCommunityIcons 
            name={item.icon} 
            size={24} 
            color={isUnlocked ? COLORS.white : COLORS.lightGray} 
          />
        </View>
        
        <View style={styles.achievementContent}>
          <Text 
            style={[
              styles.achievementTitle,
              isUnlocked ? styles.textUnlocked : styles.textLocked
            ]}
          >
            {item.title}
          </Text>
          <Text 
            style={[
              styles.achievementDescription,
              isUnlocked ? styles.descriptionUnlocked : styles.descriptionLocked
            ]}
          >
            {item.description}
          </Text>
          
          <View style={styles.achievementFooter}>
            <View style={styles.pointsContainer}>
              <MaterialCommunityIcons 
                name="star" 
                size={14} 
                color={isUnlocked ? COLORS.warning : COLORS.lightGray} 
              />
              <Text 
                style={[
                  styles.pointsText,
                  isUnlocked ? styles.pointsUnlocked : styles.pointsLocked
                ]}
              >
                {item.points} pts
              </Text>
            </View>
            
            {isUnlocked && (
              <View style={styles.unlockedBadge}>
                <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.success} />
                <Text style={styles.unlockedText}>Unlocked</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const progress = calculateProgress();
  const totalPoints = calculateTotalPoints();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressPoints}>{totalPoints} Points</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${progress.percentage}%` }
                ]}
              />
            </View>
            
            <Text style={styles.progressText}>
              {progress.unlocked} of {progress.total} achievements unlocked ({Math.round(progress.percentage)}%)
            </Text>
          </View>
        </View>
        
        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Your Financial Level</Text>
          
          <View style={styles.levelCard}>
            <View style={styles.levelIconContainer}>
              {totalPoints >= 500 ? (
                <MaterialCommunityIcons name="trophy" size={48} color={COLORS.warning} />
              ) : totalPoints >= 300 ? (
                <MaterialCommunityIcons name="medal" size={48} color={COLORS.secondary} />
              ) : totalPoints >= 100 ? (
                <MaterialCommunityIcons name="star-circle" size={48} color={COLORS.primary} />
              ) : (
                <MaterialCommunityIcons name="star-outline" size={48} color={COLORS.primary} />
              )}
            </View>
            
            <Text style={styles.levelName}>
              {totalPoints >= 500 ? 'Financial Expert' : 
               totalPoints >= 300 ? 'Money Manager' :
               totalPoints >= 100 ? 'Budget Builder' : 'Financial Beginner'}
            </Text>
            
            {totalPoints < 500 && (
              <View style={styles.nextLevelContainer}>
                <Text style={styles.nextLevelText}>
                  {totalPoints >= 300 ? 
                    `${500 - totalPoints} points to Financial Expert` :
                   totalPoints >= 100 ?
                    `${300 - totalPoints} points to Money Manager` :
                    `${100 - totalPoints} points to Budget Builder`}
                </Text>
                <View style={styles.nextLevelBarContainer}>
                  <View 
                    style={[
                      styles.nextLevelBar,
                      { 
                        width: `${totalPoints >= 300 ? 
                          ((totalPoints - 300) / (500 - 300)) * 100 :
                          totalPoints >= 100 ?
                          ((totalPoints - 100) / (300 - 100)) * 100 :
                          (totalPoints / 100) * 100}%` 
                      }
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesContainer}>
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === 'all' && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'all' && styles.categoryButtonTextSelected
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === 'tracking' && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory('tracking')}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'tracking' && styles.categoryButtonTextSelected
                ]}
              >
                Tracking
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === 'budgeting' && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory('budgeting')}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'budgeting' && styles.categoryButtonTextSelected
                ]}
              >
                Budgeting
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === 'savings' && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory('savings')}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'savings' && styles.categoryButtonTextSelected
                ]}
              >
                Savings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === 'special' && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory('special')}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'special' && styles.categoryButtonTextSelected
                ]}
              >
                Special
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.achievementsSection}>
          <FlatList
            data={getAchievementsByCategory()}
            renderItem={renderAchievementItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
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
  progressSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  progressPoints: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  levelSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  levelTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  levelCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  levelIconContainer: {
    marginBottom: SPACING.sm,
  },
  levelName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  nextLevelContainer: {
    width: '100%',
  },
  nextLevelText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  nextLevelBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  nextLevelBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  categoriesSection: {
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  categoryButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.xs,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  categoryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  categoryButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  achievementsSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  achievementUnlocked: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  achievementLocked: {
    opacity: 0.7,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconContainerUnlocked: {
    backgroundColor: COLORS.primary,
  },
  iconContainerLocked: {
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xxs,
  },
  textUnlocked: {
    color: COLORS.textPrimary,
  },
  textLocked: {
    color: COLORS.textSecondary,
  },
  achievementDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.sm,
  },
  descriptionUnlocked: {
    color: COLORS.textSecondary,
  },
  descriptionLocked: {
    color: COLORS.textTertiary,
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginLeft: SPACING.xxs,
  },
  pointsUnlocked: {
    color: COLORS.warning,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  pointsLocked: {
    color: COLORS.textTertiary,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
  },
  unlockedText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xxs,
  },
});

export default AchievementsScreen;
