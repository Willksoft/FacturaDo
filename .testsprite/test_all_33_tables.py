import requests

BASE_URL = "https://zdwuav42.us-east.insforge.app"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json"
}

tables = [
    "audit_logs", "auth_challenges", "bank_transactions", "budget_audit_logs",
    "budget_global_variables", "budget_projects", "budget_resources", "budget_settings",
    "budget_templates", "budgets", "clients", "expense_payments", "expenses",
    "financial_accounts", "inventory_movements", "invoices", "ncf_sequences",
    "passkeys", "payroll_details", "payroll_documents", "payroll_employees",
    "payroll_periods", "payroll_rules", "products", "providers",
    "purchase_order_payments", "purchase_orders", "receipts", "sellers",
    "shifts", "support_tickets", "template_settings", "warehouses"
]

def test_all_33_tables_coverage():
    for table in tables:
        r = requests.get(f"{BASE_URL}/api/database/records/{table}?limit=1", headers=headers)
        print(f"Table '{table}': status {r.status_code}")
        assert r.status_code == 200, f"Table {table} failed with status {r.status_code}: {r.text}"

test_all_33_tables_coverage()
