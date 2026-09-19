// Database module for password CRUD operations
pub mod db;

use db::{PasswordEntry, create_password, get_password, list_passwords, update_password, delete_password, search_passwords, open_connection};
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
fn add_password(entry: PasswordEntry) -> Result<PasswordEntry, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    create_password(&conn, &entry).map_err(|e| e.to_string())
}

/// Get a single password by ID
#[tauri::command]
fn get_password_command(id: i64) -> Result<Option<PasswordEntry>, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    get_password(&conn, id).map_err(|e| e.to_string())
}

/// List all passwords
#[tauri::command]
fn list_passwords_command() -> Result<Vec<PasswordEntry>, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    list_passwords(&conn).map_err(|e| e.to_string())
}

/// Update a password entry
#[tauri::command]
fn update_password_command(id: i64, entry: PasswordEntry) -> Result<PasswordEntry, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    update_password(&conn, id, &entry).map_err(|e| e.to_string())
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
fn search_passwords_command(query: String) -> Result<Vec<PasswordEntry>, String> {
    let db_path = get_db_path()?;
    let conn = open_connection(&db_path).map_err(|e| e.to_string())?;
    search_passwords(&conn, &query).map_err(|e| e.to_string())
}

// Empty Tauri application
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_password,
            get_password_command,
            list_passwords_command,
            update_password_command,
            delete_password_command,
            search_passwords_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
