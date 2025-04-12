import React, { useState } from 'react';
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

const ExpenseDetailsScreen = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const { expenses, deleteExpense } = useFinancial();
  const [isLoading, setIsLoading] = useState(false);
  
  // Find the expense by ID
  const expense = expenses.find(exp => exp.id === expenseId);
  
  if (!expense) {
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
          <Text style={styles.headerTitle}>Expense Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Expense not found</Text>
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
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteExpense(expenseId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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
      other: 'dots-horizontal',
    };
    
    return icons[category] || 'cash';
  };
  
  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: 'cash',
      credit_card: 'credit-card',
      bank: 'bank',
    };
    
    return icons[method] || 'cash';
  };
  
  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
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
        <Text style={styles.headerTitle}>Expense Details</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MaterialCommunityIcons name="text-box-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{expense.description}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <View style={[
              styles.detailIconContainer,
              { backgroundColor: COLORS.categories[expense.category] || COLORS.primary }
            ]}>
              <MaterialCommunityIcons name={getCategoryIcon(expense.category)} size={24} color={COLORS.white} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MaterialCommunityIcons name="calendar" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(expense.date)}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MaterialCommunityIcons name={getPaymentMethodIcon(expense.paymentMethod)} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>
                {expense.paymentMethod === 'credit_card' ? 'Credit Card' : 
                 expense.paymentMethod.charAt(0).toUpperCase() + expense.paymentMethod.slice(1)}
              </Text>
            </View>
          </View>
          
          {expense.receipt && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name="receipt" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Receipt</Text>
                  <TouchableOpacity style={styles.viewReceiptButton}>
                    <Text style={styles.viewReceiptText}>View Receipt</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditExpense', { expenseId })}
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
  amountContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  amount: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error,
  },
  detailsCard: {
    margin: SPACING.lg,
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
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.xs,
  },
  viewReceiptButton: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.sm,
    marginTop: SPACING.xs,
  },
  viewReceiptText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: SPACING.lg,
    marginTop: 0,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    marginRight: SPACING.sm,
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
    marginLeft: SPACING.sm,
    ...SHADOWS.medium,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginLeft: SPACING.xs,
  },
});

export default ExpenseDetailsScreen;
