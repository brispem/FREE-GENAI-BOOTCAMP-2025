import pytest
from app import create_app
import os

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Setup test database before any tests run"""
    # Remove existing test database
    if os.path.exists('word_bank.db'):
        os.remove('word_bank.db')
    
    # Run migrations
    from migrate import run_migrations
    run_migrations()
    
    # Create Flask app
    app = create_app()
    return app 