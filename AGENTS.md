# AGENTS.md - Password Saver Project

**Instructions for LLMs (Large Language Models) working on this codebase. READ THIS FIRST.**

---

## CRITICAL: Git Operations Prohibited

**AGENTS MUST NEVER perform any git operation unless explicitly instructed by the user in their prompt.**

- Do NOT run: `git add`, `git commit`, `git push`, `git rebase`, `git merge`
- Do NOT create branches, tags, or any git objects
- Do NOT stage or commit any changes automatically
- DO wait for explicit user instruction for any git-related action
- This applies even to documentation changes like this AGENTS.md file itself

---

## Project Overview

**Password Saver** is a secure, cross-platform, local-first password manager built with:

| Component | Technology |
|-----------|------------|
| Framework | [Tauri 2](https://tauri.app/) (Rust-based desktop framework) |
| Frontend | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) |
| Backend | [Rust 2021 Edition](https://www.rust-lang.org/) |
| Database | [SQLite](https://www.sqlite.org/) via [rusqlite](https://github.com/rusqlite/rusqlite) |
| Styling | [NextUI v2](https://nextui.org/) (React component library) |

### Purpose
A local-first password manager that stores credentials securely on the user's device. **All data remains local - no cloud sync or network transmission.**

### Current Status
- Backend (Rust + Tauri commands) - Complete
- Database schema and operations - Complete
- Frontend (React + NextUI) - **NOT YET STARTED - PRIORITY**
- Encryption at rest - **MANDATORY BEFORE PRODUCTION**
- Password generator - To be implemented
- Export/import (JSON) - To be implemented

---

## Development Priority & Roadmap

### Phase 1: Core Functionality
- [x] Database schema and CRUD operations (Backend complete)
- [x] Tauri command API (Backend complete)
- [ ] Frontend React components with NextUI

### Phase 2: Critical Security & Features (ALL EQUALLY IMPORTANT)
- [ ] **Encryption at rest** - MUST be implemented before any production use
- [ ] **Password generator** - Standard strict password policies
- [ ] **Export/import** - JSON format only
- [ ] **UI polish** - Complete the NextUI frontend

### Phase 3: Additional Features
- [ ] Automatic encrypted backups
- [ ] Advanced search and filtering

---

## Repository Structure

```
password-saver/
├── AGENTS.md                    # This file - LLM instructions
├── README.md                    # Project description
├── index.html                   # Entry HTML file (Vite root)
├── package.json                 # Frontend dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript configuration (Vite)
├── vite.config.ts               # Vite bundler configuration
├── node_modules/                # Frontend dependencies
├── public/                      # Static assets
└── src-tauri/                   # Tauri backend (Rust)
    ├── Cargo.toml               # Rust dependencies
    ├── Cargo.lock               # Dependency lock file
    ├── build.rs                 # Build script
    ├── tauri.conf.json          # Tauri application configuration
    ├── capabilities/            # Tauri permission definitions
    │   └── default.json         # Default capability set
    ├── gen/                     # Generated files (schemas)
    │   └── schemas/             # JSON schemas for Tauri API
    ├── icons/                   # Application icons
    └── src/                     # Rust source code
        ├── main.rs              # Application entry point
        ├── lib.rs               # Tauri commands and state
        └── db.rs                # Database operations (SQLite)
└── src/                        # React frontend - TO BE CREATED
    ├── main.tsx                 # React entry point with NextUI provider
    ├── App.tsx                  # Main application component
    ├── types/                   # TypeScript interfaces
    │   └── password.ts          # PasswordEntry type definitions
    ├── components/              # React components (ALL MUST USE NEXTUI V2)
    │   ├── PasswordList.tsx     # List view of password entries
    │   ├── PasswordForm.tsx     # Add/edit password form
    │   ├── PasswordView.tsx     # View single password details
    │   └── SearchBar.tsx        # Basic text search component
    ├── hooks/                   # Custom React hooks
    │   └── usePasswords.ts      # Password data operations
    └── utils/                   # Utility functions
        └── api.ts               # Tauri API wrapper functions
```

---

## LLM Behavior & Guidelines

### General Approach
1. **Functionality First** - Make it work, then make it right
2. **Ask for Clarification Often** - Before making significant changes or assumptions, confirm with the user
3. **Minimal Changes** - Prefer the smallest possible change that solves the problem
4. **Security-Conscious** - Always consider security implications, especially for a password manager

### When Working on Tasks
- Open with a brief plan before acting
- Read all relevant files before making changes
- Prove it works (test commands, verify output)
- Report what changed and why
- Do NOT make assumptions about unstated requirements
- Do NOT implement features not requested

### Communication Style
- Be concise and direct (under 150 words of prose for most tasks)
- Use clear structure (bullet points, tables, code blocks)
- State what you will do before doing it
- Explain the shape of the solution in your closing summary

---

## Prerequisites

### Required
- **Rust**: 1.70+ (for Tauri 2 compatibility)
- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+
- **Tauri CLI**: `npm install -g @tauri-apps/cli`
- **NextUI v2**: `npm install @nextui-org/react framer-motion` (MANDATORY)

### Recommended
- **Rust toolchain**: `rustup`, `cargo`, `rustfmt`, `clippy`
- **TypeScript tooling**: ESLint, Prettier (not yet configured)

---

## Setup & Running

### Initial Setup
```bash
# Install frontend dependencies
npm install

# Install NextUI (REQUIRED for all frontend work)
npm install @nextui-org/react framer-motion

# Install Rust toolchain (if not already installed)
# See: https://www.rust-lang.org/tools/install
```

### Development
```bash
# Frontend development mode (hot reload)
npm run dev

# Run Tauri application in development
npm run tauri dev
```

### Production
```bash
# Build frontend
npm run build

# Build Tauri application for production
npm run tauri build
```

---

## Coding Conventions

### Rust (Backend)

#### Formatting & Linting
- Use `rustfmt` for code formatting
- Use `clippy` for linting: `cargo clippy`
- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)

#### Style
- **Naming**: `snake_case` for variables, functions, modules
- **Types**: `PascalCase` for structs, enums, traits
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Error handling**: Use `Result<T, E>` with descriptive error types
- **Documentation**: Use `///` for documentation comments

#### Patterns
- Use `anyhow` or custom error types for application errors
- Use `serde` for serialization/deserialization
- Use `Arc<Mutex<T>>` for shared state (thread-safe)
- Prefer `&str` over `String` for function parameters when possible
- Use `Option<T>` for nullable fields

#### Database (SQLite/rusqlite)
- Use **parameterized queries** to prevent SQL injection (MANDATORY)
- Use `params![]` macro for query parameters
- Wrap database operations in transactions where appropriate
- Always handle `rusqlite::Result` errors
- **Database location**: Tauri app data directory (automatic, secure, OS-specific)

### TypeScript (Frontend)

#### Formatting & Linting
- Use Prettier for formatting (recommended - not yet configured)
- Use ESLint for linting (recommended - not yet configured)
- TypeScript compiler options: `strict: true` (already configured)

#### Style
- **Naming**: `camelCase` for variables and functions
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_CASE`
- **Components**: `PascalCase` for React component names
- **Files**: `kebab-case` for file names

#### Patterns
- Use functional components with TypeScript
- Use React hooks (`useState`, `useEffect`, etc.)
- Type all props and state explicitly
- Use `interface` for object shapes, `type` for unions/aliases
- Import Tauri APIs from `@tauri-apps/api`

#### UI Components - **STRICT REQUIREMENT: Use NextUI v2 ONLY**

**MANDATORY**: ALL React components MUST use [NextUI v2](https://nextui.org/) for styling and UI elements.

USE THESE:
- Import from `@nextui-org/react` (e.g., `import { Button, Input, Card } from "@nextui-org/react"`)
- Use NextUI's `Button`, `Input`, `Card`, `Modal`, `Table`, `Dropdown`, `Select`, `Checkbox`, `Radio`, `Textarea`
- Use NextUI's theming system (`NextUIProvider`) with default themes
- Use NextUI's layout components: `Container`, `Grid`, `Row`, `Col`, `Spacer`
- Use NextUI's feedback components: `useDisclosure`, `useToast`, `Snippet`, `Tooltip`
- Use NextUI's data display: `Table`, `List`, `Avatar`, `Badge`, `Chip`

NEVER USE:
- Plain HTML elements for interactive components (use NextUI equivalents)
- Other UI libraries (Material-UI, Chakra, Ant Design, Bootstrap, Tailwind CSS, etc.)
- Custom CSS for component styling (use NextUI's props)
- Inline styles for layout and spacing (use NextUI's spacing props)
- Any styling approach other than NextUI v2

---

## Security Requirements

**THIS IS A PASSWORD MANAGER - SECURITY IS CRITICAL**

### Non-Negotiable Rules

1. **Encryption at Rest - MANDATORY BEFORE PRODUCTION**
   - Plaintext storage is acceptable **ONLY during development**
   - **MUST implement encryption before any production use**
   - Use AES-256 or equivalent
   - Encrypt the `password` field minimum
   - Consider encrypting `username`, `notes`, `URL` fields

2. **NO LOGGING OF SENSITIVE DATA**
   - **NEVER log passwords or any sensitive information**
   - **NEVER include passwords in error messages**
   - Avoid logging entirely if possible
   - If logging is necessary, ensure NO sensitive data is captured

3. **Key Management**
   - Derive encryption key from master password using PBKDF2, Argon2, or similar
   - Never store the master password
   - Store only a salt and key derivation parameters
   - Use `secrecy` crate for sensitive data in Rust

4. **Database Location & Protection**
   - Store database in **Tauri app data directory** (automatic, secure, OS-specific)
   - Set appropriate file permissions on the database file
   - Implement **automatic encrypted backups**

5. **Input Validation & Sanitization**
   - **Always** use parameterized queries (prevent SQL injection)
   - **Always** validate input on the backend
   - **Always** sanitize output to the frontend
   - Use constant-time comparison for secrets

6. **Field Requirements**
   - **Title**: REQUIRED (only mandatory field)
   - **Password**: Optional but recommended
   - **Username, URL, Notes**: All optional

### Recommended Security Libraries
- **Rust**: `secrecy`, `aes-gcm`, `argon2`, `pbkdf2`, `zeroize`, `rand`
- **TypeScript**: Web Crypto API (built-in), `libsodium-wrappers`

---

## Database Schema

### Table: passwords

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | INTEGER | NO | Primary key, auto-increment |
| `title` | TEXT | NO | Display name for the entry (**REQUIRED**) |
| `username` | TEXT | YES | Username/email for login |
| `password` | TEXT | YES | The stored password |
| `url` | TEXT | YES | Associated website URL |
| `notes` | TEXT | YES | Additional notes |
| `created_at` | TEXT | NO | ISO 8601 timestamp (UTC) |
| `updated_at` | TEXT | NO | ISO 8601 timestamp (UTC) |

### Indexes
- `idx_passwords_title`: Index on the `title` column for faster searches

### Schema SQL

```sql
CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    username TEXT,
    password TEXT,
    url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_passwords_title ON passwords(title);
```

---

## Tauri Commands (API)

All commands are exposed via Tauri's invoke system and must be registered in `src-tauri/src/lib.rs`.

### Available Commands

| Command | Description | Parameters | Returns |
|---------|-------------|------------|---------|
| `add_password` | Create a new password entry | `PasswordEntry` | `PasswordEntry` (with id) |
| `get_password` | Retrieve a single password by ID | `id: i64` | `Option<PasswordEntry>` |
| `list_passwords` | Retrieve all passwords | None | `Vec<PasswordEntry>` |
| `update_password` | Update an existing password | `id: i64`, `PasswordEntry` | `PasswordEntry` |
| `delete_password` | Delete a password by ID | `id: i64` | `bool` (success) |
| `search_passwords` | Search passwords by query | `query: &str` | `Vec<PasswordEntry>` |

### Search Behavior
- **Basic text search** across: `title`, `username`, `url` fields
- Case-insensitive matching recommended
- Return all matching entries

### Command Registration

```rust
// In src-tauri/src/lib.rs
.invoke_handler(tauri::generate_handler![
    add_password,
    get_password,
    list_passwords,
    update_password,
    delete_password,
    search_passwords
])
```

### Frontend Usage Examples

```typescript
import { invoke } from '@tauri-apps/api';

// Add a password (only title is required)
const newEntry = await invoke('add_password', { 
    title: 'My Account',        // REQUIRED
    username: 'user@example.com',
    password: 'secure-password',
    url: 'https://example.com',
    notes: 'Important account',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});

// List all passwords
const passwords = await invoke('list_passwords');

// Get a specific password
const password = await invoke('get_password', { id: 1 });

// Update a password
const updated = await invoke('update_password', { 
    id: 1,
    title: 'Updated Title',
    username: 'newuser@example.com',
    password: 'new-password',
    url: 'https://example.com',
    notes: 'Updated notes',
    created_at: password.created_at,  // Preserve original created_at
    updated_at: new Date().toISOString()
});

// Delete a password
const deleted = await invoke('delete_password', { id: 1 });

// Search passwords (basic text search)
const results = await invoke('search_passwords', { query: 'example' });
```

---

## Frontend Requirements

### Mandatory Structure

```
src/
├── main.tsx                    # React entry point with NextUI provider
├── App.tsx                     # Main application component
├── types/
│   └── password.ts             # TypeScript interfaces for PasswordEntry
├── components/
│   ├── PasswordList.tsx        # List of password entries (use NextUI Table/Card)
│   ├── PasswordForm.tsx        # Add/edit password form (use NextUI Input/Button/Modal)
│   ├── PasswordView.tsx        # View single password (use NextUI Card/Modal)
│   └── SearchBar.tsx           # Basic text search (use NextUI Input)
├── hooks/
│   └── usePasswords.ts         # Custom hook for password CRUD operations
└── utils/
    └── api.ts                  # Tauri API wrapper functions
```

### NextUI Provider Setup (main.tsx)

```typescript
import { NextUIProvider } from '@nextui-org/react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <App />
  </NextUIProvider>
);
```

### Type Definitions (types/password.ts)

```typescript
// Matches the Rust PasswordEntry structure
export interface PasswordEntry {
    id: number | null;
    title: string;              // REQUIRED
    username?: string;
    password?: string;
    url?: string;
    notes?: string;
    created_at: string;        // RFC3339 format
    updated_at: string;        // RFC3339 format
}
```

---

## Testing Requirements

**TESTS ARE MANDATORY FOR ALL NEW FEATURES**

### Backend (Rust) Tests

Tests must be added to Rust source files using `#[cfg(test)]` modules.

```bash
# Run all tests
cargo test

# Run tests with coverage (requires cargo-tarpaulin)
cargo tarpaulin

# Run clippy for linting
cargo clippy

# Check formatting
cargo fmt --check
```

### Frontend (TypeScript/React) Tests

Recommended setup:

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

### Integration Testing

Test the Tauri commands by:
1. Running the application in development mode
2. Using the frontend to call backend commands
3. Verifying database state changes
4. Testing edge cases and error conditions

---

## Common Tasks & Workflows

### Adding a New Tauri Command

1. Add the command function in `src-tauri/src/lib.rs`:
   ```rust
   #[tauri::command]
   fn command_name(state: tauri::State<'_, AppState>, params: Type) -> Result<ReturnType, String> {
       // Implementation
   }
   ```

2. Register the command in the `invoke_handler`:
   ```rust
   .invoke_handler(tauri::generate_handler![
       // ... existing commands
       command_name,
   ])
   ```

3. Define the TypeScript interface in `src/types/`:
   ```typescript
   export interface CommandParams {
       // params here
   }
   export interface CommandResult {
       // result here
   }
   ```

4. Create wrapper function in `src/utils/api.ts`:
   ```typescript
   export async function commandName(params: CommandParams): Promise<CommandResult> {
       return await invoke('command_name', params);
   }
   ```

5. Use the command in components via the custom hook or directly

### Adding a New Frontend Component

1. Create the component file in `src/components/` (PascalCase name)
2. Import ONLY from `@nextui-org/react` for UI elements
3. Use TypeScript interfaces for props
4. Follow React best practices (functional components, hooks)
5. Add the component to the appropriate parent component

### Adding a New Database Field

1. Update the schema in `src-tauri/src/db.rs`
2. Update the `PasswordEntry` struct in both `db.rs` and `lib.rs`
3. Update all database operations (create, read, update)
4. Update the TypeScript types in `src/types/password.ts`
5. Update any affected frontend components

---

## Error Handling

### Backend (Rust)
- Use descriptive error types (not generic strings)
- Return `Result<T, String>` for Tauri commands (for now)
- Consider creating custom error enum for better error handling
- Never expose sensitive information in error messages

### Frontend (TypeScript)
- Catch all errors from Tauri invoke calls
- Display **user-friendly messages only** (no technical details)
- Log errors to console for debugging (but ensure no sensitive data)
- Provide clear feedback to users about what went wrong

Example:
```typescript
try {
    const result = await invoke('some_command', params);
} catch (error) {
    // Display user-friendly message
    setError('Failed to complete operation. Please try again.');
    // Log to console for debugging (ensure no sensitive data)
    console.error('Operation failed:', error);
}
```

---

## Troubleshooting

### Common Issues

1. **Tauri commands not found**: Ensure commands are registered in `invoke_handler` in `lib.rs`
2. **Database errors**: Check that the app data directory is writable
3. **TypeScript errors**: Run `npm run build` to check TypeScript compilation
4. **Rust compilation errors**: Run `cargo check` for detailed error messages
5. **NextUI not working**: Ensure `@nextui-org/react` and `framer-motion` are installed

### Debugging Commands

```bash
# Frontend development logs
npm run dev

# Backend logs (Rust)
cargo run -- --verbose

# Check Tauri app data directory location
# On Windows: %APPDATA%\password-saver\
# On macOS: ~/Library/Application Support/password-saver/
# On Linux: ~/.config/password-saver/ or ~/.local/share/password-saver/
```

---

## Resources

- [Tauri Documentation](https://tauri.app/v2/guides/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [NextUI v2 Documentation](https://nextui.org/)
- [rusqlite Documentation](https://docs.rs/rusqlite/latest/rusqlite/)
- [Rust Documentation](https://doc.rust-lang.org/)

---

## Contributing

### For Human Contributors
1. Create a feature branch
2. Make minimal, focused changes
3. Add tests for new functionality
4. Update this AGENTS.md if project structure changes
5. Submit a pull request with clear description

### For LLMs (This File's Purpose)
- Follow all instructions in this document
- Prioritize functionality first
- Ask for clarification before making assumptions
- Always consider security implications
- Never perform git operations without explicit instruction

---

*Last updated: 2026-09-18*
*Project status: Backend complete, Frontend to be created, Encryption mandatory before production*
