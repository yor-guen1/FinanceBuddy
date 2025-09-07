# MoneyMate Database Setup

## Prerequisites

1. **PostgreSQL** - Install PostgreSQL on your system
2. **Node.js** - Install Node.js (v16 or higher)

## Database Setup

### 1. Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 2. Create Database and User
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE moneymate;

-- Create user
CREATE USER moneymate_user WITH PASSWORD 'your_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE moneymate TO moneymate_user;

-- Exit psql
\q
```

### 3. Run Database Schema
```bash
# Navigate to project directory
cd "F:\AI-powered financial assistant app\FinanceBuddy"

# Run the schema file
psql -U moneymate_user -d moneymate -f database/schema.sql
```

## Backend API Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
DATABASE_URL=postgresql://moneymate_user:your_password@localhost:5432/moneymate
PORT=3000
```

### 3. Start API Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## Frontend Configuration

### 1. Add API URL to Expo Config
Add this to your `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000"
    }
  }
}
```

### 2. Update Environment Variables
Create `.env` file in project root:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Testing the Setup

### 1. Test Database Connection
```bash
# Test API health
curl http://localhost:3000/api/health
```

### 2. Test API Endpoints
```bash
# Get user data (replace with actual user ID)
curl http://localhost:3000/api/users/your-user-id

# Get transactions
curl "http://localhost:3000/api/transactions?userId=your-user-id"
```

## Usage

1. **Start the API server**: `cd backend && npm run dev`
2. **Start the Expo app**: `npx expo start`
3. **Scan receipts**: The AI will automatically save data to the database
4. **View data**: The frontend will fetch data from the API

## Troubleshooting

### Database Connection Issues
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database and user exist

### API Issues
- Check if port 3000 is available
- Verify all dependencies are installed
- Check console for error messages

### Frontend Issues
- Ensure API server is running
- Check network connectivity
- Verify API URL configuration

