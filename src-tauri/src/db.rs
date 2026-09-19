//! Database operations for password/credential management
//! Uses SQLite via rusqlite with parameterized queries for security

use chrono::Utc;
use rusqlite::{Connection, Result, params, Row};
use serde::{Serialize, Deserialize};
use std::path::Path;

/// Represents a password/credential entry in the database
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PasswordEntry {
    pub id: i64,
    pub title: String,
    pub username: Option<String>,
    pub password: Option<String>,
    pub url: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl PasswordEntry {
    /// Create a new PasswordEntry with current timestamps
    pub fn new(
        title: String,
        username: Option<String>,
        password: Option<String>,
        url: Option<String>,
        notes: Option<String>,
    ) -> Self {
        let now = Utc::now().to_rfc3339();
        Self {
            id: 0, // Will be set by database on insert
            title,
            username,
            password,
            url,
            notes,
            created_at: now.clone(),
            updated_at: now,
        }
    }

    /// Convert from a SQLite row to a PasswordEntry
    fn from_row(row: &Row) -> Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            title: row.get(1)?,
            username: row.get(2)?,
            password: row.get(3)?,
            url: row.get(4)?,
            notes: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    }
}

/// Initialize the database schema
/// Creates the passwords table if it doesn't exist
pub fn initialize_database(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            username TEXT,
            password TEXT,
            url TEXT,
            notes TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_passwords_title ON passwords (title);",
    )?;
    Ok(())
}

/// Open or create a database connection at the specified path
pub fn open_connection(db_path: &Path) -> Result<Connection> {
    let conn = Connection::open(db_path)?;
    initialize_database(&conn)?;
    Ok(conn)
}

/// Create a new password entry
pub fn create_password(conn: &Connection, entry: &PasswordEntry) -> Result<PasswordEntry> {
    let mut stmt = conn.prepare(
        "INSERT INTO passwords (title, username, password, url, notes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
    )?;
    
    let id = stmt.insert(params![
        &entry.title,
        &entry.username,
        &entry.password,
        &entry.url,
        &entry.notes,
        &entry.created_at,
        &entry.updated_at,
    ])?;

    Ok(PasswordEntry {
        id,
        title: entry.title.clone(),
        username: entry.username.clone(),
        password: entry.password.clone(),
        url: entry.url.clone(),
        notes: entry.notes.clone(),
        created_at: entry.created_at.clone(),
        updated_at: entry.updated_at.clone(),
    })
}

/// Retrieve a password entry by ID
pub fn get_password(conn: &Connection, id: i64) -> Result<Option<PasswordEntry>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, username, password, url, notes, created_at, updated_at 
         FROM passwords WHERE id = ?1",
    )?;

    let mut rows = stmt.query(params![id])?;
    
    if let Some(row) = rows.next()? {
        Ok(Some(PasswordEntry::from_row(row)?))
    } else {
        Ok(None)
    }
}

/// Retrieve all password entries
pub fn list_passwords(conn: &Connection) -> Result<Vec<PasswordEntry>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, username, password, url, notes, created_at, updated_at 
         FROM passwords ORDER BY title ASC ",
    )?;

    let mut rows = stmt.query(params![])?;
    let mut entries = Vec::new();

    while let Some(row) = rows.next()? {
        entries.push(PasswordEntry::from_row(row)?);
    }

    Ok(entries)
}

/// Update an existing password entry
pub fn update_password(conn: &Connection, id: i64, entry: &PasswordEntry) -> Result<PasswordEntry> {
    let mut stmt = conn.prepare(
        "UPDATE passwords SET title = ?1, username = ?2, password = ?3, url = ?4, notes = ?5, updated_at = ?6 
         WHERE id = ?7",
    )?;

    stmt.execute(params![
        &entry.title,
        &entry.username,
        &entry.password,
        &entry.url,
        &entry.notes,
        &entry.updated_at,
        id,
    ])?;

    // Return the updated entry by fetching it fresh
    get_password(conn, id).map(|opt| opt.expect("Entry should exist after update "))
}

/// Delete a password entry by ID
pub fn delete_password(conn: &Connection, id: i64) -> Result<bool> {
    let mut stmt = conn.prepare("DELETE FROM passwords WHERE id = ?1")?;
    let rows_affected = stmt.execute(params![id])?;
    Ok(rows_affected > 0)
}

/// Search password entries by query
/// Searches across title, username, and url fields (case-insensitive)
pub fn search_passwords(conn: &Connection, query: &str) -> Result<Vec<PasswordEntry>> {
    let search_pattern = ["%", query, "%"].concat();
    
    let mut stmt = conn.prepare(
        "SELECT id, title, username, password, url, notes, created_at, updated_at 
         FROM passwords 
         WHERE LOWER(title) LIKE LOWER(?1) 
            OR LOWER(username) LIKE LOWER(?1) 
            OR LOWER(url) LIKE LOWER(?1)
         ORDER BY title ASC ",
    )?;

    let mut rows = stmt.query(params![search_pattern])?;
    let mut entries = Vec::new();

    while let Some(row) = rows.next()? {
        entries.push(PasswordEntry::from_row(row)?);
    }

    Ok(entries)
}

/// Check if the database is empty
pub fn is_database_empty(conn: &Connection) -> Result<bool> {
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM passwords ")?;
    let mut rows = stmt.query(params![])?;
    
    if let Some(row) = rows.next()? {
        let count: i64 = row.get(0)?;
        Ok(count == 0)
    } else {
        Ok(true)
    }
}

/// Get the total count of password entries
pub fn count_passwords(conn: &Connection) -> Result<i64> {
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM passwords ")?;
    let mut rows = stmt.query(params![])?;
    
    if let Some(row) = rows.next()? {
        Ok(row.get(0)?)
    } else {
        Ok(0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;

    fn create_test_db() -> (Connection, NamedTempFile) {
        let temp_file = NamedTempFile::new().unwrap();
        let conn = Connection::open(temp_file.path()).unwrap();
        initialize_database(&conn).unwrap();
        (conn, temp_file)
    }

    #[test]
    fn test_create_and_get_password() {
        let (conn, _) = create_test_db();
        
        let entry = PasswordEntry::new(
            "Test Entry".to_string(),
            Some("testuser".to_string()),
            Some("testpass".to_string()),
            Some("https://test.com".to_string()),
            Some("Test notes".to_string()),
        );
        
        let created = create_password(&conn, &entry).unwrap();
        assert_ne!(created.id, 0);
        
        let retrieved = get_password(&conn, created.id).unwrap();
        assert!(retrieved.is_some());
        
        let retrieved = retrieved.unwrap();
        assert_eq!(retrieved.title, "Test Entry");
        assert_eq!(retrieved.username, Some("testuser".to_string()));
    }

    #[test]
    fn test_list_passwords() {
        let (conn, _) = create_test_db();
        
        let entry1 = PasswordEntry::new("Entry A".to_string(), None, None, None, None);
        let entry2 = PasswordEntry::new("Entry B".to_string(), None, None, None, None);
        
        create_password(&conn, &entry1).unwrap();
        create_password(&conn, &entry2).unwrap();
        
        let entries = list_passwords(&conn).unwrap();
        assert_eq!(entries.len(), 2);
    }

    #[test]
    fn test_update_password() {
        let (conn, _) = create_test_db();
        
        let entry = PasswordEntry::new("Original".to_string(), None, None, None, None);
        let created = create_password(&conn, &entry).unwrap();
        
        let mut updated_entry = created.clone();
        updated_entry.title = "Updated".to_string();
        updated_entry.updated_at = Utc::now().to_rfc3339();
        
        let updated = update_password(&conn, created.id, &updated_entry).unwrap();
        assert_eq!(updated.title, "Updated");
    }

    #[test]
    fn test_delete_password() {
        let (conn, _) = create_test_db();
        
        let entry = PasswordEntry::new("To Delete".to_string(), None, None, None, None);
        let created = create_password(&conn, &entry).unwrap();
        
        let deleted = delete_password(&conn, created.id).unwrap();
        assert!(deleted);
        
        let retrieved = get_password(&conn, created.id).unwrap();
        assert!(retrieved.is_none());
    }

    #[test]
    fn test_search_passwords() {
        let (conn, _) = create_test_db();
        
        let entry1 = PasswordEntry::new("GitHub".to_string(), Some("user1".to_string()), None, Some("github.com".to_string()), None);
        let entry2 = PasswordEntry::new("Email".to_string(), Some("user@example.com".to_string()), None, None, None);
        let entry3 = PasswordEntry::new("Bank".to_string(), None, None, None, None);
        
        create_password(&conn, &entry1).unwrap();
        create_password(&conn, &entry2).unwrap();
        create_password(&conn, &entry3).unwrap();
        
        let results = search_passwords(&conn, "git").unwrap();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].title, "GitHub");
        
        let results = search_passwords(&conn, "user").unwrap();
        assert_eq!(results.len(), 2);
    }
}
