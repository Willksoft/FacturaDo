import requests

TARGET_URL = "https://www.facturadord.com"

def test_health_check():
    r = requests.get(f"{TARGET_URL}/manifest.json")
    assert r.status_code == 200

def test_landing_status():
    r = requests.get(f"{TARGET_URL}/")
    assert r.status_code == 200

test_health_check()
test_landing_status()
