import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { EXPENSE_CATEGORIES } from '../../constants/appConstants';
import { useFinancial } from '../../context/FinancialContext';

const AddExpenseScreen = ({ navigation }) => {
  const { addExpense } = useFinancial();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    
    // Amount validation
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Category validation
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExpense = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const newExpense = {
        amount: -Math.abs(parseFloat(amount)), // Store as negative for expenses
        description,
        category,
        date,
        paymentMethod,
      };
      
      await addExpense(newExpense);
      Alert.alert('Success', 'Expense added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (errors.amount) {
                  setErrors({...errors, amount: null});
                }
              }}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              // In a real app, this would open a date picker
            >
              <Text style={styles.dateText}>{date}</Text>
              <MaterialCommunityIcons name="calendar" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[
                styles.input,
                errors.description && styles.inputError
              ]}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) {
                  setErrors({...errors, description: null});
                }
              }}
              placeholder="What was this expense for?"
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            
            <View style={styles.categoriesContainer}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    category === cat.id && styles.categoryItemSelected
                  ]}
                  onPress={() => {
                    setCategory(cat.id);
                    if (errors.category) {
                      setErrors({...errors, category: null});
                    }
                  }}
                >
                  <View 
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: COLORS.categories[cat.id] || COLORS.gray }
                    ]}
                  >
                    <MaterialCommunityIcons name={cat.icon} size={20} color={COLORS.white} />
                  </View>
                  <Text style={[
                    styles.categoryText,
                    category === cat.id && styles.categoryTextSelected
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Payment Method</Text>
            <View style={styles.paymentMethodsContainer}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodItem,
                  paymentMethod === 'cash' && styles.paymentMethodItemSelected
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <MaterialCommunityIcons 
                  name="cash" 
                  size={20} 
                  color={paymentMethod === 'cash' ? COLORS.primary : COLORS.darkGray} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === 'cash' && styles.paymentMethodTextSelected
                ]}>
                  Cash
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.paymentMethodItem,
                  paymentMethod === 'credit_card' && styles.paymentMethodItemSelected
                ]}
                onPress={() => setPaymentMethod('credit_card')}
              >
                <MaterialCommunityIcons 
                  name="credit-card" 
                  size={20} 
                  color={paymentMethod === 'credit_card' ? COLORS.primary : COLORS.darkGray} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === 'credit_card' && styles.paymentMethodTextSelected
                ]}>
                  Credit Card
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.paymentMethodItem,
                  paymentMethod === 'bank' && styles.paymentMethodItemSelected
                ]}
                onPress={() => setPaymentMethod('bank')}
              >
                <MaterialCommunityIcons 
                  name="bank" 
                  size={20} 
                  color={paymentMethod === 'bank' ? COLORS.primary : COLORS.darkGray} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === 'bank' && styles.paymentMethodTextSelected
                ]}>
                  Bank
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.attachReceiptButton, styles.optionalButton]}
          >
            <MaterialCommunityIcons name="camera" size={20} color={COLORS.primary} />
            <Text style={styles.optionalButtonText}>Attach Receipt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.splitExpenseButton, styles.optionalButton]}
          >
            <MaterialCommunityIcons name="account-group" size={20} color={COLORS.primary} />
            <Text style={styles.optionalButtonText}>Split Expense</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddExpense}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Expense</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formContainer: {
    padding: SPACING.lg,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  amountInput: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    minWidth: 150,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    ...SHADOWS.small,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  dateInput: {
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  categoryItem: {
    width: '33.33%',
    padding: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  categoryItemSelected: {
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
    alignSelf: 'center',
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
  },
  paymentMethodItemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  paymentMethodText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  paymentMethodTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  optionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  optionalButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xs,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.medium,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});

export default AddExpenseScreen;
