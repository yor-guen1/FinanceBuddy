const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, 'moneymate.db');
const db = new sqlite3.Database(dbPath);

const userId = '550e8400-e29b-41d4-a716-446655440000';

console.log('🔄 Resetting database and populating with clean data...');

// Clean, realistic transactions for one user
const cleanTransactions = [
    {
        id: 'txn-001',
        userId: userId,
        amount: 12.50,
        description: 'Morning coffee and croissant',
        categoryId: 'food-dining',
        type: 'expense',
        source: 'manual',
        merchant: 'Starbucks',
        location: 'Downtown',
        transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
        id: 'txn-002',
        userId: userId,
        amount: 45.99,
        description: 'Weekly grocery shopping',
        categoryId: 'groceries',
        type: 'expense',
        source: 'manual',
        merchant: 'Whole Foods Market',
        location: 'Main Street',
        transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
        id: 'txn-003',
        userId: userId,
        amount: 89.50,
        description: 'Gas fill-up',
        categoryId: 'transportation',
        type: 'expense',
        source: 'manual',
        merchant: 'Shell',
        location: 'Highway 101',
        transactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
        id: 'txn-004',
        userId: userId,
        amount: 25.00,
        description: 'Lunch with colleagues',
        categoryId: 'food-dining',
        type: 'expense',
        source: 'manual',
        merchant: 'Chipotle',
        location: 'Office District',
        transactionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    },
    {
        id: 'txn-005',
        userId: userId,
        amount: 150.00,
        description: 'Electricity bill payment',
        categoryId: 'bills-utilities',
        type: 'expense',
        source: 'manual',
        merchant: 'Pacific Gas & Electric',
        location: 'Online',
        transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
        id: 'txn-006',
        userId: userId,
        amount: 15.99,
        description: 'Netflix subscription',
        categoryId: 'entertainment',
        type: 'expense',
        source: 'manual',
        merchant: 'Netflix',
        location: 'Online',
        transactionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    },
    {
        id: 'txn-007',
        userId: userId,
        amount: 200.00,
        description: 'Gym membership',
        categoryId: 'healthcare',
        type: 'expense',
        source: 'manual',
        merchant: 'FitLife Gym',
        location: 'Fitness Center',
        transactionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    {
        id: 'txn-008',
        userId: userId,
        amount: 3200.00,
        description: 'Monthly salary',
        categoryId: 'other',
        type: 'income',
        source: 'manual',
        merchant: 'TechCorp Inc',
        location: 'Direct Deposit',
        transactionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
    {
        id: 'txn-009',
        userId: userId,
        amount: 18.75,
        description: 'Uber ride to airport',
        categoryId: 'transportation',
        type: 'expense',
        source: 'manual',
        merchant: 'Uber',
        location: 'Mobile App',
        transactionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    },
    {
        id: 'txn-010',
        userId: userId,
        amount: 65.00,
        description: 'Pharmacy - prescription refill',
        categoryId: 'healthcare',
        type: 'expense',
        source: 'manual',
        merchant: 'CVS Pharmacy',
        location: 'Main Street',
        transactionDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    },
    {
        id: 'txn-011',
        userId: userId,
        amount: 85.00,
        description: 'Dinner at Italian restaurant',
        categoryId: 'food-dining',
        type: 'expense',
        source: 'receipt',
        merchant: 'Bella Vista',
        location: 'Little Italy',
        transactionDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago
    },
    {
        id: 'txn-012',
        userId: userId,
        amount: 120.00,
        description: 'Movie tickets and snacks',
        categoryId: 'entertainment',
        type: 'expense',
        source: 'manual',
        merchant: 'AMC Theater',
        location: 'Mall District',
        transactionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    }
];

// Clean receipts for the receipt-based transactions
const cleanReceipts = [
    {
        id: 'receipt-001',
        userId: userId,
        transactionId: 'txn-011',
        imageUrl: 'https://example.com/receipts/restaurant-receipt.jpg',
        rawText: 'BELLA VISTA RESTAURANT\n123 Little Italy St\nSan Francisco, CA\n\nOrder #12345\nDate: 8/27/2025\nTime: 7:30 PM\n\nPasta Carbonara        $18.50\nCaesar Salad          $12.00\nTiramisu              $8.50\nWine (2 glasses)      $24.00\n\nSubtotal:            $63.00\nTax (8.5%):          $5.36\nTip (20%):           $12.64\nTotal:               $81.00\n\nThank you for dining with us!',
        aiAnalysis: JSON.stringify({
            merchant: 'Bella Vista',
            date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
            total: 85.00,
            items: [
                { name: 'Pasta Carbonara', price: 18.50, category: 'Food & Dining' },
                { name: 'Caesar Salad', price: 12.00, category: 'Food & Dining' },
                { name: 'Tiramisu', price: 8.50, category: 'Food & Dining' },
                { name: 'Wine', price: 24.00, category: 'Food & Dining' }
            ],
            confidence: 0.95
        }),
        confidenceScore: 0.95,
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Clean budget goals
const cleanBudgetGoals = [
    {
        id: 'budget-001',
        userId: userId,
        categoryId: 'food-dining',
        amount: 400.00,
        period: 'monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'budget-002',
        userId: userId,
        categoryId: 'transportation',
        amount: 300.00,
        period: 'monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'budget-003',
        userId: userId,
        categoryId: 'groceries',
        amount: 200.00,
        period: 'monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
];

async function resetAndPopulate() {
    try {
        // Clear existing data
        console.log('🗑️ Clearing existing data...');

        // Clear transactions
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM transactions WHERE user_id = ?', [userId], (err) => {
                if (err) {
                    console.error('❌ Error clearing transactions:', err);
                    reject(err);
                } else {
                    console.log('✅ Transactions cleared');
                    resolve();
                }
            });
        });

        // Clear receipts
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM receipts WHERE user_id = ?', [userId], (err) => {
                if (err) {
                    console.error('❌ Error clearing receipts:', err);
                    reject(err);
                } else {
                    console.log('✅ Receipts cleared');
                    resolve();
                }
            });
        });

        // Clear budget goals
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM budget_goals WHERE user_id = ?', [userId], (err) => {
                if (err) {
                    console.error('❌ Error clearing budget goals:', err);
                    reject(err);
                } else {
                    console.log('✅ Budget goals cleared');
                    resolve();
                }
            });
        });

        // Clear user
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
                if (err) {
                    console.error('❌ Error clearing user:', err);
                    reject(err);
                } else {
                    console.log('✅ User cleared');
                    resolve();
                }
            });
        });

        // Insert clean user
        console.log('👤 Creating clean user...');
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (id, email, name, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?)`,
                [userId, 'john.doe@moneymate.com', 'John Doe', new Date().toISOString(), new Date().toISOString()],
                (err) => {
                    if (err) {
                        console.error('❌ Error creating user:', err);
                        reject(err);
                    } else {
                        console.log('✅ User created successfully');
                        resolve();
                    }
                }
            );
        });

        // Insert clean transactions
        console.log('💳 Adding clean transactions...');
        for (const transaction of cleanTransactions) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO transactions (id, user_id, amount, description, category_id, type, source, merchant, location, transaction_date, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        transaction.id,
                        transaction.userId,
                        transaction.amount,
                        transaction.description,
                        transaction.categoryId,
                        transaction.type,
                        transaction.source,
                        transaction.merchant,
                        transaction.location,
                        transaction.transactionDate,
                        new Date().toISOString(),
                        new Date().toISOString()
                    ],
                    function (err) {
                        if (err) {
                            console.error('❌ Error inserting transaction:', err);
                            reject(err);
                        } else {
                            console.log(`✅ Transaction ${transaction.id} added`);
                            resolve();
                        }
                    }
                );
            });
        }

        // Insert clean receipts
        console.log('🧾 Adding clean receipts...');
        for (const receipt of cleanReceipts) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO receipts (id, user_id, transaction_id, image_url, raw_text, ai_analysis, confidence_score, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        receipt.id,
                        receipt.userId,
                        receipt.transactionId,
                        receipt.imageUrl,
                        receipt.rawText,
                        receipt.aiAnalysis,
                        receipt.confidenceScore,
                        receipt.createdAt
                    ],
                    function (err) {
                        if (err) {
                            console.error('❌ Error inserting receipt:', err);
                            reject(err);
                        } else {
                            console.log(`✅ Receipt ${receipt.id} added`);
                            resolve();
                        }
                    }
                );
            });
        }

        // Insert clean budget goals
        console.log('💰 Adding clean budget goals...');
        for (const goal of cleanBudgetGoals) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO budget_goals (id, user_id, category_id, amount, period, start_date, end_date, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        goal.id,
                        goal.userId,
                        goal.categoryId,
                        goal.amount,
                        goal.period,
                        goal.startDate,
                        goal.endDate,
                        goal.createdAt
                    ],
                    function (err) {
                        if (err) {
                            console.error('❌ Error inserting budget goal:', err);
                            reject(err);
                        } else {
                            console.log(`✅ Budget goal ${goal.id} added`);
                            resolve();
                        }
                    }
                );
            });
        }

        console.log('✅ Database reset and populated successfully!');
        console.log(`📊 Added ${cleanTransactions.length} transactions`);
        console.log(`🧾 Added ${cleanReceipts.length} receipts`);
        console.log(`💰 Added ${cleanBudgetGoals.length} budget goals`);
        console.log(`👤 User: John Doe (${userId})`);

    } catch (error) {
        console.error('❌ Error resetting database:', error);
    } finally {
        db.close();
    }
}

resetAndPopulate();
