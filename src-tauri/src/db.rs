use rusqlite::{Connection, Result, params, OptionalExtension};
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc, FixedOffset};

const SCHEMA: &str = r#"
    CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        url TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_passwords_title ON passwords(title);
"#;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PasswordEntry {
    pub id: Option<i64>,
    pub title: String,
    pub username: Option<String>,
    pub password: String,
    pub url: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl PasswordEntry {
    pub fn new(
        title: String,
        username: Option<String>,
        password: String,
        url: Option<String>,
        notes: Option<String>,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: None,
            title,
            username,
            password,
            url,
            notes,
            created_at: now,
            updated_at: now,
        }
    }
}

impl From<(i64, String, Option<String>, String, Option<String>, Option<String>, String, String)> for PasswordEntry {
    fn from(
        (id, title, username, password, url, notes, created_at, updated_at): 
        (i64, String, Option<String>, String, Option<String>, Option<String>, String, String)
    ) -> Self {
        let parse_dt = |s: &str| -> DateTime<Utc> {
            DateTime::parse_from_rfc3339(s)
                .map(|dt: DateTime<FixedOffset>| dt.with_timezone(&Utc))
                .unwrap_or(Utc::now())
        };
        Self {
            id: Some(id),
            title,
            username,
            password,
            url,
            notes,
            created_at: parse_dt(&created_at),
            updated_at: parse_dt(&updated_at),
        }
    }
}

pub struct DbConnection {
    conn: Connection,
}

impl DbConnection {
    pub fn new(path: &str) -> Result<Self> {
        let conn = Connection::open(path)?;
        conn.execute_batch(SCHEMA)?;
        Ok(Self { conn })
    }

    pub fn create_password(&self, entry: &PasswordEntry) -> Result<PasswordEntry> {
        let now = Utc::now();
        let mut stmt = self.conn.prepare(
            "INSERT INTO passwords (title, username, password, url, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )?;
        
        let result = stmt.execute(params![
            &entry.title,
            &entry.username,
            &entry.password,
            &entry.url,
            &entry.notes,
            now.to_rfc3339(),
            now.to_rfc3339(),
        ])?;
        
        let id = result as i64;
        let mut new_entry = entry.clone();
        new_entry.id = Some(id);
        new_entry.created_at = now;
        new_entry.updated_at = now;
        
        Ok(new_entry)
    }

    pub fn get_password(&self, id: i64) -> Result<Option<PasswordEntry>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, title, username, password, url, notes, created_at, updated_at FROM passwords WHERE id = ?"
        )?;
        
        let parse_dt = |s: String| -> DateTime<Utc> {
            DateTime::parse_from_rfc3339(&s)
                .map(|dt: DateTime<FixedOffset>| dt.with_timezone(&Utc))
                .unwrap_or(Utc::now())
        };
        
        stmt.query_row(params![id], |row| {
            Ok(PasswordEntry {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                username: row.get(2)?,
                password: row.get(3)?,
                url: row.get(4)?,
                notes: row.get(5)?,
                created_at: parse_dt(row.get::<_, String>(6)?),
                updated_at: parse_dt(row.get::<_, String>(7)?),
            })
        }).optional()
    }

    pub fn get_all_passwords(&self) -> Result<Vec<PasswordEntry>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, title, username, password, url, notes, created_at, updated_at FROM passwords ORDER BY title ASC"
        )?;
        
        let parse_dt = |s: String| -> DateTime<Utc> {
            DateTime::parse_from_rfc3339(&s)
                .map(|dt: DateTime<FixedOffset>| dt.with_timezone(&Utc))
                .unwrap_or(Utc::now())
        };
        
        let rows = stmt.query_map(params![], |row| {
            Ok(PasswordEntry {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                username: row.get(2)?,
                password: row.get(3)?,
                url: row.get(4)?,
                notes: row.get(5)?,
                created_at: parse_dt(row.get::<_, String>(6)?),
                updated_at: parse_dt(row.get::<_, String>(7)?),
            })
        })?;
        
        rows.collect()
    }

    pub fn update_password(&self, id: i64, entry: &PasswordEntry) -> Result<PasswordEntry> {
        let now = Utc::now();
        let mut stmt = self.conn.prepare(
            "UPDATE passwords SET title = ?, username = ?, password = ?, url = ?, notes = ?, updated_at = ? WHERE id = ?"
        )?;
        
        stmt.execute(params![
            &entry.title,
            &entry.username,
            &entry.password,
            &entry.url,
            &entry.notes,
            now.to_rfc3339(),
            id,
        ])?;
        
        let mut updated_entry = entry.clone();
        updated_entry.id = Some(id);
        updated_entry.updated_at = now;
        
        Ok(updated_entry)
    }

    pub fn delete_password(&self, id: i64) -> Result<bool> {
        let mut stmt = self.conn.prepare("DELETE FROM passwords WHERE id = ?")?;
        let result = stmt.execute(params![id])?;
        Ok(result > 0)
    }

    pub fn search_passwords(&self, query: &str) -> Result<Vec<PasswordEntry>> {
        let search_pattern = format!("%{}%", query);
        let mut stmt = self.conn.prepare(
            "SELECT id, title, username, password, url, notes, created_at, updated_at FROM passwords WHERE title LIKE ? OR username LIKE ? OR url LIKE ? ORDER BY title ASC"
        )?;
        
        let parse_dt = |s: String| -> DateTime<Utc> {
            DateTime::parse_from_rfc3339(&s)
                .map(|dt: DateTime<FixedOffset>| dt.with_timezone(&Utc))
                .unwrap_or(Utc::now())
        };
        
        let rows = stmt.query_map(params![&search_pattern, &search_pattern, &search_pattern], |row| {
            Ok(PasswordEntry {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                username: row.get(2)?,
                password: row.get(3)?,
                url: row.get(4)?,
                notes: row.get(5)?,
                created_at: parse_dt(row.get::<_, String>(6)?),
                updated_at: parse_dt(row.get::<_, String>(7)?),
            })
        })?;
        
        rows.collect()
    }
}
