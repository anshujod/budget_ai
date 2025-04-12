import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';
import { ROUTES } from '../../constants/appConstants';

const GoalsScreen = ({ navigation }) => {
  const { goals, isLoading } = useFinancial();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterGoals = () => {
    if (selectedFilter === 'all') {
      return [...goals].sort((a, b) => {
        // Sort by completion (incomplete first), then by progress (highest first)
        if ((a.current >= a.target) !== (b.current >= b.target)) {
          return (a.current >= a.target) ? 1 : -1;
        }
        return b.progress - a.progress;
      });
    } else if (selectedFilter === 'completed') {
      return goals.filter(goal => goal.current >= goal.target)
        .sort((a, b) => new Date(b.targetDate) - new Date(a.targetDate));
    } else if (selectedFilter === 'in-progress') {
      return goals.filter(goal => goal.current < goal.target)
        .sort((a, b) => b.progress - a.progress);
    }
    return goals;
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };
  
  const getGoalIcon = (category) => {
    const icons = {
      emergency: 'shield-outline',
      vacation: 'airplane',
      home: 'home',
      car: 'car',
      education: 'school',
      retirement: 'beach',
      wedding: 'ring',
      other: 'star-outline',
    };
    
    return icons[category] || 'star-outline';
  };
  
  const getGoalColor = (category) => {
    const colors = {
      emergency: COLORS.error,
      vacation: COLORS.secondary,
      home: COLORS.categories.housing,
      car: COLORS.categories.transportation,
      education: COLORS.categories.education,
      retirement: COLORS.primary,
      wedding: COLORS.accent,
      other: COLORS.darkGray,
    };
    
    return colors[category] || COLORS.primary;
  };
  
  const calculateTimeLeft = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const timeLeft = target - today;
    
    if (timeLeft <= 0) {
      return 'Past due';
    }
    
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 365) {
      const years = Math.floor(daysLeft / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} left`;
    } else if (daysLeft > 30) {
      const months = Math.floor(daysLeft / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} left`;
    } else {
      return `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`;
    }
  };
  
  const renderGoalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.goalItem}
      onPress={() => navigation.navigate(ROUTES.GOAL_DETAILS, { goalId: item.id })}
    >
      <View style={styles.goalHeader}>
        <View 
          style={[
            styles.categoryIcon,
            { backgroundColor: getGoalColor(item.category) }
          ]}
        >
          <MaterialCommunityIcons name={getGoalIcon(item.category)} size={20} color={COLORS.white} />
        </View>
        
        <View style={styles.goalInfo}>
          <Text style={styles.goalName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.goalCategory}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        
        {item.current >= item.target && (
          <View style={styles.completedBadge}>
            <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.white} />
            <Text style={styles.completedText}>Done</Text>
          </View>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${Math.min(100, item.progress)}%`,
                backgroundColor: getGoalColor(item.category)
              }
            ]} 
          />
        </View>
        
        <View style={styles.progressDetails}>
          <Text style={styles.progressText}>{Math.round(item.progress)}%</Text>
          <Text style={styles.amountText}>
            {formatCurrency(item.current)} / {formatCurrency(item.target)}
          </Text>
        </View>
      </View>
      
      <View style={styles.goalFooter}>
        <Text style={styles.targetDateText}>
          Target: {new Date(item.targetDate).toLocaleDateString()}
        </Text>
        <Text style={styles.timeLeftText}>
          {calculateTimeLeft(item.targetDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="flag-outline" size={64} color={COLORS.lightGray} />
      <Text style={styles.emptyTitle}>No Savings Goals Yet</Text>
      <Text style={styles.emptyDescription}>
        Start planning for your future by creating your first savings goal.
      </Text>
      <TouchableOpacity 
        style={styles.addFirstGoalButton}
        onPress={() => navigation.navigate('GoalsStack', { screen: ROUTES.ADD_GOAL })}
      >
        <Text style={styles.addFirstGoalText}>Create Your First Goal</Text>
      </TouchableOpacity>
    </View>
  );
  
  const calculateTotalSavings = () => {
    return goals.reduce((sum, goal) => sum + goal.current, 0);
  };
  
  const calculateTotalGoals = () => {
    return goals.filter(goal => goal.current < goal.target).length;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Savings Goals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('GoalsStack', { screen: ROUTES.ADD_GOAL })}
        >
          <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {/* Top FIRE Assistant button removed */}
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonSelected
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedFilter === 'all' && styles.filterButtonTextSelected
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === 'in-progress' && styles.filterButtonSelected
          ]}
          onPress={() => setSelectedFilter('in-progress')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedFilter === 'in-progress' && styles.filterButtonTextSelected
            ]}
          >
            In Progress
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
      {/* Removed the floating "+" add goal button as per user request */}
      
      {goals.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Savings</Text>
            <Text style={styles.summaryValue}>${calculateTotalSavings().toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Active Goals</Text>
            <Text style={styles.summaryValue}>{calculateTotalGoals()}</Text>
          </View>
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading goals...</Text>
        </View>
        {/* Removed invalid comment */}
      ) : (
        <FlatList
          data={filterGoals()}
          renderItem={renderGoalItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* Ensure this closing parenthesis correctly ends the ternary operator */}
      {/* Cleaned up previous incorrect FAB placements and syntax errors */}
      {/* Add FIRE Assistant FAB correctly before closing root View */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.FIRE_QUESTIONNAIRE)}
      >
        <MaterialCommunityIcons name="fire" size={28} color="#fff" />
      </TouchableOpacity>
    </View> // This closes the main container View
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
  // Removed fireAssistantButton and fireAssistantButtonText styles
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xxs,
    ...SHADOWS.small,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  goalItem: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  goalCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
  },
  completedText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginLeft: SPACING.xxs,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  amountText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetDateText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  timeLeftText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
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
    marginBottom: SPACING.lg,
  },
  addFirstGoalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.medium,
  },
  addFirstGoalText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary, // Or a different color like orange for FIRE
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary, // Or a different color like orange for FIRE
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  // Remove FAB style if present
  // fab: {
  //   position: 'absolute',
  //   right: SPACING.lg,
  //   bottom: SPACING.xxl,
  //   width: 56,
  //   height: 56,
  //   borderRadius: 28,
  //   backgroundColor: COLORS.primary,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   ...SHADOWS.large,
  // },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary, // Or a different color like orange for FIRE
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary, // Or a different color like orange for FIRE
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
});

export default GoalsScreen;
