import re

file_path = r"c:\Users\MANUEL GRAPHICS\Downloads\facturado\src\hooks\useInvoiceState.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add logActivity function inside useInvoiceState
log_activity_func = """
  // Audit Logs
  const logActivity = async (action: string, entity: string, entityId: string, details?: any) => {
    try {
      const { data: authData } = await insforge.auth.getCurrentUser();
      const currentUserId = authData?.user?.id || 'default';
      const userEmail = authData?.user?.email || 'admin@facturado.com';
      
      const logId = currentUserId + '_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
      const logRecord = {
        id: logId,
        action,
        entity,
        entity_id: entityId,
        details: details ? JSON.stringify(details) : null,
        user_id: currentUserId,
        user_name: userEmail,
        created_at: new Date().toISOString()
      };
      
      await insforge.database.from('audit_logs').insert([logRecord]);
    } catch (err) {
      console.error('Failed to write audit log', err);
    }
  };
"""

content = content.replace("  const addNotification =", log_activity_func + "\n  const addNotification =")

# 2. Add Realtime useEffect
realtime_effect = """
  // Realtime Sync Subscription
  useEffect(() => {
    const channel = insforge.database.channel('public-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        // Reload data safely if a major table changes
        console.log('Realtime change detected in', payload.table);
        if (['invoices', 'products', 'clients', 'receipts'].includes(payload.table)) {
           loadAllDataFromPostgres();
        }
      })
      .subscribe();

    return () => {
      insforge.database.removeChannel(channel);
    };
  }, []);
"""

content = content.replace("  // Keep local storage loading logic intact", realtime_effect + "\n  // Keep local storage loading logic intact")

# 3. Export logActivity
content = content.replace("loadAllDataFromPostgres,", "loadAllDataFromPostgres,\n    logActivity,")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added Realtime and Audit Logs successfully!")
