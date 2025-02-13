import pytest
from app import create_app

def test_database_setup(setup_test_db):
    """Test database setup and initial data"""
    app = setup_test_db
    with app.app_context():
        cursor = app.db.cursor()
        
        # Test groups table
        cursor.execute("SELECT * FROM groups WHERE id = 1")
        group = cursor.fetchone()
        assert group is not None, "Test group not found"
        assert group['name'] == 'Verbos Básicos'
        
        # Test study_activities table
        cursor.execute("SELECT * FROM study_activities WHERE id = 1")
        activity = cursor.fetchone()
        assert activity is not None, "Test activity not found"
        assert activity['name'] == 'Tarjetas de Memoria'
        
        # Test foreign key constraints
        cursor.execute("PRAGMA foreign_key_check")
        fk_violations = cursor.fetchall()
        assert len(fk_violations) == 0, "Foreign key violations found" 