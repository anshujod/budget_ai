import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
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
  {
    id: '4',
    category: 'housing',
    name: 'Rent Payment',
    amount: -1200.00,
    date: '2025-04-01',
  },
  {
    id: '5',
    category: 'utilities',
    name: 'Electric Bill',
    amount: -78.50,
    date: '2025-04-05',
  },
  {
    id: '6',
    category: 'healthcare',
    name: 'Pharmacy',
    amount: -32.75,
    date: '2025-04-08',
  },
  {
    id: '7',
    category: 'personal',
    name: 'Haircut',
    amount: -45.00,
    date: '2025-04-09',
  },
];

// Mock category data
const mockCategoryData = [
  { category: 'food', amount: 250.42, percentage: 15 },
  { category: 'housing', amount: 1200.00, percentage: 45 },
  { category: 'transportation', amount: 150.30, percentage: 10 },
  { category: 'utilities', amount: 120.50, percentage: 8 },
  { category: 'entertainment', amount: 85.99, percentage: 6 },
  { category: 'healthcare', amount: 95.75, percentage: 7 },
  { category: 'personal', amount: 120.00, percentage: 9 },
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

const ExpensesScreen = ({ navigation }) => {
  const [timeframe, setTimeframe] = useState('month');
  
  // This would come from context/state in a real app
  const totalSpent = mockTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const previousPeriodSpent = totalSpent * 0.9; // Mock data
  const percentChange = ((totalSpent - previousPeriodSpent) / previousPeriodSpent) * 100;
  
  // Group transactions by date
  const groupedTransactions = mockTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
  
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="magnify" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="filter-variant" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.timeframeSelector}>
        <TouchableOpacity 
          style={[styles.timeframeOption, timeframe === 'week' && styles.timeframeOptionActive]}
          onPress={() => setTimeframe('week')}
        >
          <Text style={[styles.timeframeText, timeframe === 'week' && styles.timeframeTextActive]}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeframeOption, timeframe === 'month' && styles.timeframeOptionActive]}
          onPress={() => setTimeframe('month')}
        >
          <Text style={[styles.timeframeText, timeframe === 'month' && styles.timeframeTextActive]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeframeOption, timeframe === 'year' && styles.timeframeOptionActive]}
          onPress={() => setTimeframe('year')}
        >
          <Text style={[styles.timeframeText, timeframe === 'year' && styles.timeframeTextActive]}>Year</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeframeOption, timeframe === 'custom' && styles.timeframeOptionActive]}
          onPress={() => setTimeframe('custom')}
        >
          <Text style={[styles.timeframeText, timeframe === 'custom' && styles.timeframeTextActive]}>Custom</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Spent</Text>
          <Text style={styles.summaryAmount}>${totalSpent.toFixed(2)}</Text>
          <View style={styles.comparisonContainer}>
            <MaterialCommunityIcons 
              name={percentChange >= 0 ? 'arrow-up' : 'arrow-down'} 
              size={16} 
              color={percentChange >= 0 ? COLORS.error : COLORS.success} 
            />
            <Text style={[
              styles.comparisonText,
              percentChange >= 0 ? styles.comparisonIncrease : styles.comparisonDecrease,
            ]}>
              {Math.abs(percentChange).toFixed(1)}% from last {timeframe}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <View style={styles.categoryChart}>
            {/* This would be a proper pie chart in a real implementation */}
            <View style={styles.pieChartPlaceholder}>
              <Text style={styles.pieChartText}>Pie Chart</Text>
            </View>
            
            <View style={styles.categoryLegend}>
              {mockCategoryData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[
                    styles.legendColor,
                    { backgroundColor: COLORS.categories[item.category] }
                  ]} />
                  <Text style={styles.legendCategory}>{item.category}</Text>
                  <Text style={styles.legendPercentage}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          
          {sortedDates.map((date) => (
            <View key={date}>
              <Text style={styles.dateHeader}>{formatDate(date)}</Text>
              
              {groupedTransactions[date].map((transaction) => (
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
                    <Text style={styles.transactionCategory}>
                      {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                    </Text>
                  </View>
                  
                  <Text style={styles.transactionAmount}>
                    -{formatCurrency(transaction.amount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense')}
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
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  timeframeSelector: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  timeframeOption: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: SPACING.sm,
    marginRight: SPACING.sm,
  },
  timeframeOptionActive: {
    backgroundColor: COLORS.primary,
  },
  timeframeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  timeframeTextActive: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  summaryCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryAmount: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginLeft: SPACING.xs,
  },
  comparisonIncrease: {
    color: COLORS.error,
  },
  comparisonDecrease: {
    color: COLORS.success,
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
  categoryChart: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  pieChartPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  pieChartText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  categoryLegend: {
    flex: 1,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendCategory: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  legendPercentage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  dateHeader: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
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
  transactionCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error,
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

export default ExpensesScreen;
