import requests

INSFORGE_URL = "https://zdwuav42.us-east.insforge.app/api/database/records/providers?select=id,name,rnc,email&limit=10"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

headers = {
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json"
}

def test_backend_providers_api() -> None:
    res = requests.get(INSFORGE_URL, headers=headers, timeout=30)
    assert res.status_code == 200, f"Error en la API de proveedores: {res.status_code}"
    data = res.json()
    assert isinstance(data, list), "La respuesta debe ser una lista de proveedores"

test_backend_providers_api()
