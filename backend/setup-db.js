const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Use SQLite instead of PostgreSQL for easier setup
const dbPath = path.join(__dirname, 'moneymate.db');
const db = new sqlite3.Database(dbPath);

async function setupDatabase() {
    try {
        console.log('🚀 Setting up MoneyMate database...');

        // Read and execute schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            if (statement.trim()) {
                await pool.query(statement);
            }
        }

        console.log('✅ Database schema created successfully!');

        // Test the connection
        const result = await pool.query('SELECT COUNT(*) FROM categories');
        console.log(`📊 Found ${result.rows[0].count} default categories`);

        console.log('🎉 Database setup complete!');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };
