# RNJET Project Overview

## प्रोजेक्ट का नाम: **RNJET**

### मुख्य विशेषताएं (Features):

1. **QR Code Generation** - `src/screens/QRScreen.js` में QR codes बना सकते हैं
2. **Barcode Generation** - `src/screens/BarCodeScreen.js` में विभिन्न प्रकार के barcodes बना सकते हैं
3. **Text Elements** - `src/screens/TextScreen.js` में text elements add कर सकते हैं
4. **Canvas-based Editor** - `src/screens/HomeScreen.js` में सभी elements को arrange कर सकते हैं

### तकनीकी विवरण:

**Framework**: React Native (cross-platform mobile app)
**Navigation**: React Navigation with Stack Navigator
**Platform Support**: Android और iOS दोनों

### मुख्य Components:

1. **`HomeScreen`** (`src/screens/HomeScreen.js`) - मुख्य canvas जहाँ सभी elements display होते हैं
2. **`QRScreen`** (`src/screens/QRScreen.js`) - QR code बनाने के लिए:
   - Text input
   - Size control (slider)
   - Live preview
3. **`BarCodeScreen`** (`src/screens/BarCodeScreen.js`) - Barcode बनाने के लिए:
   - Multiple formats support (CODE128, UPC, EAN, ITF आदि)
   - Width/Height controls
   - Input validation
4. **`TextScreen`** (`src/screens/TextScreen.js`) - Text elements के लिए

### उपयोग किए गए Libraries:

- `react-native-qrcode-svg` - QR code generation के लिए
- `@kichiyaki/react-native-barcode-generator` - Barcode generation के लिए
- `@react-navigation/stack` - Screen navigation के लिए
- `react-native-vector-icons` - Icons के लिए
- `@react-native-community/slider` - Size controls के लिए

### प्रोजेक्ट Structure:

```
RNJET/
├── App.js                    # Main app component with navigation
├── index.js                  # App entry point
├── package.json              # Dependencies configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
├── jest.config.js            # Testing configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation
├── Gemfile                   # Ruby dependencies for iOS
├── Gemfile.lock              # Ruby lock file
├── assets/
│   └── RNJET_logo.png        # App logo
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js     # Main canvas screen
│   │   ├── QRScreen.js       # QR code generation
│   │   ├── BarCodeScreen.js  # Barcode generation
│   │   └── TextScreen.js     # Text elements
│   └── utils/
│       └── DimenValues.js    # Dimension utilities
├── android/                  # Android specific files
│   ├── app/
│   │   └── src/main/java/com/rnjet/MainActivity.kt
│   └── build.gradle
├── ios/                      # iOS specific files
│   ├── RNJET/
│   │   ├── AppDelegate.swift
│   │   └── Info.plist
│   ├── Podfile               # iOS dependencies
│   ├── RNJET.xcodeproj/      # Xcode project
│   └── RNJET.xcworkspace/    # Xcode workspace
└── __tests__/
    └── App.test.tsx          # App tests
```

### iOS पर चलाने के Steps:

#### Prerequisites:
- macOS machine
- Xcode installed from App Store
- Node.js और npm installed

#### Installation & Run:

1. **Dependencies Install करें:**
   ```bash
   npm install
   ```

2. **CocoaPods Setup करें:**
   ```bash
   bundle install
   cd ios
   bundle exec pod install
   cd ..
   ```

3. **Metro Server Start करें:**
   ```bash
   npm start
   ```

4. **iOS App Build और Run करें:**
   ```bash
   # Command line से
   npm run ios
   
   # या Xcode से
   # ios/RNJET.xcworkspace file को Xcode में open करें
   # Simulator select करें और Run button press करें
   ```

### Troubleshooting:

अगर कोई issue आए तो:

```bash
# Clean everything और fresh start
rm -rf node_modules
npm install
cd ios
rm -rf Pods
bundle exec pod install
cd ..
npx react-native start --reset-cache
```

### App Configuration:

- **Bundle Identifier**: `com.rnjet`
- **App Name**: RNJET
- **Platform Target**: iOS 13.0+, Android API 21+

### Expected Features:

सफल installation के बाद app में यह features होंगे:
- QR Code generator with customizable size
- Multiple barcode format support
- Text element addition
- Canvas-based layout editor
- Cross-platform compatibility

---
**Created**: June 24, 2025
**Project Type**: React Native Mobile Application
**Purpose**: QR Code & Barcode Generator with Canvas Editor
