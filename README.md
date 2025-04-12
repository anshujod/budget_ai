# BudgetAI - AI-Powered Budgeting App

BudgetAI is a comprehensive mobile application designed to help users manage their finances, track expenses, set savings goals, and receive AI-powered financial insights. The app combines powerful financial management tools with gamification elements to make budgeting engaging and rewarding.

## Features

### Core Features

#### User Registration & Profiles
- Complete authentication flow with registration, login, and password reset
- Customizable user profiles with financial objectives
- Secure data storage with AsyncStorage

#### Expense Tracking
- Intuitive expense input interface with category selection
- Comprehensive transaction history with filtering options
- Bank account/credit card sync simulation
- Expense categorization and analysis

#### Savings Goals
- Goal creation with customizable targets and timeframes
- Visual progress tracking with contribution functionality
- Personalized saving strategies based on spending patterns
- Goal completion celebrations

#### AI-Powered Insights
- Spending pattern analysis with category breakdown
- Budget recommendations based on the 50/30/20 rule
- Actionable financial insights with step-by-step guidance
- Financial health scoring and improvement suggestions

#### Gamification Elements
- Achievement system with unlockable badges and points
- Daily, weekly, and monthly financial challenges
- Progress tracking visualizations with charts and statistics
- Streak tracking for consistent financial behaviors

### Optional Features

#### Voice Assistant
- Voice interaction for financial queries
- Support for questions about expenses, budgets, and goals
- Conversation history and manual text input option
- Helpful examples and guidance

#### Community Support
- Forum for sharing financial journeys and asking questions
- Financial tips section with expert advice
- Like and comment functionality
- Search functionality across community content

## Technical Details

### Architecture
- Built with React Native and Expo for cross-platform compatibility
- Context API for state management
- AsyncStorage for data persistence
- Navigation using React Navigation (Stack and Tab navigators)

### Design
- Custom theme system with consistent colors and typography
- Responsive layouts for various device sizes
- Animated UI elements for enhanced user experience
- Accessibility considerations throughout the app

## Getting Started

See the [DEPLOYMENT.md](./DEPLOYMENT.md) file for detailed instructions on how to run and deploy the app.

## Project Structure

```
BudgetAI-app/
├── assets/                  # App icons, splash screen, and images
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and configuration
│   ├── context/             # Context providers for state management
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens organized by feature
│   │   ├── auth/            # Authentication screens
│   │   ├── budget/          # Budget management screens
│   │   ├── expenses/        # Expense tracking screens
│   │   ├── gamification/    # Achievements and challenges screens
│   │   ├── goals/           # Savings goals screens
│   │   ├── insights/        # AI insights screens
│   │   ├── main/            # Main app screens
│   │   ├── optional/        # Optional feature screens
│   │   └── profile/         # User profile screens
│   ├── services/            # API and service functions
│   ├── styles/              # Global styles and theme
│   └── utils/               # Utility functions
├── App.js                   # Main app component
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
└── DEPLOYMENT.md            # Deployment instructions
```

## Future Enhancements

Potential future enhancements for the app include:
- Real-time alerts and notifications
- Integration with real banking APIs
- Machine learning for more personalized insights
- Social features for financial goal sharing
- Expanded gamification with rewards and competitions

## Credits

Developed for the Hackathon Project by the BudgetAI Team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
