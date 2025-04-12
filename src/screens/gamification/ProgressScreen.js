import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';
import { useAuth } from '../../context/AuthContext';

// Import a charting library
// Note: In a real implementation, you would need to install this package
// npm install react-native-chart-kit
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';

const ProgressScreen = ({ navigation }) => {
  const { expenses, budgets, goals } = useFinancial();
  const { userData } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedChart, setSelectedChart] = useState('savings');
  
  const screenWidth = Dimensions.get('window').width - (SPACING.lg * 2);

  // Generate chart data based on selected timeframe and chart type
  const getChartData = () => {
    switch (selectedChart) {
      case 'savings':
        return getSavingsProgressData();
      case 'spending':
        return getSpendingData();
      case 'budget':
        return getBudgetComparisonData();
      case 'achievements':
        return getAchievementsData();
      default:
        return getSavingsProgressData();
    }
  };

  const getSavingsProgressData = () => {
    // In a real app, this would use actual historical data
    // For this simulation, we'll create sample data
    
    // Sample data for savings progress over time
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    // Generate data for each goal
    const datasets = [];
    
    if (goals.length > 0) {
      // Take up to 3 goals for the chart
      const displayGoals = goals.slice(0, 3);
      
      displayGoals.forEach((goal, index) => {
        // Generate simulated historical progress
        const data = [];
        const currentProgress = goal.progress / 100;
        
        // Create a progression that leads up to the current progress
        for (let i = 0; i < 6; i++) {
          if (i === 5) {
            data.push(currentProgress);
          } else {
            // Random progress that's less than the current progress
            data.push(Math.random() * currentProgress * 0.8);
          }
        }
        
        datasets.push({
          data,
          color: (opacity = 1) => {
            const colors = [COLORS.primary, COLORS.secondary, COLORS.accent];
            return colors[index % colors.length];
          },
          strokeWidth: 2,
        });
      });
      
      return {
        labels,
        datasets,
        legend: displayGoals.map(goal => goal.name)
      };
    } else {
      // Default data if no goals exist
      return {
        labels,
        datasets: [{
          data: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
          color: () => COLORS.primary,
          strokeWidth: 2
        }],
        legend: ['Sample Goal']
      };
    }
  };

  const getSpendingData = () => {
    // In a real app, this would use actual historical data
    // For this simulation, we'll create sample data
    
    // Sample data for spending by category
    const spendingByCategory = {
      Housing: 1200,
      Food: 500,
      Transportation: 300,
      Entertainment: 200,
      Utilities: 150,
      Other: 250
    };
    
    // Convert to format needed for pie chart
    const pieData = Object.keys(spendingByCategory).map((key, index) => {
      const colors = [
        COLORS.primary,
        COLORS.secondary,
        COLORS.accent,
        COLORS.success,
        COLORS.warning,
        COLORS.error
      ];
      
      return {
        name: key,
        population: spendingByCategory[key],
        color: colors[index % colors.length],
        legendFontColor: COLORS.textPrimary,
        legendFontSize: 12
      };
    });
    
    return pieData;
  };

  const getBudgetComparisonData = () => {
    // In a real app, this would use actual budget vs. spending data
    // For this simulation, we'll create sample data
    
    const data = {
      labels: ['Housing', 'Food', 'Trans', 'Ent', 'Utils', 'Other'],
      datasets: [
        {
          data: [1200, 500, 300, 200, 150, 250], // Actual spending
          color: (opacity = 1) => COLORS.primary,
        },
        {
          data: [1000, 600, 350, 150, 200, 300], // Budget
          color: (opacity = 1) => COLORS.secondary,
        }
      ],
      legend: ['Actual', 'Budget']
    };
    
    return data;
  };

  const getAchievementsData = () => {
    // In a real app, this would use actual achievement data
    // For this simulation, we'll create sample data
    
    const achievementCategories = {
      Tracking: 4,
      Budgeting: 3,
      Savings: 5,
      Insights: 2,
      Special: 3
    };
    
    // Calculate completion percentages
    const completedByCategory = {
      Tracking: 3,
      Budgeting: 2,
      Savings: 2,
      Insights: 1,
      Special: 0
    };
    
    // Convert to format needed for progress chart
    const data = {
      labels: Object.keys(achievementCategories),
      data: Object.keys(achievementCategories).map(key => 
        completedByCategory[key] / achievementCategories[key]
      )
    };
    
    return data;
  };

  const renderSavingsChart = () => {
    const chartData = getChartData();
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Savings Progress Over Time</Text>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: COLORS.white,
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            decimalPlaces: 1,
            color: (opacity = 1) => COLORS.textPrimary,
            labelColor: (opacity = 1) => COLORS.textSecondary,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: COLORS.white
            }
          }}
          bezier
          style={styles.chart}
        />
        <View style={styles.legendContainer}>
          {chartData.legend.map((label, index) => (
            <View key={index} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor,
                  { backgroundColor: chartData.datasets[index].color(1) }
                ]} 
              />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSpendingChart = () => {
    const chartData = getChartData();
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        <PieChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: COLORS.white,
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            color: (opacity = 1) => COLORS.textPrimary,
            labelColor: (opacity = 1) => COLORS.textSecondary,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  };

  const renderBudgetChart = () => {
    const chartData = getChartData();
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Budget vs. Actual Spending</Text>
        <BarChart
          data={chartData}
          width={screenWidth}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: COLORS.white,
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            decimalPlaces: 0,
            color: (opacity = 1) => COLORS.textPrimary,
            labelColor: (opacity = 1) => COLORS.textSecondary,
            style: {
              borderRadius: 16
            },
            barPercentage: 0.5,
          }}
          style={styles.chart}
        />
        <View style={styles.legendContainer}>
          {chartData.legend.map((label, index) => (
            <View key={index} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor,
                  { backgroundColor: chartData.datasets[index].color(1) }
                ]} 
              />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAchievementsChart = () => {
    const chartData = getChartData();
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Achievements Progress</Text>
        <ProgressChart
          data={chartData}
          width={screenWidth}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundColor: COLORS.white,
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            decimalPlaces: 1,
            color: (opacity = 1) => COLORS.primary,
            labelColor: (opacity = 1) => COLORS.textSecondary,
            style: {
              borderRadius: 16
            },
          }}
          hideLegend={false}
          style={styles.chart}
        />
      </View>
    );
  };

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'savings':
        return renderSavingsChart();
      case 'spending':
        return renderSpendingChart();
      case 'budget':
        return renderBudgetChart();
      case 'achievements':
        return renderAchievementsChart();
      default:
        return renderSavingsChart();
    }
  };

  const renderFinancialStats = () => {
    // In a real app, these would be calculated from actual data
    // For this simulation, we'll use sample data
    
    const stats = {
      savingsRate: 18,
      expenseReduction: 12,
      budgetAdherence: 85,
      goalProgress: 42
    };
    
    return (
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Financial Stats</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.savingsRate}%</Text>
            <Text style={styles.statLabel}>Savings Rate</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.expenseReduction}%</Text>
            <Text style={styles.statLabel}>Expense Reduction</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.budgetAdherence}%</Text>
            <Text style={styles.statLabel}>Budget Adherence</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.goalProgress}%</Text>
            <Text style={styles.statLabel}>Goal Progress</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStreaks = () => {
    // In a real app, these would be calculated from actual data
    // For this simulation, we'll use sample data
    
    const streaks = {
      expenseTracking: 14,
      budgetAdherence: 7,
      savingsContributions: 4
    };
    
    return (
      <View style={styles.streaksSection}>
        <Text style={styles.sectionTitle}>Your Streaks</Text>
        
        <View style={styles.streaksContainer}>
          <View style={styles.streakItem}>
            <View style={styles.streakIconContainer}>
              <MaterialCommunityIcons name="calendar-check" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakValue}>{streaks.expenseTracking} days</Text>
              <Text style={styles.streakLabel}>Expense Tracking</Text>
            </View>
          </View>
          
          <View style={styles.streakItem}>
            <View style={styles.streakIconContainer}>
              <MaterialCommunityIcons name="shield-check" size={24} color={COLORS.success} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakValue}>{streaks.budgetAdherence} days</Text>
              <Text style={styles.streakLabel}>Budget Adherence</Text>
            </View>
          </View>
          
          <View style={styles.streakItem}>
            <View style={styles.streakIconContainer}>
              <MaterialCommunityIcons name="piggy-bank" size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakValue}>{streaks.savingsContributions} weeks</Text>
              <Text style={styles.streakLabel}>Savings Contributions</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress Tracking</Text>
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
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.chartTypeContainer}>
          <TouchableOpacity 
            style={[
              styles.chartTypeButton,
              selectedChart === 'savings' && styles.chartTypeButtonSelected
            ]}
            onPress={() => setSelectedChart('savings')}
          >
            <MaterialCommunityIcons 
              name="chart-line" 
              size={20} 
              color={selectedChart === 'savings' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text 
              style={[
                styles.chartTypeText,
                selectedChart === 'savings' && styles.chartTypeTextSelected
              ]}
            >
              Savings
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.chartTypeButton,
              selectedChart === 'spending' && styles.chartTypeButtonSelected
            ]}
            onPress={() => setSelectedChart('spending')}
          >
            <MaterialCommunityIcons 
              name="chart-pie" 
              size={20} 
              color={selectedChart === 'spending' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text 
              style={[
                styles.chartTypeText,
                selectedChart === 'spending' && styles.chartTypeTextSelected
              ]}
            >
              Spending
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.chartTypeButton,
              selectedChart === 'budget' && styles.chartTypeButtonSelected
            ]}
            onPress={() => setSelectedChart('budget')}
          >
            <MaterialCommunityIcons 
              name="chart-bar" 
              size={20} 
              color={selectedChart === 'budget' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text 
              style={[
                styles.chartTypeText,
                selectedChart === 'budget' && styles.chartTypeTextSelected
              ]}
            >
              Budget
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.chartTypeButton,
              selectedChart === 'achievements' && styles.chartTypeButtonSelected
            ]}
            onPress={() => setSelectedChart('achievements')}
          >
            <MaterialCommunityIcons 
              name="trophy" 
              size={20} 
              color={selectedChart === 'achievements' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text 
              style={[
                styles.chartTypeText,
                selectedChart === 'achievements' && styles.chartTypeTextSelected
              ]}
            >
              Achievements
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderSelectedChart()}
        
        {renderFinancialStats()}
        
        {renderStreaks()}
        
        <View style={styles.spacer} />
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
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  timeframeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xxs,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  timeframeButtonSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  timeframeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  timeframeButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  chartTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xxs,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  chartTypeButtonSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  chartTypeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xxs,
  },
  chartTypeTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  chartTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  chart: {
    borderRadius: SPACING.md,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  statsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  streaksSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  streaksContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  streakContent: {
    flex: 1,
  },
  streakValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  streakLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  spacer: {
    height: SPACING.xxl,
  },
});

export default ProgressScreen;
