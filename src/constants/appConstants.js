/**
 * BudgetAI App Constants
 * 
 * This file contains application-wide constants used throughout the app.
 */

// App information
export const APP_INFO = {
  name: 'BudgetAI',
  slogan: 'Smart budgeting powered by AI',
  version: '1.0.0',
};

// Navigation routes
export const ROUTES = {
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main tabs
  HOME: 'Home',
  EXPENSES: 'Expenses',
  BUDGET: 'Budget',
  GOALS: 'Goals',
  PROFILE: 'Profile',
  
  // Screens
  EXPENSE_DETAILS: 'ExpenseDetails',
  ADD_EXPENSE: 'AddExpense',
  EDIT_EXPENSE: 'EditExpense',
  BUDGET_DETAILS: 'BudgetDetails',
  EDIT_BUDGET: 'EditBudget',
  GOAL_DETAILS: 'GoalDetails',
  ADD_GOAL: 'AddGoal',
  EDIT_GOAL: 'EditGoal',
  AI_INSIGHTS: 'AIInsights',
  SETTINGS: 'Settings',
  NOTIFICATIONS: 'Notifications',
  ACHIEVEMENTS: 'Achievements',
  COMMUNITY: 'Community',
};

// Expense categories
export const EXPENSE_CATEGORIES = [
  { id: 'housing', name: 'Housing', icon: 'home' },
  { id: 'transportation', name: 'Transportation', icon: 'car' },
  { id: 'food', name: 'Food & Dining', icon: 'food' },
  { id: 'utilities', name: 'Utilities', icon: 'flash' },
  { id: 'healthcare', name: 'Healthcare', icon: 'medical-bag' },
  { id: 'personal', name: 'Personal', icon: 'account' },
  { id: 'entertainment', name: 'Entertainment', icon: 'movie' },
  { id: 'education', name: 'Education', icon: 'school' },
  { id: 'savings', name: 'Savings', icon: 'piggy-bank' },
  { id: 'other', name: 'Other', icon: 'dots-horizontal' },
];

// Goal types
export const GOAL_TYPES = [
  { id: 'emergency', name: 'Emergency Fund', icon: 'shield' },
  { id: 'vacation', name: 'Vacation', icon: 'airplane' },
  { id: 'car', name: 'Car', icon: 'car' },
  { id: 'home', name: 'Home', icon: 'home' },
  { id: 'education', name: 'Education', icon: 'school' },
  { id: 'retirement', name: 'Retirement', icon: 'account-clock' },
  { id: 'wedding', name: 'Wedding', icon: 'ring' },
  { id: 'debt', name: 'Debt Payoff', icon: 'credit-card-off' },
  { id: 'custom', name: 'Custom', icon: 'star' },
];

// Achievement types
export const ACHIEVEMENTS = {
  BUDGET_STREAK: 'budget_streak',
  EXPENSE_TRACKING: 'expense_tracking',
  GOAL_COMPLETION: 'goal_completion',
  SAVINGS_MILESTONE: 'savings_milestone',
  APP_USAGE: 'app_usage',
};

// Default budget allocation percentages (50/30/20 rule)
export const DEFAULT_BUDGET_ALLOCATION = {
  needs: 0.5, // 50% for needs (housing, utilities, groceries, etc.)
  wants: 0.3, // 30% for wants (entertainment, dining out, etc.)
  savings: 0.2, // 20% for savings and debt repayment
};

// API endpoints (would be replaced with actual endpoints in production)
export const API = {
  BASE_URL: 'https://api.budgetai.example.com',
  AUTH: '/auth',
  USERS: '/users',
  EXPENSES: '/expenses',
  BUDGETS: '/budgets',
  GOALS: '/goals',
  INSIGHTS: '/insights',
  ACHIEVEMENTS: '/achievements',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  EXPENSES: 'expenses',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  SETTINGS: 'settings',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};

// Timeframes for reports and insights
export const TIMEFRAMES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
};

// Currency formatting options
export const CURRENCY_FORMAT = {
  USD: { locale: 'en-US', currency: 'USD' },
  EUR: { locale: 'de-DE', currency: 'EUR' },
  GBP: { locale: 'en-GB', currency: 'GBP' },
  JPY: { locale: 'ja-JP', currency: 'JPY' },
  CAD: { locale: 'en-CA', currency: 'CAD' },
  AUD: { locale: 'en-AU', currency: 'AUD' },
  DEFAULT: { locale: 'en-US', currency: 'USD' },
};

// App permissions
export const PERMISSIONS = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photo_library',
  NOTIFICATIONS: 'notifications',
  LOCATION: 'location',
  CONTACTS: 'contacts',
};

// Default app settings
export const DEFAULT_SETTINGS = {
  theme: 'light',
  currency: 'USD',
  notifications: true,
  biometricAuth: false,
  darkMode: false,
  language: 'en',
};

export default {
  APP_INFO,
  ROUTES,
  EXPENSE_CATEGORIES,
  GOAL_TYPES,
  ACHIEVEMENTS,
  DEFAULT_BUDGET_ALLOCATION,
  API,
  STORAGE_KEYS,
  TIMEFRAMES,
  CURRENCY_FORMAT,
  PERMISSIONS,
  DEFAULT_SETTINGS,
};
