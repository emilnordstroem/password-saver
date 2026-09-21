/**
 * Script to generate a Tauri signing key for secure updates
 * Uses Node.js crypto module (built-in, no OpenSSL required)
 * 
 * Usage:
 *   node scripts/generate_signing_key.cjs
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('Generating Tauri signing key...');
console.log('This will create a private/public key pair for signing updates.\n');

const PRIVATE_KEY_FILE = 'password-saver.key';
const PUBLIC_KEY_FILE = 'password-saver.key.pub';

try {
    // Generate Ed25519 key pair
    console.log('Generating Ed25519 key pair...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');

    // Export in PEM format
    const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
    const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' });

    // Save to files in the scripts directory
    const scriptsDir = path.dirname(__filename);
    const privateKeyPath = path.join(scriptsDir, PRIVATE_KEY_FILE);
    const publicKeyPath = path.join(scriptsDir, PUBLIC_KEY_FILE);
    
    fs.writeFileSync(privateKeyPath, privateKeyPem);
    fs.writeFileSync(publicKeyPath, publicKeyPem);

    console.log('\n✓ Keys generated successfully!\n');
    console.log(`Private key: ${privateKeyPath}`);
    console.log(`Public key:  ${publicKeyPath}\n`);
    
    console.log('--------------------------------------------------');
    console.log('IMPORTANT: Keep the private key SECRET!');
    console.log('--------------------------------------------------\n');
    
    // Read and display public key
    const publicKeyContent = fs.readFileSync(publicKeyPath, 'utf8');
    console.log('Public key content (to add to tauri.conf.json):\n');
    console.log(publicKeyContent);
    
    console.log('\n--------------------------------------------------\n');
    console.log('To use these keys:\n');
    console.log('1. Add the public key to tauri.conf.json:');
    console.log('   "plugins": {');
    console.log('     "updater": {');
    console.log('       "endpoints": ["https://github.com/emilnordstroem/password-saver/releases"],');
    console.log(`       "pubkey": "${publicKeyContent.trim().replace(/\n/g, '\\n')}"`);
    console.log('     }');
    console.log('   }\n');
    
    console.log('2. Add the private key as a GitHub Actions secret:');
    console.log('   - Go to: https://github.com/emilnordstroem/password-saver/settings/secrets/actions');
    console.log(`   - Add secret: TAURI_PRIVATE_KEY`);
    console.log(`   - Paste the content of ${privateKeyPath}\n`);
    
    console.log('3. (Optional) Add a key password:');
    console.log('   - Add secret: TAURI_KEY_PASSWORD');
    console.log('   - This is the password used to encrypt the private key\n');
    
    console.log('4. Commit ONLY the tauri.conf.json with the public key');
    console.log('   DO NOT commit the private key files!\n');
    
    // Show base64 encoded private key for easy copying
    const privateKeyBytes = fs.readFileSync(privateKeyPath);
    const privateKeyBase64 = privateKeyBytes.toString('base64');
    console.log('Base64 encoded private key (for GitHub Secrets):\n');
    console.log(privateKeyBase64);
    
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
