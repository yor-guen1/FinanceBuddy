const { Client } = require('pg');

// Database connection
const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database schema
async function initializeDB() {
    try {
        await client.connect();

        // Users table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Categories table
        await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(20),
        budget DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

        // Transactions table
        await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        category_id VARCHAR(255),
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        source VARCHAR(20) NOT NULL CHECK (source IN ('manual', 'receipt', 'bank')),
        merchant VARCHAR(255),
        location VARCHAR(255),
        transaction_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);

        // Insert default categories
        const defaultCategories = [
            { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', budget: 600 },
            { id: '2', name: 'Transportation', icon: '🚗', color: '#4ECDC4', budget: 400 },
            { id: '3', name: 'Entertainment', icon: '🎬', color: '#96CEB4', budget: 150 },
            { id: '4', name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7', budget: 1500 },
            { id: '5', name: 'Healthcare', icon: '🏥', color: '#DDA0DD', budget: 200 },
            { id: '6', name: 'Shopping', icon: '🛍️', color: '#45B7D1', budget: 300 },
            { id: '7', name: 'Education', icon: '📚', color: '#98D8C8', budget: 100 },
            { id: '8', name: 'Other', icon: '📦', color: '#F7DC6F', budget: 50 }
        ];

        for (const category of defaultCategories) {
            await client.query(`
        INSERT INTO categories (id, user_id, name, icon, color, budget) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [category.id, '550e8400-e29b-41d4-a716-446655440000', category.name, category.icon, category.color, category.budget]);
        }

        // Insert test user
        await client.query(`
      INSERT INTO users (id, name, email) 
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO NOTHING
    `, ['550e8400-e29b-41d4-a716-446655440000', 'Test User', 'test@budgetbuddy.com']);

        // Insert sample transactions
        const sampleTransactions = [
            {
                id: 'tx-1',
                user_id: '550e8400-e29b-41d4-a716-446655440000',
                amount: 12.50,
                description: 'Coffee and pastry',
                category_id: '1',
                type: 'expense',
                source: 'receipt',
                merchant: 'Starbucks',
                location: 'Downtown',
                transaction_date: '2024-01-15'
            },
            {
                id: 'tx-2',
                user_id: '550e8400-e29b-41d4-a716-446655440000',
                amount: 4500.00,
                description: 'Monthly Salary',
                category_id: null,
                type: 'income',
                source: 'bank',
                merchant: 'Tech Solutions Inc',
                transaction_date: '2024-01-01'
            }
        ];

        for (const tx of sampleTransactions) {
            await client.query(`
        INSERT INTO transactions 
        (id, user_id, amount, description, category_id, type, source, merchant, location, transaction_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING
      `, [tx.id, tx.user_id, tx.amount, tx.description, tx.category_id, tx.type, tx.source, tx.merchant, tx.location, tx.transaction_date]);
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { userId } = req.query;

    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }

    try {
        // Initialize database if not already done
        await initializeDB();

        // Get user
        const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get categories
        const categoriesResult = await client.query('SELECT * FROM categories WHERE user_id = $1', [userId]);
        const categories = categoriesResult.rows;

        // Get transactions
        const transactionsResult = await client.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC LIMIT 50', [userId]);
        const transactions = transactionsResult.rows;

        res.json({
            user,
            categories,
            transactions
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};