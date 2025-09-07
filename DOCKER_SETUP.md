# Docker Setup for FinanceBuddy (SQLite)

This Docker Compose setup provides SQLite database management tools for your FinanceBuddy application.

## Services Included

### 1. SQLite Backup Service
- **Container**: `financebuddy-sqlite-backup`
- **Purpose**: Creates automatic backups of your SQLite database
- **Backup Location**: Docker volume `sqlite_backup`

### 2. SQLite Web Admin Tool
- **Container**: `financebuddy-sqlite-admin`
- **Port**: 8080
- **Purpose**: Web-based SQLite database browser and management
- **Access**: http://localhost:8080

## Quick Start

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```

2. **View logs**:
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services**:
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes** (⚠️ This will delete all data):
   ```bash
   docker-compose down -v
   ```

## Database Access

### SQLite Database Details
- **File**: `backend/moneymate.db`
- **Type**: SQLite database file
- **Location**: Local file system

### SQLite Web Admin Interface
- **URL**: http://localhost:8080
- **Purpose**: Browse and manage your SQLite database
- **Features**: 
  - View tables and data
  - Run SQL queries
  - Export data
  - Database structure browser

## Database Schema

Your SQLite database (`backend/moneymate.db`) contains:
- Users table
- Categories table  
- Transactions table
- Receipts table
- Budget goals table

## Data Persistence

Data is persisted in:
- `sqlite_backup`: SQLite backup files
- `backend/moneymate.db`: Your main SQLite database file

## Environment Variables

Copy `docker.env` to `.env` and update the API keys:
```bash
cp docker.env .env
```

Then edit `.env` and add your actual API keys:
- `EXPO_PUBLIC_GEMINI_API_KEY`
- `EXPO_PUBLIC_OCR_API_KEY`

## Troubleshooting

### Database Access Issues
```bash
# Check if SQLite admin is running
docker-compose ps sqlite-admin

# Check SQLite admin logs
docker-compose logs sqlite-admin

# Access SQLite database directly
docker-compose exec sqlite-admin sqlite3 /data/moneymate.db
```

### Backup Issues
```bash
# Check backup service logs
docker-compose logs sqlite-backup

# List backup files
docker-compose exec sqlite-backup ls -la /backup/
```

### Reset Everything
```bash
# Stop services and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Development Workflow

1. **Start the SQLite management services**:
   ```bash
   docker-compose up -d
   ```

2. **Access SQLite web admin**:
   - Open http://localhost:8080
   - Browse your database tables and data

3. **Run your application normally**:
   - Your app uses `backend/moneymate.db` directly
   - No additional configuration needed

4. **Automatic backups**:
   - The backup service runs automatically
   - Backups are stored in Docker volume `sqlite_backup`

## Production Considerations

For production deployment:
1. Set up regular backup schedules
2. Monitor database file size
3. Consider SQLite performance limits
4. Set up proper file permissions
5. Use SQLite WAL mode for better concurrency