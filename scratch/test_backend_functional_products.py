import requests

INSFORGE_URL = "https://zdwuav42.us-east.insforge.app/api/database/records/products?select=id,name,code,type,price,stock,min_stock&limit=10"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

headers = {
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json"
}

def test_backend_products_api_schema() -> None:
    res = requests.get(INSFORGE_URL, headers=headers, timeout=30)
    assert res.status_code == 200, f"Error en la API de productos: {res.status_code}"
    
    products = res.json()
    assert isinstance(products, list), "La respuesta debe ser una lista de productos"
    
    for p in products:
        assert "id" in p, "El producto no tiene 'id'"
        assert "type" in p, "El producto no tiene 'type'"

test_backend_products_api_schema()
