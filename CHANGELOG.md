# Changelog

All notable changes to Password Saver will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Initial release of Password Saver
- Secure local-first password management
- AES-256 encryption at rest
- Cross-platform support (Windows, macOS, Linux)
- Modern UI with React 19, NextUI v2, and Tailwind CSS
- Password generator with NIST SP 800-63B standards
- Search and filter functionality
- Tauri auto-updater integration

---

## [1.0.0] - 2026-09-21

### Added
- First stable release
- Complete Tauri 2 backend with Rust
- SQLite database for password storage
- Full CRUD operations for password entries
- Encryption module with Argon2 key derivation
- All core features implemented and tested

---

[unreleased]: https://github.com/emilnordstroem/password-saver/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/emilnordstroem/password-saver/releases/tag/v1.0.0
