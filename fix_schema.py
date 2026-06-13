import re

file_path = r"c:\Users\MANUEL GRAPHICS\Downloads\facturado\schema.sql"

with open(file_path, "rb") as f:
    content = f.read().decode('utf-8', errors='ignore')

# Remove the weird UTF-16 appended text
content = re.sub(r'C R E A T E.*?$', '', content, flags=re.DOTALL)

# Append clean UTF-8
audit_table = """
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  user_id TEXT,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
"""

if "audit_logs" not in content:
    content += audit_table

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed schema.sql")
