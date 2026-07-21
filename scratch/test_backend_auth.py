import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json"
}

def test_insforge_auth_api() -> None:
    # 1. Test Login endpoint response structure for test account
    payload = {
        "email": "willksoft+test2026@gmail.com",
        "password": "FacturaDo2026#Pass"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=payload, headers=headers, timeout=30)
    assert response.status_code == 200, f"Expected 200 from Auth Login, got {response.status_code}: {response.text}"

    data = response.json()
    assert "accessToken" in data or "user" in data, "Auth login response missing accessToken/user keys"

test_insforge_auth_api()
