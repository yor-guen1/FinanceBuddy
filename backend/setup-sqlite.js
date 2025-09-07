const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use SQLite instead of PostgreSQL for easier setup
const dbPath = path.join(__dirname, 'moneymate.db');
const db = new sqlite3.Database(dbPath);

function setupDatabase() {
    return new Promise((resolve, reject) => {
        console.log('🚀 Setting up MoneyMate SQLite database...');

        // Create tables
        const createTables = `
            -- Users table
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            -- Categories table
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                name TEXT NOT NULL,
                icon TEXT,
                color TEXT,
                is_default BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            -- Transactions table
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                amount REAL NOT NULL,
                description TEXT NOT NULL,
                category_id TEXT,
                type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
                source TEXT NOT NULL,
                merchant TEXT,
                location TEXT,
                transaction_date DATE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            );

            -- Receipts table
            CREATE TABLE IF NOT EXISTS receipts (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                transaction_id TEXT NOT NULL,
                image_url TEXT NOT NULL,
                raw_text TEXT,
                ai_analysis TEXT,
                confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
            );

            -- Budget goals table
            CREATE TABLE IF NOT EXISTS budget_goals (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                category_id TEXT NOT NULL,
                amount REAL NOT NULL,
                period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            );
        `;

        db.exec(createTables, (err) => {
            if (err) {
                console.error('❌ Error creating tables:', err);
                reject(err);
                return;
            }

            console.log('✅ Tables created successfully');

            // Insert default categories
            const insertCategories = `
                INSERT OR IGNORE INTO categories (id, name, icon, color, is_default) VALUES
                ('food-dining', 'Food & Dining', '🍽️', '#FF6B6B', 1),
                ('transportation', 'Transportation', '🚗', '#4ECDC4', 1),
                ('groceries', 'Groceries', '🛒', '#45B7D1', 1),
                ('healthcare', 'Healthcare', '🏥', '#96CEB4', 1),
                ('entertainment', 'Entertainment', '🎬', '#FFEAA7', 1),
                ('bills-utilities', 'Bills & Utilities', '💡', '#DDA0DD', 1),
                ('shopping', 'Shopping', '🛍️', '#98D8C8', 1),
                ('other', 'Other', '📦', '#F7DC6F', 1);
            `;

            db.exec(insertCategories, (err) => {
                if (err) {
                    console.error('❌ Error inserting categories:', err);
                    reject(err);
                    return;
                }

                console.log('✅ Default categories inserted');
                console.log('🎉 SQLite database setup complete!');
                console.log(`📁 Database file: ${dbPath}`);
                resolve();
            });
        });
    });
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase()
        .then(() => {
            db.close();
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Database setup failed:', error);
            db.close();
            process.exit(1);
        });
}

module.exports = { setupDatabase };
