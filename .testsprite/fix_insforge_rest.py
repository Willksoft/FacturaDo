import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

def test_insforge_rest_endpoints():
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}"
    }
    tables = ["clients", "providers", "invoices", "products", "receipts"]
    for table in tables:
        r = requests.get(f"{BASE_URL}/api/database/records/{table}?limit=1", headers=headers)
        assert r.status_code == 200, f"Expected 200 from {table} REST endpoint, got {r.status_code}: {r.text}"

test_insforge_rest_endpoints()
