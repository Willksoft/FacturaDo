import os
import re

import_stmt = "import { DialogService } from '@/components/ui/CustomDialogProvider';\n"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'confirm(' not in content and 'window.confirm(' not in content:
        return
        
    if 'CustomDialogProvider.tsx' in filepath:
        return

    # Replace confirm( with await DialogService.confirm(
    new_content = re.sub(r'\b(window\.)?confirm\(', 'await DialogService.confirm(', content)
    
    # We must also make the enclosing functions async. 
    new_content = re.sub(r'onClick=\{\s*\(\)\s*=>\s*\{', 'onClick={async () => {', new_content)
    new_content = re.sub(r'onClick=\{\s*\((\w+)\)\s*=>\s*\{', r'onClick={async (\1) => {', new_content)
    
    # If content changed, we add the import if not present
    if new_content != content:
        if 'DialogService' not in new_content:
            # Find last import
            last_import = new_content.rfind('import ')
            if last_import != -1:
                end_of_line = new_content.find('\n', last_import)
                new_content = new_content[:end_of_line+1] + import_stmt + new_content[end_of_line+1:]
            else:
                new_content = import_stmt + new_content
                
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Refactored {filepath}')

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
