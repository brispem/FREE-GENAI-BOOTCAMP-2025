import pytest
import requests

BASE_URL = "http://localhost:5000/api"

def test_api_response_format():
    """Test 7: Response Format Test"""
    # Test successful creation
    response = requests.post(BASE_URL + "/study-sessions",
                           json={"group_id": 1, "study_activity_id": 1})
    assert response.status_code == 201
    data = response.json()
    
    # Verify JSON structure
    assert "id" in data
    assert "group_id" in data
    assert "study_activity_id" in data
    
    # Test error response
    response = requests.post(BASE_URL + "/study-sessions", json={})
    assert response.status_code == 400
    assert "error" in response.json()

def test_cors_headers():
    """Test 8: CORS Configuration Test"""
    response = requests.options(BASE_URL + "/study-sessions")
    headers = response.headers

    # Check for the headers we actually have
    assert "Access-Control-Allow-Origin" in headers
    assert "Allow" in headers  # This contains the methods
    allowed_methods = headers["Allow"]
    assert "GET" in allowed_methods
    assert "POST" in allowed_methods
    assert "OPTIONS" in allowed_methods

def test_study_activity_data():
    """Test 9: Study Activity Validation"""
    response = requests.get(BASE_URL + "/study-activities")
    assert response.status_code == 200
    data = response.json()
    
    # Check first activity
    activity = data[0]
    assert "name" in activity
    assert "url" in activity
    assert activity["name"] == "Tarjetas de Memoria"

def test_group_data():
    """Test 10: Group Data Test"""
    response = requests.get(BASE_URL + "/groups")
    assert response.status_code == 200
    data = response.json()
    
    # Check test group
    group = data[0]
    assert group["name"] == "Verbos Básicos"
    assert "words_count" in group 