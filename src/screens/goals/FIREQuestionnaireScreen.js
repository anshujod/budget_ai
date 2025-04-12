import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Slider } from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import OpenAIService from '../../services/OpenAIService';

/**
 * FIRE Questionnaire Screen
 * Collects user information for generating FIRE plan recommendations
 */
const FIREQuestionnaireScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    currentAge: 30,
    targetAge: 45,
    income: 75000,
    expenses: 50000,
    savings: 50000,
    investments: 100000,
    lifestyle: 'Moderate', // Options: Frugal, Moderate, Comfortable
    riskTolerance: 'Moderate' // Options: Conservative, Moderate, Aggressive
  });
  
  // Steps configuration
  const steps = [
    {
      title: 'Age Information',
      fields: ['currentAge', 'targetAge'],
      description: 'Let\'s start with your current age and when you\'d like to achieve financial independence.'
    },
    {
      title: 'Income & Expenses',
      fields: ['income', 'expenses'],
      description: 'Now, tell us about your annual income and expenses.'
    },
    {
      title: 'Current Finances',
      fields: ['savings', 'investments'],
      description: 'Let\'s assess your current financial situation.'
    },
    {
      title: 'Retirement Lifestyle',
      fields: ['lifestyle'],
      description: 'What kind of lifestyle do you envision in retirement?'
    },
    {
      title: 'Risk Tolerance',
      fields: ['riskTolerance'],
      description: 'Finally, how comfortable are you with investment risk?'
    }
  ];
  
  // Handle value changes
  const handleChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Navigate to next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Submit data to generate FIRE plan
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const result = await OpenAIService.generateFIREPlan(userData);
      
      if (result.success) {
        navigation.navigate('FIRERecommendations', { 
          recommendations: result.data,
          userData
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to generate recommendations. Please try again.');
      }
    } catch (error) {
      console.error('Error in FIRE plan generation:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render current step content
  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        
        {currentStepData.fields.map(field => renderField(field))}
      </View>
    );
  };
  
  // Render individual field based on type
  const renderField = (field) => {
    switch (field) {
      case 'currentAge':
      case 'targetAge':
        return (
          <View key={field} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field === 'currentAge' ? 'Current Age' : 'Target Retirement Age'}
            </Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={field === 'currentAge' ? 18 : userData.currentAge + 1}
                maximumValue={field === 'currentAge' ? 70 : 80}
                step={1}
                value={userData[field]}
                onValueChange={(value) => handleChange(field, value)}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.lightGray}
                thumbTintColor={COLORS.primary}
              />
              <Text style={styles.sliderValue}>{Math.round(userData[field])}</Text>
            </View>
          </View>
        );
        
      case 'income':
      case 'expenses':
      case 'savings':
      case 'investments':
        return (
          <View key={field} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {field === 'income' || field === 'expenses' ? ' (Annual)' : ''}
            </Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={field === 'income' || field === 'investments' ? 500000 : 300000}
                step={1000}
                value={userData[field]}
                onValueChange={(value) => handleChange(field, value)}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.lightGray}
                thumbTintColor={COLORS.primary}
              />
              <Text style={styles.sliderValue}>${Math.round(userData[field]).toLocaleString()}</Text>
            </View>
          </View>
        );
        
      case 'lifestyle':
        return (
          <View key={field} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Expected Lifestyle in Retirement</Text>
            <View style={styles.optionsContainer}>
              {['Frugal', 'Moderate', 'Comfortable'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    userData[field] === option && styles.selectedOption
                  ]}
                  onPress={() => handleChange(field, option)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      userData[field] === option && styles.selectedOptionText
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 'riskTolerance':
        return (
          <View key={field} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Investment Risk Tolerance</Text>
            <View style={styles.optionsContainer}>
              {['Conservative', 'Moderate', 'Aggressive'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    userData[field] === option && styles.selectedOption
                  ]}
                  onPress={() => handleChange(field, option)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      userData[field] === option && styles.selectedOptionText
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot,
              index === currentStep && styles.activeDot
            ]} 
          />
        ))}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FIRE Planning Assistant</Text>
      </View>
      
      {renderProgressIndicator()}
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {renderStepContent()}
      </ScrollView>
      
      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.nextBtn} 
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.nextBtnText}>
              {currentStep === steps.length - 1 ? 'Generate Plan' : 'Next'}
            </Text>
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: COLORS.white,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 12,
    height: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  stepContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  stepTitle: {
    ...FONTS.h2,
    marginBottom: 10,
    color: COLORS.text,
  },
  stepDescription: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 25,
  },
  fieldLabel: {
    ...FONTS.h4,
    marginBottom: 10,
    color: COLORS.text,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    ...FONTS.body3,
    minWidth: 80,
    textAlign: 'right',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  backBtnText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  nextBtn: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default FIREQuestionnaireScreen;
