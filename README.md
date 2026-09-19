# Password Saver

> **A secure, local-first password manager built with Tauri and React**

Password Saver is a cross-platform desktop application that stores your credentials securely on your device. All data remains local — no cloud sync, no network transmission.

---

## Features

- **Local Storage**: All passwords stored in SQLite database on your machine
- **Secure**: Encryption at rest (implemented in backend)
- **Cross-Platform**: Windows, macOS, and Linux support via Tauri
- **Modern UI**: Built with React 19, NextUI v2, and Tailwind CSS
- **Password Generator**: Create strong, random passwords
- **Search & Filter**: Quickly find your credentials

---

## Product Demonstration

<div align="center">

### Dashboard
*The clean, organized dashboard shows all your stored credentials with a searchable list.* 
</br>
*Click any entry to view full details, including copy-to-clipboard functionality.*


<img src="https://github.com/user-attachments/assets/9567668f-5b7b-40fc-b367-6c8094eb03e7" 
     alt="Main Dashboard" 
     width="70%" 
     style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 24px;" />

### Built-in password generator
*Easily generate strong passwords using industry standard NIST SP 800-63B*

<img src="https://github.com/user-attachments/assets/42c63e8e-3321-4c38-b767-69e68205d6cb" 
     alt="Generate password" 
     width="70%" 
     style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 24px;" />
     
### Search
*Instant search across all your saved credentials.*
<img src="https://github.com/user-attachments/assets/7e6508de-988d-4d8d-8c74-533c1d00a9ee" 
     alt="Credential Details View" 
     width="70%" 
     style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 24px;" />

</div>

---

## Getting Started

### Prerequisites

- Rust 1.70+ 
- Node.js 18+ (LTS recommended)
- npm 9+
- Tauri CLI: `npm install -g @tauri-apps/cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/password-saver.git
cd password-saver

# Install dependencies
npm install
npm install @nextui-org/react framer-motion lucide-react

# Install Rust toolchain (if not already installed)
# See: https://www.rust-lang.org/tools/install
```

### Running the Application

```bash
# Development mode (hot reload)
npm run tauri dev

# Production build
npm run tauri build
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Tauri 2 |
| Frontend | React 19 + TypeScript + Vite |
| Backend | Rust 2021 Edition |
| Database | SQLite (via rusqlite) |
| Styling | NextUI v2 + Tailwind CSS |
| Icons | Lucide React |

---

## Project Structure

```
password-saver/
├── src/                          # React Frontend
│   ├── components/               # NextUI components
│   ├── pages/                   # Page components
│   ├── types/                   # TypeScript interfaces
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Utility functions
└── src-tauri/                    # Tauri Backend
    ├── src/                     # Rust source
    │   ├── main.rs              # Entry point
    │   ├── lib.rs               # Tauri commands
    │   └── db.rs                # Database operations
    └── tauri.conf.json          # Tauri configuration
```

---

## Security

- **Encryption at Rest**: AES-256 encryption for sensitive fields
- **Local-Only**: No data leaves your device
- **Secure Storage**: Database stored in OS-specific secure app data directory
- **No Tracking**: Zero telemetry or analytics
