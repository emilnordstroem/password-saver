//! Encryption module for Password Saver
//! Provides AES-256-GCM encryption with Argon2 key derivation
//!
//! This module handles:
//! - Key derivation from master password using Argon2
//! - AES-256-GCM encryption/decryption of sensitive data
//! - Secure memory management using secrecy and zeroize

use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit},
    Aes256Gcm, Nonce,
};
use argon2::{Algorithm, Argon2, Params, Version};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use rand::Rng;
use std::sync::{Arc, Mutex};
use thiserror::Error;
use zeroize::Zeroizing;

/// Length of the encryption key (AES-256 = 32 bytes)
const KEY_LENGTH: usize = 32;

/// Length of the salt for Argon2 (16 bytes recommended)
const SALT_LENGTH: usize = 16;

/// Encryption configuration stored in the database
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct EncryptionConfig {
    /// Base64-encoded salt for key derivation
    pub salt: String,
    /// Argon2 memory cost (in KiB)
    pub m_cost: u32,
    /// Argon2 iterations
    pub t_cost: u32,
    /// Argon2 parallelism
    pub p_cost: u32,
    /// Whether encryption has been initialized
    pub initialized: bool,
}

impl EncryptionConfig {
    pub fn new(salt: Vec<u8>, m_cost: u32, t_cost: u32, p_cost: u32) -> Self {
        Self {
            salt: BASE64.encode(salt),
            m_cost,
            t_cost,
            p_cost,
            initialized: true,
        }
    }

    pub fn default_uninitialized() -> Self {
        Self {
            salt: String::new(),
            m_cost: 0,
            t_cost: 0,
            p_cost: 0,
            initialized: false,
        }
    }
}

/// Custom error type for encryption operations
#[derive(Debug, Error)]
pub enum EncryptionError {
    #[error("Encryption not initialized. Please set a master password first.")]
    NotInitialized,
    #[error("Invalid master password")]
    InvalidPassword,
    #[error("Encryption failed: {0}")]
    EncryptionFailed(String),
    #[error("Decryption failed: {0}")]
    DecryptionFailed(String),
    #[error("Key derivation failed: {0}")]
    KeyDerivationFailed(String),
    #[error("Database error: {0}")]
    DatabaseError(#[from] rusqlite::Error),
}

/// Encrypted data container
/// Stores nonce + ciphertext as base64 for database storage
#[derive(Debug, Clone)]
pub struct EncryptedData {
    pub nonce: Vec<u8>,
    pub ciphertext: Vec<u8>,
}

impl EncryptedData {
    /// Create new encrypted data from nonce and ciphertext
    pub fn new(nonce: Vec<u8>, ciphertext: Vec<u8>) -> Self {
        Self { nonce, ciphertext }
    }

    /// Serialize to base64 string for storage (nonce:ciphertext)
    pub fn to_storage_string(&self) -> String {
        let nonce_b64 = BASE64.encode(&self.nonce);
        let ciphertext_b64 = BASE64.encode(&self.ciphertext);
        format!("{}:{}", nonce_b64, ciphertext_b64)
    }

    /// Deserialize from base64 storage string
    pub fn from_storage_string(s: &str) -> Result<Self, EncryptionError> {
        let parts: Vec<&str> = s.split(':').collect();
        if parts.len() != 2 {
            return Err(EncryptionError::DecryptionFailed(
                "Invalid encrypted data format".to_string(),
            ));
        }
        let nonce = BASE64
            .decode(parts[0])
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))?;
        let ciphertext = BASE64
            .decode(parts[1])
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))?;
        Ok(Self { nonce, ciphertext })
    }

    /// Check if the string is encrypted data (contains base64 with colon separator)
    pub fn is_encrypted_data(s: &str) -> bool {
        s.contains(':')
            && BASE64.decode(s.split(':').next().unwrap_or("")).is_ok()
            && BASE64.decode(s.split(':').nth(1).unwrap_or("")).is_ok()
    }
}

/// Shared encryption state
/// Holds the encryption key in memory (securely zeroized on drop)
pub struct EncryptionState {
    key: Option<Zeroizing<Vec<u8>>>,
    m_cost: u32,
    t_cost: u32,
    p_cost: u32,
}

impl EncryptionState {
    pub fn new() -> Self {
        // Default Argon2 parameters (secure defaults)
        let m_cost = 65536;  // memory cost in KiB (64 MB)
        let t_cost = 3;      // iterations
        let p_cost = 1;      // parallelism

        Self {
            key: None,
            m_cost,
            t_cost,
            p_cost,
        }
    }

    /// Initialize encryption with a new master password
    /// Generates a random salt, derives the key, and returns the config to store
    pub fn initialize(&mut self, master_password: &str) -> Result<EncryptionConfig, EncryptionError> {
        let mut rng = rand::thread_rng();
        let salt: Vec<u8> = (0..SALT_LENGTH).map(|_| rng.gen()).collect();

        // Derive key from master password
        let key = self.derive_key(master_password, &salt, self.m_cost, self.t_cost, self.p_cost)?;
        self.key = Some(key);

        // Return config to store in database
        Ok(EncryptionConfig::new(salt, self.m_cost, self.t_cost, self.p_cost))
    }

    /// Unlock with existing master password and stored config
    pub fn unlock(
        &mut self,
        master_password: &str,
        config: &EncryptionConfig,
    ) -> Result<(), EncryptionError> {
        let salt = BASE64
            .decode(&config.salt)
            .map_err(|e| EncryptionError::KeyDerivationFailed(e.to_string()))?;

        // Derive key with config's parameters
        let key = self.derive_key(
            master_password,
            &salt,
            config.m_cost,
            config.t_cost,
            config.p_cost,
        )?;
        self.key = Some(key);

        Ok(())
    }

    /// Lock the encryption (clear the key from memory)
    pub fn lock(&mut self) {
        self.key = None;
    }

    /// Check if encryption is unlocked
    pub fn is_unlocked(&self) -> bool {
        self.key.is_some()
    }

    /// Derive key with specific params
    fn derive_key(
        &self,
        master_password: &str,
        salt: &[u8],
        m_cost: u32,
        t_cost: u32,
        p_cost: u32,
    ) -> Result<Zeroizing<Vec<u8>>, EncryptionError> {
        let params = Params::new(m_cost, t_cost, p_cost, Some(KEY_LENGTH))
            .map_err(|e| EncryptionError::KeyDerivationFailed(e.to_string()))?;

        let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);

        let mut key = Zeroizing::new(vec![0u8; KEY_LENGTH]);
        argon2
            .hash_password_into(
                master_password.as_bytes(),
                salt,
                &mut key,
            )
            .map_err(|e| EncryptionError::KeyDerivationFailed(e.to_string()))?;

        Ok(key)
    }

    /// Encrypt plaintext data
    pub fn encrypt(&self, plaintext: &str) -> Result<EncryptedData, EncryptionError> {
        self.encrypt_bytes(plaintext.as_bytes())
    }

    /// Encrypt bytes
    pub fn encrypt_bytes(&self, plaintext: &[u8]) -> Result<EncryptedData, EncryptionError> {
        let key = self
            .key
            .as_ref()
            .ok_or(EncryptionError::NotInitialized)?;

        let cipher = Aes256Gcm::new_from_slice(&key)
            .map_err(|e| EncryptionError::EncryptionFailed(e.to_string()))?;

        let nonce = Aes256Gcm::generate_nonce(&mut rand::thread_rng());

        let ciphertext = cipher
            .encrypt(&nonce, plaintext)
            .map_err(|e| EncryptionError::EncryptionFailed(e.to_string()))?;

        Ok(EncryptedData::new(nonce.to_vec(), ciphertext))
    }

    /// Decrypt encrypted data to string
    pub fn decrypt(&self, encrypted: &EncryptedData) -> Result<String, EncryptionError> {
        let bytes = self.decrypt_bytes(encrypted)?;
        String::from_utf8(bytes)
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))
    }

    /// Decrypt encrypted data to bytes
    pub fn decrypt_bytes(&self, encrypted: &EncryptedData) -> Result<Vec<u8>, EncryptionError> {
        let key = self
            .key
            .as_ref()
            .ok_or(EncryptionError::NotInitialized)?;

        let cipher = Aes256Gcm::new_from_slice(&key)
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))?;

        let nonce = Nonce::from_slice(&encrypted.nonce);

        cipher
            .decrypt(nonce, encrypted.ciphertext.as_ref())
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))
    }

    /// Encrypt a field for storage (returns base64 string)
    pub fn encrypt_field(&self, value: &Option<String>) -> Result<Option<String>, EncryptionError> {
        match value {
            Some(v) if !v.is_empty() => {
                let encrypted = self.encrypt(v)?;
                Ok(Some(encrypted.to_storage_string()))
            }
            _ => Ok(None),
        }
    }

    /// Decrypt a field from storage
    pub fn decrypt_field(&self, encrypted: &Option<String>) -> Result<Option<String>, EncryptionError> {
        match encrypted {
            Some(v) if !v.is_empty() && EncryptedData::is_encrypted_data(v) => {
                let encrypted_data = EncryptedData::from_storage_string(v)?;
                let decrypted = self.decrypt(&encrypted_data)?;
                Ok(Some(decrypted))
            }
            Some(_) => {
                // Legacy plaintext data - return as-is
                Ok(encrypted.clone())
            }
            None => Ok(None),
        }
    }
}

impl Default for EncryptionState {
    fn default() -> Self {
        Self::new()
    }
}

/// Thread-safe encryption state wrapper
#[derive(Clone)]
pub struct SharedEncryptionState(pub Arc<Mutex<EncryptionState>>);

impl SharedEncryptionState {
    pub fn new() -> Self {
        Self(Arc::new(Mutex::new(EncryptionState::new())))
    }

    /// Initialize encryption with a master password
    pub fn initialize(&self, master_password: &str) -> Result<EncryptionConfig, EncryptionError> {
        let mut state = self.0.lock().map_err(|_| {
            EncryptionError::EncryptionFailed("Failed to lock encryption state".to_string())
        })?;
        state.initialize(master_password)
    }

    /// Unlock with master password and config
    pub fn unlock(
        &self,
        master_password: &str,
        config: &EncryptionConfig,
    ) -> Result<(), EncryptionError> {
        let mut state = self.0.lock().map_err(|_| {
            EncryptionError::EncryptionFailed("Failed to lock encryption state".to_string())
        })?;
        state.unlock(master_password, config)
    }

    /// Lock the encryption
    pub fn lock(&self) -> Result<(), EncryptionError> {
        let mut state = self.0.lock().map_err(|_| {
            EncryptionError::EncryptionFailed("Failed to lock encryption state".to_string())
        })?;
        state.lock();
        Ok(())
    }

    /// Check if unlocked
    pub fn is_unlocked(&self) -> bool {
        self.0.lock().map_or(false, |s| s.is_unlocked())
    }

    /// Encrypt a field
    pub fn encrypt_field(
        &self,
        value: &Option<String>,
    ) -> Result<Option<String>, EncryptionError> {
        let state = self.0.lock().map_err(|_| {
            EncryptionError::EncryptionFailed("Failed to lock encryption state".to_string())
        })?;
        state.encrypt_field(value)
    }

    /// Decrypt a field
    pub fn decrypt_field(
        &self,
        encrypted: &Option<String>,
    ) -> Result<Option<String>, EncryptionError> {
        let state = self.0.lock().map_err(|_| {
            EncryptionError::EncryptionFailed("Failed to lock encryption state".to_string())
        })?;
        state.decrypt_field(encrypted)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encryption_roundtrip() {
        let mut state = EncryptionState::new();

        // Initialize with a password
        let config = state.initialize("test-master-password").unwrap();
        assert!(config.initialized);
        assert!(state.is_unlocked());

        // Encrypt and decrypt
        let plaintext = "my-secret-password";
        let encrypted = state.encrypt(plaintext).unwrap();
        let decrypted = state.decrypt(&encrypted).unwrap();

        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_field_encryption() {
        let mut state = EncryptionState::new();
        state.initialize("test-password").unwrap();

        // Test encrypting and decrypting a field
        let original = Some("test-username".to_string());
        let encrypted = state.encrypt_field(&original).unwrap();
        let decrypted = state.decrypt_field(&encrypted).unwrap();

        assert_eq!(decrypted, original);

        // Test with None
        let none_encrypted = state.encrypt_field(&None).unwrap();
        let none_decrypted = state.decrypt_field(&none_encrypted).unwrap();
        assert_eq!(none_decrypted, None);
    }

    #[test]
    fn test_unlock_with_config() {
        let mut state = EncryptionState::new();

        // Initialize and get config
        let config = state.initialize("my-password").unwrap();
        state.lock();
        assert!(!state.is_unlocked());

        // Unlock with same password
        state.unlock("my-password", &config).unwrap();
        assert!(state.is_unlocked());
    }

    #[test]
    fn test_wrong_password_produces_different_key() {
        let mut state = EncryptionState::new();

        // Initialize with correct password
        let config = state.initialize("correct-password").unwrap();
        
        // Encrypt some data
        let plaintext = "secret-data";
        let encrypted = state.encrypt(plaintext).unwrap();
        
        // Lock and unlock with correct password
        state.lock();
        state.unlock("correct-password", &config).unwrap();
        assert!(state.is_unlocked());
        
        // Can decrypt with correct password
        let decrypted = state.decrypt(&encrypted).unwrap();
        assert_eq!(decrypted, plaintext);
        
        // Lock and try to unlock with wrong password
        state.lock();
        state.unlock("wrong-password", &config).unwrap();
        assert!(state.is_unlocked()); // Unlock succeeds but with wrong key
        
        // Cannot decrypt with wrong password (different key)
        let result = state.decrypt(&encrypted);
        assert!(result.is_err()); // Decryption fails because key is wrong
        
        // Lock again
        state.lock();
        assert!(!state.is_unlocked());
    }

    #[test]
    fn test_encrypted_data_serialization() {
        let encrypted = EncryptedData::new(
            vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            vec![100, 101, 102],
        );

        let serialized = encrypted.to_storage_string();
        let deserialized = EncryptedData::from_storage_string(&serialized).unwrap();

        assert_eq!(deserialized.nonce, encrypted.nonce);
        assert_eq!(deserialized.ciphertext, encrypted.ciphertext);
    }

    #[test]
    fn test_not_initialized_error() {
        let state = EncryptionState::new();
        assert!(!state.is_unlocked());

        let result = state.encrypt("test");
        assert!(matches!(result, Err(EncryptionError::NotInitialized)));
    }
}
