# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VicPhysio is a patient/client management system for physiotherapists and Pilates instructors. It allows managing client records (fichas) and tracking patient development over time. The main pain point being solved is easy sharing of records with clients via email/message.

**Technical decision**: Desktop-first (Electron) to work offline without hosting/authentication complexity. Also builds as web app from the same codebase.

## Common Commands

```bash
# Development
npm run web:dev          # Start web development server
npm run electron:dev     # Start Electron development mode

# Building
npm run web:build        # Build for web deployment
npm run electron:build   # Build Electron app (macOS/Linux)
npm run electron:build-windows  # Build Electron app for Windows

# Testing
npm test                 # Run all tests (vitest in watch mode)
npm test -- --run        # Run tests once without watch
npm test -- src/domain/ficha/entity/cliente.spec.ts  # Run single test file

# Code Quality
npm run lint             # Run ESLint
```

## Architecture

This codebase follows **Clean Architecture / DDD** principles:

### Layer Structure

```
src/
├── domain/              # Pure business logic (no external dependencies)
│   ├── @shared/         # Shared interfaces (RepositoryInterface)
│   └── ficha/           # Main domain module
│       ├── entity/      # Cliente, Ficha entities
│       ├── value-object/# Immutable validated objects (Peso, Altura, etc.)
│       └── enum/        # Domain enums (TipoFicha, Sexo, etc.)
├── infrastructure/      # Data persistence implementations
│   └── ficha/repository/sequelize/  # Sequelize repositories
└── config/              # Runtime configuration (isElectron detection)

electron/                # Electron-specific code (main process, preload)
```

### Key Patterns

- **Repository Pattern**: Generic `RepositoryInterface<T>` with CRUD operations, implemented by `ClienteRepository` and `FichaRepository`
- **Dependency Injection**: Constructor-based DI (e.g., `FichaRepository` receives `ClienteRepository`)
- **Value Objects**: Domain values with validation (e.g., `Peso` validates weight > 0, `NivelDor` validates 0-10 range)
- **Aggregate Root**: `Ficha` contains `Cliente` and form-specific fields

### Data Model

- **Cliente**: Fixed patient/student info (nome, contato, sexo, tipo: Fisioterapia|Pilates)
- **Ficha**: Assessment record at a specific date (medidas, observações, descrição do quadro)
- **Relationship**: One Cliente has many Fichas

### Data Persistence

- **Database**: SQLite with Sequelize ORM (local file: `vicphysio.db`)
- **Tables**: `clientes`, `fichas` (FK relationship)
- **Models**: Use `sequelize-typescript` decorators in `*.model.ts`
- **Testing**: In-memory SQLite mock at `src/infrastructure/@shared/repository/sequelize/__mocks__/sequelize.mock.ts`

### Electron/Web Build Differentiation

- Build target determined by `VITE_BUILD_TARGET` environment variable
- Runtime detection: `isElectron()` from `src/config/index.ts`
- Electron uses IPC via preload script; web uses standard APIs

## Testing

- Framework: Vitest + @testing-library/react
- Test files: `*.spec.ts` colocated with source files
- Global setup: `src/test-setup.ts`
- Repository tests use in-memory SQLite for isolation
