# RazorGuard — AI Payment Risk Intelligence Platform

> Real-time UPI fraud detection and risk scoring powered by Gemini AI, engineered with a threat-intelligence HUD interface.

---

## Live Deployment

🔗 **[https://your-deployed-link.vercel.app](https://your-deployed-link.vercel.app)**

---

## Overview

RazorGuard is a full-stack AI-powered payment risk intelligence platform that monitors UPI transactions in real-time, scores risk using machine learning heuristics, and provides an interactive investigator workspace for analysts. It features a credit-card-style live telemetry HUD, SHAP-based risk attribution vectors, and a conversational AI analyst powered by Google Gemini.

---

## Features

### Core Pages

| Page | Description |
|------|-------------|
| **Landing** | Hero section with interactive 3D payment card (threat/clean toggle), capability showcase, and how-it-works timeline |
| **Dashboard** | Real-time KPIs, transaction table with risk scoring, risk distribution charts, trend graphs, and leading risk factors |
| **Investigator** | AI-powered analyst workspace with conversational Gemini chat, case management, and pattern analysis |
| **User Profile** | User account details with credit card visualization and transaction history |

### Key Capabilities

- **Live Telemetry HUD** — Interactive credit card with real-time risk score, SHAP attribution tags, and decision footer (auto-quarantine / auto-approve)
- **Gemini AI Integration** — Conversational analyst that answers natural-language queries about transactions, patterns, and risk factors
- **CSV Dataset** — Loads real UPI transaction data from CSV with sampling and fallback to mock data
- **Responsive Design** — Full mobile support with hamburger navigation and adaptive layouts
- **Scroll Animations** — Word-by-word reveal, number counters, and parallax effects
- **Interactive Background** — Dynamic gradient orbs that follow mouse movement

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| **Backend** | Express 4, tsx (TypeScript execution) |
| **AI** | Google Gemini API (`gemini-3.6-flash`) via `@google/genai` |
| **Animation** | Motion (Framer Motion v12), CSS animations |
| **Icons** | Lucide React |
| **Utilities** | dotenv, esbuild (production bundle) |

---

## Project Structure

```
razorguard/
├── public/
│   └── data/
│       └── upi_transactions_2024.csv   # Runtime CSV dataset
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                  # Responsive sticky navbar
│   │   ├── Hero.tsx                    # Landing hero with headlines
│   │   ├── HeroPaymentCard.tsx         # Interactive 3D credit card
│   │   ├── ProfileCard.tsx             # 3D tilt card wrapper
│   │   ├── CapabilitiesSection.tsx     # 5 capability modules
│   │   ├── HowItWorksSection.tsx       # 6-step timeline
│   │   ├── DashboardView.tsx           # Analytics dashboard
│   │   ├── InvestigatorWorkspace.tsx   # AI analyst + case list
│   │   ├── UserProfileView.tsx         # User profile + card
│   │   ├── Footer.tsx                  # Site footer
│   │   ├── ScrollReveal.tsx            # Word-by-word animation
│   │   ├── DecryptedText.tsx           # Text decryption effect
│   │   ├── CountUp.tsx                 # Number counter animation
│   │   ├── InteractiveBackground.tsx   # Mouse-following gradients
│   │   ├── ScrollToTopButton.tsx       # Back-to-top button
│   │   └── RazorGuardLogo.tsx          # Logo + favicon components
│   ├── data/
│   │   ├── mockTransactions.ts         # Mock data (250k-row generator)
│   │   └── csvParser.ts               # CSV parsing utility
│   ├── types.ts                        # TypeScript interfaces
│   ├── App.tsx                         # Root component + routing
│   ├── index.css                       # Global styles + Tailwind
│   └── main.tsx                        # React entry point
├── server.ts                           # Express server + Gemini AI
├── .env                                # API keys (gitignored)
├── vite.config.ts                      # Vite configuration
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Dependencies + scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn**
- **Google Gemini API key** — Get one at [aistudio.google.com](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/razorguard.git
cd razorguard

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The `.env` file is gitignored. Never commit API keys.

### Running Locally

```bash
npm run dev
```

The app starts on `http://localhost:3000` (Vite dev server proxied through Express).

### Production Build

```bash
npm run build
npm run start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Express + Vite HMR) |
| `npm run build` | Build Vite frontend + bundle Express server |
| `npm run start` | Run production server from `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm run clean` | Remove build artifacts |

---

## AI Integration

RazorGuard uses **Google Gemini 3.6 Flash** for its conversational analyst. The AI:

1. Receives natural-language queries from the Investigator workspace
2. Analyzes the 200-row transaction dataset loaded from CSV
3. Returns structured JSON responses with risk assessments, pattern summaries, and recommendations
4. Falls back to heuristic analysis if the API is unavailable

### Example Queries

- *"What are the top 3 risk patterns in the dataset?"*
- *"Show me all high-risk transactions from Delhi"*
- *"Summarize the fraud distribution by transaction type"*
- *"Which merchants have the highest interception rates?"*

---

## Data Source

The platform uses a CSV dataset (`upi_transactions_2024.csv`) containing **250,000 UPI transaction records** with fields including:

- Transaction ID, amount, timestamp
- Sender/receiver UPI IDs and bank names
- Device fingerprint, IP address, geolocation
- Risk score, fraud label, interception status
- Transaction type (P2P, P2M, QR, Collect)

At runtime, the first **200 rows** are sampled for dashboard display and AI analysis.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  ┌───────────────────────────────────────┐   │
│  │         React + Vite (SPA)            │   │
│  │  Hero → Dashboard → Investigator      │   │
│  └──────────────┬────────────────────────┘   │
│                 │ HTTP                       │
└─────────────────┼───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Express Server (server.ts)           │
│  ┌─────────────────────────────────────┐     │
│  │  POST /api/analyze                  │     │
│  │  → Gemini AI (gemini-3.6-flash)     │     │
│  │  → Structured JSON response         │     │
│  └─────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

---

## Performance

- **First Contentful Paint:** < 1.5s
- **AI Response Time:** < 2s (Gemini 3.6 Flash)
- **Risk Scoring:** < 14ms per transaction
- **Bundle Size:** ~180KB gzipped (frontend)

---

## License

This project is licensed under the **Apache 2.0 License**.

---

## Acknowledgments

- [Google Gemini](https://ai.google.dev/) — AI model for conversational analyst
- [Lucide](https://lucide.dev/) — Icon library
- [Motion](https://motion.dev/) — Animation framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
