# Fluency Spanish Learning Portal - Backend Documentation
Last Updated: March 2024

## What is This Backend?

This is the server-side component of Fluency that:
1. Manages the Spanish vocabulary database
2. Tracks learning progress
3. Handles study sessions
4. Serves data to the frontend

## Core Features

### 1. Vocabulary Management 📚
**What it handles:**
- Stores Spanish words with translations
- Manages word groups
- Tracks word metadata (gender, type, conjugation)
- Provides word search and filtering

**Key Endpoints:**
```python
GET /words
GET /groups
GET /groups/:id
```

### 2. Study Session Management 📊
**What it handles:**
- Creates new study sessions
- Tracks session progress
- Records correct/incorrect answers
- Maintains learning history

**Key Endpoints:**
```python
POST /study_sessions
POST /study_sessions/:id/review
```

### 3. Learning Activities Support 🎯
**What it handles:**
- Manages different learning activities
- Tracks activity completion
- Provides activity-specific data
- Records activity results

## Technical Details

### Database Schema

#### Words Table
```sql
CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spanish TEXT NOT NULL,           
    pronunciation TEXT,              
    english TEXT NOT NULL,           
    type TEXT NOT NULL,             
    gender TEXT,                    
    conjugation_group TEXT,         
    is_irregular BOOLEAN DEFAULT 0, 
    notes TEXT                      
);
```

#### Groups Table
```sql
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    words_count INTEGER DEFAULT 0
);
```

#### Study Sessions Table
```sql
CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    study_activity_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (study_activity_id) REFERENCES study_activities(id)
);
```

### API Routes

#### 1. Word Management
```python
@app.route('/words', methods=['GET'])
# Parameters:
# - page: int (default=1)
# - sort_by: str (spanish|english|type)
# - order: str (asc|desc)
```

#### 2. Group Management
```python
@app.route('/groups', methods=['GET'])
@app.route('/groups/<int:id>', methods=['GET'])
# Parameters:
# - page: int (default=1)
# - sort_by: str (name|words_count)
```

#### 3. Study Sessions
```python
@app.route('/study_sessions', methods=['POST'])
@app.route('/study_sessions/<int:id>/review', methods=['POST'])
```

## Testing

### Running Tests
```bash
# Setup test database
rm word_bank.db
python migrate.py

# Run all tests
python -m pytest -v

# Run specific test file
python -m pytest tests/test_api.py -v

# Generate coverage report
python -m pytest --cov=app tests/
```

### Test Categories

1. **Database Tests**
   - Table creation
   - Data integrity
   - Foreign key constraints
   - Index performance

2. **API Tests**
   - Endpoint responses
   - Parameter validation
   - Error handling
   - Data formatting

3. **Integration Tests**
   - Full workflows
   - Data relationships
   - Transaction handling

### Test Results

### Passing Tests (7/7):
1. ✅ test_create_study_session
2. ✅ test_study_sessions_workflow
3. ✅ test_api_response_format
4. ✅ test_cors_headers
5. ✅ test_study_activity_data
6. ✅ test_group_data
7. ✅ test_database_setup

### Test Infrastructure
All tests passing:
- Database integrity tests ✅
- API functionality tests ✅
- CORS configuration tests ✅
- Spanish data validation tests ✅

### Challenges & Solutions

#### 1. Database Connection Issues
**Problem**: Initial tests failed due to "no such table: groups"
**Solution**: 
- Created proper migration sequence
- Added automatic database initialization in tests
- Implemented test fixtures for consistent database state

#### 2. CORS Configuration
**Problem**: CORS headers weren't being properly set
**Solution**:
- Adjusted CORS configuration in app.py
- Fixed conflict between credentials and wildcard origins
- Updated tests to match actual header behavior

#### 3. Data Integrity
**Problem**: Missing word_groups table caused group queries to fail
**Solution**:
- Added word_groups table to migrations
- Implemented COALESCE for NULL handling
- Added proper foreign key constraints

#### 4. Test Reliability
**Problem**: Tests were dependent on database state
**Solution**:
- Created test fixtures
- Added automatic database cleanup
- Implemented proper test data seeding

## Setup & Installation

### Prerequisites
- Python 3.8+
- SQLite3
- pip (Python package manager)

### Initial Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Unix
venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database
python migrate.py
```

### Running the Server
```bash
python app.py
```

## Project Structure
```
backend-flask/
├── app.py                 # Main application file
├── migrate.py            # Database migrations
├── requirements.txt      # Dependencies
├── tests/               # Test files
│   ├── test_api.py
│   ├── test_database.py
│   └── test_models.py
└── models/              # Data models
    ├── word.py
    ├── group.py
    └── session.py
```

## Development Guidelines

### Adding New Features
1. Create database migrations
2. Implement model changes
3. Add API endpoints
4. Write tests
5. Update documentation

### Code Style
- Follow PEP 8
- Use type hints
- Document functions
- Handle errors gracefully

## Maintenance

### Database Maintenance
```bash
# Backup database
sqlite3 word_bank.db .dump > backup.sql

# Restore database
sqlite3 word_bank.db < backup.sql
```

## Next Steps

### Planned Features
1. Full text search
2. Batch operations
3. Performance optimization
4. Advanced analytics

### Future Improvements
1. Caching layer
2. Rate limiting
3. API versioning
4. Enhanced error reporting

## Notes
- Keep Python updated
- Regular database backups
- Monitor error logs
- Test all endpoints 