import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  Animated 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Track your expenses effortlessly',
    description: 'Easily log and categorize your spending with just a few taps. Connect your accounts for automatic tracking.',
    image: require('../../assets/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Set and achieve your savings goals',
    description: 'Create personalized savings goals and track your progress. We'll help you stay on target.',
    image: require('../../assets/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Get AI-powered insights',
    description: 'Our AI analyzes your spending patterns and suggests ways to save more and spend smarter.',
    image: require('../../assets/onboarding3.png'),
  },
  {
    id: '4',
    title: 'Have fun with challenges and rewards',
    description: 'Turn budgeting into a game with challenges, achievements, and rewards that keep you motivated.',
    image: require('../../assets/onboarding4.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login');
    }
  };

  const Indicator = ({ scrollX }) => {
    return (
      <View style={styles.indicatorContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={`indicator-${i}`}
              style={[
                styles.indicator,
                { width: dotWidth, opacity },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryLight]}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>BudgetAI</Text>
      </View>
      
      <View style={styles.slidesContainer}>
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image 
                source={item.image} 
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      
      <Indicator scrollX={scrollX} />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={scrollTo}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
        
        {currentIndex === slides.length - 1 && (
          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
  slidesContainer: {
    flex: 3,
  },
  slide: {
    width,
    alignItems: 'center',
    padding: SPACING.lg,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  loginLink: {
    marginTop: SPACING.sm,
  },
  loginText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
  },
  loginTextBold: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});

export default OnboardingScreen;
