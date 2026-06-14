-- ==============================================================================
-- INSFORGE BACKEND ADVISOR FIXES
-- This script applies the 16 security and performance fixes flagged by the advisor.
-- ==============================================================================

-- ==============================================================================
-- SECURITY FIXES (RLS ENABLEMENT)
-- IMPORTANT: Enabling RLS without policies blocks all access. 
-- We include a basic policy allowing all authenticated users to read/write,
-- ensuring your app does not break after applying these fixes.
-- ==============================================================================

-- 1. ncf_sequences
ALTER TABLE public.ncf_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ncf_sequences FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.ncf_sequences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. providers
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.providers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. receipts
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. warehouses
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.warehouses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. financial_accounts
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.financial_accounts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. support_tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.support_tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. purchase_orders
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.purchase_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. template_settings
ALTER TABLE public.template_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_settings FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.template_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 13. shifts (Added dynamically previously)
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.shifts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 14. audit_logs (Added dynamically previously)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- PERFORMANCE FIXES (MISSING FOREIGN KEY INDICES)
-- Resolves the warning: "JOINs will require full table scans, and ON DELETE CASCADE will acquire a full table lock"
-- ==============================================================================

-- 13. products.provider_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_provider_id ON products(provider_id);

-- 14. invoices.client_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);

-- 15. receipts.invoice_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_receipts_invoice_id ON receipts(invoice_id);

-- 16. purchase_orders.provider_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_orders_provider_id ON purchase_orders(provider_id);
