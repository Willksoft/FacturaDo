import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

def test_invoices_schema_and_records():
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}"
    }
    r = requests.get(f"{BASE_URL}/api/database/records/invoices?select=id,invoice_number,type,total,status&limit=10", headers=headers)
    assert r.status_code == 200, f"Expected 200 from Invoices API, got {r.status_code}: {r.text}"
    data = r.json()
    assert isinstance(data, list), "Invoices records response must be a list"

test_invoices_schema_and_records()
