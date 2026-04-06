const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_PATH = path.join(__dirname, '../bloodbank.sqlite');
const SCHEMA_PATH = path.join(__dirname, '../../database/sqlite_schema.sql');
const SEED_PATH = path.join(__dirname, '../../database/sqlite_seed.sql');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ SQLite connection failed:', err.message);
    } else {
        console.log('✅ Connected to SQLite database (bloodbank.sqlite)');
        initializeDatabase();
    }
});

// Helper to run SQL scripts (handles multiple statements)
function runScript(filePath) {
    return new Promise((resolve, reject) => {
        const script = fs.readFileSync(filePath, 'utf8');
        // Split by semicolon but watch out for triggers/functions (not present here)
        const statements = script.split(';').map(s => s.trim()).filter(s => s.length > 0);
        
        db.serialize(() => {
            statements.forEach((stmt) => {
                db.run(stmt, (err) => {
                    if (err) {
                        // Ignore "Database already exists" type errors from DROP/CREATE
                        if (!err.message.includes('already exists') && !err.message.includes('no such table')) {
                            console.warn('⚠️ SQL Warning:', err.message, '| Statement:', stmt);
                        }
                    }
                });
            });
            resolve();
        });
    });
}

async function initializeDatabase() {
    if (fs.existsSync(DB_PATH) && fs.statSync(DB_PATH).size > 0) {
        // Database already exists and has data, skip seeding
        return;
    }
    console.log('🚀 Initializing fresh SQLite database...');
    try {
        await runScript(SCHEMA_PATH);
        await runScript(SEED_PATH);
        console.log('✨ Database schema and seed data loaded successfully.');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    }
}

// MySQL-like execute wrapper for compatibility
const dbInterface = {
    execute: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            // Convert MySQL '?' syntax to SQLite '?' (they are the same)
            // But MySQL execute returns [rows, fields], SQLite all returns rows
            const isQuery = sql.trim().toUpperCase().startsWith('SELECT');
            
            if (isQuery) {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve([rows, null]); // fields is null for SQLite
                });
            } else {
                db.run(sql, params, function(err) {
                    if (err) reject(err);
                    else resolve([{ insertId: this.lastID, affectedRows: this.changes }, null]);
                });
            }
        });
    }
};

// Alias query to execute for compatibility with some routes
dbInterface.query = dbInterface.execute;

module.exports = dbInterface;
