import re

file_path = r"c:\Users\MANUEL GRAPHICS\Downloads\facturado\schema.sql"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

rls_policies = """
-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE ncf_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Default permissive policies for authenticated usage (MVP Phase)
-- Can be restricted later by replacing 'true' with 'auth.uid() = user_id'
CREATE POLICY "Permit all authenticated read access" ON ncf_sequences FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON ncf_sequences FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON clients FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON providers FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON providers FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON products FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON products FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON invoices FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON receipts FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON receipts FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON warehouses FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON warehouses FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON financial_accounts FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON financial_accounts FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON purchase_orders FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON purchase_orders FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON template_settings FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON template_settings FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON support_tickets FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON expenses FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON shifts FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON shifts FOR ALL USING (true);

CREATE POLICY "Permit all authenticated read access" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Permit all authenticated write access" ON audit_logs FOR ALL USING (true);
"""

if "ENABLE ROW LEVEL SECURITY" not in content:
    content += "\n" + rls_policies
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added RLS to schema.sql")
else:
    print("RLS already added")
