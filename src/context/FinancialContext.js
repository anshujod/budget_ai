import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/appConstants';

// Create the financial data context
export const FinancialContext = createContext();

// Custom hook to use the financial context
export const useFinancial = () => useContext(FinancialContext);

// Financial provider component
export const FinancialProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  // Load financial data on app start
  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        // Load expenses
        const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        } else {
          // Initialize with empty array if no data exists
          setExpenses([]);
        }

        // Load budgets
        const storedBudgets = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          // Initialize with default budgets if no data exists
          const defaultBudgets = [
            { category: 'housing', allocated: 1000, spent: 0 },
            { category: 'food', allocated: 400, spent: 0 },
            { category: 'transportation', allocated: 200, spent: 0 },
            { category: 'utilities', allocated: 150, spent: 0 },
            { category: 'entertainment', allocated: 100, spent: 0 },
            { category: 'healthcare', allocated: 100, spent: 0 },
            { category: 'personal', allocated: 150, spent: 0 },
            { category: 'savings', allocated: 300, spent: 0 },
          ];
          await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(defaultBudgets));
          setBudgets(defaultBudgets);
        }

        // Load goals
        const storedGoals = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        } else {
          // Initialize with empty array if no data exists
          setGoals([]);
        }
      } catch (error) {
        console.log('Error loading financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancialData();
  }, []);

  // Financial data functions
  const financialContext = {
    isLoading,
    expenses,
    budgets,
    goals,
    
    // Add expense
    addExpense: async (newExpense) => {
      try {
        setIsLoading(true);
        
        // Generate unique ID and add timestamp
        const expenseWithId = {
          ...newExpense,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };
        
        // Update expenses state
        const updatedExpenses = [...expenses, expenseWithId];
        setExpenses(updatedExpenses);
        
        // Update budget spent amount for the category
        const updatedBudgets = budgets.map(budget => {
          if (budget.category === newExpense.category) {
            return {
              ...budget,
              spent: budget.spent + Math.abs(newExpense.amount),
            };
          }
          return budget;
        });
        setBudgets(updatedBudgets);
        
        // Save to storage
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updatedBudgets));
      } catch (error) {
        console.log('Error adding expense:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Update expense
    updateExpense: async (expenseId, updatedData) => {
      try {
        setIsLoading(true);
        
        // Find the expense to update
        const expenseToUpdate = expenses.find(exp => exp.id === expenseId);
        if (!expenseToUpdate) {
          throw new Error('Expense not found');
        }
        
        // Update expenses state
        const updatedExpenses = expenses.map(expense => {
          if (expense.id === expenseId) {
            return { ...expense, ...updatedData };
          }
          return expense;
        });
        setExpenses(updatedExpenses);
        
        // Update budget spent amounts if category or amount changed
        if (updatedData.category !== expenseToUpdate.category || updatedData.amount !== expenseToUpdate.amount) {
          const updatedBudgets = [...budgets];
          
          // Subtract from old category
          const oldCategoryIndex = updatedBudgets.findIndex(b => b.category === expenseToUpdate.category);
          if (oldCategoryIndex !== -1) {
            updatedBudgets[oldCategoryIndex].spent -= Math.abs(expenseToUpdate.amount);
          }
          
          // Add to new category
          const newCategoryIndex = updatedBudgets.findIndex(b => b.category === updatedData.category);
          if (newCategoryIndex !== -1) {
            updatedBudgets[newCategoryIndex].spent += Math.abs(updatedData.amount);
          }
          
          setBudgets(updatedBudgets);
          await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updatedBudgets));
        }
        
        // Save to storage
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
      } catch (error) {
        console.log('Error updating expense:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Delete expense
    deleteExpense: async (expenseId) => {
      try {
        setIsLoading(true);
        
        // Find the expense to delete
        const expenseToDelete = expenses.find(exp => exp.id === expenseId);
        if (!expenseToDelete) {
          throw new Error('Expense not found');
        }
        
        // Update expenses state
        const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
        setExpenses(updatedExpenses);
        
        // Update budget spent amount for the category
        const updatedBudgets = budgets.map(budget => {
          if (budget.category === expenseToDelete.category) {
            return {
              ...budget,
              spent: budget.spent - Math.abs(expenseToDelete.amount),
            };
          }
          return budget;
        });
        setBudgets(updatedBudgets);
        
        // Save to storage
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updatedBudgets));
      } catch (error) {
        console.log('Error deleting expense:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Update budget
    updateBudget: async (updatedBudgets) => {
      try {
        setIsLoading(true);
        
        // Update budgets state
        setBudgets(updatedBudgets);
        
        // Save to storage
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updatedBudgets));
      } catch (error) {
        console.log('Error updating budget:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Add goal
    addGoal: async (newGoal) => {
      try {
        setIsLoading(true);
        
        // Generate unique ID and add timestamp
        const goalWithId = {
          ...newGoal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          current: 0,
          progress: 0,
        };
        
        // Update goals state
        const updatedGoals = [...goals, goalWithId];
        setGoals(updatedGoals);
        
        // Save to storage
        await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
      } catch (error) {
        console.log('Error adding goal:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Update goal
    updateGoal: async (goalId, updatedData) => {
      try {
        setIsLoading(true);
        
        // Update goals state
        const updatedGoals = goals.map(goal => {
          if (goal.id === goalId) {
            const updatedGoal = { ...goal, ...updatedData };
            // Recalculate progress if current or target amount changed
            if (updatedData.current !== undefined || updatedData.target !== undefined) {
              const current = updatedData.current !== undefined ? updatedData.current : goal.current;
              const target = updatedData.target !== undefined ? updatedData.target : goal.target;
              updatedGoal.progress = (current / target) * 100;
            }
            return updatedGoal;
          }
          return goal;
        });
        setGoals(updatedGoals);
        
        // Save to storage
        await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
      } catch (error) {
        console.log('Error updating goal:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Delete goal
    deleteGoal: async (goalId) => {
      try {
        setIsLoading(true);
        
        // Update goals state
        const updatedGoals = goals.filter(goal => goal.id !== goalId);
        setGoals(updatedGoals);
        
        // Save to storage
        await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
      } catch (error) {
        console.log('Error deleting goal:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    
    // Get expense statistics
    getExpenseStats: (timeframe = 'month') => {
      // Filter expenses by timeframe
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
      
      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= now;
      });
      
      // Calculate total spent
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
      });
      
      return {
        totalSpent,
        categoryData,
        expenseCount: filteredExpenses.length,
      };
    },
  };

  return (
    <FinancialContext.Provider value={financialContext}>
      {children}
    </FinancialContext.Provider>
  );
};

export default FinancialProvider;
