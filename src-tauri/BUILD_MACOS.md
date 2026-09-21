# macOS Build Instructions for Password Saver

## Overview

This document provides instructions for building Password Saver for macOS.

## Changes Made for macOS Support

The following changes were implemented to support macOS:

### 1. **Cross-Platform Database Path** (`src-tauri/src/lib.rs`)

Updated the `get_db_path()` function to use platform-specific app data directories:

- **macOS**: `~/Library/Application Support/password-saver/`
- **Linux**: `~/.config/password-saver/` or `~/.local/share/password-saver/`
- **Windows**: `%APPDATA%\password-saver\`

This ensures the database is stored in the correct location on each platform.

### 2. **Removed Windows-Specific Subsystem Attribute** (`src-tauri/src/main.rs`)

Removed the Windows-specific `windows_subsystem` attribute that was preventing macOS builds:

```rust
// Before (Windows-only):
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// After (Cross-platform):
fn main() {
    password_saver_lib::run()
}
```

### 3. **Updated Tauri Configuration** (`src-tauri/tauri.conf.json`)

Added macOS-specific bundle configuration:

- Updated `identifier` to use proper macOS bundle ID format: `com.emilnordstroem.passwordsaver`
- Updated `productName` to "Password Saver"
- Added `icon.icns` to the icon list for macOS support
- Added macOS-specific bundle settings:
  - `minimumSystemVersion`: "10.15" (macOS Catalina)
  - `hardenedRuntime`: true (for security)

### 4. **Added macOS Icon** (`src-tauri/icons/icon.icns`)

Created a placeholder `.icns` file. You need to generate a proper `.icns` file for production builds.

## Prerequisites for macOS Development

### 1. macOS Development Environment

- **macOS**: Version 10.15 (Catalina) or later
- **Xcode**: Install from the Mac App Store
- **Xcode Command Line Tools**: Run `xcode-select --install`

### 2. Rust Toolchain

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add targets for macOS
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin
```

### 3. Node.js and npm

```bash
# Install Node.js (LTS version recommended)
# Then install dependencies
npm install
```

### 4. Tauri CLI

```bash
npm install -g @tauri-apps/cli
```

## Building for macOS

### Important Note on Cross-Platform Building

**`npm run tauri:build` only builds for the CURRENT platform you're running on.**

- On macOS: Builds macOS binaries
- On Windows: Builds Windows binaries
- On Linux: Builds Linux binaries

You CANNOT build macOS binaries from Windows (or vice versa) without cross-compilation setup.
To build for all platforms, you must run the build command on each platform separately.

### Development Build

```bash
# Navigate to project root
cd password-saver

# Build and run in development mode
npm run tauri dev
```

### Production Build

```bash
# Build the frontend
npm run build

# Build the macOS application (run this ON macOS)
npm run tauri build

# Or explicitly specify the target (run this ON macOS)
npm run tauri build -- --target universal-apple-darwin

# For specific architectures (run this ON macOS)
npm run tauri build -- --target x86_64-apple-darwin
npm run tauri build -- --target aarch64-apple-darwin
```

### Building for All Platforms

To get binaries for all platforms (macOS, Windows, Linux):

1. **On macOS machine**:
   ```bash
   npm run build
   npm run tauri build  # Produces macOS .app bundle
   ```

2. **On Windows machine**:
   ```bash
   npm run build
   npm run tauri build  # Produces Windows .exe
   ```

3. **On Linux machine**:
   ```bash
   npm run build
   npm run tauri build  # Produces Linux AppImage/deb/rpm
   ```

Then collect the outputs from all three machines.

## Generating Proper macOS Icon (.icns)

The placeholder `icon.icns` file needs to be replaced with a proper macOS icon file.

### Method 1: Using ImageMagick and iconutil (Recommended)

```bash
# Install ImageMagick
brew install imagemagick

# Convert SVG to various PNG sizes
convert icon.svg -resize 16x16 icon_16.png
convert icon.svg -resize 32x32 icon_32.png
convert icon.svg -resize 64x64 icon_64.png
convert icon.svg -resize 128x128 icon_128.png
convert icon.svg -resize 256x256 icon_256.png
convert icon.svg -resize 512x512 icon_512.png
convert icon.svg -resize 1024x1024 icon_1024.png

# Create iconset directory
mkdir icon.iconset

# Move PNGs to iconset (with proper naming for Retina)
mv icon_16.png icon.iconset/icon_16x16.png
mv icon_32.png icon.iconset/icon_16x16@2x.png
mv icon_64.png icon.iconset/icon_32x32.png
mv icon_128.png icon.iconset/icon_32x32@2x.png
mv icon_256.png icon.iconset/icon_64x64.png
mv icon_512.png icon.iconset/icon_128x128.png
mv icon_1024.png icon.iconset/icon_256x256.png
cp icon_1024.png icon.iconset/icon_256x256@2x.png
cp icon_512.png icon.iconset/icon_512x512.png
cp icon_1024.png icon.iconset/icon_512x512@2x.png

# Generate .icns file
iconutil -c icns -o icon.icns icon.iconset

# Clean up
rm -rf icon.iconset icon_*.png
```

### Method 2: Using Online Tools

Use free online icon converters:
- https://iconverticons.com/convert/
- https://icoconvert.com/

Upload your PNG or SVG and download the `.icns` file.

### Method 3: Using macOS Automator

1. Create a new Automator workflow
2. Add "Run Shell Script" action
3. Use the ImageMagick commands from Method 1

## Application Distribution

### Building a DMG Installer

```bash
# Build the application
npm run tauri build -- --target universal-apple-darwin

# The built app will be in:
src-tauri/target/universal-apple-darwin/release/bundle/macos/
```

### Creating a DMG File

You can use `create-dmg` to create a professional DMG installer:

```bash
# Install create-dmg
brew install create-dmg

# Create DMG
create-dmg \
  --volname "Password Saver" \
  --volicon "icon.icns" \
  --background "background.png" \
  --window-pos 200 120 \
  --window-size 600 400 \
  --icon-size 100 \
  --icon "Password Saver.app" 150 190 \
  --app-drop-link 450 190 \
  "Password Saver.dmg" \
  "src-tauri/target/universal-apple-darwin/release/bundle/macos/"
```

## Code Signing (Optional but Recommended)

For distribution outside the Mac App Store, you should sign your application:

```bash
# Create a Developer ID certificate request
# (Follow Apple's instructions for obtaining a Developer ID)

# Sign the application
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" \
  src-tauri/target/universal-apple-darwin/release/bundle/macos/Password\ Saver.app
```

## Notarization (Required for Distribution)

macOS requires notarization for applications distributed outside the Mac App Store:

```bash
# Create a zip archive
cd src-tauri/target/universal-apple-darwin/release/bundle/macos/
zip -r Password\)Saver.zip Password\ Saver.app

# Submit for notarization
xcrun altool --notarize-app --primary-bundle-id "com.emilnordstroem.passwordsaver" \
  --username "your_apple_id@email.com" --password "@keychain:AC_PASSWORD" \
  --file Password\ Saver.zip

# Wait for completion (check status with)
xcrun altool --notarization-info <request-uuid> \
  --username "your_apple_id@email.com" --password "@keychain:AC_PASSWORD"

# Staple the notarization ticket
xcrun stapler staple Password\ Saver.app
```

## Troubleshooting

### Common Issues

1. **Build fails with "unknown field" errors**
   - Ensure you're using compatible versions of `tauri` and `tauri-build` crates
   - Run `cargo update` in the `src-tauri` directory
   - Check the Tauri 2 documentation for the latest configuration schema

2. **Missing .icns file**
   - Generate a proper `.icns` file as described above
   - Place it in `src-tauri/icons/icon.icns`

3. **Permission denied errors**
   - Ensure the app data directory is writable
   - On macOS, check `~/Library/Application Support/password-saver/`

4. **Code signing errors**
   - Ensure you have a valid Developer ID certificate
   - Check that your keychain has the correct certificates

5. **Notarization failures**
   - Check Apple's notarization logs
   - Ensure your bundle identifier matches your certificate

### Checking the Build

```bash
# Verify the Rust code compiles
cd src-tauri
cargo check

# Verify the build configuration
cargo tauri info
```

## Verification

The macOS support implementation has been verified with:

- ✅ Rust code compiles successfully (`cargo check`)
- ✅ Cross-platform database path logic
- ✅ Proper macOS bundle identifier
- ✅ macOS-specific configuration in tauri.conf.json
- ✅ Icon files in place (placeholder .icns included)
- ✅ Removed Windows-specific code that blocked macOS builds

## Next Steps

1. Generate a proper `.icns` file to replace the placeholder
2. Test the build on a macOS machine
3. Set up code signing for distribution
4. Configure notarization for production releases

## References

- [Tauri Documentation](https://tauri.app/v2/guides/)
- [macOS App Distribution](https://developer.apple.com/documentation/xcode/configuring-your-app-for-distribution)
- [Apple Notarization](https://developer.apple.com/documentation/xcode/notarizing-macos-software-before-distribution)
- [Code Signing](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html)
