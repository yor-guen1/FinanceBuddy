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

        // Receipts table
        await client.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        transaction_id VARCHAR(255),
        image_url TEXT NOT NULL,
        ai_analysis TEXT,
        confidence_score DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (transaction_id) REFERENCES transactions (id)
      )
    `);

        console.log('Receipts table initialized successfully');
    } catch (error) {
        console.error('Error initializing receipts table:', error);
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

    try {
        // Initialize database if not already done
        await initializeDB();

        if (req.method === 'POST') {
            // Create new receipt
            const { userId, transactionId, imageUrl, aiAnalysis, confidenceScore } = req.body;

            if (!userId || !imageUrl) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

            const result = await client.query(`
        INSERT INTO receipts (id, user_id, transaction_id, image_url, ai_analysis, confidence_score)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [id, userId, transactionId, imageUrl, JSON.stringify(aiAnalysis), confidenceScore]);

            res.status(201).json(result.rows[0]);
        } else if (req.method === 'GET') {
            // Get receipts
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const result = await client.query('SELECT * FROM receipts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            res.json(result.rows);
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
