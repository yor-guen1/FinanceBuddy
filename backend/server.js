const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (SQLite)
const dbPath = path.join(__dirname, 'moneymate.db');
const db = new sqlite3.Database(dbPath);

console.log('Connected to SQLite database');

// Routes

// Get user data (profile, categories, recent transactions)
app.get('/api/users/:userId', (req, res) => {
    const { userId } = req.params;

    // Get user profile
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user categories
        db.all('SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY name', [userId], (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Get recent transactions (last 30 days)
            db.all(`
                SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
                FROM transactions t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?
                AND t.transaction_date >= date('now', '-30 days')
                ORDER BY t.transaction_date DESC
                LIMIT 50
            `, [userId], (err, transactions) => {
                if (err) {
                    console.error('Error fetching transactions:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.json({
                    user,
                    categories,
                    transactions
                });
            });
        });
    });
});

// Get transactions with filters
app.get('/api/transactions', async (req, res) => {
    try {
        const { userId, startDate, endDate, categoryId, type } = req.query;

        let query = `
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
        const params = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            query += ` AND t.transaction_date >= $${paramCount}`;
            params.push(startDate);
        }

        if (endDate) {
            paramCount++;
            query += ` AND t.transaction_date <= $${paramCount}`;
            params.push(endDate);
        }

        if (categoryId) {
            paramCount++;
            query += ` AND t.category_id = $${paramCount}`;
            params.push(categoryId);
        }

        if (type) {
            paramCount++;
            query += ` AND t.type = $${paramCount}`;
            params.push(type);
        }

        query += ' ORDER BY t.transaction_date DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { userId, amount, description, categoryId, type, source, merchant, location, transactionDate } = req.body;

        const result = await pool.query(`
      INSERT INTO transactions (user_id, amount, description, category_id, type, source, merchant, location, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [userId, amount, description, categoryId, type, source, merchant, location, transactionDate]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add receipt with AI analysis
app.post('/api/receipts', async (req, res) => {
    try {
        const { userId, transactionId, imageUrl, rawText, aiAnalysis, confidenceScore } = req.body;

        const result = await pool.query(`
      INSERT INTO receipts (user_id, transaction_id, image_url, raw_text, ai_analysis, confidence_score)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [userId, transactionId, imageUrl, rawText, JSON.stringify(aiAnalysis), confidenceScore]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating receipt:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get AI analysis for receipt
app.get('/api/receipts/:receiptId/analysis', async (req, res) => {
    try {
        const { receiptId } = req.params;

        const result = await pool.query(`
      SELECT ai_analysis, confidence_score, raw_text
      FROM receipts
      WHERE id = $1
    `, [receiptId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Receipt not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching receipt analysis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get budget goals
app.get('/api/budget-goals/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(`
      SELECT bg.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM budget_goals bg
      LEFT JOIN categories c ON bg.category_id = c.id
      WHERE bg.user_id = $1
      ORDER BY bg.created_at DESC
    `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching budget goals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add budget goal
app.post('/api/budget-goals', async (req, res) => {
    try {
        const { userId, categoryId, amount, period, startDate, endDate } = req.body;

        const result = await pool.query(`
      INSERT INTO budget_goals (user_id, category_id, amount, period, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [userId, categoryId, amount, period, startDate, endDate]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating budget goal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`MoneyMate API server running on port ${port}`);
    console.log(`Access from mobile: http://10.1.52.240:${port}`);
});

