# SentinelNet – Distributed Emergency Alert & Response System

SentinelNet is a production-grade prototype for emergency response, featuring real-time alerts, SOS tracking, and offline resilience.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Setup
Clone the repository and install dependencies in both the root directories:

**Server:**
```bash
cd server
npm install
node index.js
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## 🛠️ Core Features

- 🔴 **One-Tap SOS**: Instant GPS tracking and server logging.
- 📡 **Real-Time Alerts**: Authority broadcast system using Socket.io.
- 🔋 **Low Power Mode**: Automatic UI optimization when battery < 15%.
- 📶 **Offline First**: All safety instructions are cached via Service Workers (PWA).
- 🚓 **Emergency Services**: Integrated mock dialers for Police, Ambulance, and Fire.

## 📁 Architecture

- **`client/`**: React + Vite + Tailwind CSS + PWA.
- **`server/`**: Node.js + Express + Socket.io.
- **`logic/`**: 
  - `alertDecisionEngine.js`: Decides if alerts trigger for a user.
  - `zoneMatcher.js`: Calculates radius-based location matching.

This separation ensures alert decisions remain deterministic, testable, and independent of UI state.

## 🔄 System Decision Flow

1. **Location Tracking**: Real-time GPS coordinate extraction.
2. **Zone Match**: Distance calculation between user and disaster center.
3. **Decision Engine**: Evaluation of location vs. affected zone parameters.
4. **Alert Dispatch**: UI/Haptic/Audio response based on severity evaluation.

## 🛡️ Ethical Safety

To prevent misuse, emergency service integrations are simulated and restricted to user-initiated demo actions only.

## ⚖️ Academic Disclaimer
This is a prototype for academic and demonstration purposes. No real SMS or emergency dispatchers are contacted.
