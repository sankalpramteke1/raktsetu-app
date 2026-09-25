<div align="center">

  # 🩸 RaktSetu (रक्तसेतु)
  ### Intelligent Blood Bank Management & Requisition System
  **Durg District Blood Center — District Hospital, Durg (C.G.)**  
  *Government Licence No. 28C/5/96*

  <br/>

  [![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-black?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Platform](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-E53935?style=for-the-badge)](https://expo.dev)

</div>

---

## 📌 Overview

**RaktSetu** is a specialized mobile application built to bridge patients, hospital wards, and blood bank centers in real-time. It eliminates paper delays through a standardized digital **Blood Requisition Form**, tracks inventory with critical low-stock alerts, and coordinates voluntary blood donation camps.

### ✨ Key Features
- 📝 **Standard Requisition Form**: Digital requisition matching government statutory guidelines with automatic urgency tagging.
- 📊 **Real-time Stock Monitor**: Instant view of whole blood, PRBC, FFP, Platelets, and Cryo inventory.
- 🚨 **Critical Shortage Alerts**: Automated flags for units below threshold (e.g., O-, AB-).
- ⛺ **Camp Management**: Schedules, targets, and live donation statistics.
- 📱 **Cross-Platform**: Seamless experience on Android, iOS, and Web.

---

## ⚡ Quick Start

```bash
# 1. Clone & Enter the directory
git clone https://github.com/your-username/raktsetu-app.git
cd raktsetu-app

# 2. Install dependencies
npm install

# 3. Start the application
npx expo start
```

Scan the terminal QR code with **Expo Go** on Android or the **Camera** app on iOS.

---

## 🛠️ Essential Development Commands

### 🚀 Running the App

| Purpose | Command | Notes |
|:---|:---|:---|
| **Start Dev Server** | `npm start` or `npx expo start` | Starts Metro bundler |
| **Clear Cache & Start** | `npx expo start -c` | Recommended if changes don't appear |
| **Tunnel Mode** | `npx expo start --tunnel` | Use when phone & laptop are on different Wi-Fi |
| **Run on Android** | `npm run android` | Launches connected Android device/emulator |
| **Run on iOS** | `npm run ios` | Launches macOS iOS simulator |
| **Run on Web** | `npm run web` | Opens app in your default browser |

---

### ⌨️ Terminal Shortcuts
While the development server is running, press:

| Key | Action |
|:---:|:---|
| <kbd>a</kbd> | Open in **Android** emulator / connected device |
| <kbd>i</kbd> | Open in **iOS** simulator |
| <kbd>w</kbd> | Open in **Web** browser |
| <kbd>r</kbd> | **Reload** app immediately |
| <kbd>m</kbd> | Toggle developer **Menu** |
| <kbd>c</kbd> | Redisplay the **QR code** in terminal |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | Stop development server |

---

## 📦 Adding Packages

> [!IMPORTANT]
> Always install packages using `npx expo install` instead of `npm install` to prevent SDK version conflicts.

```bash
# Example: Adding icons, print, or storage
npx expo install <package-name>
```

---

## 🔍 Code Quality & Checks

Run these commands before pushing changes:

```bash
# Type-check TypeScript files
npx tsc --noEmit

# Lint code for issues
npx expo lint

# Diagnose config & dependency health
npx expo-doctor

# Auto-fix mismatched package versions
npx expo install --fix
```

---

## 📲 Building APK & Production Release

Build standalone APKs or production binaries using EAS (Expo Application Services):

```bash
# Install EAS CLI globally (one-time)
npm install -g eas-cli

# Login to Expo account
eas login

# 1. Build Android APK for testing (Direct install on phones)
eas build --profile preview --platform android

# 2. Build Production Bundle (AAB for Play Store)
eas build --profile production --platform android

# 3. Push Over-The-Air (OTA) updates instantly
eas update --branch production --message "Updated requisition form"
```

---

## 📂 Project Structure

```text
raktsetu-app/
├── app/                      # Expo Router screens
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── index.tsx         # Dashboard / Home Screen
│   │   ├── requests.tsx      # Requisition management
│   │   ├── stock.tsx         # Blood inventory status
│   │   ├── camps.tsx         # Donation camps
│   │   └── donors.tsx        # Donor directory
│   ├── requisition.tsx       # Statutory Blood Requisition Form
│   └── _layout.tsx           # Navigation Root
├── src/                      # Source modules
│   ├── components/           # Reusable UI components
│   ├── constants/            # Theme tokens, palette & spacing
│   └── types/                # TypeScript interfaces
├── assets/                   # App icons & graphics
├── package.json              # App configuration & scripts
└── README.md                 # Project documentation
```

---

<div align="center">

  **RaktSetu** • Saving Lives with Timely Blood Availability  
  District Hospital, Durg, Chhattisgarh

</div>
