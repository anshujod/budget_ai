import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { useFinancial } from '../../context/FinancialContext';
import { useAuth } from '../../context/AuthContext';

const CommunityScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('forum');
  const [posts, setPosts] = useState([]);
  const [tips, setTips] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load sample posts and tips
    // In a real app, this would come from a backend API
    const samplePosts = generateSamplePosts();
    const sampleTips = generateSampleTips();
    
    setPosts(samplePosts);
    setTips(sampleTips);
  }, []);

  const generateSamplePosts = () => {
    return [
      {
        id: '1',
        author: 'SavingsPro',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        title: 'How I saved $10,000 in 6 months',
        content: 'I wanted to share my journey of saving $10,000 in just 6 months. The key was creating a detailed budget and sticking to it religiously. I cut out all unnecessary expenses and found ways to increase my income through side hustles.',
        likes: 42,
        comments: 15,
        timestamp: '2 hours ago',
        tags: ['Savings', 'Budgeting'],
        isLiked: false,
      },
      {
        id: '2',
        author: 'DebtFreeJourney',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        title: 'Finally debt free after 3 years!',
        content: 'Today I made my final debt payment! It took 3 years of discipline and sacrifice, but I'm finally free from $35,000 of credit card and student loan debt. I used the snowball method, focusing on the smallest debts first to build momentum.',
        likes: 78,
        comments: 23,
        timestamp: '5 hours ago',
        tags: ['Debt Free', 'Success Story'],
        isLiked: true,
      },
      {
        id: '3',
        author: 'InvestmentNewbie',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        title: 'Need advice on starting investments',
        content: 'I've finally built up my emergency fund and want to start investing. I'm 28 and have about $5,000 to invest. Should I focus on index funds, individual stocks, or something else? Any advice for a complete beginner?',
        likes: 12,
        comments: 34,
        timestamp: '1 day ago',
        tags: ['Investing', 'Advice Needed'],
        isLiked: false,
      },
      {
        id: '4',
        author: 'BudgetMaster',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        title: 'My 50/30/20 budget template',
        content: 'I've been using the 50/30/20 budget rule for the past year with great success. I've created a template that automatically calculates everything for you. 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
        likes: 56,
        comments: 18,
        timestamp: '2 days ago',
        tags: ['Budgeting', 'Templates'],
        isLiked: false,
      },
      {
        id: '5',
        author: 'FrugalLiving',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        title: 'How I cut my grocery bill in half',
        content: 'After analyzing my expenses, I realized I was spending way too much on groceries. I implemented meal planning, bulk buying, and seasonal shopping, and managed to cut my monthly grocery bill from $600 to just $300 for my family of four.',
        likes: 89,
        comments: 42,
        timestamp: '3 days ago',
        tags: ['Frugal Living', 'Food Budget'],
        isLiked: true,
      },
    ];
  };

  const generateSampleTips = () => {
    return [
      {
        id: '1',
        author: 'FinancialAdvisor',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: 'Emergency Fund Basics',
        content: 'Your emergency fund should cover 3-6 months of essential expenses. Keep it in a high-yield savings account for easy access while earning some interest.',
        likes: 124,
        timestamp: '1 day ago',
        category: 'Savings',
        isLiked: true,
      },
      {
        id: '2',
        author: 'RetirementPlanner',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        title: 'Retirement Contribution Tip',
        content: 'Increase your retirement contributions by 1% every year. You'll barely notice the difference in your paycheck, but it will make a huge difference in your retirement savings over time.',
        likes: 98,
        timestamp: '2 days ago',
        category: 'Retirement',
        isLiked: false,
      },
      {
        id: '3',
        author: 'CreditExpert',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        title: 'Improve Your Credit Score',
        content: 'Pay your credit card balance twice a month instead of once. This keeps your utilization ratio low throughout the month, which can boost your credit score over time.',
        likes: 156,
        timestamp: '3 days ago',
        category: 'Credit',
        isLiked: false,
      },
      {
        id: '4',
        author: 'TaxPro',
        avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
        title: 'Tax Deduction Reminder',
        content: 'Don't forget to track your charitable donations throughout the year. Even small donations can add up to significant tax deductions if you itemize.',
        likes: 87,
        timestamp: '4 days ago',
        category: 'Taxes',
        isLiked: true,
      },
      {
        id: '5',
        author: 'InvestmentGuru',
        avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
        title: 'Investment Diversification',
        content: 'Don't put all your investments in one place. Diversify across different asset classes (stocks, bonds, real estate) to reduce risk and potentially increase returns over time.',
        likes: 203,
        timestamp: '5 days ago',
        category: 'Investing',
        isLiked: false,
      },
    ];
  };

  const handleLikePost = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1,
            isLiked: newIsLiked
          };
        }
        return post;
      })
    );
  };

  const handleLikeTip = (tipId) => {
    setTips(prevTips => 
      prevTips.map(tip => {
        if (tip.id === tipId) {
          const newIsLiked = !tip.isLiked;
          return {
            ...tip,
            likes: newIsLiked ? tip.likes + 1 : tip.likes - 1,
            isLiked: newIsLiked
          };
        }
        return tip;
      })
    );
  };

  const handleSubmitPost = () => {
    if (!newPostText.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newPost = {
        id: String(posts.length + 1),
        author: userData?.username || 'CurrentUser',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        title: newPostText.split('\n')[0] || 'New Post',
        content: newPostText,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        tags: ['New'],
        isLiked: false,
      };
      
      setPosts([newPost, ...posts]);
      setNewPostText('');
      setIsSubmitting(false);
    }, 1000);
  };

  const filterItems = (items) => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  };

  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.authorContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>{item.author}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent} numberOfLines={5}>{item.content}</Text>
        
        {item.tags && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.postFooter}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikePost(item.id)}
          >
            <MaterialCommunityIcons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={item.isLiked ? COLORS.error : COLORS.textSecondary} 
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="comment-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="share-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTipItem = ({ item }) => {
    return (
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <View style={styles.authorContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
            <Text style={styles.authorName}>{item.author}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        
        <Text style={styles.tipTitle}>{item.title}</Text>
        <Text style={styles.tipContent}>{item.content}</Text>
        
        <View style={styles.tipFooter}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeTip(item.id)}
          >
            <MaterialCommunityIcons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={item.isLiked ? COLORS.error : COLORS.textSecondary} 
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  const renderForumTab = () => {
    const filteredPosts = filterItems(posts);
    
    return (
      <View style={styles.tabContent}>
        <View style={styles.newPostContainer}>
          <TextInput
            style={styles.newPostInput}
            placeholder="Share your financial journey or ask for advice..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            value={newPostText}
            onChangeText={setNewPostText}
          />
          <TouchableOpacity 
            style={[
              styles.postButton,
              (!newPostText.trim() || isSubmitting) && styles.postButtonDisabled
            ]}
            onPress={handleSubmitPost}
            disabled={!newPostText.trim() || isSubmitting}
          >
            <Text style={styles.postButtonText}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            renderItem={renderPostItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="forum-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>No posts found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 
                `No posts matching "${searchQuery}"` : 
                "Be the first to share your financial journey!"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTipsTab = () => {
    const filteredTips = filterItems(tips);
    
    return (
      <View style={styles.tabContent}>
        {filteredTips.length > 0 ? (
          <FlatList
            data={filteredTips}
            renderItem={renderTipItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="lightbulb-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>No tips found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 
                `No tips matching "${searchQuery}"` : 
                "Check back later for financial tips from experts!"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts and tips..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'forum' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('forum')}
        >
          <MaterialCommunityIcons 
            name="forum" 
            size={20} 
            color={activeTab === 'forum' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text 
            style={[
              styles.tabButtonText,
              activeTab === 'forum' && styles.activeTabButtonText
            ]}
          >
            Forum
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'tips' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('tips')}
        >
          <MaterialCommunityIcons 
            name="lightbulb-on" 
            size={20} 
            color={activeTab === 'tips' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text 
            style={[
              styles.tabButtonText,
              activeTab === 'tips' && styles.activeTabButtonText
            ]}
          >
            Tips
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'forum' ? renderForumTab() : renderTipsTab()}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xxs,
    borderRadius: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  activeTabButton: {
    backgroundColor: COLORS.primaryLight,
  },
  tabButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  activeTabButtonText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  tabContent: {
    paddingHorizontal: SPACING.lg,
  },
  newPostContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  newPostInput: {
    minHeight: 100,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
  },
  postButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  postButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  postButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: SPACING.sm,
  },
  authorName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
  postTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  postContent: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  tag: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xxs,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  tipTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  tipContent: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.sm,
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
  },
});

export default CommunityScreen;
