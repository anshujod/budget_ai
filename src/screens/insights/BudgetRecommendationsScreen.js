import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';

const BudgetRecommendationsScreen = ({ navigation }) => {
  const { expenses, budgets } = useFinancial();
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [idealBudget, setIdealBudget] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);

  useEffect(() => {
    // Simulate AI analysis loading
    setIsLoading(true);
    
    // Simulate delay for AI processing
    const timer = setTimeout(() => {
      generateRecommendations();
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [expenses, budgets, selectedTimeframe]);

  const generateRecommendations = () => {
    // Filter expenses by selected timeframe
    const filteredExpenses = filterExpensesByTimeframe(expenses, selectedTimeframe);
    
    // Calculate total spending
    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);
    
    // Calculate spending by category
    const spendingByCategory = {};
    filteredExpenses.forEach(expense => {
      if (!spendingByCategory[expense.category]) {
        spendingByCategory[expense.category] = 0;
      }
      spendingByCategory[expense.category] += Math.abs(expense.amount);
    });
    
    // Estimate monthly income (in a real app, this would come from user data)
    const estimatedMonthlyIncome = totalSpent * 1.2; // Assume spending is about 80% of income
    
    // Generate ideal budget based on 50/30/20 rule
    const needs = estimatedMonthlyIncome * 0.5;
    const wants = estimatedMonthlyIncome * 0.3;
    const savings = estimatedMonthlyIncome * 0.2;
    
    // Categorize spending into needs, wants, and savings
    const needsCategories = ['housing', 'utilities', 'food', 'transportation', 'healthcare'];
    const wantsCategories = ['entertainment', 'personal', 'shopping'];
    const savingsCategories = ['savings', 'debt'];
    
    let currentNeeds = 0;
    let currentWants = 0;
    let currentSavings = 0;
    
    Object.keys(spendingByCategory).forEach(category => {
      if (needsCategories.includes(category)) {
        currentNeeds += spendingByCategory[category];
      } else if (wantsCategories.includes(category)) {
        currentWants += spendingByCategory[category];
      } else if (savingsCategories.includes(category)) {
        currentSavings += spendingByCategory[category];
      }
    });
    
    // Set current and ideal budget for display
    setCurrentBudget({
      needs: currentNeeds,
      wants: currentWants,
      savings: currentSavings,
      total: currentNeeds + currentWants + currentSavings
    });
    
    setIdealBudget({
      needs,
      wants,
      savings,
      total: estimatedMonthlyIncome
    });
    
    // Generate specific recommendations
    const newRecommendations = [];
    
    // Check if needs spending is too high
    if (currentNeeds > needs * 1.1) {
      newRecommendations.push({
        id: 'reduce-needs',
        title: 'Reduce Essential Expenses',
        description: 'Your spending on necessities is higher than recommended. Look for ways to reduce costs in housing, utilities, or groceries.',
        icon: 'home-outline',
        actions: [
          'Consider a roommate to split housing costs',
          'Review utility usage and find ways to conserve',
          'Buy groceries in bulk and meal plan to reduce food costs',
          'Shop around for better insurance rates'
        ]
      });
    }
    
    // Check if wants spending is too high
    if (currentWants > wants * 1.1) {
      newRecommendations.push({
        id: 'reduce-wants',
        title: 'Cut Back on Discretionary Spending',
        description: 'Your discretionary spending is higher than recommended. Consider reducing entertainment or shopping expenses.',
        icon: 'cart-outline',
        actions: [
          'Cancel unused subscriptions',
          'Limit dining out to once per week',
          'Wait 24 hours before making non-essential purchases',
          'Look for free or low-cost entertainment options'
        ]
      });
    }
    
    // Check if savings is too low
    if (currentSavings < savings * 0.9) {
      newRecommendations.push({
        id: 'increase-savings',
        title: 'Increase Your Savings Rate',
        description: 'You\'re saving less than recommended. Try to allocate at least 20% of your income to savings and debt repayment.',
        icon: 'piggy-bank-outline',
        actions: [
          'Set up automatic transfers to savings on payday',
          'Increase retirement contributions by 1%',
          'Use windfalls (tax refunds, bonuses) for debt repayment',
          'Consider a side hustle to boost income for savings'
        ]
      });
    }
    
    // Check for overspending in specific categories
    Object.keys(spendingByCategory).forEach(category => {
      const budget = budgets.find(b => b.category === category);
      if (budget && spendingByCategory[category] > budget.allocated * 1.1) {
        newRecommendations.push({
          id: `budget-${category}`,
          title: `Optimize ${category.charAt(0).toUpperCase() + category.slice(1)} Spending`,
          description: `Your ${category} spending consistently exceeds your budget. Here are ways to reduce these expenses.`,
          icon: getCategoryIcon(category),
          actions: generateCategorySpecificTips(category)
        });
      }
    });
    
    // Add general recommendations if we don't have many specific ones
    if (newRecommendations.length < 3) {
      newRecommendations.push({
        id: 'emergency-fund',
        title: 'Build an Emergency Fund',
        description: 'Financial security starts with having 3-6 months of expenses saved for emergencies.',
        icon: 'shield-outline',
        actions: [
          'Start with a goal of $1,000 in emergency savings',
          'Keep emergency funds in a high-yield savings account',
          'Only use for true emergencies (job loss, medical, urgent repairs)',
          'Replenish the fund as soon as possible after using it'
        ]
      });
      
      newRecommendations.push({
        id: 'debt-reduction',
        title: 'Accelerate Debt Repayment',
        description: 'Paying off high-interest debt should be a priority in your financial plan.',
        icon: 'credit-card-outline',
        actions: [
          'Focus on highest interest debt first (debt avalanche method)',
          'Consider balance transfers to lower interest rates',
          'Make more than minimum payments whenever possible',
          'Use windfalls to make extra debt payments'
        ]
      });
    }
    
    setRecommendations(newRecommendations);
  };

  const generateCategorySpecificTips = (category) => {
    const tips = {
      housing: [
        'Negotiate rent at renewal time',
        'Consider a roommate to split costs',
        'Refinance mortgage if rates have dropped',
        'Downsize to a smaller living space'
      ],
      food: [
        'Meal plan and prepare food at home',
        'Use grocery store loyalty programs',
        'Buy staples in bulk when on sale',
        'Limit dining out to special occasions'
      ],
      transportation: [
        'Use public transportation when possible',
        'Consider carpooling to work',
        'Combine errands to save on fuel',
        'Shop around for better insurance rates'
      ],
      utilities: [
        'Adjust thermostat by a few degrees',
        'Unplug electronics when not in use',
        'Switch to LED light bulbs',
        'Check for and fix water leaks'
      ],
      entertainment: [
        'Look for free community events',
        'Use library services for books and media',
        'Share streaming subscriptions with family',
        'Take advantage of happy hours and discounts'
      ],
      shopping: [
        'Create a shopping list and stick to it',
        'Wait 24 hours before making non-essential purchases',
        'Look for second-hand options',
        'Use cashback apps and credit cards'
      ],
      personal: [
        'Look for discounts on personal care services',
        'DIY when possible (haircuts, manicures)',
        'Buy store brand personal care products',
        'Take advantage of loyalty programs'
      ],
      healthcare: [
        'Stay in-network for medical care',
        'Use generic medications when available',
        'Take advantage of preventive care benefits',
        'Consider a health savings account (HSA)'
      ]
    };
    
    return tips[category] || [
      'Review your spending in this category',
      'Look for unnecessary expenses to cut',
      'Shop around for better prices',
      'Consider if you can reduce frequency of purchases'
    ];
  };

  const filterExpensesByTimeframe = (expenses, timeframe) => {
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= now;
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: 'food',
      transportation: 'car',
      entertainment: 'movie',
      housing: 'home',
      utilities: 'flash',
      healthcare: 'medical-bag',
      personal: 'account',
      education: 'school',
      savings: 'piggy-bank',
      shopping: 'shopping',
      debt: 'credit-card',
      other: 'dots-horizontal',
    };
    
    return icons[category] || 'cash';
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (amount, total) => {
    if (total === 0) return '0%';
    return `${((amount / total) * 100).toFixed(1)}%`;
  };

  const renderBudgetComparisonSection = () => {
    if (!currentBudget || !idealBudget) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Analysis</Text>
        
        <View style={styles.budgetComparisonCard}>
          <Text style={styles.budgetComparisonTitle}>Current vs. Recommended</Text>
          
          <View style={styles.budgetCategoryRow}>
            <Text style={styles.budgetCategoryLabel}>Category</Text>
            <Text style={styles.budgetCurrentLabel}>Current</Text>
            <Text style={styles.budgetIdealLabel}>Ideal (50/30/20)</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.budgetCategoryRow}>
            <Text style={styles.budgetCategoryName}>Needs</Text>
            <View style={styles.budgetValueContainer}>
              <Text style={styles.budgetValue}>{formatCurrency(currentBudget.needs)}</Text>
              <Text style={styles.budgetPercentage}>
                {formatPercentage(currentBudget.needs, currentBudget.total)}
              </Text>
            </View>
            <View style={styles.budgetValueContainer}>
              <Text style={styles.budgetValue}>{formatCurrency(idealBudget.needs)}</Text>
              <Text style={styles.budgetPercentage}>50%</Text>
            </View>
          </View>
          
          <View style={styles.budgetCategoryRow}>
            <Text style={styles.budgetCategoryName}>Wants</Text>
            <View style={styles.budgetValueContainer}>
              <Text style={styles.budgetValue}>{formatCurrency(currentBudget.wants)}</Text>
              <Text style={styles.budgetPercentage}>
                {formatPercentage(currentBudget.wants, currentBudget.total)}
              </Text>
            </View>
            <View style={styles.budgetValueContainer}>
              <Text style={styles.budgetValue}>{formatCurrency(idealBudget.wants)}</Text>
              <Text style={styles.budgetPercentage}>30%</Text>
            </View>
          </View>
          
          <View style={styles.budgetCategoryRow}>
            <Text style={styles.budgetCategoryName}>Savings</Text>
            <View style={styles.budgetValueContainer}>
              <Text style={styles.budgetValue}>{formatCurrency(currentBudget.savings)}</Text>
              <Text style={styles.budgetPercentage}>
                {formatPercentage(currentBudget.savings, currentBudget.total)}
              </Text>
            </View>
            <View style={styles.budgetValueContainer}>
              <Text style={styles.budgetValue}>{formatCurrency(idealBudget.savings)}</Text>
              <Text style={styles.budgetPercentage}>20%</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.budgetCategoryRow}>
            <Text style={styles.budgetCategoryTotal}>Total</Text>
            <Text style={styles.budgetValueTotal}>{formatCurrency(currentBudget.total)}</Text>
            <Text style={styles.budgetValueTotal}>{formatCurrency(idealBudget.total)}</Text>
          </View>
          
          <Text style={styles.budgetNote}>
            The 50/30/20 rule suggests allocating 50% of your income to needs, 30% to wants, and 20% to savings.
          </Text>
        </View>
      </View>
    );
  };

  const renderRecommendationsSection = () => {
    if (recommendations.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        
        {recommendations.map(recommendation => (
          <View key={recommendation.id} style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <View style={styles.recommendationIconContainer}>
                <MaterialCommunityIcons name={recommendation.icon} size={24} color={COLORS.primary} />
              </View>
              
              <View style={styles.recommendationTitleContainer}>
                <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
              </View>
            </View>
            
            <View style={styles.actionsList}>
              {recommendation.actions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <MaterialCommunityIcons name="check-circle-outline" size={20} color={COLORS.success} style={styles.actionIcon} />
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
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
        <Text style={styles.headerTitle}>Budget Recommendations</Text>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.timeframeContainer}>
        <TouchableOpacity 
          style={[
            styles.timeframeButton,
            selectedTimeframe === 'week' && styles.timeframeButtonSelected
          ]}
          onPress={() => setSelectedTimeframe('week')}
        >
          <Text 
            style={[
              styles.timeframeButtonText,
              selectedTimeframe === 'week' && styles.timeframeButtonTextSelected
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.timeframeButton,
            selectedTimeframe === 'month' && styles.timeframeButtonSelected
          ]}
          onPress={() => setSelectedTimeframe('month')}
        >
          <Text 
            style={[
              styles.timeframeButtonText,
              selectedTimeframe === 'month' && styles.timeframeButtonTextSelected
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.timeframeButton,
            selectedTimeframe === 'year' && styles.timeframeButtonSelected
          ]}
          onPress={() => setSelectedTimeframe('year')}
        >
          <Text 
            style={[
              styles.timeframeButtonText,
              selectedTimeframe === 'year' && styles.timeframeButtonTextSelected
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Analyzing your spending patterns...</Text>
          <Text style={styles.aiText}>Generating personalized budget recommendations</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentBudget && currentBudget.total > 0 ? (
            <>
              {renderBudgetComparisonSection()}
              {renderRecommendationsSection()}
              
              <View style={styles.aiPoweredContainer}>
                <MaterialCommunityIcons name="robot" size={20} color={COLORS.primary} />
                <Text style={styles.aiPoweredText}>
                  Powered by BudgetAI's intelligent analysis
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="chart-line" size={64} color={COLORS.lightGray} />
              <Text style={styles.emptyTitle}>No Data to Analyze</Text>
              <Text style={styles.emptyDescription}>
                Start tracking your expenses to receive personalized budget recommendations.
              </Text>
              <TouchableOpacity 
                style={styles.addExpenseButton}
                onPress={() => navigation.navigate('AddExpense')}
              >
                <Text style={styles.addExpenseText}>Add Your First Expense</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
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
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  timeframeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xxs,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  timeframeButtonSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  timeframeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  timeframeButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  aiText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
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
  budgetComparisonCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  budgetComparisonTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  budgetCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  budgetCategoryLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  budgetCurrentLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  budgetIdealLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.xs,
  },
  budgetCategoryName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  budgetValueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  budgetValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  budgetPercentage: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  budgetCategoryTotal: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  budgetValueTotal: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  budgetNote: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  recommendationHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  recommendationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  recommendationTitleContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  recommendationDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  actionsList: {
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.sm,
    padding: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionIcon: {
    marginRight: SPACING.sm,
  },
  actionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  aiPoweredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
    marginTop: SPACING.lg,
  },
  aiPoweredText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontStyle: 'italic',
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
  addExpenseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.medium,
  },
  addExpenseText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
});

export default BudgetRecommendationsScreen;
