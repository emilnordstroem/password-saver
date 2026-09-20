// Database module for password CRUD operations
pub mod db;
// Encryption module
pub mod encryption;

use db::{PasswordEntry, create_password, get_password, list_passwords, update_password, delete_password, search_passwords, open_connection, encrypt_entry, decrypt_entry};
use encryption::{EncryptionConfig, SharedEncryptionState};
use std::path::PathBuf;

/// Get the database connection path using Tauri's path API
fn get_db_path() -> Result<PathBuf, String> {
    // In Tauri 2, we can use tauri::api::path
    let app_data_dir = std::env::var("APPDATA").or_else(|_| std::env::var("HOME"))
        .map(|p| PathBuf::from(p).join("password-saver"))
        .unwrap_or_else(|_| PathBuf::from(".password-saver"));
    
    let db_path = app_data_dir.join("passwords.db");
    
    // Create parent directory if it doesn't exist
    std::fs::create_dir_all(&app_data_dir).map_err(|e| e.to_string())?;
    
    Ok(db_path)
}

/// Create a new password entry
#[tauri::command]
fn add_password(
    state: tauri::State<'_, SharedEncryptionState>,
    entry: PasswordEntry,
) -> Result<PasswordEntry, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    
    // Encrypt the entry before saving
    let encrypted_entry = if state.is_unlocked() {
        encrypt_entry(&entry, &state).map_err(|e| format!("Encryption error: {}", e))?
    } else {
        // If not unlocked, save plaintext (for legacy support)
        entry
    };
    
    create_password(&conn, &encrypted_entry).map_err(|e| e.to_string())
}

/// Get a single password by ID
#[tauri::command]
fn get_password_command(
    state: tauri::State<'_, SharedEncryptionState>,
    id: i64,
) -> Result<Option<PasswordEntry>, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    let entry = get_password(&conn, id).map_err(|e| e.to_string())?;
    
    match entry {
        Some(e) => {
            if state.is_unlocked() {
                Ok(Some(decrypt_entry(&e, &state).map_err(|e| format!("Decryption error: {}", e))?))
            } else {
                // Return encrypted/plaintext entry if not unlocked
                Ok(Some(e))
            }
        }
        None => Ok(None),
    }
}

/// List all passwords
#[tauri::command]
fn list_passwords_command(
    state: tauri::State<'_, SharedEncryptionState>,
) -> Result<Vec<PasswordEntry>, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    let entries = list_passwords(&conn).map_err(|e| e.to_string())?;
    
    if state.is_unlocked() {
        let decrypted: Result<Vec<PasswordEntry>, String> = entries
            .iter()
            .map(|e| decrypt_entry(e, &state).map_err(|e| format!("Decryption error: {}", e)))
            .collect();
        decrypted
    } else {
        // Return encrypted/plaintext entries if not unlocked
        Ok(entries)
    }
}

/// Update a password entry
#[tauri::command]
fn update_password_command(
    state: tauri::State<'_, SharedEncryptionState>,
    id: i64,
    entry: PasswordEntry,
) -> Result<PasswordEntry, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    
    // Encrypt the entry before updating
    let encrypted_entry = if state.is_unlocked() {
        encrypt_entry(&entry, &state).map_err(|e| format!("Encryption error: {}", e))?
    } else {
        // If not unlocked, update with plaintext (for legacy support)
        entry
    };
    
    update_password(&conn, id, &encrypted_entry).map_err(|e| e.to_string())
}

/// Delete a password entry
#[tauri::command]
fn delete_password_command(id: i64) -> Result<bool, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    delete_password(&conn, id).map_err(|e| e.to_string())
}

/// Search passwords by query
#[tauri::command]
fn search_passwords_command(
    state: tauri::State<'_, SharedEncryptionState>,
    query: String,
) -> Result<Vec<PasswordEntry>, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    let entries = search_passwords(&conn, &query).map_err(|e| e.to_string())?;
    
    if state.is_unlocked() {
        let decrypted: Result<Vec<PasswordEntry>, String> = entries
            .iter()
            .map(|e| decrypt_entry(e, &state).map_err(|e| format!("Decryption error: {}", e)))
            .collect();
        decrypted
    } else {
        // Return encrypted/plaintext entries if not unlocked
        Ok(entries)
    }
}

// Type for encrypted password entry (for frontend)
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct EncryptedPasswordEntry {
    pub id: i64,
    pub title: String,
    pub username: Option<String>,
    pub password: Option<String>,
    pub url: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub is_encrypted: bool,
}

// Helper to create app state
fn create_app_state() -> SharedEncryptionState {
    SharedEncryptionState::new()
}

/// Initialize encryption with a master password
/// Returns the encryption config to be saved
#[tauri::command]
fn init_encryption(
    state: tauri::State<'_, SharedEncryptionState>,
    master_password: String,
) -> Result<EncryptionConfig, String> {
    // Clear any existing key first
    state.lock().map_err(|e| e.to_string())?;
    
    state
        .initialize(&master_password)
        .map_err(|e| format!("Failed to initialize encryption: {}", e))
}

/// Unlock the database with master password
#[tauri::command]
fn unlock_database(
    state: tauri::State<'_, SharedEncryptionState>,
    master_password: String,
    config: EncryptionConfig,
) -> Result<bool, String> {
    state
        .unlock(&master_password, &config)
        .map_err(|e| format!("Failed to unlock: {}", e))?;
    Ok(true)
}

/// Lock the database (clear encryption key from memory)
#[tauri::command]
fn lock_database(state: tauri::State<'_, SharedEncryptionState>) -> Result<bool, String> {
    state.lock().map_err(|e| e.to_string())?;
    Ok(true)
}

/// Check if the database is unlocked
#[tauri::command]
fn is_unlocked(state: tauri::State<'_, SharedEncryptionState>) -> Result<bool, String> {
    Ok(state.is_unlocked())
}

/// Load encryption config from database
#[tauri::command]
fn load_encryption_config() -> Result<Option<EncryptionConfig>, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    db::load_encryption_config(&conn).map_err(|e| e.to_string())
}

/// Check if encryption is initialized
#[tauri::command]
fn is_encryption_initialized() -> Result<bool, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    db::is_encryption_initialized(&conn).map_err(|e| e.to_string())
}

/// Save encryption config to database
#[tauri::command]
fn save_encryption_config(config: EncryptionConfig) -> Result<bool, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    db::save_encryption_config(&conn, &config).map_err(|e| e.to_string())?;
    Ok(true)
}

// Empty Tauri application
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(create_app_state())
        .invoke_handler(tauri::generate_handler![
            add_password,
            get_password_command,
            list_passwords_command,
            update_password_command,
            delete_password_command,
            search_passwords_command,
            init_encryption,
            unlock_database,
            lock_database,
            is_unlocked,
            load_encryption_config,
            is_encryption_initialized,
            save_encryption_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
