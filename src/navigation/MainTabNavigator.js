import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';
import { ROUTES } from '../constants/appConstants';

// Import screens (to be created)
import HomeScreen from '../screens/main/HomeScreen';
import ExpensesScreen from '../screens/main/ExpensesScreen';
import BudgetScreen from '../screens/main/BudgetScreen';
import GoalsScreen from '../screens/main/GoalsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === ROUTES.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.EXPENSES) {
            iconName = focused ? 'cash-multiple' : 'cash-multiple';
          } else if (route.name === ROUTES.BUDGET) {
            iconName = focused ? 'chart-pie' : 'chart-pie';
          } else if (route.name === ROUTES.GOALS) {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === ROUTES.PROFILE) {
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
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.EXPENSES} component={ExpensesScreen} />
      <Tab.Screen name={ROUTES.BUDGET} component={BudgetScreen} />
      <Tab.Screen name={ROUTES.GOALS} component={GoalsScreen} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
