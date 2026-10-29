# Connect Four Arena 🔴🟡
A modern, responsive, and interactive Connect Four web application built with React, PrimeReact, and the native Web Audio API. Challenge a friend locally or test your skills against a smart AI.

# 🌐 Live Demo: [4connectgame.netlify.app](https://4connectgame.netlify.app/)

# ✨ Features
🎮 Game Modes:
- Two Players (Pass & Play): Local multi-round tournament mode with customizable match counts and first-turn rules.
- Training Game (vs Cyber AI): Single-player mode against a responsive AI that defends against immediate threats and seizes winning opportunities.
- Quick mute/unmute audio toggle.
- ⏱️ Turn Timer & Controls:
  15-second per-turn clock with an urgent pulse warning.
- Full Move Undo support.
- 💾 Match State Persistence:
  Automatically saves active tournaments to localStorage, allowing matches to resume smoothly after accidental refreshes.
-🎨 Customization:
  Custom player names and local photo/avatar uploads.

# 🛠️ Tech Stack
Frontend: React
UI Components & Icons: PrimeReact, PrimeIcons
Styling: Modern CSS 
Audio: Native Web Audio API


# 🚀 Getting Started
- Prerequisites
  Node.js (v16 or newer recommended)
  npm or yarn
- Installation and Start
  1. Clone the repository:
    Bash
      git clone https://github.com/snehith8/connect_game.git
      cd connect_game
  2. Install dependencies:
     Bash
       npm install
  3. Start the development server:
     Bash
       npm start
  4. Open your browser and navigate to http://localhost:3000.

# 📂 Project Structure
```
connect_game/
├── public/
│   ├── 4C.svg             # Vector illustration & app icon
│   └── index.html         # HTML root template with SVG favicon
├── src/
│   ├── utils/
│   │   ├── confetti.js    # Canvas confetti particle system
│   │   └── sound.js       # Web Audio API sound synthesizer
│   ├── App.css            # Global responsive styles & theme definitions
│   ├── App.jsx            # Router and layout shell with persistent footer
│   ├── Connectfourgame.jsx# Core game board, turn logic, AI, and HUD
│   ├── Gamesetting.jsx    # Match configurations, avatars, & round dialogs
│   ├── Homescreen.jsx     # Landing page & mode selection
│   └── index.js           # React root entry point
└── package.json
```
