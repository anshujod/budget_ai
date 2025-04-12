import React, { useState, useEffect } from 'react';
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
import { useFinancial } from '../../context/FinancialContext';

const EditGoalScreen = ({ route, navigation }) => {
  const { goalId } = route.params;
  const { goals, updateGoal } = useFinancial();
  
  // Find the goal by ID
  const goal = goals.find(g => g.id === goalId);
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const goalCategories = [
    { id: 'emergency', name: 'Emergency Fund', icon: 'shield-outline', color: COLORS.error },
    { id: 'vacation', name: 'Vacation', icon: 'airplane', color: COLORS.secondary },
    { id: 'home', name: 'Home', icon: 'home', color: COLORS.categories.housing },
    { id: 'car', name: 'Car', icon: 'car', color: COLORS.categories.transportation },
    { id: 'education', name: 'Education', icon: 'school', color: COLORS.categories.education },
    { id: 'retirement', name: 'Retirement', icon: 'beach', color: COLORS.primary },
    { id: 'wedding', name: 'Wedding', icon: 'ring', color: COLORS.accent },
    { id: 'other', name: 'Other', icon: 'star-outline', color: COLORS.darkGray },
  ];

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.target.toString());
      setTargetDate(goal.targetDate);
      setCategory(goal.category);
    } else {
      // Handle goal not found
      Alert.alert('Error', 'Goal not found', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [goal]);

  const validateForm = () => {
    let newErrors = {};
    
    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    }
    
    // Target amount validation
    if (!targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(parseFloat(targetAmount)) || parseFloat(targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be a positive number';
    }
    
    // Target date validation
    if (!targetDate.trim()) {
      newErrors.targetDate = 'Target date is required';
    } else {
      // Simple date validation (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(targetDate)) {
        newErrors.targetDate = 'Date must be in YYYY-MM-DD format';
      }
    }
    
    // Category validation
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateGoal = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedGoal = {
        name,
        target: parseFloat(targetAmount),
        targetDate,
        category,
      };
      
      // Recalculate progress based on new target
      if (goal.current > 0) {
        const newProgress = (goal.current / parseFloat(targetAmount)) * 100;
        updatedGoal.progress = newProgress;
      }
      
      await updateGoal(goalId, updatedGoal);
      Alert.alert('Success', 'Savings goal updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update savings goal');
    } finally {
      setIsLoading(false);
    }
  };

  if (!goal) {
    return null; // Return null while checking if goal exists
  }

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
        <Text style={styles.headerTitle}>Edit Savings Goal</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput
              style={[
                styles.input,
                errors.name && styles.inputError
              ]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({...errors, name: null});
                }
              }}
              placeholder="e.g., Dream Vacation, New Car"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[
                  styles.amountInput,
                  errors.targetAmount && styles.inputError
                ]}
                value={targetAmount}
                onChangeText={(text) => {
                  setTargetAmount(text);
                  if (errors.targetAmount) {
                    setErrors({...errors, targetAmount: null});
                  }
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
            {errors.targetAmount && <Text style={styles.errorText}>{errors.targetAmount}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Date</Text>
            <TextInput
              style={[
                styles.input,
                errors.targetDate && styles.inputError
              ]}
              value={targetDate}
              onChangeText={(text) => {
                setTargetDate(text);
                if (errors.targetDate) {
                  setErrors({...errors, targetDate: null});
                }
              }}
              placeholder="YYYY-MM-DD"
            />
            {errors.targetDate && <Text style={styles.errorText}>{errors.targetDate}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Goal Category</Text>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            
            <View style={styles.categoriesContainer}>
              {goalCategories.map((cat) => (
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
                      { backgroundColor: cat.color }
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
          
          <View style={styles.currentProgressContainer}>
            <Text style={styles.currentProgressLabel}>Current Progress</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${Math.min(100, goal.progress)}%`,
                    backgroundColor: goalCategories.find(cat => cat.id === category)?.color || COLORS.primary
                  }
                ]} 
              />
            </View>
            <Text style={styles.currentProgressText}>
              ${goal.current.toFixed(2)} saved of ${targetAmount} target ({Math.round(goal.progress)}%)
            </Text>
            <Text style={styles.progressNote}>
              Note: Changing the target amount will recalculate your progress percentage.
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateGoal}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Update Goal</Text>
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
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.small,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  amountInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  categoryItem: {
    width: '25%',
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
  currentProgressContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  currentProgressLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  currentProgressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  progressNote: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
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

export default EditGoalScreen;
