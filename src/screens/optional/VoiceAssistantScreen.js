import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';
import { useAuth } from '../../context/AuthContext';

const VoiceAssistantScreen = ({ navigation }) => {
  const { expenses, budgets, goals } = useFinancial();
  const { userData } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    // Load conversation history
    // In a real app, this would come from persistent storage
    const sampleHistory = [
      {
        query: "How much did I spend on food this month?",
        response: "You've spent $342.18 on food this month, which is 15% of your total spending."
      },
      {
        query: "What's my savings goal progress?",
        response: "Your emergency fund is 45% complete, and your vacation fund is 30% complete."
      }
    ];
    
    setHistory(sampleHistory);
  }, []);

  const handleStartListening = () => {
    setIsListening(true);
    
    // In a real app, this would use the device's speech recognition API
    // For this simulation, we'll use a timeout to simulate listening
    setTimeout(() => {
      setIsListening(false);
      setTranscript("How am I doing with my budget this month?");
      processQuery("How am I doing with my budget this month?");
    }, 2000);
  };

  const handleStopListening = () => {
    setIsListening(false);
    
    if (transcript) {
      processQuery(transcript);
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      processQuery(manualInput);
      setManualInput('');
    }
  };

  const processQuery = (query) => {
    setIsProcessing(true);
    
    // In a real app, this would send the query to a backend service
    // For this simulation, we'll use a timeout to simulate processing
    setTimeout(() => {
      // Generate a response based on the query
      const generatedResponse = generateResponse(query);
      setResponse(generatedResponse);
      
      // Add to history
      setHistory(prevHistory => [
        { query, response: generatedResponse },
        ...prevHistory
      ]);
      
      setIsProcessing(false);
    }, 1500);
  };

  const generateResponse = (query) => {
    // In a real app, this would use NLP to understand and respond to the query
    // For this simulation, we'll use simple keyword matching
    
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('budget') && lowerQuery.includes('month')) {
      return "You're doing well with your budget this month! You're currently under budget in 5 categories and over budget in 2 categories. Your biggest overspending is in the Entertainment category, where you've spent $45 more than planned.";
    }
    
    if (lowerQuery.includes('spend') && lowerQuery.includes('food')) {
      return "You've spent $342.18 on food this month, which is 15% of your total spending. This is $57.82 under your monthly food budget.";
    }
    
    if (lowerQuery.includes('savings') || lowerQuery.includes('goals')) {
      return "You have 3 active savings goals. Your emergency fund is 45% complete, your vacation fund is 30% complete, and your new laptop fund is 75% complete. At your current saving rate, you'll reach your laptop goal in approximately 2 months.";
    }
    
    if (lowerQuery.includes('expense') || lowerQuery.includes('transaction')) {
      return "Your last 3 expenses were: $45.23 at Grocery Store yesterday, $12.50 at Coffee Shop this morning, and $89.99 for Internet Bill on Monday.";
    }
    
    if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
      return "Based on your current income and expenses, you could potentially save an additional $150 per month by reducing your dining out and subscription expenses.";
    }
    
    if (lowerQuery.includes('tip') || lowerQuery.includes('advice')) {
      return "Here's a financial tip: Consider setting up automatic transfers to your savings goals on payday. This 'pay yourself first' approach ensures consistent progress toward your financial goals.";
    }
    
    // Default response
    return "I can help you track expenses, monitor your budget, check your savings goals, and provide financial insights. Try asking something like 'How much did I spend on food?' or 'What's my savings goal progress?'";
  };

  const renderHelpModal = () => {
    return (
      <Modal
        visible={showHelp}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Voice Assistant Help</Text>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.helpSectionTitle}>What You Can Ask</Text>
              
              <View style={styles.helpItem}>
                <MaterialCommunityIcons name="cash" size={20} color={COLORS.primary} style={styles.helpIcon} />
                <View style={styles.helpContent}>
                  <Text style={styles.helpItemTitle}>Expense Tracking</Text>
                  <Text style={styles.helpItemExample}>"How much did I spend on food this month?"</Text>
                  <Text style={styles.helpItemExample}>"What were my recent transactions?"</Text>
                </View>
              </View>
              
              <View style={styles.helpItem}>
                <MaterialCommunityIcons name="calculator" size={20} color={COLORS.primary} style={styles.helpIcon} />
                <View style={styles.helpContent}>
                  <Text style={styles.helpItemTitle}>Budget Monitoring</Text>
                  <Text style={styles.helpItemExample}>"How am I doing with my budget?"</Text>
                  <Text style={styles.helpItemExample}>"Which categories am I overspending in?"</Text>
                </View>
              </View>
              
              <View style={styles.helpItem}>
                <MaterialCommunityIcons name="flag" size={20} color={COLORS.primary} style={styles.helpIcon} />
                <View style={styles.helpContent}>
                  <Text style={styles.helpItemTitle}>Savings Goals</Text>
                  <Text style={styles.helpItemExample}>"What's my progress on my savings goals?"</Text>
                  <Text style={styles.helpItemExample}>"When will I reach my vacation fund goal?"</Text>
                </View>
              </View>
              
              <View style={styles.helpItem}>
                <MaterialCommunityIcons name="lightbulb-on" size={20} color={COLORS.primary} style={styles.helpIcon} />
                <View style={styles.helpContent}>
                  <Text style={styles.helpItemTitle}>Financial Insights</Text>
                  <Text style={styles.helpItemExample}>"How can I save more money?"</Text>
                  <Text style={styles.helpItemExample}>"Give me a financial tip."</Text>
                </View>
              </View>
              
              <Text style={styles.helpNote}>
                Note: You can type your questions using the text input if you prefer not to use voice.
              </Text>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Assistant</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelp(true)}
        >
          <MaterialCommunityIcons name="help-circle" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.assistantContainer}>
          <View style={styles.assistantIconContainer}>
            <MaterialCommunityIcons name="robot" size={48} color={COLORS.white} />
          </View>
          <Text style={styles.assistantTitle}>BudgetAI Assistant</Text>
          <Text style={styles.assistantSubtitle}>
            Ask me anything about your finances
          </Text>
        </View>
        
        <View style={styles.transcriptContainer}>
          {transcript ? (
            <Text style={styles.transcriptText}>{transcript}</Text>
          ) : (
            <Text style={styles.placeholderText}>
              {isListening ? "Listening..." : "Tap the microphone to ask a question"}
            </Text>
          )}
        </View>
        
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Processing your question...</Text>
          </View>
        ) : response ? (
          <View style={styles.responseContainer}>
            <View style={styles.responseHeader}>
              <MaterialCommunityIcons name="robot" size={24} color={COLORS.primary} />
              <Text style={styles.responseHeaderText}>BudgetAI Response</Text>
            </View>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}
        
        <View style={styles.manualInputContainer}>
          <TextInput
            style={styles.manualInput}
            value={manualInput}
            onChangeText={setManualInput}
            placeholder="Type your question here..."
            placeholderTextColor={COLORS.textTertiary}
            returnKeyType="send"
            onSubmitEditing={handleManualSubmit}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleManualSubmit}
            disabled={!manualInput.trim()}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={20} 
              color={manualInput.trim() ? COLORS.white : COLORS.lightGray} 
            />
          </TouchableOpacity>
        </View>
        
        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Recent Conversations</Text>
            
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyQuery}>
                  <MaterialCommunityIcons name="account" size={16} color={COLORS.textSecondary} style={styles.historyIcon} />
                  <Text style={styles.historyQueryText}>{item.query}</Text>
                </View>
                <View style={styles.historyResponse}>
                  <MaterialCommunityIcons name="robot" size={16} color={COLORS.primary} style={styles.historyIcon} />
                  <Text style={styles.historyResponseText}>{item.response}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.microphoneContainer}>
        <TouchableOpacity
          style={[
            styles.microphoneButton,
            isListening && styles.microphoneButtonActive
          ]}
          onPress={isListening ? handleStopListening : handleStartListening}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name={isListening ? "stop" : "microphone"} 
            size={32} 
            color={COLORS.white} 
          />
        </TouchableOpacity>
        <Text style={styles.microphoneText}>
          {isListening ? "Tap to stop" : "Tap to speak"}
        </Text>
      </View>
      
      {renderHelpModal()}
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
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  assistantContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  assistantIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  assistantTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  assistantSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  transcriptContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    minHeight: 80,
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  transcriptText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  processingText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  responseContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  responseHeaderText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  responseText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  manualInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  manualInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContainer: {
    marginBottom: SPACING.lg,
  },
  historyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  historyItem: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  historyQuery: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  historyIcon: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  historyQueryText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  historyResponse: {
    flexDirection: 'row',
  },
  historyResponseText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  microphoneContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  microphoneButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.medium,
  },
  microphoneButtonActive: {
    backgroundColor: COLORS.error,
  },
  microphoneText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  modalContent: {
    maxHeight: 400,
  },
  helpSectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  helpItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  helpIcon: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  helpContent: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  helpItemExample: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxs,
  },
  helpNote: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  closeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
});

export default VoiceAssistantScreen;
