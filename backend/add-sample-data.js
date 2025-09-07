const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, 'moneymate.db');
const db = new sqlite3.Database(dbPath);

const userId = '550e8400-e29b-41d4-a716-446655440000';

// Sample transactions data
const sampleTransactions = [
    {
        id: 'txn-001',
        userId: userId,
        amount: 45.99,
        description: 'Grocery shopping at Whole Foods',
        categoryId: '1',
        type: 'expense',
        source: 'manual',
        merchant: 'Whole Foods Market',
        location: 'Downtown',
        transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
        id: 'txn-002',
        userId: userId,
        amount: 12.50,
        description: 'Coffee and pastry',
        categoryId: '2',
        type: 'expense',
        source: 'manual',
        merchant: 'Starbucks',
        location: 'Main Street',
        transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
        id: 'txn-003',
        userId: userId,
        amount: 89.99,
        description: 'Gas station fill-up',
        categoryId: '3',
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
        categoryId: '2',
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
        categoryId: '4',
        type: 'expense',
        source: 'manual',
        merchant: 'Pacific Gas & Electric',
        location: 'Online',
        transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
        id: 'txn-006',
        userId: userId,
        amount: 75.00,
        description: 'Netflix subscription',
        categoryId: '5',
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
        categoryId: '6',
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
        categoryId: '7',
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
        categoryId: '3',
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
        categoryId: '8',
        type: 'expense',
        source: 'manual',
        merchant: 'CVS Pharmacy',
        location: 'Main Street',
        transactionDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    }
];

// Sample receipts data
const sampleReceipts = [
    {
        id: 'receipt-001',
        userId: userId,
        transactionId: 'txn-001',
        imageUrl: 'https://example.com/receipts/grocery-receipt.jpg',
        rawText: 'WHOLE FOODS MARKET\n123 Main Street\nDowntown\n\nItems:\n- Organic Bananas: $3.99\n- Free Range Eggs: $4.99\n- Whole Grain Bread: $2.99\n- Organic Milk: $3.49\n- Fresh Vegetables: $8.99\n- Organic Chicken: $12.99\n- Various Items: $9.55\n\nSubtotal: $45.99\nTax: $3.68\nTotal: $49.67',
        aiAnalysis: JSON.stringify({
            merchant: 'Whole Foods Market',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            total: 45.99,
            items: [
                { name: 'Organic Bananas', price: 3.99, category: 'Groceries' },
                { name: 'Free Range Eggs', price: 4.99, category: 'Groceries' },
                { name: 'Whole Grain Bread', price: 2.99, category: 'Groceries' },
                { name: 'Organic Milk', price: 3.49, category: 'Groceries' },
                { name: 'Fresh Vegetables', price: 8.99, category: 'Groceries' },
                { name: 'Organic Chicken', price: 12.99, category: 'Groceries' }
            ],
            confidence: 0.95
        }),
        confidenceScore: 0.95,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'receipt-002',
        userId: userId,
        transactionId: 'txn-003',
        imageUrl: 'https://example.com/receipts/gas-receipt.jpg',
        rawText: 'SHELL\nHighway 101\n\nPump: 8\nGrade: Regular\nGallons: 12.5\nPrice per gallon: $3.199\n\nSubtotal: $39.99\nTax: $3.20\nTotal: $43.19\n\nThank you for choosing Shell!',
        aiAnalysis: JSON.stringify({
            merchant: 'Shell',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            total: 43.19,
            items: [
                { name: 'Regular Gasoline', price: 39.99, category: 'Transportation' }
            ],
            confidence: 0.98
        }),
        confidenceScore: 0.98,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Sample budget goals
const sampleBudgetGoals = [
    {
        id: 'budget-001',
        userId: userId,
        categoryId: '1',
        amount: 500.00,
        period: 'monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'budget-002',
        userId: userId,
        categoryId: '2',
        amount: 200.00,
        period: 'monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'budget-003',
        userId: userId,
        categoryId: '3',
        amount: 300.00,
        period: 'monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
];

async function addSampleData() {
    console.log('🚀 Adding sample data to the database...');

    try {
        // Add transactions
        console.log('📝 Adding sample transactions...');
        for (const transaction of sampleTransactions) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT OR REPLACE INTO transactions (id, user_id, amount, description, category_id, type, source, merchant, location, transaction_date, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                        new Date().toISOString()
                    ],
                    function (err) {
                        if (err) {
                            console.error('❌ Error inserting transaction:', err);
                            reject(err);
                        } else {
                            console.log(`✅ Transaction ${transaction.id} added`);
                            resolve(this);
                        }
                    }
                );
            });
        }

        // Add receipts
        console.log('🧾 Adding sample receipts...');
        for (const receipt of sampleReceipts) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT OR REPLACE INTO receipts (id, user_id, transaction_id, image_url, raw_text, ai_analysis, confidence_score, created_at) 
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
                            resolve(this);
                        }
                    }
                );
            });
        }

        // Add budget goals
        console.log('💰 Adding sample budget goals...');
        for (const goal of sampleBudgetGoals) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT OR REPLACE INTO budget_goals (id, user_id, category_id, amount, period, start_date, end_date, created_at) 
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
                            resolve(this);
                        }
                    }
                );
            });
        }

        console.log('✅ Sample data added successfully!');
        console.log(`📊 Added ${sampleTransactions.length} transactions`);
        console.log(`🧾 Added ${sampleReceipts.length} receipts`);
        console.log(`💰 Added ${sampleBudgetGoals.length} budget goals`);

    } catch (error) {
        console.error('❌ Error adding sample data:', error);
    } finally {
        db.close();
    }
}

addSampleData();
