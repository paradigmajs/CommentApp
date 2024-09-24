# Comment App

A React Native application for creating and managing comments with support for nested replies.

## Getting Started

To run the project, you will need either **Yarn** or **npm** installed on your system. Follow the steps below to get started.

### Prerequisites

- Node.js installed on your machine
- Yarn or npm
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Open the project directory**:
   ```bash
   cd /path/to/your/project
   ```

2. **Install dependencies**:
   - Using Yarn:
     ```bash
     yarn
     ```
   - Or using npm:
     ```bash
     npm install
     ```

### Running the App

#### For iOS

1. Navigate to the iOS directory:
   ```bash
   cd ios
   ```

2. Install CocoaPods dependencies:
   ```bash
   pod install
   ```

3. Navigate back to the root directory:
   ```bash
   cd ..
   ```

4. Start the application:
   ```bash
   yarn ios
   ```
   Or using npm:
   ```bash
   npm run ios
   ```

5. **Troubleshooting**: If you encounter errors:
   - Open Xcode.
   - Open the workspace file located at `ios/CommentApp.xcworkspace`.
   - Select your device and run the project.

#### For Android

1. Ensure you have an Android emulator running or a device connected.
2. Start the application:
   ```bash
   yarn android
   ```
   Or using npm:
   ```bash
   npm run android
   ```

## Features

- Add comments and replies
- Nested comments
- User registration
