"""
Automated API Verification Script for LPU Placement Intelligence Platform
Tests:
  1. GET  /api/health
  2. GET  /api/model-info
  3. POST /api/predict (Valid profile)
  4. POST /api/predict (Validation boundary checks)
"""

import sys
import json
import requests

BASE_URL = "http://127.0.0.1:5000"

def run_tests():
    print("=" * 65)
    print("   Running Automated Backend API Verification Tests   ")
    print("=" * 65)

    # Test 1: Health Check
    try:
        health_resp = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"[TEST 1] GET /api/health -> Status: {health_resp.status_code}")
        assert health_resp.status_code == 200, "Health check failed!"
        print(f"         Response: {health_resp.json()}")
    except requests.exceptions.ConnectionError:
        print("\n[ERROR]: Flask server is not running on http://127.0.0.1:5000")
        print("Please start the backend with: python app.py")
        sys.exit(1)

    # Test 2: Model Info
    info_resp = requests.get(f"{BASE_URL}/api/model-info", timeout=5)
    print(f"\n[TEST 2] GET /api/model-info -> Status: {info_resp.status_code}")
    assert info_resp.status_code == 200, "Model-info check failed!"
    info_data = info_resp.json()
    print(f"         Accuracy: {info_data['metrics']['accuracy'] * 100:.2f}% | ROC-AUC: {info_data['metrics']['roc_auc']:.4f}")

    # Test 3: Valid Student Prediction
    sample_student = {
        "cgpa": 7.8,
        "technical_score": 75,
        "aptitude_score": 68,
        "communication_score": 72,
        "coding_score": 70,
        "projects": 2,
        "internships": 1,
        "certifications": 2,
        "backlogs": 0,
    }
    pred_resp = requests.post(f"{BASE_URL}/api/predict", json=sample_student, timeout=5)
    print(f"\n[TEST 3] POST /api/predict (Valid Profile) -> Status: {pred_resp.status_code}")
    assert pred_resp.status_code == 200, "Prediction failed!"
    res = pred_resp.json()["data"]
    print(f"         Readiness Score:    {res['readiness_score']} / 100")
    print(f"         Readiness Category: {res['readiness_category']}")
    print(f"         Model Probability:  {res['model_probability']}")
    print(f"         Skill Gaps Found:   {len(res['skill_gaps'])}")
    print(f"         Recommendations:    {len(res['recommendations'])}")

    # Test 4: Validation Error Handling (e.g. CGPA > 10.0)
    bad_student = {
        "cgpa": 12.5,  # Invalid
        "technical_score": 75,
        "aptitude_score": 68,
        "communication_score": 72,
        "coding_score": 70,
        "projects": 2,
        "internships": 1,
        "certifications": 2,
        "backlogs": 0,
    }
    bad_resp = requests.post(f"{BASE_URL}/api/predict", json=bad_student, timeout=5)
    print(f"\n[TEST 4] POST /api/predict (Invalid CGPA) -> Status: {bad_resp.status_code}")
    assert bad_resp.status_code == 400, "Validation check failed to reject invalid CGPA!"
    print(f"         Expected Error Caught: {bad_resp.json()['message']}")

    print("\n" + "=" * 65)
    print("   ALL API TESTS PASSED! Backend is ready and fully functional!   ")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
