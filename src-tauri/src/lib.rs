use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};
use tauri::Manager;
use chrono::{DateTime, Utc, FixedOffset};

mod db;

// Use Arc<Mutex<...>> to share the database connection across commands
struct AppState {
    db: Arc<Mutex<db::DbConnection>>,
}

#[derive(Serialize, Deserialize)]
pub struct PasswordEntry {
    pub id: Option<i64>,
    pub title: String,
    pub username: Option<String>,
    pub password: String,
    pub url: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<&db::PasswordEntry> for PasswordEntry {
    fn from(entry: &db::PasswordEntry) -> Self {
        Self {
            id: entry.id,
            title: entry.title.clone(),
            username: entry.username.clone(),
            password: entry.password.clone(),
            url: entry.url.clone(),
            notes: entry.notes.clone(),
            created_at: entry.created_at.to_rfc3339(),
            updated_at: entry.updated_at.to_rfc3339(),
        }
    }
}

impl From<db::PasswordEntry> for PasswordEntry {
    fn from(entry: db::PasswordEntry) -> Self {
        Self {
            id: entry.id,
            title: entry.title,
            username: entry.username,
            password: entry.password,
            url: entry.url,
            notes: entry.notes,
            created_at: entry.created_at.to_rfc3339(),
            updated_at: entry.updated_at.to_rfc3339(),
        }
    }
}

impl From<PasswordEntry> for db::PasswordEntry {
    fn from(entry: PasswordEntry) -> Self {
        let parse_dt = |s: &str| -> DateTime<Utc> {
            DateTime::parse_from_rfc3339(s)
                .map(|dt: DateTime<FixedOffset>| dt.with_timezone(&Utc))
                .unwrap_or(Utc::now())
        };
        Self {
            id: entry.id,
            title: entry.title,
            username: entry.username,
            password: entry.password,
            url: entry.url,
            notes: entry.notes,
            created_at: parse_dt(&entry.created_at),
            updated_at: parse_dt(&entry.updated_at),
        }
    }
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn add_password(state: tauri::State<'_, AppState>, entry: PasswordEntry) -> Result<PasswordEntry, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let db_entry: db::PasswordEntry = entry.into();
    let created = db.create_password(&db_entry).map_err(|e| e.to_string())?;
    Ok(created.into())
}

#[tauri::command]
fn get_password(state: tauri::State<'_, AppState>, id: i64) -> Result<Option<PasswordEntry>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let entry = db.get_password(id).map_err(|e| e.to_string())?;
    Ok(entry.map(|e| e.into()))
}

#[tauri::command]
fn list_passwords(state: tauri::State<'_, AppState>) -> Result<Vec<PasswordEntry>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let entries = db.get_all_passwords().map_err(|e| e.to_string())?;
    Ok(entries.into_iter().map(|e| e.into()).collect())
}

#[tauri::command]
fn update_password(state: tauri::State<'_, AppState>, id: i64, entry: PasswordEntry) -> Result<PasswordEntry, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let db_entry: db::PasswordEntry = entry.into();
    let updated = db.update_password(id, &db_entry).map_err(|e| e.to_string())?;
    Ok(updated.into())
}

#[tauri::command]
fn delete_password(state: tauri::State<'_, AppState>, id: i64) -> Result<bool, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let deleted = db.delete_password(id).map_err(|e| e.to_string())?;
    Ok(deleted)
}

#[tauri::command]
fn search_passwords(state: tauri::State<'_, AppState>, query: &str) -> Result<Vec<PasswordEntry>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let entries = db.search_passwords(query).map_err(|e| e.to_string())?;
    Ok(entries.into_iter().map(|e| e.into()).collect())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get the app data directory
            let app_data_dir = app.path().app_data_dir()?;
            
            // Create the directory if it doesn't exist
            std::fs::create_dir_all(&app_data_dir)?;
            
            // Initialize database connection
            let db_path = app_data_dir.join("passwords.db");
            let db = db::DbConnection::new(db_path.to_str().unwrap())?;
            
            // Wrap in Arc<Mutex> for thread-safe sharing
            let app_state = AppState {
                db: Arc::new(Mutex::new(db)),
            };
            
            // Manage the state
            app.manage(app_state);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            add_password,
            get_password,
            list_passwords,
            update_password,
            delete_password,
            search_passwords
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
