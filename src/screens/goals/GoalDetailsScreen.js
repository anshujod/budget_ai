import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';

const GoalDetailsScreen = ({ route, navigation }) => {
  const { goalId } = route.params;
  const { goals, updateGoal, deleteGoal } = useFinancial();
  const [isLoading, setIsLoading] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  
  // Find the goal by ID
  const goal = goals.find(g => g.id === goalId);
  
  if (!goal) {
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
          <Text style={styles.headerTitle}>Goal Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Goal not found</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteGoal(goalId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete goal');
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };
  
  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    
    const newCurrent = goal.current + amount;
    const newProgress = (newCurrent / goal.target) * 100;
    
    updateGoal(goalId, {
      current: newCurrent,
      progress: newProgress,
    })
      .then(() => {
        setIsContributing(false);
        setContributionAmount('');
        
        if (newCurrent >= goal.target) {
          Alert.alert(
            'Congratulations!',
            'You have reached your savings goal!',
            [{ text: 'Awesome!' }]
          );
        } else {
          Alert.alert('Success', 'Contribution added successfully');
        }
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to add contribution');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
  
  const calculateTimeLeft = () => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const timeLeft = targetDate - today;
    
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
  
  const calculateRequiredSavings = () => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const timeLeft = targetDate - today;
    
    if (timeLeft <= 0 || goal.current >= goal.target) {
      return null;
    }
    
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    const amountLeft = goal.target - goal.current;
    
    if (daysLeft > 365) {
      const years = Math.floor(daysLeft / 365);
      const perYear = amountLeft / years;
      return {
        period: 'year',
        amount: perYear,
        text: `$${perYear.toFixed(2)} per year`
      };
    } else if (daysLeft > 30) {
      const months = Math.floor(daysLeft / 30);
      const perMonth = amountLeft / months;
      return {
        period: 'month',
        amount: perMonth,
        text: `$${perMonth.toFixed(2)} per month`
      };
    } else {
      const perDay = amountLeft / daysLeft;
      return {
        period: 'day',
        amount: perDay,
        text: `$${perDay.toFixed(2)} per day`
      };
    }
  };
  
  const requiredSavings = calculateRequiredSavings();

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
        <Text style={styles.headerTitle}>Goal Details</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.goalHeaderContainer}>
          <View 
            style={[
              styles.goalIconContainer,
              { backgroundColor: getGoalColor(goal.category) }
            ]}
          >
            <MaterialCommunityIcons name={getGoalIcon(goal.category)} size={32} color={COLORS.white} />
          </View>
          <Text style={styles.goalName}>{goal.name}</Text>
          <Text style={styles.goalCategory}>
            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{Math.min(100, Math.round(goal.progress))}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${Math.min(100, goal.progress)}%`,
                  backgroundColor: getGoalColor(goal.category)
                }
              ]} 
            />
          </View>
          
          <View style={styles.amountsContainer}>
            <Text style={styles.currentAmount}>{formatCurrency(goal.current)}</Text>
            <Text style={styles.targetAmount}>of {formatCurrency(goal.target)}</Text>
          </View>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MaterialCommunityIcons name="calendar" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Target Date</Text>
              <Text style={styles.detailValue}>{formatDate(goal.targetDate)}</Text>
              <Text style={styles.detailSubtext}>{calculateTimeLeft()}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {requiredSavings && (
            <>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name="chart-line" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Required Savings</Text>
                  <Text style={styles.detailValue}>{requiredSavings.text}</Text>
                  <Text style={styles.detailSubtext}>to reach your goal on time</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
            </>
          )}
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MaterialCommunityIcons name="cash-multiple" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Amount Left</Text>
              <Text style={styles.detailValue}>{formatCurrency(Math.max(0, goal.target - goal.current))}</Text>
              {goal.current >= goal.target ? (
                <Text style={[styles.detailSubtext, styles.goalCompletedText]}>Goal completed! 🎉</Text>
              ) : (
                <Text style={styles.detailSubtext}>{formatCurrency(goal.target - goal.current)} more to go</Text>
              )}
            </View>
          </View>
        </View>
        
        {isContributing ? (
          <View style={styles.contributionCard}>
            <Text style={styles.contributionTitle}>Add Contribution</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={contributionAmount}
                onChangeText={setContributionAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
            
            <View style={styles.contributionActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setIsContributing(false);
                  setContributionAmount('');
                }}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleContribute}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.contributeButton}
              onPress={() => setIsContributing(true)}
              disabled={goal.current >= goal.target}
            >
              <MaterialCommunityIcons name="cash-plus" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Add Money</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditGoal', { goalId })}
            >
              <MaterialCommunityIcons name="pencil" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Saving Tips</Text>
          
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color={COLORS.primary} style={styles.tipIcon} />
            <View style={styles.tipContent}>
              <Text style={styles.tipText}>
                Set up automatic transfers to your savings account to stay consistent with your goal.
              </Text>
            </View>
          </View>
          
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="chart-line" size={24} color={COLORS.primary} style={styles.tipIcon} />
            <View style={styles.tipContent}>
              <Text style={styles.tipText}>
                Track your progress regularly and celebrate small milestones to stay motivated.
              </Text>
            </View>
          </View>
          
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="cash-lock" size={24} color={COLORS.primary} style={styles.tipIcon} />
            <View style={styles.tipContent}>
              <Text style={styles.tipText}>
                Consider using a separate savings account for this goal to avoid spending the funds.
              </Text>
            </View>
          </View>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  goalHeaderContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  goalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  goalName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  goalCategory: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    ...SHADOWS.medium,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  progressPercentage: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentAmount: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  targetAmount: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  detailsCard: {
    margin: SPACING.lg,
    marginTop: 0,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxs,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  detailSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  goalCompletedText: {
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.xs,
  },
  contributionCard: {
    margin: SPACING.lg,
    marginTop: 0,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  contributionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  amountInput: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    minWidth: 150,
    textAlign: 'center',
  },
  contributionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    ...SHADOWS.small,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: SPACING.lg,
    marginTop: 0,
  },
  contributeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    marginRight: SPACING.xs,
    ...SHADOWS.medium,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.medium,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.xs,
    ...SHADOWS.medium,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginLeft: SPACING.xs,
  },
  tipsContainer: {
    margin: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  tipsTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  tipIcon: {
    marginRight: SPACING.md,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
});

export default GoalDetailsScreen;
