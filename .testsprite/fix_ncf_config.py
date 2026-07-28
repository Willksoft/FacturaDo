import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

def test_ncf_configuration():
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}"
    }
    r = requests.get(f"{BASE_URL}/api/database/records/ncf_sequences?select=*&limit=5", headers=headers)
    assert r.status_code == 200, f"Expected 200 from NCF config API, got {r.status_code}: {r.text}"
    data = r.json()
    assert isinstance(data, list), "NCF configuration response must be a list"

test_ncf_configuration()
