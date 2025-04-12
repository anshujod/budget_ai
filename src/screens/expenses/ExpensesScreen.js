import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';

const ExpensesScreen = ({ navigation }) => {
  const { expenses, isLoading } = useFinancial();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, selectedFilter, selectedTimeframe]);

  const filterExpenses = () => {
    // Start with all expenses
    let filtered = [...expenses];
    
    // Apply timeframe filter
    const now = new Date();
    let startDate;
    
    switch (selectedTimeframe) {
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
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
    }
    
    filtered = filtered.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= now;
    });
    
    // Apply category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredExpenses(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
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
  
  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.expenseItem}
      onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
    >
      <View 
        style={[
          styles.categoryIcon,
          { backgroundColor: COLORS.categories[item.category] || COLORS.gray }
        ]}
      >
        <MaterialCommunityIcons name={getCategoryIcon(item.category)} size={20} color={COLORS.white} />
      </View>
      
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.expenseCategory}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Text>
      </View>
      
      <View style={styles.expenseAmountContainer}>
        <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="receipt-text-outline" size={64} color={COLORS.lightGray} />
      <Text style={styles.emptyTitle}>No Expenses Yet</Text>
      <Text style={styles.emptyDescription}>
        Start tracking your expenses by adding your first transaction.
      </Text>
      <TouchableOpacity 
        style={styles.addFirstExpenseButton}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Text style={styles.addFirstExpenseText}>Add Your First Expense</Text>
      </TouchableOpacity>
    </View>
  );
  
  const calculateTotalExpenses = () => {
    return filteredExpenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.syncButton}
            onPress={() => navigation.navigate('BankSync')}
          >
            <MaterialCommunityIcons name="bank-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddExpense')}
          >
            <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.darkGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <TouchableOpacity 
            style={[
              styles.filterChip,
              selectedFilter === 'all' && styles.filterChipSelected
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text 
              style={[
                styles.filterChipText,
                selectedFilter === 'all' && styles.filterChipTextSelected
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {Object.keys(COLORS.categories).map(category => (
            <TouchableOpacity 
              key={category}
              style={[
                styles.filterChip,
                selectedFilter === category && styles.filterChipSelected,
                { borderColor: COLORS.categories[category] }
              ]}
              onPress={() => setSelectedFilter(category)}
            >
              <MaterialCommunityIcons 
                name={getCategoryIcon(category)} 
                size={16} 
                color={selectedFilter === category ? COLORS.white : COLORS.categories[category]} 
                style={styles.filterChipIcon}
              />
              <Text 
                style={[
                  styles.filterChipText,
                  selectedFilter === category && styles.filterChipTextSelected
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        
        <TouchableOpacity 
          style={[
            styles.timeframeButton,
            selectedTimeframe === 'all' && styles.timeframeButtonSelected
          ]}
          onPress={() => setSelectedTimeframe('all')}
        >
          <Text 
            style={[
              styles.timeframeButtonText,
              selectedTimeframe === 'all' && styles.timeframeButtonTextSelected
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredExpenses.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryValue}>${calculateTotalExpenses().toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryValue}>{filteredExpenses.length}</Text>
          </View>
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    ...SHADOWS.small,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  filtersContainer: {
    marginBottom: SPACING.md,
  },
  filtersScrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    ...SHADOWS.small,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipIcon: {
    marginRight: SPACING.xs,
  },
  filterChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  filterChipTextSelected: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
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
    paddingVertical: SPACING.xs,
    marginHorizontal: SPACING.xxs,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  timeframeButtonSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  timeframeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  timeframeButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xxs,
    ...SHADOWS.small,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  expenseCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error,
    marginBottom: SPACING.xxs,
  },
  expenseDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
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
  addFirstExpenseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.medium,
  },
  addFirstExpenseText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
});

export default ExpensesScreen;
