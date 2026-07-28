import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

def test_insforge_auth_endpoint():
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "email": "willksoft+test2026@gmail.com",
        "password": "FacturaDo2026#Pass"
    }
    r = requests.post(f"{BASE_URL}/api/auth/sessions", json=payload, headers=headers)
    assert r.status_code == 200, f"Expected 200 from Auth Sessions, got {r.status_code}: {r.text}"
    data = r.json()
    assert "data" in data or "accessToken" in data or "user" in data, "Response missing auth token or user data"

test_insforge_auth_endpoint()
