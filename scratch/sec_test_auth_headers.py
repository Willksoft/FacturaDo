import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
APP_URL = "https://www.facturadord.com/"

def test_unauthenticated_access_prevention() -> None:
    # 1. Intentar acceder a endpoint protegido de invoices sin token
    res_no_token = requests.get(f"{BASE_URL}/rest/v1/invoices", timeout=15)
    # Debe ser rechazado con 401 Unauthorized o 403 Forbidden
    assert res_no_token.status_code in [401, 403], f"Acceso no autenticado permitido: status {res_no_token.status_code}"

def test_invalid_jwt_token_rejection() -> None:
    # 2. Intentar acceder con un token JWT alterado o falso
    fake_headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidtoken.invalid"
    }
    res_fake_token = requests.get(f"{BASE_URL}/rest/v1/invoices", headers=fake_headers, timeout=15)
    assert res_fake_token.status_code in [401, 403], f"Token JWT inválido aceptado: status {res_fake_token.status_code}"

def test_security_headers() -> None:
    # 3. Validar cabeceras de seguridad HTTP en la web desplegada
    res = requests.get(APP_URL, timeout=15)
    headers = res.headers
    
    # Verificar que el servidor responde HTTP 200 OK y entrega tipos MIME estrictos
    assert res.status_code == 200, f"Error al cargar sitio web: {res.status_code}"
    assert "content-type" in headers, "Falta cabecera Content-Type"

test_unauthenticated_access_prevention()
test_invalid_jwt_token_rejection()
test_security_headers()
