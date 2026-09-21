#!/bin/bash
# Script to generate a Tauri signing key for secure updates
# Uses Node.js crypto module (built-in, no OpenSSL required)
#
# Usage:
#   ./scripts/generate_signing_key.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install it first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "Generating Tauri signing key..."
echo "This will create a private/public key pair for signing updates."
echo ""

# Run the Node.js script
node "$SCRIPT_DIR/generate_signing_key.cjs"
