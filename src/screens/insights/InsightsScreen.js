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
import { useAuth } from '../../context/AuthContext';

const InsightsScreen = ({ navigation }) => {
  const { expenses, budgets, goals } = useFinancial();
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [spendingPatterns, setSpendingPatterns] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  useEffect(() => {
    // Simulate AI analysis loading
    setIsLoading(true);
    
    // Simulate delay for AI processing
    const timer = setTimeout(() => {
      generateInsights();
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [expenses, budgets, goals, selectedTimeframe]);

  const generateInsights = () => {
    // Generate spending patterns analysis
    const patterns = analyzeSpendingPatterns();
    setSpendingPatterns(patterns);
    
    // Generate insights based on financial data
    const newInsights = [];
    
    // Check for overspending categories
    const overspentCategories = budgets.filter(budget => budget.spent > budget.allocated);
    if (overspentCategories.length > 0) {
      overspentCategories.forEach(category => {
        newInsights.push({
          id: `overspent-${category.category}`,
          type: 'warning',
          title: `Overspending in ${category.category.charAt(0).toUpperCase() + category.category.slice(1)}`,
          description: `You've spent ${((category.spent / category.allocated) * 100).toFixed(0)}% of your ${category.category} budget.`,
          icon: 'alert-circle',
          action: 'View Budget',
          screen: 'BudgetScreen'
        });
      });
    }
    
    // Check for unusual spending
    if (patterns.unusualSpending.length > 0) {
      patterns.unusualSpending.forEach(item => {
        newInsights.push({
          id: `unusual-${item.category}`,
          type: 'info',
          title: `Unusual Spending Detected`,
          description: `Your spending in ${item.category} is ${item.percentChange > 0 ? 'up' : 'down'} ${Math.abs(item.percentChange).toFixed(0)}% compared to your average.`,
          icon: 'trending-up',
          action: 'View Expenses',
          screen: 'ExpensesScreen'
        });
      });
    }
    
    // Check for savings goals progress
    const activeGoals = goals.filter(goal => goal.current < goal.target);
    if (activeGoals.length > 0) {
      const slowGoals = activeGoals.filter(goal => {
        const targetDate = new Date(goal.targetDate);
        const today = new Date();
        const totalDays = (targetDate - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
        const daysElapsed = (today - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
        const expectedProgress = (daysElapsed / totalDays) * 100;
        return goal.progress < expectedProgress * 0.7; // If progress is less than 70% of expected
      });
      
      if (slowGoals.length > 0) {
        slowGoals.forEach(goal => {
          newInsights.push({
            id: `goal-${goal.id}`,
            type: 'warning',
            title: `Goal Progress Falling Behind`,
            description: `Your "${goal.name}" goal is progressing slower than needed to reach your target date.`,
            icon: 'flag',
            action: 'View Goal',
            screen: 'GoalDetails',
            params: { goalId: goal.id }
          });
        });
      }
    }
    
    // Check for recurring expenses
    if (patterns.recurringExpenses.length > 0) {
      newInsights.push({
        id: 'recurring-expenses',
        type: 'info',
        title: 'Recurring Expenses Identified',
        description: `We've identified ${patterns.recurringExpenses.length} recurring expenses that make up ${patterns.recurringPercentage.toFixed(0)}% of your spending.`,
        icon: 'repeat',
        action: 'View Details',
        screen: 'ExpensesScreen'
      });
    }
    
    // Check for savings opportunities
    if (patterns.savingsOpportunities.length > 0) {
      patterns.savingsOpportunities.forEach(opportunity => {
        newInsights.push({
          id: `saving-${opportunity.category}`,
          type: 'success',
          title: 'Savings Opportunity',
          description: opportunity.description,
          icon: 'piggy-bank',
          action: 'Learn More',
          screen: 'BudgetScreen'
        });
      });
    }
    
    // Generate budget recommendations
    const newRecommendations = generateBudgetRecommendations(patterns);
    
    setInsights(newInsights);
    setRecommendations(newRecommendations);
  };

  const analyzeSpendingPatterns = () => {
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
    
    // Convert to array and calculate percentages
    const categoryData = Object.keys(spendingByCategory).map(category => {
      const amount = spendingByCategory[category];
      const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      return { category, amount, percentage };
    }).sort((a, b) => b.amount - a.amount);
    
    // Identify top spending categories
    const topCategories = categoryData.slice(0, 3);
    
    // Identify unusual spending (simulate comparison with historical data)
    const unusualSpending = [];
    categoryData.forEach(category => {
      // Simulate historical average (in a real app, this would come from actual historical data)
      const historicalAverage = category.amount * (0.7 + Math.random() * 0.6); // Random factor between 0.7 and 1.3
      const percentChange = ((category.amount - historicalAverage) / historicalAverage) * 100;
      
      if (Math.abs(percentChange) > 20) { // If change is more than 20%
        unusualSpending.push({
          category: category.category,
          currentAmount: category.amount,
          historicalAverage,
          percentChange
        });
      }
    });
    
    // Identify recurring expenses (simulate pattern detection)
    const recurringExpenses = [];
    const recurringCategories = ['utilities', 'housing', 'subscriptions'];
    
    filteredExpenses.forEach(expense => {
      if (recurringCategories.includes(expense.category) || Math.random() > 0.8) {
        recurringExpenses.push(expense);
      }
    });
    
    // Calculate percentage of spending that is recurring
    const recurringTotal = recurringExpenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);
    const recurringPercentage = totalSpent > 0 ? (recurringTotal / totalSpent) * 100 : 0;
    
    // Identify savings opportunities
    const savingsOpportunities = [];
    
    // Check for high entertainment spending
    const entertainmentSpending = spendingByCategory['entertainment'] || 0;
    if (entertainmentSpending > 0 && (entertainmentSpending / totalSpent) > 0.15) {
      savingsOpportunities.push({
        category: 'entertainment',
        description: 'Your entertainment spending is higher than recommended. Consider reducing it to save more.',
        potentialSavings: entertainmentSpending * 0.3
      });
    }
    
    // Check for high food spending
    const foodSpending = spendingByCategory['food'] || 0;
    if (foodSpending > 0 && (foodSpending / totalSpent) > 0.25) {
      savingsOpportunities.push({
        category: 'food',
        description: 'You could save by cooking more at home instead of eating out frequently.',
        potentialSavings: foodSpending * 0.2
      });
    }
    
    // Check for high transportation spending
    const transportationSpending = spendingByCategory['transportation'] || 0;
    if (transportationSpending > 0 && (transportationSpending / totalSpent) > 0.15) {
      savingsOpportunities.push({
        category: 'transportation',
        description: 'Consider using public transportation or carpooling to reduce transportation costs.',
        potentialSavings: transportationSpending * 0.25
      });
    }
    
    return {
      totalSpent,
      categoryData,
      topCategories,
      unusualSpending,
      recurringExpenses,
      recurringPercentage,
      savingsOpportunities
    };
  };

  const generateBudgetRecommendations = (patterns) => {
    const recommendations = [];
    
    // Calculate ideal budget allocation based on 50/30/20 rule
    // 50% for needs, 30% for wants, 20% for savings
    const monthlyIncome = userData?.financialInfo?.monthlyIncome || 3000; // Default if not set
    
    const needsCategories = ['housing', 'utilities', 'food', 'transportation', 'healthcare'];
    const wantsCategories = ['entertainment', 'personal', 'shopping'];
    const savingsCategories = ['savings', 'debt'];
    
    // Calculate current allocation
    const currentNeeds = patterns.categoryData
      .filter(cat => needsCategories.includes(cat.category))
      .reduce((sum, cat) => sum + cat.amount, 0);
      
    const currentWants = patterns.categoryData
      .filter(cat => wantsCategories.includes(cat.category))
      .reduce((sum, cat) => sum + cat.amount, 0);
      
    const currentSavings = patterns.categoryData
      .filter(cat => savingsCategories.includes(cat.category))
      .reduce((sum, cat) => sum + cat.amount, 0);
    
    // Calculate ideal allocation
    const idealNeeds = monthlyIncome * 0.5;
    const idealWants = monthlyIncome * 0.3;
    const idealSavings = monthlyIncome * 0.2;
    
    // Generate recommendations based on comparison
    if (currentNeeds > idealNeeds * 1.1) {
      recommendations.push({
        id: 'reduce-needs',
        title: 'Reduce Essential Expenses',
        description: 'Your spending on necessities is higher than recommended. Look for ways to reduce costs in housing, utilities, or groceries.',
        icon: 'home-outline'
      });
    }
    
    if (currentWants > idealWants * 1.2) {
      recommendations.push({
        id: 'reduce-wants',
        title: 'Cut Back on Discretionary Spending',
        description: 'Your discretionary spending is significantly higher than recommended. Consider reducing entertainment or shopping expenses.',
        icon: 'cart-outline'
      });
    }
    
    if (currentSavings < idealSavings * 0.8) {
      recommendations.push({
        id: 'increase-savings',
        title: 'Increase Your Savings Rate',
        description: 'You\'re saving less than recommended. Try to allocate at least 20% of your income to savings and debt repayment.',
        icon: 'piggy-bank-outline'
      });
    }
    
    // Category-specific recommendations
    patterns.categoryData.forEach(category => {
      const budget = budgets.find(b => b.category === category.category);
      if (budget && category.amount > budget.allocated * 1.1) {
        recommendations.push({
          id: `budget-${category.category}`,
          title: `Adjust ${category.category.charAt(0).toUpperCase() + category.category.slice(1)} Budget`,
          description: `Your ${category.category} spending consistently exceeds your budget. Consider increasing the budget or finding ways to reduce expenses.`,
          icon: getCategoryIcon(category.category)
        });
      }
    });
    
    // Add general recommendations if we don't have many specific ones
    if (recommendations.length < 3) {
      recommendations.push({
        id: 'emergency-fund',
        title: 'Build an Emergency Fund',
        description: 'Aim to save 3-6 months of expenses in an easily accessible emergency fund.',
        icon: 'shield-outline'
      });
      
      recommendations.push({
        id: 'automate-savings',
        title: 'Automate Your Savings',
        description: 'Set up automatic transfers to your savings account on payday to ensure consistent saving.',
        icon: 'refresh-auto'
      });
    }
    
    return recommendations;
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

  const getInsightTypeColor = (type) => {
    switch (type) {
      case 'warning':
        return COLORS.warning;
      case 'success':
        return COLORS.success;
      case 'info':
        return COLORS.info;
      default:
        return COLORS.primary;
    }
  };

  const renderTopCategoriesSection = () => {
    if (!spendingPatterns || !spendingPatterns.topCategories) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Spending Categories</Text>
        
        <View style={styles.topCategoriesContainer}>
          {spendingPatterns.topCategories.map((category, index) => (
            <View key={category.category} style={styles.topCategoryItem}>
              <View 
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: COLORS.categories[category.category] || COLORS.primary }
                ]}
              >
                <MaterialCommunityIcons 
                  name={getCategoryIcon(category.category)} 
                  size={24} 
                  color={COLORS.white} 
                />
              </View>
              <Text style={styles.categoryName}>
                {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
              </Text>
              <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
              <Text style={styles.categoryPercentage}>{category.percentage.toFixed(1)}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderInsightsSection = () => {
    if (insights.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Insights</Text>
        
        {insights.map(insight => (
          <TouchableOpacity 
            key={insight.id}
            style={styles.insightCard}
            onPress={() => {
              if (insight.screen) {
                navigation.navigate(insight.screen, insight.params);
              }
            }}
          >
            <View 
              style={[
                styles.insightIconContainer,
                { backgroundColor: getInsightTypeColor(insight.type) }
              ]}
            >
              <MaterialCommunityIcons name={insight.icon} size={24} color={COLORS.white} />
            </View>
            
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              
              {insight.action && (
                <TouchableOpacity 
                  style={styles.insightActionButton}
                  onPress={() => {
                    if (insight.screen) {
                      navigation.navigate(insight.screen, insight.params);
                    }
                  }}
                >
                  <Text style={styles.insightActionText}>{insight.action}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRecommendationsSection = () => {
    if (recommendations.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Recommendations</Text>
        
        {recommendations.map(recommendation => (
          <View key={recommendation.id} style={styles.recommendationCard}>
            <View style={styles.recommendationIconContainer}>
              <MaterialCommunityIcons name={recommendation.icon} size={24} color={COLORS.primary} />
            </View>
            
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
              <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
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
        <Text style={styles.headerTitle}>AI Insights</Text>
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
          <Text style={styles.loadingText}>Analyzing your financial data...</Text>
          <Text style={styles.aiText}>AI-powered insights are being generated</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {spendingPatterns && spendingPatterns.totalSpent > 0 ? (
            <>
              {renderTopCategoriesSection()}
              {renderInsightsSection()}
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
                Start tracking your expenses to receive personalized insights and recommendations.
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
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
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
  topCategoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topCategoryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xxs,
    ...SHADOWS.small,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  categoryAmount: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  categoryPercentage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  insightDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  insightActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  insightActionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
    marginRight: SPACING.xxs,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
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
  recommendationContent: {
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

export default InsightsScreen;
