# Scripts

This directory contains utility scripts for Password Saver development and release management.

## generate_signing_key.cjs

A Node.js script to generate Ed25519 key pairs for signing Tauri application updates.

### Usage

**Cross-platform (works on Windows, macOS, and Linux):**

```bash
# From the project root
node scripts/generate_signing_key.cjs

# Or using the wrapper script on macOS/Linux
chmod +x scripts/generate_signing_key.sh
./scripts/generate_signing_key.sh
```

### What it does

1. Generates an Ed25519 private/public key pair using Node.js's built-in `crypto` module
2. Saves them as:
   - `scripts/password-saver.key` (private key - **KEEP THIS SECRET!**)
   - `scripts/password-saver.key.pub` (public key)
3. Displays:
   - The public key to add to `tauri.conf.json`
   - The base64-encoded private key for GitHub Secrets
   - Step-by-step instructions

### Requirements

- **Node.js** (already installed as part of the project dependencies)
- No OpenSSL or other external tools required

### Why .cjs extension?

The project's `package.json` has `"type": "module"`, which makes Node.js treat `.js` files as ES modules. 
The `.cjs` extension tells Node.js to treat this file as CommonJS, which is required for the `require()` syntax.

## Setting Up Signed Updates

### 1. Generate the signing keys

```bash
node scripts/generate_signing_key.cjs
```

### 2. Add the public key to tauri.conf.json

Edit `src-tauri/tauri.conf.json`:

```json
{
  "plugins": {
    "updater": {
      "endpoints": ["https://github.com/emilnordstroem/password-saver/releases"],
      "pubkey": "<PASTE_PUBLIC_KEY_HERE>"
    }
  }
}
```

### 3. Add GitHub Actions Secrets

Go to: https://github.com/emilnordstroem/password-saver/settings/secrets/actions

- **TAURI_PRIVATE_KEY** - Paste content of `scripts/password-saver.key`
- **TAURI_KEY_PASSWORD** (optional) - Password to encrypt the private key

### 4. Create a release

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Security Notes

**⚠️ CRITICAL: NEVER commit `password-saver.key` to version control!**

The `.gitignore` already excludes signing key files. Store the private key securely in GitHub Actions Secrets.

---

## GitHub Actions Workflow

The workflow (`.github/workflows/release.yml`) triggers on version tags and automatically:
- Builds for Windows, macOS, and Linux
- Signs updates using your private key from GitHub Secrets
- Creates a GitHub release with all artifacts
- Generates update metadata for the Tauri updater

---

## Release Checklist

See `.github/RELEASE_CHECKLIST.md` for a complete step-by-step guide.
