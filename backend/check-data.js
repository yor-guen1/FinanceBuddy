const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, 'moneymate.db');
const db = new sqlite3.Database(dbPath);

const userId = '550e8400-e29b-41d4-a716-446655440000';

console.log('🔍 Checking database data...\n');

// Check transactions
db.all('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?', [userId], (err, rows) => {
  if (err) {
    console.error('❌ Error checking transactions:', err);
  } else {
    console.log(`📝 Transactions for user: ${rows[0].count}`);
  }
});

// Check categories
db.all('SELECT COUNT(*) as count FROM categories', (err, rows) => {
  if (err) {
    console.error('❌ Error checking categories:', err);
  } else {
    console.log(`📂 Total categories: ${rows[0].count}`);
  }
});

// Check budget goals
db.all('SELECT COUNT(*) as count FROM budget_goals WHERE user_id = ?', [userId], (err, rows) => {
  if (err) {
    console.error('❌ Error checking budget goals:', err);
  } else {
    console.log(`💰 Budget goals for user: ${rows[0].count}`);
  }
});

// Check receipts
db.all('SELECT COUNT(*) as count FROM receipts WHERE user_id = ?', [userId], (err, rows) => {
  if (err) {
    console.error('❌ Error checking receipts:', err);
  } else {
    console.log(`🧾 Receipts for user: ${rows[0].count}`);
  }
});

// Show sample transactions
db.all('SELECT id, description, amount, type, merchant FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC LIMIT 5', [userId], (err, rows) => {
  if (err) {
    console.error('❌ Error fetching sample transactions:', err);
  } else {
    console.log('\n📋 Sample transactions:');
    rows.forEach(row => {
      console.log(`  - ${row.description}: $${row.amount} (${row.type})`);
    });
  }
  
  // Close database connection
  db.close();
});
