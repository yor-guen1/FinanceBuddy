-- BudgetBuddy Database Schema
-- This file contains the complete database schema for the BudgetBuddy application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    source VARCHAR(50) NOT NULL, -- 'manual', 'ai', 'bank', 'receipt'
    merchant VARCHAR(255),
    location VARCHAR(255),
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    raw_text TEXT,
    ai_analysis JSONB,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budget goals table
CREATE TABLE IF NOT EXISTS budget_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_transaction_id ON receipts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_budget_goals_user_id ON budget_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Insert default categories
INSERT INTO categories (id, name, icon, color, is_default) VALUES
    (uuid_generate_v4(), 'Food & Dining', '🍽️', '#FF6B6B', TRUE),
    (uuid_generate_v4(), 'Transportation', '🚗', '#4ECDC4', TRUE),
    (uuid_generate_v4(), 'Groceries', '🛒', '#45B7D1', TRUE),
    (uuid_generate_v4(), 'Healthcare', '🏥', '#96CEB4', TRUE),
    (uuid_generate_v4(), 'Entertainment', '🎬', '#FFEAA7', TRUE),
    (uuid_generate_v4(), 'Bills & Utilities', '💡', '#DDA0DD', TRUE),
    (uuid_generate_v4(), 'Shopping', '🛍️', '#98D8C8', TRUE),
    (uuid_generate_v4(), 'Other', '📦', '#F7DC6F', TRUE)
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_goals_updated_at BEFORE UPDATE ON budget_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
