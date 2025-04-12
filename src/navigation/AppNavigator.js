/**
 * App Navigator
 * 
 * This file defines the navigation structure for the BudgetAI app,
 * including authentication flow, main tabs, and screen stacks.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ROUTES } from '../constants/appConstants';
import { COLORS } from '../styles/theme';

// Auth Screens (to be implemented)
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Tab Screens (to be implemented)
import HomeScreen from '../screens/main/HomeScreen';
import ExpensesScreen from '../screens/main/ExpensesScreen';
import BudgetScreen from '../screens/main/BudgetScreen';
import GoalsScreen from '../screens/goals/GoalsScreen';
import FIREQuestionnaireScreen from '../screens/goals/FIREQuestionnaireScreen';
import FIRERecommendationsScreen from '../screens/goals/FIRERecommendationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Additional Screens (to be implemented)
import ExpenseDetailsScreen from '../screens/expenses/ExpenseDetailsScreen';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';
import EditExpenseScreen from '../screens/expenses/EditExpenseScreen';
import BudgetDetailsScreen from '../screens/budget/BudgetDetailsScreen';
import EditBudgetScreen from '../screens/budget/EditBudgetScreen';
import GoalDetailsScreen from '../screens/goals/GoalDetailsScreen';
import AddGoalScreen from '../screens/goals/AddGoalScreen';
import EditGoalScreen from '../screens/goals/EditGoalScreen';
import AIInsightsScreen from '../screens/insights/AIInsightsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import AchievementsScreen from '../screens/gamification/AchievementsScreen';
import CommunityScreen from '../screens/community/CommunityScreen';

// Create navigation stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
    <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Home Stack
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name={ROUTES.HOME} 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen name={ROUTES.AI_INSIGHTS} component={AIInsightsScreen} />
  </Stack.Navigator>
);

// Expenses Stack
const ExpensesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name={ROUTES.EXPENSES} 
      component={ExpensesScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen name={ROUTES.EXPENSE_DETAILS} component={ExpenseDetailsScreen} />
    <Stack.Screen name={ROUTES.ADD_EXPENSE} component={AddExpenseScreen} />
    <Stack.Screen name={ROUTES.EDIT_EXPENSE} component={EditExpenseScreen} />
  </Stack.Navigator>
);

// Budget Stack
const BudgetStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name={ROUTES.BUDGET} 
      component={BudgetScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen name={ROUTES.BUDGET_DETAILS} component={BudgetDetailsScreen} />
    <Stack.Screen name={ROUTES.EDIT_BUDGET} component={EditBudgetScreen} />
  </Stack.Navigator>
);

// Goals Stack
const GoalsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name={ROUTES.GOALS} 
      component={GoalsScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen name={ROUTES.GOAL_DETAILS} component={GoalDetailsScreen} />
    <Stack.Screen name={ROUTES.ADD_GOAL} component={AddGoalScreen} />
    <Stack.Screen name={ROUTES.EDIT_GOAL} component={EditGoalScreen} />
   <Stack.Screen name={ROUTES.FIRE_QUESTIONNAIRE} component={FIREQuestionnaireScreen} />
   <Stack.Screen name={ROUTES.FIRE_RECOMMENDATIONS} component={FIRERecommendationsScreen} />
 </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name={ROUTES.PROFILE} 
      component={ProfileScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
    <Stack.Screen name={ROUTES.ACHIEVEMENTS} component={AchievementsScreen} />
    <Stack.Screen name={ROUTES.COMMUNITY} component={CommunityScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeStack') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'ExpensesStack') {
          iconName = focused ? 'cash-multiple' : 'cash-multiple';
        } else if (route.name === 'BudgetStack') {
          iconName = focused ? 'chart-pie' : 'chart-pie';
        } else if (route.name === 'GoalsStack') {
          iconName = focused ? 'flag' : 'flag-outline';
        } else if (route.name === 'ProfileStack') {
          iconName = focused ? 'account' : 'account-outline';
        }

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.darkGray,
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        paddingTop: 5,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="HomeStack" 
      component={HomeStack} 
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen 
      name="ExpensesStack" 
      component={ExpensesStack} 
      options={{ tabBarLabel: 'Expenses' }}
    />
    <Tab.Screen 
      name="BudgetStack" 
      component={BudgetStack} 
      options={{ tabBarLabel: 'Budget' }}
    />
    <Tab.Screen 
      name="GoalsStack" 
      component={GoalsStack} 
      options={{ tabBarLabel: 'Goals' }}
    />
    <Tab.Screen 
      name="ProfileStack" 
      component={ProfileStack} 
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  // This would be replaced with actual authentication state
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainApp" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
