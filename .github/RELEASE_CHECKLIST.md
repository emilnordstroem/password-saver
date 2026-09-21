# Release Checklist

Use this checklist when preparing a new release of Password Saver.

## Pre-Release

- [ ] All tests pass (`cargo test` for Rust, `npm test` for TypeScript if configured)
- [ ] Application builds successfully (`npm run tauri build`)
- [ ] All critical bugs are fixed
- [ ] All planned features are implemented
- [ ] Documentation is updated (README.md, etc.)
- [ ] Changelog is updated (CHANGELOG.md)

## Version Updates

- [ ] Update version in `src-tauri/tauri.conf.json`
- [ ] Update version in `package.json`
- [ ] Update version in `src-tauri/Cargo.toml`
- [ ] Update CHANGELOG.md with new version and date

## GitHub Release

- [ ] Create a new tag: `git tag vX.Y.Z`
- [ ] Push the tag: `git push origin vX.Y.Z`
- [ ] GitHub Actions workflow will automatically build and release

## Post-Release

- [ ] Verify release artifacts are available on GitHub Releases
- [ ] Verify the updater can detect the new version
- [ ] Announce the release (if applicable)
- [ ] Update any external documentation or websites

## For First Release (v1.0.0)

- [ ] Set up GitHub Actions secrets:
  - `TAURI_PRIVATE_KEY` (from `password-saver.key`)
  - `TAURI_KEY_PASSWORD` (optional, for key encryption)
- [ ] Add public key to `tauri.conf.json` updater configuration
- [ ] Test the complete release workflow

## Signing Keys (Optional but Recommended)

If you want signed updates for security:

1. Generate keys: `./scripts/generate_signing_key.sh` or `./scripts/generate_signing_key.ps1`
2. Add public key to `tauri.conf.json`
3. Add private key as GitHub Actions secret
4. DO NOT commit private key files

## Testing Updates

To test the updater functionality:

1. Build the current version
2. Create a new release with a higher version number
3. Run the built application
4. Check for updates (should detect the new version)
5. Download and install the update
6. Verify the application updates correctly

## Notes

- The GitHub Actions workflow triggers on tags matching `v*` pattern
- All platforms (Windows, macOS, Linux) are built automatically
- Update metadata is generated for the Tauri updater plugin
- The workflow uses the `tauri-action` for building and signing
