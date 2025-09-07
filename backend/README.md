# BudgetBuddy Backend

This is the backend API for the BudgetBuddy financial tracking application.

## 🚀 Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
```bash
# Create database (if it doesn't exist)
createdb moneymate

# Run database setup
npm run setup-db
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moneymate
PORT=3000
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Schema

The database includes the following tables:
- **users** - User accounts
- **categories** - Expense/income categories
- **transactions** - Financial transactions
- **receipts** - Receipt images and AI analysis
- **budget_goals** - Budget tracking goals

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - Get transactions with filters
- `POST /api/transactions` - Create new transaction

### Receipts
- `POST /api/receipts` - Save receipt with AI analysis
- `GET /api/receipts/:id/analysis` - Get AI analysis for receipt

### Budget Goals
- `GET /api/budget-goals/:userId` - Get budget goals
- `POST /api/budget-goals` - Create budget goal

### Users
- `GET /api/users/:userId` - Get user data with categories and transactions

## 🛠️ Development

### Database Reset
```bash
npm run reset-db
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## 📝 Notes

- The API uses PostgreSQL with JSONB for storing AI analysis data
- All timestamps are stored in UTC
- UUIDs are used for all primary keys
- The database includes default categories for immediate use
