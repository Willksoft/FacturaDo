import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json"
}

def test_insforge_rest_api_endpoints() -> None:
    # 1. Test Invoices REST API
    res_inv = requests.get(f"{BASE_URL}/rest/v1/invoices?select=id,invoice_number,type&limit=5", headers=headers, timeout=30)
    assert res_inv.status_code == 200, f"Invoices API returned {res_inv.status_code}"

    # 2. Test Products REST API
    res_prod = requests.get(f"{BASE_URL}/rest/v1/products?select=id,name,type,stock&limit=5", headers=headers, timeout=30)
    assert res_prod.status_code == 200, f"Products API returned {res_prod.status_code}"

    # 3. Test Clients REST API
    res_cli = requests.get(f"{BASE_URL}/rest/v1/clients?select=id,name,rnc_or_cedula&limit=5", headers=headers, timeout=30)
    assert res_cli.status_code == 200, f"Clients API returned {res_cli.status_code}"

    # 4. Test NCF Sequences REST API
    res_ncf = requests.get(f"{BASE_URL}/rest/v1/ncf_sequences?select=type,prefix,current_sequence&limit=5", headers=headers, timeout=30)
    assert res_ncf.status_code == 200, f"NCF Sequences API returned {res_ncf.status_code}"

test_insforge_rest_api_endpoints()
