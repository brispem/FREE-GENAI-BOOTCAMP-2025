# Testing Documentation

## Overview
This document tracks the testing implementation and results for the Language Portal backend.

## Test Coverage

### 1. Database Integrity Tests ✅
**File:** `tests/test_db_integrity.py`
- Verifies database structure
- Confirms test data exists
- Checks foreign key relationships
- Status: PASSING (as of Feb 10, 2024)

### 2. API Tests
**File:** `test_api.py`
- Tests study session creation
- Validates error handling
- Tests complete workflow
- Status: To be run

## Comprehensive Test Plan

### 1. Database Configuration Tests
1. **Database Connection Test** ✅
```python
def test_database_connection():
    """Verify database can be connected to and basic queries work"""
```

2. **Schema Validation Test** ✅
```python
def test_database_schema():
    """Verify all required tables exist with correct structure:
    - groups
    - study_activities
    - study_sessions
    - words
    - word_review_items
    """
```

### 2. Study Sessions Tests
3. **Session Creation Test** ✅
```python
def test_create_study_session():
    """Test POST /api/study-sessions with valid data"""
```

4. **Session Validation Test**
```python
def test_study_session_validation():
    """Test session creation with:
    - Missing fields
    - Invalid group_id
    - Invalid study_activity_id
    """
```

### 3. Integration Tests
5. **Complete Study Flow Test**
```python
def test_study_session_workflow():
    """Test complete workflow:
    1. Create study session
    2. Add word reviews
    3. Verify session data
    4. Reset session
    """
```

6. **Foreign Key Integrity Test**
```python
def test_foreign_key_integrity():
    """Verify foreign key relationships:
    - study_sessions -> groups
    - study_sessions -> study_activities
    - word_review_items -> study_sessions
    """
```

### 4. API Response Tests
7. **Response Format Test**
```python
def test_api_response_format():
    """Verify API responses match expected format:
    - Success responses (201 for creation)
    - Error responses (400, 404, 500)
    - JSON structure
    """
```

8. **CORS Configuration Test**
```python
def test_cors_headers():
    """Verify CORS headers are properly set for:
    - OPTIONS requests
    - Allowed origins
    - Allowed methods
    """
```

### 5. Data Integrity Tests
9. **Study Activity Validation Test**
```python
def test_study_activity_data():
    """Verify study activities:
    - Have required fields (name, url)
    - URLs are valid
    - Activities are accessible
    """
```

10. **Group Data Test**
```python
def test_group_data():
    """Verify group data:
    - Test group exists
    - Group has correct word count
    - Group relationships are valid
    """
```

## Implementation Status
- ✅ Tests 1-3 implemented and passing
- 🔄 Tests 4-10 to be implemented
- 📝 Additional test cases may be added based on requirements

## Running New Tests
```bash
# Run a specific test
python -m pytest tests/test_db_integrity.py::test_database_connection -v

# Run all tests with detailed output
python -m pytest -v
```

## How to Run Tests

1. **Setup:**
```bash
cd lang-portal/backend-flask
python -m pip install -r requirements.txt
```

2. **Start Server:**
```bash
python app.py
```

3. **Run Tests:**
```bash
# Database tests
python -m pytest tests/test_db_integrity.py -v

# API tests
python -m pytest test_api.py -v

# All tests
python -m pytest -v
```

## Test Results History

### February 10, 2024
- ✅ Database integrity tests passing
- Implemented initial test structure
- Verified database setup and relationships

## Next Steps
1. Run API tests
2. Add tests for:
   - Dashboard routes
   - Group management
   - Word management
   - Study activities

## Notes
- Tests require Flask server to be running
- Database (word_bank.db) should be initialized before testing
- All tests should be run from backend-flask directory 