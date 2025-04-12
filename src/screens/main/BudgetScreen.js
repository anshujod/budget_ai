import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';

// Mock data for demonstration
const mockBudgetData = [
  { category: 'housing', allocated: 1200, spent: 1200, percentage: 100 },
  { category: 'food', allocated: 500, spent: 250.42, percentage: 50 },
  { category: 'transportation', allocated: 300, spent: 150.30, percentage: 50 },
  { category: 'utilities', allocated: 200, spent: 120.50, percentage: 60 },
  { category: 'entertainment', allocated: 150, spent: 85.99, percentage: 57 },
  { category: 'healthcare', allocated: 150, spent: 95.75, percentage: 64 },
  { category: 'personal', allocated: 200, spent: 120.00, percentage: 60 },
  { category: 'savings', allocated: 400, spent: 400, percentage: 100 },
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
  return `$${amount.toFixed(2)}`;
};

const BudgetScreen = ({ navigation }) => {
  const [timeframe, setTimeframe] = useState('month');
  
  // This would come from context/state in a real app
  const totalBudget = mockBudgetData.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = mockBudgetData.reduce((sum, item) => sum + item.spent, 0);
  const remaining = totalBudget - totalSpent;
  const budgetProgress = (totalSpent / totalBudget) * 100;
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="cog" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.timeframeSelector}>
        <TouchableOpacity 
          style={[styles.timeframeOption, timeframe === 'month' && styles.timeframeOptionActive]}
          onPress={() => setTimeframe('month')}
        >
          <Text style={[styles.timeframeText, timeframe === 'month' && styles.timeframeTextActive]}>Month</Text>
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
          <Text style={styles.summaryTitle}>Budget Overview</Text>
          
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
              <Text style={styles.budgetDetailLabel}>Total Budget</Text>
              <Text style={styles.budgetDetailValue}>${totalBudget.toFixed(2)}</Text>
            </View>
            
            <View style={styles.budgetDetailItem}>
              <Text style={styles.budgetDetailLabel}>Spent</Text>
              <Text style={styles.budgetDetailValue}>${totalSpent.toFixed(2)}</Text>
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
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Budgets</Text>
          
          {mockBudgetData.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.categoryItem}
              onPress={() => navigation.navigate('BudgetDetails', { category: item.category })}
            >
              <View style={[
                styles.categoryIcon,
                { backgroundColor: COLORS.categories[item.category] }
              ]}>
                <MaterialCommunityIcons 
                  name={getCategoryIcon(item.category)} 
                  size={20} 
                  color={COLORS.white} 
                />
              </View>
              
              <View style={styles.categoryInfo}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </Text>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(item.spent)} / {formatCurrency(item.allocated)}
                  </Text>
                </View>
                
                <View style={styles.categoryProgressContainer}>
                  <View style={styles.categoryProgressBarBackground}>
                    <View 
                      style={[
                        styles.categoryProgressBar, 
                        { width: `${Math.min(item.percentage, 100)}%` },
                        item.percentage > 80 && styles.progressBarWarning,
                        item.percentage > 100 && styles.progressBarDanger,
                      ]} 
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditBudget')}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Adjust Budget</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.aiButton]}
            onPress={() => navigation.navigate('AIInsights')}
          >
            <MaterialCommunityIcons name="robot" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Get AI Recommendations</Text>
          </TouchableOpacity>
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  categoryItem: {
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
  categoryInfo: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  categoryAmount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  categoryProgressContainer: {
    marginBottom: SPACING.xs,
  },
  categoryProgressBarBackground: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
  },
  categoryProgressBar: {
    height: 4,
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  actionButton: {
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
  aiButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xs,
  },
});

export default BudgetScreen;
