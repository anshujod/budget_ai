import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';

const BankSyncScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: '1', name: 'Main Checking', institution: 'Chase Bank', isConnected: true, balance: 2450.75, lastSync: '2025-04-10T10:30:00Z' },
    { id: '2', name: 'Savings', institution: 'Chase Bank', isConnected: true, balance: 5680.42, lastSync: '2025-04-10T10:30:00Z' },
    { id: '3', name: 'Credit Card', institution: 'American Express', isConnected: false, balance: 0, lastSync: null },
  ]);

  // Simulate bank sync process
  const handleSyncAccounts = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSyncing(false);
            
            // Update last sync time for connected accounts
            const now = new Date().toISOString();
            setConnectedAccounts(prev => 
              prev.map(account => 
                account.isConnected 
                  ? { ...account, lastSync: now } 
                  : account
              )
            );
            
            // Show success message
            Alert.alert(
              'Sync Complete',
              'Your accounts have been successfully synchronized.',
              [{ text: 'OK' }]
            );
          }, 500);
        }
        return newProgress;
      });
    }, 300);
  };

  // Toggle account connection
  const toggleAccountConnection = (accountId) => {
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, isConnected: !account.isConnected } 
          : account
      )
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Simulate adding a new account
  const handleAddAccount = () => {
    // In a real app, this would open a flow to connect to a bank
    Alert.alert(
      'Connect New Account',
      'This would open a secure connection to your bank. For this demo, we\'ll simulate adding a new account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Demo Account', 
          onPress: () => {
            setIsLoading(true);
            
            // Simulate API delay
            setTimeout(() => {
              const newAccount = {
                id: Date.now().toString(),
                name: 'New Checking',
                institution: 'Wells Fargo',
                isConnected: true,
                balance: 1250.00,
                lastSync: new Date().toISOString()
              };
              
              setConnectedAccounts(prev => [...prev, newAccount]);
              setIsLoading(false);
              
              Alert.alert('Account Added', 'New account has been successfully connected.');
            }, 1500);
          }
        }
      ]
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
        <Text style={styles.headerTitle}>Bank Accounts</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {isSyncing && (
          <View style={styles.syncProgressContainer}>
            <Text style={styles.syncProgressText}>Syncing accounts... {syncProgress}%</Text>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${syncProgress}%` }
                ]} 
              />
            </View>
          </View>
        )}
        
        <View style={styles.accountsContainer}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          
          {connectedAccounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.institutionName}>{account.institution}</Text>
                </View>
                <Switch
                  value={account.isConnected}
                  onValueChange={() => toggleAccountConnection(account.id)}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                  thumbColor={account.isConnected ? COLORS.primary : COLORS.white}
                />
              </View>
              
              {account.isConnected && (
                <>
                  <View style={styles.divider} />
                  
                  <View style={styles.accountDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Current Balance</Text>
                      <Text style={styles.balanceText}>{formatCurrency(account.balance)}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Last Synced</Text>
                      <Text style={styles.syncTimeText}>{formatDate(account.lastSync)}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addAccountButton}
            onPress={handleAddAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <>
                <MaterialCommunityIcons name="plus" size={20} color={COLORS.primary} />
                <Text style={styles.addAccountText}>Connect New Account</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.syncSection}>
          <Text style={styles.sectionTitle}>Automatic Sync</Text>
          
          <View style={styles.syncCard}>
            <Text style={styles.syncDescription}>
              Keep your accounts up to date by enabling automatic synchronization. Your transactions will be imported regularly.
            </Text>
            
            <TouchableOpacity 
              style={styles.syncButton}
              onPress={handleSyncAccounts}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <MaterialCommunityIcons name="sync" size={20} color={COLORS.white} />
                  <Text style={styles.syncButtonText}>Sync Now</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Security Information</Text>
          
          <View style={styles.securityCard}>
            <View style={styles.securityIconContainer}>
              <MaterialCommunityIcons name="shield-check" size={32} color={COLORS.primary} />
            </View>
            
            <Text style={styles.securityTitle}>Your Data is Secure</Text>
            
            <Text style={styles.securityDescription}>
              BudgetAI uses bank-level encryption to protect your financial data. We never store your bank credentials and use read-only access to your transaction history.
            </Text>
            
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More About Security</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  syncProgressContainer: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    ...SHADOWS.small,
  },
  syncProgressText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  accountsContainer: {
    margin: SPACING.lg,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  accountCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  institutionName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.md,
  },
  accountDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  balanceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  syncTimeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    ...SHADOWS.small,
  },
  addAccountText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xs,
  },
  syncSection: {
    marginHorizontal: SPACING.lg,
  },
  syncCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  syncDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  syncButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginLeft: SPACING.xs,
  },
  securitySection: {
    margin: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  securityCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  securityIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  securityTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  securityDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  learnMoreButton: {
    paddingVertical: SPACING.xs,
  },
  learnMoreText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default BankSyncScreen;
