use rusqlite::{Connection, Result, params};
use std::path::PathBuf;

pub struct Storage {
    conn: Connection,
}

#[derive(Debug, Clone)]
pub struct MetricsCache {
    pub date: String,
    pub work_time_minutes: i32,
    pub computer_activity_minutes: i32,
    pub manual_time_minutes: i32,
    pub productive_minutes: i32,
    pub unproductive_minutes: i32,
    pub neutral_minutes: i32,
    pub last_sync: Option<String>,
}

impl Storage {
    pub fn new(app_dir: PathBuf) -> Result<Self> {
        let db_path = app_dir.join("metrics.db");
        let conn = Connection::open(db_path)?;
        
        // Initialize tables
        conn.execute(
            "CREATE TABLE IF NOT EXISTS metrics_cache (
                date TEXT PRIMARY KEY,
                work_time_minutes INTEGER DEFAULT 0,
                computer_activity_minutes INTEGER DEFAULT 0,
                manual_time_minutes INTEGER DEFAULT 0,
                productive_minutes INTEGER DEFAULT 0,
                unproductive_minutes INTEGER DEFAULT 0,
                neutral_minutes INTEGER DEFAULT 0,
                last_sync TEXT
            )",
            [],
        )?;

        ensure_manual_time_column(&conn)?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )",
            [],
        )?;

        Ok(Storage { conn })
    }

    pub fn get_setting(&self, key: &str) -> Option<String> {
        self.conn.query_row(
            "SELECT value FROM settings WHERE key = ?1",
            params![key],
            |row| row.get(0)
        ).ok()
    }

    pub fn set_setting(&self, key: &str, value: &str) -> Result<()> {
        self.conn.execute(
            "INSERT INTO settings (key, value) VALUES (?1, ?2)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            params![key, value],
        )?;
        Ok(())
    }

    pub fn delete_setting(&self, key: &str) -> Result<()> {
        self.conn.execute(
            "DELETE FROM settings WHERE key = ?1",
            params![key],
        )?;
        Ok(())
    }

    pub fn get_metrics_for_date(&self, date: &str) -> Result<Option<MetricsCache>> {
        let mut stmt = self.conn.prepare("SELECT date, work_time_minutes, computer_activity_minutes, manual_time_minutes, productive_minutes, unproductive_minutes, neutral_minutes, last_sync FROM metrics_cache WHERE date = ?1")?;
        
        let mut rows = stmt.query(params![date])?;
        if let Some(row) = rows.next()? {
            Ok(Some(MetricsCache {
                date: row.get(0)?,
                work_time_minutes: row.get(1)?,
                computer_activity_minutes: row.get(2)?,
                manual_time_minutes: row.get(3)?,
                productive_minutes: row.get(4)?,
                unproductive_minutes: row.get(5)?,
                neutral_minutes: row.get(6)?,
                last_sync: row.get(7)?,
            }))
        } else {
            Ok(None)
        }
    }

    pub fn update_metrics(&self, metrics: &MetricsCache) -> Result<()> {
        self.conn.execute(
            "INSERT INTO metrics_cache 
            (date, work_time_minutes, computer_activity_minutes, manual_time_minutes, productive_minutes, unproductive_minutes, neutral_minutes, last_sync) 
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
            ON CONFLICT(date) DO UPDATE SET 
                work_time_minutes = excluded.work_time_minutes,
                computer_activity_minutes = excluded.computer_activity_minutes,
                manual_time_minutes = excluded.manual_time_minutes,
                productive_minutes = excluded.productive_minutes,
                unproductive_minutes = excluded.unproductive_minutes,
                neutral_minutes = excluded.neutral_minutes,
                last_sync = excluded.last_sync",
            params![
                metrics.date,
                metrics.work_time_minutes,
                metrics.computer_activity_minutes,
                metrics.manual_time_minutes,
                metrics.productive_minutes,
                metrics.unproductive_minutes,
                metrics.neutral_minutes,
                metrics.last_sync,
            ],
        )?;
        Ok(())
    }

    pub fn clear_metrics_cache(&self) -> Result<()> {
        self.conn.execute("DELETE FROM metrics_cache", [])?;
        Ok(())
    }
}

fn ensure_manual_time_column(conn: &Connection) -> Result<()> {
    let mut stmt = conn.prepare("PRAGMA table_info(metrics_cache)")?;
    let columns = stmt
        .query_map([], |row| row.get::<_, String>(1))?
        .collect::<Result<Vec<String>, _>>()?;

    if !columns.iter().any(|name| name == "manual_time_minutes") {
        conn.execute(
            "ALTER TABLE metrics_cache ADD COLUMN manual_time_minutes INTEGER DEFAULT 0",
            [],
        )?;
    }

    Ok(())
}
