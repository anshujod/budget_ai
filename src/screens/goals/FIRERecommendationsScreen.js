import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import { FinancialContext } from '../../context/FinancialContext';

/**
 * FIRE Recommendations Screen
 * Displays personalized FIRE plan recommendations and allows creating goals
 */
const FIRERecommendationsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { recommendations, userData } = route.params;
  const { addGoal } = useContext(FinancialContext);
  const [isCreatingGoals, setIsCreatingGoals] = useState(false);
  
  // Create FIRE goals based on recommendations
  const handleCreateGoals = async () => {
    setIsCreatingGoals(true);
    
    try {
      // Extract target amount and timeline from recommendations
      const targetAmount = extractTargetAmount(recommendations);
      const targetDate = calculateTargetDate(recommendations);
      
      // Create main FIRE goal
      const mainGoal = {
        name: "Financial Independence",
        description: "My path to FIRE (Financial Independence, Retire Early)",
        target: targetAmount,
        targetDate: targetDate,
        category: "FIRE",
        icon: "finance",
        color: COLORS.primary,
        milestones: extractMilestones(recommendations)
      };
      
      await addGoal(mainGoal);
      
      // Create milestone sub-goals if available
      if (mainGoal.milestones && mainGoal.milestones.length > 0) {
        for (const milestone of mainGoal.milestones) {
          const milestoneGoal = {
            name: milestone.name,
            description: milestone.description,
            target: milestone.amount,
            targetDate: milestone.date,
            category: "FIRE-Milestone",
            icon: "flag-checkered",
            color: COLORS.secondary,
            parentGoalId: mainGoal.id
          };
          
          await addGoal(milestoneGoal);
        }
      }
      
      Alert.alert(
        "Goals Created",
        "Your FIRE goals have been created successfully!",
        [
          { 
            text: "View Goals", 
            onPress: () => navigation.navigate('Goals')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating goals:', error);
      Alert.alert('Error', 'Failed to create goals. Please try again.');
    } finally {
      setIsCreatingGoals(false);
    }
  };
  
  // Extract target amount from recommendations
  const extractTargetAmount = (recommendations) => {
    // This is a simplified extraction - in a real app, you would use more robust parsing
    try {
      // Default fallback calculation based on user data
      const defaultAmount = userData.expenses * 25; // 25x annual expenses is a common FIRE target
      
      // Try to extract from timeline or savings rate sections
      const timelineText = recommendations.timeline || '';
      const savingsText = recommendations.savingsRate || '';
      
      // Look for currency amounts in the text
      const amountRegex = /\$([0-9,]+)/g;
      const timelineMatches = [...timelineText.matchAll(amountRegex)];
      const savingsMatches = [...savingsText.matchAll(amountRegex)];
      
      // Use the largest amount found as it's likely the target
      const allAmounts = [
        ...timelineMatches, 
        ...savingsMatches
      ].map(match => parseInt(match[1].replace(/,/g, ''), 10));
      
      if (allAmounts.length > 0) {
        return Math.max(...allAmounts);
      }
      
      return defaultAmount;
    } catch (error) {
      console.error('Error extracting target amount:', error);
      return userData.expenses * 25; // Fallback to 25x annual expenses
    }
  };
  
  // Calculate target date from recommendations
  const calculateTargetDate = (recommendations) => {
    try {
      // Default fallback calculation
      const defaultYears = userData.targetAge - userData.currentAge;
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + defaultYears);
      
      // Try to extract years from timeline
      const timelineText = recommendations.timeline || '';
      const yearsRegex = /(\d+)\s*years?/i;
      const match = timelineText.match(yearsRegex);
      
      if (match && match[1]) {
        const years = parseInt(match[1], 10);
        const targetDate = new Date();
        targetDate.setFullYear(targetDate.getFullYear() + years);
        return targetDate.toISOString();
      }
      
      return defaultDate.toISOString();
    } catch (error) {
      console.error('Error calculating target date:', error);
      // Fallback to target age
      const defaultYears = userData.targetAge - userData.currentAge;
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + defaultYears);
      return defaultDate.toISOString();
    }
  };
  
  // Extract milestones from recommendations
  const extractMilestones = (recommendations) => {
    try {
      const milestonesText = recommendations.milestones || '';
      const milestones = [];
      
      // Simple milestone extraction - in a real app, you would use more robust parsing
      // Look for numbered or bulleted items
      const milestoneRegex = /[•\-\d]+\s*(.+?)(?=\n[•\-\d]+|\n\n|$)/g;
      const matches = [...milestonesText.matchAll(milestoneRegex)];
      
      // Calculate target amount from earlier
      const targetAmount = extractTargetAmount(recommendations);
      const targetDate = new Date(calculateTargetDate(recommendations));
      const currentDate = new Date();
      const totalMonths = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                          (targetDate.getMonth() - currentDate.getMonth());
      
      matches.forEach((match, index) => {
        const milestoneText = match[1].trim();
        
        // Create milestone with estimated amount and date
        const milestone = {
          name: `Milestone ${index + 1}`,
          description: milestoneText,
          amount: Math.round(targetAmount * ((index + 1) / (matches.length + 1))),
          date: new Date(currentDate.getTime() + (totalMonths * (index + 1) / (matches.length + 1)) * 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        milestones.push(milestone);
      });
      
      return milestones;
    } catch (error) {
      console.error('Error extracting milestones:', error);
      return [];
    }
  };
  
  // Render recommendation sections
  const renderSection = (title, content) => {
    if (!content) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your FIRE Plan</Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="fire" size={40} color={COLORS.primary} />
          <Text style={styles.summaryTitle}>Financial Independence Plan</Text>
          <Text style={styles.summarySubtitle}>
            Based on your current situation, here's your personalized path to FIRE
          </Text>
        </View>
        
        {renderSection('FIRE Approach', recommendations.explanation)}
        {renderSection('Required Savings Rate', recommendations.savingsRate)}
        {renderSection('Timeline to Financial Independence', recommendations.timeline)}
        {renderSection('Key Milestones', recommendations.milestones)}
        {renderSection('Investment Allocation', recommendations.investments)}
        {renderSection('Additional Recommendations', recommendations.recommendations)}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.createGoalsBtn} 
          onPress={handleCreateGoals}
          disabled={isCreatingGoals}
        >
          {isCreatingGoals ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="flag-plus" size={20} color={COLORS.white} style={styles.btnIcon} />
              <Text style={styles.createGoalsBtnText}>Create FIRE Goals</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    ...FONTS.h2,
    marginLeft: 15,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryTitle: {
    ...FONTS.h2,
    marginTop: 10,
    marginBottom: 5,
    color: COLORS.text,
    textAlign: 'center',
  },
  summarySubtitle: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: 10,
    color: COLORS.text,
  },
  sectionContent: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  createGoalsBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 10,
  },
  createGoalsBtnText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default FIRERecommendationsScreen;
