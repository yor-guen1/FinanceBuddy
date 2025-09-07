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
app.get('/api/transactions', (req, res) => {
    const { userId, startDate, endDate, categoryId, type } = req.query;

    let query = `
        SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
    `;
    const params = [userId];

    if (startDate) {
        query += ` AND t.transaction_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND t.transaction_date <= ?`;
        params.push(endDate);
    }

    if (categoryId) {
        query += ` AND t.category_id = ?`;
        params.push(categoryId);
    }

    if (type) {
        query += ` AND t.type = ?`;
        params.push(type);
    }

    query += ' ORDER BY t.transaction_date DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

// Add transaction
app.post('/api/transactions', (req, res) => {
    const { userId, amount, description, categoryId, type, source, merchant, location, transactionDate } = req.body;

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    db.run(`
        INSERT INTO transactions (id, user_id, amount, description, category_id, type, source, merchant, location, transaction_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, userId, amount, description, categoryId, type, source, merchant, location, transactionDate], function (err) {
        if (err) {
            console.error('Error creating transaction:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return the created transaction
        db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, transaction) => {
            if (err) {
                console.error('Error fetching created transaction:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json(transaction);
        });
    });
});

// Add receipt with AI analysis
app.post('/api/receipts', (req, res) => {
    const { userId, transactionId, imageUrl, rawText, aiAnalysis, confidenceScore } = req.body;

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    db.run(`
        INSERT INTO receipts (id, user_id, transaction_id, image_url, raw_text, ai_analysis, confidence_score)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, userId, transactionId, imageUrl, rawText, JSON.stringify(aiAnalysis), confidenceScore], function (err) {
        if (err) {
            console.error('Error creating receipt:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return the created receipt
        db.get('SELECT * FROM receipts WHERE id = ?', [id], (err, receipt) => {
            if (err) {
                console.error('Error fetching created receipt:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json(receipt);
        });
    });
});

// Get AI analysis for receipt
app.get('/api/receipts/:receiptId/analysis', (req, res) => {
    const { receiptId } = req.params;

    db.get(`
        SELECT ai_analysis, confidence_score, raw_text
        FROM receipts
        WHERE id = ?
    `, [receiptId], (err, row) => {
        if (err) {
            console.error('Error fetching receipt analysis:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Receipt not found' });
        }

        res.json(row);
    });
});

// Get budget goals
app.get('/api/budget-goals/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(`
        SELECT bg.*, c.name as category_name, c.icon as category_icon, c.color as category_color
        FROM budget_goals bg
        LEFT JOIN categories c ON bg.category_id = c.id
        WHERE bg.user_id = ?
        ORDER BY bg.created_at DESC
    `, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching budget goals:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

// Add budget goal
app.post('/api/budget-goals', (req, res) => {
    const { userId, categoryId, amount, period, startDate, endDate } = req.body;

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    db.run(`
        INSERT INTO budget_goals (id, user_id, category_id, amount, period, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, userId, categoryId, amount, period, startDate, endDate], function (err) {
        if (err) {
            console.error('Error creating budget goal:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return the created budget goal
        db.get('SELECT * FROM budget_goals WHERE id = ?', [id], (err, budgetGoal) => {
            if (err) {
                console.error('Error fetching created budget goal:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json(budgetGoal);
        });
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`MoneyMate API server running on port ${port}`);
    console.log(`Local access: http://localhost:${port}`);
    console.log(`Network access: http://10.1.52.240:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
});
