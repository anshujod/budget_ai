import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';

// Mock data for demonstration
const mockTransactions = [
  {
    id: '1',
    category: 'food',
    name: 'Grocery Store',
    amount: -85.42,
    date: '2025-04-12',
  },
  {
    id: '2',
    category: 'entertainment',
    name: 'Movie Tickets',
    amount: -24.99,
    date: '2025-04-11',
  },
  {
    id: '3',
    category: 'transportation',
    name: 'Gas Station',
    amount: -45.30,
    date: '2025-04-10',
  },
];

const mockGoals = [
  {
    id: '1',
    name: 'Vacation Fund',
    icon: 'airplane',
    target: 2500,
    current: 1200,
    deadline: '2025-08-15',
  },
  {
    id: '2',
    name: 'Emergency Fund',
    icon: 'shield',
    target: 5000,
    current: 2750,
    deadline: '2025-12-31',
  },
  {
    id: '3',
    name: 'New Laptop',
    icon: 'laptop',
    target: 1200,
    current: 450,
    deadline: '2025-06-30',
  },
];

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
    other: 'dots-horizontal',
  };
  
  return icons[category] || 'cash';
};

const formatCurrency = (amount) => {
  return `$${Math.abs(amount).toFixed(2)}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const HomeScreen = ({ navigation }) => {
  // This would come from context/state in a real app
  const userName = 'Alex';
  const monthlyBudget = 2000;
  const spent = 1250;
  const remaining = monthlyBudget - spent;
  const budgetProgress = (spent / monthlyBudget) * 100;
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {userName}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialCommunityIcons name="account" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Budget</Text>
          
          <View style={styles.budgetProgressContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${Math.min(budgetProgress, 100)}%` },
                  budgetProgress > 80 && styles.progressBarWarning,
                  budgetProgress > 100 && styles.progressBarDanger,
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {budgetProgress.toFixed(0)}% used
            </Text>
          </View>
          
          <View style={styles.budgetDetails}>
            <View style={styles.budgetDetailItem}>
              <Text style={styles.budgetDetailLabel}>Spent</Text>
              <Text style={styles.budgetDetailValue}>${spent.toFixed(2)}</Text>
            </View>
            
            <View style={styles.budgetDetailItem}>
              <Text style={styles.budgetDetailLabel}>Remaining</Text>
              <Text style={[
                styles.budgetDetailValue,
                remaining < 0 && styles.negativeAmount
              ]}>
                ${remaining.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.budgetDetailItem}>
              <Text style={styles.budgetDetailLabel}>Total</Text>
              <Text style={styles.budgetDetailValue}>${monthlyBudget.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            <TouchableOpacity 
              style={styles.sectionButton}
              onPress={() => navigation.navigate('AIInsights')}
            >
              <Text style={styles.sectionButtonText}>View More</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.insightCard}
            onPress={() => navigation.navigate('AIInsights')}
          >
            <View style={styles.insightIconContainer}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color={COLORS.white} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Spending Tip</Text>
              <Text style={styles.insightText}>
                You've spent 30% more on dining out this month compared to last month. Consider cooking at home more often to save money.
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity 
              style={styles.sectionButton}
              onPress={() => navigation.navigate('Expenses')}
            >
              <Text style={styles.sectionButtonText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mockTransactions.map((transaction) => (
            <TouchableOpacity 
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => navigation.navigate('ExpenseDetails', { id: transaction.id })}
            >
              <View style={[
                styles.categoryIcon,
                { backgroundColor: COLORS.categories[transaction.category] }
              ]}>
                <MaterialCommunityIcons 
                  name={getCategoryIcon(transaction.category)} 
                  size={20} 
                  color={COLORS.white} 
                />
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                transaction.amount < 0 && styles.expenseAmount,
                transaction.amount > 0 && styles.incomeAmount,
              ]}>
                {transaction.amount < 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            <TouchableOpacity 
              style={styles.sectionButton}
              onPress={() => navigation.navigate('Goals')}
            >
              <Text style={styles.sectionButtonText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockGoals}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const progress = (item.current / item.target) * 100;
              
              return (
                <TouchableOpacity 
                  style={styles.goalCard}
                  onPress={() => navigation.navigate('GoalDetails', { id: item.id })}
                >
                  <View style={styles.goalIconContainer}>
                    <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.white} />
                  </View>
                  
                  <Text style={styles.goalName}>{item.name}</Text>
                  
                  <View style={styles.goalProgressContainer}>
                    <View style={styles.goalProgressBarBackground}>
                      <View 
                        style={[
                          styles.goalProgressBar, 
                          { width: `${progress}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.goalProgressText}>
                      {progress.toFixed(0)}%
                    </Text>
                  </View>
                  
                  <View style={styles.goalAmounts}>
                    <Text style={styles.goalCurrentAmount}>${item.current}</Text>
                    <Text style={styles.goalTargetAmount}>of ${item.target}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.goalsList}
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
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.medium,
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  budgetProgressContainer: {
    marginBottom: SPACING.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  progressBarWarning: {
    backgroundColor: COLORS.warning,
  },
  progressBarDanger: {
    backgroundColor: COLORS.error,
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetDetailItem: {
    alignItems: 'center',
  },
  budgetDetailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  budgetDetailValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  negativeAmount: {
    color: COLORS.error,
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
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.small,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  insightContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  insightText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  transactionDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  expenseAmount: {
    color: COLORS.error,
  },
  incomeAmount: {
    color: COLORS.success,
  },
  goalsList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  goalCard: {
    width: 200,
    padding: SPACING.md,
    marginRight: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.small,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  goalName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  goalProgressContainer: {
    marginBottom: SPACING.sm,
  },
  goalProgressBarBackground: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginBottom: SPACING.xs,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalCurrentAmount: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  goalTargetAmount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
