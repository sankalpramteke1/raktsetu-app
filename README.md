<div align="center">

  <img src="./assets/images/icon.png" width="100" height="100" alt="RaktSetu Emblem" style="border-radius: 22px;" />

  # 🩸 RaktSetu • रक्तसेतु
  ### Intelligent Clinical Blood Banking & Automated Requisition Ecosystem

  *Engineered for High-Velocity Transfusions • Real-Time Serology • Zero-Paperwork Latency*

  <br/>

  [![Expo SDK](https://img.shields.io/badge/Expo%20SDK-57.0-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React%20Native-0.86.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![CI/CD](https://img.shields.io/badge/Automated%20Builds-GitHub%20Actions%20CI-22C55E?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/sankalpramteke1/raktsetu-app/actions)
  [![Security](https://img.shields.io/badge/Security-AES--256%20SecureStore-F59E0B?style=for-the-badge&logo=auth0&logoColor=white)](https://github.com/sankalpramteke1/raktsetu-app)

</div>

---

## ⚡ Mission-Critical Architecture

**RaktSetu** (*रक्तसेतु* — Bridge of Blood) is an enterprise medical mobility application engineered to eliminate critical time delays in emergency blood banking. Designed for hospital clinical staff, pathologists, and blood bank coordinators, it unifies **clinical requisitioning**, **real-time serological inventory**, **voluntary donor registries**, and **blood donation camps** into a synchronized, resilient ecosystem.

```
 ┌────────────────┐          ┌───────────────────────┐          ┌────────────────┐
 │ Hospital Ward  │  Req Form│  RaktSetu App Engine  │  REST    │ Central Node   │
 │ Emergency Desk ├─────────►│  Offline-Resilient    ├─────────►│ SQLite / DB    │
 └────────────────┘          │  Client Architecture  │  JWT/SSL │ Server API     │
                             └───────────┬───────────┘          └───────┬────────┘
                                         │                              │
                                         ▼                              ▼
                             ┌───────────────────────┐          ┌────────────────┐
                             │ Hardware SecureStore  │          │ TTI Serology & │
                             │ Biometric / Auth Token│          │ Cold Chain Log │
                             └───────────────────────┘          └────────────────┘
```

---

## 💎 High-Tech Innovations & Capabilities

### 🩺 Clinical Blood Requisition Pipeline
- **Zero-Latency Clinical Pipeline:** Real-time digital requisitioning workflow eliminating physical paper delays between hospital wards and blood storage centers.
- **Intelligent Triage & Validation:** Automatic urgency categorization (Emergency STAT vs. Routine Elective) with doctor and collecting staff verification.
- **Cross-Match Traceability:** Tracks blood units through pre-transfusion serology, compatibility verification, and issue authorization.

### 🩸 Real-Time Serology & Cold-Chain Inventory
- **Granular Batch Diagnostics:** Live tracking of whole blood, PRBC, FFP, and Platelets with Lot No., Ref No., and Segment ID logging.
- **TTI Quarantining:** Real-time safety status gating (HIV 1/2, HBsAg, HCV, VDRL, Malaria Parasite) ensuring zero unverified unit issuance.
- **Dynamic Depletion Warning Engine:** Visual analytics alerting clinical staff whenever stocks breach critical thresholds (e.g. O-, AB- reserves).

### 🔐 Hardware-Backed Security
- **AES-256 Storage (`expo-secure-store`):** Cryptographic token vault utilizing Android Keystore / iOS Keychain for bearer authentication.
- **Strict Role-Based Access Control (RBAC):** Distinct scopes separating Administrators, medical officers, clinical nurses, and portal coordinators.
- **Offline Reliability:** Automatic local caching fallback keeps critical inventory readable even during erratic hospital network drops.

### 🚀 Autonomous CI/CD & Live In-App Update Engine
- **Tag-Triggered Cloud Pipeline:** Pushing a semantic Git tag (`git push origin vX.Y.Z`) triggers a GitHub Actions workflow that compiles and publishes release APKs in minutes.
- **In-App OTA Delta Updater:** Built-in update detection polling GitHub Releases API, allowing one-tap background APK upgrades without manual side-loading.

---

## 🧪 Tech Stack & Engineering Specifications

<table align="center" width="100%">
  <thead>
    <tr>
      <th width="25%">Subsystem</th>
      <th width="45%">Technology</th>
      <th width="30%">Architectural Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Mobile Runtime</b></td>
      <td><code>React Native 0.86.3</code> • <code>Expo SDK 57</code></td>
      <td>High-performance native threading & cross-platform fabric UI</td>
    </tr>
    <tr>
      <td><b>Routing & Nav</b></td>
      <td><code>Expo Router v57 (File-based)</code></td>
      <td>Deep-linking, modal stacks, typed navigation gates</td>
    </tr>
    <tr>
      <td><b>Language</b></td>
      <td><code>TypeScript Strict Mode (~v6.0)</code></td>
      <td>Zero runtime type errors, strict interface contracts</td>
    </tr>
    <tr>
      <td><b>Storage & Crypt</b></td>
      <td><code>expo-secure-store</code> • <code>Web Crypto</code></td>
      <td>Hardware-level keystore encryption for hospital bearer tokens</td>
    </tr>
    <tr>
      <td><b>Design System</b></td>
      <td><code>Custom Medical Slate & Ruby-Red</code></td>
      <td>Tailored clinical ergonomics, accessible contrast ratios</td>
    </tr>
    <tr>
      <td><b>Backend Integration</b></td>
      <td><code>Node.js ESM</code> • <code>Express</code> • <code>SQLite3</code></td>
      <td>High-throughput, ACID-compliant local database node</td>
    </tr>
  </tbody>
</table>

---

## ⚡ Quick Start & Dev Setup

### Prerequisites
- **Node.js**: `>= 22.5.0`
- **Package Manager**: `npm` / `bun`
- **Expo Go** on Android / iOS or connected USB emulator

```bash
# 1. Clone repository
git clone https://github.com/sankalpramteke1/raktsetu-app.git
cd raktsetu-app

# 2. Install validated SDK-compatible dependencies
npx expo install

# 3. Launch Metro Dev Server
npx expo start
```

---

## 💻 Developer Playbook

| Action | Command | Scope |
|:---|:---|:---|
| **Start Metro Bundler** | `npx expo start` | Starts dev server with QR code |
| **Launch Android Device** | `npm run android` | Deploys directly to ADB emulator or phone |
| **Launch Web View** | `npm run web` | Renders web portal version |
| **Clear Cache & Start** | `npx expo start -c` | Resets bundler state and clears cache |
| **TypeScript Typecheck** | `npx tsc --noEmit` | Strict type verification |
| **Expo Linter** | `npx expo lint` | Code hygiene and accessibility rules |
| **Config & Health Diagnostic**| `npx expo-doctor` | Comprehensive environment audit |

---

## 🏷️ Release Workflow (Automated Tag Delivery)

Publishing a new release triggers automated cloud compilation:

```bash
# 1. Stage and commit updates
git add .
git commit -m "feat(core): release updates"

# 2. Stamp an annotated semantic release tag
git tag -a v1.0.5 -m "Release v1.0.5: Updates and improvements"

# 3. Synchronize branch and release tags
git push origin main
git push origin v1.0.5
```

> **Automated Result:** GitHub Actions instantly builds the signed `.apk` file and publishes it to the repository's **Releases** tab for immediate deployment.

---

<div align="center">

*Engineered with deep devotion for healthcare workers, emergency phlebotomists, and donors saving lives every single day.*

</div>
