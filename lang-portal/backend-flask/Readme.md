# Language Portal Backend

## Project Structure
```
backend-flask/
├── routes/                 # API route handlers
│   ├── dashboard.py
│   ├── groups.py
│   ├── study_activities.py
│   ├── study_sessions.py
│   └── words.py
├── sql/
│   ├── migrations/        # Database migrations
│   │   ├── 001_create_tables.sql
│   │   └── 002_create_study_sessions.sql
│   └── setup/            # Initial schema setup
├── tests/                # Test files
│   └── test_db_integrity.py
├── app.py               # Main application file
├── migrate.py           # Database migration script
├── test_api.py         # API tests
└── requirements.txt     # Project dependencies
```

## Setting up the database

```sh
python migrate.py
```

This will:
- Create the word_bank.db (SQLite database)
- Run all migrations from sql/migrations/
- Set up initial test data

## Testing
For comprehensive testing documentation, see TESTING.md and IMPLEMENTATION_NOTES.md.

Quick start:
```bash
# Setup
python -m pip install -r requirements.txt
rm word_bank.db  # Clear existing database
python migrate.py

# Run tests
python app.py  # In one terminal
python -m pytest -v  # In another terminal
```

## API Endpoints

### Study Sessions
- POST /api/study-sessions
  - Create a new study session
  - Requires: group_id, study_activity_id
- POST /api/study-sessions/reset
  - Reset all study sessions

## Development

### Clearing the database
Delete word_bank.db to reset the database:
```sh
rm word_bank.db
python migrate.py
```

### Running the server
```sh
python app.py
```
The API will be available at http://localhost:5000
