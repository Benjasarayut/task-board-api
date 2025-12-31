const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ตั้งค่า Path
const dbPath = path.join(__dirname, 'tasks.db');

// เชื่อมต่อแบบเดิม
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// สร้างตาราง
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'TODO',
        priority TEXT DEFAULT 'MEDIUM',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// 🔥 Wrapper: ตัวช่วยแปลงให้รองรับ await
const dbAsync = {
    all: (sql, params) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    get: (sql, params) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    run: (sql, params) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve(this); // คืนค่า this เพื่อให้ได้ lastID
            });
        });
    }
};

module.exports = dbAsync;
