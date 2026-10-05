# QuizWar

QuizWar is an independent React Native quiz application with phone-number
authentication, category-based gameplay, timed questions, performance tracking,
leaderboards, profiles, and Firebase-backed data.

[View the QuizWar engineering case study](https://anujdhanuka.com/projects/quizwar)

## Features

- Phone-number authentication with OTP verification
- User registration and profile management
- Firebase-backed quiz categories
- Timed multiple-choice gameplay with immediate answer feedback
- Score, accuracy, completion time, and performance tracking
- Player rankings and leaderboard views
- Profile image selection and upload
- Configurable sound and haptic feedback

## Tech Stack

- **Mobile:** React Native 0.75, React 18, JavaScript
- **State:** Redux Toolkit, React Redux, Redux Persist, AsyncStorage
- **Navigation:** React Navigation with stack and bottom-tab navigators
- **Backend services:** Firebase Authentication, Cloud Firestore, Firebase Storage
- **Mobile UX:** Gesture Handler, Reanimated, Lottie, haptic feedback, and sound

## Architecture

The application composes its global providers at the root and switches its
navigation tree according to authentication state.

```text
App
├── Redux Provider
├── PersistGate
├── AuthProvider
├── ThemeProvider
└── GestureHandlerRootView
    └── NavigationContainer
        └── Navigations
```

```text
Signed out
├── Sign In
└── Registration

Signed in
├── Bottom tabs
│   ├── Home
│   ├── Dashboard
│   └── Profile
└── Stack flows
    ├── Categories
    ├── Game
    ├── Result
    ├── Settings
    └── Edit Profile
```

## State Management

Redux Toolkit organizes state into `auth`, `userPerformance`, `activeSession`,
`game`, `gameCategories`, and `authToken` domains. Redux Persist stores only the
`auth` and `userPerformance` domains in AsyncStorage; the remainder is rebuilt
for each application session.

## Firebase Integration

- **Firebase Authentication** handles phone-number and OTP authentication.
- **Cloud Firestore** stores user profiles, quiz categories, scores, and player
  performance data.
- **Firebase Storage** stores uploaded profile media.

The checked-in Android `google-services.json` is Firebase mobile client
configuration, not an administrator credential. A clone intended for use with a
different backend must replace it with configuration from its own Firebase
project. The repository does not include Firestore or Storage rules; access
control must be configured and reviewed in the Firebase console.

The iOS project does not include a `GoogleService-Info.plist`. Add the client
configuration generated for your own iOS app target before running Firebase
features on iOS. Do not commit service-account JSON, private keys, or signing
credentials.

## Quiz Flow

```text
Sign in → choose a category → start a quiz → answer timed questions
        → calculate score and performance → view results and dashboard
```

## Project Structure

```text
src/
├── assets/       # Images, fonts, icons, and animation data
├── components/   # Shared interface components
├── context/      # Authentication and theme providers
├── Navigations/  # Auth-aware stack and bottom-tab navigation
├── screens/      # Application screens and screen-specific components
├── store/        # Redux store, slices, and persistence configuration
└── utils/        # Firebase data access and shared utilities
```

Native Android and iOS projects live in `android/` and `ios/` respectively.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A configured [React Native development environment](https://reactnative.dev/docs/set-up-your-environment)
- Android Studio and an Android SDK for Android development
- macOS, Xcode, and CocoaPods for iOS development
- A Firebase project with phone authentication, Firestore, and Storage configured

### Install

```bash
git clone https://github.com/Anuj-Dhanuka/QuizWar.git
cd QuizWar
npm ci
```

For iOS, install the native pods after installing JavaScript dependencies:

```bash
cd ios
pod install
cd ..
```

### Run

Start Metro in one terminal:

```bash
npm start
```

Then launch a configured simulator or emulator from another terminal:

```bash
npm run android
# or, on macOS
npm run ios
```

Before exercising Firebase features, register the app identifiers in your own
Firebase project, add the corresponding native client configuration, enable
phone authentication, and deploy restrictive Firestore and Storage rules.

## Project Scope

QuizWar is an independent mobile engineering project built to explore complete
React Native application flows: authentication, quiz mechanics, persisted state,
Firebase-backed user data, performance tracking, and native mobile interactions.
It is not presented as a commercial production service.

## Engineering Case Study

For a detailed breakdown of the architecture, engineering decisions, and
source-backed implementation evidence, see the
[QuizWar case study](https://anujdhanuka.com/projects/quizwar).

## Security

Please report suspected vulnerabilities privately. See
[SECURITY.md](SECURITY.md) for the disclosure guidance and current project scope.

## Author

**Anuj Dhanuka** — Software Engineer · React Native & Frontend Developer

[Portfolio](https://anujdhanuka.com)
