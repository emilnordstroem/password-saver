# AGENTS.md - Password Saver Project

This file provides instructions for language models (AI assistants) working on the **Password Saver** codebase. Read this first before making changes.

---

## CRITICAL: Git Operations Prohibited

**AGENTS MUST NEVER commit to git, push to remotes, or perform any git operations unless the user explicitly instructs them to do so in their prompt.**

- Do NOT run: `git add`, `git commit`, `git push`, `git rebase`, `git merge`
- Do NOT create branches, tags, or any git objects
- Do NOT stage or commit any changes automatically
- DO wait for explicit user instruction for any git-related action

This applies even to documentation changes like this AGENTS.md file itself.

---


## Project Overview

**Password Saver** is a secure, cross-platform password manager built with:

| Component | Technology |
|-----------|------------|
| Framework | [Tauri 2](https://tauri.app/) (Rust-based desktop framework) |
| Frontend | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) |
| Backend | [Rust 2021 Edition](https://www.rust-lang.org/) |
| Database | [SQLite](https://www.sqlite.org/) via [rusqlite](https://github.com/rusqlite/rusqlite) |
| Styling | [NextUI v2](https://nextui.org/) (React component library) |

### Purpose
A local-first password manager that stores credentials securely on the user's device using SQLite encryption.

---

## Repository Structure

```
password-saver/
├── AGENTS.md                    # This file - AI assistant instructions
├── README.md                    # Basic project description
├── index.html                   # Entry HTML file (Vite root)
├── package.json                 # Frontend dependencies and scripts
├── tsconfig.json                # TypeScript configuration (frontend)
├── tsconfig.node.json           # TypeScript configuration (Vite)
├── vite.config.ts               # Vite bundler configuration
├── node_modules/                # Frontend dependencies
├── public/                      # Static assets (currently empty)
└── src-tauri/                   # Tauri backend (Rust)
    ├── Cargo.toml               # Rust dependencies and build config
    ├── Cargo.lock               # Dependency lock file
    ├── build.rs                 # Build script
    ├── tauri.conf.json          # Tauri application configuration
    ├── capabilities/            # Tauri permission definitions
    │   └── default.json         # Default capability set
    ├── gen/                     # Generated files (schemas)
    │   └── schemas/             # JSON schemas for Tauri API
    ├── icons/                   # Application icons
    ├── src/                     # Rust source code
    │   ├── main.rs              # Application entry point
    │   ├── lib.rs               # Tauri commands and state
    │   └── db.rs                # Database operations (SQLite)
    └── target/                  # Build artifacts
```

**Note**: The frontend `src/` directory for React components does not yet exist and needs to be created.

---

## Development Guidelines

### Prerequisites

- **Rust**: 1.70+ (for Tauri 2 compatibility)
- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+
- **Tauri CLI**: `npm install -g @tauri-apps/cli`

### Installation

```bash
# Install frontend dependencies
npm install

# Install NextUI (required for all frontend components)
npm install @nextui-org/react framer-motion

# Install Rust toolchain (if not already installed)
# See: https://www.rust-lang.org/tools/install

# Install Tauri dependencies
npm run tauri -- init  # If setting up for the first time
```

### Running the Application

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Run Tauri application
npm run tauri dev      # Development
npm run tauri build    # Production build
```

---

## Coding Conventions

### Rust (Backend)

#### Formatting & Linting
- Use `rustfmt` for code formatting
- Use `clippy` for linting: `cargo clippy`
- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)

#### Style
- **Naming**: Use `PascalCase` for variables, functions, and modules
- **Types**: Use `PascalCase` for structs, enums, and traits
- **Constants**: Use `SCREAMING_SNAKE_CASE`
- **Error handling**: Use `Result<T, E>` with descriptive error types
- **Documentation**: Use `///` for documentation comments

#### Patterns
- Use `anyhow` or custom error types for application errors
- Use `serde` for serialization/deserialization
- Use `Arc<Mutex<T>>` for shared state (thread-safe)
- Prefer `&str` over `String` for function parameters when possible
- Use `Option<T>` for nullable fields

#### Database (SQLite/rusqlite)
- Use parameterized queries to prevent SQL injection
- Use `params![]` macro for query parameters
- Wrap database operations in transactions where appropriate
- Always handle `rusqlite::Result` errors

### TypeScript (Frontend)

#### Formatting & Linting
- Use Prettier for formatting (not yet configured - recommended)
- Use ESLint for linting (not yet configured - recommended)
- TypeScript compiler options: `strict: true` (already configured)

#### Style
- **Naming**: Use `camelCase` for variables and functions
- **Types/Interfaces**: Use `PascalCase`
- **Constants**: Use `UPPER_CASE`
- **Components**: Use `PascalCase` for React component names
- **Files**: Use `kebab-case` for file names

#### Patterns
- Use functional components with TypeScript
- Use React hooks (`useState`, `useEffect`, etc.)
- Type all props and state explicitly
- Use `interface` for object shapes, `type` for unions/aliases
- Import Tauri APIs from `@tauri-apps/api`

#### UI Components - **MANDATORY: Use NextUI v2**
- **ALL** React components must use [NextUI v2](https://nextui.org/) for styling and UI elements
- Import from `nextui-org/react` (e.g., `import { Button, Input, Card } from "nextui-org/react"`)
- Use NextUI's `Button`, `Input`, `Card`, `Modal`, `Table`, `Dropdown`, etc. instead of raw HTML or other libraries
- Use NextUI's theming system for consistent styling across the application
- Follow NextUI's component props API and patterns
- For forms, use NextUI's `Input`, `Select`, `Checkbox`, `Radio`, `Textarea` components
- For layouts, use NextUI's `Container`, `Grid`, `Row`, `Col`, `Spacer` components
- For feedback, use NextUI's `useDisclosure`, `useToast`, `Snippet`, `Tooltip`
- For data display, use NextUI's `Table`, `List`, `Avatar`, `Badge`, ` Chip`

**Do NOT use**:
- Plain HTML elements for interactive components (use NextUI equivalents)
- Other UI libraries (Material-UI, Chakra, Ant Design, etc.)
- Custom CSS for component styling (use NextUI's props)
- Inline styles for layout and spacing (use NextUI's spacing props)

### Common Patterns in This Project

#### Tauri Command Structure
```rust
// In lib.rs
#[tauri::command]
fn command_name(state: tauri::State<'_, AppState>, params: Type) -> Result<ReturnType, String> {
    // Implementation
}
```

#### Database Operations
```rust
// Use connection pooling via Arc<Mutex<Connection>>
let db = state.db.lock().map_err(|e| e.to_string())?;
let result = db.some_operation(params).map_err(|e| e.to_string())?;
```

---

## Database Schema

### Tables

#### `passwords`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | INTEGER | NO | Primary key, auto-increment |
| `title` | TEXT | NO | Display name for the entry |
| `username` | TEXT | YES | Username/email for login |
| `password` | TEXT | NO | The stored password |
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
    password TEXT NOT NULL,
    url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_passwords_title ON passwords(title);
```

### Data Model (Rust)

```rust
// In src-tauri/src/db.rs
pub struct PasswordEntry {
    pub id: Option<i64>,
    pub title: String,
    pub username: Option<String>,
    pub password: String,
    pub url: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
```

### Serialization Model (Tauri API)

```rust
// In src-tauri/src/lib.rs
#[derive(Serialize, Deserialize)]
pub struct PasswordEntry {
    pub id: Option<i64>,
    pub title: String,
    pub username: Option<String>,
    pub password: String,
    pub url: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,   // RFC3339 format
    pub updated_at: String,   // RFC3339 format
}
```

---

## Tauri Commands (API)

All commands are exposed via Tauri's invoke system and must be registered in `src-tauri/src/lib.rs` in the `invoke_handler`.

### Available Commands

| Command | Description | Parameters | Returns |
|---------|-------------|------------|---------|
| `add_password` | Create a new password entry | `PasswordEntry` | `PasswordEntry` (with id) |
| `get_password` | Retrieve a single password by ID | `id: i64` | `Option<PasswordEntry>` |
| `list_passwords` | Retrieve all passwords | None | `Vec<PasswordEntry>` |
| `update_password` | Update an existing password | `id: i64`, `PasswordEntry` | `PasswordEntry` |
| `delete_password` | Delete a password by ID | `id: i64` | `bool` (success) |
| `search_passwords` | Search passwords by query | `query: &str` | `Vec<PasswordEntry>` |

### Command Registration

```rust
// In src-tauri/src/lib.rs:144-151
.invoke_handler(tauri::generate_handler![
    add_password,
    get_password,
    list_passwords,
    update_password,
    delete_password,
    search_passwords
])
```

### Frontend Usage

```typescript
import { invoke } from '@tauri-apps/api';

// Add a password
const newEntry = await invoke('add_password', { 
    title: 'My Account',
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
    created_at: password.created_at,
    updated_at: new Date().toISOString()
});

// Delete a password
const deleted = await invoke('delete_password', { id: 1 });

// Search passwords
const results = await invoke('search_passwords', { query: 'example' });
```

---

## Testing Instructions

### Backend (Rust) Tests

Tests should be added to the Rust source files using `#[cfg(test)]` modules.

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

Testing framework not yet configured. Recommended setup:

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

---

## Security Considerations

**THIS IS A PASSWORD MANAGER - SECURITY IS CRITICAL**

### Data Security

- **Storage**: Passwords are currently stored in plaintext in SQLite (TODO: implement encryption)
- **Transmission**: All data stays local - no network transmission
- **Memory**: Passwords are passed through Rust's `String` type (not zeroized after use)

### Required Security Implementations (TODO)

1. **Encryption at Rest**: Implement AES-256 encryption for password entries
   - Use a master password to derive encryption key
   - Encrypt the `password` field before storage
   - Consider encrypting other sensitive fields (username, notes, URL)

2. **Secure Memory Handling**: 
   - Zeroize password strings after use
   - Use `secrecy` crate for sensitive data

3. **Key Management**:
   - Derive encryption key from master password using PBKDF2, Argon2, or similar
   - Never store the master password
   - Store only a salt and key derivation parameters

4. **Database Protection**:
   - Set appropriate file permissions on the database file
   - Store database in the application's secure data directory

5. **Clipboard Security**:
   - Clear clipboard after copying passwords
   - Use secure clipboard APIs

### Current Security Status

| Feature | Status | Priority |
|---------|--------|----------|
| Encryption at rest | ❌ Not implemented | **HIGH** |
| Master password | ❌ Not implemented | **HIGH** |
| Secure memory handling | ❌ Not implemented | **HIGH** |
| Database file permissions | ⚠️ Partial (OS-dependent) | Medium |
| Clipboard clearing | ❌ Not implemented | Medium |

### Security Libraries to Consider

- **Rust**: `secrecy`, `aes-gcm`, `argon2`, `pbkdf2`, `zeroize`
- **TypeScript**: `libsodium-wrappers`, `crypto-js` (or use Web Crypto API)

### Security Best Practices

1. **Never** log passwords or sensitive data
2. **Never** include passwords in error messages
3. **Always** use parameterized queries (prevent SQL injection)
4. **Always** validate input on the backend
5. **Always** sanitize output to the frontend
6. Use secure random number generation for keys/salts
7. Use constant-time comparison for secrets

---

## Common Tasks and Workflows

### Adding a New Tauri Command

1. Add the command function in `src-tauri/src/lib.rs`:
   ```rust
   #[tauri::command]
   fn new_command(state: tauri::State<'_, AppState>, params: Type) -> Result<ReturnType, String> {
       // Implementation
   }
   ```

2. Register the command in the `invoke_handler`:
   ```rust
   .invoke_handler(tauri::generate_handler![
       // ... existing commands
       new_command,
   ])
   ```

3. Define the TypeScript interface for the command in the frontend (recommended):
   ```typescript
   // In a types file
   interface NewCommandParams {
       // params here
   }
   interface NewCommandResult {
       // result here
   }
   ```

4. Call the command from the frontend:
   ```typescript
   const result = await invoke('new_command', params);
   ```

### Adding a New Database Field

1. Update the schema in `src-tauri/src/db.rs`:
   ```rust
   const SCHEMA: &str = r#"
       ALTER TABLE passwords ADD COLUMN new_field TEXT;
   "#;
   ```

2. Update the `PasswordEntry` struct in both `db.rs` and `lib.rs`:
   ```rust
   pub struct PasswordEntry {
       // ... existing fields
       pub new_field: Option<String>,
   }
   ```

3. Update all database operations (create, read, update)
4. Update the TypeScript types in the frontend

### Project Initialization Checklist

- [ ] Create `src/` directory for React frontend
- [ ] Set up React entry point (`src/main.tsx`)
- [ ] Create App component (`src/App.tsx`)
- [ ] Install NextUI: `npm install @nextui-org/react framer-motion`
- [ ] Configure NextUI provider in `main.tsx`
- [ ] Configure ESLint and Prettier
- [ ] Implement password encryption
- [ ] Add master password functionality
- [ ] Implement secure memory handling
- [ ] Add unit tests for backend
- [ ] Add unit tests for frontend
- [ ] Add integration tests

### Frontend Setup (Not Yet Created)

When creating the frontend, the following structure is recommended. **All components MUST use NextUI v2**:

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
│   └── SearchBar.tsx           # Search functionality (use NextUI Input)
├── hooks/
│   └── usePasswords.ts         # Custom hook for password operations
├── utils/
│   └── api.ts                  # Tauri API wrapper functions
└── styles/
    └── global.css              # Global styles (minimal - use NextUI theming)
```

#### NextUI Provider Setup (main.tsx)

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

---

## Important Files Reference

### `src-tauri/src/db.rs`
- Database schema definition
- `PasswordEntry` struct (Rust domain model)
- `DbConnection` struct with all CRUD operations
- Uses `rusqlite` for SQLite operations
- Uses `chrono` for datetime handling

### `src-tauri/src/lib.rs`
- Tauri commands (API endpoints)
- `AppState` struct (shared database connection)
- `PasswordEntry` struct (serializable version for API)
- Conversion traits between domain and API models
- Application setup and state management

### `src-tauri/src/main.rs`
- Application entry point
- Calls `password_saver_lib::run()`

### `src-tauri/Cargo.toml`
- Rust dependencies
- Build configuration
- Release optimizations

### `src-tauri/tauri.conf.json`
- Tauri application configuration
- Window settings
- Build commands
- Security settings (CSP currently disabled)

---

## Troubleshooting

### Common Issues

1. **Tauri commands not found**: Ensure commands are registered in `invoke_handler`
2. **Database errors**: Check that the database file path is writable
3. **TypeScript errors**: Run `npm run build` to check TypeScript compilation
4. **Rust compilation errors**: Run `cargo check` for detailed error messages

### Debugging

```bash
# Frontend logs
npm run dev

# Backend logs (Rust)
cargo run -- --verbose

# Inspect database
sqlite3 ~/.local/share/password-saver/passwords.db "SELECT * FROM passwords;"
```

---

## Resources

- [Tauri Documentation](https://tauri.app/v2/guides/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [rusqlite Documentation](https://docs.rs/rusqlite/latest/rusqlite/)
- [Rust Documentation](https://doc.rust-lang.org/)

---

## Contact & Contributing

For questions or issues, refer to the project's GitHub repository.

### IMPORTANT: Git Commit Policy
**Agents MUST NEVER commit anything to git unless explicitly instructed to do so through the user's prompt.**
- Do not run `git add`, `git commit`, `git push`, or any git commands
- Do not create commits, even for documentation changes
- Wait for explicit user instruction before any git operations

When contributing (for human contributors):
1. Create a feature branch
2. Make minimal, focused changes
3. Add tests for new functionality
4. Update this AGENTS.md if project structure changes
5. Submit a pull request with clear description

---

*Last updated: 2026-09-16*
*Project status: Early development (backend complete, frontend not yet started)*
