import pytest
import requests

BASE_URL = "http://localhost:5000/api"

def test_create_study_session():
    # Test successful creation
    response = requests.post(BASE_URL + "/study-sessions", 
                           json={"group_id": 1, "study_activity_id": 1})
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["group_id"] == 1
    assert data["study_activity_id"] == 1

    # Test missing required fields
    response = requests.post(f"{BASE_URL}/study-sessions", 
                           json={"group_id": 1})
    assert response.status_code == 400
    assert "required" in response.json()["error"].lower()

    # Test invalid group_id
    response = requests.post(f"{BASE_URL}/study-sessions", 
                           json={"group_id": 999, "study_activity_id": 1})
    assert response.status_code == 400
    assert "invalid group_id" in response.json()["error"].lower()

    # Test invalid study_activity_id
    response = requests.post(f"{BASE_URL}/study-sessions", 
                           json={"group_id": 1, "study_activity_id": 999})
    assert response.status_code == 400
    assert "invalid study_activity_id" in response.json()["error"].lower()

def test_study_sessions_workflow():
    # Create session
    response = requests.post(BASE_URL + "/study-sessions", 
                           json={"group_id": 1, "study_activity_id": 1})
    assert response.status_code == 201
    session_id = response.json()["id"]
    
    # Reset sessions
    response = requests.post(f"{BASE_URL}/study-sessions/reset")
    assert response.status_code == 200 