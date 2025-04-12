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

const ActionableInsightsScreen = ({ navigation }) => {
  const { expenses, budgets, goals } = useFinancial();
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  useEffect(() => {
    // Simulate AI analysis loading
    setIsLoading(true);
    
    // Simulate delay for AI processing
    const timer = setTimeout(() => {
      generateActionableInsights();
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [expenses, budgets, goals, selectedTimeframe]);

  const generateActionableInsights = () => {
    // Filter expenses by selected timeframe
    const filteredExpenses = filterExpensesByTimeframe(expenses, selectedTimeframe);
    
    // Generate actionable insights
    const newInsights = [];
    
    // Insight 1: Recurring Subscriptions
    const subscriptions = identifyRecurringSubscriptions(filteredExpenses);
    if (subscriptions.length > 0) {
      const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
      newInsights.push({
        id: 'subscriptions',
        title: 'Subscription Audit',
        description: `You're spending $${totalSubscriptionCost.toFixed(2)} monthly on ${subscriptions.length} subscriptions.`,
        icon: 'refresh',
        category: 'optimization',
        action: {
          text: 'Review your subscriptions',
          description: 'Cancel unused services to save money each month.',
          steps: subscriptions.map(sub => ({
            text: `Review ${sub.name} ($${sub.amount.toFixed(2)}/month)`,
            completed: false
          }))
        }
      });
    }
    
    // Insight 2: Spending Spikes
    const spendingSpikes = identifySpendingSpikes(filteredExpenses);
    if (spendingSpikes.length > 0) {
      newInsights.push({
        id: 'spending-spikes',
        title: 'Unusual Spending Detected',
        description: `We noticed unusual spending in ${spendingSpikes.length} categories.`,
        icon: 'trending-up',
        category: 'alert',
        action: {
          text: 'Investigate unusual spending',
          description: 'Check these categories for unexpected charges or opportunities to cut back.',
          steps: spendingSpikes.map(spike => ({
            text: `Review ${spike.category} spending ($${spike.amount.toFixed(2)})`,
            completed: false
          }))
        }
      });
    }
    
    // Insight 3: Savings Opportunities
    const savingsOpportunities = identifySavingsOpportunities(filteredExpenses, budgets);
    if (savingsOpportunities.length > 0) {
      const totalPotentialSavings = savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);
      newInsights.push({
        id: 'savings-opportunities',
        title: 'Potential Savings Found',
        description: `You could save up to $${totalPotentialSavings.toFixed(2)} with these changes.`,
        icon: 'piggy-bank',
        category: 'opportunity',
        action: {
          text: 'Implement savings strategies',
          description: 'Make these changes to increase your savings rate.',
          steps: savingsOpportunities.map(opp => ({
            text: opp.description,
            completed: false
          }))
        }
      });
    }
    
    // Insight 4: Goal Progress
    const goalInsights = analyzeGoalProgress(goals);
    if (goalInsights) {
      newInsights.push({
        id: 'goal-progress',
        title: goalInsights.title,
        description: goalInsights.description,
        icon: 'flag',
        category: goalInsights.category,
        action: {
          text: goalInsights.actionText,
          description: goalInsights.actionDescription,
          steps: goalInsights.steps
        }
      });
    }
    
    // Insight 5: Budget Adjustments
    const budgetAdjustments = identifyBudgetAdjustments(filteredExpenses, budgets);
    if (budgetAdjustments.length > 0) {
      newInsights.push({
        id: 'budget-adjustments',
        title: 'Budget Adjustments Needed',
        description: `${budgetAdjustments.length} of your budget categories need adjustment.`,
        icon: 'calculator',
        category: 'planning',
        action: {
          text: 'Optimize your budget',
          description: 'Adjust these categories to better match your actual spending patterns.',
          steps: budgetAdjustments.map(adj => ({
            text: adj.description,
            completed: false
          }))
        }
      });
    }
    
    // Insight 6: Financial Health Score
    const healthScore = calculateFinancialHealthScore(filteredExpenses, budgets, goals);
    newInsights.push({
      id: 'financial-health',
      title: 'Your Financial Health Score',
      description: `Your score is ${healthScore.score}/100 (${healthScore.rating}).`,
      icon: 'heart-pulse',
      category: 'assessment',
      action: {
        text: 'Improve your financial health',
        description: 'Focus on these areas to improve your overall financial wellbeing.',
        steps: healthScore.improvements.map(imp => ({
          text: imp,
          completed: false
        }))
      }
    });
    
    setInsights(newInsights);
  };

  const identifyRecurringSubscriptions = (expenses) => {
    // In a real app, this would use pattern recognition to identify recurring charges
    // For this simulation, we'll create some sample subscriptions
    const subscriptions = [
      { name: 'Netflix', amount: 15.99 },
      { name: 'Spotify', amount: 9.99 },
      { name: 'Gym Membership', amount: 49.99 },
      { name: 'Cloud Storage', amount: 5.99 }
    ];
    
    // Only return subscriptions if we have enough expenses to analyze
    return expenses.length > 5 ? subscriptions : [];
  };

  const identifySpendingSpikes = (expenses) => {
    // In a real app, this would compare current spending to historical averages
    // For this simulation, we'll create some sample spending spikes
    const spikes = [];
    
    if (expenses.length > 0) {
      // Group expenses by category
      const expensesByCategory = {};
      expenses.forEach(expense => {
        if (!expensesByCategory[expense.category]) {
          expensesByCategory[expense.category] = 0;
        }
        expensesByCategory[expense.category] += Math.abs(expense.amount);
      });
      
      // Identify categories with high spending (simulated spikes)
      Object.keys(expensesByCategory).forEach(category => {
        if (Math.random() > 0.7 && expensesByCategory[category] > 100) {
          spikes.push({
            category,
            amount: expensesByCategory[category],
            percentIncrease: Math.floor(Math.random() * 50) + 20 // Random increase between 20-70%
          });
        }
      });
    }
    
    return spikes;
  };

  const identifySavingsOpportunities = (expenses, budgets) => {
    const opportunities = [];
    
    if (expenses.length > 0) {
      // Check for high food spending
      const foodExpenses = expenses.filter(exp => exp.category === 'food');
      const foodTotal = foodExpenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
      const diningOut = foodExpenses.filter(exp => exp.subcategory === 'dining' || exp.description.toLowerCase().includes('restaurant'));
      const diningTotal = diningOut.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
      
      if (diningTotal > 200) {
        opportunities.push({
          category: 'food',
          description: 'Cook at home more often instead of dining out',
          potentialSavings: diningTotal * 0.5
        });
      }
      
      // Check for high transportation spending
      const transportationExpenses = expenses.filter(exp => exp.category === 'transportation');
      const transportationTotal = transportationExpenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
      
      if (transportationTotal > 150) {
        opportunities.push({
          category: 'transportation',
          description: 'Use public transportation or carpool to save on fuel costs',
          potentialSavings: transportationTotal * 0.3
        });
      }
      
      // Check for high entertainment spending
      const entertainmentExpenses = expenses.filter(exp => exp.category === 'entertainment');
      const entertainmentTotal = entertainmentExpenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
      
      if (entertainmentTotal > 100) {
        opportunities.push({
          category: 'entertainment',
          description: 'Look for free or low-cost entertainment options',
          potentialSavings: entertainmentTotal * 0.4
        });
      }
    }
    
    return opportunities;
  };

  const analyzeGoalProgress = (goals) => {
    if (goals.length === 0) {
      return {
        title: 'No Savings Goals Set',
        description: 'Setting specific goals helps you save more effectively.',
        category: 'planning',
        actionText: 'Create your first savings goal',
        actionDescription: 'Start with these recommended goals:',
        steps: [
          { text: 'Create an emergency fund goal (3-6 months of expenses)', completed: false },
          { text: 'Set up a retirement savings goal', completed: false },
          { text: 'Add a goal for your next big purchase', completed: false }
        ]
      };
    }
    
    const activeGoals = goals.filter(goal => goal.current < goal.target);
    
    if (activeGoals.length === 0) {
      return {
        title: 'All Goals Completed!',
        description: 'Congratulations on reaching all your savings goals.',
        category: 'success',
        actionText: 'Set new financial goals',
        actionDescription: 'Continue your financial journey with new goals:',
        steps: [
          { text: 'Increase your retirement contributions', completed: false },
          { text: 'Start investing for long-term growth', completed: false },
          { text: 'Create a new goal for your next life milestone', completed: false }
        ]
      };
    }
    
    // Find goals that are behind schedule
    const behindGoals = activeGoals.filter(goal => {
      const targetDate = new Date(goal.targetDate);
      const today = new Date();
      const totalDays = (targetDate - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
      const daysElapsed = (today - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
      const expectedProgress = (daysElapsed / totalDays) * 100;
      return goal.progress < expectedProgress * 0.7; // If progress is less than 70% of expected
    });
    
    if (behindGoals.length > 0) {
      return {
        title: 'Goals Falling Behind',
        description: `${behindGoals.length} of your goals are behind schedule.`,
        category: 'alert',
        actionText: 'Get back on track',
        actionDescription: 'Take these actions to accelerate your progress:',
        steps: behindGoals.map(goal => ({
          text: `Increase contributions to "${goal.name}" goal`,
          completed: false
        }))
      };
    }
    
    return {
      title: 'Goals On Track',
      description: 'You\'re making good progress toward your savings goals.',
      category: 'success',
      actionText: 'Optimize your goal strategy',
      actionDescription: 'Consider these actions to reach your goals faster:',
      steps: [
        { text: 'Set up automatic transfers to your savings goals', completed: false },
        { text: 'Review your goals monthly to stay motivated', completed: false },
        { text: 'Celebrate milestones along the way', completed: false }
      ]
    };
  };

  const identifyBudgetAdjustments = (expenses, budgets) => {
    const adjustments = [];
    
    if (expenses.length > 0 && budgets.length > 0) {
      // Group expenses by category
      const expensesByCategory = {};
      expenses.forEach(expense => {
        if (!expensesByCategory[expense.category]) {
          expensesByCategory[expense.category] = 0;
        }
        expensesByCategory[expense.category] += Math.abs(expense.amount);
      });
      
      // Compare actual spending to budgets
      budgets.forEach(budget => {
        const actualSpending = expensesByCategory[budget.category] || 0;
        
        // If consistently over budget
        if (actualSpending > budget.allocated * 1.2) {
          adjustments.push({
            category: budget.category,
            currentBudget: budget.allocated,
            actualSpending,
            description: `Increase ${budget.category} budget to match your actual spending of $${actualSpending.toFixed(2)}`
          });
        }
        
        // If consistently under budget
        if (actualSpending < budget.allocated * 0.7 && actualSpending > 0) {
          adjustments.push({
            category: budget.category,
            currentBudget: budget.allocated,
            actualSpending,
            description: `Decrease ${budget.category} budget from $${budget.allocated.toFixed(2)} to $${actualSpending.toFixed(2)} to free up funds`
          });
        }
      });
      
      // Check for categories with expenses but no budget
      Object.keys(expensesByCategory).forEach(category => {
        const hasBudget = budgets.some(budget => budget.category === category);
        if (!hasBudget && expensesByCategory[category] > 50) {
          adjustments.push({
            category,
            currentBudget: 0,
            actualSpending: expensesByCategory[category],
            description: `Create a new budget for ${category} based on your spending of $${expensesByCategory[category].toFixed(2)}`
          });
        }
      });
    }
    
    return adjustments;
  };

  const calculateFinancialHealthScore = (expenses, budgets, goals) => {
    // In a real app, this would be a comprehensive analysis of financial health
    // For this simulation, we'll create a sample health score
    
    let score = 70; // Start with a baseline score
    let improvements = [];
    
    // Adjust score based on budget adherence
    if (budgets.length > 0) {
      const overBudgetCategories = budgets.filter(budget => budget.spent > budget.allocated);
      score -= overBudgetCategories.length * 5;
      
      if (overBudgetCategories.length > 0) {
        improvements.push('Stay within your budget in all categories');
      }
    } else {
      score -= 10;
      improvements.push('Create a budget to track your spending');
    }
    
    // Adjust score based on savings goals
    if (goals.length > 0) {
      const activeGoals = goals.filter(goal => goal.current < goal.target);
      const onTrackGoals = activeGoals.filter(goal => {
        const targetDate = new Date(goal.targetDate);
        const today = new Date();
        const totalDays = (targetDate - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
        const daysElapsed = (today - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24);
        const expectedProgress = (daysElapsed / totalDays) * 100;
        return goal.progress >= expectedProgress * 0.7;
      });
      
      score += onTrackGoals.length * 5;
      
      if (onTrackGoals.length < activeGoals.length) {
        improvements.push('Increase contributions to your savings goals');
      }
    } else {
      score -= 15;
      improvements.push('Set up savings goals for financial security');
    }
    
    // Adjust score based on expense patterns
    if (expenses.length > 0) {
      // Check for emergency fund (savings category)
      const savingsExpenses = expenses.filter(exp => exp.category === 'savings');
      const hasSavings = savingsExpenses.length > 0;
      
      if (!hasSavings) {
        score -= 10;
        improvements.push('Start building an emergency fund');
      }
      
      // Check for debt payments
      const debtExpenses = expenses.filter(exp => exp.category === 'debt');
      const hasDebt = debtExpenses.length > 0;
      
      if (hasDebt) {
        score -= 5;
        improvements.push('Work on reducing your debt');
      }
    }
    
    // Ensure score is within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    // Determine rating based on score
    let rating;
    if (score >= 90) {
      rating = 'Excellent';
    } else if (score >= 80) {
      rating = 'Very Good';
    } else if (score >= 70) {
      rating = 'Good';
    } else if (score >= 60) {
      rating = 'Fair';
    } else if (score >= 50) {
      rating = 'Needs Improvement';
    } else {
      rating = 'Poor';
    }
    
    // Ensure we have at least 3 improvement suggestions
    if (improvements.length < 3) {
      const additionalImprovements = [
        'Increase your income through side hustles or career advancement',
        'Reduce discretionary spending to increase savings rate',
        'Automate your savings to ensure consistent contributions',
        'Review and optimize your tax strategy',
        'Consider low-cost index funds for long-term investing'
      ];
      
      while (improvements.length < 3) {
        const randomImprovement = additionalImprovements[Math.floor(Math.random() * additionalImprovements.length)];
        if (!improvements.includes(randomImprovement)) {
          improvements.push(randomImprovement);
        }
      }
    }
    
    return { score, rating, improvements };
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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'alert':
        return COLORS.warning;
      case 'success':
        return COLORS.success;
      case 'opportunity':
        return COLORS.primary;
      case 'planning':
        return COLORS.info;
      case 'optimization':
        return COLORS.secondary;
      case 'assessment':
        return COLORS.accent;
      default:
        return COLORS.primary;
    }
  };

  const renderInsightsSection = () => {
    if (insights.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actionable Insights</Text>
        
        {insights.map(insight => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View 
                style={[
                  styles.insightIconContainer,
                  { backgroundColor: getCategoryColor(insight.category) }
                ]}
              >
                <MaterialCommunityIcons name={insight.icon} size={24} color={COLORS.white} />
              </View>
              
              <View style={styles.insightTitleContainer}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            </View>
            
            <View style={styles.actionContainer}>
              <Text style={styles.actionTitle}>{insight.action.text}</Text>
              <Text style={styles.actionDescription}>{insight.action.description}</Text>
              
              <View style={styles.stepsContainer}>
                {insight.action.steps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <MaterialCommunityIcons 
                      name={step.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                      size={20} 
                      color={step.completed ? COLORS.success : COLORS.primary} 
                      style={styles.stepIcon} 
                    />
                    <Text style={styles.stepText}>{step.text}</Text>
                  </View>
                ))}
              </View>
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
        <Text style={styles.headerTitle}>Actionable Insights</Text>
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
          <Text style={styles.loadingText}>Generating personalized insights...</Text>
          <Text style={styles.aiText}>Our AI is analyzing your financial patterns</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {insights.length > 0 ? (
            <>
              {renderInsightsSection()}
              
              <View style={styles.aiPoweredContainer}>
                <MaterialCommunityIcons name="robot" size={20} color={COLORS.primary} />
                <Text style={styles.aiPoweredText}>
                  Powered by BudgetAI's intelligent analysis
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="lightbulb-outline" size={64} color={COLORS.lightGray} />
              <Text style={styles.emptyTitle}>No Insights Available</Text>
              <Text style={styles.emptyDescription}>
                Start tracking your expenses to receive personalized financial insights.
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
  insightCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
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
  insightTitleContainer: {
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
  },
  actionContainer: {
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  actionDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  stepsContainer: {
    marginTop: SPACING.xs,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stepIcon: {
    marginRight: SPACING.sm,
  },
  stepText: {
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

export default ActionableInsightsScreen;
