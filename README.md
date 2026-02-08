# VicPhysio — Patient Record Manager

A desktop application for physiotherapists and Pilates instructors to manage patient profiles and assessment records. Built with React, TypeScript, Electron, and SQLite — works completely offline.

## Features

- **Client management** — create, edit, and organize patient/student profiles
- **Assessment records** — specialized forms for Pilates and Physiotherapy evaluations
- **Offline-first** — local SQLite database, no server or internet required
- **Cross-platform** — builds for macOS, Windows, and Linux via Electron
- **Domain validation** — value objects enforce business rules (weight > 0, pain level 0–10, blood pressure format, etc.)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Desktop | Electron 30 |
| Database | SQLite 3 (better-sqlite3) |
| ORM | Sequelize + sequelize-typescript |
| Build | Vite, electron-builder |
| Tests | Vitest, React Testing Library |

## Architecture

The project follows **Clean Architecture / DDD** with clear layer separation:

```
┌─────────────────────────────────────┐
│          React UI (Pages)           │
│   ClientesListPage, FichaForm...    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Hooks + Service Factory         │
│  useClientes, useFichaMutations     │
│  ElectronService / WebService       │
└──────────────┬──────────────────────┘
               │ IPC (Electron) or HTTP (Web)
┌──────────────▼──────────────────────┐
│     Domain Entities + Value Objects │
│  Cliente, Ficha, Peso, Altura,     │
│  NivelDor, PressaoArterial...      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Repository (Sequelize → SQLite)   │
└─────────────────────────────────────┘
```

```
src/
├── domain/           # Entities, value objects, repository interfaces
├── application/      # DTOs for cross-layer communication
├── infrastructure/   # Sequelize models and repository implementations
├── services/         # Service interfaces + factory (Electron vs. Web)
├── hooks/            # React custom hooks for data operations
├── components/       # Reusable UI components
├── pages/            # Route-level page components
└── routes/           # React Router configuration

electron/
├── main.ts           # Electron app entry
├── preload.ts        # Context bridge (secure IPC)
├── ipc/              # IPC handlers for CRUD operations
└── database/         # SQLite connection setup
```

### Design Decisions

- **Value Objects** for domain validation — `Peso`, `Altura`, `NivelDor`, `PressaoArterial` enforce constraints at the domain level
- **Repository Pattern** abstracts persistence from business logic
- **Factory Pattern** for services — runtime detection (`isElectron()`) selects the appropriate implementation
- **Secure IPC** — Electron preload script exposes limited APIs via `contextBridge`
- **Multi-target build** — same React codebase runs as desktop (Electron) or web app

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Development

```bash
npm install
npm run rebuild          # Rebuild native modules (better-sqlite3)

npm run electron:dev     # Desktop app with hot reload
# or
npm run web:dev          # Web app at http://localhost:5173
```

### Testing

```bash
npm test                 # Vitest in watch mode
npm test -- --run        # Run once
npm run lint             # ESLint
```

### Production Build

```bash
npm run electron:build          # macOS/Linux
npm run electron:build-windows  # Windows
npm run web:build               # Web (output: dist/)
```

## Assessment Types

| Type | Fields |
|------|--------|
| **Pilates** | Weight, height, current complaint, medical history, medications |
| **Physiotherapy** | All Pilates fields + reflexes, palpation, pain level (0–10), active/passive movements, respiratory rate, blood pressure, O2 saturation, ICF classification, therapeutic objective |

Both types share common fields: date, complaint history, past medical history (alcoholism, smoking, obesity, sedentarism), food quality, and general observations.
